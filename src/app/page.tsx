import Image from "next/image";
import Head from 'next/head';
import { MessageSquareText, Smile, Users, Shield, ArrowRight } from 'lucide-react';
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>ClearChat - Chat with Emotional Context</title>
        <meta name="description" content="ClearChat integrates real-time facial sentiment analysis into every chat, enhancing empathy and reducing misunderstandings." />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header/Navigation */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">
                <MessageSquareText size={28} />
              </span>
              <h1 className="text-2xl font-bold text-gray-800">ClearChat</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200">
                Log In
              </Link>
              <Link href="/signup" className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Chat with <span className="text-blue-500">Emotional Context</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Revolutionize your digital communication with real-time facial sentiment analysis that brings authentic emotions back to your conversations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/signup" className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-lg transition-colors duration-200">
                Get Started
              </Link>
              <button 
                className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg text-lg border border-gray-300 transition-colors duration-200"
              >
                Learn More
              </button>
            </div>

            {/* App Preview Image */}
            <div className="bg-white p-4 rounded-xl shadow-lg inline-block">
              <div className="bg-gray-100 rounded-lg h-64 md:h-96 w-full max-w-4xl flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-md w-full h-full flex flex-col">
                  <div className="border-b p-4 flex items-center">
                    <div className="bg-blue-100 text-blue-500 rounded-full p-2 mr-3">
                      <Users size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-800">Chat Preview</h3>
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex justify-start mb-4">
                      <div className="max-w-xs md:max-w-md bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                        <p>Hey, how are you doing today?</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="flex items-center text-yellow-500 mr-1">
                            <Smile size={12} className="mr-1" /> Curious
                          </span>
                          • 10:32 AM
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mb-4">
                      <div className="max-w-xs md:max-w-md bg-blue-500 text-white rounded-lg rounded-br-none px-4 py-2">
                        <p>I'm doing great! Just finished a big project.</p>
                        <div className="flex items-center justify-end mt-1 text-xs text-blue-100">
                          <span className="flex items-center mr-1">
                            <Smile size={12} className="mr-1" /> Excited
                          </span>
                          • 10:33 AM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-500 mb-4">
                  <Smile size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Sentiment Analysis</h3>
                <p className="text-gray-600">
                  Advanced AI captures your facial expressions to convey genuine emotions with each message.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-500 mb-4">
                  <Users size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Enhanced Empathy</h3>
                <p className="text-gray-600">
                  Understand how others truly feel, reducing misunderstandings and fostering deeper connections.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-blue-500 mb-4">
                  <Shield size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Privacy First</h3>
                <p className="text-gray-600">
                  Secure and private communication with end-to-end encryption and strict data protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Ready to experience clearer communication?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who are already enhancing their digital conversations with emotional context.
            </p>
            <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-lg transition-colors duration-200">
                Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-12 mt-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <span className="text-blue-500 mr-2">
                  <MessageSquareText size={24} />
                </span>
                <span className="text-xl font-bold text-gray-800">ClearChat</span>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-gray-500">
              <p>© {new Date().getFullYear()} ClearChat. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
