import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBagContext, useAuth } from '../App';
import getIcon from '../utils/iconUtils';
import { createOrder } from '../services/orderService';
import { createOrderItems } from '../services/orderItemService';

const ArrowLeftIcon = getIcon('ArrowLeft');
const ShieldCheckIcon = getIcon('ShieldCheck');
const LockIcon = getIcon('Lock');
const TruckIcon = getIcon('Truck');
const CreditCardIcon = getIcon('CreditCard');
const CheckCircleIcon = getIcon('CheckCircle');
const BadgeCheckIcon = getIcon('BadgeCheck');

export default function Checkout() {
  const navigate = useNavigate();
  const { bagItems, clearBag } = useContext(ShoppingBagContext);
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  
  // For order processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    aptSuite: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    email: '',
    saveAddress: false
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
    billingZipCode: '',
    savePaymentMethod: false
  });
  
  // Validation State
  const [shippingErrors, setShippingErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to complete your checkout");
      navigate("/login?redirect=/checkout");
    }

    if (user && user.emailAddress) {
      setShippingAddress(prev => ({ ...prev, email: user.emailAddress }));
    }
  }, [isAuthenticated, navigate, user]);
  
  // Handle shipping form change
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is modified
    if (shippingErrors[name]) {
      setShippingErrors({
        ...shippingErrors,
        [name]: null
      });
    }
  };
  
  // Handle payment form change
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
    }
    
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : formattedValue
    });
    
    // Clear error when field is modified
    if (paymentErrors[name]) {
      setPaymentErrors({
        ...paymentErrors,
        [name]: null
      });
    }
  };
  
  // Validate shipping info before proceeding
  const validateShippingInfo = () => {
    const errors = {};
    
    if (!shippingAddress.firstName.trim()) errors.firstName = 'First name is required';
    if (!shippingAddress.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shippingAddress.streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state.trim()) errors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(shippingAddress.zipCode)) errors.zipCode = 'Invalid ZIP code';
    
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\D/g, ''))) errors.phone = 'Invalid phone number';
    
    if (!shippingAddress.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) errors.email = 'Invalid email address';
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate payment info before placing order
  const validatePaymentInfo = () => {
    const errors = {};
    
    if (!paymentInfo.cardNumber.trim()) errors.cardNumber = 'Card number is required';
    else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) errors.cardNumber = 'Invalid card number';
    
    if (!paymentInfo.nameOnCard.trim()) errors.nameOnCard = 'Name on card is required';
    
    if (!paymentInfo.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
    else {
      const [month, year] = paymentInfo.expiryDate.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (!month || !year || month < 1 || month > 12 || year.length !== 2) {
        errors.expiryDate = 'Invalid expiry date';
      } else if ((parseInt(year) < currentYear) || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }
    
    if (!paymentInfo.cvv.trim()) errors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) errors.cvv = 'Invalid CVV';
    
    if (!paymentInfo.billingZipCode.trim()) errors.billingZipCode = 'Billing ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(paymentInfo.billingZipCode)) errors.billingZipCode = 'Invalid ZIP code';
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle continue to payment
  const handleContinueToPayment = () => {
    if (validateShippingInfo()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fill in all required shipping information");
    }
  };
  
  // Handle back to shipping
  const handleBackToShipping = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    if (!validatePaymentInfo()) {
      toast.error("Please fill in all required payment information");
      return;
    }

    if (bagItems.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 1. Create the order in the database
      const orderData = {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        streetAddress: shippingAddress.streetAddress,
        aptSuite: shippingAddress.aptSuite,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        subtotal: subtotal,
        shippingFee: shippingFee,
        tax: taxes,
        total: total,
        promoCode: appliedPromo?.code || ''
      };
      
      const orderResponse = await createOrder(orderData);
      
      if (!orderResponse.success) {
        throw new Error("Failed to create order");
      }
      
      // Get the order ID from the created order
      const orderId = orderResponse.results[0].data.Id;
      
      // 2. Create the order items in the database
      const orderItemsResponse = await createOrderItems(bagItems, orderId);
      
      if (!orderItemsResponse.success) {
        throw new Error("Failed to create order items");
      }
      
      // 3. Clear the shopping bag
      clearBag();
      
      // 4. Show success message
      toast.success("Order placed successfully!");
      
      // 5. Navigate to confirmation page
      navigate(`/order-confirmation?id=${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place your order. Please try again.");
    } finally {
      // Always set processing state back to false
      setIsProcessing(false);
    }
    
    // Note: The rest of the function handles calculating totals,
    // showing empty bag message, and rendering the checkout form
    // So we don't need to modify anything else
  };
  
  // Calculate order summary
  const calculateSubtotal = () => {
    return bagItems.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shippingFee = 9.99;
  const taxRate = 0.0725; // 7.25% tax
  const taxes = subtotal * taxRate;
  const total = subtotal + shippingFee + taxes;
  
  // If no items in bag, redirect to shopping bag
  if (bagItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Your shopping bag is empty</h2>
          <p className="mb-6">Add items to your bag before proceeding to checkout.</p>
          <button 
            onClick={() => navigate('/browse')}
            className="btn-primary px-6"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/bag')}
                className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <ArrowLeftIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">StyleSwap</h1>
              </a>
            </div>
            <h1 className="text-xl font-semibold">Checkout</h1>
            <div className="w-10"></div> {/* Empty div for spacing */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-center">
                <div className={`flex flex-col items-center ${step === 1 ? 'text-primary' : 'text-surface-600 dark:text-surface-400'}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step === 1 ? 'border-primary bg-primary/10' : 'border-surface-300 dark:border-surface-600'} mb-1`}>
                    <TruckIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Shipping</span>
                </div>
                
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'} mx-2`}></div>
                
                <div className={`flex flex-col items-center ${step === 2 ? 'text-primary' : 'text-surface-600 dark:text-surface-400'}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step === 2 ? 'border-primary bg-primary/10' : 'border-surface-300 dark:border-surface-600'} mb-1`}>
                    <CreditCardIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Payment</span>
                </div>
              </div>
            </div>
            
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingAddress.firstName}
                      onChange={handleShippingChange}
                      className={`input-field ${shippingErrors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {shippingErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{shippingErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingAddress.lastName}
                      onChange={handleShippingChange}
                      className={`input-field ${shippingErrors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {shippingErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{shippingErrors.lastName}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="streetAddress" className="block text-sm font-medium mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={shippingAddress.streetAddress}
                      onChange={handleShippingChange}
                      className={`input-field ${shippingErrors.streetAddress ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {shippingErrors.streetAddress && (
                      <p className="text-red-500 text-xs mt-1">{shippingErrors.streetAddress}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="aptSuite" className="block text-sm font-medium mb-1">
                      Apartment, Suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      id="aptSuite"
                      name="aptSuite"
                      value={shippingAddress.aptSuite}
                      onChange={handleShippingChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      className={`input-field ${shippingErrors.city ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {shippingErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{shippingErrors.city}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className={`input-field ${shippingErrors.state ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {shippingErrors.state && (
                        <p className="text-red-500 text-xs mt-1">{shippingErrors.state}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        className={`input-field ${shippingErrors.zipCode ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {shippingErrors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">{shippingErrors.zipCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      className="input-field"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                      className={`input-field ${shippingErrors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="(123) 456-7890"
                    />
                    {shippingErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{shippingErrors.phone}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleShippingChange}
                      className={`input-field ${shippingErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {shippingErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{shippingErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveAddress"
                      checked={shippingAddress.saveAddress}
                      onChange={handleShippingChange}
                      className="mr-2 h-4 w-4 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-sm">Save this address for future orders</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`input-field ${paymentErrors.cardNumber ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CreditCardIcon className="w-5 h-5 text-surface-400" />
                      </div>
                    </div>
                    {paymentErrors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">{paymentErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium mb-1">
                      Name on Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      name="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={handlePaymentChange}
                      className={`input-field ${paymentErrors.nameOnCard ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {paymentErrors.nameOnCard && (
                      <p className="text-red-500 text-xs mt-1">{paymentErrors.nameOnCard}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`input-field ${paymentErrors.expiryDate ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {paymentErrors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">{paymentErrors.expiryDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength="4"
                        className={`input-field ${paymentErrors.cvv ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {paymentErrors.cvv && (
                        <p className="text-red-500 text-xs mt-1">{paymentErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="billingZipCode" className="block text-sm font-medium mb-1">
                      Billing ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="billingZipCode"
                      name="billingZipCode"
                      value={paymentInfo.billingZipCode}
                      onChange={handlePaymentChange}
                      className={`input-field ${paymentErrors.billingZipCode ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {paymentErrors.billingZipCode && (
                      <p className="text-red-500 text-xs mt-1">{paymentErrors.billingZipCode}</p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="savePaymentMethod"
                        checked={paymentInfo.savePaymentMethod}
                        onChange={handlePaymentChange}
                        className="mr-2 h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <span className="text-sm">Save this payment method for future orders</span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
                  <LockIcon className="w-5 h-5 text-primary mr-2" />
                  <p className="text-sm">Your payment information is encrypted and secure.</p>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step === 1 ? (
                <button
                  onClick={() => navigate('/bag')}
                  className="btn-outline"
                >
                  Back to Bag
                </button>
              ) : (
                <button
                  onClick={handleBackToShipping}
                  className="btn-outline"
                >
                  Back to Shipping
                </button>
              )}
              
              {step === 1 ? (
                <button
                  onClick={handleContinueToPayment}
                  className="btn-primary"
                >
                  Continue to Payment
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="btn-primary"
                  disabled={isProcessing}>
                  Place Order
                </button>
              )}
            </div>
            
            {/* Security Badges */}
            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-surface-600 dark:text-surface-400">
                <div className="flex items-center">
                  <LockIcon className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-sm">Encrypted Data</span>
                </div>
                <div className="flex items-center">
                  <BadgeCheckIcon className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-sm">Verified by Visa</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-sm">Mastercard SecureCode</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {/* Item List */}
              <div className="divide-y divide-surface-200 dark:divide-surface-700 mb-4">
                {bagItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-3 flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-100 dark:bg-surface-700 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Size: {item.size}, {item.rentalDays} days
                      </p>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          Qty: {item.quantity || 1}
                        </p>
                        <p className="font-medium text-sm">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}