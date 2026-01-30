import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constant';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

const Home = () => {
    const [user] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = useNavigate();

    const featureButtons = [
        {
            title: "Nutrition Analysis",
            description: "Get instant nutritional information",
            path: "/analysis",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            bgColor: "from-green-400 to-emerald-500",
            hoverColor: "group-hover:from-green-500 group-hover:to-emerald-600"
        },
        {
            title: "Meal Planner",
            description: "Personalized meal recommendations",
            path: "/meal-planner",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: "from-blue-400 to-cyan-500",
            hoverColor: "group-hover:from-blue-500 group-hover:to-cyan-600"
        },
        {
            title: "Recipe Generator",
            description: "Get instant recipe ideas",
            path: "/updates",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            bgColor: "from-purple-400 to-pink-500",
            hoverColor: "group-hover:from-purple-500 group-hover:to-pink-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <Navbar />
            
            {/* Hero Section with Animation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                    {/* Animated Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-6 bg-green-100 rounded-full animate-fade-in-down">
                        <span className="text-green-700 font-semibold text-sm">🥗 AI-Powered Nutrition</span>
                    </div>

                    {/* Main Heading with Stagger Animation */}
                    <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl animate-fade-in-up">
                        <span className="block mb-2">Welcome to</span>
                        <span className="block bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-gradient">
                            NutriWise
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 sm:text-2xl animate-fade-in delay-100">
                        Your personal AI-powered nutrition assistant.
                    </p>
                    
                    {user ? (
                        <p className="mt-3 text-lg text-gray-500 animate-fade-in delay-200">
                            Welcome back, <span className="font-semibold text-green-600">{user.name || 'there'}</span>! 👋
                        </p>
                    ) : (
                        <p className="mt-3 text-lg text-gray-500 animate-fade-in delay-200">
                            Get started by creating an account or logging in.
                        </p>
                    )}

                    {/* CTA Buttons */}
                    {!user && (
                        <div className="mt-8 flex justify-center gap-4 animate-fade-in delay-300">
                            <button 
                                onClick={() => navigate('/signup')}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                Get Started
                            </button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-green-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                Sign In
                            </button>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="bg-transparent pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-12 animate-fade-in delay-400">
                            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                                Everything you need for
                            </h2>
                            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent sm:text-5xl">
                                better nutrition
                            </h2>
                            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Feature Cards with Enhanced Styling */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {featureButtons.map((feature, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(feature.path)}
                                    className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-100 animate-fade-in-up"
                                    style={{ animationDelay: `${500 + index * 100}ms` }}
                                >
                                    {/* Gradient Background on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                    
                                    {/* Floating Icon Circle */}
                                    <div className="relative p-8">
                                        <div className="flex items-center justify-center mb-6">
                                            <div className={`flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} ${feature.hoverColor} text-white shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                                                {feature.icon}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-gray-900 text-center mb-3 group-hover:text-green-600 transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-base text-gray-600 text-center leading-relaxed">
                                            {feature.description}
                                        </p>

                                        {/* Hover Arrow */}
                                        <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Stats Section */}
                        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in delay-800">
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                                <div className="text-gray-600 font-medium">Recipes</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                                <div className="text-gray-600 font-medium">AI Support</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                                <div className="text-gray-600 font-medium">Personalized</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Add Custom CSS for Animations */}
            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-fade-in-down {
                    animation: fadeInDown 0.6s ease-out forwards;
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .delay-100 {
                    animation-delay: 0.1s;
                }

                .delay-200 {
                    animation-delay: 0.2s;
                }

                .delay-300 {
                    animation-delay: 0.3s;
                }

                .delay-400 {
                    animation-delay: 0.4s;
                }

                .delay-800 {
                    animation-delay: 0.8s;
                }
            `}</style>
        </div>
    );
};

export default Home;