import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function HeroSection({
  badge = '',
  title = '',
  highlightedText = '',
  subtitle = '',
  backgroundImage = '',
  mobileBackgroundImage = '',
  overlayColor = '#000000',
  overlayOpacity = 0.5,
  ctaText = '',
  ctaLink = '/',
  secondaryCtaText = '',
  secondaryCtaLink = '/',
  ctaStyle = '',
  height = 'min-h-[70vh]',
  textAlign = 'center',
  className = '',
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const activeBackgroundImage = isMobile && mobileBackgroundImage ? mobileBackgroundImage : backgroundImage

  const textAlignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }

  return (
    <div
      className={`relative w-full ${height} bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${activeBackgroundImage})` }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
      />

      <div className={`relative z-10 flex flex-col h-full px-4 sm:px-6 lg:px-8 ${textAlignClasses[textAlign]}`}>
        <div className="max-w-7xl mx-auto w-full pt-16">
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm mb-6">
              {badge}
            </span>
          )}

          {title && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-white mb-6">
              {title}{' '}
              {highlightedText && (
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  {highlightedText}
                </span>
              )}
            </h1>
          )}

          {subtitle && (
            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(ctaText || secondaryCtaText) && (
        <div className="absolute bottom-8 md:bottom-16 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaText && (
                <Link
                  to={ctaLink}
                   className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)] transition-all ${ctaStyle}`}
                >
                  {ctaText}
                </Link>
              )}
              {secondaryCtaText && (
                <Link
                  to={secondaryCtaLink}
                   className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-secondary-50)] text-[var(--color-text-primary)] font-semibold hover:bg-[rgba(239,242,58,0.7)] transition-all"
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}