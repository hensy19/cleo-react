import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import './LogPeriod.css'

export default function LogPeriod() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [flow, setFlow] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    setIsLoading(true)
    setTimeout(() => {
      const periodLogs = JSON.parse(localStorage.getItem('periodLogs') || '[]')
      periodLogs.push({
        id: Date.now(),
        startDate,
        endDate,
        flow,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('periodLogs', JSON.stringify(periodLogs))
      setIsLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <DashboardLayout showFooter={false}>
      <div className="log-period-page">
        
        <div className="log-period-header">
          <button className="back-arrow-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={32} />
            <span>{t('logPeriodTitle')}</span>
          </button>
          <p className="log-period-subtitle">{t('logPeriodSubtitle')}</p>
        </div>

        <div className="log-period-container">
          <div className="log-period-card">
            <form onSubmit={handleSubmit} className="log-period-form">
              
              <div className="form-section">
                <label>{t('startDateLabel')}</label>
                <div className="input-field">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <label>{t('endDateLabel')}</label>
                <div className="input-field">
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <label className="flow-label">{t('flowLabel')}</label>
                <div className="flow-radio-group">
                  <label className="flow-radio-item">
                    <input 
                      type="radio" 
                      name="flow" 
                      value="light" 
                      checked={flow === 'light'} 
                      onChange={() => setFlow('light')} 
                    />
                    <div className="radio-circle"></div>
                    <span>{t('lightFlowLabel')}</span>
                  </label>
                  <label className="flow-radio-item">
                    <input 
                      type="radio" 
                      name="flow" 
                      value="medium" 
                      checked={flow === 'medium'} 
                      onChange={() => setFlow('medium')} 
                    />
                    <div className="radio-circle"></div>
                    <span>{t('mediumFlowLabel')}</span>
                  </label>
                  <label className="flow-radio-item">
                    <input 
                      type="radio" 
                      name="flow" 
                      value="heavy" 
                      checked={flow === 'heavy'} 
                      onChange={() => setFlow('heavy')} 
                    />
                    <div className="radio-circle"></div>
                    <span>{t('heavyFlowLabel')}</span>
                  </label>
                </div>
              </div>

              <div className="log-period-actions">
                <button 
                  type="button" 
                  className="lp-back-btn" 
                  onClick={() => navigate('/dashboard')}
                >
                  {t('back')}
                </button>
                <button 
                  type="submit" 
                  className="lp-continue-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? t('saving') : t('continue')}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
