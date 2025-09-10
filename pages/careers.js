import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Careers() {
  const openings = [
    {
      title: "Frontend Developer",
      type: "Full-time",
      location: "Remote",
      department: "Engineering"
    },
    {
      title: "Field Research Specialist",
      type: "Contract",
      location: "Global",
      department: "Science"
    },
    {
      title: "Product Designer",
      type: "Full-time",
      location: "San Francisco or Remote",
      department: "Design"
    }
  ];

  return (
    <Layout
      title="Careers"
      description="Join our mission to revolutionize field research"
    >
      <PageHero 
        title="Careers at Mobile Bio Lab" 
        description="Build tools that empower scientific discovery" 
      />
      
      <ContentSection>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Why Join Us?</h2>
            <div className="prose">
              <p className="mb-4">
                At Mobile Bio Lab, we're building the future of field research technology. 
                Our team is passionate about creating tools that make a real difference in scientific discovery.
              </p>
              <p>
                We offer competitive compensation, flexible work arrangements, and the opportunity to work on meaningful projects with leading researchers worldwide.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Current Openings</h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span>{job.type}</span>
                  <span>{job.location}</span>
                  <span>{job.department}</span>
                </div>
                <button className="text-indigo-600 hover:underline">
                  View Position
                </button>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}