
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">About</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              I'm Sumon Ahmed, an AI Product Engineer passionate about turning fuzzy ideas into live products. 
              With over 5 years of experience in the tech industry, I specialize in building full-stack 
              applications with a focus on AI and machine learning.
            </p>
            
            <p>
              My journey started with a simple belief: great products should solve real problems quickly 
              and efficiently. This philosophy has guided me through building multiple successful startups, 
              including DreamboatWithAi, which raised $100K in funding.
            </p>
            
            <p>
              Currently, I'm working as a Founding Engineer at LetsStartUp, where we're building AI agents 
              specifically for the insurance industry. The challenge of making AI practical and accessible 
              to traditional industries fascinates me.
            </p>
            
            <p>
              When I'm not coding, I enjoy writing about AI, product development, and the future of 
              technology. I believe in sharing knowledge and helping others build amazing products.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Let's Connect</h3>
              <p className="text-gray-700">
                I'm always interested in discussing new ideas, potential collaborations, or just having 
                a chat about technology and life. Feel free to reach out!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
