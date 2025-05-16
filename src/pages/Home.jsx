import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const SearchIcon = getIcon('Search');
const HeartIcon = getIcon('Heart');
const ShoppingBagIcon = getIcon('ShoppingBag');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');
const StarIcon = getIcon('Star');
const TrendingUpIcon = getIcon('TrendingUp');

const DressIcon = getIcon('Dress');
const BriefcaseIcon = getIcon('Briefcase');
const UmbrellaIcon = getIcon('Umbrella');
const GlassesIcon = getIcon('Glasses');
const ShirtIcon = getIcon('Shirt');
const WatchIcon = getIcon('Watch');

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    navigate('/login?tab=register');
  };
  
  const handleRentNow = () => {
    navigate('/browse');
  };

  const featuredItems = [
    {
      id: 1,
      title: "Floral Print Midi Dress",
      designer: "Valentino",
      retailPrice: 2500,
      rentalPrice: 125,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Dresses"
    },
    {
      id: 2,
      title: "Classic Structured Blazer",
      designer: "Saint Laurent",
      retailPrice: 3200,
      rentalPrice: 160,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Business"
    },
    {
      id: 3,
      title: "Crystal Embellished Clutch",
      designer: "Jimmy Choo",
      retailPrice: 1800,
      rentalPrice: 95,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Accessories"
    },
    {
      id: 4,
      title: "Tailored Tuxedo Set",
      designer: "Tom Ford",
      retailPrice: 4500,
      rentalPrice: 225,
      image: "https://images.unsplash.com/photo-1598808503746-f34cfb6350ff?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Business"
    },
    {
      id: 5,
      title: "Statement Gold Necklace",
      designer: "Bvlgari",
      retailPrice: 8000,
      rentalPrice: 320,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Accessories"
    },
    {
      id: 6,
      title: "Sequin Maxi Gown",
      designer: "Elie Saab",
      retailPrice: 6000,
      rentalPrice: 280,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8c6?auto=format&fit=crop&q=80&w=500&h=600",
      category: "Dresses"
    },
  ];
  
  const categories = [
    { id: 'dresses', name: 'Dresses', icon: DressIcon },
    { id: 'business', name: 'Business', icon: BriefcaseIcon },
    { id: 'vacation', name: 'Vacation', icon: UmbrellaIcon },
    { id: 'accessories', name: 'Accessories', icon: GlassesIcon },
    { id: 'casual', name: 'Casual', icon: ShirtIcon },
    { id: 'luxury', name: 'Luxury', icon: WatchIcon },
  ];

  const filteredItems = searchQuery
    ? featuredItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.designer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory === 'All'
      ? featuredItems
      : featuredItems.filter(item => 
          item.category.toLowerCase() === activeCategory.toLowerCase()
        );

  const handleSearch = (e) => {
    e.preventDefault();
    toast.info(`Searching for "${searchQuery}"...`);
  };

  const toggleWishlist = (itemId) => {
    toast.success(`Item added to your wishlist!`);
  };

  const addToBag = (item) => {
    toast.success(`${item.title} added to your bag!`);
  };

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">StyleSwap</h1>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-surface-600 hover:text-primary">Women</a>
              <a href="#" className="text-surface-600 hover:text-primary">Men</a>
              <a href="#" className="text-surface-600 hover:text-primary">Designers</a>
              <a href="#" className="text-surface-600 hover:text-primary">Occasions</a>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48 rounded-full bg-surface-100 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
              </form>
            </nav>
            
            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <HeartIcon className="w-6 h-6 text-surface-600 dark:text-surface-300" />
              </button>
              <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <ShoppingBagIcon className="w-6 h-6 text-surface-600 dark:text-surface-300" />
              </button>
              <button className="btn-primary">List Your Items</button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                {mobileMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-surface-800 shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">Women</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">Men</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">Designers</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">Occasions</a>
              <form onSubmit={handleSearch} className="mt-3 mb-2">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search styles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-100 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
                </div>
              </form>
              <div className="flex items-center justify-between pt-2">
                <button className="flex items-center px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                  <HeartIcon className="w-5 h-5 mr-2" />
                  <span>Wishlist</span>
                </button>
                <button className="flex items-center px-3 py-2 rounded-md text-base font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  <span>Bag</span>
                </button>
              </div>
              <button className="w-full mt-3 btn-primary">List Your Items</button>
            </div>
          </div>
        )}
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 z-10"></div>
          <div className="h-[80vh] md:h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070&h=1080)' }}></div>
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Rent Designer Fashion for Any Occasion</h1>
                <p className="text-xl text-white/90 mb-8">Access high-end fashion without the high-end price tag.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleRentNow} className="btn bg-white text-primary hover:bg-surface-100 px-8 py-3 text-lg">
                    Rent Now
                  </button>
                  <button onClick={handleSignUp} className="btn bg-primary text-white hover:bg-primary-dark px-8 py-3 text-lg">
                    Sign Up
                  </button>
                  <button className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                    List Your Clothes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Feature */}
        <MainFeature />
        
        {/* Category Tabs */}
        <section className="py-10 bg-surface-100 dark:bg-surface-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Shop by Category</h2>
            
            <div className="flex items-center justify-start md:justify-center overflow-x-auto scrollbar-hide space-x-2 pb-4">
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === 'All'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
                onClick={() => setActiveCategory('All')}
              >
                All Items
              </button>
              
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
                      activeCategory === category.name
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <CategoryIcon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
            
            {/* Featured Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="card group overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md z-10"
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
                        onClick={() => addToBag(item)}
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
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">How StyleSwap Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Browse & Book</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Explore thousands of designer items and book your favorites for your event dates.
                </p>
              </div>
              
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                  <ShoppingBagIcon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Wear & Enjoy</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Receive your items clean and ready to wear. Make a statement without commitment.
                </p>
              </div>
              
              <div className="text-center px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUpIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Return & Repeat</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Simply return your items using our prepaid shipping label. No cleaning necessary!
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-2">15K+</p>
                <p className="text-sm uppercase tracking-wider">Designer Items</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-2">85%</p>
                <p className="text-sm uppercase tracking-wider">Cost Savings</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-2">25K+</p>
                <p className="text-sm uppercase tracking-wider">Happy Renters</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-2">18T</p>
                <p className="text-sm uppercase tracking-wider">CO2 Saved</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Sophia Chen</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={`sophia-star-${i}`} className="w-4 h-4 text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-surface-600 dark:text-surface-400">
                  "StyleSwap made it possible for me to wear a designer gown to my sister's wedding that I could never afford to buy. The service was seamless!"
                </p>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Marcus Johnson</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={`marcus-star-${i}`} className={`w-4 h-4 ${i < 4 ? 'text-accent' : 'text-surface-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-surface-600 dark:text-surface-400">
                  "As someone who needs to attend formal events regularly, StyleSwap has saved me thousands of dollars while allowing me to never repeat outfits."
                </p>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/68.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Olivia Rodriguez</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={`olivia-star-${i}`} className="w-4 h-4 text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-surface-600 dark:text-surface-400">
                  "I'm making extra income from my designer clothes that were just sitting in my closet. The platform is so easy to use and the customer service is excellent."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="py-12 bg-surface-100 dark:bg-surface-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay in Style</h2>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Subscribe to our newsletter for trend alerts, special offers, and new arrivals.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow input-field"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-surface-800 dark:bg-surface-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StyleSwap</h3>
              <p className="text-surface-300 mb-4">
                Redefining fashion consumption through rental, allowing you to wear high-end fashion sustainably.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-surface-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  {/* Facebook Icon */}
                </a>
                <a href="#" className="text-surface-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  {/* Instagram Icon */}
                </a>
                <a href="#" className="text-surface-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  {/* Twitter Icon */}
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-surface-300 hover:text-white">Women</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Men</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Accessories</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">New Arrivals</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Designers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-surface-300 hover:text-white">Our Story</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Sustainability</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Press</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-surface-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Shipping & Returns</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-surface-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-surface-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} StyleSwap. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-surface-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-surface-400 hover:text-white text-sm">Terms of Service</a>
                <a href="#" className="text-surface-400 hover:text-white text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}