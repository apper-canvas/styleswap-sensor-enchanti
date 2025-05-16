import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const CameraIcon = getIcon('Camera');
const DollarSignIcon = getIcon('DollarSign');
const CalendarIcon = getIcon('Calendar');
const TagIcon = getIcon('Tag');
const TruckIcon = getIcon('Truck');
const InfoIcon = getIcon('Info');

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    designer: '',
    category: '',
    description: '',
    retailPrice: '',
    rentalPrice: '',
    size: '',
    condition: 'Like New',
    color: '',
    availableFrom: '',
    availableTo: '',
    images: [],
    shipping: 'Free',
    tags: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }
    
    // In a real app, you would upload these to a server and get URLs back
    // For demo purposes, we'll create object URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...imageUrls].slice(0, 5)
    });
  };
  
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.designer.trim()) newErrors.designer = 'Designer is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.retailPrice) newErrors.retailPrice = 'Retail price is required';
    if (!formData.rentalPrice) newErrors.rentalPrice = 'Rental price is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    if (!formData.availableFrom) newErrors.availableFrom = 'Available from date is required';
    if (!formData.availableTo) newErrors.availableTo = 'Available to date is required';
    
    // Check if rental price is less than retail price
    if (formData.retailPrice && formData.rentalPrice) {
      if (Number(formData.rentalPrice) >= Number(formData.retailPrice)) {
        newErrors.rentalPrice = 'Rental price must be less than retail price';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your item has been listed successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Error listing your item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <h1 className="text-xl font-bold">List Your Clothes</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Create a New Listing</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Item Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-surface-700 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 pb-2">
                Item Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g. Floral Midi Dress"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="designer" className="block text-sm font-medium mb-1">
                    Designer/Brand *
                  </label>
                  <input
                    type="text"
                    id="designer"
                    name="designer"
                    value={formData.designer}
                    onChange={handleInputChange}
                    className={`input-field ${errors.designer ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g. Valentino"
                  />
                  {errors.designer && <p className="text-red-500 text-sm mt-1">{errors.designer}</p>}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`input-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select a category</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Business">Business</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Casual">Casual</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
                
                <div>
                  <label htmlFor="size" className="block text-sm font-medium mb-1">
                    Size *
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className={`input-field ${errors.size ? 'border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select a size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="Custom">Custom (specify in description)</option>
                  </select>
                  {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Describe your item, including details about fabric, fit, and any special features"
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
            
            {/* Pricing Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-surface-700 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 pb-2">
                Pricing
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="retailPrice" className="block text-sm font-medium mb-1">
                    Retail Price ($) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSignIcon className="h-5 w-5 text-surface-400" />
                    </div>
                    <input
                      type="number"
                      id="retailPrice"
                      name="retailPrice"
                      value={formData.retailPrice}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.retailPrice ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Original retail price"
                    />
                  </div>
                  {errors.retailPrice && <p className="text-red-500 text-sm mt-1">{errors.retailPrice}</p>}
                </div>
                
                <div>
                  <label htmlFor="rentalPrice" className="block text-sm font-medium mb-1">
                    Rental Price ($) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSignIcon className="h-5 w-5 text-surface-400" />
                    </div>
                    <input
                      type="number"
                      id="rentalPrice"
                      name="rentalPrice"
                      value={formData.rentalPrice}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.rentalPrice ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Your rental price"
                    />
                  </div>
                  {errors.rentalPrice && <p className="text-red-500 text-sm mt-1">{errors.rentalPrice}</p>}
                  <p className="text-sm text-surface-500 mt-1 flex items-center">
                    <InfoIcon className="w-4 h-4 mr-1" />
                    Recommended: 4-8% of retail price
                  </p>
                </div>
              </div>
            </div>
            
            {/* Upload Images Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-surface-700 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 pb-2">
                Images *
              </h3>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-4">
                  <label className="w-32 h-32 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    <CameraIcon className="w-8 h-8 text-surface-400 mb-2" />
                    <span className="text-sm text-surface-500">Add Images</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                  
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img 
                        src={image} 
                        alt={`Item image ${index + 1}`} 
                        className="w-32 h-32 object-cover rounded-lg" 
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-surface-800/70 text-white p-1 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                <p className="text-sm text-surface-500 mt-2">
                  Upload up to 5 high-quality images. First image will be the cover.
                </p>
              </div>
            </div>
            
            {/* Availability Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-surface-700 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700 pb-2">
                Availability
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="availableFrom" className="block text-sm font-medium mb-1">
                    Available From *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-surface-400" />
                    </div>
                    <input
                      type="date"
                      id="availableFrom"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.availableFrom ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.availableFrom && <p className="text-red-500 text-sm mt-1">{errors.availableFrom}</p>}
                </div>
                
                <div>
                  <label htmlFor="availableTo" className="block text-sm font-medium mb-1">
                    Available To *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-surface-400" />
                    </div>
                    <input
                      type="date"
                      id="availableTo"
                      name="availableTo"
                      value={formData.availableTo}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.availableTo ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.availableTo && <p className="text-red-500 text-sm mt-1">{errors.availableTo}</p>}
                </div>
              </div>
            </div>
            
            {/* Submission Section */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Listing...' : 'List My Item'}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}