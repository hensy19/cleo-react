import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../utils/api'
import './Tips.css'
import { Lightbulb, MessageSquare, Heart, Droplets, Zap } from 'lucide-react'

// Helper to map icon names from DB to Lucide components
const IconMapper = ({ name, size = 24 }) => {
  const icons = {
    'Lightbulb': <Lightbulb size={size} />,
    'MessageSquare': <MessageSquare size={size} />,
    'Heart': <Heart size={size} />,
    'Droplets': <Droplets size={size} />,
    'Zap': <Zap size={size} />
  }
  return icons[name] || <Lightbulb size={size} />
}

export default function Tips() {
  const { t } = useLanguage()
  const [allTipsData, setAllTipsData] = useState([])
  const categories = [t('allTips'), t('dietNutrition'), t('exercise'), t('pmsRelief'), t('hygiene'), t('wellness')]

  const [activeCategory, setActiveCategory] = useState(t('allTips'))
  const [selectedTip, setSelectedTip] = useState(null)
  const [recommendedTip, setRecommendedTip] = useState(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      // 1. Fetch all tips for the grid
      const tips = await api.getAllTips()
      setAllTipsData(tips)

      // 2. Fetch personalized recommendation
      const backendTip = await api.getTipRecommendation()
      
      // Enrich backend recommendation with details from the newly fetched list
      const matchedTip = tips.find(t => t.id === backendTip.id)
      const fullTip = matchedTip ? { ...matchedTip, ...backendTip } : backendTip
      setRecommendedTip(fullTip)
    } catch (err) {
      console.error("Error fetching tips data:", err)
    }
  }

  const filteredTips = activeCategory === t('allTips')
    ? allTipsData
    : allTipsData.filter(tip => {
        // Map data categories to translation keys
        const categoryMap = {
          'Diet & Nutrition': t('dietNutrition'),
          'Exercise': t('exercise'),
          'PMS Relief': t('pmsRelief'),
          'Hygiene': t('hygiene'),
          'Wellness': t('wellness')
        }
        return categoryMap[tip.category] === activeCategory
      })

  const handleCardClick = (tip) => {
    setSelectedTip(tip)
  }

  const closeOutcomeModal = () => {
    setSelectedTip(null)
  }

  return (
    <DashboardLayout>
      <div className="tips-page">
        <div className="tips-header">
          <h1>{t('tipsTitle')}</h1>
          <p>{t('tipsSubtitle')}</p>
        </div>

        <div className="category-container">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-button ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {recommendedTip && activeCategory === t('allTips') && (
          <div className="recommended-section">
            <div className="section-badge">✨ {t('recommendedForYou')}</div>
            <div 
              className={`featured-tip-card ${recommendedTip.color}`}
              onClick={() => handleCardClick(recommendedTip)}
            >
              <div className="featured-icon">
                <IconMapper name={recommendedTip.icon_name} size={32} />
              </div>
              <div className="featured-info">
                <span className="featured-category">{recommendedTip.category}</span>
                <h2>{recommendedTip.title}</h2>
                <p>{recommendedTip.content}</p>
                <div className="featured-action">
                  {t('readFullGuide')} &rarr;
                </div>
              </div>
            </div>
            <div className="all-tips-divider">
              <span>{t('moreHealthyTips')}</span>
            </div>
          </div>
        )}

        <div className="tips-grid">
          {filteredTips.map(tip => (
            <div
              key={tip.id}
              className="modern-tip-card clickable"
              onClick={() => handleCardClick(tip)}
            >
              <div className={`tip-card-header ${tip.color}`}>
                <div className="tip-icon-bubble">
                  <IconMapper name={tip.icon_name} />
                </div>
              </div>
              <div className="tip-card-content">
                <h3>{tip.title}</h3>
                <p>{tip.content}</p>
                <div className="read-more-link">{t('readMore')} &rarr;</div>
              </div>
            </div>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="no-tips">
            <p>{t('noTipsFound')}</p>
          </div>
        )}

        {/* Improved Detailed Modal using Common Modal Component */}
        <Modal
          isOpen={!!selectedTip}
          onClose={closeOutcomeModal}
          size="medium"
        >
          {selectedTip && (
            <div className="tip-modal-content">
              <div className="tip-modal-header-modern">
                <div className={`tip-modal-icon-bubble ${selectedTip.color}`}>
                  <IconMapper name={selectedTip.icon_name} size={32} />
                </div>
                <div>
                  <span className="tip-modal-category-tag">{selectedTip.category}</span>
                  <h2>{selectedTip.title}</h2>
                </div>
              </div>

              <div className="tip-modal-body-modern" dangerouslySetInnerHTML={{ __html: selectedTip.detailed_content }}>
              </div>

              <div className="tip-modal-footer">
                <button className="close-tip-btn" onClick={closeOutcomeModal}>
                  {t('gotItThanks')}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
