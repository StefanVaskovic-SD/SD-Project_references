export function SlideBreakSlide({ title, text, slideNumber }) {
  return (
    <div 
      className="relative w-screen h-screen bg-black flex flex-col justify-between p-12"
      style={{
        backgroundImage: 'url(/brake-slide.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo - Top Left */}
      <div className="flex items-start justify-between">
        <div>
          <img 
            src="/sd-logo.svg" 
            alt="StudioDirection" 
            className="h-6 w-auto"
          />
        </div>
        {/* Slide Number - Top Right */}
        {slideNumber && (
          <div className="text-white/60 text-sm" style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}>
            {slideNumber}
          </div>
        )}
      </div>

      {/* Heading and Text - Bottom Left */}
      <div className="text-left max-w-2xl">
        {title && (
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-6"
            style={{ fontFamily: 'SuisseIntl', fontWeight: 500 }}
          >
            {title}
          </h2>
        )}
        {text && (
          <p 
            className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed"
            style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

