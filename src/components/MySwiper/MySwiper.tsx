import { FC, ReactNode, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Mousewheel } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import type { Swiper as SwiperType } from 'swiper'

import styles from './MySwiper.module.scss'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/mousewheel'

interface MySwiperProps {
  children: ReactNode
  className?: string
  btnsClassName?: string
  swiperClassName?: string
  prevBtnLabel?: string
  nextBtnLabel?: string
  slidesPerView?: number | 'auto' | undefined
}

export const MySwiper: FC<MySwiperProps> = ({
  children,
  className = '',
  btnsClassName = '',
  swiperClassName = '',
  prevBtnLabel = 'Предыдущий слайд',
  nextBtnLabel = 'Следующий слайд',
  slidesPerView = 'auto',
}) => {
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const swiperRef = useRef<SwiperType | null>(null)
  return (
    <div className={`${styles.carouselWrapper} ${className}`}>
      <button
        ref={prevBtnRef}
        className={`${styles.navButtonPrev} ${styles.hiddenBtn} ${btnsClassName}`}
        onClick={() => {
          swiperRef.current?.slidePrev()
          nextBtnRef.current?.classList.remove(styles.hiddenBtn)
          if (swiperRef.current?.realIndex === 0) {
            prevBtnRef.current?.classList.add(styles.hiddenBtn)
          }
        }}
        // style={swiperRef?.current?.realIndex === 0 ? {opacity: 0} : {opacity: 1}}
        aria-label={prevBtnLabel}
      >
        <FaChevronLeft />
      </button>

      <Swiper
        modules={[Navigation, Mousewheel]}
        slidesPerView={slidesPerView}
        centeredSlides={false}
        freeMode={true}
        mousewheel={{
          // forceToAxis: true,
          sensitivity: 1,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className={`${styles.swiperContainer} ${swiperClassName}`}
        onTransitionEnd={(swiper) => {
          if (swiper.realIndex === 0) {
            prevBtnRef.current?.classList.add(styles.hiddenBtn)
          } else {
            prevBtnRef.current?.classList.remove(styles.hiddenBtn)
          }
          if (swiper.isEnd) {
            nextBtnRef.current?.classList.add(styles.hiddenBtn)
          } else {
            nextBtnRef.current?.classList.remove(styles.hiddenBtn)
          }
        }}

      >
        {children}
      </Swiper>

      <button
        className={`${styles.navButtonNext} ${btnsClassName} ${swiperRef.current?.isEnd ? styles.hiddenBtn : ''}`}
        ref={nextBtnRef}
        onClick={() => {
          swiperRef.current?.slideNext()
          prevBtnRef.current?.classList.remove(styles.hiddenBtn)
          if (swiperRef.current?.isEnd) {
            nextBtnRef.current?.classList.add(styles.hiddenBtn)
          }
        }}
        aria-label={nextBtnLabel}
        // style={swiperRef?.current?.realIndex === NAV_LINKS.length - 1 ? {opacity: 0} : {opacity: 1}}
      >
        <FaChevronRight />
      </button>
    </div>
  )
}
