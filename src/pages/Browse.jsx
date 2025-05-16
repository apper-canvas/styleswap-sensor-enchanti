import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const SearchIcon = getIcon('Search');
const HeartIcon = getIcon('Heart');
const ShoppingBagIcon = getIcon('ShoppingBag');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const SlidersIcon = getIcon('SlidersHorizontal');
const ChevronDownIcon = getIcon('ChevronDown');
const FilterIcon = getIcon('Filter');
const SortIcon = getIcon('ArrowUpDown');
const StarIcon = getIcon('Star');
const XCircleIcon = getIcon('XCircle');

export default function Browse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [occasion, setOccasion] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sample data - in a real app, this would come from an API
  const items = [
    {
      id: 1,
      title: "Floral Print Midi Dress",
      designer: "Valentino",
      retailPrice: 2500,
      rentalPrice: 125,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Dresses",
      color: "Pink",
      sizes: ["XS", "S", "M"],
      rating: 4.8
    },
    {
      id: 2,
      title: "Classic Structured Blazer",
      designer: "Saint Laurent",
      retailPrice: 3200,
      rentalPrice: 160,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Business",
      color: "Black",
      sizes: ["S", "M", "L"],
      rating: 4.6
    },
    {
      id: 3,
      title: "Crystal Embellished Clutch",
      designer: "Jimmy Choo",
      retailPrice: 1800,
      rentalPrice: 95,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Accessories",
      color: "Silver",
      sizes: ["One Size"],
      rating: 4.9
    },
    {
      id: 4,
      title: "Tailored Tuxedo Set",
      designer: "Tom Ford",
      retailPrice: 4500,
      rentalPrice: 225,
      image: "https://images.unsplash.com/photo-1598808503746-f34cfb6350ff?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Business",
      color: "Navy",
      sizes: ["M", "L", "XL"],
      rating: 4.7
    },
    {
      id: 5,
      title: "Statement Gold Necklace",
      designer: "Bvlgari",
      retailPrice: 8000,
      rentalPrice: 320,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Accessories",
      color: "Gold",
      sizes: ["One Size"],
      rating: 4.9
    },
    {
      id: 6,
      title: "Sequin Maxi Gown",
      designer: "Elie Saab",
      retailPrice: 6000,
      rentalPrice: 280,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8c6?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Dresses",
      color: "Red",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.8
    },
    {
      id: 7,
      title: "Leather Crossbody Bag",
      designer: "Bottega Veneta",
      retailPrice: 2800,
      rentalPrice: 140,
      image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Accessories",
      color: "Brown",
      sizes: ["One Size"],
      rating: 4.7
    },
    {
      id: 8,
      title: "Silk Wrap Blouse",
      designer: "Gucci",
      retailPrice: 1200,
      rentalPrice: 95,
      image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Tops",
      color: "Green",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.5
    }
  ];

  const categories = [
    "All", "Dresses", "Tops", "Bottoms", "Outerwear", "Accessories", "Shoes", "Jewelry", "Business", "Vacation", "Wedding", "Party", "Formal"
  ];

  const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "One Size"];
  
  const designers = ["Valentino", "Saint Laurent", "Jimmy Choo", "Tom Ford", "Bvlgari", "Elie Saab", "Gucci", "Bottega Veneta"];
  
  const colors = ["Black", "White", "Red", "Blue", "Green", "Pink", "Gold", "Silver", "Brown", "Navy"];

  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" }
  ];

  // Parse URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const occasionParam = params.get('occasion');
    
    if (occasionParam) {
      setOccasion(occasionParam);
      // If occasion is a category, set it as active
      if (categories.map(c => c.toLowerCase()).includes(occasionParam.toLowerCase())) {
        setActiveCategory(occasionParam.charAt(0).toUpperCase() + occasionParam.slice(1));
      }
      toast.info(`Showing items for ${occasionParam} occasions`);
    }
  }, [location.search]);
  
  // Clear occasion filter
  const clearOccasionFilter = () => {
    setOccasion('');
    navigate('/browse');
    toast.info("Occasion filter cleared");
  };

  // Apply filters and sorting
  const filteredItems = items.filter(item => {
    // Filter by search query
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.designer.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }

    // Filter by occasion (if not already filtered by category)
    if (occasion && activeCategory === 'All') {
      const occasionCategory = occasion.charAt(0).toUpperCase() + occasion.slice(1);
      if (item.category !== occasionCategory) return false;
    }
    
    // Filter by price range
    if (item.rentalPrice < priceRange[0] || item.rentalPrice > priceRange[1]) {
      return false;
    }
    
    // Filter by sizes
    if (selectedSizes.length > 0 && !item.sizes.some(size => selectedSizes.includes(size))) {
      return false;
    }
    
    // Filter by designers
    if (selectedDesigners.length > 0 && !selectedDesigners.includes(item.designer)) {
      return false;
    }
    
    // Filter by colors
    if (selectedColors.length > 0 && !selectedColors.includes(item.color)) {
      return false;
    }
    
    return true;
  });

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.rentalPrice - b.rentalPrice;
      case 'priceDesc':
        return b.rentalPrice - a.rentalPrice;
      case 'popular':
        return b.rating - a.rating;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  const toggleSizeFilter = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleDesignerFilter = (designer) => {
    if (selectedDesigners.includes(designer)) {
      setSelectedDesigners(selectedDesigners.filter(d => d !== designer));
    } else {
      setSelectedDesigners([...selectedDesigners, designer]);
    }
  };

  const toggleColorFilter = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setPriceRange([0, 500]);
    setSelectedSizes([]);
    setSelectedDesigners([]);
    setSelectedColors([]);
    setOccasion('');
    setSortBy('newest');
    toast.info("All filters have been cleared");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    toast.info(`Searching for "${searchQuery}"...`);
  };

  const toggleWishlist = (itemId) => {
    // Prevent navigation when clicking the wishlist button
    event.stopPropagation();
    toast.success(`Item added to your wishlist!`);
  };

  const addToBag = (item) => {
    // Prevent navigation when clicking the rent now button
    event.stopPropagation();
    toast.success(`${item.title} added to your bag!`);
  };

  const navigateToItemDetail = (itemId) => {
    navigate(`/item/${itemId}`);
    toast.info('Viewing item details');
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header with navigation - similar to Home page */}
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">StyleSwap</h1>
              </a>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search styles, designers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-surface-100 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
            </form>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <HeartIcon className="w-6 h-6 text-surface-600 dark:text-surface-300" />
              </button>
              <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <ShoppingBagIcon className="w-6 h-6 text-surface-600 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Browse Collection</h1>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex items-center gap-1 text-surface-600 dark:text-surface-300 hover:text-primary"
              >
                <FilterIcon className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <div className="md:hidden">
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1 text-surface-600 dark:text-surface-300"
                >
                  <FilterIcon className="w-5 h-5" />
                  Filters
                </button>
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <SortIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              </div>
            </div>
          </div>
          
          {/* Occasion filter indicator */}
          {occasion && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-surface-600 dark:text-surface-300">
                Filtered by occasion:
              </span>
              <button 
                className="ml-2 flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                onClick={clearOccasionFilter}
              >
                {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Browseable Item Grid - similar structure to the Home page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="card group overflow-hidden"
              onClick={() => navigateToItemDetail(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(item.id)}
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md z-10 cursor-pointer"
                >
                  <HeartIcon className="w-5 h-5 text-surface-700 hover:text-primary" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full inline-block mb-2">
                    {item.category}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); addToBag(item); }}
                    className="btn-primary transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                    className="btn-primary transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-2">{item.designer}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-surface-400 dark:text-surface-500 text-xs line-through">${item.retailPrice} retail</p>
                    <p className="text-primary font-bold">${item.rentalPrice} to rent</p>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-accent mr-1" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No items match your filters</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">Try adjusting your filters or search query</p>
            <button 
              onClick={clearAllFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}