"use client";

import Image from "next/image";
import Head from 'next/head';
import { MessageSquareText, Smile, Users, Shield, ArrowRight, BellRing, Zap, Globe, Check } from 'lucide-react';


import Link from "next/link";
import { useState, useEffect, useRef } from 'react';

const useIntersectionObserver = (callback: () => void) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return elementRef;
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [animatedReduction, setAnimatedReduction] = useState(0);
  const [animatedSatisfaction, setAnimatedSatisfaction] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Start animation when stats section comes into view
  const startAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    // Users count animation
    const usersInterval = setInterval(() => {
      setAnimatedCount(prev => {
        if (prev < 5000) return prev + 100;
        clearInterval(usersInterval);
        return 5000;
      });
    }, 20);

    // Reduction percentage animation
    const reductionInterval = setInterval(() => {
      setAnimatedReduction(prev => {
        if (prev < 89) return prev + 1;
        clearInterval(reductionInterval);
        return 89;
      });
    }, 30);

    // Satisfaction rating animation
    const satisfactionInterval = setInterval(() => {
      setAnimatedSatisfaction(prev => {
        if (prev < 48) return prev + 1;
        clearInterval(satisfactionInterval);
        return 48;
      });
    }, 40);

    // Cleanup intervals
    return () => {
      clearInterval(usersInterval);
      clearInterval(reductionInterval);
      clearInterval(satisfactionInterval);
    };
  };

  const statsRef = useIntersectionObserver(startAnimation);

  // Sample chat messages for animation
  const chatMessages = [
    { id: 1, text: "Hey, how are you doing today?", emotion: "Curious", time: "10:32 AM", isSender: false },
    { id: 2, text: "I'm doing great! Just finished a big project.", emotion: "Excited", time: "10:33 AM", isSender: true },
    { id: 3, text: "That's awesome! How did the presentation go?", emotion: "Interested", time: "10:34 AM", isSender: false },
    { id: 4, text: "It went really well, the client loved it!", emotion: "Happy", time: "10:36 AM", isSender: true }
  ];

  // Custom styles for animations
  const animationStyles = `
    @keyframes blob {
      0% { transform: scale(1) translate(0px, 0px); }
      33% { transform: scale(1.1) translate(30px, -50px); }
      66% { transform: scale(0.9) translate(-20px, 20px); }
      100% { transform: scale(1) translate(0px, 0px); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;

  return (
    <>
      <Head>
        <title>ClearChat - Communicate with Emotional Intelligence</title>
        <meta name="description" content="ClearChat integrates real-time facial sentiment analysis into every chat, enhancing empathy and reducing misunderstandings." />
        <style>{animationStyles}</style>
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-blue-600 mr-2">
                <MessageSquareText size={28} />
              </span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ClearChat</h1>
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Log In
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                Sign Up Free
              </Link>
            </div>
          </div>
        </header>

        <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-32 right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-80 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="max-w-6xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
              Revolutionizing Digital Communication
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              Chat with <span className="text-blue-500">Emotional Intelligence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Our AI-powered platform captures facial expressions in real-time, bringing authentic emotional context to your digital conversations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/signup" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started Free
              </Link>
              <Link href="https://github.com/rayyshen/clearchat/tree/hailmary" target="_blank" className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg text-lg border border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                Learn More
              </Link>
            </div>

            <div className="relative mx-auto bg-white p-6 rounded-2xl shadow-2xl inline-block max-w-4xl transform hover:rotate-1 transition-transform duration-500">
              <div className="absolute -top-2 left-8 w-16 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded"></div>
              <div className="bg-gray-100 rounded-xl h-72 md:h-96 w-full overflow-hidden">
                <div className="bg-white rounded-lg shadow-md w-full h-full flex flex-col">
                  <div className="border-b p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                        <Users size={20} />
                      </div>
                      <h3 className="font-semibold text-gray-800">Team Chat</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-500">3 Online</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col overflow-y-auto">
                    {chatMessages.map(message => (
                      <div key={message.id} className={`flex ${message.isSender ? 'justify-end' : 'justify-start'} mb-4 transform transition-all duration-500 hover:scale-105`}>
                        <div className={`max-w-xs md:max-w-md ${message.isSender ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl ${message.isSender ? 'rounded-br-none' : 'rounded-bl-none'} px-4 py-3 shadow-md`}>
                          <p>{message.text}</p>
                          <div className={`flex items-center ${message.isSender ? 'justify-end text-blue-100' : 'text-gray-500'} mt-1 text-xs`}>
                            <span className="flex items-center mr-1">
                              <Smile size={12} className="mr-1" /> {message.emotion}
                            </span>
                            • {message.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-3 flex items-center">
                    <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 focus:outline-none" />
                    <button className="ml-2 p-2 bg-blue-500 text-white rounded-full">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={statsRef} className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">{animatedCount.toLocaleString()}+</h3>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">{animatedReduction}%</h3>
                <p className="text-gray-600">Reduction in Miscommunication</p>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">{(animatedSatisfaction / 10).toFixed(1)}/5</h3>
                <p className="text-gray-600">User Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ClearChat Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our innovative technology bridges the emotion gap in digital communication
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-100 transform -translate-y-1/2 z-0"></div>

              <div className="bg-white p-6 rounded-xl shadow-lg z-10 transform transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">1</div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Capture</h3>
                <p className="text-gray-600 text-center">
                  Our AI analyzes your facial expressions in real-time as you type or speak.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg z-10 transform transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">2</div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Analyze</h3>
                <p className="text-gray-600 text-center">
                  Advanced algorithms detect your genuine emotional state with precision.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg z-10 transform transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">3</div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Communicate</h3>
                <p className="text-gray-600 text-center">
                  Your message is delivered with an emotional context tag that enhances understanding.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                Powerful Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes ClearChat Special</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines cutting-edge technology with intuitive design
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-t-4 border-blue-500">
                <div className="text-blue-500 mb-5 bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Smile size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Sentiment Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our AI accurately capture distinct facial expressions to convey genuine emotions with each message.
                </p>
                <Link href="https://github.com/rayyshen/clearchat" target="_blank" className="text-blue-600 font-medium flex items-center">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-t-4 border-indigo-500">
                <div className="text-indigo-500 mb-5 bg-indigo-50 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Enhanced Empathy</h3>
                <p className="text-gray-600 mb-4">
                  Understand the true emotional state behind messages, reducing misunderstandings by up to 89%.
                </p>
                <Link href="https://github.com/rayyshen/clearchat" target="_blank" className="text-indigo-600 font-medium flex items-center">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-t-4 border-purple-500">
                <div className="text-purple-500 mb-5 bg-purple-50 w-14 h-14 rounded-lg flex items-center justify-center">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Privacy First</h3>
                <p className="text-gray-600 mb-4">
                  Strict data protection ensures your communications remain secure and private.
                </p>
                <Link href="https://github.com/rayyshen/clearchat" target="_blank" className="text-purple-600 font-medium flex items-center">
                  Learn more <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-500">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              Ready to experience clearer communication?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already enhancing their digital conversations with emotional context.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup"
                className="px-6 py-3 bg-white text-blue-500 hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200">
                Get Started Free
              </Link>
              <Link href="https://github.com/rayyshen/clearchat" target="_blank" className="px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium rounded-lg transition-colors duration-200">
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>

        <footer className="bg-white py-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-blue-600 mr-2">
                  <MessageSquareText size={20} />
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ClearChat</span>
              </div>
              <div className="mt-4 md:mt-0 text-sm text-gray-500">
                © 2025 ClearChat. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
