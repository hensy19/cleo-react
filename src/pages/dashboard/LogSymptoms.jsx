import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, 
  Thermometer, 
  Wind, 
  Brain, 
  Zap, 
  Heart, 
  Smile, 
  Activity, 
  Utensils 
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import './LogSymptoms.css'

export default function LogSymptoms() {
  const navigate = useNavigate()
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [suggestedTip, setSuggestedTip] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const symptoms = [
    { id: 'cramps', icon: <Thermometer size={24} />, label: t('cramps') },
    { id: 'bloating', icon: <Wind size={24} />, label: t('bloating') },
    { id: 'headache', icon: <Brain size={24} />, label: t('headache') },
    { id: 'fatigue', icon: <Zap size={24} />, label: t('fatigue') },
    { id: 'anxiety', icon: <Heart size={24} />, label: t('anxiety') },
    { id: 'mood', icon: <Smile size={24} />, label: t('moodSwings') },
    { id: 'energy', icon: <Activity size={24} />, label: t('highEnergy') },
    { id: 'appetite', icon: <Utensils size={24} />, label: t('increasedAppetite') }
  ]

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedSymptoms.length === 0) return

    setIsLoading(true)
    setTimeout(() => {
      const logs = JSON.parse(localStorage.getItem('symptomLogs') || '[]')
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        symptoms: selectedSymptoms,
        notes,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('symptomLogs', JSON.stringify([...logs, newEntry]))
      
      // Analysis for relevant tip
      const tipsMapping = {
        'cramps': { title: 'Heat Therapy', content: 'Apply a heating pad to your lower abdomen for 15-20 minutes to relieve menstrual cramps.', color: 'pink' },
        'bloating': { title: 'Reduce Bloating', content: 'Avoid salty foods and drink plenty of water. Potassium-rich foods like bananas can help.', color: 'green' },
        'fatigue': { title: 'Iron-Rich Foods', content: 'Include spinach, lentils, and red meat in your diet to replenish iron lost during menstruation.', color: 'green' },
        'headache': { title: 'Stay Hydrated', content: 'Drinking plenty of water and getting rest can help alleviate menstrual headaches.', color: 'lightblue' }
      }
      
      // Pick first matched symptom or default
      const matchedSymptom = selectedSymptoms.find(s => tipsMapping[s])
      setSuggestedTip(tipsMapping[matchedSymptom] || { 
        title: 'Managing PMS Symptoms', 
        content: 'Stay hydrated, reduce caffeine, and get adequate sleep to minimize menstruation-related symptoms.',
        color: 'pink'
      })
      
      setIsLoading(false)
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="symptom-logger-page">
        
        <div className="symptom-logger-header">
          <button className="back-arrow-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={32} />
            <span>{t('symptomLogger')}</span>
          </button>
          <p className="symptom-logger-subtitle">{t('trackPhysicalEmotional')}</p>
        </div>

        {!suggestedTip ? (
          <div className="symptom-cards-container">
            {/* Main Selection Card */}
            <div className="symptom-card selection-card">
              <h3>{t('selectYourSymptoms')}</h3>
              
              <div className="symptoms-grid-modern">
                {symptoms.map(symptom => (
                  <button
                    key={symptom.id}
                    className={`symptom-item-btn ${selectedSymptoms.includes(symptom.id) ? 'active' : ''}`}
                    onClick={() => toggleSymptom(symptom.id)}
                  >
                    <div className="symptom-icon-box">{symptom.icon}</div>
                    <span className="symptom-label-text">{symptom.label}</span>
                  </button>
                ))}
              </div>

              <div className="symptom-card-footer">
                <button 
                  className="save-symptoms-pill-btn" 
                  onClick={handleSubmit}
                  disabled={selectedSymptoms.length === 0 || isLoading}
                >
                  {isLoading ? t('saving') : t('saveSymptoms')}
                </button>
              </div>
            </div>

            {/* Additional Notes Card */}
            <div className="symptom-card notes-card">
              <h3>{t('additionalNotes')}</h3>
              <textarea
                placeholder={t('writeAdditional')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="symptoms-textarea-modern"
                rows="3"
              />
            </div>
          </div>
        ) : (
          <div className="symptom-suggestion-overlay">
            <div className="suggestion-animation-wrapper">
              <div className="success-lottie-placeholder">✓</div>
              <h2>{t('symptomsRecorded')}</h2>
              <p>{t('recommendCareTip')}</p>
              
              <div className="modern-tip-card suggested-care-card">
                <div className={`tip-card-header ${suggestedTip.color}`}>
                  <div className="tip-icon-bubble">
                    <span role="img" aria-label="lightbulb">💡</span>
                  </div>
                </div>
                <div className="tip-card-content">
                  <h3>{suggestedTip.title}</h3>
                  <p>{suggestedTip.content}</p>
                </div>
              </div>

              <div className="suggestion-footer-actions">
                <button className="finish-symptoms-btn" onClick={() => navigate('/dashboard')}>
                  {t('finishReturn')}
                </button>
                <button className="edit-log-btn" onClick={() => setSuggestedTip(null)}>
                  {t('editLog')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
