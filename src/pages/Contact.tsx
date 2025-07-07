import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Github, Linkedin, Send, Phone } from "lucide-react";
import { useContactData } from "@/hooks/useContactData";
import { useResponseTimeData } from "@/hooks/useResponseTimeData";
import { saveAndUpdateDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";

const Contact = () => {
  const { contacts, loading } = useContactData();
  const { responseTimes, loading: responseTimesLoading } = useResponseTimeData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Save the message to Firebase
      const messageData = {
        sender_name: formData.name,
        sender_email: formData.email,
        message: formData.message,
        platform: 'website_form',
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await saveAndUpdateDynamicContent('contact_messages', messageData);
      
      if (error) {
        throw new Error(error);
      }

      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get icon for contact type
  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'phone': return <Phone className="w-5 h-5" />;
      case 'twitter': return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  // Create link based on contact type
  const getContactLink = (contact: any) => {
    switch (contact.type) {
      case 'email':
        return `mailto:${contact.url}`;
      case 'phone':
        return `tel:${contact.url}`;
      default:
        return contact.url;
    }
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
              
              {/* Dynamic Contact Methods */}
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="flex items-center p-4">
                          <div className="w-5 h-5 bg-gray-300 rounded mr-3"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center flex-1">
                          <div className="text-gray-500 mr-3">
                            {getContactIcon(contact.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{contact.displayText}</p>
                          
                            {contact.notes && (
                              <p className="text-sm text-gray-500 mt-1">{contact.notes}</p>
                            )}
                          </div>
                        </div>
                        {contact.url && (
                          <Button 
                            size="sm" 
                            className="bg-gray-900 hover:bg-gray-800 text-white ml-4"
                            asChild
                          >
                            <a 
                              href={getContactLink(contact)}
                              target={contact.type !== 'email' && contact.type !== 'phone' ? "_blank" : undefined}
                              rel={contact.type !== 'email' && contact.type !== 'phone' ? "noopener noreferrer" : undefined}
                            >
                              {contact.type === 'email' ? 'Email' :
                               contact.type === 'phone' ? 'Call' :
                               contact.type === 'twitter' ? 'Follow' :
                               'Connect'}
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <>
                    {/* Email */}
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="flex items-center p-4">
                        <Mail className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <a 
                            href="mailto:sumonahmedjubayer@email.com" 
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            sumonahmedjubayer@email.com
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

                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-500 mr-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.11-.21c1.12.45 2.33.69 3.58.69.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.24 2.46.69 3.58.13.27.07.6-.21 1.11l-2.2 2.2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">Phone</p>
                            <p className="text-sm text-gray-500">Call or text for a quick reply</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gray-900 hover:bg-gray-800 text-white"
                          asChild
                        >
                          <a 
                            href="tel:+447405241663"
                          >
                            Call +447405241663
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Response Time Info */}
            {!responseTimesLoading && responseTimes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Response Times
                </h3>
                <div className="space-y-2 text-sm">
                  {responseTimes.map((rt) => (
                    <p key={rt.id} className="text-gray-700">
                      <span className="font-medium">{rt.platform}:</span> {rt.timeframe}
                    </p>
                  ))}
                  {responseTimes.some(rt => rt.description) && (
                    <div className="mt-4 pt-2 border-t border-gray-200">
                      {responseTimes
                        .filter(rt => rt.description)
                        .map((rt) => (
                          <p key={`desc-${rt.id}`} className="text-gray-600">
                            {rt.description}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fallback Response Times if no dynamic data */}
            {!responseTimesLoading && responseTimes.length === 0 && (
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
            )}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-3 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
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
