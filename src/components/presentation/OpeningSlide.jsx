import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { X } from 'lucide-react'

export function OpeningSlide({ 
  videoUrl = 'https://customer-7ahfkoeo2pbpo29s.cloudflarestream.com/228e34fe84dbb7606ada435352fc6a19/manifest/video.m3u8',
  title = 'Portfolio',
  fontWeight = '500',
  fontSize = '8xl'
}) {
  const videoRef = useRef(null)
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)

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

  const handlePlayClick = () => {
    setIsVideoExpanded(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleCloseVideo = () => {
    setIsVideoExpanded(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  if (isVideoExpanded) {
    return (
      <div className="relative w-screen h-screen bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          loop
          muted
          playsInline
          autoPlay
        />
        {/* Close Button - Top Right */}
        <button
          onClick={handleCloseVideo}
          className="absolute top-4 right-4 z-10 w-[46px] h-[46px] bg-black/80 border border-white/20 rounded-full text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    )
  }

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
        </div>

        {/* Portfolio Text - Bottom Center */}
        <div className="flex-1 flex items-end pb-12">
          <h1 
            className="text-white tracking-tight"
            style={{ 
              fontFamily: 'SuisseIntl', 
              fontWeight: parseInt(fontWeight),
              fontSize: fontSize === '6xl' ? '3.75rem' : 
                        fontSize === '7xl' ? '4.5rem' :
                        fontSize === '8xl' ? '6rem' :
                        fontSize === '9xl' ? '8rem' : '6rem',
              lineHeight: '110%'
            }}
          >
            {title}
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
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Play video"
            >
              <div className="w-0 h-0 border-l-[16px] border-l-black border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
            </button>
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

