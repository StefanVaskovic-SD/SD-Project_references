export function ClosingSlide() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Main Content - Centered */}
      <div className="text-center">
        <h1 className="text-white text-9xl md:text-[12rem] font-medium mb-4" style={{ fontFamily: 'SuisseIntl', fontWeight: 500 }}>
          Fin
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-white text-2xl font-medium" style={{ fontFamily: 'SuisseIntl', fontWeight: 500 }}>↗</span>
          <span className="text-white text-2xl font-medium" style={{ fontFamily: 'SuisseIntl', fontWeight: 500 }}>StudioDirection™</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-12 py-6 border-t border-white/10">
        <div className="flex items-center gap-6 text-white text-sm" style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}>
          <span>@studiodirection</span>
          <span>www.studiodirection.com</span>
        </div>
        <div className="text-white text-sm" style={{ fontFamily: 'SuisseIntl', fontWeight: 400 }}>
          ©2024
        </div>
      </div>
    </div>
  )
}

