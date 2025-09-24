"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import AnimatedFavicon from "@/components/AnimatedFavicon"

// Spinner characters
const spinnerChars = ["·", "✢", "✳", "∗", "✻", "✽"]

// Action words array
const actions = [
  "Accomplishing","Actioning","Actualizing","Baking","Brewing","Calculating",
  "Cerebrating","Churning","Clauding","Coalescing","Cogitating","Computing",
  "Conjuring","Considering","Cooking","Crafting","Creating","Crunching",
  "Deliberating","Determining","Doing","Effecting","Finagling","Forging",
  "Forming","Generating","Hatching","Herding","Honking","Hustling","Ideating",
  "Inferring","Manifesting","Marinating","Moseying","Mulling","Mustering",
  "Musing","Noodling","Percolating","Pondering","Processing","Puttering",
  "Reticulating","Ruminating","Schlepping","Shucking","Simmering","Smooshing",
  "Spinning","Stewing","Synthesizing","Thinking","Transmuting","Vibing","Working",
]

function getRandomAction() {
  return actions[Math.floor(Math.random() * actions.length)]
}

function Spinner({ isRunning }: { isRunning: boolean }) {
  const sequence = [...spinnerChars, ...spinnerChars.slice().reverse()]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % sequence.length)
    }, 120)
    return () => clearInterval(interval)
  }, [isRunning, sequence.length])

  return (
    <span className="shimmer-orange font-bold inline-block w-6 text-center">
      {sequence[index]}
    </span>
  )
}

function Logo() {
  return (
    <div className="text-left mb-8">
      <div className="text-green-400 text-sm mb-2">~/cc-gif-generator</div>
      <div className="text-white text-lg">
        <span className="text-gray-500">$</span> cc-gg --interactive
      </div>
    </div>
  )
}

export default function GifGenerator() {
  const [seconds, setSeconds] = useState(0)
  const [action, setAction] = useState(() => getRandomAction())
  const [customWord, setCustomWord] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [running, setRunning] = useState(true)
  const [isGeneratingGif, setIsGeneratingGif] = useState(false)
  const [generatedGifUrl, setGeneratedGifUrl] = useState<string | null>(null)
  const startTime = useRef(Date.now())

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setRunning(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleReset = () => {
    setSeconds(0)
    setRunning(true)
    setAction(customWord.trim() || getRandomAction())
    setGeneratedGifUrl(null)
    startTime.current = Date.now()
  }

  const handleSetCustomWord = () => {
    if (customWord.trim()) {
      setAction(customWord.trim())
      setRunning(true)
      setSeconds(0)
      setGeneratedGifUrl(null)
      startTime.current = Date.now()
      setShowCustomInput(false)
    }
  }

  const generateGif = async () => {
    setIsGeneratingGif(true)
    try {
      const GIF = (await import("gif.js")).default

      const gif = new GIF({
        workers: 2,
        quality: 5,
        width: 400,
        height: 80,
        transparent: null,
        workerScript: "/gif.worker.js",
        debug: false,
        repeat: 0,
      })

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.width = 400
      canvas.height = 80

      const baseOrange = "#d77757" // base
      const lightOrange = "#f59575" // highlight

      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      const sequence = [...spinnerChars, ...spinnerChars.slice().reverse()]
      const frameDelay = 120
      const sweepFrames = sequence.length
      const cycles = 4 // even ensures RL then LR pairs
      const totalFrames = sweepFrames * cycles

      // helpers for safe gradient stops
      const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)

      console.log("[v2.1] Generating", totalFrames, "frames with", frameDelay, "ms delay")
      const currentAction = action

      for (let i = 0; i < totalFrames; i++) {
        const frameIndex = i % sequence.length

        // bg
        ctx.fillStyle = "#1f2937"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const centerY = canvas.height / 2
        const startX = 30

        // Ping-pong sheen: RIGHT→LEFT first, then LEFT→RIGHT (alternate)
        const w = canvas.width
        const segment = Math.floor(i / sweepFrames) % 2 // 0: RL, 1: LR
        const local = i % sweepFrames
        const s = local / (sweepFrames - 1) // 0..1

        const startPos = 1.15 * w  // off-right
        const endPos = -0.15 * w   // off-left
        const center =
          segment === 0 ? startPos + (endPos - startPos) * s : endPos + (startPos - endPos) * s

        // narrower highlight band
        const stripeHalf = 12;  // try 14–16 for bolder
        let l = clamp01((center - stripeHalf) / w)
        let m = clamp01(center / w)
        let r = clamp01((center + stripeHalf) / w)

        // enforce non-decreasing order to satisfy CanvasGradient
        if (m < l) m = l
        if (r < m) r = m

        const grad = ctx.createLinearGradient(0, 0, w, 0)
        grad.addColorStop(0, baseOrange)
        grad.addColorStop(l, baseOrange)
        grad.addColorStop(m, lightOrange)
        grad.addColorStop(r, baseOrange)
        grad.addColorStop(1, baseOrange)

        // Symbol
        ctx.fillStyle = grad
        ctx.font = "bold 18px monospace"
        ctx.textAlign = "center"
        ctx.fillText(sequence[frameIndex], startX + 10, centerY)

        // Action word
        ctx.textAlign = "left"
        ctx.fillStyle = grad
        ctx.font = "bold 18px monospace"
        const actionText = `${currentAction}… `
        ctx.fillText(actionText, startX + 25, centerY)

        // Timer
        const actionTextWidth = ctx.measureText(actionText).width
        const timerStartX = startX + 25 + actionTextWidth + 8
        ctx.fillStyle = "#9ca3af"
        ctx.font = "12px monospace"
        const frameTime = Math.floor((i * frameDelay) / 1000)
        ctx.fillText(`(${frameTime}s · esc to interrupt)`, timerStartX, centerY)

        gif.addFrame(canvas, { delay: frameDelay, copy: true })
      }

      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        setGeneratedGifUrl(url)

        const link = document.createElement("a")
        link.download = `thinking-animation-${action.toLowerCase().replace(/[^a-z0-9]/g, "-")}.gif`
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setIsGeneratingGif(false)
      })

      gif.on("progress", (progress: number) => {
        console.log("[v2.1] GIF render progress:", Math.round(progress * 100) + "%")
      })

      gif.render()
    } catch (error) {
      console.error("Error generating GIF:", error)
      alert("Error generating GIF. Please try again.")
      setIsGeneratingGif(false)
    }
  }

  return (
    <>
      <AnimatedFavicon running={running} bandPx={6} size={32} />
      <div className="min-h-screen bg-black text-gray-300 p-6 font-mono">
        <div className="max-w-4xl">
          <Logo />
  
          <div className="mb-6">
            {running ? (
              <div className="text-base flex items-center gap-1">
                <Spinner isRunning={running} />
                <span className="shimmer-orange font-bold">{action}…</span>
                <span className="text-gray-500 ml-2">({seconds}s · esc to interrupt)</span>
              </div>
            ) : (
              <div className="text-base text-red-500">
                <span className="text-red-500">✗</span> Interrupted
              </div>
            )}
          </div>
  
          <div className="mb-6 space-y-2">
            {!running && (
              <div className="text-gray-500">
                <span className="text-gray-500">$</span>{" "}
                <Button
                  onClick={handleReset}
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto font-mono underline"
                >
                  restart
                </Button>
              </div>
            )}
  
            <div className="text-gray-500">
              <span className="text-gray-500">$</span>{" "}
              <Button
                onClick={() => setShowCustomInput(!showCustomInput)}
                variant="link"
                className="text-cyan-400 hover:text-cyan-300 p-0 h-auto font-mono underline text-sm"
              >
                set-word
              </Button>
            </div>
  
            {showCustomInput && (
              <div className="ml-4 flex items-center gap-2 text-sm">
                <span className="text-gray-500">word:</span>
                <input
                  type="text"
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSetCustomWord()}
                  placeholder="Enter custom word..."
                  className="bg-gray-900 border border-gray-700 text-orange-400 px-2 py-1 rounded font-mono focus:outline-none focus:border-orange-500"
                  autoFocus
                />
                <Button
                  onClick={handleSetCustomWord}
                  variant="link"
                  className="text-green-400 hover:text-green-300 p-0 h-auto font-mono underline text-sm"
                >
                  apply
                </Button>
              </div>
            )}
  
            <div className="text-gray-500">
              <span className="text-gray-500">$</span>{" "}
              <Button
                onClick={generateGif}
                disabled={isGeneratingGif}
                variant="link"
                className={`p-0 h-auto font-mono underline ${
                  isGeneratingGif
                    ? "text-gray-600 cursor-not-allowed no-underline"
                    : "text-orange-400 hover:text-orange-300"
                }`}
              >
                {isGeneratingGif ? "generating..." : "export-gif"}
              </Button>
            </div>
          </div>
  
          {generatedGifUrl && (
            <div className="mt-6 border-l-2 border-green-400 pl-4">
              <div className="text-green-400 text-sm mb-2">✓ GIF exported successfully</div>
              <div className="flex">
                <img
                  src={generatedGifUrl || "/placeholder.svg"}
                  alt="Generated animation GIF"
                  className="border border-gray-700 rounded"
                />
              </div>
              <div className="text-gray-500 text-xs mt-2">
                File downloaded: thinking-animation-{action.toLowerCase().replace(/[^a-z0-9]/g, "-")}.gif
              </div>
            </div>
          )}
  
          <div className="mt-8 text-gray-500 text-sm border-t border-gray-800 pt-4">
            <div className="mb-2">USAGE:</div>
            <div className="ml-4 space-y-1">
              <div>• Press ESC to interrupt animation</div>
              <div>• Run 'set-word' to customize the action word</div>
              <div>• Run 'export-gif' to generate animated GIF</div>
              <div>• {actions.length} random actions available by default</div>
            </div>
          </div>
  
          <div className="mt-6 text-gray-600 text-xs border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-1">
              <div><span className="text-gray-500">credits:</span> Built with v0.dev, gif.js, Next.js, and Tailwind CSS</div>
            </div>
          </div>
        </div>
  
        {/* CSS: narrow highlight; start RIGHT→LEFT, then LEFT→RIGHT (alternate) */}
        <style jsx global>{`
          @keyframes orange-sheen-rl {
            from { background-position: 200% 0; } /* start at right, sweep left */
            to   { background-position: 0% 0;   } /* end at left */
          }
          .shimmer-orange{
            --o-base: #d77757;
            --o-light: #f59575;
            --band: 4%; /* half-width; total bright band ≈ 2× this */
          
            background-image: linear-gradient(
              90deg,
              var(--o-base) 0%,
              var(--o-base) calc(50% - var(--band)),
              var(--o-light) 50%,
              var(--o-base) calc(50% + var(--band)),
              var(--o-base) 100%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            animation: orange-sheen-rl 1.6s linear infinite alternate;
          }
          @media (prefers-reduced-motion: reduce) {
            .shimmer-orange {
              animation: none;
              background: none;
              -webkit-text-fill-color: #f97316;
              color: #f97316;
            }
          }
        `}</style>
      </div>
    </>
  )
}
