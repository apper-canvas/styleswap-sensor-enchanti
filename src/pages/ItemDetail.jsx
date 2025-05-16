import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const HeartIcon = getIcon('Heart');
const ArrowLeftIcon = getIcon('ArrowLeft');
const ShoppingBagIcon = getIcon('ShoppingBag');
const StarIcon = getIcon('Star');
const CheckIcon = getIcon('Check');
const CalendarIcon = getIcon('Calendar');
const CircleIcon = getIcon('Circle');
const ShareIcon = getIcon('Share');

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalDays, setRentalDays] = useState(4);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Sample data - in a real app, this would come from an API
  const items = [
    {
      id: 1,
      title: "Floral Print Midi Dress",
      designer: "Valentino",
      retailPrice: 2500,
      rentalPrice: 125,
      description: "A stunning floral print midi dress from Valentino's Spring collection. Features a flattering A-line silhouette, V-neckline, and delicate floral pattern throughout. Perfect for weddings, garden parties, or upscale brunches.",
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=500&h=600",
        "https://images.unsplash.com/photo-1623580675622-fe753c22cefe?auto=format&fit=crop&q=80&w=500&h=600",
        "https://images.unsplash.com/photo-1596239880869-9a66fce17baa?auto=format&fit=crop&q=80&w=500&h=600"
      ],
      category: "Dresses",
      color: "Pink",
      colors: ["Pink", "Blue", "White"],
      sizes: ["XS", "S", "M"],
      availableDates: ["2023-06-15", "2023-06-20"],
      rating: 4.8,
      reviews: 24,
      occasionTags: ["Wedding", "Party", "Date Night"],
      specifications: [
        { name: "Material", value: "100% Silk" },
        { name: "Care", value: "Dry Clean Only" },
        { name: "Length", value: "Midi" }
      ]
    },
    {
      id: 2,
      title: "Classic Structured Blazer",
      designer: "Saint Laurent",
      retailPrice: 3200,
      rentalPrice: 160,
      description: "A timeless black structured blazer from Saint Laurent. Features a slim fit, notched lapels, and single-button closure. Perfect for business meetings, formal events, or dressed down with jeans for a casual-chic look.",
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500&h=600",
        "https://images.unsplash.com/photo-1590756254933-2873d72e0641?auto=format&fit=crop&q=80&w=500&h=600",
        "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=500&h=600"
      ],
      category: "Business",
      color: "Black",
      colors: ["Black", "Navy"],
      sizes: ["S", "M", "L"],
      availableDates: ["2023-06-10", "2023-06-25"],
      rating: 4.6,
      reviews: 18,
      occasionTags: ["Business", "Formal", "Evening"],
      specifications: [
        { name: "Material", value: "Wool Blend" },
        { name: "Care", value: "Dry Clean Only" },
        { name: "Fit", value: "Slim" }
      ]
    }
  ];

  // Related items based on category and designer
  const relatedItems = items.filter(i => i.id.toString() !== id.toString()).slice(0, 3);

  useEffect(() => {
    // Simulate API call to fetch item details
    setLoading(true);
    const foundItem = items.find(item => item.id.toString() === id.toString());
    
    // Check if item is in wishlist
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const isItemInWishlist = wishlistItems.includes(parseInt(id));
    
    setTimeout(() => {
      if (foundItem) {
        setItem(foundItem);
        setSelectedSize(foundItem.sizes[0]);
        setIsInWishlist(isItemInWishlist);
      } else {
        setIsInWishlist(false);
        toast.error("Item not found");
        navigate('/browse');
      }
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [id, navigate]);

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    if (!isInWishlist) {
      toast.success(`${item.title} added to your wishlist!`);
    } else {
      toast.info(`${item.title} removed from your wishlist`);
    }
  };

  const addToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    
    toast.success(`${item.title} added to your bag!`);
  };

  };

  const rentNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    
    toast.success(`Proceeding to checkout for ${item.title}`);
    // In a real app, navigate to checkout page
  };

  const handleShare = () => {
    toast.success("Share link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <button 
          onClick={() => navigate('/browse')}
          className="btn-primary"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/browse')}
                className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <ArrowLeftIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">StyleSwap</h1>
              </a>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <ShareIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
              <button onClick={toggleWishlist} className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-surface-600 dark:text-surface-300'}`} />
              </button>
              <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <ShoppingBagIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
              <img 
                src={item.images[selectedImage]} 
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {item.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden ${selectedImage === idx ? 'ring-2 ring-primary' : 'ring-1 ring-surface-200 dark:ring-surface-700'}`}
                >
                  <img 
                    src={image} 
                    alt={`${item.title} - View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="text-lg text-surface-600 dark:text-surface-400">{item.designer}</p>
              
              <div className="flex items-center mt-2 mb-4">
                <div className="flex items-center mr-2">
                  <StarIcon className="w-4 h-4 text-accent" />
                  <span className="ml-1 text-sm font-medium">{item.rating}</span>
                </div>
                <span className="text-sm text-surface-500">({item.reviews} reviews)</span>
              </div>
              
              <div className="flex items-baseline space-x-3 mb-6">
                <p className="text-2xl font-bold text-primary">${item.rentalPrice}</p>
                <p className="text-surface-500 line-through text-sm">
                  ${item.retailPrice} retail
                </p>
                <span className="px-2 py-1 text-xs font-semibold bg-accent/10 text-accent rounded-full">
                  {Math.round((1 - (item.rentalPrice / item.retailPrice)) * 100)}% off
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-surface-600 dark:text-surface-400">{item.description}</p>
            </div>
            
            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-2">Color: <span className="text-primary">{item.color}</span></h3>
              <div className="flex space-x-2">
                {item.colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      color === item.color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  >
                    {color === item.color && <CircleIcon className="w-5 h-5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Size</h3>
                <button className="text-sm text-primary">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-md flex items-center justify-center border ${
                      selectedSize === size 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-surface-200 dark:border-surface-700 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Rental Period */}
            <div>
              <h3 className="font-medium mb-2">Rental Period</h3>
              <div className="flex items-center space-x-4 bg-surface-100 dark:bg-surface-800 p-3 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">4-day rental</div>
                  <div className="text-sm text-surface-500">Return by mail with prepaid label</div>
                </div>
              </div>
            </div>
            
            {/* Specifications */}
            <div>
              <h3 className="font-medium mb-2">Specifications</h3>
              <ul className="space-y-1 text-sm">
                {item.specifications.map((spec, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="text-surface-500">{spec.name}</span>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={addToBag}
                className="btn border-2 border-primary text-primary hover:bg-primary/10 flex-1"
              >
                Add to Bag
              </button>
              <button 
                onClick={rentNow}
                className="btn-primary flex-1"
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
        
        {/* You might also like section */}
        <div className="mt-20">
          <h2 className="text-xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Related items would go here */}
          </div>
        </div>
      </main>
    </div>
  );
}