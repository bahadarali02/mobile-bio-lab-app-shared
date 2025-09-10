import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function About() {
  return (
    <Layout
      title="About Us"
      description="Learn about our mission and team"
    >
      <PageHero 
        title="About Mobile Bio Lab" 
        description="Revolutionizing field research since 2020" 
      />
      
      <ContentSection>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="prose">
            <p className="mb-4">
              Mobile Bio Lab was founded in 2020 by a team of biologists and software engineers who recognized the need for better tools in field research. 
              Frustrated with the limitations of paper-based data collection and disconnected digital tools, we set out to create a unified platform.
            </p>
            <p className="mb-4">
              Today, our platform is used by researchers in over 30 countries, helping them collect, analyze, and share biological data with unprecedented efficiency.
            </p>
            <h3 className="text-xl font-semibold mt-8 mb-4">Our Mission</h3>
            <p>
              To empower scientists with intuitive, powerful tools that accelerate discovery while maintaining rigorous scientific standards.
            </p>
          </div>
        </div>
      </ContentSection>
      
      <ContentSection className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Founder & CEO",
                bio: "PhD in Molecular Biology with 10+ years of field research experience"
              },
              {
                name: "James Wilson",
                role: "CTO",
                bio: "Software architect specializing in scientific applications"
              },
              {
                name: "Maria Rodriguez",
                role: "Head of Product",
                bio: "UX expert focused on researcher workflows"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-32 w-32 mx-auto bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-indigo-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}