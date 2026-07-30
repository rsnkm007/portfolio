import { useEffect, useRef, useState } from 'react'
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaDownload
} from "react-icons/fa";
import './App.css'
import bgVideo from './assets/snake.mp4'

function App() {
  const typedTextRef = useRef(null)
  const formRef = useRef(null)
  const heroRef = useRef(null)
  const progressRef = useRef(null)

  const [activeSection, setActiveSection] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [sending, setSending] = useState(false)

  /* ── TYPING EFFECT ── */
  useEffect(() => {
    const roles = ['Software Developer', 'Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver']
    let ri = 0
    let ci = 0
    let deleting = false
    let timeoutId

    function type() {
      const cur = roles[ri]
      if (!deleting) {
        if (typedTextRef.current) typedTextRef.current.textContent = cur.slice(0, ++ci)
        if (ci === cur.length) {
          deleting = true
          timeoutId = setTimeout(type, 1800)
          return
        }
      } else {
        if (typedTextRef.current) typedTextRef.current.textContent = cur.slice(0, --ci)
        if (ci === 0) {
          deleting = false
          ri = (ri + 1) % roles.length
        }
      }
      timeoutId = setTimeout(type, deleting ? 50 : 90)
    }
    timeoutId = setTimeout(type, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  /* ── SCROLL REVEAL + COUNT-UP + ACTIVE NAV + SCROLL PROGRESS + SCROLL-TO-TOP ── */
  useEffect(() => {
    function runCountUp() {
      document.querySelectorAll('.count-up').forEach((el) => {
        const target = parseInt(el.dataset.target, 10)
        if (target === 0) {
          el.textContent = '0'
          return
        }
        let cur = 0
        const step = Math.ceil(target / 30)
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          el.textContent = target === 1 || target === 2 ? cur + '+' : cur + (target > 4 ? '+' : '')
          if (cur >= target) clearInterval(t)
        }, 40)
      })
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )
    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children')
      .forEach((el) => revealObserver.observe(el))

    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view')
        })
      },
      { threshold: 0.35 }
    )
    document.querySelectorAll('.timeline-item').forEach((el) => timelineObserver.observe(el))

    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp()
            aboutObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    const aboutSection = document.getElementById('about')
    if (aboutSection) aboutObserver.observe(aboutSection)

    const sections = document.querySelectorAll('section[id]')
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((s) => navObserver.observe(s))

    function handleScroll() {
      setShowScrollTop(window.scrollY > 400)
      if (progressRef.current) {
        const doc = document.documentElement
        const scrollable = doc.scrollHeight - doc.clientHeight
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
        progressRef.current.style.width = `${pct}%`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      revealObserver.disconnect()
      timelineObserver.disconnect()
      aboutObserver.disconnect()
      navObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /* ── HERO CURSOR SPOTLIGHT ── */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    function handleMove(e) {
      const rect = hero.getBoundingClientRect()
      hero.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      hero.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    hero.addEventListener('mousemove', handleMove)
    return () => hero.removeEventListener('mousemove', handleMove)
  }, [])

  /* ── 3D TILT FOR CARDS ── */
  useEffect(() => {
    const cards = document.querySelectorAll('.project-card, .cert-card, .edu-card')

    function handleMove(e) {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rotateX = ((y - rect.height / 2) / rect.height) * -6
      const rotateY = ((x - rect.width / 2) / rect.width) * 6
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
      card.style.setProperty('--gx', `${(x / rect.width) * 100}%`)
      card.style.setProperty('--gy', `${(y / rect.height) * 100}%`)
    }

    function handleLeave(e) {
      e.currentTarget.style.transform = ''
    }

    cards.forEach((card) => {
      card.addEventListener('mousemove', handleMove)
      card.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleMove)
        card.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  /* ── MAGNETIC HERO BUTTONS ── */
  useEffect(() => {
    const buttons = document.querySelectorAll('.introduction-buttons .btn-primary')

    function handleMove(e) {
      const btn = e.currentTarget
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`
    }

    function handleLeave(e) {
      e.currentTarget.style.transform = ''
    }

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', handleMove)
      btn.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener('mousemove', handleMove)
        btn.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = e.target.name.value
    const email = e.target.email.value
    const subject = e.target.subject.value
    const message = e.target.message.value
    const body = `Name: ${name}\n\nEmail: ${email}\n\nMessage:\n${message}`

    if (window.emailjs) {
      setSending(true)
      window.emailjs.init({ publicKey: 'cthc9fnb-RXexLO8L' })
      window.emailjs
        .send('service_6ymf1qa', 'template_8wxi3sq', {
          from_name: name,
          from_email: email,
          subject,
          message,
        })
        .then(() => {
          alert('✅ Message sent successfully!')
          formRef.current.reset()
          setSending(false)
        })
        .catch((err) => {
          console.log(err)
          alert('❌ Failed to send message.')
          setSending(false)
        })
    } else {
      window.location.href = `mailto:nkm23022003@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    }
  }

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ]

  const dockItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '🙂' },
    { id: 'skills', label: 'Skills', icon: '🧩' },
    { id: 'experience', label: 'Work', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'certifications', label: 'Certs', icon: '📜' },
    { id: 'contact', label: 'Contact', icon: '✉️' },
  ]

  const projects = [
    {
      icon: '🌿',
      title: 'Plant Website',
      genre: 'Lifestyle',
      status: 'live',
      desc: "Designed and developed a modern, responsive plant-themed website to showcase contemporary UI/UX design and frontend development skills. Features an elegant interface, smooth animations, responsive layouts, and interactive components.",
      tags: ['React.js', 'JavaScript', 'HTML/CSS'],
      link: 'https://rsnkm007.github.io/plant/',
    },
    {
      icon: '🛒',
      title: 'E-Commerce Platform',
      genre: 'Shopping',
      status: 'build',
      desc: 'Fashion E-commerce website with React, Node, JavaScript — online browsing, cart management, and secure checkout. Includes user authentication, product catalog, order tracking, and admin dashboard.',
      tags: ['React.js', 'Node.js', 'JavaScript', 'HTML/CSS', 'UI/UX Design'],
    },
    {
      icon: '🩺',
      title: 'Doctor Appointment System',
      genre: 'Medical',
      status: 'build',
      desc: 'Web app for booking doctor appointments with user authentication, scheduling, and admin controls. React frontend, Node.js backend, and MySQL database.',
      tags: ['React.js', 'Node.js', 'JavaScript', 'HTML/CSS', 'MySQL'],
    },
    {
      icon: '🏫',
      title: 'Student Review Management System',
      genre: 'Education',
      status: 'build',
      desc: 'Web-based system for students to submit and manage teacher reviews. Built with Flask/Python, SQLite, and a responsive UI featuring CRUD operations and form validation.',
      tags: ['Python', 'JavaScript', 'HTML/CSS', 'SQLite'],
    },
    {
      icon: '🩸',
      title: 'Blood Bank Management System',
      genre: 'Health & Fitness',
      status: 'build',
      desc: 'Comprehensive system for streamlining blood inventory, donor tracking, and recipient coordination with user roles, real-time updates, and reporting features.',
      tags: ['PHP', 'HTML/CSS', 'MySQL'],
    },
  ]

  return (
    <>
      {/* SCROLL PROGRESS BAR */}
      <div className="scroll-progress-track">
        <div className="scroll-progress-bar" ref={progressRef}></div>
      </div>

      {/* FIXED BACKGROUND */}
      <div className="fixed-bg" aria-hidden="true"></div>

      {/* FIXED BACKGROUND VIDEO */}
<div className="fixed-bg" aria-hidden="true">
  <video
    className="bg-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={bgVideo} type="video/mp4" />
  </video>
</div>

      {/* AMBIENT BACKGROUND BLOBS */}
      <div className="ambient-blobs" aria-hidden="true">
        <span className="blob blob-1"></span>
        <span className="blob blob-2"></span>
        <span className="blob blob-3"></span>
      </div>

      {/* MENU BAR */}
      <nav>
        <div className="window-controls" aria-hidden="true">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <div className="nav-logo">M Nanda Kumar</div>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={activeSection === link.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(link.id)
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="home">
        <div className="introduction-container-main" ref={heroRef}>
          <div className="window-titlebar">
            <div className="window-controls" aria-hidden="true">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="window-title">portfolio — Nanda Kumar</span>
          </div>
          <div className="introduction-container">
            <p className="open-opportunity pulse-badge">open to opportunities</p>
            <h1>
              <span className="fade-in-up d1">Hi, I'm Nanda Kumar</span>
              <span className="role">
                <span id="typed-text" ref={typedTextRef}></span>
                <span className="typed-cursor"></span>
              </span>
            </h1>
            <h2 className="fade-in-up d2">Full Stack Developer</h2>
            <p className="fade-in-up d3">
              I build clean, performant digital products. Passionate about turning ideas into reality with code,
              design, and a bit of caffeine.
            </p>
            <div className="introduction-buttons fade-in-up d4">
              <button className="btn-primary" onClick={() => scrollToId('projects')}>View My Work</button>
              <button className="btn-ghost" onClick={() => scrollToId('contact')}>Get In Touch <span className="chevron">›</span></button>
            </div>
            <div className="hero-socials fade-in-up d5">
              <a
                href="https://github.com/rsnkm007"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/nanda-kumar-m-78a816202/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://twitter.com/rsnkm007"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href="mailto:rsnkm007@gmail.com"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>

              <a
                href="https://drive.google.com/file/d/1x-k5-HpuxQbJWGk5hgB_mrdnId-rP-nN/view?usp=drive_link"
                target="_blank"
                rel="noreferrer"
                className="resume-link"
              >
                <FaDownload />
                <span>Resume</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="glass-section reveal">
          <div className="glass-section-inner about-grid">
            <div className="about-avatar">
              <span className="avatar-ring"></span>
              <span className="avatar-text">NKM</span>
            </div>
            <div className="about-info">
              <p className="eyebrow">About Me</p>
              <h3>Passionate about Software Development with Modern Technologies</h3>
              <p>
                I'm a Full Stack Web Developer and MCA student with practical experience in designing and developing
                responsive web applications. I enjoy solving real-world problems using React, Node.js, JavaScript,
                and MySQL while continuously improving my programming and software engineering skills.
              </p>
              <p>
                I have worked on healthcare, e-commerce, and blood management systems and enjoy creating applications
                that are efficient, scalable, and easy to use.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <div className="stat-val count-up" data-target="0">0</div>
                  <div className="stat-label">Years Exp.</div>
                </div>
                <div className="stat">
                  <div className="stat-val count-up" data-target="5">0</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat">
                  <div className="stat-val count-up" data-target="2">0</div>
                  <div className="stat-label">Freelancing</div>
                </div>
                <div className="stat">
                  <div className="stat-val count-up" data-target="12">0</div>
                  <div className="stat-label">Technologies</div>
                </div>
                <div className="stat">
                  <div className="stat-val count-up" data-target="2">0</div>
                  <div className="stat-label">Certifications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="glass-section reveal">
          <div className="glass-section-inner">
            <p className="eyebrow">Skills</p>
            <h3>What I work with</h3>
            <div className="skills-categories stagger-children">
              <div className="skill-category">
                <div className="skill-category-title">Languages</div>
                <div className="skill-tags">
                  <span className="tag">JavaScript</span>
                  <span className="tag">Python</span>
                  <span className="tag">Java</span>
                  <span className="tag">PL/SQL</span>
                  <span className="tag">C++</span>
                  <span className="tag">C</span>
                </div>
              </div>
              <div className="skill-category">
                <div className="skill-category-title">Frontend</div>
                <div className="skill-tags">
                  <span className="tag">React</span>
                  <span className="tag">Tailwind CSS</span>
                  <span className="tag">HTML/CSS</span>
                  <span className="tag">UI/UX Design</span>
                </div>
              </div>
              <div className="skill-category">
                <div className="skill-category-title">Backend</div>
                <div className="skill-tags">
                  <span className="tag">Node.js</span>
                  <span className="tag">MySQL</span>
                  <span className="tag">MongoDB</span>
                  <span className="tag">SQLite</span>
                  <span className="tag">REST APIs</span>
                </div>
              </div>
              <div className="skill-category">
                <div className="skill-category-title">Tools & Platforms</div>
                <div className="skill-tags">
                  <span className="tag">Git</span>
                  <span className="tag">GitHub</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">Cursor</span>
                  <span className="tag">Claude</span>
                </div>
              </div>
              <div className="skill-category">
                <div className="skill-category-title">Core Skills</div>
                <div className="skill-tags">
                  <span className="tag">Software Development</span>
                  <span className="tag">Data Structures & Algorithms</span>
                  <span className="tag">Problem Solving</span>
                  <span className="tag">Software Testing</span>
                  <span className="tag">Software Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="glass-section reveal">
          <div className="glass-section-inner">
            <p className="eyebrow">Experience</p>
            <h3>Where I've worked</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-period">July 2026 – Present</div>
                <div className="timeline-role">MERN Stack Web Developer Intern</div>
                <div className="timeline-company">Wisdom IT Tech Service · Internship</div>
                <div className="timeline-desc">
                  Developed scalable MERN stack applications using MongoDB, Express.js, React.js, and Node.js. Built
                  reusable React components and RESTful APIs. Collaborated with developers using Git for version
                  control. Improved application performance and responsive UI.
                </div>
                <div className="timeline-skills">
                  <span className="tag small">React.js</span>
                  <span className="tag small">Node.js</span>
                  <span className="tag small">Express.js</span>
                  <span className="tag small">JavaScript</span>
                  <span className="tag small">HTML/CSS</span>
                  <span className="tag small">MongoDB</span>
                  <span className="tag small">UI/UX Design</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-period">Mar 2024 – May 2024</div>
                <div className="timeline-role">Full Stack Web Developer Intern</div>
                <div className="timeline-company">Teckky Bench · Internship</div>
                <div className="timeline-desc">
                  Developed a Fashion E-commerce web application using React, Node.js, JavaScript, HTML, and CSS.
                  Implemented user authentication, product catalog management, shopping cart functionality, order
                  tracking, and an admin dashboard for seamless online shopping.
                </div>
                <div className="timeline-skills">
                  <span className="tag small">React.js</span>
                  <span className="tag small">Node.js</span>
                  <span className="tag small">JavaScript</span>
                  <span className="tag small">HTML/CSS</span>
                  <span className="tag small">MySQL</span>
                  <span className="tag small">UI/UX Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="glass-section reveal">
          <div className="glass-section-inner">
            <p className="eyebrow">Projects</p>
            <h3>Things I've built</h3>
            <div className="projects-grid stagger-children">
              {projects.map((p) => (
                <div className="project-card" key={p.title}>
                  <div className="project-card-header">
                    <div className="app-icon">{p.icon}</div>
                    <div className="app-icon-meta">
                      <h4>{p.title}</h4>
                      <span className="app-genre">{p.genre}</span>
                    </div>
                    {p.link ? (
                      <a href={p.link} className="project-btn" target="_blank" rel="noreferrer">OPEN</a>
                    ) : (
                      <span className="project-btn disabled"></span>
                    )}
                  </div>
                  <p>{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span className="tag small" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <div className="glass-section reveal">
          <div className="glass-section-inner">
            <p className="eyebrow">Education</p>
            <h3>Academic background</h3>
            <div className="edu-grid stagger-children">
              <div className="edu-card">
                <div className="edu-year">2024 – 2026</div>
                <div className="edu-degree">MCA (Master of Computer Applications)</div>
                <div className="edu-school">Amrita Vishwa Vidyapeetham, Mysuru</div>
                <span className="edu-grade">CGPA: 8.17 / 10</span>
              </div>
              <div className="edu-card">
                <div className="edu-year">2021 – 2024</div>
                <div className="edu-degree">BCA (Bachelor of Computer Applications)</div>
                <div className="edu-school">JSS Science & Technology University, Mysuru</div>
                <span className="edu-grade">CGPA: 8.43 / 10</span>
              </div>
              <div className="edu-card">
                <div className="edu-year">2018 – 2020</div>
                <div className="edu-degree">PUC</div>
                <div className="edu-school">SVEI Composite PU College</div>
                <span className="edu-grade">54.55%</span>
              </div>
              <div className="edu-card">
                <div className="edu-year">2017 – 2018</div>
                <div className="edu-degree">SSLC</div>
                <div className="edu-school">St. Joseph's High School, Mysuru</div>
                <span className="edu-grade">65.28%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications">
        <div className="glass-section reveal">
          <div className="glass-section-inner">
            <p className="eyebrow">Certifications</p>
            <h3>Credentials & training</h3>
            <div className="certs-grid stagger-children">
              <div className="cert-card">
                <div className="cert-icon">🎓</div>
                <div>
                  <div className="cert-name">Software Engineering</div>
                  <div className="cert-issuer">Infosys Springboard</div>
                  <div className="cert-year">2025</div>
                </div>
              </div>
              <div className="cert-card">
                <div className="cert-icon">☕</div>
                <div>
                  <div className="cert-name">Java Badge</div>
                  <div className="cert-issuer">Oracle</div>
                  <div className="cert-year">2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="glass-section reveal">
          <div className="glass-section-inner contact-grid">
            <div className="contact-info">
              <p className="eyebrow">Contact</p>
              <h3>Let's work together</h3>
              <p className="contact-lead">Have a project in mind or just want to say hi? My inbox is always open.</p>
              <div className="settings-list">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <div className="contact-item-label">Email</div>
                    <div className="contact-item-text">rsnkm007@gmail.com</div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div>
                    <div className="contact-item-label">Phone</div>
                    <div className="contact-item-text">+91 9380112158</div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <div className="contact-item-label">Location</div>
                    <div className="contact-item-text">Mysuru, Karnataka, India</div>
                  </div>
                </div>
              </div>
            </div>
            <form id="contactForm" className="contact-form" ref={formRef} onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" id="name" name="name" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" id="subject" name="subject" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea id="message" name="message" placeholder="Write your message..." required></textarea>
              </div>
              <button type="submit" className="form-submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <p>
          Designed & built by <strong>Nanda Kumar</strong> · 2026 · All rights reserved
        </p>
      </footer>

      {/* DOCK */}
      <div className="mac-dock" role="navigation" aria-label="Section shortcuts">
        {dockItems.map((item) => (
          <button
            key={item.id}
            className={`dock-icon ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollToId(item.id)}
            aria-label={item.label}
          >
            <span className="dock-icon-glyph">{item.icon}</span>
            <span className="dock-tooltip">{item.label}</span>
            <span className="dock-active-dot"></span>
          </button>
        ))}
      </div>

      <button
        id="scrollTop"
        className={showScrollTop ? 'show' : ''}
        aria-label="Scroll to top"
        onClick={scrollToTop}
      >
        ↑
      </button>
    </>
  )
}

export default App