
import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Github, Linkedin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            I'm always excited to connect with fellow developers, AI enthusiasts, and curious minds. 
            Whether you want to discuss the latest in AI technology, explore potential collaborations, 
            or simply say hello, I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Options */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Let's Connect
              </h2>
              
              {/* Contact Methods */}
              <div className="space-y-4">
                {/* Email */}
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="flex items-center p-4">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a 
                        href="mailto:your@email.com" 
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        your@email.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* X (Twitter) */}
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">X (Twitter)</p>
                        <p className="text-sm text-gray-500">Fastest response - usually within 24 hours</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                      asChild
                    >
                      <a 
                        href="https://twitter.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Follow me on X
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* LinkedIn */}
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="flex items-center p-4">
                    <Linkedin className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">LinkedIn</p>
                      <a 
                        href="https://linkedin.com/in/yourprofile" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        linkedin.com/in/yourprofile
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* GitHub */}
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="flex items-center p-4">
                    <Github className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">GitHub</p>
                      <a 
                        href="https://github.com/yourprofile" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        github.com/yourprofile
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Response Time Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Response Times
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">X (Twitter):</span> Usually within 24 hours
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> Within 48 hours on weekdays
                </p>
                <p className="text-gray-600">
                  Weekends and holidays may take up to 48 hours for response.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Send a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 resize-none"
                      placeholder="Tell me about your project, question, or just say hello..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-3 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
