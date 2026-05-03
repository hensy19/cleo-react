import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../utils/api'
import './LogPeriod.css'

export default function LogPeriod() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [flow, setFlow] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Get user's default period length for automatic calculation
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const defaultPeriodLength = parseInt(userInfo.periodLength || 5)

  const handleStartDateChange = (e) => {
    const startStr = e.target.value
    setStartDate(startStr)

    if (startStr) {
      // Split YYYY-MM-DD to avoid timezone shifting
      const [year, month, day] = startStr.split('-').map(Number);
      const start = new Date(year, month - 1, day);
      
      const end = new Date(start);
      end.setDate(start.getDate() + (defaultPeriodLength - 1));
      
      // Format back to YYYY-MM-DD
      const y = end.getFullYear();
      const m = String(end.getMonth() + 1).padStart(2, '0');
      const d = String(end.getDate()).padStart(2, '0');
      setEndDate(`${y}-${m}-${d}`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    setIsLoading(true)
    try {
      await api.logPeriod({
        start_date: startDate,
        end_date: endDate,
        flow
      })
      
      // Update local storage for immediate UI dashboard updates if needed
      // (Though a full reload or refetch is better)
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      localStorage.setItem('userInfo', JSON.stringify({
        ...userInfo,
        lastPeriodDate: startDate
      }))

      navigate('/dashboard')
    } catch (err) {
      console.error("Error logging period:", err)
    } finally {
      setIsLoading(false)
    }
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
                    onChange={handleStartDateChange}
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
