import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import './Tips.css'
import { Lightbulb, MessageSquare, Heart, Droplets, Zap } from 'lucide-react'

const TIPS_DATA = [
  {
    id: 1,
    title: 'Iron-Rich Foods',
    category: 'Diet & Nutrition',
    content: 'Include spinach, lentils, and red meat in your diet to replenish iron lost during menstruation.',
    detailedContent: (
      <div>
        <p>During menstruation, your body loses iron through blood. Replenishing this vital mineral is essential to prevent fatigue and anemia.</p>
        <h4>Key Iron Sources:</h4>
        <ul>
          <li><strong>Heme Iron:</strong> Red meat, poultry, and fish (more easily absorbed).</li>
          <li><strong>Non-Heme Iron:</strong> Spinach, lentils, beans, and fortified cereals.</li>
        </ul>
        <p><strong>Pro Tip:</strong> Consume iron-rich foods with Vitamin C (like oranges or bell peppers) to significantly enhance absorption!</p>
      </div>
    ),
    icon: <Lightbulb size={24} />,
    color: 'green'
  },
  {
    id: 2,
    title: 'Light Exercise During Period',
    category: 'Exercise',
    content: 'Gentle yoga or walking can help reduce cramps and improve mood during your period.',
    detailedContent: (
      <div>
        <p>While intense workouts might feel daunting, light physical activity can actually alleviate many menstrual symptoms by increasing blood flow and releasing endorphins.</p>
        <h4>Recommended Activities:</h4>
        <ul>
          <li><strong>Walking:</strong> A brisk 15-minute walk can reduce bloating.</li>
          <li><strong>Yoga:</strong> Specifically poses like Child's Pose or Cat-Cow to soothe cramps.</li>
          <li><strong>Stretching:</strong> Focus on the lower back and hips.</li>
        </ul>
        <p>Listen to your body and don't overexert yourself. Rest is just as important!</p>
      </div>
    ),
    icon: <MessageSquare size={24} />,
    color: 'blue'
  },
  {
    id: 3,
    title: 'Managing PMS Symptoms',
    category: 'PMS Relief',
    content: 'Stay hydrated, reduce caffeine and salt intake, and get adequate sleep to minimize PMS symptoms.',
    detailedContent: (
      <div>
        <p>Premenstrual Syndrome (PMS) can be challenging, but lifestyle adjustments can make a significant difference in how you feel.</p>
        <h4>Management Strategies:</h4>
        <ul>
          <li><strong>Hydration:</strong> Drink at least 8 glasses of water to reduce bloating.</li>
          <li><strong>Dietary Adjustments:</strong> Lower salt intake to prevent water retention and reduce caffeine to manage irritability.</li>
          <li><strong>Sleep:</strong> Maintain a consistent sleep schedule of 7-9 hours.</li>
        </ul>
        <p>Small changes in the days leading up to your period can lead to a much smoother experience.</p>
      </div>
    ),
    icon: <Heart size={24} />,
    color: 'pink'
  },
  {
    id: 4,
    title: 'Menstrual Hygiene',
    category: 'Hygiene',
    content: 'Change pads/tampons every 4-6 hours. Always wash hands before and after changing menstrual products.',
    detailedContent: (
      <div>
        <p>Proper hygiene is crucial for preventing infections and feeling comfortable during your cycle.</p>
        <h4>Best Practices:</h4>
        <ul>
          <li><strong>Frequency:</strong> Even on light days, change products every 4-6 hours to prevent bacterial growth.</li>
          <li><strong>Hand Hygiene:</strong> Always wash hands thoroughly before and after handling menstrual products.</li>
          <li><strong>Cleansing:</strong> Use mild, unscented soap for the external area only. Avoid douching as it disrupts natural pH levels.</li>
        </ul>
        <p>Maintaining a clean and dry environment is key to your comfort and health.</p>
      </div>
    ),
    icon: <Droplets size={24} />,
    color: 'lightblue'
  },
  {
    id: 5,
    title: 'Reduce Bloating',
    category: 'Diet & Nutrition',
    content: 'Avoid salty foods and drink plenty of water. Potassium-rich foods like bananas can help reduce bloating.',
    detailedContent: (
      <div>
        <p>Water retention is a common symptom during the luteal phase. Managing your electrolyte balance can help you feel lighter.</p>
        <h4>Tips to Combat Bloating:</h4>
        <ul>
          <li><strong>Potassium Power:</strong> Bananas, avocados, and sweet potatoes help flush out excess sodium.</li>
          <li><strong>Herbal Teas:</strong> Dandelion or peppermint tea can act as a natural diuretic.</li>
          <li><strong>Limit Processed Foods:</strong> These are often hidden sources of high sodium.</li>
        </ul>
        <p>Staying active also helps move gas through the digestive system, further reducing discomfort.</p>
      </div>
    ),
    icon: <Lightbulb size={24} />,
    color: 'green'
  },
  {
    id: 6,
    title: 'Stress Management',
    category: 'Wellness',
    content: 'Practice meditation or deep breathing exercises. Stress can affect your menstrual cycle regularity.',
    detailedContent: (
      <div>
        <p>High stress levels can interfere with the hypothalamus, the part of the brain that regulates your hormones, potentially leading to irregular or missed periods.</p>
        <h4>Techniques to Try:</h4>
        <ul>
          <li><strong>Deep Breathing:</strong> The 4-7-8 technique can quickly calm the nervous system.</li>
          <li><strong>Meditation:</strong> Just 5-10 minutes a day can lower overall cortisol levels.</li>
          <li><strong>Journaling:</strong> Writing down your thoughts can help process emotions and reduce anxiety.</li>
        </ul>
        <p>Prioritizing mental well-being is a core part of reproductive health.</p>
      </div>
    ),
    icon: <Zap size={24} />,
    color: 'purple'
  },
  {
    id: 7,
    title: 'Sleep Quality',
    category: 'Wellness',
    content: 'Aim for 7-8 hours of quality sleep. Poor sleep can worsen PMS symptoms and irregular cycles.',
    detailedContent: (
      <div>
        <p>Hormonal fluctuations can disrupt your circadian rhythm. Quality sleep is essential for hormone production and mood regulation.</p>
        <h4>Improve Your Sleep:</h4>
        <ul>
          <li><strong>Dark & Cool:</strong> Keep your bedroom temperature slightly cool and eliminate light.</li>
          <li><strong>Limit Screens:</strong> Avoid blue light from phones at least an hour before bed.</li>
          <li><strong>Consistency:</strong> Go to bed and wake up at the same time every day, even on weekends.</li>
        </ul>
        <p>Good sleep hygiene can significantly reduce the severity of mood swings and fatigue.</p>
      </div>
    ),
    icon: <Zap size={24} />,
    color: 'purple'
  },
  {
    id: 8,
    title: 'Heat Therapy',
    category: 'PMS Relief',
    content: 'Apply a heating pad to your lower abdomen for 15-20 minutes to relieve menstrual cramps.',
    detailedContent: (
      <div>
        <p>Heat helps to relax the contracting muscles in the uterus, which is the primary cause of menstrual pain.</p>
        <h4>Ways to Apply Heat:</h4>
        <ul>
          <li><strong>Heating Pads:</strong> Electric or microwaveable pads are convenient for home use.</li>
          <li><strong>Hot Water Bottles:</strong> A classic and effective method.</li>
          <li><strong>Warm Baths:</strong> Soothing for the whole body and specifically helps relax the pelvic floor.</li>
        </ul>
        <p>Research suggests that heat can be just as effective as some over-the-counter pain relievers for mild cramps.</p>
      </div>
    ),
    icon: <Heart size={24} />,
    color: 'pink'
  },
  {
    id: 9,
    title: 'Choose the Right Products',
    category: 'Hygiene',
    content: 'Select menstrual products based on your flow. Consider trying different options to find what works best.',
    detailedContent: (
      <div>
        <p>Everyone's cycle is unique. Understanding the options available allows you to choose what's most comfortable and sustainable for you.</p>
        <h4>Product Options:</h4>
        <ul>
          <li><strong>Pads & Tampons:</strong> Disposable and convenient; choose absorbency based on flow.</li>
          <li><strong>Menstrual Cups:</strong> Eco-friendly, reusable, and can be worn for up to 12 hours.</li>
          <li><strong>Period Underwear:</strong> Comfortable for light to medium days or as backup.</li>
        </ul>
        <p>Don't be afraid to mix and match products for different days of your cycle.</p>
      </div>
    ),
    icon: <Droplets size={24} />,
    color: 'lightblue'
  },
  {
    id: 10,
    title: 'Swimming Benefits',
    category: 'Exercise',
    content: 'Swimming is excellent during your period. It provides pain relief and can improve overall wellbeing.',
    detailedContent: (
      <div>
        <p>Swimming provides a unique form of low-impact exercise that can feel incredibly soothing during your period.</p>
        <h4>Why Swimming Works:</h4>
        <ul>
          <li><strong>Buoyancy:</strong> Water supports your weight, taking pressure off your back and joints.</li>
          <li><strong>Circulation:</strong> Improves blood flow, which can help reduce the severity of cramps.</li>
          <li><strong>Temperature:</strong> Cool water can be refreshing while warm pools can relax muscles.</li>
        </ul>
        <p>Just use internal protection like a tampon or cup, and you're good to go!</p>
      </div>
    ),
    icon: <MessageSquare size={24} />,
    color: 'blue'
  },
  {
    id: 11,
    title: 'Omega-3 Fatty Acids',
    category: 'Diet & Nutrition',
    content: 'Foods rich in omega-3s like salmon and walnuts can help reduce inflammation and period pain.',
    detailedContent: (
      <div>
        <p>Omega-3 fatty acids are natural anti-inflammatories. They work by inhibiting the production of prostaglandins, chemicals that cause uterine contractions and pain.</p>
        <h4>Omega-3 Rich Foods:</h4>
        <ul>
          <li><strong>Fatty Fish:</strong> Salmon, mackerel, and sardines.</li>
          <li><strong>Plant Based:</strong> Walnuts, chia seeds, and flaxseeds.</li>
          <li><strong>Supplements:</strong> Fish oil or algae oil (consult your doctor first).</li>
        </ul>
        <p>Incorporating these into your diet throughout the month can lead to cumulative benefits for your cycle.</p>
      </div>
    ),
    icon: <Lightbulb size={24} />,
    color: 'green'
  },
  {
    id: 12,
    title: 'Strength Training Benefits',
    category: 'Exercise',
    content: 'Regular strength training can help reduce period pain and regulate hormones over time.',
    detailedContent: (
      <div>
        <p>Building muscle mass helps regulate overall hormonal balance and can improve insulin sensitivity, which is often linked to menstrual regularity.</p>
        <h4>Effective Training:</h4>
        <ul>
          <li><strong>Compound Movements:</strong> Squats and deadlifts engage large muscle groups.</li>
          <li><strong>Consistency over Intensity:</strong> Lower weight and higher reps might feel better during your actual period.</li>
          <li><strong>Rest Days:</strong> Crucial for recovery, especially during the first few days of your cycle.</li>
        </ul>
        <p>A stronger body often translates to more manageable periods and better long-term health.</p>
      </div>
    ),
    icon: <MessageSquare size={24} />,
    color: 'blue'
  }
]

export default function Tips() {
  const categories = ['All Tips', 'Diet & Nutrition', 'Exercise', 'PMS Relief', 'Hygiene', 'Wellness']

  const [activeCategory, setActiveCategory] = useState('All Tips')
  const [selectedTip, setSelectedTip] = useState(null)
  
  const filteredTips = activeCategory === 'All Tips'
    ? TIPS_DATA
    : TIPS_DATA.filter(tip => tip.category === activeCategory)

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
          <h1>Health & Self-Care Tips</h1>
          <p>Expert advice for better menstrual health</p>
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

        <div className="tips-grid">
          {filteredTips.map(tip => (
            <div 
              key={tip.id} 
              className="modern-tip-card clickable"
              onClick={() => handleCardClick(tip)}
            >
              <div className={`tip-card-header ${tip.color}`}>
                <div className="tip-icon-bubble">
                  {tip.icon}
                </div>
              </div>
              <div className="tip-card-content">
                <h3>{tip.title}</h3>
                <p>{tip.content}</p>
                <div className="read-more-link">Read More &rarr;</div>
              </div>
            </div>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="no-tips">
            <p>No tips found in this category</p>
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
                  {selectedTip.icon}
                </div>
                <div>
                  <span className="tip-modal-category-tag">{selectedTip.category}</span>
                  <h2>{selectedTip.title}</h2>
                </div>
              </div>
              
              <div className="tip-modal-body-modern">
                {selectedTip.detailedContent}
              </div>
              
              <div className="tip-modal-footer">
                <button className="close-tip-btn" onClick={closeOutcomeModal}>
                  Got it, thanks!
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
