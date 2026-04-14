import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/common/Button'
import femaleImage from '../../assets/images/female.png'
import { useLanguage } from '../../context/LanguageContext'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      navigate('/dashboard')
    }
  }, [navigate])
  const features = [
    {
      id: 1,
      icon: '📅',
      title: t('cycleTracking'),
      description: t('cycleTrackingDesc')
    },
    {
      id: 2,
      icon: '✨',
      title: t('fertilityInsights'),
      description: t('fertilityInsightsDesc')
    },
    {
      id: 3,
      icon: '📊',
      title: t('healthAnalytics'),
      description: t('healthAnalyticsDesc')
    },
    {
      id: 4,
      icon: '😊',
      title: t('moodTracking'),
      description: t('moodTrackingDesc')
    },
    {
      id: 5,
      icon: '💡',
      title: t('personalizedAdvice'),
      description: t('personalizedAdviceDesc')
    },
    {
      id: 6,
      icon: '🔮',
      title: t('cyclePredictions'),
      description: t('cyclePredictionsDesc')
    }
  ]

  const steps = [
    {
      number: 1,
      icon: '📝',
      title: t('logYourCycle'),
      description: t('logYourCycleDesc')
    },
    {
      number: 2,
      icon: '🌟',
      title: t('trackSymptomsMood'),
      description: t('trackSymptomsMoodDesc')
    },
    {
      number: 3,
      icon: '🎯',
      title: t('getInsightsPredictions'),
      description: t('getInsightsPredictionsDesc')
    }
  ]

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">{t('heroTitle')}</h1>
            <p className="hero-subtitle">
              {t('heroSubtitle')}
            </p>
            <div className="hero-buttons">
              <Link to="/signup">
                <Button variant="primary" size="large">{t('startTracking')}</Button>
              </Link>
              <button className="btn-secondary">{t('learnMore')}</button>
            </div>
            
          </div>
          <div className="hero-visual">
            <img src={femaleImage} alt="Woman illustration" className="hero-illustration" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="section-title">{t('everythingYouNeed')}</h2>
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="how-container">
          <h2 className="section-title">{t('howCleoWorks')}</h2>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">{t('readyToStart')}</h2>
          <p className="cta-subtitle">
            {t('thousandsOfWomen')}
          </p>
          <Link to="/signup">
            <Button variant="white" size="large">{t('startTrackingNow')}</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
