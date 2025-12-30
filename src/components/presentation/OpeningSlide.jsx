import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export function OpeningSlide({ videoUrl = 'https://customer-7ahfkoeo2pbpo29s.cloudflarestream.com/b28021ef74c9a19e977887d1517205ca/manifest/video.m3u8' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls = null

    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.error('Error playing video:', err)
        })
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = videoUrl
      video.play().catch((err) => {
        console.error('Error playing video:', err)
      })
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [videoUrl])

  return (
    <div className="relative w-screen h-screen bg-black flex">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-between p-12">
        {/* Logo - Top Left */}
        <div className="flex items-center gap-2">
          <img 
            src="/sd-logo.svg" 
            alt="StudioDirection" 
            className="h-6 w-auto"
          />
          <span className="text-white text-xl font-medium" style={{ fontFamily: 'SuisseIntl', fontWeight: 500 }}>
            StudioDirection™
          </span>
        </div>

        {/* Portfolio Text - Centered Vertically */}
        <div className="flex-1 flex items-center">
          <h1 className="text-white text-8xl md:text-9xl font-medium tracking-tight" style={{ fontFamily: 'SuisseIntl', fontWeight: 500 }}>
            Portfolio
          </h1>
        </div>

        {/* Bottom Left - URL */}
        <div>
          <a 
            href="https://studiodirection.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white text-sm underline hover:no-underline"
            style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}
          >
            studiodirection.com
          </a>
        </div>
      </div>

      {/* Right Section - Video */}
      <div className="flex-1 relative bg-black flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-2xl rounded-lg overflow-hidden border-2" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          />

          {/* Play Button Overlay - Centered */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center opacity-90">
              <div className="w-0 h-0 border-l-[16px] border-l-black border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>

        {/* Bottom Right Text */}
        <div className="absolute bottom-8 right-12">
          <p className="text-white text-xs uppercase tracking-wider" style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}>
            PROJECT SHOWCASE 2024
          </p>
        </div>
      </div>
    </div>
  )
}

