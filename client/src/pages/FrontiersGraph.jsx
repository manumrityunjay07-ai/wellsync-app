import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Network, Database, FlaskConical, FileText, Activity, BookOpen, ShieldCheck } from 'lucide-react'

const frontiers = [
  { id: 'biology', label: 'Biology Layer', icon: Activity, color: '#EF4444', desc: 'Genomic targets and cellular mechanisms' },
  { id: 'nih', label: 'NIH Grants', icon: Database, color: '#3B82F6', desc: 'Pre-clinical funding and early research' },
  { id: 'trials', label: 'Clinical Trials', icon: FlaskConical, color: '#8B5CF6', desc: 'Phase I-III efficacy and safety data' },
  { id: 'fda', label: 'FDA Approvals', icon: ShieldCheck, color: '#10B981', desc: 'Regulatory labels and warnings' },
  { id: 'pubmed', label: 'PubMed', icon: BookOpen, color: '#F43F5E', desc: 'Peer-reviewed literature' },
  { id: 'guidelines', label: 'Guidelines', icon: FileText, color: '#F59E0B', desc: 'Medical society standards of care' },
  { id: 'payer', label: 'Payer Policies', icon: Network, color: '#D4AF37', desc: 'Insurance coverage and step therapy' }
]

export default function FrontiersGraph() {
  const [activeNode, setActiveNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const mockFeeds = {
    biology: ['New pathway discovered for ALK+', 'Genomic variant rs123 linked to outcome'],
    nih: ['R01 Grant awarded for Asthma ($2.1M)', 'SBIR Phase II: Digital Therapeutics'],
    trials: ['3 new Phase III trials starting today', 'NCT0456123 reported primary endpoints met'],
    fda: ['New label expansion for Keytruda', 'Safety warning updated for GLP-1s'],
    pubmed: ['15 new meta-analyses published today', 'High impact paper on precision medicine'],
    guidelines: ['AHA updated hypertension guidelines', 'ASCO draft guidelines released for comment'],
    payer: ['Aetna removed prior auth for CGM', 'Cigna updated coverage for genetic testing']
  }

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Network color="var(--primary)" />
          THE 7 INNOVATION FRONTIERS
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '3rem' }}>
          Archimedes connects disjointed healthcare silos into a single, queryable intelligence layer.
        </p>

        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Central Hub */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              width: isMobile ? 100 : 140, height: isMobile ? 100 : 140, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--surface), var(--bg))',
              border: '2px solid var(--primary)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Network size={isMobile ? 24 : 36} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ color: 'var(--text)', fontWeight: 800, fontFamily: 'Space Grotesk', fontSize: isMobile ? '0.85rem' : '1.1rem' }}>ARCHIMEDES</div>
          </motion.div>

          {/* Orbital Nodes */}
          {frontiers.map((node, index) => {
            const angle = (index / frontiers.length) * Math.PI * 2 - Math.PI / 2;
            const radius = isMobile ? 140 : 220; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = activeNode === node.id;
            const isDimmed = activeNode && activeNode !== node.id;

            return (
              <motion.div 
                key={node.id}
                style={{ 
                  position: 'absolute',
                  x, y,
                  zIndex: isActive ? 20 : 5
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: isDimmed ? 0.3 : 1, 
                  scale: isActive ? 1.2 : 1 
                }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Connecting Line (SVG approach simulated with div) */}
                <svg style={{ position: 'absolute', top: '50%', left: '50%', overflow: 'visible', pointerEvents: 'none', zIndex: -1 }}>
                  <line 
                    x1={0} y1={0} 
                    x2={-x} y2={-y} 
                    stroke={isActive ? node.color : 'rgba(100, 116, 139, 0.2)'} 
                    strokeWidth={isActive ? 3 : 1}
                    strokeDasharray="4 4"
                  />
                </svg>

                <div 
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    width: isMobile ? 70 : 100, height: isMobile ? 70 : 100,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: `2px solid ${node.color}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: isActive ? `0 0 20px ${node.color}40` : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <node.icon size={isMobile ? 18 : 24} color={node.color} style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: 'var(--text)', fontSize: isMobile ? '0.6rem' : '0.75rem', fontWeight: 600, textAlign: 'center', padding: '0 0.5rem' }}>
                    {node.label}
                  </div>
                </div>

                {/* Tooltip */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--surface)',
                      border: `1px solid ${node.color}`,
                      padding: '0.75rem',
                      borderRadius: 8,
                      width: 180,
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ color: node.color, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{node.label}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{node.desc}</div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

      </motion.div>

      {/* Side Panel */}
      {selectedNode && (
        <motion.div 
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: isMobile ? '100%' : 350,
            background: 'var(--surface)', borderLeft: `2px solid ${selectedNode.color}`,
            padding: '2rem', zIndex: 100, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', overflowY: 'auto'
          }}
        >
          <button 
            onClick={() => setSelectedNode(null)}
            className="btn btn-ghost" 
            style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}
          >
            Close
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${selectedNode.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <selectedNode.icon size={24} color={selectedNode.color} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text)' }}>{selectedNode.label}</h3>
              <p style={{ color: selectedNode.color, fontSize: '0.85rem', fontWeight: 600 }}>Live Data Feed</p>
            </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            {selectedNode.desc}. Archimedes continuously monitors this frontier for actionable intelligence.
          </p>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Recent Updates</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockFeeds[selectedNode.id].map((feed, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Just now</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.4 }}>{feed}</div>
              </motion.div>
            ))}
          </div>
          
          <div style={{ marginTop: 'auto', textAlign: 'center' }}>
            <button className="btn btn-primary" style={{ width: '100%', background: selectedNode.color, borderColor: selectedNode.color }}>
              Explore Full Database
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
