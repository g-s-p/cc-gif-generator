"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

// Spinner characters - different for Mac vs other platforms
const spinnerChars =
  typeof navigator !== "undefined" && navigator.platform?.includes("Mac")
    ? ["·", "✢", "✳", "∗", "✻", "✽"]
    : ["·", "✢", "*", "∗", "✻", "✽"]

// Action words array
const actions = [
  "Accomplishing",
  "Actioning",
  "Actualizing",
  "Baking",
  "Brewing",
  "Calculating",
  "Cerebrating",
  "Churning",
  "Clauding",
  "Coalescing",
  "Cogitating",
  "Computing",
  "Conjuring",
  "Considering",
  "Cooking",
  "Crafting",
  "Creating",
  "Crunching",
  "Deliberating",
  "Determining",
  "Doing",
  "Effecting",
  "Finagling",
  "Forging",
  "Forming",
  "Generating",
  "Hatching",
  "Herding",
  "Honking",
  "Hustling",
  "Ideating",
  "Inferring",
  "Manifesting",
  "Marinating",
  "Moseying",
  "Mulling",
  "Mustering",
  "Musing",
  "Noodling",
  "Percolating",
  "Pondering",
  "Processing",
  "Puttering",
  "Reticulating",
  "Ruminating",
  "Schlepping",
  "Shucking",
  "Simmering",
  "Smooshing",
  "Spinning",
  "Stewing",
  "Synthesizing",
  "Thinking",
  "Transmuting",
  "Vibing",
  "Working",
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

  return <span className="text-orange-500 font-bold">{sequence[index]}</span>
}

function Logo() {
  return (
    <div className="text-center mb-12 p-6">
      <svg className="h-24 w-auto mx-auto" viewBox="0 0 500 140" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#ea580c", stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#fb923c", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#fdba74", stopOpacity: 1 }} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="textGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated spinner circles - larger and more prominent */}
        <g transform="translate(60, 70)">
          <circle
            cx="0"
            cy="0"
            r="28"
            fill="none"
            stroke="url(#modernGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="44 44"
            opacity="0.4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;360"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            cx="0"
            cy="0"
            r="28"
            fill="none"
            stroke="url(#modernGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="22 66"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;360"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="0" cy="0" r="4" fill="url(#modernGradient)" filter="url(#glow)" />
        </g>

        {/* Main title - larger and with gradient */}
        <text
          x="130"
          y="55"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="42"
          fontWeight="700"
          fill="url(#textGradient)"
          letterSpacing="-0.02em"
          filter="url(#textGlow)"
        >
          GIF
        </text>

        {/* Subtitle - improved spacing and color */}
        <text
          x="130"
          y="85"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="20"
          fontWeight="600"
          fill="#9ca3af"
          letterSpacing="0.1em"
        >
          GENERATOR
        </text>

        {/* Accent line - longer and more prominent */}
        <rect x="130" y="95" width="120" height="3" fill="url(#modernGradient)" opacity="0.8" rx="1.5" />

        {/* Terminal-style decorative elements */}
        <g opacity="0.3">
          <rect x="420" y="25" width="8" height="8" fill="#f97316" />
          <rect x="435" y="25" width="8" height="8" fill="#fb923c" />
          <rect x="450" y="25" width="8" height="8" fill="#fdba74" />

          <text x="420" y="110" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="12" fill="#4b5563">
            {">"}_
          </text>
        </g>
      </svg>
    </div>
  )
}

export default function GifGenerator() {
  const [seconds, setSeconds] = useState(0)
  const [action, setAction] = useState(() => getRandomAction())
  const [running, setRunning] = useState(true)
  const [isGeneratingGif, setIsGeneratingGif] = useState(false)
  const [generatedGifUrl, setGeneratedGifUrl] = useState<string | null>(null)
  const startTime = useRef(Date.now())

  // Timer effect
  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [running])

  // Keyboard handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setRunning(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Reset function
  const handleReset = () => {
    setSeconds(0)
    setRunning(true)
    setAction(getRandomAction())
    setGeneratedGifUrl(null)
    startTime.current = Date.now()
  }

  // Generate GIF function
  const generateGif = async () => {
    setIsGeneratingGif(true)

    try {
      // Dynamically import gif.js
      const GIF = (await import("gif.js")).default

      const gif = new GIF({
        workers: 2,
        quality: 5, // Better quality (lower number = better quality)
        width: 800,
        height: 200,
        transparent: null, // Use solid background instead of transparency
        workerScript: "/gif.worker.js",
        debug: false,
      })

      // Create canvas for rendering frames
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.width = 800
      canvas.height = 200

      // Set up text styles
      ctx.font = "bold 24px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const sequence = [...spinnerChars, ...spinnerChars.slice().reverse()]
      const frameDelay = 180 // Slower timing for better visibility
      const cycles = 2 // Generate 2 full cycles
      const totalFrames = sequence.length * cycles

      console.log("[v0] Generating", totalFrames, "frames with", frameDelay, "ms delay")

      // Generate frames
      for (let i = 0; i < totalFrames; i++) {
        const frameIndex = i % sequence.length

        ctx.fillStyle = "#111827" // Solid dark gray background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "#f97316" // Solid orange color
        ctx.fillText(sequence[frameIndex], 300, 100)

        // Draw action text
        ctx.fillText(`${action}…`, 500, 100)

        ctx.fillStyle = "#d1d5db" // Lighter gray for better visibility
        ctx.font = "16px monospace"
        const timeSeconds = Math.floor((i * frameDelay) / 1000)
        ctx.fillText(`(${timeSeconds}s · esc to interrupt)`, 600, 130)

        // Reset font for next frame
        ctx.font = "bold 24px monospace"

        // Add frame to GIF
        gif.addFrame(canvas, { delay: frameDelay })

        if (i % 5 === 0) {
          console.log("[v0] Generated frame", i + 1, "of", totalFrames)
        }
      }

      console.log("[v0] All frames generated, starting render...")

      // Render GIF
      gif.on("finished", (blob: Blob) => {
        console.log("[v0] GIF render complete, size:", blob.size, "bytes")
        const url = URL.createObjectURL(blob)
        setGeneratedGifUrl(url)

        // Auto-download
        const link = document.createElement("a")
        link.download = `thinking-animation-${action.toLowerCase()}.gif`
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setIsGeneratingGif(false)
      })

      gif.on("progress", (progress: number) => {
        console.log("[v0] GIF render progress:", Math.round(progress * 100) + "%")
      })

      gif.render()
    } catch (error) {
      console.error("Error generating GIF:", error)
      alert("Error generating GIF. Please try again.")
      setIsGeneratingGif(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-5 font-mono">
      <div className="text-center max-w-4xl w-full">
        <Logo />

        {/* Animation Area */}
        <div className="mb-8 p-10 bg-gray-800 rounded-lg border border-gray-600 w-[600px] h-[120px] flex items-center justify-center mx-auto">
          {running ? (
            <div className="text-2xl font-bold flex items-center justify-center gap-2">
              <Spinner isRunning={running} />
              <span className="text-orange-500">{action}… </span>
              <span className="text-gray-400 text-base">
                ({seconds}s · <span className="font-bold">esc</span> to interrupt)
              </span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-red-500">⏹ Interrupted</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mb-8">
          {!running && (
            <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
              🔄 Start Again
            </Button>
          )}

          <Button
            onClick={generateGif}
            disabled={isGeneratingGif}
            className={`${isGeneratingGif ? "bg-gray-600" : "bg-orange-600 hover:bg-orange-700"}`}
          >
            {isGeneratingGif ? "⏳ Generating GIF..." : "🎬 Generate Animated GIF"}
          </Button>
        </div>

        {/* GIF Preview */}
        {generatedGifUrl && (
          <div className="mt-5 p-5 bg-gray-800 rounded-lg border border-gray-600">
            <h3 className="text-orange-500 text-xl font-bold mt-0 mb-4">Generated GIF Preview:</h3>
            <img
              src={generatedGifUrl || "/placeholder.svg"}
              alt="Generated animation GIF"
              className="max-w-full rounded border border-gray-600"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-0 mt-4">
              GIF has been downloaded automatically. You can also right-click the image above to save it.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-gray-400 text-sm leading-relaxed">
          <p>
            <span className="font-bold">Instructions:</span>
          </p>
          <p>
            • Press <span className="font-bold">ESC</span> to stop the animation
          </p>
          <p>• Click "Generate Animated GIF" to create and download a real animated GIF</p>
          <p>• Each session shows a random thinking action from {actions.length} possibilities</p>
          <p>• The GIF captures one full spinner cycle with the current action text</p>
        </div>
      </div>
    </div>
  )
}
