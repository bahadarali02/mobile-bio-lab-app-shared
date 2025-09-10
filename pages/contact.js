import Layout from '../components/Layout'; // Default import
import { PageHero, ContentSection } from '../components/Layout'; // Named imports

export default function Contact() {
  return (
    <Layout
      title="Contact Us"
      description="Get in touch with our team"
    >
      <PageHero 
        title="Contact Us" 
        description="We'd love to hear from you" 
      />
      
      <ContentSection>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
                Send Message
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Our Offices</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Headquarters</h4>
                <p className="text-gray-600">123 Science Park Drive<br />San Francisco, CA 94107</p>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-gray-600">info@mobilebiolab.com</p>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-medium mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-indigo-600">Twitter</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">LinkedIn</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </Layout>
  );
}