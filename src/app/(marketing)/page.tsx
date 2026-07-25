import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { PrimeSequence } from "@/components/landing/PrimeSequence";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { PrimeMark } from "@/components/ui/PrimeMark";

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ---------- hero ---------- */}
      <section className="hero">
        <div className="hero-glow">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="eyebrow">
          <span className="dot" />
          prime · adj. · en tu punto más alto
        </div>

        <h1>
          Alcanzá tu <span className="prime-word">prime</span>.
        </h1>
        <p className="sub">
          La app que organiza tu rutina diaria y mide tu progreso real — físico,
          mental, personal y laboral — en un solo lugar.
        </p>

        <div className="cta-row">
          <Link href="/signup" className="btn-primary">
            Empezar gratis
          </Link>
          <a href="#como-funciona" className="btn-secondary">
            Ver cómo funciona →
          </a>
        </div>

        <div className="sequence-section">
          <PrimeSequence />
          <p className="sequence-caption">
            no todos los días pesan igual. los que construyen, cuentan.
          </p>
        </div>

        <div className="stats-strip">
          <div className="stat">
            <div className="num serif">4</div>
            <div className="label">áreas de vida</div>
          </div>
          <div className="stat">
            <div className="num serif">3</div>
            <div className="label">tipos de meta</div>
          </div>
          <div className="stat">
            <div className="num serif">1</div>
            <div className="label">rutina, todos los días</div>
          </div>
        </div>
      </section>

      {/* ---------- producto ---------- */}
      <section id="producto">
        <div className="section-head reveal">
          <div className="eyebrow">
            <span className="dot" />
            cuatro áreas, un solo sistema
          </div>
          <h2>Tu vida no está dividida en pestañas.</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card fc-fisico reveal reveal-delay-1">
            <div className="feature-icon">F</div>
            <h3>Físico</h3>
            <p>Entrenamiento, sueño y alimentación. Lo que sostiene todo lo demás.</p>
          </div>
          <div className="feature-card fc-mental reveal reveal-delay-2">
            <div className="feature-icon">M</div>
            <h3>Mental</h3>
            <p>
              Foco, calma y claridad. Meditación, journaling, lo que te ordena la
              cabeza.
            </p>
          </div>
          <div className="feature-card fc-personal reveal reveal-delay-3">
            <div className="feature-icon">P</div>
            <h3>Personal</h3>
            <p>
              Lectura, idiomas, proyectos propios. Tu crecimiento fuera del
              trabajo.
            </p>
          </div>
          <div className="feature-card fc-laboral reveal reveal-delay-4">
            <div className="feature-icon">L</div>
            <h3>Laboral</h3>
            <p>Bloques de foco reales, no otra lista de tareas que nadie revisa.</p>
          </div>
        </div>
      </section>

      {/* ---------- cómo funciona ---------- */}
      <section id="como-funciona">
        <div className="section-head reveal">
          <div className="eyebrow">
            <span className="dot" />
            tu día, de un vistazo
          </div>
          <h2>Mirá tu día, no una lista.</h2>
        </div>

        <div className="showcase-frame reveal">
          <div className="frame-bar">
            <div className="frame-dot" />
            <div className="frame-dot" />
            <div className="frame-dot" />
          </div>
          <div className="frame-body">
            <div className="fb-row">
              <div className="fb-greet">
                viernes 24 de julio<strong>Hola, buenas tardes</strong>
              </div>
              <div className="fb-streak">12 días</div>
            </div>
            <div className="fb-now">
              <div className="fb-now-top">
                <span>ahora · 11:42</span>
                <span>editar</span>
              </div>
              <div className="fb-now-title">Bloque de foco</div>
              <div className="fb-now-sub">Trabajo · 9:00–13:30 · quedan 108 min</div>
              <div className="fb-bar">
                <div className="fb-bar-fill" />
              </div>
            </div>
            <div className="fb-areas">
              <div className="fb-area fa-fisico">
                <div className="n">Físico</div>
                <div className="d">6 de 7</div>
              </div>
              <div className="fb-area fa-mental">
                <div className="n">Mental</div>
                <div className="d">4 de 7</div>
              </div>
              <div className="fb-area fa-personal">
                <div className="n">Personal</div>
                <div className="d">7 de 7</div>
              </div>
              <div className="fb-area fa-laboral">
                <div className="n">Laboral</div>
                <div className="d">3 de 7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- cita ---------- */}
      <section className="quote-section">
        <div className="eyebrow reveal">
          <span className="dot" />
          tu frase, no la nuestra
        </div>
        <blockquote className="reveal reveal-delay-1">
          &ldquo;La disciplina de hoy es la libertad de mañana.&rdquo;
        </blockquote>
        <p className="quote-attr reveal reveal-delay-2">
          — editable desde tu perfil. la app se adapta a tus palabras, no al
          revés.
        </p>
      </section>

      {/* ---------- tres pasos ---------- */}
      <section>
        <div className="section-head reveal">
          <div className="eyebrow">
            <span className="dot" />
            tres pasos
          </div>
          <h2>Empezar te toma diez minutos.</h2>
        </div>

        <div className="steps">
          <div className="step reveal">
            <div className="step-num">01</div>
            <div className="step-body">
              <h3>Definí tus áreas y tus metas</h3>
              <p>
                Elegí qué querés trackear en cada área — con meta numérica,
                duración o simplemente sí/no.
              </p>
            </div>
          </div>
          <div className="step reveal reveal-delay-1">
            <div className="step-num">02</div>
            <div className="step-body">
              <h3>Armá tu rutina semanal</h3>
              <p>
                Bloques de horario reales, no un calendario genérico. Copiá un día
                a toda la semana en un toque.
              </p>
            </div>
          </div>
          <div className="step reveal reveal-delay-2">
            <div className="step-num">03</div>
            <div className="step-body">
              <h3>Trackeá tu progreso, día a día</h3>
              <p>
                Rachas, calendario real y un insight simple de qué hábito te está
                costando más.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- cta final ---------- */}
      <section className="final-cta">
        <h2 className="reveal">Tu prime empieza el día que decidís medirlo.</h2>
        <div className="reveal reveal-delay-1">
          <Link href="/signup" className="btn-primary">
            Crear mi cuenta gratis
          </Link>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer>
        <div className="footer-inner">
          <span className="logo" style={{ fontSize: "18px" }}>
            <PrimeMark size={20} />
            prime
          </span>
          <div className="footer-links">
            <a href="#producto">Producto</a>
            <a href="#como-funciona">Cómo funciona</a>
          </div>
          <span className="footer-tag">f′(vos) · © 2026</span>
        </div>
      </footer>

      <ScrollReveal />
    </>
  );
}
