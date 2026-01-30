import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ROUTES } from '../../utils/constant';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    allergies: '',
    gender: '',
    age: '',
    phoneNumber: '',
    activityLevel: 'moderate'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.height || !formData.weight || !formData.age) {
      setError('Height, weight, and age are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phoneNumber: formData.phoneNumber || '',
          password: formData.password,
          height: Number(formData.height),
          weight: Number(formData.weight),
          allergies: formData.allergies,   // STRING
          gender: formData.gender,
          age: Number(formData.age),
          activityLevel: formData.activityLevel,
          dietaryPreferences: '',          // STRING
          healthConditions: ''             // STRING
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(ROUTES.HOME);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="font-medium text-green-600 hover:text-green-500"
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input name="fullname" value={formData.fullname} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Input name="password" type="password" value={formData.password} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <Input name="height" type="number" value={formData.height} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <Input name="weight" type="number" value={formData.weight} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <Input name="age" type="number" value={formData.age} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                <Select value={formData.activityLevel} onValueChange={(v) => handleSelectChange('activityLevel', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                <Input name="allergies" value={formData.allergies} onChange={handleChange} />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
