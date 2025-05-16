import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const EyeIcon = getIcon('Eye');
const EyeOffIcon = getIcon('EyeOff');
const AtSignIcon = getIcon('AtSign');
const LockIcon = getIcon('Lock');
const UserIcon = getIcon('User');
const PhoneIcon = getIcon('Phone');
const ArrowLeftIcon = getIcon('ArrowLeft');

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    });
    // Clear error when user starts typing
    if (loginErrors[name]) {
      setLoginErrors({
        ...loginErrors,
        [name]: ''
      });
    }
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!loginForm.password) {
      errors.password = 'Password is required';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      // In a real app, this would come from your backend after authentication
      // For demo purposes, we'll use previously stored roles or default to both roles
      try {
        const storedRoles = JSON.parse(localStorage.getItem('userRoles')) || ['renter', 'lender'];
        localStorage.setItem('userRoles', JSON.stringify(storedRoles));
      } catch (error) {
        localStorage.setItem('userRoles', JSON.stringify(['renter', 'lender']));
      }
      toast.success('Login successful!');
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-surface-50 dark:bg-surface-900">
      <button 
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      <div className="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">            
          <form onSubmit={handleLoginSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">Login to your account</h2>
              
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSignIcon className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${loginErrors.email ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
                  placeholder="your@email.com"
                />
                </div>
                {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  {/* Password input with eye icon toggle */}
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className={`block w-full pl-10 pr-10 py-2 border ${loginErrors.password ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password}</p>}
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-700 dark:text-surface-300">
                    Remember me
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Sign in
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => navigate('/signup')} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Register
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default Login;