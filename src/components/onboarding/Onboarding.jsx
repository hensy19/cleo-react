import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import bgImage from '../../assets/images/bg.jpg'
import { api } from '../../utils/api'
import './Onboarding.css'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    age: '',
    cycleLength: '28',
    periodLength: '5',
    lastPeriodDate: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep = () => {
    const newErrors = {}
    
    if (step === 1) {
      if (!answers.age) newErrors.age = 'Age is required'
      else if (parseInt(answers.age) < 13 || parseInt(answers.age) > 100) {
        newErrors.age = 'Please enter a valid age'
      }
    }
    
    if (step === 2) {
      if (!answers.cycleLength) newErrors.cycleLength = 'Cycle length is required'
      else if (parseInt(answers.cycleLength) < 20 || parseInt(answers.cycleLength) > 45) {
        newErrors.cycleLength = 'Cycle length should be between 20-45 days'
      }
    }

    if (step === 3) {
      if (!answers.periodLength) newErrors.periodLength = 'Period length is required'
      else if (parseInt(answers.periodLength) < 1 || parseInt(answers.periodLength) > 10) {
        newErrors.periodLength = 'Period length should be between 1-10 days'
      }
    }

    if (step === 4) {
      if (!answers.lastPeriodDate) newErrors.lastPeriodDate = 'Last period date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    if (validateStep()) {
      try {
        const response = await api.completeOnboarding({
          age: parseInt(answers.age),
          cycleLength: parseInt(answers.cycleLength),
          periodLength: parseInt(answers.periodLength),
          lastPeriodDate: answers.lastPeriodDate
        });

        // Update local storage with new user info
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        localStorage.setItem('onboardingCompleted', 'true'); // Still keep for quick check
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to complete onboarding:', err);
        setErrors({ server: 'Failed to save onboarding data. Please try again.' });
      }
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* Progress Bar */}
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">Step {step} of 4</p>
        </div>

        {/* Step 1: Age */}
        {step === 1 && (
          <div className="onboarding-step">
            <div className="step-icon">👤</div>
            <h2>How old are you?</h2>
            <p>This helps us personalize your tracking experience</p>
            <Input
              type="number"
              label="Age"
              placeholder="Enter your age"
              value={answers.age}
              onChange={(e) => handleChange('age', e.target.value)}
              error={errors.age}
              required
            />
          </div>
        )}

        {/* Step 2: Cycle Length */}
        {step === 2 && (
          <div className="onboarding-step">
            <div className="step-icon">📊</div>
            <h2>What's your cycle length?</h2>
            <p>The average number of days in your menstrual cycle</p>
            <div className="input-group">
              <label className="input-label">Cycle Length (in days)</label>
              <div className="cycle-input-group">
                <input
                  type="range"
                  min="20"
                  max="45"
                  value={answers.cycleLength}
                  onChange={(e) => handleChange('cycleLength', e.target.value)}
                  className="cycle-slider"
                />
                <span className="cycle-value">{answers.cycleLength} days</span>
              </div>
              {errors.cycleLength && <span className="input-error">{errors.cycleLength}</span>}
            </div>
            <p className="helper-text">Typical cycle is 21-35 days</p>
          </div>
        )}

        {/* Step 3: Period Length */}
        {step === 3 && (
          <div className="onboarding-step">
            <div className="step-icon">🩸</div>
            <h2>What's your period length?</h2>
            <p>The average number of days your period lasts</p>
            <div className="input-group">
              <label className="input-label">Period Length (in days)</label>
              <div className="cycle-input-group">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answers.periodLength}
                  onChange={(e) => handleChange('periodLength', e.target.value)}
                  className="cycle-slider"
                />
                <span className="cycle-value">{answers.periodLength} days</span>
              </div>
              {errors.periodLength && <span className="input-error">{errors.periodLength}</span>}
            </div>
            <p className="helper-text">Typical period is 3-7 days</p>
          </div>
        )}

        {/* Step 4: Last Period Date */}
        {step === 4 && (
          <div className="onboarding-step">
            <div className="step-icon">📅</div>
            <h2>When was your last period?</h2>
            <p>This helps us predict your next period</p>
            <Input
              type="date"
              label="Last Period Start Date"
              value={answers.lastPeriodDate}
              onChange={(e) => handleChange('lastPeriodDate', e.target.value)}
              error={errors.lastPeriodDate}
              required
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="onboarding-actions">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleComplete}
            >
              Get Started
            </Button>
          )}
        </div>

        {/* Skip for later */}
        <p className="skip-text">
          You can update this information later in settings
        </p>
      </div>
    </div>
  )
}
