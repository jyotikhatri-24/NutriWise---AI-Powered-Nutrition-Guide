import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './utils/constant';
import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Profile from './components/auth/Profile';
import LearnMore from './components/LearnMore';
import Analysis from './components/features/Analysis';
import MealPlanner from './components/features/MealPlanner';

import Updates from './components/features/Recipe';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.LEARN_MORE} element={<LearnMore />} />
        
        {/* Protected Routes */}
        <Route path={ROUTES.HOME} element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.PROFILE} element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ANALYSIS} element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.MEAL_PLANNER} element={
          <ProtectedRoute>
            <MealPlanner />
          </ProtectedRoute>
        } />
        <Route path={ROUTES.UPDATES} element={
          <ProtectedRoute>
            <Updates />
          </ProtectedRoute>
        } />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Router>
  );
}

export default App;