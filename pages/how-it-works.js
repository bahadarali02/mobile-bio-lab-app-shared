import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports
import Link from 'next/link'; // Import Link

export default function HowItWorks() {
  // Safety check for components (helps identify which might be undefined)
  if (!Layout || !PageHero || !ContentSection) {
    console.error('Undefined component detected:', {
      Layout,
      PageHero,
      ContentSection
    });
  }

  return (
   


    <Layout
      title="How It Works"
      description="Learn how Mobile Bio Lab transforms your field research"
    >
      
      <PageHero 
        title="How It Works" 
        description="Simple steps to revolutionize your biological research workflow" 
      />
      
      <ContentSection className="bg-gray-50">
          {/* Back to Home Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-block text-indigo-600 hover:text-indigo-800 transition font-medium text-sm bg-indigo-50 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
          >
            ← Back to Home
          </Link>
         </div>
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-8">
            {[
              "Connect your mobile device to our platform",
              "Collect samples and record data in the field",
              "Sync automatically to our secure cloud",
              "Analyze results with our powerful tools"
            ].map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex items-center justify-center h-8 w-8 bg-indigo-600 rounded-full text-white font-bold mr-4">
                  {index + 1}
                </span>
                <span className="text-lg">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </ContentSection>
    </Layout>
  );
}