import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/common/Button'
import femaleImage from '../../assets/images/female.png'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

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
      title: 'Cycle Tracking',
      description: 'Easily log and monitor your menstrual cycle with our intuitive tracking interface.'
    },
    {
      id: 2,
      icon: '✨',
      title: 'Fertility Insights',
      description: 'Understand your fertile window and plan accordingly with accurate predictions.'
    },
    {
      id: 3,
      icon: '📊',
      title: 'Health Analytics',
      description: 'Track your health trends and gain detailed insights into your cycle patterns.'
    },
    {
      id: 4,
      icon: '😊',
      title: 'Mood Tracking',
      description: 'Log your mood and symptoms to understand how your cycle affects your well-being.'
    },
    {
      id: 5,
      icon: '💡',
      title: 'Personalized Advice',
      description: 'Receive tailored recommendations based on your unique cycle and lifestyle.'
    },
    {
      id: 6,
      icon: '🔮',
      title: 'Cycle Predictions',
      description: 'Get accurate predictions for your next period and fertility window.'
    }
  ]

  const steps = [
    {
      number: 1,
      icon: '📝',
      title: 'Log Your Cycle',
      description: 'Start by logging your period and cycle information in just a few taps.'
    },
    {
      number: 2,
      icon: '🌟',
      title: 'Track Symptoms & Mood',
      description: 'Record your symptoms and mood throughout your cycle to see patterns.'
    },
    {
      number: 3,
      icon: '🎯',
      title: 'Get Insights & Predictions',
      description: 'Receive personalized insights and accurate predictions for your health.'
    }
  ]

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Rhythm. Insight. Balance.</h1>
            <p className="hero-subtitle">
              Track your menstrual cycle with ease and gain valuable insights into your body's unique patterns. 
              Understand your rhythm and take control of your health.
            </p>
            <div className="hero-buttons">
              <Link to="/signup">
                <Button variant="primary" size="large">Start Tracking</Button>
              </Link>
              <button className="btn-secondary">Learn More</button>
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
          <h2 className="section-title">Everything You Need to Know About Your Cycle</h2>
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
          <h2 className="section-title">How cleo works</h2>
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
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Take the first step towards understanding your cycle better. 
            Join thousands of women using CLEO to track their health.
          </p>
          <Link to="/signup">
            <Button variant="white" size="large">Start Tracking Now</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
