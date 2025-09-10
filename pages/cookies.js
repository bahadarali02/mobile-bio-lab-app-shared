import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Cookies() {
  return (
    <Layout
      title="Cookie Policy"
      description="How we use cookies on our website"
    >
      <PageHero 
        title="Cookie Policy" 
        description="Information about our use of cookies" 
      />
      
      <ContentSection>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="prose">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit websites. 
              They are widely used to make websites work more efficiently and to provide 
              information to website owners.
            </p>
            
            <h2>How We Use Cookies</h2>
            <p>
              We use cookies for the following purposes:
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to function 
                properly (e.g., authentication)
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how visitors interact 
                with our website
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Remember your preferences to 
                enhance your experience
              </li>
            </ul>
            
            <h2>Managing Cookies</h2>
            <p>
              Most browsers allow you to refuse to accept cookies and to delete cookies. 
              The methods for doing so vary from browser to browser. Please refer to your 
              browser's help documentation for instructions.
            </p>
            <p>
              Blocking all cookies may have a negative impact on the usability of our website.
            </p>
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}