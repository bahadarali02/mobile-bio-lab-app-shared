import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports
import Link from 'next/link'; // Import Link

export default function Features() {
  return (
    <Layout
      title="Features"
      description="Discover the powerful features of Mobile Bio Lab"
    >
      <PageHero 
        title="Advanced Features" 
        description="Everything you need for modern biological research in the field" 
      />

      <ContentSection>
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-block text-indigo-600 hover:text-indigo-800 transition font-medium text-sm bg-indigo-50 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-time Data Collection",
              description: "Capture and sync field data instantly with our mobile platform"
            },
            {
              title: "Cloud Integration",
              description: "Seamless synchronization with all major cloud storage providers"
            },
            {
              title: "Advanced Analytics",
              description: "Built-in statistical tools for immediate field analysis"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>
    </Layout>
  );
}
