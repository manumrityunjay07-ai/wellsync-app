import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Database, FileSearch, CheckCircle, Network, Activity, Beaker, Stethoscope, Microscope, Search
} from 'lucide-react'

const frontiers = [
  { id: 1, icon: Beaker, label: 'NIH Grants', desc: 'Research funding', color: '#19789D' },
  { id: 2, icon: Activity, label: 'Clinical Trials', desc: '267K trials', color: '#C8A849' },
  { id: 3, icon: CheckCircle, label: 'FDA Approvals', desc: 'Drug labels', color: '#19789D' },
  { id: 4, icon: Database, label: 'PubMed', desc: '19K+ studies', color: '#C8A849' },
  { id: 5, icon: FileSearch, label: 'Payer Policies', desc: '18,443 docs', color: '#19789D' },
  { id: 6, icon: Stethoscope, label: 'Guidelines', desc: '50+ societies', color: '#C8A849' },
  { id: 7, icon: Microscope, label: 'Biology Layer', desc: 'Genomics/MeSH', color: '#19789D' },
]

const stats = [
  { value: '18,443', label: 'Policy Documents', desc: '39 payers · custom parser per payer' },
  { value: '12,122', label: 'PICO Extractions', desc: 'Study populations, interventions, outcomes' },
  { value: '590K+', label: 'References Parsed', desc: '39 citation format variations' },
  { value: '19,655', label: 'Clinical Studies', desc: 'Verified PMIDs · DOI · NCT · MeSH' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem', background: 'rgba(19, 27, 58, 0.8)',
        backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Network size={22} color="var(--primary)" />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Archimedes
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/demo" className="btn btn-secondary" style={{ padding: '0.625rem 1.5rem', borderColor: 'var(--border)', color: 'var(--muted)' }}>See Demo</Link>
          <Link to="/auth" className="btn btn-secondary" style={{ padding: '0.625rem 1.5rem', borderColor: 'var(--border)', color: 'var(--muted)' }}>Client Login</Link>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
            Access Platform
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 2rem 5rem', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 700 }}>
            Quantitative Analytics
          </h2>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            lineHeight: 1.15, marginBottom: '1.5rem',
            color: '#FFFFFF'
          }}>
            The Healthcare Innovation-to-Access Pipeline
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: 650, margin: '0 auto 3rem' }}>
            Infrastructure no one has built. The 8-page blind spot in payer policy documents — now structured, verified, and computationally queryable.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/demo" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              See Live Demo
            </Link>
            <Link to="/evidence" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Explore Clinical Evidence <Search size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section style={{ padding: '3rem 2rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', fontFamily: 'Space Grotesk' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {stat.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The 7 Frontiers */}
      <section id="frontiers" style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 custom={0} variants={fadeUp} style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: '#FFFFFF' }}>
            Healthcare's Innovation Frontier
          </motion.h2>
          <motion.p custom={1} variants={fadeUp} style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '4rem', fontSize: '1.1rem' }}>
            The only sector of the $4.5 trillion economy with a fully documented, computable pipeline.
          </motion.p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {frontiers.map(({ id, icon: Icon, label, desc, color }, i) => (
              <motion.div key={label} custom={i + 2} variants={fadeUp} style={{ flex: '1 1 140px', maxWidth: 160 }}>
                <div style={{
                  background: 'var(--surface)', borderRadius: 12, padding: '1.5rem 1rem', textAlign: 'center',
                  border: `1px solid ${color}40`, borderTop: `4px solid ${color}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: 99, background: color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: '#131B3A', marginBottom: '1rem'
                  }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#FFFFFF', fontWeight: 600 }}>{label}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 'auto' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>Archimedes Quantitative Analytics</p>
        <p>Connecting all seven frontiers into a single queryable system — for the first time.</p>
      </footer>
    </div>
  )
}
