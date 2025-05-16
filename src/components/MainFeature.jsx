import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const CalendarIcon = getIcon('Calendar');
const SearchIcon = getIcon('Search');
const CheckSquareIcon = getIcon('CheckSquare');
const FilterIcon = getIcon('SlidersHorizontal');
const ArrowLeftIcon = getIcon('ArrowLeft');
const ArrowRightIcon = getIcon('ArrowRight');
const TagIcon = getIcon('Tag');
const ClockIcon = getIcon('Clock');
const XIcon = getIcon('X');
const PlusIcon = getIcon('Plus');
const MinusIcon = getIcon('Minus');

export default function MainFeature() {
  const [currentStep, setCurrentStep] = useState(1);
  const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '' });
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState(200);
  const [size, setSize] = useState('');
  const [style, setStyle] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const occasions = [
    "Wedding", "Black Tie", "Cocktail Party", "Business", 
    "Date Night", "Vacation", "Photoshoot", "Festival"
  ];
  
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  
  const styleOptions = [
    "Elegant", "Casual", "Bohemian", "Vintage", 
    "Minimalist", "Glamorous", "Streetwear", "Preppy"
  ];
  
  const mockRecommendations = [
    {
      id: 1,
      title: "Sequined Evening Gown",
      designer: "Marchesa",
      price: 155,
      retailPrice: 3100,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8c6?auto=format&fit=crop&q=80&w=500&h=600",
      tags: ["Evening", "Formal"]
    },
    {
      id: 2,
      title: "Floral Midi Dress",
      designer: "Zimmermann",
      price: 95,
      retailPrice: 1900,
      image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&q=80&w=500&h=600",
      tags: ["Summer", "Casual"]
    },
    {
      id: 3,
      title: "Tailored Tuxedo",
      designer: "Tom Ford",
      price: 175,
      retailPrice: 3500,
      image: "https://images.unsplash.com/photo-1598808503746-f34cfb6350ff?auto=format&fit=crop&q=80&w=500&h=600",
      tags: ["Formal", "Black Tie"]
    }
  ];

  const handleStyleToggle = (selectedStyle) => {
    if (style.includes(selectedStyle)) {
      setStyle(style.filter(s => s !== selectedStyle));
    } else {
      setStyle([...style, selectedStyle]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!rentalDates.startDate || !rentalDates.endDate) {
        toast.error("Please select both start and end dates");
        return;
      }
      
      // Validate dates - start date should be in the future and end date after start date
      const start = new Date(rentalDates.startDate);
      const end = new Date(rentalDates.endDate);
      const today = new Date();
      
      if (start < today) {
        toast.error("Start date must be in the future");
        return;
      }
      
      if (end <= start) {
        toast.error("End date must be after start date");
        return;
      }
    }
    
    if (currentStep === 2 && !occasion) {
      toast.error("Please select an occasion");
      return;
    }
    
    if (currentStep === 3 && !size) {
      toast.error("Please select your size");
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would be an API request
        setRecommendations(mockRecommendations);
        setShowRecommendations(true);
        setLoading(false);
        toast.success("Here are your personalized recommendations!");
      } catch (err) {
        setError('Failed to load recommendations. Please try again.');
        setLoading(false);
        toast.error("Something went wrong. Please try again.");
      }
    }, 1500);
  };

  const resetForm = () => {
    setRentalDates({ startDate: '', endDate: '' });
    setOccasion('');
    setBudget(200);
    setSize('');
    setStyle([]);
    setCurrentStep(1);
    setShowRecommendations(false);
  };

  // Get today's date for min date in date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Find Your Perfect Rental</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Tell us what you're looking for and we'll help you find the perfect designer pieces for your occasion.
        </p>
      </div>
      
      {!showRecommendations ? (
        <motion.div 
          className="max-w-3xl mx-auto card shadow-soft overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress Steps */}
          <div className="bg-surface-50 dark:bg-surface-800 p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step < currentStep 
                        ? 'bg-primary text-white' 
                        : step === currentStep 
                          ? 'bg-primary-light text-white' 
                          : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckSquareIcon className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div 
                      className={`h-1 w-12 md:w-24 ${
                        step < currentStep ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-surface-500 dark:text-surface-400 px-1">
              <span>Dates</span>
              <span>Occasion</span>
              <span>Size</span>
              <span>Style</span>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                    When do you need your rental?
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        min={today}
                        value={rentalDates.startDate}
                        onChange={(e) => setRentalDates({ ...rentalDates, startDate: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        min={rentalDates.startDate || today}
                        value={rentalDates.endDate}
                        onChange={(e) => setRentalDates({ ...rentalDates, endDate: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg">
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      <ClockIcon className="inline-block w-4 h-4 mr-1" />
                      Most rentals are for 4, 7, or 14 days. We'll deliver your items 1-2 days before your start date.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center">
                    <SearchIcon className="w-5 h-5 mr-2 text-primary" />
                    What's your occasion?
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {occasions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setOccasion(item)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          occasion === item
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3 flex justify-between">
                      <span>Your budget (up to ${budget})</span>
                      <span className="text-primary font-semibold">${budget}</span>
                    </label>
                    <input
                      type="range"
                      id="budget"
                      min="50"
                      max="500"
                      step="10"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-surface-500 mt-1">
                      <span>$50</span>
                      <span>$500</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-primary" />
                    What's your size?
                  </h3>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {sizeOptions.map((sizeOption) => (
                      <button
                        key={sizeOption}
                        type="button"
                        onClick={() => setSize(sizeOption)}
                        className={`py-3 rounded-lg border-2 transition-all ${
                          size === sizeOption
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
                        }`}
                      >
                        {sizeOption}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg">
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      Not sure about your size? Many of our rentals include a backup size at no extra cost.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center">
                    <FilterIcon className="w-5 h-5 mr-2 text-primary" />
                    What style are you looking for?
                  </h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {styleOptions.map((styleOption) => (
                      <button
                        key={styleOption}
                        type="button"
                        onClick={() => handleStyleToggle(styleOption)}
                        className={`px-4 py-2 rounded-full transition-all ${
                          style.includes(styleOption)
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300'
                        }`}
                      >
                        {styleOption}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-primary-light/10 border border-primary-light/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Your Selection Summary:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <span className="font-medium">Dates:</span> {rentalDates.startDate} to {rentalDates.endDate}
                      </li>
                      <li>
                        <span className="font-medium">Occasion:</span> {occasion}
                      </li>
                      <li>
                        <span className="font-medium">Budget:</span> Up to ${budget}
                      </li>
                      <li>
                        <span className="font-medium">Size:</span> {size}
                      </li>
                      <li>
                        <span className="font-medium">Style:</span> {style.length > 0 ? style.join(', ') : 'Any'}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Form Navigation */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed text-surface-400 dark:text-surface-600'
                  : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary inline-flex items-center gap-1"
            >
              {currentStep < 4 ? (
                <>
                  Next
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              ) : (
                <>
                  {loading ? 'Finding Items...' : 'Find My Items'}
                  {!loading && <SearchIcon className="w-4 h-4 ml-1" />}
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Your Personalized Recommendations</h3>
            <button
              onClick={resetForm}
              className="btn-outline inline-flex items-center gap-1"
            >
              <XIcon className="w-4 h-4" />
              Start Over
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <motion.div
                key={item.id}
                className="card overflow-hidden relative group"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-80">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white dark:bg-surface-800 rounded-full px-3 py-1 text-sm font-medium text-primary">
                    ${item.price}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">{item.designer}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <span className="text-surface-400 dark:text-surface-500 text-sm line-through mr-2">
                        ${item.retailPrice}
                      </span>
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                        Save {Math.round((1 - item.price / item.retailPrice) * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => toast.success(`${item.title} added to your bag!`)}
                      className="btn-primary w-full"
                    >
                      Rent Now
                    </button>
                    <button
                      onClick={() => toast.info(`${item.title} saved to your wishlist`)}
                      className="btn-outline w-full"
                    >
                      Save for Later
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button
              onClick={() => toast.info("Loading more items...")}
              className="btn-outline inline-flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              View More Options
            </button>
          </div>
        </motion.div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
          {error}
        </div>
      )}
    </section>
  );
}