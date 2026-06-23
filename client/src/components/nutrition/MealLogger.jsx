import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export function MealLogger({ onSubmit, loading }) {
  const [description, setDescription] = useState('')
  const [mealType, setMealType] = useState('lunch')
  const [estimating, setEstimating] = useState(false)
  const [preview, setPreview] = useState(null)
  
  const [imageFile, setImageFile] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [mimeType, setMimeType] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Data = event.target.result.split(',')[1]
      setImageBase64(base64Data)
      setMimeType(file.type)
      setImageFile(URL.createObjectURL(file))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImageBase64(null)
    setMimeType(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEstimate = async () => {
    if (!description.trim() && !imageBase64) return
    setEstimating(true)
    try {
      if (imageBase64) {
        const { data } = await api.post('/api/ai/meal-vision', { 
          base64Image: imageBase64, 
          mimeType, 
          description 
        })
        setPreview(data)
      } else {
        const { data } = await api.post('/api/ai/meal-macro', { description })
        setPreview(data)
      }
    } catch (err) {
      toast.error('AI estimation failed. Please try again.')
      console.error(err)
    } finally {
      setEstimating(false)
    }
  }

  const handleLog = () => {
    onSubmit({
      meal_description: description || 'Photo log',
      meal_type: mealType,
      ai_calories: preview?.calories,
      ai_protein_g: preview?.protein_g,
      ai_carbs_g: preview?.carbs_g,
      ai_fats_g: preview?.fats_g,
    })
    setDescription('')
    setPreview(null)
    removeImage()
  }

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>🥗 Log a Meal</h3>
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
        {mealTypes.map(t => (
          <button key={t} onClick={() => setMealType(t)}
            style={{
              flex: 1, padding: '0.5rem', borderRadius: 8, fontSize: '0.7rem',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600, cursor: 'pointer',
              border: `1.5px solid ${mealType === t ? '#22C55E' : 'var(--border)'}`,
              background: mealType === t ? '#F0FDF4' : 'var(--bg)',
              color: mealType === t ? '#16A34A' : 'var(--muted)',
              textTransform: 'capitalize', transition: 'all 0.15s',
            }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
        <textarea
          className="input"
          placeholder="Describe your meal naturally, or upload a photo... e.g. 'I had 2 idli with sambar'"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          style={{ resize: 'vertical', paddingRight: '3rem' }}
        />
        <label style={{ 
          position: 'absolute', bottom: '0.75rem', right: '0.75rem', 
          cursor: 'pointer', background: 'var(--surface)', padding: '0.4rem', 
          borderRadius: 8, border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s'
        }}>
          <Camera size={18} color="var(--muted)" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>
      </div>

      {imageFile && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          <img src={imageFile} alt="Meal preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
          <button onClick={removeImage} style={{ 
            position: 'absolute', top: -6, right: -6, background: 'var(--surface)', 
            border: '1px solid var(--border)', borderRadius: '50%', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22 
          }}>
            <X size={12} color="var(--text)" />
          </button>
        </motion.div>
      )}
      
      {preview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: '#F0FDF4', borderRadius: 12, padding: '1rem',
            marginBottom: '0.875rem', border: '1.5px solid #22C55E40',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', marginBottom: '0.625rem' }}>
            🤖 AI ESTIMATE {preview.confidence && `(${preview.confidence} confidence)`}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            {[
              { label: 'Calories', value: preview.calories, unit: 'kcal', color: '#F97316' },
              { label: 'Protein', value: preview.protein_g, unit: 'g', color: '#22C55E' },
              { label: 'Carbs', value: preview.carbs_g, unit: 'g', color: '#F59E0B' },
              { label: 'Fats', value: preview.fats_g, unit: 'g', color: '#EF4444' },
            ].map(({ label, value, unit, color }) => (
              <div key={label}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color }}>{value}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{label} ({unit})</div>
              </div>
            ))}
          </div>
          {preview.note && <p style={{ fontSize: '0.7rem', color: '#65A30D', marginTop: '0.5rem', fontStyle: 'italic' }}>{preview.note}</p>}
        </motion.div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className="btn btn-secondary"
          onClick={handleEstimate}
          disabled={(!description.trim() && !imageBase64) || estimating}
          style={{ flex: 1 }}
        >
          {estimating ? 'Estimating...' : '🤖 Estimate Macros'}
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 1, background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
          onClick={handleLog}
          disabled={(!description.trim() && !imageBase64) || loading}
        >
          {loading ? 'Saving...' : 'Log Meal ✓'}
        </button>
      </div>
    </div>
  )
}

export function MacroRings({ today, goals }) {
  const macros = [
    { key: 'calories', label: 'Calories', value: today?.calories || 0, goal: goals?.calorie_target || 2000, color: '#F97316', unit: 'kcal' },
    { key: 'protein', label: 'Protein', value: today?.protein_g || 0, goal: goals?.protein_target || 120, color: '#22C55E', unit: 'g' },
    { key: 'carbs', label: 'Carbs', value: today?.carbs_g || 0, goal: 250, color: '#F59E0B', unit: 'g' },
    { key: 'fats', label: 'Fats', value: today?.fats_g || 0, goal: 65, color: '#EF4444', unit: 'g' },
  ]

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>📊 Today's Macros</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {macros.map(({ key, label, value, goal, color, unit }) => {
          const pct = Math.min(100, Math.round((value / goal) * 100))
          const circumference = 2 * Math.PI * 30
          const offset = circumference - (pct / 100) * circumference
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ position: 'relative', width: 80, height: 80 }}>
                <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={40} cy={40} r={30} fill="none" stroke="var(--border)" strokeWidth={8} />
                  <motion.circle
                    cx={40} cy={40} r={30} fill="none" stroke={color} strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem', color }}>{pct}%</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.9rem', color }}>
                  {value}{unit}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{label} / {goal}{unit}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function WaterTracker({ glasses = 0, goal = 8, onAdd, onRemove }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem' }}>💧 Water Intake</h3>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#0EA5E9', fontSize: '1.1rem' }}>
          {glasses}/{goal} glasses
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.375rem', marginBottom: '1rem' }}>
        {Array.from({ length: goal }, (_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85 }}
            onClick={() => i < glasses ? onRemove() : onAdd()}
            style={{
              aspectRatio: '1', borderRadius: 8, cursor: 'pointer',
              background: i < glasses ? '#0EA5E9' : 'var(--bg)',
              border: `2px solid ${i < glasses ? '#0EA5E9' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', transition: 'all 0.2s',
            }}
          >
            {i < glasses ? '💧' : ''}
          </motion.button>
        ))}
      </div>
      <div style={{ height: 6, background: 'var(--bg)', borderRadius: 99 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(glasses / goal) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)', borderRadius: 99 }}
        />
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem', textAlign: 'center' }}>
        {glasses >= goal ? '🎉 Daily goal reached!' : `${goal - glasses} more glasses to go!`}
      </p>
    </div>
  )
}
