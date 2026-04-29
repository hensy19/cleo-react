import { Heart, Shield, Star, Users, Target, ArrowLeft, Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import './Resources.css'

export default function About() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <DashboardLayout>
      <div className="resources-page">
        <button className="back-btn-minimal" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> {t('backToHome')}
        </button>

        <div className="resource-card-main">
          <div className="resources-header" style={{ textAlign: 'left', alignItems: 'flex-start', marginBottom: '4rem' }}>
            <h1>{t('aboutTitle')}</h1>
            <p style={{ maxWidth: '1000px' }}>{t('aboutSubtitle')}</p>
          </div>

          <section className="resource-section">
            <h2><Target size={24} /> {t('ourMission')}</h2>
            <p className="intro-lead">Cleo was built on a simple yet powerful idea: that every person deserves to have a deep, data-driven understanding of their reproductive health.</p>
            <p>We combine modern technology with intuitive design to help you track cycles, symptoms, and moods effortlessly. Our platform is designed to be more than just a tracker; it's a companion that learns with you, providing insights that matter for your daily well-being and long-term health planning.</p>

            <div className="mission-stats">
              <div className="mission-item">
                <div className="mission-icon red">
                  <Heart size={24} />
                </div>
                <h3>Health First</h3>
                <p>Prioritizing your well-being with personalized insights.</p>
              </div>
              <div className="mission-item">
                <div className="mission-icon blue">
                  <Shield size={24} />
                </div>
                <h3>Privacy Focused</h3>
                <p>Your data is yours. We use bank-grade encryption to keep it safe.</p>
              </div>
              <div className="mission-item">
                <div className="mission-icon gold">
                  <Star size={24} />
                </div>
                <h3>Premium Design</h3>
                <p>A beautiful, clutter-free experience for your daily tracking.</p>
              </div>
            </div>
          </section>

          <section className="resource-section">
            <h2>Why Cleo?</h2>
            <p>Unlike traditional trackers, Cleo focuses on the "Why" behind your symptoms. By identifying patterns in your cycle, we help you prepare for what's next, whether it's managing PMS or optimizing your fertility window.</p>
            <ul>
              <li>Smart predictions that learn from your unique hormonal profile.</li>
              <li>Daily health goals for hydration, sleep, and mental well-being.</li>
              <li>Comprehensive symptom and mood logging with over 50 data points.</li>
              <li>Secure data backups and multi-device synchronization.</li>
              <li>AI-powered insights that surface trends and potential health concerns.</li>
              <li>Integration with wearable devices for more accurate baseline data.</li>
            </ul>
          </section>

          <div className="resource-bottom-grid" style={{ marginTop: '5rem', marginBottom: '0' }}>
            <div className="sidebar-stat-card">
              <Users size={20} />
              <h3>Global Community</h3>
              <p>Join thousands of users who are reclaiming their health journey with Cleo's advanced tracking and supportive ecosystem.</p>
            </div>
            <div className="contact-card">
              <h3>{t('needHelp')}</h3>
              <p>Our dedicated support team is available 24/7 to help you with any questions or technical issues you might encounter.</p>
              <button className="contact-btn" onClick={() => window.location.href = 'mailto:support@cleo.app'}>{t('emailSupport')}</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
