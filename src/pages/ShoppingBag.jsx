import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBagContext } from '../App';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const XIcon = getIcon('X');
const HeartIcon = getIcon('Heart');
const TruckIcon = getIcon('Truck');
const TagIcon = getIcon('Tag');
const PlusIcon = getIcon('Plus');
const MinusIcon = getIcon('Minus');

export default function ShoppingBag() {
  const navigate = useNavigate();
  const { bagItems, addToBag, removeBagItem, clearBag } = useContext(ShoppingBagContext);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [bagItemsWithQuantity, setBagItemsWithQuantity] = useState([]);
  
  // Initialize items with quantity
  useEffect(() => {
    const itemsWithQty = bagItems.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setBagItemsWithQuantity(itemsWithQty);
  }, [bagItems]);

  const handleRemoveItem = (itemId, size) => {
    removeBagItem(itemId, size);
    toast.info("Item removed from your bag");
  };

  const handleSaveForLater = (item) => {
    // In a real app, this would save to wishlist
    removeBagItem(item.id, item.size);
    toast.success(`${item.title} saved for later`);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...bagItemsWithQuantity];
    updatedItems[index].quantity = newQuantity;
    setBagItemsWithQuantity(updatedItems);
    
    // Also update in context/storage
    addToBag({
      ...updatedItems[index],
      quantity: newQuantity
    });
  };

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    
    // Simulate promo code validation
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: 0.1, // 10% off
        type: 'percentage'
      });
      toast.success("Promo code applied: 10% off your order!");
    } else if (promoCode.toUpperCase() === 'FREESHIP') {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: 9.99, // Shipping cost
        type: 'shipping'
      });
      toast.success("Promo code applied: Free shipping!");
    } else {
      toast.error("Invalid promo code. Please try again.");
    }
    
    setPromoCode('');
  };

  const handleContinueShopping = () => {
    navigate('/browse');
  };

  const handleProceedToCheckout = () => {
    if (bagItemsWithQuantity.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    
    toast.info("Proceeding to checkout...");
    // In a real app, navigate to checkout page
    // navigate('/checkout');
  };

  // Calculate order summary
  const calculateSubtotal = () => {
    return bagItemsWithQuantity.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = 9.99;
  const taxRate = 0.0725; // 7.25% tax
  const taxes = subtotal * taxRate;
  
  // Apply promotion if valid
  let discount = 0;
  let finalShipping = shippingFee;
  
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = subtotal * appliedPromo.discount;
    } else if (appliedPromo.type === 'shipping') {
      finalShipping = 0;
    }
  }
  
  const total = subtotal + finalShipping + taxes - discount;

  // Calculate estimated delivery date (7 days from now)
  const estimateDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <ArrowLeftIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">StyleSwap</h1>
              </a>
            </div>
            <h1 className="text-xl font-semibold">Shopping Bag</h1>
            <div className="w-10"></div> {/* Empty div for spacing */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bagItemsWithQuantity.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bag Items List */}
            <div className="lg:col-span-2 space-y-4">
              {bagItemsWithQuantity.map((item, index) => (
                <div key={`${item.id}-${item.size}`} className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden bg-surface-100 dark:bg-surface-700 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        className="text-surface-500 hover:text-red-500"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-surface-500 dark:text-surface-400 text-sm">{item.designer}</p>
                    
                    <div className="mt-2 flex gap-x-4 flex-wrap">
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        Size: <span className="font-medium">{item.size}</span>
                      </span>
                      
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        Color: <span className="font-medium">{item.color}</span>
                      </span>
                      
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        Rental: <span className="font-medium">{item.rentalDays} days</span>
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center border border-surface-200 dark:border-surface-600 rounded-md">
                        <button 
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1 px-2 text-surface-500 hover:text-primary"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1 px-2 text-surface-500 hover:text-primary"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="text-sm text-primary flex items-center mt-1"
                        >
                          <HeartIcon className="w-4 h-4 mr-1" />
                          Save for Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{finalShipping > 0 ? `$${finalShipping.toFixed(2)}` : 'FREE'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mt-6">
                  <label htmlFor="promoCode" className="block text-sm font-medium mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 input-field rounded-r-none focus:z-10"
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      className="btn-primary rounded-l-none px-4 -ml-px"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                {/* Delivery Estimation */}
                <div className="mt-6 bg-surface-50 dark:bg-surface-700 p-4 rounded-lg flex items-start gap-3">
                  <TruckIcon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {estimateDeliveryDate()}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleProceedToCheckout}
                    className="btn-primary w-full py-3"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="btn-outline w-full py-3"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="mb-6 w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto">
              <TagIcon className="w-12 h-12 text-surface-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your bag is empty</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              Looks like you haven't added any items to your bag yet.
            </p>
            <button
              onClick={handleContinueShopping}
              className="btn-primary px-8 py-3"
            >
              Browse Collection
            </button>
          </div>
        )}
      </main>
    </div>
  );
}