import React from 'react';
import Navbar from './shared/Navbar';

const LearnMore = () => {
    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        About NutriWise
                    </h1>
                    <p className="text-xl text-gray-600">
                        Your personal nutrition assistant powered by AI
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">What is NutriWise?</h2>
                        <p className="text-gray-600">
                            NutriWise is a web-based application designed to provide users with detailed nutritional
                            information about various food items. By leveraging Google Generative AI, our application
                            delivers instant, comprehensive data on macronutrients (protein, fat, carbohydrates),
                            micronutrients (vitamins, minerals), and calorie content.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
                        <p className="text-gray-600">
                            We aim to assist individuals in making informed dietary choices and understanding the
                            nutritional value of the foods they consume. Our platform helps you create healthy and
                            satisfying meal plans that align with your specific needs and preferences.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Key Features</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start">
                                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Personalized meal planning based on your dietary preferences</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Detailed nutritional information for various food items</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>AI-powered recipe suggestions and grocery lists</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Accommodation for dietary restrictions and allergies</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Health condition-specific meal recommendations</span>
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8">How It Works</h2>
                        <div className="space-y-4 text-gray-600">
                            <p>1. Create your profile with dietary preferences and health conditions</p>
                            <p>2. Input your nutritional goals and restrictions</p>
                            <p>3. Get personalized meal plans and nutritional insights</p>
                            <p>4. Track your progress and adjust your plans as needed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;