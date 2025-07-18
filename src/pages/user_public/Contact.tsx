import React, { useState } from "react";
import Layout from "../../components/Layout";
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
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
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
      if (error) throw new Error(error);

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const getContactLink = (contact: any) => {
    switch (contact.type) {
      case 'email': return `mailto:${contact.url}`;
      case 'phone': return `tel:${contact.url}`;
      default: return contact.url;
    }
  };

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <div className=" mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Get In Touch</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Whether you have a question, want to collaborate, or just want to say hi,
            I'm here to help! Feel free to reach out using the form below or through any of
            the contact methods listed. I strive to respond to all messages within 24-48 hours,
            but please allow a bit more time during weekends or holidays.
            Alongside, I'm always excited to connect with fellow developers, AI enthusiasts, and curious minds.
            Whether you want to discuss the latest in AI technology, explore potential collaborations,
            or simply say hello, I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Let's Connect</h2>
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
                ) : (
                  contacts.map(contact => (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow duration-200">
  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
    <div className="flex items-start sm:items-center flex-1 gap-3">
      <div className="text-gray-500">
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
        className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto"
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
                )}
              </div>
            </div>

            {!responseTimesLoading && responseTimes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Times</h3>
                <div className="space-y-2 text-sm">
                  {responseTimes.map(rt => (
                    <p key={rt.id} className="text-gray-700">
                      <span className="font-medium">{rt.platform}:</span> {rt.timeframe}
                    </p>
                  ))}
                  {responseTimes.some(rt => rt.description) && (
                    <div className="mt-4 pt-2 border-t border-gray-200">
              {responseTimes
  .filter(rt => rt.description)
  .map(rt => (
    <div
      key={`desc-${rt.id}`}
      className="text-gray-600"
      dangerouslySetInnerHTML={{ __html: rt.description }}
    />
  ))}


                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
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
                    {submitting ? "Sending..." : "Send Message"}
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
