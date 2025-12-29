export function SlideBreakSlide({ title, text }) {
  return (
    <div className="w-screen h-screen bg-black flex items-end justify-start p-12">
      <div className="text-left max-w-2xl">
        {title && (
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {title}
          </h2>
        )}
        {text && (
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

