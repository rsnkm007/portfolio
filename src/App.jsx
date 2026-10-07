import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDownload, FaAdjust, FaEye } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import './App.css'

const roles = ['Software Developer', 'Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver']
const nav = ['about', 'skills', 'experience', 'projects', 'education', 'contact']

const skills = {
  Languages: ['JavaScript', 'Python', 'Java', 'PL/SQL', 'C++', 'C'],
  Frontend: ['React', 'Tailwind CSS', 'HTML/CSS', 'UI/UX Design'],
  Backend: ['Node.js', 'Spring Boot', 'MySQL', 'MongoDB', 'SQLite', 'REST APIs'],
  'Tools & Platforms': ['Git', 'GitHub', 'PostgreSQL', 'Cursor', 'Claude'],
  'Core Skills': ['Software Development', 'Data Structures & Algorithms', 'Problem Solving', 'Software Testing', 'Software Engineering'],
}

const jobs = [
  { logo: 'WI', period: 'July 2026 – Present', role: 'MERN Stack Web Developer Intern', company: 'Wisdom Tech IT Service · Internship', link: 'https://bigb-frontend.vercel.app/', big: 'NOW', unit: 'Ongoing',
    desc: 'Developed scalable MERN stack applications using MongoDB, Express.js, React.js, and Node.js. Built reusable React components and RESTful APIs, collaborated through Git, and improved performance and responsive UI.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'UI/UX Design'] },
  { logo: 'TB', period: 'Mar 2024 – May 2024', role: 'Full Stack Web Developer Intern', company: 'Teckky Bench · Internship', big: 3, unit: 'Months',
    desc: 'Built a Fashion E-commerce web application with user authentication, product catalog, shopping cart, order tracking, and an admin dashboard.',
    tags: ['React.js', 'Node.js', 'JavaScript', 'HTML/CSS', 'MySQL'] },
]

const projects = [
  { icon: '🌿', title: 'Plant Website', genre: 'Lifestyle', link: 'https://rsnkm007.github.io/plant/', desc: 'Modern, responsive plant-themed website with an elegant interface, smooth animations and interactive components.', tags: ['React.js', 'JavaScript', 'HTML/CSS'] },
  { icon: '🛒', title: 'E-Commerce Platform', genre: 'Shopping', desc: 'Fashion e-commerce with browsing, cart, secure checkout, authentication, order tracking and an admin dashboard.', tags: ['React.js', 'Node.js', 'UI/UX Design'] },
  { icon: '🩺', title: 'Doctor Appointment System', genre: 'Medical', desc: 'Appointment booking with authentication, scheduling and admin controls. React, Node.js and MySQL.', tags: ['React.js', 'Node.js', 'MySQL'] },
  { icon: '🏫', title: 'Student Review Management', genre: 'Education', desc: 'System for submitting and managing teacher reviews with CRUD operations and form validation.', tags: ['Python', 'Flask', 'SQLite'] },
  { icon: '🩸', title: 'Blood Bank Management', genre: 'Health', desc: 'Streamlines blood inventory, donor tracking and recipient coordination with roles and reporting.', tags: ['PHP', 'HTML/CSS', 'MySQL'] },
]

const edu = [
  ['2024 – 2026', 'MCA (Master of Computer Applications)', 'Amrita Vishwa Vidyapeetham, Mysuru', 'CGPA 8.17 / 10'],
  ['2021 – 2024', 'BCA (Bachelor of Computer Applications)', 'JSS Science & Technology University, Mysuru', 'CGPA 8.43 / 10'],
  ['2018 – 2020', 'PUC', 'SVEI Composite PU College', '54.55%'],
  ['2017 – 2018', 'SSLC', "St. Joseph's High School, Mysuru", '65.28%'],
]
const certs = [['🎓', 'Software Engineering', 'Infosys Springboard', '2025'], ['☕', 'Java Badge', 'Oracle', '2026']]
const stats = [['Years Exp.', 0, ''], ['Projects', 5, '+'], ['Freelancing', 2, '+'], ['Technologies', 12, '+'], ['Certifications', 2, '']]

function Counter({ to, suffix = '', pad = 0 }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      o.disconnect()
      const start = performance.now(), dur = 1600
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.4 })
    o.observe(ref.current)
    return () => o.disconnect()
  }, [to])
  return <span ref={ref}>{String(n).padStart(pad, '0')}{suffix}</span>
}

function glow(e) {
  const c = e.currentTarget, r = c.getBoundingClientRect()
  const x = e.clientX - r.left, y = e.clientY - r.top
  c.style.transform = `perspective(900px) rotateX(${((y - r.height / 2) / r.height) * -3}deg) rotateY(${((x - r.width / 2) / r.width) * 3}deg) translateY(-4px)`
  c.style.setProperty('--gx', `${x}px`)
  c.style.setProperty('--gy', `${y}px`)
}
const fx = { onMouseMove: glow, onMouseLeave: (e) => (e.currentTarget.style.transform = '') }

function Sec({ id, eyebrow, title, children }) {
  return (
    <section id={id}>
      <div className="wrap">
        <p className="eyebrow reveal">{eyebrow}</p>
        <h2 className="reveal">{title}</h2>
        {children}
      </div>
    </section>
  )
}

// ---------- Showcase animations: word splitting, hero scroll progress, word highlight ----------
// wrap each word of an element in a span (once)
function split(el, wrap) {
  if (el.dataset.split) return []
  el.dataset.split = '1'
  const text = el.textContent.trim()
  el.setAttribute('aria-label', text)
  el.textContent = ''
  return text.split(/\s+/).map((word, i) => {
    const outer = document.createElement('span')
    outer.setAttribute('aria-hidden', 'true')
    const inner = wrap(outer, i)
    inner.textContent = word
    el.append(outer, ' ')
    return outer
  })
}

function useShowcase() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const mq = window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)')

    // 1. headings: words rise out of a mask, one after another
    document.querySelectorAll('h2').forEach((h) => {
      if (h.classList.contains('edu-h2') && mq.matches) return
      split(h, (outer, i) => {
        outer.className = 'w'
        const inner = document.createElement('i')
        inner.style.setProperty('--i', i)
        outer.append(inner)
        return inner
      })
    })

    // 2. About text: words light up as you scroll (Apple-style)
    const groups = [...document.querySelectorAll('.about p')].map((p) => ({
      p,
      words: split(p, (outer) => { outer.className = 'wd'; return outer }),
    }))

    // 3. tags pop in one after another
    document.querySelectorAll('.tags').forEach((g) =>
      g.querySelectorAll('.tag').forEach((t, i) => t.style.setProperty('--t', i))
    )

    // 4. scroll progress: hero parallax + word highlight + education zoom-settle
    const hero = document.getElementById('home')
    const eduIntro = document.querySelector('.edu-intro')
    const eduTitle = document.querySelector('.edu-title')
    let ticking = false

    // The zoom/torch effect only runs on laptops/desktops (wide screen + mouse). Phones and tablets use the same
    // reveal as the other sections (scaling the title up there made the browser zoom the whole page out).
    // measured once (and on resize) instead of on every scroll frame, to avoid layout thrashing
    let tw = 0, stageLeft = 0, stageH = 0, introH = 0, lastP = -1
    const measure = () => {
      if (!eduIntro || !eduTitle) return
      const stage = eduIntro.firstElementChild
      tw = eduTitle.offsetWidth
      stageH = stage.offsetHeight
      introH = eduIntro.offsetHeight
      stageLeft = stage.getBoundingClientRect().left
      lastP = -1
    }
    measure()
    document.fonts?.ready.then(() => { measure(); onScroll() })

    const update = () => {
      ticking = false
      const vh = window.innerHeight

      // education intro: title starts zoomed to full screen, settles to normal size,
      // while a torch of light sweeps left and right across it
      if (eduIntro && eduTitle && mq.matches && tw) {
        const stage = eduIntro.firstElementChild
        const range = Math.max(introH - stageH, 1)
        const raw = Math.min(Math.max((vh * 0.18 - eduIntro.getBoundingClientRect().top) / range, 0), 1)
        const p = Math.min(Math.max((raw - 0.08) / 0.82, 0), 1)   // short hold, then settle
        if (p !== lastP) {                                         // nothing changed -> no style work
          lastP = p
          const e = p * p * (3 - 2 * p)                            // smooth ease
          const ez = 1 - e                                         // 1 = zoomed, 0 = settled
          const sMax = Math.min((document.documentElement.clientWidth * 0.92) / tw, 3.4)
          const ex = document.documentElement.clientWidth / 2 - (sMax * tw) / 2 - stageLeft
          stage.style.setProperty('--ez', ez.toFixed(3))
          stage.style.setProperty('--es', (1 + (sMax - 1) * ez).toFixed(3))
          stage.style.setProperty('--ex', `${(ex * ez).toFixed(1)}px`)
          stage.style.setProperty('--tx', `${(50 + 60 * Math.sin(p * Math.PI * 3)).toFixed(1)}%`)  // torch position
        }
      }

      const hp = hero ? Math.min(Math.max(window.scrollY / (hero.offsetHeight * 0.8), 0), 1) : 0
      root.style.setProperty('--hp', hp.toFixed(3))
      groups.forEach(({ p, words }) => {
        if (!words.length) return
        const r = p.getBoundingClientRect()
        const prog = Math.min(Math.max((vh * 0.95 - r.top) / (vh * 0.3), 0), 1)
        const n = Math.round(prog * words.length)
        words.forEach((w, i) => w.classList.toggle('lit', i < n))
      })
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    let lastW = window.innerWidth
    const onResize = () => {
      // phones fire "resize" whenever the URL bar shows/hides while scrolling; only re-measure on a real width change
      if (window.innerWidth === lastW) return
      lastW = window.innerWidth
      measure()
      onScroll()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}

// ---------- Remember scroll position across refreshes ----------
const SCROLL_KEY = 'portfolio-scroll-y'
const getSavedScroll = () => {
  try { return Number(sessionStorage.getItem(SCROLL_KEY)) || 0 } catch { return 0 }
}
// we restore the position ourselves (the browser's own restore fires too late and conflicts with the intro)
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

function useScrollMemory() {
  // restore (runs before paint, so there's no flash from the top)
  useLayoutEffect(() => {
    const saved = getSavedScroll()
    if (saved <= 40) return
    let userMoved = false
    const stop = () => { userMoved = true }
    const evts = ['wheel', 'touchstart', 'keydown', 'mousedown']
    evts.forEach((ev) => window.addEventListener(ev, stop, { passive: true, once: true }))
    const restore = () => { if (!userMoved) window.scrollTo({ top: saved, behavior: 'instant' }) }
    restore()
    // page height can change once fonts/images load, so re-apply (unless the user already scrolled)
    window.addEventListener('load', restore, { once: true })
    document.fonts?.ready.then(restore)
    const t = setTimeout(restore, 400)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', restore)
      evts.forEach((ev) => window.removeEventListener(ev, stop))
    }
  }, [])

  // save
  useEffect(() => {
    let ticking = false
    const save = () => {
      ticking = false
      try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))) } catch {}
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(save) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', save)
    }
  }, [])
}

// ---------- Intro: the dot of the "i" in "Hi" starts as a full-screen circle, zooms out to its real size and
// settles in its place. Then the whole page loads in while the dot bounces up and settles back. ----------
function useIntro() {
  useLayoutEffect(() => {
    const root = document.documentElement
    // skip the intro if the user was scrolled down before refreshing (their position is restored instead)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || getSavedScroll() > 40) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    root.classList.add('intro')
    let off = false, started = false, landed = false
    const timers = []
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))
    const finish = () => { timers.forEach(clearTimeout); root.classList.remove('intro', 'go', 'land', 'done') }
    const land = () => {            // dot has settled: load the whole page AND bounce the dot, together
      if (landed || off) return
      landed = true
      root.classList.add('land')
      later(done, 1700)             // safety net if the bounce's animationend never fires
      later(finish, 2600)           // let the content animations play out, then clean up
    }
    const done = () => root.classList.add('done')   // bounce finished: hand over to the real dot
    const begin = () => {
      if (off || started) return
      started = true
      const dot = document.querySelector('.i-dot')
      const ov = document.querySelector('.intro-dot')
      if (!dot || !ov) { finish(); return }
      const r = dot.getBoundingClientRect()
      const d = r.width
      const vw = root.clientWidth, vh = window.innerHeight
      const fcx = r.left + d / 2, fcy = r.top - 24 + d / 2                 // h1 still sits 24px low while fading in
      const W = 2 * Math.hypot(Math.max(fcx, vw - fcx), Math.max(fcy, vh - fcy)) + 40   // big enough to flood the screen
      const sf = d / W                                                     // the dot's real size
      const set = (k, v) => ov.style.setProperty(k, v)
      set('--W', `${W}px`)
      set('--tx', `${fcx - W / 2}px`); set('--ty', `${fcy - W / 2}px`)    // centred exactly on the "i" dot
      set('--sf', sf.toFixed(6))
      set('--bh', `${Math.max(56, d * 5).toFixed(0)}px`)               // bounce height
      set('--s1', Math.pow(sf, 0.25).toFixed(6)); set('--s2', Math.pow(sf, 0.5).toFixed(6)); set('--s3', Math.pow(sf, 0.75).toFixed(6))
      void ov.offsetWidth
      root.classList.add('go')
      ov.addEventListener('animationend', (e) => { if (e.animationName === 'dot-s') land(); else if (e.animationName === 'dot-b') done() })
      later(land, 2400)             // safety net if animationend never fires
    }
    const run = () => (document.fonts?.load ? document.fonts.load('800 1em "Plus Jakarta Sans"', 'Hı').catch(() => {}) : Promise.resolve()).then(() => requestAnimationFrame(begin))
    if (document.readyState === 'complete') run()
    else window.addEventListener('load', run, { once: true })
    later(begin, 3000)
    return () => { off = true; finish() }
  }, [])
}

export default function App() {
  useScrollMemory()
  useShowcase()
  useIntro()
  const typed = useRef(null)
  const hero = useRef(null)
  const bar = useRef(null)
  const form = useRef(null)
  const [active, setActive] = useState('home')
  const [top, setTop] = useState(false)
  const [sending, setSending] = useState(false)

  // themes: 'normal' | 'flip' (colours swapped) | 'contrast' (black & white)
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem('theme')
      if (['normal', 'flip', 'contrast'].includes(t)) return t
      return localStorage.getItem('invert') === '1' ? 'flip' : 'normal'
    } catch { return 'normal' }
  })
  const lastBase = useRef(theme === 'contrast' ? 'normal' : theme)
  const glitchTimers = useRef([])
  const busy = useRef(false)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])
  useEffect(() => () => glitchTimers.current.forEach(clearTimeout), [])

  // wavy ripple between themes: the new theme spreads out from the button with a rippling edge
  const smoothSwap = (target, origin) => {
    const root = document.documentElement
    const apply = () => { root.setAttribute('data-theme', target); setTheme(target) }
    if (!document.startViewTransition) {
      root.classList.add('theme-fade')
      apply()
      setTimeout(() => root.classList.remove('theme-fade'), 900)
      return
    }
    const W = window.innerWidth, H = window.innerHeight
    const x = origin?.x ?? W - 60, y = origin?.y ?? 40
    const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y))
    const DUR = 1300
    const vt = document.startViewTransition(apply)
    vt.ready.then(() => {
      const style = document.createElement('style')
      document.head.append(style)
      const t0 = performance.now()
      const frame = (now) => {
        const p = Math.min((now - t0) / DUR, 1)
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        const base = R * 1.2 * ease
        const amp = R * 0.045 * Math.sin(Math.PI * p)   // wave height grows then settles
        const pts = []
        for (let i = 0; i < 72; i++) {
          const a = (i / 72) * Math.PI * 2
          const rr = base + amp * Math.sin(a * 6 + p * 16)
          pts.push(`${(x + rr * Math.cos(a)).toFixed(1)}px ${(y + rr * Math.sin(a)).toFixed(1)}px`)
        }
        style.textContent = `::view-transition-new(root){clip-path:polygon(${pts.join(',')})}`
        if (p < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
      // old page drifts back slightly so the change feels like a shift
      root.animate(
        { transform: ['scale(1)', 'scale(.965)'], filter: ['brightness(1)', 'brightness(.85)'] },
        { duration: DUR, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards', pseudoElement: '::view-transition-old(root)' }
      )
      vt.finished.finally(() => style.remove())
    }).catch(() => {})
  }

  // switch theme; the glitch animation only runs when `glitch` is true
  // (page shakes + colours flicker, then settles on the new theme)
  const switchTheme = (target, glitch = false, origin) => {
    if (busy.current || target === theme) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setTheme(target); return }
    if (!glitch) { smoothSwap(target, origin); return }
    busy.current = true
    const root = document.documentElement
    const from = theme
    root.classList.add('glitching')
    const seq = [target, from, target, from, target]
    const at = [0, 120, 260, 420, 600]
    const t = glitchTimers.current
    seq.forEach((v, i) => t.push(setTimeout(() => root.setAttribute('data-theme', v), at[i])))
    t.push(setTimeout(() => setTheme(target), 620))
    t.push(setTimeout(() => { root.classList.remove('glitching'); busy.current = false }, 1700))
  }
  // normal <-> flip: wavy ripple, no glitch
  const toggleInvert = (e) => {
    const b = e?.currentTarget?.getBoundingClientRect?.()
    switchTheme(theme === 'normal' ? 'flip' : 'normal', false, b && { x: b.left + b.width / 2, y: b.top + b.height / 2 })
  }
  // contrast on/off: keeps the glitch
  const toggleContrast = () => {
    if (theme === 'contrast') switchTheme(lastBase.current, true)
    else { lastBase.current = theme; switchTheme('contrast', true) }
  }

  useEffect(() => { emailjs.init({ publicKey: 'cthc9fnb-RXexLO8L' }) }, [])

  useEffect(() => {
    let ri = 0, ci = 0, del = false, id
    const tick = () => {
      const cur = roles[ri]
      if (typed.current) typed.current.textContent = cur.slice(0, del ? --ci : ++ci)
      if (!del && ci === cur.length) { del = true; id = setTimeout(tick, 1800); return }
      if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length }
      id = setTimeout(tick, del ? 45 : 90)
    }
    id = setTimeout(tick, 800)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const laptop = window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)')
    const rev = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('visible')
      // phones/tablets: the Academic tiles appear together with the title (laptops keep their own scroll effect)
      if (e.target.matches('.edu-eyebrow, .edu-h2') && !laptop.matches) {
        document.querySelector('.edu-grid')?.classList.add('visible')
      }
    }), { threshold: 0.12 })
    document.querySelectorAll('.reveal, .stagger, .edu-eyebrow, .edu-h2').forEach((el) => rev.observe(el))
    const nv = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { threshold: 0.35 })
    document.querySelectorAll('section[id]').forEach((s) => nv.observe(s))
    const onScroll = () => {
      setTop(window.scrollY > 400)
      const d = document.documentElement
      if (bar.current) bar.current.style.width = `${(window.scrollY / Math.max(d.scrollHeight - d.clientHeight, 1)) * 100}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { rev.disconnect(); nv.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const onHeroMove = (e) => {
    const r = hero.current.getBoundingClientRect()
    hero.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    hero.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const submit = (e) => {
    e.preventDefault()
    const { name, email, subject, message } = e.target
    setSending(true)
    emailjs
      .send('service_6ymf1qa', 'template_8wxi3sq', { from_name: name.value, from_email: email.value, subject: subject.value, message: message.value })
      .then(() => { alert('✅ Message sent successfully!'); form.current.reset() })
      .catch((err) => { console.log(err); alert('❌ Failed to send message.') })
      .finally(() => setSending(false))
  }

  const ticker = Object.values(skills).flat()

  return (
    <>
      <div className="intro-dot" aria-hidden="true" />
      <div className="glitch-fx" aria-hidden="true" />
      <div className="progress"><div ref={bar} /></div>

      <header className="topbar">
        <a className="logo" href="#home" onClick={(e) => { e.preventDefault(); go('home') }}>NANDA KUMAR<i>.</i></a>
        <ul>
          {nav.map((n) => (
            <li key={n}><a href={`#${n}`} className={active === n ? 'on' : ''} onClick={(e) => { e.preventDefault(); go(n) }}>{n}</a></li>
          ))}
        </ul>
        <div className="right">
          <span className="avail"><i />Available for work</span>
          <button className="theme-btn" onClick={toggleInvert} aria-pressed={theme === 'flip'} aria-label="Invert colors">
            <FaAdjust />
          </button>
          <button className="theme-btn" data-tip="Contrast Theme" onClick={toggleContrast} aria-pressed={theme === 'contrast'} aria-label="Toggle black and white contrast theme">
            <FaEye />
          </button>
        </div>
      </header>

      <section id="home" className="hero" ref={hero} onMouseMove={onHeroMove}>
        <div className="blob b1" /><div className="blob b2" />
        <div className="wrap hero-grid">
          <div>
            <p className="status fade d1"><i />Open to opportunities</p>
            <h1 className="fade d2" aria-label="Hi, I'm Nanda Kumar.">H<i className="ii">ı<b className="i-dot" /></i>, I'm <span>Nanda Kumar.</span></h1>
            <p className="role fade d3"><span ref={typed} /><b className="caret" /></p>
            <p className="lead fade d4">I build clean, performant digital products — turning ideas into reality with code, thoughtful design, and a bit of caffeine.</p>
            <div className="cta fade d5">
              <button className="btn solid" onClick={() => go('projects')}>View My Work</button>
              <button className="btn ghost" onClick={() => go('contact')}>Get In Touch →</button>
            </div>
            <div className="socials fade d5">
              <a href="https://github.com/rsnkm007" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/nanda-kumar-m-78a816202/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://twitter.com/rsnkm007" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="mailto:rsnkm007@gmail.com" aria-label="Email"><FaEnvelope /></a>
              <a className="resume" href="https://drive.google.com/file/d/1AOKlsA6Bk9CY3hdJ218xmTdPSoJMJ4TK/view?usp=drive_link" target="_blank" rel="noreferrer"><FaDownload /> Resume</a>
            </div>
          </div>
          <div className="hero-card fade d3">
            <span className="ring" />
            <b className="mono">NKM</b>
            <h3>Full Stack Developer</h3>
            <p>MCA · Graduated</p>
            <span className="chip c1">React</span><span className="chip c2">Spring Boot</span>
            <span className="chip c3">MongoDB</span><span className="chip c4">Node.js</span>
          </div>
        </div>
        <div className="marquee"><div className="track">{[...ticker, ...ticker].map((t, i) => <span key={i}>{t}<b>●</b></span>)}</div></div>
      </section>

      <Sec id="about" eyebrow="About Me" title="Passionate about modern software development.">
        <div className="panel about reveal">
          <div>
            <p>I'm a Full Stack Web Developer and MCA Graduate with practical experience in designing and developing responsive web applications. I enjoy solving real-world problems using React, Node.js, JavaScript, and MySQL while continuously strengthening my software engineering skills.</p>
            <p>I have worked on healthcare, e-commerce, and blood management systems and enjoy creating applications that are efficient, scalable, and easy to use.</p>
          </div>
          <div className="stats">
            {stats.map(([l, n, s]) => <div className="stat" key={l}><strong><Counter to={n} suffix={s} /></strong><span>{l}</span></div>)}
          </div>
        </div>
      </Sec>

      <Sec id="skills" eyebrow="Skills" title="What I work with.">
        <div className="panel stagger skills">
          {Object.entries(skills).map(([cat, list]) => (
            <div className="skill-row" key={cat}>
              <h4>{cat}</h4>
              <div className="tags">{list.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="experience" eyebrow="Experience" title="Where I've worked.">
        <div className="stack">
          {jobs.map((j) => (
            <div className="panel wide reveal" key={j.role} {...fx}>
              <div className="logo-box">{j.logo}</div>
              <div>
                <p className="kicker">{j.period}</p>
                <h3>{j.role}</h3>
                <p className="sub">{j.company}</p>
                <p className="desc">{j.desc}</p>
                <div className="tags">{j.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                {j.link && <a className="btn light" href={j.link} target="_blank" rel="noreferrer">View Project ↗</a>}
              </div>
              <div className="big"><strong>{typeof j.big === 'number' ? <Counter to={j.big} pad={2} /> : j.big}</strong><span>{j.unit}</span></div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="projects" eyebrow="Projects" title="Things I've built.">
        <div className="grid stagger">
          {projects.map((p, i) => (
            <div className="panel card" key={p.title} {...fx}>
              <span className="num"><Counter to={i + 1} pad={2} /></span>
              <div className="card-head"><span className="icon">{p.icon}</span><div><h4>{p.title}</h4><small>{p.genre}</small></div></div>
              <p>{p.desc}</p>
              <div className="tags">{p.tags.map((t) => <span className="tag sm" key={t}>{t}</span>)}</div>
              {p.link && <a className="btn light" href={p.link} target="_blank" rel="noreferrer">Open ↗</a>}
            </div>
          ))}
        </div>
      </Sec>

      <section id="education">
        <div className="wrap">
          <div className="edu-intro">
            <div className="edu-stage">
              <p className="eyebrow edu-eyebrow">Education</p>
              <div className="edu-title">
                <h2 className="edu-h2">Academic background.</h2>
                <span className="edu-lit" aria-hidden="true">Academic background.</span>
              </div>
            </div>
          </div>
          <div className="grid stagger edu-grid">
            {edu.map(([y, d, s, g]) => (
              <div className="panel card" key={d} {...fx}>
                <p className="kicker">{y}</p><h4>{d}</h4><p>{s}</p><span className="grade">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Sec id="certifications" eyebrow="Certifications" title="Credentials & training.">
        <div className="grid stagger">
          {certs.map(([i, n, s, y]) => (
            <div className="panel card cert" key={n} {...fx}>
              <span className="icon">{i}</span>
              <div><h4>{n}</h4><p>{s}</p><span className="kicker">{y}</span></div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="contact" eyebrow="Contact" title="Let's work together.">
        <div className="panel contact reveal">
          <div>
            <p className="desc">Have a project in mind or just want to say hi? My inbox is always open.</p>
            {[['📧', 'Email', 'rsnkm007@gmail.com'], ['📱', 'Phone', '+91 9380112158'], ['📍', 'Location', 'Mysuru, Karnataka, India']].map(([i, l, t]) => (
              <div className="info" key={l}><span className="icon">{i}</span><div><small>{l}</small><b>{t}</b></div></div>
            ))}
          </div>
          <form ref={form} onSubmit={submit}>
            <label>Your Name<input name="name" placeholder="Your Name" required /></label>
            <label>Email Address<input type="email" name="email" placeholder="your@email.com" required /></label>
            <label>Subject<input name="subject" placeholder="Subject" required /></label>
            <label>Message<textarea name="message" placeholder="Write your message..." required /></label>
            <button className="btn solid full" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </Sec>

      <footer>Designed & built by <b>Nanda Kumar</b> · 2026 · All rights reserved</footer>
      <button className={`totop ${top ? 'show' : ''}`} aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  )
}