export function ClosingSlide() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-9xl md:text-[12rem] font-medium mb-4" style={{ fontFamily: 'SuisseIntl', fontWeight: 500, lineHeight: '110%' }}>
          Fin
        </h1>
        <p className="text-white text-xl md:text-2xl" style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}>
          Discover projects on{' '}
          <a 
            href="https://studiodirection.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            studiodirection.com
          </a>
        </p>
      </div>
    </div>
  )
}

