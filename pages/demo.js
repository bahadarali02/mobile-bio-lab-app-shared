import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Demo() {
  return (
    <Layout
      title="Demo"
      description="See Mobile Bio Lab in action"
    >
      <PageHero 
        title="Live Demo" 
        description="Experience our platform before you commit" 
      />
      
      <ContentSection>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-500">Demo video placeholder</p>
          </div>
          <h2 className="text-2xl font-bold mb-4">Request a Demo</h2>
          <p className="mb-6">Fill out the form below to schedule a personalized demo with our team.</p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
              Schedule Demo
            </button>
          </form>
        </div>
      </ContentSection>
    </Layout>
  );
}