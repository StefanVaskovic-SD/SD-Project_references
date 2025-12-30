export function ProjectSlide({ 
  slideUrl, 
  projectName,
  liveWebsiteLink,
  liveWebsiteLabel,
  sdWorkLink,
  sdWorkLabel,
}) {
  const hasLiveWebsite = liveWebsiteLink && liveWebsiteLink.trim() !== ''
  const hasSdWork = sdWorkLink && sdWorkLink.trim() !== ''

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-black">
      <img
        src={slideUrl}
        alt={projectName || 'Project slide'}
        className="max-w-full max-h-full object-contain"
        loading="lazy"
      />
      
      {/* Action Buttons - Bottom Right */}
      {(hasLiveWebsite || hasSdWork) && (
        <div className="absolute bottom-8 right-8 flex gap-3 z-10">
          {hasLiveWebsite && (
            <a
              href={liveWebsiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              {liveWebsiteLabel || 'Live Website'}
            </a>
          )}
          {hasSdWork && (
            <a
              href={sdWorkLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black border border-white rounded-lg hover:bg-white/90 transition-colors font-medium"
            >
              {sdWorkLabel || 'SD Work'}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

