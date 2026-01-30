# 🍽️ NutriWise — AI-Powered Nutrition Guide

NutriWise is a web-based nutrition analysis and meal planning platform that helps users make informed dietary decisions using AI-generated insights. It provides detailed nutritional breakdowns and personalized meal plans based on user preferences, health goals, and dietary constraints.

> ⚠️ Note: This project is currently not hosted.
> A screen recording demo showcasing all major features is included in the repository.

---

## 🎥 Demo

📹 Screen recording demonstrating:
- User authentication
- Nutrition analysis
- AI-generated meal plans
- Recipe and calorie breakdown

---

## ✨ Features

- Secure user authentication using JWT
- Personalized AI-generated meal plans
- Detailed nutritional analysis
  - Macronutrients (Protein, Carbohydrates, Fats)
  - Micronutrients (Vitamins, Minerals)
  - Calorie content
- Custom inputs for dietary preferences, allergies, and health goals
- Recipe-level nutritional breakdown
- Scalable backend architecture

---

## 🧠 Solved Technical Challenges

### ✅ AI Response Parsing
- Implemented robust JSON extraction from inconsistent AI outputs
- Designed fallback templates for invalid or partial responses

### ✅ Performance Optimization
- Reduced AI response time from ~60s to ~20s per query
- Implemented day-by-day meal plan generation
- Added loading states and progress indicators

### ✅ Scalability
- MongoDB indexing for faster queries
- Stateless REST APIs
- JWT-based authentication for horizontal scaling

### ✅ Real-time AI Integration
- Seamless Ollama API integration
- Timeout handling and retry logic
- Graceful error recovery for AI failures

---

## 🛠 Technology Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **Ollama LLaMA3** - AI model for recipe/meal plan generation
- **JWT** - Authentication
- **bcrypt** - Password hashing


---

## 📋 Functional Requirements

- Secure user login and registration
- Capture dietary preferences, allergies, and health conditions
- AI-based personalized meal plan generation
- Nutritional breakdown per meal
- Grocery list generation logic

---

## ⚙️ Technical Requirements

- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- AI Integration: Ollama (LLaMA3)

---

## 🚀 Future Enhancements

- [ ] 📱 Mobile App (React Native)
- [ ] 🛒 Auto Grocery List Generator
- [ ] 📊 Nutrition Dashboard with charts
- [ ] 🍽️ Recipe ratings and favorites
- [ ] 🔗 Fitness tracker integration (Fitbit, MyFitnessPal)
- [ ] 🌐 Multi-language support
- [ ] 🤝 Social sharing features
- [ ] 📧 Email notifications
- [ ] 🎨 Theme customization (Dark mode)
- [ ] 🔍 Advanced recipe search and filters

---

## ⚠️ Constraints & Challenges

- Handling inconsistent AI outputs
- Optimizing real-time AI response times
- Designing scalable backend architecture

---

### 🌟 NutriWise — Turning AI into Smarter Nutrition Decisions


