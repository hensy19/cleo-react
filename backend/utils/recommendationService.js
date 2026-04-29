/**
 * Recommendation Service
 * High-quality health intelligence based on mood and symptom selections.
 */

const getMoodRecommendation = (moodId) => {
    const recommendations = {
        'happy': { 
            id: 18,
            title: 'Radiate Positivity', 
            content: 'Your hormones are likely in a balanced state. Use this peak energy for creative projects or social gatherings!', 
            color: 'green' 
        },
        'sad': { 
            id: 22,
            title: 'Compassionate Care', 
            content: 'Hormonal drops can affect serotonin. Try gentle "grounding" exercises or reach out to a close friend for a chat.', 
            color: 'blue' 
        },
        'angry': { 
            id: 22,
            title: 'Release Tension', 
            content: 'Progesterone shifts can cause irritability. Physical release like a brisk walk or boxing can help process this cortisol spike.', 
            color: 'purple' 
        },
        'crying': { 
            id: 22,
            title: 'Emotional Release', 
            content: 'It is okay to let it out. Crying actually releases oxytocin and endorphins, which can help ease physical pain and emotional stress.', 
            color: 'purple' 
        },
        'energetic': { 
            id: 28,
            title: 'Peak Performance', 
            content: 'Usually occurring during your follicular or ovulation phase. It is the perfect time for high-intensity interval training (HIIT).', 
            color: 'blue' 
        },
        'peaceful': { 
            id: 22,
            title: 'Mindful Continuity', 
            content: 'Maintain this balance with a 5-minute gratitude journal. Consistency in your routine helps sustain this serenity.', 
            color: 'green' 
        },
        'tired': { 
            id: 23,
            title: 'Rest & Restore', 
            content: 'Your body is working hard. Prioritize "Sleep Hygiene"—no screens 30 mins before bed and keep your room cool.', 
            color: 'purple' 
        },
        'neutral': { 
            id: 18,
            title: 'Check-In', 
            content: 'A stable day is a good day. Stay consistent with your hydration and enjoy the lack of major hormonal fluctuations.', 
            color: 'green' 
        },
        'anxious': { 
            id: 22,
            title: 'Calm the Nervous System', 
            content: 'Try the 4-7-8 breathing technique: Inhale for 4s, hold for 7s, exhale for 8s. It signals safety to your brain.', 
            color: 'purple' 
        },
        'sleepy': { 
            id: 23,
            title: 'Quality over Quantity', 
            content: 'If you are sleepy during the day, try a 20-minute "Power Nap." Longer naps can disrupt your nighttime REM cycle.', 
            color: 'purple' 
        },
        'sick': { 
            id: 17,
            title: 'Immune Support', 
            content: 'Focus on Vitamin C and Zinc. Avoid heavy sugars which can increase inflammation during your recovery.', 
            color: 'lightblue' 
        },
        'hungry': { 
            id: 27,
            title: 'Smart Fueling', 
            content: 'Your basal metabolic rate often rises before your period. Focus on slow-release carbs like oats or sweet potatoes.', 
            color: 'green' 
        }
    };

    return recommendations[moodId] || {
        id: 17,
        title: 'Daily Wellness',
        content: 'Stay consistent with your water intake and listen to your body\'s natural rhythm.',
        color: 'green'
    };
};

const getSymptomRecommendation = (symptoms) => {
    const recommendations = {
        'cramps': { 
            id: 24,
            title: 'Pelvic Relaxation', 
            content: 'Beyond heat pads, Magnesium-rich foods (like dark chocolate and nuts) can help relax the uterine muscles.', 
            color: 'pink' 
        },
        'bloating': { 
            id: 21,
            title: 'Anti-Bloat Strategy', 
            content: 'Sip on Ginger or Peppermint tea. These are natural carminatives that help move gas and reduce stomach tension.', 
            color: 'green' 
        },
        'headache': { 
            id: 17,
            title: 'Neurological Relief', 
            content: 'Hormonal headaches are often linked to hydration. Magnesium and B2 vitamins are also known to reduce frequency.', 
            color: 'lightblue' 
        },
        'fatigue': { 
            id: 17,
            title: 'Iron & B12', 
            content: 'You might be losing iron. Pair plant-based iron (spinach) with Vitamin C (lemon) for 3x better absorption.', 
            color: 'green' 
        },
        'anxiety': { 
            id: 22,
            title: 'Vagus Nerve Reset', 
            content: 'Splashing cold water on your face or humming can stimulate the Vagus nerve to instantly lower heart rate.', 
            color: 'purple' 
        },
        'mood': { 
            id: 19,
            title: 'Hormonal Balance', 
            content: 'Keep blood sugar stable. Small, frequent meals prevent the "crashes" that often manifest as mood swings.', 
            color: 'purple' 
        },
        'energy': { 
            id: 18,
            title: 'Optimal Utilization', 
            content: 'Take advantage of this high-energy state for strength building; your muscles recover faster during this phase.', 
            color: 'blue' 
        },
        'appetite': { 
            id: 27,
            title: 'Protein First', 
            content: 'Eating protein with every snack helps regulate the "hunger hormone" ghrelin and keeps you full longer.', 
            color: 'green' 
        }
    };

    // Priority based selection: focus on the most distressing physical symptoms first
    const priority = ['cramps', 'headache', 'fatigue', 'bloating', 'anxiety', 'mood', 'energy', 'appetite'];
    const topSymptom = priority.find(s => symptoms.includes(s));

    return recommendations[topSymptom] || {
        id: 17,
        title: 'Self-Care Protocol',
        content: 'Stay hydrated, reduce caffeine, and get adequate rest during this part of your cycle.',
        color: 'pink'
    };
};

module.exports = {
    getMoodRecommendation,
    getSymptomRecommendation
};
