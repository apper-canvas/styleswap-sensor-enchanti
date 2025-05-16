import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  useEffect(() => {
    // Check if the URL has a tab parameter and set the active tab accordingly
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }
  }, [location]);

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

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value
    });
    // Clear error when user starts typing
    if (registerErrors[name]) {
      setRegisterErrors({
        ...registerErrors,
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

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerForm.name) {
      errors.name = 'Name is required';
    }
    if (!registerForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!registerForm.phone) {
      errors.phone = 'Phone number is required';
    }
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      toast.success('Login successful!');
      navigate('/');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      toast.success('Registration successful! Please check your email to verify your account.');
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
        <div className="grid grid-cols-2 border-b border-surface-200 dark:border-surface-700">
          <button 
            className={`py-4 font-medium text-center transition-colors ${activeTab === 'login' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-surface-500 dark:text-surface-400'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`py-4 font-medium text-center transition-colors ${activeTab === 'register' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-surface-500 dark:text-surface-400'}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">Welcome back</h2>
              
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
                  <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
                  <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-surface-400" />
                  </div>
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

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Sign in
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Don't have an account?{' '}
                  <a href="#" onClick={() => navigate('/signup')} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Create an account
                  </a>
                </p>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">Create an account</h2>
              
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.name ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
                    placeholder="Jane Doe"
                  />
                </div>
                {registerErrors.name && <p className="text-sm text-red-500">{registerErrors.name}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="register-email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSignIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.email ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
                    placeholder="your@email.com"
                  />
                </div>
                {registerErrors.email && <p className="text-sm text-red-500">{registerErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.phone ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
                    placeholder="(123) 456-7890"
                  />
                </div>
                {registerErrors.phone && <p className="text-sm text-red-500">{registerErrors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="register-password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className={`block w-full pl-10 pr-10 py-2 border ${registerErrors.password ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
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
                {registerErrors.password && <p className="text-sm text-red-500">{registerErrors.password}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.confirmPassword ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-white`}
                    placeholder="••••••••"
                  />
                </div>
                {registerErrors.confirmPassword && <p className="text-sm text-red-500">{registerErrors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;