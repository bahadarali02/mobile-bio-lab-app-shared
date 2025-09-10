import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Documentation() {
  return (
    <Layout
      title="Documentation"
      description="Comprehensive guides and API documentation"
    >
      <PageHero 
        title="Documentation" 
        description="Everything you need to get started with Mobile Bio Lab" 
      />
      
      <ContentSection>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
            <ul className="space-y-3">
              {['Installation', 'First Steps', 'Basic Configuration'].map((item) => (
                <li key={item} className="text-blue-600 hover:underline">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">API Reference</h3>
            <ul className="space-y-3">
              {['Authentication', 'Endpoints', 'SDKs'].map((item) => (
                <li key={item} className="text-blue-600 hover:underline">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}