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
  const expandedVideoRef = useRef(null)
  const hlsRef = useRef(null)
  const expandedHlsRef = useRef(null)
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)

  // Initialize video in normal view
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls = null

    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Don't auto-play in normal view
      })
      hlsRef.current = hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = videoUrl
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [videoUrl])

  // Initialize video in expanded view
  useEffect(() => {
    const video = expandedVideoRef.current
    if (!video || !isVideoExpanded) return

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
      expandedHlsRef.current = hls
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
  }, [videoUrl, isVideoExpanded])

  const handlePlayClick = () => {
    setIsVideoExpanded(true)
  }

  const handleCloseVideo = () => {
    setIsVideoExpanded(false)
    if (expandedVideoRef.current) {
      expandedVideoRef.current.pause()
      expandedVideoRef.current.currentTime = 0
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black">
      {/* Left Section */}
      <div className={`absolute left-0 top-0 w-1/2 h-full flex flex-col justify-between p-12 transition-opacity duration-300 z-10 ${isVideoExpanded ? 'opacity-0 pointer-events-none' : ''}`}>
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

      {/* Right Section - Video Container (always rendered) */}
      <div className={`absolute right-0 top-0 w-1/2 h-full flex items-center justify-center p-8 transition-opacity duration-300 z-10 ${isVideoExpanded ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="relative w-full h-full max-w-2xl rounded-lg overflow-hidden border-2" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          {/* Video - always rendered */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          />

          {/* Play Button Overlay - Centered */}
          {!isVideoExpanded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Play video"
              >
                <div className="w-0 h-0 border-l-[16px] border-l-black border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Width Expanded Video Overlay */}
      {isVideoExpanded && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={expandedVideoRef}
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
      )}
    </div>
  )
}

