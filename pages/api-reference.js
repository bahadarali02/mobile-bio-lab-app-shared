import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function APIReference() {
  return (
    <Layout
      title="API Reference"
      description="Technical documentation for Mobile Bio Lab API"
    >
      <PageHero 
        title="API Reference" 
        description="Complete documentation for integrating with our platform" 
      />
      
      <ContentSection>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Authentication</h3>
            <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                {`POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Data Collection</h3>
            <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                {`POST /api/samples
Content-Type: application/json
Authorization: Bearer <token>

{
  "sampleType": "water",
  "location": "37.7749,-122.4194",
  "measurements": {...}
}`}
              </pre>
            </div>
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}