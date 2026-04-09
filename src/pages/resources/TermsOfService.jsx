import { FileText, Scale, AlertCircle, CheckCircle, ShieldAlert, Users, Handshake } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import './Resources.css'

export default function TermsOfService() {
  return (
    <DashboardLayout>
      <div className="resources-page">
        <div className="resource-card-main">
          <div className="resources-header" style={{ textAlign: 'left', alignItems: 'flex-start', marginBottom: '4rem' }}>

            <h1>Terms of Service</h1>
            <p style={{ maxWidth: '1000px' }}>Effective Date: January 1, 2026 • Please read these terms carefully to understand your rights.</p>
          </div>

          <section className="resource-section">
            <h2><Handshake size={24} /> Acceptance of Terms</h2>
            <div className="warning-box">
              <ShieldAlert size={32} />
              <div>
                <strong>Medical Disclaimer</strong>
                <p>Cleo is a tracking and informational tool. It is <strong>NOT</strong> a medical device and should not be used as a form of birth control or for diagnosing medical conditions. Always consult a healthcare professional for specific medical advice.</p>
              </div>
            </div>

            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using the Cleo platform, you agree to be bound by these legal terms. These terms constitute a legally binding agreement between you and Cleo. If you do not agree to all of these terms, you are prohibited from using the platform and must discontinue use immediately.</p>
          </section>

          <section className="resource-section">
            <h2>2. User Representations</h2>
            <p>When you create an account, you represent and warrant that:</p>
            <ul>
              <li>All registration information you submit is truthful, complete, and accurate.</li>
              <li>You will maintain the accuracy of such information throughout your usage.</li>
              <li>You are at least 13 years of age (or the minimum legal age in your region).</li>
              <li>Your use of Cleo does not violate any applicable local or international law.</li>
              <li>You will not use the service for any unauthorized or illegal commercial activities.</li>
              <li>You are responsible for all activity that occurs under your account credentials.</li>
            </ul>
          </section>

          <section className="resource-section">
            <h2>3. Intellectual Property</h2>
            <p>Unless otherwise indicated, Cleo is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the platform (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us and protected by copyright and trademark laws.</p>
          </section>

          <section className="resource-section">
            <h2>4. Limitation of Liability</h2>
            <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the platform, even if we have been advised of the possibility of such damages.</p>
          </section>

          <section className="resource-section highlight-box">
            <h3><CheckCircle size={24} /> Our Commitment to Excellence</h3>
            <p>We strive to provide the most accurate health tracking experience possible through continuous data analysis. However, due to the inherent biological variability of human cycles, all predictions should be treated as estimates and not absolute certainties.</p>
          </section>


        </div>
      </div>
    </DashboardLayout>
  )
}



