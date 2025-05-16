import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const EyeIcon = getIcon('Eye');
const EyeOffIcon = getIcon('EyeOff');
const AtSignIcon = getIcon('AtSign');
const LockIcon = getIcon('Lock');
const UserIcon = getIcon('User');
const ArrowLeftIcon = getIcon('ArrowLeft');
const CheckIcon = getIcon('Check');
const ShieldIcon = getIcon('Shield');
const TruckIcon = getIcon('Truck');
const HeartIcon = getIcon('Heart');

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmPassword: '',
    roles: ['renter'],  // Default role is renter
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleRoleChange = (role) => {
    // If clicking on 'both', select both roles
    if (role === 'both') {
      setFormData({ ...formData, roles: ['renter', 'lender'] });
    } else {
      // Toggle the selected role
      const newRoles = formData.roles.includes(role) 
        ? formData.roles.filter(r => r !== role) 
        : [...formData.roles, role];
      setFormData({ ...formData, roles: newRoles.length ? newRoles : ['renter'] }); // Ensure at least one role
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(errors);
    if (formData.roles.length === 0) {
      errors.roles = 'Please select at least one role';
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    }
    localStorage.setItem('userRoles', JSON.stringify(formData.roles));
  };

  const handleSocialLogin = (provider) => {
    toast.info(`Signing up with ${provider}...`);
    // In a real implementation, this would trigger the OAuth flow
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex flex-col lg:flex-row">
      <button 
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Home
      </button>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">Create your account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg focus:ring-primary focus:border-primary dark:bg-surface-700 dark:text-white`}
                  placeholder="Jane Doe"
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg focus:ring-primary focus:border-primary dark:bg-surface-700 dark:text-white`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'} rounded-lg focus:ring-primary focus:border-primary dark:bg-surface-700 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-surface-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-surface-700 dark:text-surface-300">
                    I agree to the <a href="#" className="text-primary hover:text-primary-dark dark:text-primary-light">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-dark dark:text-primary-light">Privacy Policy</a>
                  </label>
                </div>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              Create Account
            </button>

            <div className="flex items-center justify-center">
            {/* User Role Selection */}
            <div className="space-y-3 mt-6">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                I want to use StyleSwap as a:
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.roles.includes('renter') 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'  
                      : 'border-surface-300 dark:border-surface-600'
                  }`}
                  onClick={() => handleRoleChange('renter')}
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('renter')}
                    onChange={() => handleRoleChange('renter')}
                    className="h-5 w-5 text-primary rounded"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium">Renter</h3>
                    formData.roles.includes('lender') 
                  </div>
                </div>
                
                <div 
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    registerForm.roles.includes('lender') 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    checked={formData.roles.includes('lender')}
                  }`}
                  onClick={() => handleRoleChange('lender')}
                >
                  <input
                    type="checkbox"
                    checked={registerForm.roles.includes('lender')}
                    onChange={() => handleRoleChange('lender')}
                    className="h-5 w-5 text-primary rounded"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium">Lender</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">List your designer items for others to rent</p>
                  </div>
                </div>
              </div>
              {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
            </div>

              <div className="h-px bg-surface-200 dark:bg-surface-700 w-full"></div>
              <div className="px-4 text-sm text-surface-500 dark:text-surface-400">or continue with</div>
              <div className="h-px bg-surface-200 dark:bg-surface-700 w-full"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center py-2 px-4 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm bg-white dark:bg-surface-700 hover:bg-surface-50 dark:hover:bg-surface-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center py-2 px-4 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm bg-white dark:bg-surface-700 hover:bg-surface-50 dark:hover:bg-surface-600"
              >
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center py-2 px-4 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm bg-white dark:bg-surface-700 hover:bg-surface-50 dark:hover:bg-surface-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 20.28a9.85 9.85 0 01-1.36.713c-.543.257-1.093.45-1.66.579-.716.174-1.416.252-2.1.234-.682-.018-1.356-.103-2.022-.254-.665-.151-1.311-.371-1.939-.66-.629-.289-1.23-.644-1.811-1.066s-1.134-.902-1.666-1.447a9.842 9.842 0 01-1.328-1.749A9.89 9.89 0 012 13.531c-.16-.731-.242-1.454-.245-2.175.003-.723.089-1.445.253-2.177.158-.716.394-1.398.706-2.046a9.981 9.981 0 011.147-1.83C4.428 4.605 5.1 4.057 5.8 3.601c.705-.465 1.435-.826 2.193-1.079a8.623 8.623 0 012.31-.471 9.027 9.027 0 13.83.322c.567.173 1.105.4 1.613.678.507.268.985.59 1.432.962.44.371.843.79 1.209 1.254a4.741 4.741 0 00-1.275 1.144 5.018 5.018 0 00-.862 1.511 4.927 4.927 0 00-.287 1.662c.019.699.174 1.34.466 1.933a5.026 5.026 0 001.233 1.561c.522.437 1.118.79 1.787 1.062a7.206 7.206 0 01-1.123 2.962 15.725 15.725 0 01-1.853 2.775z"/>
                  <path d="M13.434 6.379a3.122 3.122 0 01.933-2.28 3.127 3.127 0 12.216-.938 3.128 3.128 0 00-2.255.936 3.125 3.125 0 00-.894 2.282z"/>
                </svg>
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Already have an account?{' '}
                <a href="#" onClick={() => navigate('/login')} className="font-medium text-primary hover:text-primary-dark dark:text-primary-light">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Benefits Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-primary-light to-primary-dark p-12 flex-col justify-center text-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-8">Join StyleSwap Today</h2>
          <p className="text-lg mb-8">Become part of our community and experience fashion in a sustainable way.</p>
          
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <ShieldIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Secure Transactions</h3>
                <p className="mt-1">All payments and personal data are encrypted and secure.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <TruckIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Free Shipping</h3>
                <p className="mt-1">Enjoy free shipping on all rentals and returns within the country.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <HeartIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Sustainable Fashion</h3>
                <p className="mt-1">Join us in reducing fashion waste while staying stylish.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SignUp;