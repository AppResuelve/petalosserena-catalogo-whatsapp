import { Link } from 'react-router-dom'
import { content } from '../../data/siteData'

export default function NotFound() {
  const { title, subtitle, message, buttonText, buttonLink } = content.notFound

  return (
    <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-[120px] sm:text-[180px] font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent opacity-20">
            {title}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {subtitle}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
          {message}
        </p>
        <Link
          to={buttonLink}
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)] transition-all"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
