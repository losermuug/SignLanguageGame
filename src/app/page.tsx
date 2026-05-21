import Link from "next/link";
import { ArrowRight, Camera, Hand, Sparkles, Target, Trophy } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

const features = [
  {
    icon: Camera,
    title: "Камераар танина",
    body: "Гарын цэгийг бодит цагт уншиж, зөв үсгээ дохиж байгаа эсэхийг шалгана.",
  },
  {
    icon: Target,
    title: "Үсгээр дадлага хийнэ",
    body: "Сурсан үсгүүдээ давтаж тоглоод, хурдан суралц.",
  },
  {
    icon: Trophy,
    title: "Оноо",
    body: "Дохионы хэлээ давтахдаа оноо цуглуулж өөрийгөө хөгжүүл.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_55%_at_75%_35%,rgba(45,212,191,0.12),transparent_62%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/70" />

        {/* ─ NAV ─ */}
        <header className="relative z-20 px-4 pt-5 sm:px-6 lg:px-8">
          <nav className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/10 shadow-[0_0_24px_rgba(45,212,191,0.12)] backdrop-blur-lg transition-shadow group-hover:shadow-[0_0_32px_rgba(45,212,191,0.24)]">
                <Hand className="h-5 w-5 text-cyber-cyan" />
              </div>
              <span className="text-base font-semibold text-cyber-text">Дохио Тоглоом</span>
            </Link>

            <Link
              href="/game"
              className="btn-shine rounded-full border border-cyber-cyan/25 bg-cyber-cyan/10 px-5 py-2 text-sm font-semibold text-cyber-cyan backdrop-blur-lg transition-all hover:border-cyber-cyan/45 hover:bg-cyber-cyan/20 hover:text-cyber-text"
            >
              Тоглох →
            </Link>
          </nav>
        </header>

        {/* ─ HERO CONTENT ─ */}
        <div
          className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:px-8 lg:py-0"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyber-cyan backdrop-blur-sm"
              style={{ animation: "slide-up 0.5s ease-out both" }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Сур · давт · тогло
            </div>

            {/* Heading */}
            <h1
              className="text-4xl font-bold leading-[1.08] tracking-tight text-cyber-text sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ animation: "slide-up 0.7s ease-out both" }}
            >
              Сур.{" "}
              <span className="gradient-text-green-animated">Давт.</span>
              <br />
              Тогло.
            </h1>

            {/* Subtitle */}
            <p
              className="mt-5 max-w-lg text-base leading-7 text-cyber-text-secondary sm:text-lg"
              style={{ animation: "slide-up 0.9s ease-out both" }}
            >
              Дохионы үсгээ камераар шалгуулж, оноо ба комботой богино
              дадлага хий.
            </p>

            {/* CTAs */}
            <div
              className="mt-8 flex flex-wrap gap-3"
              style={{ animation: "slide-up 1.1s ease-out both" }}
            >
              <Link
                href="/game"
                className="btn-shine group inline-flex items-center gap-2 rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/15 px-7 py-3 text-sm font-semibold text-cyber-text backdrop-blur-sm transition-all hover:border-cyber-cyan/50 hover:bg-cyber-cyan/25 hover:shadow-[0_0_40px_rgba(45,212,191,0.18)]"
              >
                Тоглоом эхлүүлэх
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--panel-border)] bg-[var(--bg-glass)] px-7 py-3 text-sm font-semibold text-cyber-text-secondary backdrop-blur-lg transition-all hover:border-[var(--panel-hover-border)] hover:text-cyber-text"
              >
                Дэлгэрэнгүй
              </a>
            </div>

            {/* Stats row */}
            <div
              className="mt-10 flex gap-8 border-t border-[var(--panel-border)] pt-6"
              style={{ animation: "slide-up 1.3s ease-out both" }}
            >
              {[
                { value: "24", label: "ASL үсэг" },
                { value: "∞", label: "Дадлага" },
                { value: "AI", label: "Таних систем" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-cyber-cyan">{stat.value}</p>
                  <p className="text-xs text-cyber-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative h-44 overflow-hidden rounded-3xl border border-cyber-cyan/20 bg-black/55 shadow-[0_0_70px_rgba(45,212,191,0.14)] backdrop-blur-sm sm:h-56 lg:h-[360px]"
            style={{ animation: "slide-up 0.95s ease-out both" }}
          >
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,transparent_35%,rgba(0,0,0,0.52)_100%)]" />
            <ParticleTextEffect
              words={["СУР", "ДАВТ", "ТОГЛО"]}
              fullscreen
              changeInterval={220}
              colors={[
                { r: 45, g: 212, b: 191 },
                { r: 52, g: 211, b: 153 },
                { r: 16, g: 185, b: 129 },
                { r: 163, g: 230, b: 53 },
              ]}
              className="opacity-95"
            />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <div className="flex flex-col items-center gap-1.5 text-cyber-text-muted animate-[glow-breathe_2.5s_ease-in-out_infinite]">
            <span className="text-[10px] uppercase tracking-[0.2em]">Доош</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Боломжууд</p>
          <h2 className="text-3xl font-bold text-cyber-text sm:text-4xl">
            Яагаад <span className="gradient-text-green">Дохио Тоглоом</span> вэ?
          </h2>
          <p className="mt-3 text-sm leading-6 text-cyber-text-secondary">
            Бодит цагийн AI таних системтэй хослуулсан тоглоомын арга барил.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className="app-card group relative overflow-hidden rounded-2xl p-6"
              style={{ animation: `slide-up 0.6s ease-out ${0.1 + i * 0.12}s both` }}
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/8 transition-colors group-hover:border-cyber-cyan/35 group-hover:bg-cyber-cyan/14">
                <feature.icon className="h-5 w-5 text-cyber-cyan" />
              </div>
              <h3 className="text-base font-semibold text-cyber-text">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-cyber-text-secondary">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
