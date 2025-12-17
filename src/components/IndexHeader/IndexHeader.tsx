import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Mousewheel } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import type { Swiper as SwiperType } from 'swiper'
import styles from './IndexHeader.module.scss'
import { PAGE_ENDPOINTS } from '@constants/'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/mousewheel'

interface IndexHeaderProps {
  isAuthenticated: boolean
  openAuthModal: (type: 'login' | 'register') => void
  className?: string
  currentPart: string
}

const NAV_LINKS = [
  { id: 1, href: '#simplisity', label: 'Простота' },
  { id: 2, href: '#flexibility', label: 'Гибкость' },
  { id: 3, href: '#autoscripts', label: 'Автоскрипты' },
  { id: 4, href: '#instruments', label: 'Инструменты' },
  { id: 5, href: '#automatisation', label: 'Автоматизация' },
  { id: 6, href: '#integration', label: 'Интеграция' },
  { id: 7, href: '#tests', label: 'Виды тестирования' },
  { id: 8, href: '#managment', label: 'Управление' },
  { id: 9, href: '#AI', label: 'ИИ' },
  { id: 10, href: '#control', label: 'Контроль' },
  { id: 11, href: '#whyYAMP', label: 'Почему YAMP?' },
]

export const IndexHeader = ({
  isAuthenticated,
  openAuthModal,
  className = '',
  currentPart,
}: IndexHeaderProps) => {
  const navigate = useNavigate()
  const swiperRef = useRef<SwiperType | null>(null)
  const [showOneSlide, setShowOneSlide] = useState(false)
  const [scrolledEnough, setScrolledEnough] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  // инициацилизация всякого разного
  useEffect(() => {
    const checkLayout = () => {
      const width = window.innerWidth

      if (width > 800) {
        setShowOneSlide(false)
      } else {
        setShowOneSlide(true)
      }
    }
    checkLayout()
    window.addEventListener('resize', checkLayout)

    const checkScrolling = () => {
      if (window.pageYOffset > (3 * window.innerHeight) / 4)
        setScrolledEnough(2)
      else if (window.pageYOffset > window.innerHeight / 2) setScrolledEnough(1)
      else setScrolledEnough(0)
    }
    checkScrolling()
    window.addEventListener('scroll', checkScrolling)

    // prevBtnRef.current?.classList.add(styles.hiddenBtn)
    return () => {
      window.removeEventListener('resize', checkLayout)
      window.removeEventListener('scroll', checkScrolling)
    }
  }, [])

  useEffect(() => {
    for (let i = 0; i < NAV_LINKS.length; ++i) {
      if ('#' + currentPart === NAV_LINKS[i].href) {
        swiperRef.current?.slideTo(i, 500)
        if (i === 0) {
          prevBtnRef.current?.classList.add(styles.hiddenBtn)
        } else {
          prevBtnRef.current?.classList.remove(styles.hiddenBtn)
        }
        if (i === NAV_LINKS.length - 1) {
          nextBtnRef.current?.classList.add(styles.hiddenBtn)
        } else {
          nextBtnRef.current?.classList.remove(styles.hiddenBtn)
        }
      }
    }
  }, [currentPart])

  return (
    <div
      className={`${styles.glassWrapper} ${scrolledEnough == 2 ? styles.scrolled : scrolledEnough === 1 ? styles.hide : ''} ${className}`}
    >
      <div className={styles.indexHeader}>
        <img
          className={styles.indexLogo}
          src="/images/logo_dark.png"
          alt="YAMP logo"
          onClick={() => (window.location.hash = '#introduction')}
        />

        <div ref={containerRef} className={styles.navContainer}>
          {/* <div
            ref={navLinksRef}
            className={styles.longreadNavLinks}
            style={{
              display: showCarousel ? 'none' : 'flex',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          {showCarousel && ( */}
          <div className={styles.carouselWrapper}>
            <button
              ref={prevBtnRef}
              className={`${styles.navButtonPrev} ${styles.hiddenBtn}`}
              onClick={() => {
                swiperRef.current?.slidePrev()
                nextBtnRef.current?.classList.remove(styles.hiddenBtn)
                if (swiperRef.current?.realIndex === 0) {
                  prevBtnRef.current?.classList.add(styles.hiddenBtn)
                }
              }}
              // style={swiperRef?.current?.realIndex === 0 ? {opacity: 0} : {opacity: 1}}
              aria-label="Предыдущий слайд"
            >
              <FaChevronLeft />
            </button>

            <Swiper
              modules={[Navigation, Mousewheel]}
              slidesPerView={showOneSlide ? 1 : 'auto'}
              centeredSlides={false}
              freeMode={true}
              mousewheel={{
                // forceToAxis: true,
                sensitivity: 1,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              className={styles.swiperContainer}
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
              {NAV_LINKS.map((link) => (
                <SwiperSlide
                  key={link.id}
                  className={`${styles.swiperSlide} ${'#' + currentPart === link.href ? styles.currentPart : ''}`}
                  style={{
                    width: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    padding: showOneSlide ? '0' : '0 10px',
                  }}
                >
                  <a href={link.href}>{link.label}</a>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className={styles.navButtonNext}
              ref={nextBtnRef}
              onClick={() => {
                swiperRef.current?.slideNext()
                prevBtnRef.current?.classList.remove(styles.hiddenBtn)
                if (swiperRef.current?.isEnd) {
                  nextBtnRef.current?.classList.add(styles.hiddenBtn)
                }
              }}
              aria-label="Следующий слайд"
              // style={swiperRef?.current?.realIndex === NAV_LINKS.length - 1 ? {opacity: 0} : {opacity: 1}}
            >
              <FaChevronRight />
            </button>
          </div>
          {/* )} */}
        </div>

        <div className={styles.indexLogin}>
          <button
            className={styles.indexLoginBtn}
            onClick={() => {
              if (isAuthenticated) {
                navigate(`${PAGE_ENDPOINTS.OUTLET}/${PAGE_ENDPOINTS.HOME}`)
              } else {
                openAuthModal('login')
              }
            }}
          >
            Личный кабинет
          </button>
        </div>
      </div>
    </div>
  )
}
