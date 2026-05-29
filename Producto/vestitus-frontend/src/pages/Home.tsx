import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"%3E%3Crect fill="%23E0D8CC" width="1600" height="1200"/%3E%3Ctext fill="%238A8078" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E'

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1771736824706-c6f81411dd19?w=1600&q=80',
    alt: 'Vestitus — Pareja joven de moda',
  },
  {
    url: 'https://images.unsplash.com/photo-1774544349354-6fbe1de7f0d3?w=1600&q=80',
    alt: 'Vestitus — Pareja en iluminación tenue',
  },
  {
    url: 'https://images.unsplash.com/photo-1758387813664-5cd1211304f6?w=1600&q=80',
    alt: 'Vestitus — Pareja vestida de negro',
  },
  {
    url: 'https://images.unsplash.com/photo-1763346757081-6db3e7f324cb?w=1600&q=80',
    alt: 'Vestitus — Pareja con sombrilla',
  },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [paused])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE
  }

  return (
    <div>
      {/* Hero — editorial split layout */}
      <section className="relative h-[75vh] md:h-[85vh] min-h-[450px] bg-[var(--text)] overflow-hidden flex flex-col md:flex-row" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Left: brand text + buttons */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="max-w-lg w-full">
            <span className="season-label text-[var(--gold)]">Colección Otoño/Invierno 2026</span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--card)] leading-[0.9] tracking-tight mt-3">
              Vestitus
            </h1>
            <p className="font-serif text-lg md:text-xl text-[var(--card)]/70 mt-3 max-w-md italic">
              Arriendo y venta de vestuario para cada ocasión.
            </p>
            <div className="flex gap-3 mt-8">
              <Link to="/products" className="inline-flex items-center gap-2 bg-[var(--card)] text-[var(--text)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:bg-[var(--gold)] transition-all btn-gold">
                Explorar <ArrowRight className="h-3 w-3" />
              </Link>
              <Link to="/corporate-info" className="inline-flex items-center gap-2 border border-[var(--card)]/30 text-[var(--card)] px-6 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase hover:border-[var(--card)]/60 transition-all">
                Conócenos
              </Link>
            </div>
          </div>
        </div>

        {/* Right: carousel */}
        <div className="flex-1 relative overflow-hidden bg-[var(--text)]">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover object-[50%_30%]"
                loading={i === 0 ? 'eager' : 'lazy'}
                onError={handleImageError}
                width={1600}
                height={2000}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/60 via-transparent to-transparent pointer-events-none" />

          {/* Dots */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir a imagen ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-[var(--gold)]' : 'w-1.5 bg-[var(--card)]/30 hover:bg-[var(--card)]/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial spread */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-5 gap-8 items-end">
          <div className="md:col-span-2">
            <span className="season-label text-[var(--gold)]">Esencia</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--text)] mt-3 leading-tight">
              Moda que se <br />vive, no solo se <br />usa.
            </h2>
          </div>
          <div className="md:col-span-3">
            <p className="text-[var(--muted)] text-lg leading-relaxed max-w-xl">
              En Vestitus creemos que cada evento merece un look extraordinario.
              Arrienda la pieza perfecta para tu ocasión especial o adquiere
              esa prenda que siempre has deseado.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm tracking-[0.1em] uppercase text-[var(--text)] mt-6 hover:text-[var(--gold)] transition-colors border-b border-[var(--text)] pb-0.5 hover:border-[var(--gold)]">
              Ver Colección <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value propositions */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="relative">
              <span className="font-serif text-6xl text-[var(--gold)]/20 absolute -top-8 left-0">01</span>
              <h3 className="font-serif text-2xl text-[var(--text)] mt-4 mb-3">Variedad Exclusiva</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Catálogo seleccionado curado para cada ocasión especial. Cada pieza cuenta una historia.
              </p>
            </div>
            <div className="relative">
              <span className="font-serif text-6xl text-[var(--gold)]/20 absolute -top-8 left-0">02</span>
              <h3 className="font-serif text-2xl text-[var(--text)] mt-4 mb-3">Calidad Garantizada</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Prendas en excelente estado, revisadas y certificadas. Porque los detalles importan.
              </p>
            </div>
            <div className="relative">
              <span className="font-serif text-6xl text-[var(--gold)]/20 absolute -top-8 left-0">03</span>
              <h3 className="font-serif text-2xl text-[var(--text)] mt-4 mb-3">Despacho Rápido</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Envío a todo Chile con couriers asociados. Tu look, donde lo necesites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-[var(--text)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold-dark)/10_0%,_transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <span className="season-label text-[var(--gold)]">¿Arrendar o Comprar?</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--card)] mt-4 mb-4">
            Tú eliges. Nosotros vestimos.
          </h2>
          <p className="text-[var(--muted)] max-w-lg mx-auto mb-8">
            Ofrecemos ambas opciones. Arrienda para eventos especiales o adquiere tu prenda favorita.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--text)] px-8 py-3 rounded-full text-sm tracking-[0.1em] uppercase font-medium hover:bg-[var(--card)] transition-all">
            Ver Opciones <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
