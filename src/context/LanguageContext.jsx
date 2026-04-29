import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    // Navbar
    home: 'Home',
    logCycle: 'Log Cycle',
    symptoms: 'Symptoms',
    mood: 'Mood',
    calendar: 'Calendar',
    notes: 'Notes',
    history: 'History',
    tips: 'Smart Tips',
    about: 'About',
    login: 'Login',
    signup: 'Sign Up',
    profile: 'Profile',
    changePassword: 'Change Password',
    logout: 'Logout',
    helloAgain: 'Hello Again!',
    welcomeBackMissed: 'Welcome back you have been missed!',
    emailAddress: 'Email Address',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    dontHaveAccount: "Don't have an account?",
    createAccount: 'Create Account',
    joinUsTracking: 'Join us to start tracking your health',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    iAgreeTo: 'I agree to the',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    alreadyHaveAccount: 'Already have an account?',
    creatingAccount: 'Creating Account...',
    iUnderstandAgree: 'I Understand & Agree',
    medicalDisclaimer: 'Medical Disclaimer:',
    medicalDisclaimerText: 'Cleo is NOT a medical device and should not be used for birth control or diagnosis. Always consult a doctor.',
    heroTitle: 'Rhythm. Insight. Balance.',
    heroSubtitle: "Track your menstrual cycle with ease and gain valuable insights into your body's unique patterns. Understand your rhythm and take control of your health.",
    startTracking: 'Start Tracking',
    learnMore: 'Learn More',
    everythingYouNeed: 'Everything You Need to Know About Your Cycle',
    howCleoWorks: 'How Cleo Works',
    readyToStart: 'Ready to Start Your Journey?',
    thousandsOfWomen: 'Take the first step towards understanding your cycle better. Join thousands of women using CLEO to track their health.',
    startTrackingNow: 'Start Tracking Now',
    cycleTracking: 'Cycle Tracking',
    cycleTrackingDesc: 'Easily log and monitor your menstrual cycle with our intuitive tracking interface.',
    fertilityInsights: 'Fertility Insights',
    fertilityInsightsDesc: 'Understand your fertile window and plan accordingly with accurate predictions.',
    healthAnalytics: 'Health Analytics',
    healthAnalyticsDesc: 'Track your health trends and gain detailed insights into your cycle patterns.',
    moodTracking: 'Mood Tracking',
    moodTrackingDesc: 'Log your mood and symptoms to understand how your cycle affects your well-being.',
    personalizedAdvice: 'Personalized Advice',
    personalizedAdviceDesc: 'Receive tailored recommendations based on your unique cycle and lifestyle.',
    cyclePredictions: 'Cycle Predictions',
    cyclePredictionsDesc: 'Get accurate predictions for your next period and fertility window.',
    logYourCycle: 'Log Your Cycle',
    logYourCycleDesc: 'Start by logging your period and cycle information in just a few taps.',
    trackSymptomsMood: 'Track Symptoms & Mood',
    trackSymptomsMoodDesc: 'Record your symptoms and mood throughout your cycle to see patterns.',
    getInsightsPredictions: 'Get Insights & Predictions',
    getInsightsPredictionsDesc: 'Receive personalized insights and accurate predictions for your health.',
    cycleCalendar: 'Cycle Calendar',
    trackManageCycle: 'Track and manage your cycle',
    viewHistory: 'View History',
    fertileWindow: 'Fertility Window',
    ovulationDay: 'Ovulation Day',
    predictedPeriod: 'Predicted Period',
    periodFlow: 'Your period flow',
    daysSelected: 'days selected',
    saveAll: 'Save all',
    markPeriodDay: 'Mark as Period Day',
    periodDayActive: '✓ Period Day',
    noMoodLogged: 'No mood logged',
    noSymptomsLogged: 'No symptoms logged',
    noNotesForDay: 'No notes for this day',
    writeQuickNote: 'Write a quick note...',
    add: 'Add',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
    superFlow: 'Super',
    weekdays: {
      sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat'
    },

    // History
    historyTitle: 'Period History',
    historySubtitle: 'View and manage your cycle records',
    totalCycles: 'Total Cycles',
    avgCycleLengthValue: 'Avg Cycle Length',
    lastPeriodDateLabel: 'Last Period',
    nextExpectedLabel: 'Next Expected',
    cycleNumLabel: 'Cycle #',
    flowLabel: 'Flow',
    actionsLabel: 'Actions',
    regularity: 'Regularity',
    veryRegular: 'Very Regular',
    mostCommonFlow: 'Most Common Flow',
    predictionAccuracy: 'Prediction Accuracy',
    editPeriodRecord: 'Edit Period Record',
    deletePeriodRecord: 'Delete Period Record',
    confirmDeletePeriod: 'Are you sure you want to delete this period record?',
    cannotBeUndone: 'This action cannot be undone.',
    periodLengthUnit: 'days',
    ofCycles: 'of cycles',
    basedOn: 'Based on',
    variation: 'variation',

    // Reminders
    manageReminders: 'Manage Reminders',
    remindersSubtitle: 'Customize when and how you want Cleo to notify you',
    cyclePredictionsLabel: 'Cycle Predictions',
    dailyHabitsLabel: 'Daily Habits',
    notificationPrefsLabel: 'Notification Preferences',
    defaultReminderTime: 'Default Reminder Time',
    saveSettings: 'Save Settings',
    periodApproachingLabel: 'Period Approaching',
    periodApproachingDesc: 'Get notified before your period is expected to start',
    ovulationWindowLabel: 'Ovulation Window',
    ovulationWindowDesc: 'Get notified when your fertile window is starting',
    dailyCheckInLabel: 'Daily check-in',
    dailyCheckInDesc: 'Reminder to log your symptoms, mood, and notes',
    medicationReminderLabel: 'Medication/Pill Reminder',
    medicationReminderDesc: 'Daily reminder to take your medication',
    notifyMe: 'Notify me',
    daysBefore: 'days before',
    dayBefore: 'day before',

    // Tips
    tipsTitle: 'Health & Self-Care Tips',
    tipsSubtitle: 'Expert advice for better menstrual health',
    allTips: 'All Tips',
    dietNutrition: 'Diet & Nutrition',
    exercise: 'Exercise',
    pmsRelief: 'PMS Relief',
    hygiene: 'Hygiene',
    wellness: 'Wellness',
    noTipsFound: 'No tips found in this category',
    readMore: 'Read More',
    gotItThanks: 'Got it, thanks!',
    tipsData: {
      tip1: {
        title: 'Iron-Rich Foods',
        content: 'Include spinach, lentils, and red meat in your diet to replenish iron lost during menstruation.',
        detail: 'During menstruation, your body loses iron through blood. Replenishing this vital mineral is essential to prevent fatigue and anemia. Key Iron Sources include red meat, poultry, fish, spinach, lentils, and beans. Pro Tip: Consume with Vitamin C for better absorption!'
      },
      tip2: {
        title: 'Light Exercise',
        content: 'Gentle yoga or walking can help reduce cramps and improve mood during your period.',
        detail: 'Light physical activity can alleviate many menstrual symptoms by increasing blood flow and releasing endorphins. Try walking, yoga (Child’s Pose), or light stretching. Listen to your body and rest when needed.'
      },
      tip3: {
        title: 'Managing PMS',
        content: 'Stay hydrated, reduce caffeine and salt intake, and get adequate sleep to minimize symptoms.',
        detail: 'Lifestyle adjustments can make a significant difference. Drink at least 8 glasses of water, reduce salt to prevent bloating, and lower caffeine to manage irritability.'
      },
      tip4: {
        title: 'Menstrual Hygiene',
        content: 'Change pads/tampons every 4-6 hours and wash hands thoroughly.',
        detail: 'Proper hygiene prevents infections. Change products every 4-6 hours, use mild soap for external cleansing, and avoid douching.'
      },
      tip5: {
        title: 'Reduce Bloating',
        content: 'Avoid salty foods and eat potassium-rich foods like bananas.',
        detail: 'Water retention is common. Bananas, avocados, and sweet potatoes help flush excess sodium. Try dandelion or peppermint tea as natural diuretics.'
      },
      tip6: {
        title: 'Stress Management',
        content: 'Practice meditation or deep breathing to help regulate your cycle.',
        detail: 'High stress affects hormones. Try the 4-7-8 breathing technique, 10 minutes of daily meditation, or journaling to reduce anxiety.'
      },
      tip7: {
        title: 'Sleep Quality',
        content: 'Aim for 7-8 hours of quality sleep to help regulate mood and hormones.',
        detail: 'Hormonal shifts can disrupt sleep. Keep your room dark and cool, limit screens an hour before bed, and maintain a consistent schedule.'
      },
      tip8: {
        title: 'Heat Therapy',
        content: 'Apply a heating pad to your lower abdomen to relieve menstrual cramps.',
        detail: 'Heat relaxes uterine muscles. Use heating pads, hot water bottles, or take warm baths for 15-20 minutes to soothe pain effectively.'
      },
      tip9: {
        title: 'Right Products',
        content: 'Select menstrual products based on your flow and comfort.',
        detail: 'Understand your options: pads/tampons for convenience, menstrual cups for eco-friendly long wear (up to 12h), or period underwear for light days.'
      },
      tip10: {
        title: 'Swimming Benefits',
        content: 'Swimming provides natural pain relief and improves wellbeing.',
        detail: 'Water supports your weight and takes pressure off joints. Improving circulation helps reduce cramp severity. Just use internal protection!'
      },
      tip11: {
        title: 'Omega-3 Fatty Acids',
        content: 'Eat salmon and walnuts to reduce inflammation and period pain.',
        detail: 'Omega-3s are natural anti-inflammatories that inhibit pain-causing chemicals. Include fatty fish, walnuts, chia seeds, or flaxseeds in your diet.'
      },
      tip12: {
        title: 'Strength Training',
        content: 'Regular strength training can help regulate hormones over time.',
        detail: 'Building muscle mass improves hormone balance and insulin sensitivity. Focus on consistency and allow for rest days during your period.'
      }
    },

    // Log Period
    logPeriodTitle: 'Log Period',
    logPeriodSubtitle: 'Record your period dates and flow',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    lightFlowLabel: 'Light flow',
    mediumFlowLabel: 'Medium flow',
    heavyFlowLabel: 'Heavy flow',

    // Change Password
    changePasswordTitle: 'Change your password',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm Password',
    passwordsDoNotMatch: 'Passwords do not match',
    savePassword: 'Save password',
    passwordSavedSuccess: 'Password saved successfully!',
    enterCurrentPassword: 'Enter your current password',
    enterNewPassword: 'Enter a new password',
    reEnterPassword: 'Re-enter your password',

    // Auth - Forgot Password
    forgotPasswordTitle: 'Forgot Password?',
    forgotPasswordDesc: "Enter your email and we'll send you a link to reset your password.",
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    checkYourEmail: 'Check your Email',
    resetEmailSent: "We've sent a password reset link to",
    checkInboxSpam: 'Please check your inbox and spam folder.',
    didntReceiveEmail: "Didn't receive it? Try again",

    // Resources
    aboutTitle: 'About Cleo',
    aboutSubtitle: 'Empowering millions to understand their bodies with precision, care, and advanced data science.',
    lastUpdated: 'Last Updated',
    needHelp: 'Need Help?',
    emailSupport: 'Email Support',
    backToHome: 'Back to Home',

    // Onboarding
    step: 'Step',
    of: 'of',
    howOldAreYou: 'How old are you?',
    personalizeExperience: 'This helps us personalize your tracking experience',
    cycleLengthQuestion: "What's your cycle length?",
    periodLengthQuestion: "What's your period length?",
    lastPeriodQuestion: 'When was your last period?',
    getStarted: 'Get Started',
    updateLaterSettings: 'You can update this information later in settings',

    // Admin
    adminDashboard: 'Admin Dashboard',
    userManagement: 'User Management',
    contentManagement: 'Content Management',
    searchUsers: 'Search users by name or email...',
    joinDate: 'Join Date',
    lastActive: 'Last Active',
    active: 'Active',
    blocked: 'Blocked',
    showing: 'Showing',
    previous: 'Previous',
    next: 'Next',

    // Footer
    quickLinks: 'Quick Links',
    resources: 'Resources',
    contact: 'Contact',
    allRightsReserved: 'All rights reserved.',

    // Common
    back: 'Back',
    continue: 'Continue',
    saving: 'Saving...',
    saveChanges: 'Save Changes',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',

    noteTips: 'Note Taking Tips',
    editNoteTitle: 'Edit Note',
    addNewNote: 'Add New Note',
    title: 'Title',
    content: 'Content',
    enterTitle: 'Enter note title...',
    writeObservation: 'Write your observation here...',
    noteSaved: 'Note saved successfully!',
    noteUpdated: 'Note updated successfully!',
    noteDeleted: 'Note deleted successfully!',
    deleteNoteConfirm: 'Are you sure you want to delete this note?',
    permanentAction: 'This action cannot be undone.',

    // Profile
    updateProfile: 'Update Profile',
    profileUpdated: 'Profile updated successfully!',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    dob: 'Date of Birth',
    deleteAccount: 'Delete Account',
    myProfile: 'My Profile',
    manageAccount: 'Manage your account and cycle information',
    dailyGoals: 'Daily Goals',
    nudge: 'Nudge',
    editGoals: 'Edit Goals',
    saveGoals: 'Save Goals',
    resetProgress: 'Reset Progress',
    addNewGoal: 'Add New Goal',
    goalName: 'Goal Name',
    target: 'Target',
    unit: 'Unit',
    dangerZone: 'Danger Zone',
    deleteWarning: 'Warning: This action is permanent and will securely wipe all your data from our servers.',
    activeProfile: 'Active Profile',
    personalInfo: 'Personal Information',
    cycleInfo: 'Cycle Information',
    accountActivity: 'Account Activity',
    age: 'Age',
    avgCycleLength: 'Avg cycle length',
    avgPeriodLength: 'Avg period length',
    memberSince: 'Member since',
    cyclesTracked: 'Cycles Tracked',
    notesCreated: 'Notes Created',
    moodEntries: 'Mood Entries',
    resetGoalsConfirm: 'Reset Daily Goals?',
    resetGoalsMsg: 'This will clear all your progress for today. This action cannot be undone.',
    newHealthGoal: 'New Health Goal',
    accountDeleted: 'Account deleted successfully! Goodbye.',
    dangerPermanent: 'Danger: Permanent Action',

    // Symptoms
    logSymptoms: 'Log Symptoms',
    cramps: 'Cramps',
    headache: 'Headache',
    acne: 'Acne',
    backache: 'Backache',
    fatigue: 'Fatigue',
    bloating: 'Bloating',
    nausea: 'Nausea',
    tenderBreasts: 'Tender Breasts',
    anxiety: 'Anxiety',
    moodSwings: 'Mood Swings',
    highEnergy: 'High Energy',
    increasedAppetite: 'Increased Appetite',
    symptomLogger: 'Symptom Logger',
    trackPhysicalEmotional: 'Track your physical and emotional symptoms',
    selectYourSymptoms: 'Select Your Symptoms',
    saveSymptoms: 'Save Symptoms',
    additionalNotes: 'Additional Notes',
    symptomsRecorded: 'Symptoms Recorded!',
    recommendCareTip: 'Based on your log, we recommend this care tip:',
    finishReturn: 'Finish & Return to Dashboard',
    editLog: 'Edit Log',
    writeAdditional: 'Add Additional symptoms about how you are feeling today...',

    // Moods
    happy: 'Happy',
    sad: 'Sad',
    angry: 'Angry',
    crying: 'Crying',
    energetic: 'Energetic',
    peaceful: 'Peaceful',
    tired: 'Tired',
    anxious: 'Anxious',
    neutral: 'Neutral',
    sleepy: 'Sleepy',
    sick: 'Sick',
    hungry: 'Hungry',
    visualMoodBoard: 'Visual Mood Board',
    trackDailyMood: 'Track your daily mood throughout your cycle.',
    moodHistory: 'Mood History',
    patternInsight: 'Pattern Insight',
    insightText: 'You tend to feel more energetic and happy during the follicular phase of your cycle.',
    finishAndGo: 'Finish & Go to Dashboard',
    logAnother: 'Log Another Mood',
    greatJobLogging: 'Great job logging your mood!',
    recommendedForYou: 'Recommended for You',
    noMoodEntries: 'No mood entries yet. Select a mood above to start tracking!',
    suggestedHelp: "Based on how you're feeling, we thought this might help:",

    // Calendar
    months: {
      jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
      jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'
    },

    // Dashboard
    welcome: 'Welcome back',
    selfCare: "There's no better treatment than self-care.",
    firstPeriod: 'First Period',
    currentCycleDay: 'Current Cycle Day',
    peakStatus: 'You are at your peak',
    days: 'days',
    inDays: 'in',
    quickActions: 'Quick Actions',
    howFeeling: 'How are you feeling today?',
    viewMood: 'View Mood Analytics',
    cycleInsights: 'Cycle Insights',
    recentNotes: 'Recent Notes',
    viewAllNotes: 'View All Notes',
    healthTip: "Today's Health Tip",
    moreTips: 'More Tips',
    reminders: 'Reminders',
    addNote: 'Add Note',
    trackSymptoms: 'Track symptoms, feelings, and important observations.',
    noteTip1: 'Track symptoms like cramps, headaches, or mood changes.',
    noteTip2: 'Note any interventions or supplements you take.',
    noteTip3: 'Record diet, exercise, or lifestyle changes to keep patterns in mind.',
    noteTip4: 'Document conversations with your healthcare provider.',
    startFirstNote: 'Start Your First Note',
    clickToAdd: 'Click to add your symptoms or observations',
  },
  hi: {
    // Navbar
    home: 'होम',
    logCycle: 'लॉग साइकिल',
    symptoms: 'लक्षण',
    mood: 'मूड',
    calendar: 'कैलेंडर',
    notes: 'नोट्स',
    history: 'इतिहास',
    tips: 'स्मार्ट टिप्स',
    about: 'हमारे बारे में',
    login: 'लॉगिन',
    signup: 'साइन अप',
    profile: 'प्रोफाइल',
    changePassword: 'पासवर्ड बदलें',
    logout: 'लॉगआउट',
    helloAgain: 'नमस्ते फिर से!',
    welcomeBackMissed: 'वापसी पर स्वागत है, हमें आपकी याद आई!',
    emailAddress: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'साइन इन करें',
    signingIn: 'साइन इन हो रहा है...',
    dontHaveAccount: 'क्या आपके पास खाता नहीं है?',
    createAccount: 'खाता बनाएँ',
    joinUsTracking: 'अपने स्वास्थ्य को ट्रैक करना शुरू करने के लिए हमसे जुड़ें',
    fullName: 'पूरा नाम',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    iAgreeTo: 'मैं सहमत हूँ',
    termsOfService: 'सेवा की शर्तें',
    and: 'और',
    privacyPolicy: 'गोपनीयता नीति',
    alreadyHaveAccount: 'क्या आपके पास पहले से ही एक खाता है?',
    creatingAccount: 'खाता बना रहा है...',
    iUnderstandAgree: 'मैं समझता हूँ और सहमत हूँ',
    medicalDisclaimer: 'चिकित्सा अस्वीकरण:',
    medicalDisclaimerText: 'Cleo कोई चिकित्सा उपकरण नहीं है और इसका उपयोग जन्म नियंत्रण या निदान के लिए नहीं किया जाना चाहिए। हमेशा डॉक्टर से सलाह लें।',
    heroTitle: 'लय। अंतर्दृष्टि। संतुलन।',
    heroSubtitle: 'अपने मासिक धर्म चक्र को आसानी से ट्रैक करें और अपने शरीर के अनूठे पैटर्न के बारे में बहुमूल्य अंतर्दृष्टि प्राप्त करें। अपनी लय को समझें और अपने स्वास्थ्य पर नियंत्रण रखें।',
    startTracking: 'ट्रैकिंग शुरू करें',
    learnMore: 'अधिक जानें',
    everythingYouNeed: 'अपने चक्र के बारे में वह सब कुछ जो आपको जानना आवश्यक है',
    howCleoWorks: 'Cleo कैसे काम करता है',
    readyToStart: 'अपनी यात्रा शुरू करने के लिए तैयार हैं?',
    thousandsOfWomen: 'अपने चक्र को बेहतर ढंग से समझने की दिशा में पहला कदम उठाएं। अपने स्वास्थ्य को ट्रैक करने के लिए CLEO का उपयोग करने वाली हजारों महिलाओं से जुड़ें।',
    startTrackingNow: 'अब ट्रैकिंग शुरू करें',
    cycleTracking: 'चक्र ट्रैकिंग',
    cycleTrackingDesc: 'हमारे सहज ट्रैकिंग इंटरफ़ेस के साथ अपने मासिक धर्म चक्र को आसानी से लॉग और मॉनिटर करें।',
    fertilityInsights: 'प्रजनन क्षमता अंतर्दृष्टि',
    fertilityInsightsDesc: 'अपनी प्रजनन क्षमता विंडो को समझें और सटीक भविष्यवाणियों के साथ तदनुसार योजना बनाएं।',
    healthAnalytics: 'स्वास्थ्य विश्लेषण',
    healthAnalyticsDesc: 'अपने स्वास्थ्य रुझानों को ट्रैक करें और अपने चक्र पैटर्न में विस्तृत अंतर्दृष्टि प्राप्त करें।',
    moodTracking: 'मूड ट्रैकिंग',
    moodTrackingDesc: 'यह समझने के लिए कि आपका चक्र आपके कल्याण को कैसे प्रभावित करता है, अपना मूड और लक्षण लॉग करें।',
    personalizedAdvice: 'व्यक्तिगत सलाह',
    personalizedAdviceDesc: 'अपने अनूठे चक्र और जीवनशैली के आधार पर अनुरूप अनुशंसाएं प्राप्त करें।',
    cyclePredictions: 'चक्र भविष्यवाणियां',
    cyclePredictionsDesc: 'अपने अगले पीरियड और फर्टिलिटी विंडो के लिए सटीक भविष्यवाणियां प्राप्त करें।',
    logYourCycle: 'अपना साइकिल लॉग करें',
    logYourCycleDesc: 'बस कुछ ही टैप में अपना पीरियड और चक्र की जानकारी लॉग करके शुरू करें।',
    trackSymptomsMood: 'लक्षण और मूड ट्रैक करें',
    trackSymptomsMoodDesc: 'पैटर्न देखने के लिए अपने पूरे चक्र के दौरान अपने लक्षणों और मूड को रिकॉर्ड करें।',
    getInsightsPredictions: 'अंतर्दृष्टि और भविष्यवाणियां प्राप्त करें',
    getInsightsPredictionsDesc: 'अपने स्वास्थ्य के लिए व्यक्तिगत अंतर्दृष्टि और सटीक भविष्यवाणियां प्राप्त करें।',
    cycleCalendar: 'चक्र कैलेंडर',
    trackManageCycle: 'अपने चक्र को ट्रैक और प्रबंधित करें',
    viewHistory: 'इतिहास देखें',
    fertileWindow: 'प्रजनन काल',
    ovulationDay: 'ओव्यूलेशन दिन',
    predictedPeriod: 'अनुमानित अवधि',
    periodFlow: 'आपका पीरियड फ्लो',
    daysSelected: 'दिन चुने गए',
    saveAll: 'सभी सहेजें',
    markPeriodDay: 'पीरियड दिन के रूप में चिह्नित करें',
    periodDayActive: '✓ पीरियड दिन',
    noMoodLogged: 'कोई मूड लॉग नहीं किया गया',
    noSymptomsLogged: 'कोई लक्षण लॉग नहीं किया गया',
    noNotesForDay: 'इस दिन के लिए कोई नोट नहीं',
    writeQuickNote: 'एक त्वरित नोट लिखें...',
    add: 'जोड़ें',
    light: 'हल्का',
    medium: 'मध्यम',
    heavy: 'भारी',
    superFlow: 'सुपर',
    weekdays: {
      sun: 'रवि', mon: 'सोम', tue: 'मंगल', wed: 'बुध', thu: 'गुरु', fri: 'शुक्र', sat: 'शनि'
    },

    // History
    historyTitle: 'पीरियड इतिहास',
    historySubtitle: 'अपने चक्र रिकॉर्ड देखें और प्रबंधित करें',
    totalCycles: 'कुल चक्र',
    avgCycleLengthValue: 'औसत चक्र लंबाई',
    lastPeriodDateLabel: 'पिछला पीरियड',
    nextExpectedLabel: 'अगला अपेक्षित',
    cycleNumLabel: 'चक्र #',
    flowLabel: 'प्रवाह',
    actionsLabel: 'कार्रवाई',
    regularity: 'नियमितता',
    veryRegular: 'बहुत नियमित',
    mostCommonFlow: 'सबसे आम प्रवाह',
    predictionAccuracy: 'भविष्यवाणी सटीकता',
    editPeriodRecord: 'पीरियड रिकॉर्ड संपादित करें',
    deletePeriodRecord: 'पीरियड रिकॉर्ड हटाएं',
    confirmDeletePeriod: 'क्या आप वाकई इस अवधि के रिकॉर्ड को हटाना चाहते हैं?',
    cannotBeUndone: 'यह क्रिया पूर्ववत नहीं की जा सकती।',
    periodLengthUnit: 'दिन',
    ofCycles: 'चक्रों का',
    basedOn: 'आधारित',
    variation: 'बदलाव',

    // Reminders
    manageReminders: 'रिमाइंडर प्रबंधित करें',
    remindersSubtitle: 'अनुकूलित करें कि आप कब और कैसे चाहते हैं कि Cleo आपको सूचित करे',
    cyclePredictionsLabel: 'चक्र भविष्यवाणियां',
    dailyHabitsLabel: 'दैनिक आदतें',
    notificationPrefsLabel: 'अधिसूचना प्राथमिकताएँ',
    defaultReminderTime: 'डिफ़ॉल्ट रिमाइंडर समय',
    saveSettings: 'सेटिंग्स सहेजें',
    periodApproachingLabel: 'पीरियड करीब आ रहा है',
    periodApproachingDesc: 'आपके पीरियड शुरू होने की उम्मीद से पहले सूचित हों',
    ovulationWindowLabel: 'ओव्यूलेशन विंडो',
    ovulationWindowDesc: 'जब आपकी प्रजनन क्षमता विंडो शुरू हो रही हो तो सूचित हों',
    dailyCheckInLabel: 'दैनिक चेक-इन',
    dailyCheckInDesc: 'अपने लक्षण, मूड और नोट्स लॉग करने के लिए रिमाइंडर',
    medicationReminderLabel: 'दवा रिमाइंडर',
    medicationReminderDesc: 'अपनी दवा लेने के लिए दैनिक रिमाइंडर',
    notifyMe: 'मुझे सूचित करें',
    daysBefore: 'दिन पहले',
    dayBefore: 'दिन पहले',

    // Tips
    tipsTitle: 'स्वास्थ्य और आत्म-देखभाल युक्तियाँ',
    tipsSubtitle: 'बेहतर मासिक धर्म स्वास्थ्य के लिए विशेषज्ञ की सलाह',
    allTips: 'सभी युक्तियाँ',
    dietNutrition: 'आहार और पोषण',
    exercise: 'व्यायाम',
    pmsRelief: 'PMS राहत',
    hygiene: 'स्वच्छता',
    wellness: 'कल्याण',
    noTipsFound: 'इस श्रेणी में कोई सुझाव नहीं मिले',
    readMore: 'और पढ़ें',
    gotItThanks: 'समझ गया, धन्यवाद!',
    tipsData: {
      tip1: {
        title: 'आयरन युक्त भोजन',
        content: 'मासिक धर्म के दौरान आयरन की कमी को पूरा करने के लिए पालक और दालों का सेवन करें।',
        detail: 'मासिक धर्म के दौरान थकान और एनीमिया को रोकने के लिए आयरन आवश्यक है। पालक, दालें और बीन्स अच्छे स्रोत हैं। बेहतर अवशोषण के लिए विटामिन सी का उपयोग करें।'
      },
      tip2: {
        title: 'हल्का व्यायाम',
        content: 'योग या पैदल चलना दर्द कम करने और मूड सुधारने में मदद कर सकता है।',
        detail: 'हल्की शारीरिक गतिविधि एंडोर्फिन जारी करती है। योग और स्ट्रेचिंग शरीर को आराम पहुँचाते हैं।'
      },
      tip3: {
        title: 'PMS का प्रबंधन',
        content: 'लक्षणों को कम करने के लिए पर्याप्त पानी पिएं और कैफीन कम करें।',
        detail: 'जीवनशैली में बदलाव राहत दे सकते हैं। कम नमक और संतुलित नींद महत्वपूर्ण है।'
      },
      tip4: {
        title: 'मासिक धर्म स्वच्छता',
        content: 'हर 4-6 घंटे में पैड/टैम्पोन बदलें और हाथ अच्छी तरह धोएं।',
        detail: 'स्वच्छता संक्रमण रोकती है। बाहरी सफाई के लिए हल्के साबुन का प्रयोग करें।'
      },
      tip5: {
        title: 'सूजन कम करें',
        content: 'नमकीन भोजन से बचें और केले जैसे पोटेशियम युक्त खाद्य पदार्थ खाएं।',
        detail: 'पोटेशियम शरीर से अतिरिक्त सोडियम निकालने में मदद करता है। पुदीने की चाय भी लाभदायक है।'
      },
      tip6: {
        title: 'तनाव प्रबंधन',
        content: 'चक्र को नियमित करने के लिए ध्यान या गहरी सांस लेने का अभ्यास करें।',
        detail: 'तनाव हार्मोन्स को प्रभावित करता है। दैनिक ध्यान तनाव कम करने में मदद करता है।'
      },
      tip7: {
        title: 'नींद की गुणवत्ता',
        content: 'हार्मोन को संतुलित करने के लिए 7-8 घंटे की अच्छी नींद लें।',
        detail: 'सोने से एक घंटा पहले स्क्रीन से बचें और सोने का एक ही समय रखें।'
      },
      tip8: {
        title: 'हीट थेरेपी',
        content: 'दर्द से राहत के लिए पेट के निचले हिस्से पर हीटिंग पैड लगाएं।',
        detail: 'गर्मी गर्भाशय की मांसपेशियों को आराम देती है। 15-20 मिनट सिकाई करें।'
      },
      tip9: {
        title: 'सही उत्पाद चुनें',
        content: 'अपने फ्लो और आराम के अनुसार उत्पादों का चयन करें।',
        detail: 'पूरी जानकारी रखें: पैड, टैम्पोन, कप या पीरियड अंडरवियर में से जो सही लगे।'
      },
      tip10: {
        title: 'तैराकी के लाभ',
        content: 'तैराकी दर्द से राहत और मानसिक शांति देती है।',
        detail: 'पानी शरीर का भार संभालता है और जोड़ों पर दबाव कम करता है।'
      },
      tip11: {
        title: 'ओमेगा-3 फैटी एसिड',
        content: 'अखरोट और अलसी के बीज सूजन और दर्द कम करने में मदद करते हैं।',
        detail: 'ओमेगा-3 प्राकृतिक रूप से दर्द कम करने वाले रसायनों को रोकता है।'
      },
      tip12: {
        title: 'स्ट्रेंथ ट्रेनिंग',
        content: 'नियमित व्यायाम लंबे समय में हार्मोन को नियंत्रित करता है।',
        detail: 'मांसपेशियां बनाने से हार्मोनल संतुलन सुधरता है और स्वास्थ्य बेहतर होता है।'
      }
    },

    // Log Period
    logPeriodTitle: 'पीरियड लॉग करें',
    logPeriodSubtitle: 'अपने पीरियड की तारीखें और प्रवाह रिकॉर्ड करें',
    startDateLabel: 'प्रारंभ तिथि',
    endDateLabel: 'समाप्ति तिथि',
    lightFlowLabel: 'हल्का प्रवाह',
    mediumFlowLabel: 'मध्यम प्रवाह',
    heavyFlowLabel: 'भारी प्रवाह',

    // Change Password
    changePasswordTitle: 'अपना पासवर्ड बदलें',
    currentPasswordLabel: 'वर्तमान पासवर्ड',
    newPasswordLabel: 'नया पासवर्ड',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते',
    savePassword: 'पासवर्ड सहेजें',
    passwordSavedSuccess: 'पासवर्ड सफलतापूर्वक सहेजा गया!',
    enterCurrentPassword: 'अपना वर्तमान पासवर्ड दर्ज करें',
    enterNewPassword: 'नया पासवर्ड दर्ज करें',
    reEnterPassword: 'अपना पासवर्ड फिर से दर्ज करें',

    // Auth - Forgot Password
    forgotPasswordTitle: 'पासवर्ड भूल गए?',
    forgotPasswordDesc: 'अपना ईमेल दर्ज करें और हम आपको आपका पासवर्ड रीसेट करने के लिए एक लिंक भेजेंगे।',
    sendResetLink: 'रीसेट लिंक भेजें',
    backToLogin: 'लॉगिन पर वापस जाएं',
    checkYourEmail: 'अपना ईमेल जांचें',
    resetEmailSent: 'हमने एक पासवर्ड रीसेट लिंक भेजा है',
    checkInboxSpam: 'कृपया अपना इनबॉक्स और स्पैम फ़ोल्डर जांचें।',
    didntReceiveEmail: 'प्राप्त नहीं हुआ? पुन: प्रयास करें',

    // Resources
    aboutTitle: 'Cleo के बारे में',
    aboutSubtitle: 'सटीकता, देखभाल और उन्नत डेटा विज्ञान के साथ लाखों लोगों को अपने शरीर को समझने के लिए सशक्त बनाना।',
    ourMission: 'हमारा मिशन',
    needHelp: 'मदद चाहिए?',
    emailSupport: 'ईमेल समर्थन',
    backToHome: 'होम पर वापस जाएं',

    // Onboarding
    step: 'कदम',
    of: 'का',
    howOldAreYou: 'आपकी उम्र क्या है?',
    personalizeExperience: 'यह हमें आपके ट्रैकिंग अनुभव को व्यक्तिगत बनाने में मदद करता है',
    cycleLengthQuestion: 'आपका चक्र की लंबाई क्या है?',
    periodLengthQuestion: 'आपकी पीरियड की लंबाई क्या है?',
    lastPeriodQuestion: 'आपका पिछला पीरियड कब था?',
    getStarted: 'शुरू करें',
    updateLaterSettings: 'आप इस जानकारी को बाद में सेटिंग्स में अपडेट कर सकते हैं',

    // Admin
    adminDashboard: 'एडमिन डैशबोर्ड',
    userManagement: 'उपयोगकर्ता प्रबंधन',
    contentManagement: 'सामग्री प्रबंधन',
    searchUsers: 'नाम या ईमेल द्वारा उपयोगकर्ता खोजें...',
    joinDate: 'जुड़ने की तिथि',
    lastActive: 'पिछली बार सक्रिय',
    active: 'सक्रिय',
    blocked: 'अवरुद्ध',
    showing: 'दिखा रहा है',
    previous: 'पिछला',
    next: 'अगला',

    // Footer
    quickLinks: 'त्वरित लिंक',
    resources: 'संसाधन',
    contact: 'संपर्क',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',

    // Common
    back: 'पीछे',
    continue: 'जारी रखें',
    saving: 'सहेज रहा है...',
    saveChanges: 'परिवर्तन सहेजें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    confirm: 'पुष्टि करें',
    success: 'सफलता',
    error: 'त्रुटि',

    noteTips: 'नोट्स लेने के लिए सुझाव',
    noteTip1: 'ऐंठन, सिरदर्द या मूड में बदलाव जैसे लक्षणों को ट्रैक करें।',
    noteTip2: 'आपके द्वारा लिए गए पूरक या दवाओं को नोट करें।',
    noteTip3: 'पैटर्न को ध्यान में रखने के लिए आहार और जीवनशैली के बदलाव रिकॉर्ड करें।',
    noteTip4: 'अपने डॉक्टर के साथ हुई बातचीत का दस्तावेजीकरण करें।',
    startFirstNote: 'अपना पहला नोट शुरू करें',
    clickToAdd: 'अपने लक्षणों या टिप्पणियों को जोड़ने के लिए क्लिक करें',
    editNoteTitle: 'नोट संपादित करें',
    addNewNote: 'नया नोट जोड़ें',
    title: 'शीर्षक',
    content: 'सामग्री',
    enterTitle: 'नोट का शीर्षक दर्ज करें...',
    writeObservation: 'अपनी टिप्पणी यहाँ लिखें...',
    noteSaved: 'नोट सफलतापूर्वक सहेजा गया!',
    noteUpdated: 'नोट सफलतापूर्वक अपडेट किया गया!',
    noteDeleted: 'नोट सफलतापूर्वक हटाया गया!',
    deleteNoteConfirm: 'क्या आप वाकई इस नोट को हटाना चाहते हैं?',
    permanentAction: 'यह कार्रवाई पूर्ववत नहीं की जा जा सकती।',

    // Profile
    updateProfile: 'प्रोफ़ाइल अपडेट करें',
    profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    email: 'ईमेल',
    phone: 'फ़ोन',
    dob: 'जन्म तिथि',
    deleteAccount: 'खाता हटाएं',
    myProfile: 'मेरी प्रोफाइल',
    manageAccount: 'अपने खाते और चक्र की जानकारी प्रबंधित करें',
    dailyGoals: 'दैनिक लक्ष्य',
    nudge: 'नज',
    editGoals: 'लक्ष्य संपादित करें',
    saveGoals: 'लक्ष्य सहेजें',
    resetProgress: 'प्रगति रीसेट करें',
    addNewGoal: 'नया लक्ष्य जोड़ें',
    goalName: 'लक्ष्य का नाम',
    target: 'लक्ष्य',
    unit: 'इकाई',
    dangerZone: 'खतरनाक क्षेत्र',
    deleteWarning: 'चेतावनी: यह कार्रवाई स्थायी है और हमारे सर्वर से आपके सभी डेटा को सुरक्षित रूप से मिटा देगी।',
    activeProfile: 'सक्रिय प्रोफाइल',
    personalInfo: 'व्यक्तिगत जानकारी',
    cycleInfo: 'चक्र की जानकारी',
    accountActivity: 'खाता गतिविधि',
    age: 'आयु',
    avgCycleLength: 'औसत चक्र लंबाई',
    avgPeriodLength: 'औसत पीरियड लंबाई',
    memberSince: 'सदस्य जब से',
    cyclesTracked: 'ट्रैक किए गए चक्र',
    notesCreated: 'बनाए गए नोट्स',
    moodEntries: 'मूड प्रविष्टियां',
    resetGoalsConfirm: 'दैनिक लक्ष्य रीसेट करें?',
    resetGoalsMsg: 'यह आज के लिए आपकी सभी प्रगति को साफ़ कर देगा। यह कार्रवाई पूर्ववत नहीं की जा सकती।',
    newHealthGoal: 'नया स्वास्थ्य लक्ष्य',
    accountDeleted: 'खाता सफलतापूर्वक हटा दिया गया! अलविदा।',
    dangerPermanent: 'खतरा: स्थायी कार्रवाई',

    // Symptoms
    logSymptoms: 'लक्षण लॉग करें',
    cramps: 'ऐंठन',
    headache: 'सिरदर्द',
    acne: 'मुँहासे',
    backache: 'पीठ दर्द',
    fatigue: 'थकान',
    bloating: 'सूजन',
    nausea: 'जी मिचलाना',
    tenderBreasts: 'स्तनों में कोमलता',
    anxiety: 'चिंता',
    moodSwings: 'मूड स्विंग्स',
    highEnergy: 'अधिक ऊर्जा',
    increasedAppetite: 'भूख में वृद्धि',
    symptomLogger: 'लक्षण लॉगर',
    trackPhysicalEmotional: 'अपने शारीरिक और भावनात्मक लक्षणों को ट्रैक करें',
    selectYourSymptoms: 'अपने लक्षण चुनें',
    saveSymptoms: 'लक्षण सहेजें',
    additionalNotes: 'अतिरिक्त टिप्पणियाँ',
    symptomsRecorded: 'लक्षण दर्ज किए गए!',
    recommendCareTip: 'आपके लॉग के आधार पर, हम इस देखभाल टिप की सलाह देते हैं:',
    finishReturn: 'समाप्त करें और डैशबोर्ड पर लौटें',
    editLog: 'लॉग संपादित करें',
    writeAdditional: 'आज आप कैसा महसूस कर रहे हैं, इसके बारे में अतिरिक्त लक्षण जोड़ें...',

    // Moods
    happy: 'खुश',
    sad: 'दुखी',
    angry: 'गुस्सा',
    crying: 'रोना',
    energetic: 'ऊर्जावान',
    peaceful: 'शांत',
    tired: 'थका हुआ',
    anxious: 'चिंतित',
    neutral: 'सामान्य',
    sleepy: 'नींद आना',
    sick: 'बीमार',
    hungry: 'भूखा',
    visualMoodBoard: 'विजुअल मूड बोर्ड',
    trackDailyMood: 'अपने पूरे चक्र में अपने दैनिक मूड को ट्रैक करें।',
    moodHistory: 'मूड इतिहास',
    patternInsight: 'पैटर्न अंतर्दृष्टि',
    insightText: 'आप अपने चक्र के कूपिक चरण के दौरान अधिक ऊर्जावान और खुश महसूस करते हैं।',
    finishAndGo: 'समाप्त करें और डैशबोर्ड पर जाएं',
    logAnother: 'एक और मूड लॉग करें',
    greatJobLogging: 'अपना मूड लॉग करने के लिए बहुत अच्छा काम!',
    recommendedForYou: 'आपके लिए अनुशंसित',
    noMoodEntries: 'अभी तक कोई मूड प्रविष्टि नहीं है। ट्रैकिंग शुरू करने के लिए ऊपर एक मूड चुनें!',
    suggestedHelp: 'आप कैसा महसूस कर रहे हैं, इसके आधार पर हमने सोचा कि यह मदद कर सकता है:',

    // Dashboard
    welcome: 'स्वागत है',
    selfCare: 'आत्म-देखभाल से बेहतर कोई उपचार नहीं है।',
    firstPeriod: 'पहला पीरियड',
    currentCycleDay: 'वर्तमान चक्र दिन',
    peakStatus: 'आप अपने शिखर पर हैं',
    days: 'दिन',
    inDays: 'में',
    quickActions: 'त्वरित कार्रवाई',
    howFeeling: 'आज आप कैसा महसूस कर रहे हैं?',
    viewMood: 'मूड विश्लेषण देखें',
    cycleInsights: 'चक्र अंतर्दृष्टि',
    recentNotes: 'हाल के नोट्स',
    viewAllNotes: 'सभी नोट्स देखें',
    healthTip: 'आज की स्वास्थ्य टिप',
    moreTips: 'अधिक टिप्स',
    reminders: 'अनुस्मारक',
    addNote: 'नोट जोड़ें',
    myNotes: 'मेरे नोट्स',
    trackSymptoms: 'लक्षणों, भावनाओं और महत्वपूर्ण टिप्पणियों को ट्रैक करें।',

    // Calendar
    months: {
      jan: 'जनवरी', feb: 'फरवरी', mar: 'मार्च', apr: 'अप्रैल', may: 'मई', jun: 'जून',
      jul: 'जुलाई', aug: 'अगस्त', sep: 'सितंबर', oct: 'अक्टूबर', nov: 'नवंबर', dec: 'दिसंबर'
    }
  },
  gj: {
    // Navbar
    home: 'હોમ',
    logCycle: 'લોગ સાયકલ',
    symptoms: 'લક્ષણો',
    mood: 'મૂડ',
    calendar: 'કેલેન્ડર',
    notes: 'નોંધો',
    history: 'ઇતિહાસ',
    tips: 'સ્માર્ટ ટિપ્સ',
    about: 'અમારા વિશે',
    login: 'લોગિન',
    signup: 'સાઇન અપ',
    profile: 'પ્રોફાઇલ Settings',
    changePassword: 'પાસવર્ડ બદલો',
    logout: 'લોગઆઉટ',
    helloAgain: 'ફરીથી હેલો!',
    welcomeBackMissed: 'ફરી સ્વાગત છે, અમે તમને યાદ કર્યા!',
    emailAddress: 'ઈમેલ સરનામું',
    passwordLabel: 'પાસવર્ડ',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા છો?',
    signIn: 'સાઇન ઇન કરો',
    signingIn: 'સાઇન ઇન થઈ રહ્યું છે...',
    dontHaveAccount: 'ખાતું નથી?',
    createAccount: 'ખાતું બનાવો',
    joinUsTracking: 'તમારા સ્વાસ્થ્યને ટ્રૅક કરવાનું શરૂ કરવા માટે અમારી સાથે જોડાઓ',
    fullName: 'આખું નામ',
    confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
    iAgreeTo: 'હું સંમત છું',
    termsOfService: 'સેવાની શરતો',
    and: 'અને',
    privacyPolicy: 'ગોપનીયતા નીતિ',
    alreadyHaveAccount: 'પહેલેથી જ ખાતું છે?',
    creatingAccount: 'ખાતું બનાવી રહ્યું છે...',
    iUnderstandAgree: 'હું સમજું છું અને સંમત છું',
    medicalDisclaimer: 'તબીબી અસ્વીકરણ:',
    medicalDisclaimerText: 'Cleo એ મેડિકલ ડિવાઇસ નથી અને તેનો ઉપયોગ જન્મ નિયંત્રણ અથવા નિદાન માટે થવો જોઈએ નહીં. હંમેશા ડૉક્ટરની સલાહ લો.',
    heroTitle: 'લય. આંતરદૃષ્ટિ. સંતુલન.',
    heroSubtitle: 'તમારા માસિક ચક્રને સરળતાથી ટ્રૅક કરો અને તમારા શરીરની વિશિષ્ટ પેટર્ન વિશે મૂલ્યવાન આંતરદૃષ્ટિ મેળવો. તમારી લયને સમજો અને તમારા સ્વાસ્થ્ય પર નિયંત્રણ મેળવો.',
    startTracking: 'ટ્રૅકિંગ શરૂ કરો',
    learnMore: 'વધુ જાણો',
    everythingYouNeed: 'તમારા ચક્ર વિશે તમારે જાણવાની જરૂર હોય તે બધું',
    howCleoWorks: 'Cleo કેવી રીતે કાર્ય કરે છે',
    readyToStart: 'તમારી યાત્રા શરૂ કરવા માટે તૈયાર છો?',
    thousandsOfWomen: 'તમારા ચક્રને વધુ સારી રીતે સમજવા તરફ પ્રથમ પગલું ભરો. તેમના સ્વાસ્થ્યને ટ્રૅક કરવા માટે CLEO નો ઉપયોગ કરતી હજારો સ્ત્રીઓમાં જોડાઓ.',
    startTrackingNow: 'હમણાં જ ટ્રૅકિંગ શરૂ કરો',
    cycleTracking: 'સાયકલ ટ્રેકિંગ',
    cycleTrackingDesc: 'અમારા સાહજિક ટ્રેકિંગ ઇન્ટરફેસ સાથે તમારા માસિક ચક્રને સરળતાથી લોગ અને મોનિટર કરો.',
    fertilityInsights: 'પ્રજનન ક્ષમતા આંતરદૃષ્ટિ',
    fertilityInsightsDesc: 'તમારી પ્રજનન ક્ષમતાની વિન્ડો સમજો અને ચોક્કસ આગાહીઓ સાથે તે મુજબ યોજના બનાવો.',
    healthAnalytics: 'હેલ્થ એનાલિટિક્સ',
    healthAnalyticsDesc: 'તમારા સ્વાસ્થ્યના વલણોને ટ્રૅક કરો અને તમારા ચક્રની પેટર્નમાં વિગતવાર આંતરદૃષ્ટિ મેળવો.',
    moodTracking: 'મૂડ ટ્રેકિંગ',
    moodTrackingDesc: 'તમારું ચક્ર તમારી સુખાકારીને કેવી રીતે અસર કરે છે તે સમજવા માટે તમારા મૂડ અને લક્ષણો લોગ કરો.',
    personalizedAdvice: 'વ્યક્તિગત સલાહ',
    personalizedAdviceDesc: 'તમારા અનન્ય ચક્ર અને જીવનશૈલીના આધારે અનુરૂપ ભલામણો મેળવો.',
    cyclePredictions: 'ચક્રની આગાહીઓ',
    cyclePredictionsDesc: 'તમારા આગામી માસિક અને પ્રજનન ક્ષમતાની વિન્ડો માટે ચોક્કસ આગાહીઓ મેળવો.',
    logYourCycle: 'તમારી સાયકલ લોગ કરો',
    logYourCycleDesc: 'માત્ર થોડા ટેપમાં તમારા માસિક અને ચક્રની માહિતી લોગ કરીને પ્રારંભ કરો.',
    trackSymptomsMood: 'લક્ષણો અને મૂડ ટ્રૅક કરો',
    trackSymptomsMoodDesc: 'પેટર્ન જોવા માટે તમારા આખા ચક્ર દરમિયાન તમારા લક્ષણો અને મૂડ રકોર્ડ કરો.',
    getInsightsPredictions: 'આંતરદૃષ્ટિ અને આગાહી મેળવો',
    getInsightsPredictionsDesc: 'તમારા સ્વાસ્થ્ય માટે વ્યક્તિગત આંતરદૃષ્ટિ અને ચોક્કસ આગાહીઓ મેળવો।',
    cycleCalendar: 'સાયકલ કેલેન્ડર',
    trackManageCycle: 'તમારા ચક્રને ટ્રૅક અને મેનેજ કરો',
    viewHistory: 'ઇતિહાસ જુઓ',
    fertileWindow: 'પ્રજનનક્ષમ ગાળો',
    ovulationDay: 'ઓવ્યુલેશન ડે',
    predictedPeriod: 'અનુમાનિત સમયગાળો',
    periodFlow: 'તમારો માસિક પ્રવાહ',
    daysSelected: 'દિવસો પસંદ કર્યા',
    saveAll: 'બધું સાચવો',
    markPeriodDay: 'માસિક દિવસ તરીકે ચિહ્નિત કરો',
    periodDayActive: '✓ માસિક દિવસ',
    noMoodLogged: 'કોઈ મૂડ લોગ થયો નથી',
    noSymptomsLogged: 'કોઈ લક્ષણો લોગ થયા નથી',
    noNotesForDay: 'આ દિવસ માટે કોઈ નોંધ નથી',
    writeQuickNote: 'ઝડપી નોંધ લખો...',
    add: 'ઉમેરો',
    light: 'હળવો',
    medium: 'મધ્યમ',
    heavy: 'ભારે',
    superFlow: 'સુપર',
    weekdays: {
      sun: 'રવિ', mon: 'સોમ', tue: 'મંગળ', wed: 'બુધ', thu: 'ગુરુ', fri: 'શુક્ર', sat: 'શનિ'
    },

    // History
    historyTitle: 'માસિક ઇતિહાસ',
    historySubtitle: 'તમારા ચક્રના રેકોર્ડ જુઓ અને મેનેજ કરો',
    totalCycles: 'કુલ ચક્ર',
    avgCycleLengthValue: 'સરેરાશ ચક્ર લંબાઈ',
    lastPeriodDateLabel: 'છેલ્લું માસિક',
    nextExpectedLabel: 'આગામી અપેક્ષિત',
    cycleNumLabel: 'ચક્ર #',
    flowLabel: 'પ્રવાહ',
    actionsLabel: 'કાર્ય',
    regularity: 'નિયમિતતા',
    veryRegular: 'ખૂબ જ નિયમિત',
    mostCommonFlow: 'સૌથી સામાન્ય પ્રવાહ',
    predictionAccuracy: 'આગાહી ચોકસાઈ',
    editPeriodRecord: 'માસિક રેકોર્ડ સંપાદિત કરો',
    deletePeriodRecord: 'માસિક રેકોર્ડ કાઢી નાખો',
    confirmDeletePeriod: 'શું તમે ખરેખર આ રેકોર્ડ કાઢી નાખવા માંગો છો?',
    cannotBeUndone: 'આ ક્રિયા પાછી લાવી શકાશે નહીં.',
    periodLengthUnit: 'દિવસ',
    ofCycles: 'ચક્રમાંથી',
    basedOn: 'આધારિત',
    variation: 'તફાવત',

    // Reminders
    manageReminders: 'રિમાઇન્ડર મેનેજ કરો',
    remindersSubtitle: 'Cleo તમને ક્યારે અને કેવી રીતે જાણ કરે તે કસ્ટમાઇઝ કરો',
    cyclePredictionsLabel: 'ચક્ર આગાહીઓ',
    dailyHabitsLabel: 'દૈનિક આદતો',
    notificationPrefsLabel: 'સૂચના પસંદગીઓ',
    defaultReminderTime: 'ડિફૉલ્ટ રિમાઇન્ડર સમય',
    saveSettings: 'સેટિંગ્સ સાચવો',
    periodApproachingLabel: 'માસિક નજીક આવી રહ્યું છે',
    periodApproachingDesc: 'તમારું માસિક શરૂ થવાની અપેક્ષા હોય તે પહેલાં સૂચના મેળવો',
    ovulationWindowLabel: 'ઓવ્યુલેશન વિન્ડો',
    ovulationWindowDesc: 'જ્યારે તમારી પ્રજનનક્ષમ વિન્ડો શરૂ થાય ત્યારે સૂચના મેળવો',
    dailyCheckInLabel: 'દૈનિક ચેક-ઇન',
    dailyCheckInDesc: 'તમારા લક્ષણો, મૂડ અને નોંધો લોગ કરવાનું રિમાઇન્ડર',
    medicationReminderLabel: 'દવા રિમાઇન્ડર',
    medicationReminderDesc: 'તમારી દવા લેવા માટે દૈનિક રિમાઇન્ડર',
    notifyMe: 'મને જાણ કરો',
    daysBefore: 'દિવસ પહેલા',
    dayBefore: 'દિવસ પહેલા',

    // Tips
    tipsTitle: 'સ્વાસ્થ્ય અને આત્મ-સંભાળ ટિપ્સ',
    tipsSubtitle: 'વધારે સારા માસિક સ્વાસ્થ્ય માટે નિષ્ણાતની સલાહ',
    allTips: 'બધી ટિપ્સ',
    dietNutrition: 'આહાર અને પોષણ',
    exercise: 'વ્યાયામ',
    pmsRelief: 'PMS રાહત',
    hygiene: 'સ્વચ્છતા',
    wellness: 'સુખાકારી',
    noTipsFound: 'આ કેટેગરીમાં કોઈ ટિપ્સ મળી નથી',
    readMore: 'વધુ વાંચો',
    gotItThanks: 'સમજાયું, આભાર!',
    tipsData: {
      tip1: {
        title: 'આયર્નયુક્ત ખોરાક',
        content: 'માસિક ધર્મ દરમિયાન આયર્નની ઉણપ પૂરી કરવા પાલક અને દાળનો સમાવેશ કરો.',
        detail: 'આયર્ન થાક અને એનિમિયા ઘટાડવામાં મદદ કરે છે. વિટામિન સી સાથે ખાવાથી વધુ ફાયદો થાય છે.'
      },
      tip2: {
        title: 'હળવી કસરત',
        content: 'યોગ અથવા ચાલવાથી પીડામાં રાહત મળે છે અને મૂડ સુધરે છે.',
        detail: 'શારીરિક પ્રવૃત્તિથી શરીરમાં એન્ડોર્ફિન વધે છે જે પીડા ઘટાડે છે.'
      },
      tip3: {
        title: 'PMS મેનેજમેન્ટ',
        content: 'પૂરતું પાણી પીઓ અને વધુ ઊંઘ લો જેથી લક્ષણો ઓછા થાય.',
        detail: 'જીવનશૈલીમાં ફેરફાર રાહત આપે છે. મીઠું અને કેફીન ઓછું લો.'
      },
      tip4: {
        title: 'સ્વચ્છતા',
        content: 'દર 4-6 કલાકે પેડ/ટેમ્પન બદલો અને હાથ બરાબર ધોવો.',
        detail: 'સ્વચ્છતાથી ચેપ અટકે છે. હળવા સાબુનો ઉપયોગ કરો.'
      },
      tip5: {
        title: 'સોજો ઓછો કરો',
        content: 'મીઠો ખોરાક ટાળો અને કેળા જેવા પોટેશિયમયુક્ત ફળો ખાઓ.',
        detail: 'પોટેશિયમ શરીરમાંથી વધારાનું સોડિયમ દૂર કરવામાં મદદરૂપ થાય છે.'
      },
      tip6: {
        title: 'તણાવ મુક્તિ',
        content: 'ચક્ર નિયમિત કરવા માટે ધ્યાન અથવા ઊંડા શ્વાસ લેવાની પ્રેક્ટિસ કરો.',
        detail: 'તણાવ હોર્મોન્સને અસર કરે છે. રોજ ધ્યાન કરવાથી શાંતિ મળે છે.'
      },
      tip7: {
        title: 'ઊંઘની ગુણવત્તા',
        content: 'હોર્મોન્સ સંતુલિત કરવા માટે 7-8 કલાકની સારી ઊંઘ લો.',
        detail: 'સુવાના સમયે સ્ક્રિન ટાળો અને સમાન સમયે સુવાની આદત પાડો.'
      },
      tip8: {
        title: 'હીટ થેરાપી',
        content: 'પીડામાં રાહત મેળવવા પેટના નીચેના ભાગમાં શેક કરો.',
        detail: 'ગરમીથી ગર્ભાશયના સ્નાયુઓ રિલેક્સ થાય છે. 15-20 મિનિટ શેક કરો.'
      },
      tip9: {
        title: 'યોગ્ય ઉત્પાદનો',
        content: 'તમારા ફ્લો અને આરામ મુજબ ઉત્પાદનોની પસંદગી કરો.',
        detail: 'પેડ, ટેમ્પન અથવા કપમાંથી જે તમને યોગ્ય લાગે તે પસંદ કરો.'
      },
      tip10: {
        title: 'તરવાના ફાયદા',
        content: 'તરવાથી શરીરમાં પીડા ઓછી થાય છે અને તાજગી અનુભવાય છે.',
        detail: 'પાણીમાં શરીરનું વજન ઓછું લાગે છે જે સ્નાયુઓને આરામ આપે છે.'
      },
      tip11: {
        title: 'ઓમેગા-3 ફેટી એસિડ',
        content: 'અખરોટ અને સીડ્સ ખાવાથી સોજો અને પીડામાં રાહત મળે છે.',
        detail: 'ઓમેગા-3 કુદરતી રીતે બળતરા ઘટાડવામાં મદદરૂપ થાય છે.'
      },
      tip12: {
        title: 'કસરતનો લાભ',
        content: 'નિયમિત કસરત લાંબા ગાળે હોર્મોન્સને નિયંત્રિત કરે છે.',
        detail: 'મસલ્સ બનાવવાથી હોર્મોનલ બેલેન્સ સુધરે છે અને સ્વાસ્થ્ય સારું રહે છે.'
      }
    },

    // Log Period
    logPeriodTitle: 'માસિક લોગ કરો',
    logPeriodSubtitle: 'તમારા માસિકની તારીખો અને પ્રવાહ રેકોર્ડ કરો',
    startDateLabel: 'શરૂઆતની તારીખ',
    endDateLabel: 'સમાપ્તિ તારીખ',
    lightFlowLabel: 'હળવો પ્રવાહ',
    mediumFlowLabel: 'મધ્યમ પ્રવાહ',
    heavyFlowLabel: 'ભારે પ્રવાહ',

    // Change Password
    changePasswordTitle: 'તમારો પાસવર્ડ બદલો',
    currentPasswordLabel: 'વર્તમાન પાસવર્ડ',
    newPasswordLabel: 'નવો પાસવર્ડ',
    confirmPasswordLabel: 'પાસવર્ડની પુષ્ટિ કરો',
    passwordsDoNotMatch: 'પાસવર્ડ મેળ ખાતા નથી',
    savePassword: 'પાસવર્ડ સાચવો',
    passwordSavedSuccess: 'પાસવર્ડ સફળતાપૂર્વક સાચવવામાં આવ્યો!',
    enterCurrentPassword: 'તમારો વર્તમાન પાસવર્ડ દાખલ કરો',
    enterNewPassword: 'નવો પાસવર્ડ દાખલ કરો',
    reEnterPassword: 'તમારો પાસવર્ડ ફરીથી દાખલ કરો',

    // Auth - Forgot Password
    forgotPasswordTitle: 'પાસવર્ડ ભૂલી ગયા છો?',
    forgotPasswordDesc: 'તમારું ઇમેઇલ દાખલ કરો અને અમે તમને તમારો પાસવર્ડ રીસેટ કરવા માટે એક લિંક મોકલીશું.',
    sendResetLink: 'રીસેટ લિંક મોકલો',
    backToLogin: 'લોગિન પર પાછા જાઓ',
    checkYourEmail: 'તમારું ઇમેઇલ તપાસો',
    resetEmailSent: 'અમે પાસવર્ડ રીસેટ લિંક મોકલી છે',
    checkInboxSpam: 'કૃપા કરીને તમારું ઇનબોક્સ અને સ્પામ ફોલ્ડર તપાસો.',
    didntReceiveEmail: 'મળ્યું નથી? ફરી પ્રયત્ન કરો',

    // Resources
    aboutTitle: 'Cleo વિશે',
    aboutSubtitle: 'ચોકસાઈ, સંભાળ અને અદ્યતન ડેટા સાયન્સ સાથે લાખો લોકોને તેમના શરીરને સમજવા માટે સશક્ત બનાવવા.',
    ourMission: 'અમારું મિશન',
    lastUpdated: 'છેલ્લે અપડેટ કરેલ',
    needHelp: 'મદદ જોઈતી હોય તો?',
    emailSupport: 'ઇમેઇલ સપોર્ટ',
    backToHome: 'હોમ પર પાછા જાઓ',

    // Onboarding
    step: 'પગલું',
    of: 'થી',
    howOldAreYou: 'તમારી ઉંમર કેટલી છે?',
    personalizeExperience: 'આ અમને તમારા ટ્રેકિંગ અનુભવને વ્યક્તિગત કરવામાં મદદ કરે છે',
    cycleLengthQuestion: 'તમારી ચક્રની લંબાઈ કેટલી છે?',
    periodLengthQuestion: 'તમારા માસિકની લંબાઈ કેટલી છે?',
    lastPeriodQuestion: 'તમારું છેલ્લું માસિક ક્યારે હતું?',
    getStarted: 'શરૂ કરો',
    updateLaterSettings: 'તમે આ માહિતી પછીથી સેટિંગ્સમાં અપડેટ કરી શકો છો',

    // Admin
    adminDashboard: 'એડમિન ડેશબોર્ડ',
    userManagement: 'વપરાશકર્તા સંચાલન',
    contentManagement: 'સામગ્રી સંચાલન',
    searchUsers: 'નામ અથવા ઇમેઇલ દ્વારા વપરાશકર્તાઓ શોધો...',
    joinDate: 'જોડાવાની તારીખ',
    lastActive: 'છેલ્લે સક્રિય',
    active: 'સક્રિય',
    blocked: 'અવરોધિત',
    showing: 'બતાવી રહ્યું છે',
    previous: 'અગાઉનું',
    next: 'આગળ',

    // Footer
    quickLinks: 'ઝડપી લિંક્સ',
    resources: 'સંસાધનો',
    contact: 'સંપર્ક',
    allRightsReserved: 'તમામ હકો અનામત.',

    // Common
    back: 'પાછા',
    continue: 'ચાલુ રાખો',
    saving: 'સાચવી રહ્યું છે...',
    saveChanges: 'ફેરફારો સાચવો',
    save: 'સાચવો',
    cancel: 'રદ કરો',
    delete: 'કાઢી નાખો',
    edit: 'સંપાદિત કરો',
    confirm: 'પુષ્ટિ કરો',
    success: 'સફળતા',
    error: 'ભૂલ',

    noteTips: 'નોટ્સ લેવા માટેની ટિપ્સ',
    editNoteTitle: 'નોંધમાં ફેરફાર કરો',
    addNewNote: 'નવી નોંધ ઉમેરો',
    title: 'શીર્ષક',
    content: 'સામગ્રી',
    enterTitle: 'નોંધનું શીર્ષક દાખલ કરો...',
    writeObservation: 'તમારા અવલોકનો અહીં લખો...',
    noteSaved: 'નોંધ સફળતાપૂર્વક સાચવવામાં આવી!',
    noteUpdated: 'નોંધ સફળતાપૂર્વક અપડેટ કરવામાં આવી!',
    noteDeleted: 'નોંધ સફળતાપૂર્વક કાઢી નાખવામાં આવી!',
    deleteNoteConfirm: 'શું તમે ખરેખર આ નોંધ કાઢી નાખવા માંગો છો?',
    permanentAction: 'આ પ્રક્રિયા ઉલટાવી શકાતી નથી.',

    // Profile
    updateProfile: 'પ્રોફાઇલ અપડેટ કરો',
    profileUpdated: 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ કરવામાં આવી!',
    firstName: 'પ્રથમ નામ',
    lastName: 'અટક',
    email: 'ઇમેઇલ',
    phone: 'ફોન',
    dob: 'જન્મ તારીખ',
    deleteAccount: 'ખાતું કાઢી નાખો',
    myProfile: 'મારી પ્રોફાઇલ',
    manageAccount: 'તમારા ખાતા અને ચક્રની માહિતી મેનેજ કરો',
    dailyGoals: 'દૈનિક લક્ષ્યો',
    nudge: 'નજ (નોટિફિકેશન)',
    editGoals: 'લક્ષ્યો સંપાદિત કરો',
    saveGoals: 'લક્ષ્યો સાચવો',
    resetProgress: 'પ્રગતિ રીસેટ કરો',
    addNewGoal: 'નવું લક્ષ્ય ઉમેરો',
    goalName: 'લક્ષ્યનું નામ',
    target: 'લક્ષ્યાંક',
    unit: 'એકમ',
    dangerZone: 'જોખમી વિસ્તાર',
    deleteWarning: 'ચેતવણી: આ પ્રક્રિયા કાયમી છે અને તમારા બધા ડેટાને અમારા સર્વરથી સુરક્ષિત રીતે ભૂંસી નાખશે.',
    activeProfile: 'સક્રિય પ્રોફાઇલ',
    personalInfo: 'વ્યક્તિગત માહિતી',
    cycleInfo: 'ચક્રની માહિતી',
    accountActivity: 'ખાતાની પ્રવૃત્તિ',
    age: 'ઉંમર',
    avgCycleLength: 'સરેરાશ ચક્ર લંબાઈ',
    avgPeriodLength: 'સરેરાશ માસિક લંબાઈ',
    memberSince: 'સભ્ય ક્યારથી',
    cyclesTracked: 'ટ્રૅક કરેલ ચક્ર',
    notesCreated: 'બનાવેલ નોંધો',
    moodEntries: 'મૂડ એન્ટ્રીઝ',
    resetGoalsConfirm: 'દૈનિક લક્ષ્યો રીસેટ કરો?',
    resetGoalsMsg: 'આ તમારી આજની બધી પ્રગતિ સાફ કરી દેશે. આ પ્રક્રિયા ઉલટાવી શકાતી નથી.',
    newHealthGoal: 'નવું સ્વાસ્થ્ય લક્ષ્ય',
    accountDeleted: 'ખાતું સફળતાપૂર્વક કાઢી નાખવામાં આવ્યું! આવજો.',
    dangerPermanent: 'જોખમ: કાયમી પ્રક્રિયા',

    // Symptoms
    logSymptoms: 'લક્ષણો લોગ કરો',
    cramps: 'પેડુનો દુખાવો',
    headache: 'માથાનો દુખાવો',
    acne: 'ખીલ',
    backache: 'કમરનો દુખાવો',
    fatigue: 'થાક',
    bloating: 'પેટ ફૂલવું',
    nausea: 'ઉબકા',
    tenderBreasts: 'સ્તનોમાં દુખાવો',
    anxiety: 'ચિંતા',
    moodSwings: 'મૂડમાં ફેરફાર',
    highEnergy: 'વધારે ઉર્જા',
    increasedAppetite: 'ભૂખમાં વધારો',
    symptomLogger: 'લક્ષણો લોગર',
    trackPhysicalEmotional: 'તમારા શારીરિક અને ભાવનાત્મક લક્ષણોને ટ્રૅક કરો',
    selectYourSymptoms: 'તમારા લક્ષણો પસંદ કરો',
    saveSymptoms: 'લક્ષણો સાચવો',
    additionalNotes: 'વધારાની નોંધો',
    symptomsRecorded: 'લક્ષણો રેકોર્ડ કરવામાં આવ્યા!',
    recommendCareTip: 'તમારા લોગના આધારે, અમે આ સંભાળ ટીપની ભલામણ કરીએ છીએ:',
    finishReturn: 'પૂર્ણ કરો અને ડેેશબોર્ડ પર પાછા ફરો',
    editLog: 'લોગમાં ફેરફાર કરો',
    writeAdditional: 'આજે તમે કેવું અનુભવો છો તે વિશે વધારાના લક્ષણો ઉમેરો...',

    // Moods
    happy: 'ખુશ',
    sad: 'દુઃખી',
    angry: 'ગુસ્સો',
    crying: 'રડવું',
    energetic: 'ઉત્સાહી',
    peaceful: 'શાંત',
    tired: 'થાકેલા',
    anxious: 'ચિંતિત',
    neutral: 'તટસ્થ',
    sleepy: 'ઊંઘ આવવી',
    sick: 'બીમાર',
    hungry: 'ભૂખ્યું',
    visualMoodBoard: 'વિઝ્યુઅલ મૂડ બોર્ડ',
    trackDailyMood: 'તમારા આખા ચક્ર દરમિયાન તમારા દૈનિક મૂડને ટ્રૅક કરો.',
    moodHistory: 'મૂડ ઇતિહાસ',
    patternInsight: 'પેટર્ન આંતરદૃષ્ટિ',
    insightText: 'તમે તમારા ચક્રના ફોલિક્યુલર તબક્કા દરમિયાન વધુ ઉત્સાહી અને ખુશ રહેશો.',
    finishAndGo: 'પૂર્ણ કરો અને ડેેશબોર્ડ પર જાઓ',
    logAnother: 'બીજો મૂડ લોગ કરો',
    greatJobLogging: 'તમારો મૂડ લોગ કરવા બદલ ખૂબ સરસ!',
    recommendedForYou: 'તમારા માટે ભલામણ કરેલ',
    noMoodEntries: 'હજી સુધી કોઈ મૂડ એન્ટ્રી નથી. ટ્રૅકિંગ શરૂ કરવા માટે ઉપર એક મૂડ પસંદ કરો!',
    suggestedHelp: 'તમે જેવું અનુભવી રહ્યા છો તેના આધારે, અમને લાગ્યું કે આ મદદ કરી શકે છે:',

    // Dashboard
    welcome: 'સ્વાગત છે',
    selfCare: 'સ્વ-સંભાળથી વધુ સારું કોઈ સારવાર નથી.',
    firstPeriod: 'પ્રથમ માસિક',
    currentCycleDay: 'વર્તમાન ચક્ર દિવસ',
    peakStatus: 'તમે તમારા શિખર પર છો',
    days: 'દિવસો',
    inDays: 'માં',
    quickActions: 'ઝડપી કાર્યો',
    howFeeling: 'આજે તમે કેવું અનુભવો છો?',
    viewMood: 'મૂડ એનાલિટિક્સ જુઓ',
    cycleInsights: 'ચક્ર આંતરદૃષ્ટિ',
    recentNotes: 'તાજેતરની નોંધો',
    viewAllNotes: 'બધી નોંધો જુઓ',
    healthTip: 'આજની હેલ્થ ટીપ',
    moreTips: 'વધુ ટિપ્સ',
    reminders: 'રિમાઇન્ડર્સ',
    addNote: 'નોંધ ઉમેરો',
    myNotes: 'મારી નોંધો',
    trackSymptoms: 'લક્ષણો, લાગણીઓ અને મહત્વપૂર્ણ અવલોકનો ટ્રૅક કરો.',
    noteTip1: 'ક્રેમ્પ્સ, માથાનો દુખાવો અથવા મૂડમાં ફેરફાર જેવા લક્ષણો ટ્રૅક કરો.',
    noteTip2: 'તમે જે દવાઓ લેતા હોવ તેની નોટ રાખો.',
    noteTip3: 'ખોરાક અને જીવનશૈલીમાં થયેલા ફેરફારની નોંધ રાખો.',
    noteTip4: 'તમારા ડૉક્ટર સાથે થયેલી વાતચીતની નોંધ રાખો.',
    startFirstNote: 'તમારી પ્રથમ નોંધ શરૂ કરો',
    clickToAdd: 'તમારા લક્ષણો અથવા અવલોકનો ઉમેરવા માટે ક્લિક કરો',

    // Calendar
    months: {
      jan: 'જાન્યુઆરી', feb: 'ફેબ્રુઆરી', mar: 'માર્ચ', apr: 'એપ્રિલ', may: 'મે', jun: 'જૂન',
      jul: 'જુલાઈ', aug: 'ઓગસ્ટ', sep: 'સપ્ટેમ્બર', oct: 'ઓક્ટોબર', nov: 'નવેમ્બર', dec: 'ડિસેમ્બર'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');

    // Attempt lookup in primary language
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    if (value && typeof value === 'string') return value;

    // Fallback to English
    let fallbackValue = translations['en'];
    for (const k of keys) {
      if (fallbackValue && fallbackValue[k]) {
        fallbackValue = fallbackValue[k];
      } else {
        fallbackValue = null;
        break;
      }
    }

    return (fallbackValue && typeof fallbackValue === 'string') ? fallbackValue : key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
