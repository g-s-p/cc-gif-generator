"use client"

import { useEffect, useRef } from "react"

type Props = {
  /** When false, animation stops and a static icon is shown */
  running?: boolean
  /** Canvas size in px (favicons are typically 16–32) */
  size?: number
  /** Spinner characters; will loop fwd + reverse like your UI */
  spinnerChars?: string[]
  /** Frame delay (ms). 100–150 feels good */
  frameDelay?: number
  /** Base & highlight colors */
  baseOrange?: string
  lightOrange?: string
  /** Half-width (px) of the light band; band width ≈ 2× this */
  bandPx?: number
}

export default function AnimatedFavicon({
  running = true,
  size = 32,
  spinnerChars = (
    typeof navigator !== "undefined" && navigator.platform?.includes("Mac")
      ? ["·", "✢", "✳", "∗", "✻", "✽"]
      : ["·", "✢", "*", "∗", "✻", "✽"]
  ),
  frameDelay = 120,
  baseOrange = "#d77757",
  lightOrange = "#f59575",
  bandPx = 5, // try 6–8 if you want it bolder on 32px
}: Props) {
  const timerRef = useRef<number | null>(null)
  const idxRef = useRef(0)

  useEffect(() => {
    // respect reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // ensure <link rel="icon" id="animated-favicon"> exists
    let link = document.querySelector<HTMLLinkElement>("link#animated-favicon[rel='icon']")
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      link.id = "animated-favicon"
      link.type = "image/png"
      document.head.appendChild(link)
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = size
    canvas.height = size

    const sequence = [...spinnerChars, ...spinnerChars.slice().reverse()]
    const sweepFrames = sequence.length // one sheen sweep per symbol loop

    const setIcon = (dataUrl: string) => {
      if (link) link.href = dataUrl
    }

    const drawFrame = (frame: number) => {
      const w = canvas.width
      const h = canvas.height
      const centerY = Math.round(h / 2)

      // clear (transparent background)
      ctx.clearRect(0, 0, w, h)

      // text
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = `${Math.round(size * 0.7)}px monospace` // ~22px at 32px
      const char = sequence[frame % sequence.length]

      // ping-pong sheen: RIGHT→LEFT first, then LEFT→RIGHT
      const segment = Math.floor(frame / sweepFrames) % 2 // 0: RL, 1: LR
      const local = frame % sweepFrames
      const s = sweepFrames > 1 ? local / (sweepFrames - 1) : 0

      const startPos = 1.15 * w
      const endPos = -0.15 * w
      const center =
        segment === 0
          ? startPos + (endPos - startPos) * s // RL
          : endPos + (startPos - endPos) * s // LR

      // safe gradient stops (0..1 and non-decreasing)
      const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
      let l = clamp01((center - bandPx) / w)
      let m = clamp01(center / w)
      let r = clamp01((center + bandPx) / w)
      if (m < l) m = l
      if (r < m) r = m

      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, baseOrange)
      grad.addColorStop(l, baseOrange)
      grad.addColorStop(m, lightOrange)
      grad.addColorStop(r, baseOrange)
      grad.addColorStop(1, baseOrange)

      ctx.fillStyle = grad
      ctx.fillText(char, Math.round(w / 2), centerY)

      setIcon(canvas.toDataURL("image/png"))
    }

    // static icon (when paused or reduced motion)
    const drawStatic = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = `${Math.round(size * 0.7)}px monospace`
      ctx.fillStyle = baseOrange
      const char = spinnerChars[0]
      ctx.fillText(char, Math.round(w / 2), Math.round(h / 2))
      setIcon(canvas.toDataURL("image/png"))
    }

    if (!running || prefersReduced) {
      drawStatic()
      return () => {}
    }

    // animate
    idxRef.current = 0
    drawFrame(idxRef.current)
    timerRef.current = window.setInterval(() => {
      idxRef.current += 1
      drawFrame(idxRef.current)
    }, frameDelay)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [running, size, spinnerChars, frameDelay, baseOrange, lightOrange, bandPx])

  return null
}
