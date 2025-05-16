import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ShoppingBagContext } from '../App';
import getIcon from '../utils/iconUtils';

const HeartIcon = getIcon('Heart');
const ArrowLeftIcon = getIcon('ArrowLeft');
const ShoppingBagIcon = getIcon('ShoppingBag');
const StarIcon = getIcon('Star');
const CheckIcon = getIcon('Check');
const CalendarIcon = getIcon('Calendar');
const CircleIcon = getIcon('Circle');
const ShareIcon = getIcon('Share');
const ZoomInIcon = getIcon('ZoomIn');
const ZoomOutIcon = getIcon('ZoomOut');
const XIcon = getIcon('X');
const ChevronLeftIcon = getIcon('ChevronLeft');
const ChevronRightIcon = getIcon('ChevronRight');

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBag: addItemToBag, getBagCount } = useContext(ShoppingBagContext);
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

    // Create an item object with selected options
    const bagItem = {
      id: item.id,
      title: item.title,
      designer: item.designer,
      price: item.rentalPrice,
      image: item.images[0],
      color: item.color,
      size: selectedSize,
      rentalDays: rentalDays,
      addedAt: new Date().toISOString()
    };
    
    // Add to global bag context
    addItemToBag(bagItem);
    
    // Show success message
    toast.success(`${item.title} (${selectedSize}) added to your bag!`, {
      icon: "🛍️"
    });
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
                <div className="relative">
                  <ShoppingBagIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                  {getBagCount() > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {getBagCount()}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <ImageGallery 
              images={item.images} 
              title={item.title}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
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

function ImageGallery({ images, title, selectedImage, setSelectedImage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef(null);

  useEffect(() => {
    // When the selected thumbnail changes, update the modal image index
    setModalImageIndex(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    // Add keyboard event listener for navigation
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
        case 'Escape':
          closeModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, modalImageIndex]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setModalImageIndex(selectedImage);
    // Reset zoom when opening modal
    setIsZooming(false);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }, [selectedImage]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsZooming(false);
    setZoomLevel(1);
    document.body.style.overflow = ''; // Restore scrolling
  }, []);

  const navigateImage = useCallback((direction) => {
    const newIndex = (modalImageIndex + direction + images.length) % images.length;
    setModalImageIndex(newIndex);
    setSelectedImage(newIndex);
    // Reset zoom when changing images
    setIsZooming(false);
    setZoomLevel(1);
  }, [modalImageIndex, images.length, setSelectedImage]);

  const toggleZoom = useCallback(() => {
    if (isZooming) {
      setIsZooming(false);
      setZoomLevel(1);
    } else {
      setIsZooming(true);
      setZoomLevel(2); // Initial zoom level
    }
  }, [isZooming]);

  const handleMouseMove = useCallback((e) => {
    if (!isZooming || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    
    // Calculate mouse position as percentage of the image dimensions
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Limit the values to prevent showing empty space around the image
    const limitedX = Math.max(0, Math.min(1, x));
    const limitedY = Math.max(0, Math.min(1, y));
    
    setZoomPosition({ x: limitedX, y: limitedY });
  }, [isZooming]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4)); // Max zoom 4x
    setIsZooming(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    const newZoom = zoomLevel - 0.5;
    if (newZoom <= 1) {
      setIsZooming(false);
      setZoomLevel(1);
    } else {
      setZoomLevel(newZoom);
    }
  }, [zoomLevel]);

  return (
    <>
      {/* Main image with click to zoom */}
      <motion.div 
        className="aspect-square overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800 image-zoom-container cursor-pointer"
        onClick={openModal}
        layoutId={`product-image-${selectedImage}`}
      >
        <img 
          src={images[selectedImage]} 
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-3 right-3 p-2 bg-surface-800/70 backdrop-blur-sm rounded-full text-white">
          <ZoomInIcon className="w-5 h-5" />
        </div>
      </motion.div>
      
      {/* Thumbnail Images */}
      <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
        {images.map((image, idx) => (
          <motion.button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
              selectedImage === idx ? 'ring-2 ring-primary' : 'ring-1 ring-surface-200 dark:ring-surface-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={image} 
              alt={`${title} - View ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>

      {/* Modal lightbox */}
      {isModalOpen && (
        <div 
          className="image-gallery-backdrop"
          onClick={closeModal}
        >
          <div 
            className="image-gallery-modal"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-60 p-2 bg-surface-800/70 backdrop-blur-sm rounded-full text-white hover:bg-surface-700"
              onClick={closeModal}
              aria-label="Close image gallery"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-2 bg-surface-800/70 backdrop-blur-sm rounded-full text-white hover:bg-surface-700"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-2 bg-surface-800/70 backdrop-blur-sm rounded-full text-white hover:bg-surface-700"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage(1);
              }}
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
            
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-60 flex space-x-3 p-2 bg-surface-800/70 backdrop-blur-sm rounded-full text-white">
              <button 
                className="p-1 hover:bg-surface-700/50 rounded-full"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                aria-label="Zoom out"
              >
                <ZoomOutIcon className="w-5 h-5" />
              </button>
              
              <button 
                className="p-1 hover:bg-surface-700/50 rounded-full"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                aria-label="Zoom in"
              >
                <ZoomInIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Image container with zoom functionality */}
            <div 
              className={`max-w-full max-h-90vh overflow-hidden ${isZooming ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              ref={imageRef}
            >
              <motion.img 
                src={images[modalImageIndex]} 
                alt={`${title} - View ${modalImageIndex + 1}`}
                className="max-h-90vh max-w-full object-contain"
                style={{ 
                  transform: isZooming ? `scale(${zoomLevel}) translate(${(0.5 - zoomPosition.x) * 100 / zoomLevel}%, ${(0.5 - zoomPosition.y) * 100 / zoomLevel}%)` : 'scale(1)',
                  transition: isZooming ? 'none' : 'transform 0.3s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}