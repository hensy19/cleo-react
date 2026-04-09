import { ShieldCheck, Lock, Eye, Server, UserCheck, Trash2, Users } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import './Resources.css'

export default function PrivacyPolicy() {
  return (
    <DashboardLayout>
      <div className="resources-page">
        <div className="resource-card-main">
          <div className="resources-header" style={{ textAlign: 'left', alignItems: 'flex-start', marginBottom: '4rem' }}>

            <h1>Privacy Policy</h1>
            <p style={{ maxWidth: '1000px' }}>Last Updated: April 2026 • We value your trust above all else.</p>
          </div>

          <section className="resource-section">
            <h2><Lock size={24} /> Our Commitment to Privacy</h2>
            <p className="intro-lead">At Cleo, your privacy is our foundation. We recognize that health data is extremely sensitive, and we are committed to providing the highest level of protection available in the industry.</p>

            <div className="privacy-grid">
              <div className="privacy-item">
                <div className="p-icon"><Lock size={20} /></div>
                <h3>End-to-End Encryption</h3>
                <p>All data is encrypted in transit and at rest using AES-256 standards. Your health history is for your eyes only.</p>
              </div>
              <div className="privacy-item">
                <div className="p-icon"><Eye size={20} /></div>
                <h3>Zero Data Selling</h3>
                <p>We never sell your personal or health data to advertisers. Our business model is based on user trust, not data exploitation.</p>
              </div>
              <div className="privacy-item">
                <div className="p-icon"><Server size={20} /></div>
                <h3>Secure Infrastructure</h3>
                <p>Your data is stored in ISO 27001 certified data centers with 24/7 monitoring and strict access controls.</p>
              </div>
              <div className="privacy-item">
                <div className="p-icon"><UserCheck size={20} /></div>
                <h3>User Control</h3>
                <p>You have full ownership of your data. Export it or delete it whenever you choose, no questions asked.</p>
              </div>
            </div>
          </section>

          <section className="resource-section">
            <h2>1. Information We Collect</h2>
            <p>To provide you with the best experience, we collect information you explicitly provide:</p>
            <ul>
              <li><strong>Profile Data:</strong> Name, Email, and Date of Birth to personalize your user journey.</li>
              <li><strong>Cycle Data:</strong> Period dates, flow intensity, and cycle duration for accurate scientific predictions.</li>
              <li><strong>Health Logs:</strong> Symptoms, moods, and daily health goals to provide personalized insights.</li>
              <li><strong>Device Info:</strong> Minimal technical data to ensure app stability and security across your devices.</li>
            </ul>
          </section>

          <section className="resource-section">
            <h2>2. How We Use Your Data</h2>
            <p>Your data is used solely to provide and improve the specialized Cleo services:</p>
            <ul>
              <li>Calculating scientific cycle predictions and hormonal ovulation windows.</li>
              <li>Generating personalized health insights based on your uniquely logged symptoms.</li>
              <li>Providing smart reminders and notifications to help you stay on track with your body's needs.</li>
              <li>Conducting anonymized research to improve our underlying prediction models.</li>
            </ul>
          </section>

          <section className="resource-section">
            <h2>3. Your Data Rights</h2>
            <div className="warning-box">
              <Trash2 size={24} />
              <div>
                <strong>Permanent Deletion Policy</strong>
                <p>You have the absolute right to be forgotten. Deleting your account from the Profile page will permanently and securely erase all your data from our primary servers and backups instantly.</p>
              </div>
            </div>
          </section>


        </div>
      </div>
    </DashboardLayout>
  )
}



