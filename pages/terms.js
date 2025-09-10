import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Terms() {
  return (
    <Layout
      title="Terms of Service"
      description="Legal terms governing use of our platform"
    >
      <PageHero 
        title="Terms of Service" 
        description="Legal agreement between you and Mobile Bio Lab" 
      />
      
      <ContentSection>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="prose">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Mobile Bio Lab platform, you agree to be bound by these Terms of Service. 
              If you do not agree to all the terms and conditions, you may not access or use our services.
            </p>
            
            <h2>2. Description of Service</h2>
            <p>
              Mobile Bio Lab provides a platform for biological field research data collection, 
              analysis, and collaboration. The service includes web and mobile applications, 
              data storage, and analytical tools.
            </p>
            
            <h2>3. User Responsibilities</h2>
            <p>
              You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the service for illegal or unauthorized purposes</li>
            </ul>
            
            <h2>4. Intellectual Property</h2>
            <p>
              All research data you upload remains your property. Mobile Bio Lab claims no ownership 
              rights over your research data. The Mobile Bio Lab software and platform are protected 
              by copyright and other intellectual property laws.
            </p>
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}