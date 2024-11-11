import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConstellationCanvas from './ConstellationCanvas';
import { ArrowRight, Globe, Shield, Clock, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);

  const features = [
    {
      icon: <Globe className="w-16 h-16 text-indigo-400" />,
      title: 'Global Reach',
      description: 'Send payments to over 180 countries worldwide with real-time tracking and competitive rates.',
    },
    {
      icon: <Shield className="w-16 h-16 text-indigo-400" />,
      title: 'Bank-Grade Security',
      description: 'Enterprise-level encryption and multi-factor authentication to keep your transactions secure.',
    },
    {
      icon: <Clock className="w-16 h-16 text-indigo-400" />,
      title: '24/7 Processing',
      description: 'Process payments around the clock with our automated SWIFT system.',
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setShowContactDialog(true);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setShowNewsletterDialog(true);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      {/* Interactive Cursor */}
      <motion.div
        className="fixed z-50 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 opacity-80 mix-blend-multiply pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          x: '-50%',
          y: '-50%',
        }}
      />

      {/* Hero Section */}
      <header className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 overflow-hidden">
        <ConstellationCanvas />
        <div className="relative max-w-7xl mx-auto py-40 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl font-black text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
              International Payment System
            </h1>
            <p className="text-3xl text-indigo-200 mb-12 font-light">
              Secure Transactions • Simplified Payments • Global Reach
            </p>
            <button
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center px-12 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <span className="relative">Get Started</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Features Section with Animations */}
      <section className="py-32 bg-gradient-to-b from-indigo-900 to-purple-900">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
              Powerful Features for Global Payments
            </h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design to make international payments seamless and secure.
            </p>
          </div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 transform transition-all duration-500 ${
                  activeFeature === index ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : ''
                }`}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-indigo-200">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-gradient-to-b from-indigo-900 to-purple-900">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Stay Updated
          </h2>
          <p className="text-xl text-indigo-200 mb-12">
            Subscribe to our newsletter to get the latest news and updates.
          </p>
          <form className="flex justify-center" onSubmit={handleNewsletterSubmit}>
            <div className="relative w-full max-w-md">
              <input
                type="email"
                className="w-full px-6 py-4 rounded-full bg-white/10 text-white placeholder-indigo-300 focus:outline-none"
                placeholder="Enter your email"
                required
              />
              <button className="absolute right-0 top-0 h-full px-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300">
                <Send className="text-white" />
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Contact Section (The Form) */}
      <section className="py-32 bg-gradient-to-b from-indigo-900 to-purple-900">
        <motion.div
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-bold text-center text-white mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Get in Touch
          </h2>
          <div className="bg-white/10 backdrop-blur-xl p-12 rounded-2xl border border-white/10">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleContactSubmit}>
              <input
                type="text"
                className="w-full px-6 py-4 rounded-full bg-white/10 text-white placeholder-indigo-300 focus:outline-none"
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                className="w-full px-6 py-4 rounded-full bg-white/10 text-white placeholder-indigo-300 focus:outline-none"
                placeholder="Your Email"
                required
              />
              <textarea
                className="col-span-2 w-full px-6 py-4 rounded-3xl bg-white/10 text-white placeholder-indigo-300 focus:outline-none"
                placeholder="Your Message"
                rows="5"
                required
              />
              <div className="col-span-2 text-center">
                <button className="inline-flex items-center px-12 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                  <span>Send Message</span>
                  <MessageCircle className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Risk Rangers Team */}
      <section className="py-32 bg-gradient-to-b from-indigo-900 to-purple-900">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold text-white text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Meet The Risk Rangers Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-4 text-center">
              <img
                src="https://media.licdn.com/dms/image/v2/D4D03AQHI_NoiU-VqJw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1705055843973?e=1736380800&v=beta&t=8lqOyau2hXYQC0y62lmunstc0hPhbITsyPlG3PnZZRk"
                alt="Anele Siwela"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-white">Anele Siwela</h3>
              <p className="text-indigo-200">Frontend Developer</p>
            </div>
            <div className="space-y-4 text-center">
              <img
                src="https://media.licdn.com/dms/image/v2/D4E03AQGxJrhjkjg1JA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720016768603?e=1736380800&v=beta&t=JE6D-2lSGSiJM7xkuvhcWuGa2aPSSJteHk8X9YeKgNM"
                alt="Alec Cowan"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-white">Alec Cowan</h3>
              <p className="text-indigo-200">Backend Developer</p>
            </div>
            <div className="space-y-4 text-center">
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQHhjtgvN6VKHQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1713450059841?e=1736380800&v=beta&t=RxbmQasv06prGTOegRdpJmUUa7Z72quVqOLoyhbUzrU"
                alt="Lucian Young"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-white">Lucian Young</h3>
              <p className="text-indigo-200">UX/UI Designer</p>
            </div>
            <div className="space-y-4 text-center">
              <img
                src="https://media.licdn.com/dms/image/v2/D4D03AQHYSGtq8VOslQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1710094803991?e=1736380800&v=beta&t=8ViZfZZmFajn1utLS51XaXgSM55oq42pk-6QLQe1Voc"
                alt="Mpho Ndlela"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-white">Mpho Ndlela</h3>
              <p className="text-indigo-200">Project Manager</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scroll to Top Button */}
      <button
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowRight className="transform rotate-90" />
      </button>

      {/* Contact and Newsletter Dialogs */}
      {showContactDialog && (
        <Dialog message="Your form has been received. We will get back to you shortly." onClose={() => setShowContactDialog(false)} />
      )}
      {showNewsletterDialog && (
        <Dialog message="Thank you for subscribing to our newsletter!" onClose={() => setShowNewsletterDialog(false)} />
      )}
    </div>
  );
};

const Dialog = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 shadow-lg text-center">
      <p className="text-lg font-medium text-gray-800">{message}</p>
      <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

export default HomePage;
