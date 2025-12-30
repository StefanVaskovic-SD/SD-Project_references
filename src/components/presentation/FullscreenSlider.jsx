import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard } from 'swiper/modules'
import { ProjectSlide } from './ProjectSlide'
import { SlideBreakSlide } from './SlideBreakSlide'
import { OpeningSlide } from './OpeningSlide'
import { ClosingSlide } from './ClosingSlide'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function FullscreenSlider({ slides }) {
  if (!slides || slides.length === 0) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <p className="text-white/60">No slides to display</p>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        direction="horizontal"
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        keyboard={{
          enabled: true,
        }}
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={true}
        className="!w-screen !h-screen"
      >
        {/* Opening Slide - Always First */}
        <SwiperSlide key="opening" className="!w-screen !h-screen">
          <OpeningSlide />
        </SwiperSlide>

        {/* Content Slides */}
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="!w-screen !h-screen">
            {slide.type === 'project' ? (
              <ProjectSlide
                slideUrl={slide.imageUrl}
                projectName={slide.projectName}
                liveWebsiteLink={slide.liveWebsiteLink}
                liveWebsiteLabel={slide.liveWebsiteLabel}
                sdWorkLink={slide.sdWorkLink}
                sdWorkLabel={slide.sdWorkLabel}
              />
            ) : (
              <SlideBreakSlide
                title={slide.title}
                text={slide.text}
              />
            )}
          </SwiperSlide>
        ))}

        {/* Closing Slide - Always Last */}
        <SwiperSlide key="closing" className="!w-screen !h-screen">
          <ClosingSlide />
        </SwiperSlide>
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/80 hover:bg-black border border-white/20 rounded-full text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/80 hover:bg-black border border-white/20 rounded-full text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

    </div>
  )
}

