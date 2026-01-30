# 🍽 NutriWise  
NutriWise is a web-based application designed to provide users with detailed nutritional information about various food items, helping individuals make informed dietary choices. Leveraging the power of Google Generative AI, NutriWise delivers instant, comprehensive data on:  

- Macronutrients (Protein, Fat, Carbohydrates)  
- Micronutrients (Vitamins, Minerals)  
- Calorie Content  

The application also generates personalized meal plans based on user input, ensuring nutritional balance, variety, and enjoyment.  

## Table of Contents  
- Features  
- Technical Requirements  
- Functional Requirements  
- Constraints & Challenges  

## Features  
- User registration and login with JWT authentication  
- Input forms for dietary preferences, allergies, and health goals  
- AI-generated personalized meal plans with recipes  
- Detailed nutritional breakdown per meal 
- Real-time nutritional information using Google Generative AI.

## Technical Requirements  
- Frontend: React.js, HTML, CSS, JavaScript  
- Backend: Node.js, Express.js  
- Database: MongoDB (with Mongoose ODM)  
- APIs: Google Generative AI, Nutritionix (for food data)  
- Authentication: JWT (JSON Web Tokens)  
- Hosting: AWS EC2 (Backend), Vercel/Netlify (Frontend)  

## Functional Requirements  
- User authentication with secure JWT-based login and registration  
- Input forms for dietary preferences, allergies, health conditions, and taste preferences  
- AI-generated meal plans tailored to the user’s dietary needs  
- Nutritional breakdown for each meal, including macronutrients and micronutrients  
- Grocery list generator with export and sharing functionality  

## Constraints & Challenges  
- Real-time AI integration: Connecting Google Generative AI with Node.js for instant nutritional analysis  
- Scalability: Ensuring MongoDB efficiently handles large datasets  
- Performance Optimization: Minimizing API response times for a smooth user experience  

NutriWise - Your AI-Powered Nutrition Guide!
