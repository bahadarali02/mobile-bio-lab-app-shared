import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Blog() {
  const posts = [
    {
      title: "Advancements in Mobile Field Research",
      excerpt: "How modern technology is transforming biological data collection",
      date: "May 15, 2023",
      category: "Research"
    },
    {
      title: "Case Study: Rainforest Biodiversity Project",
      excerpt: "How our platform helped document 50+ new species",
      date: "April 2, 2023",
      category: "Case Studies"
    },
    {
      title: "The Future of Citizen Science",
      excerpt: "Engaging the public in meaningful data collection",
      date: "March 10, 2023",
      category: "Community"
    }
  ];

  return (
    <Layout
      title="Blog"
      description="Insights and stories from the Mobile Bio Lab team"
    >
      <PageHero 
        title="Blog" 
        description="News, insights, and stories from our team" 
      />
      
      <ContentSection>
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map((post, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full mb-2">
                {post.category}
              </span>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-3">{post.excerpt}</p>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          ))}
        </div>
      </ContentSection>
    </Layout>
  );
}