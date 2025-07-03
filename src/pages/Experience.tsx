
import Layout from "../components/Layout";

const Experience = () => {
  const experiences = [
    {
      company: "kay.ai",
      role: "Founding Engineer",
      period: "2024 - Present",
      description: "Building AI Agents for Insurance industry using cutting-edge AI technologies.",
      technologies: ["Python", "React", "TypeScript", "AI/ML"]
    },
    {
      company: "Dreamboat.ai",
      role: "Founder & CEO",
      period: "2022 - 2024",
      description: "AI-powered platform that raised $100K funding. Built end-to-end AI solutions.",
      technologies: ["Python", "React", "PostgreSQL", "AI/ML"]
    }
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Experience</h1>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="border-l-4 border-gray-200 pl-6 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exp.role}</h3>
                  <h4 className="text-lg text-gray-600">{exp.company}</h4>
                </div>
                <span className="text-sm text-gray-500 mt-2 lg:mt-0">{exp.period}</span>
              </div>
              <p className="text-gray-700 mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Experience;
