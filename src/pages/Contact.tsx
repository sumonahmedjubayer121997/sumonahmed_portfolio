
import Layout from "../components/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Contact</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-lg text-gray-700 mb-8">
              I'm always open to interesting conversations and new opportunities. 
              Whether you want to discuss AI, potential collaborations, or just say hello, 
              I'd love to hear from you.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm hover:shadow transition-shadow duration-200">
  <div className="w-5 h-5 mr-2 text-gray-500">
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </div>
  <a 
    href="https://twitter.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
  >
    Follow me on X (Twitter)
  </a>
</div>

            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Response</h3>
            <p className="text-gray-700 mb-4">
              For the fastest response, reach out to me on X (Twitter). I'm most active there and 
              regularly share insights about AI engineering and product development.
            </p>
            <p className="text-gray-700">
              I typically respond within 24 hours and I'm always happy to help with questions 
              about AI, product development, or startup advice.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
