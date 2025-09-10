import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Tutorials() {
  const tutorials = [
    {
      category: "Getting Started",
      items: ["Installation Guide", "First Project Setup", "Basic Workflow"]
    },
    {
      category: "Advanced Features",
      items: ["Custom Analysis", "API Integration", "Team Collaboration"]
    },
    {
      category: "Troubleshooting",
      items: ["Common Issues", "Data Sync Problems", "Performance Optimization"]
    }
  ];

  return (
    <Layout
      title="Tutorials"
      description="Step-by-step guides to master Mobile Bio Lab"
    >
      <PageHero 
        title="Tutorials" 
        description="Learn how to get the most out of Mobile Bio Lab" 
      />
      
      <ContentSection>
        <div className="grid md:grid-cols-3 gap-8">
          {tutorials.map((section, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{section.category}</h3>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="text-blue-600 hover:underline">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>
    </Layout>
  );
}