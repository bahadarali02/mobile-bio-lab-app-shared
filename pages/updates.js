import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Updates() {
  const updates = [
    {
      date: "June 15, 2023",
      title: "Mobile App v2.0 Released",
      description: "Our completely redesigned mobile app is now available with enhanced data collection features."
    },
    {
      date: "May 3, 2023",
      title: "New API Endpoints",
      description: "Added support for real-time data streaming and custom analysis pipelines."
    },
    {
      date: "April 1, 2023",
      title: "Security Enhancements",
      description: "Implemented end-to-end encryption for all field data collection."
    }
  ];

  return (
    <Layout
      title="Updates"
      description="Latest product news and announcements"
    >
      <PageHero 
        title="Product Updates" 
        description="Stay informed about the latest features and improvements" 
      />
      
      <ContentSection>
        <div className="max-w-3xl mx-auto space-y-8">
          {updates.map((update, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-gray-500 mb-2">{update.date}</p>
              <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
              <p className="text-gray-600">{update.description}</p>
            </div>
          ))}
        </div>
      </ContentSection>
    </Layout>
  );
}