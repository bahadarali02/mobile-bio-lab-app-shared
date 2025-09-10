import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Privacy() {
  return (
    <Layout
      title="Privacy Policy"
      description="How we protect your data"
    >
      <PageHero 
        title="Privacy Policy" 
        description="Your data security is our priority" 
      />
      
      <ContentSection>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="prose">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              submit research data, or contact us for support. This may include:
            </p>
            <ul>
              <li>Contact information (name, email address)</li>
              <li>Account credentials</li>
              <li>Research data you upload to our platform</li>
              <li>Payment information for premium services</li>
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
            
            <h2>3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect 
              the security of your personal data, including encryption of sensitive 
              research data both in transit and at rest.
            </p>
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}