import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Browse from './pages/Browse';
import CreateListing from './pages/CreateListing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import getIcon from './utils/iconUtils';
import ShoppingBag from './pages/ShoppingBag';
import ItemDetail from './pages/ItemDetail';

const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');
const UserIcon = getIcon('User');
const ChevronDownIcon = getIcon('ChevronDown');

// Create context for user roles
export const UserContext = createContext({  
  roles: [],
  activeRole: '',
  setActiveRole: () => {},
  isLoggedIn: false
});

// Create context for shopping bag
export const ShoppingBagContext = createContext({
  bagItems: [],
  addToBag: () => {},
  removeBagItem: () => {},
  clearBag: () => {},
  getBagCount: () => 0,
  isLoggedIn: false
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Role Switcher Component
function RoleSwitcher() {
  const { roles, activeRole, setActiveRole } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // If user only has one role, don't show the switcher
  if (roles.length <= 1) return null;
  
  return (
    <div className="relative">
      <button 
        className="flex items-center text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <UserIcon className="w-5 h-5 mr-1" />
        <span className="capitalize mr-1">{activeRole}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>
      
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-700 rounded-md shadow-lg py-1 z-50">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => { setActiveRole(role); setDropdownOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-sm capitalize ${activeRole === role ? 'bg-surface-100 dark:bg-surface-600 text-primary' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'}`}
            >
              {role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || (
      !savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Shopping bag state management
  const [bagItems, setBagItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shoppingBag')) || [];
    } catch (error) {
      return [];
    }
  });

  // Update localStorage when bag changes
  useEffect(() => {
    localStorage.setItem('shoppingBag', JSON.stringify(bagItems));
  }, [bagItems]);

  
  // User role management
  const [roles, setRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userRoles')) || [];
    } catch (error) {
      return [];
    }
  });
  
  const [activeRole, setActiveRole] = useState(() => {
    return roles[0] || '';
  });
  
  // Check if user is logged in (has roles)
  const isLoggedIn = roles.length > 0;

  // Shopping bag functions
  const addToBag = (item) => {
    setBagItems(prevItems => {
      // Check if item already exists in bag
      const existingItemIndex = prevItems.findIndex(i => 
        i.id === item.id && i.size === item.size
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = item;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  const removeBagItem = (itemId, size) => {
    setBagItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.size === size)));
  };

  const clearBag = () => setBagItems([]);

  const getBagCount = () => {
    return bagItems.length;
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Update active role when roles change
  useEffect(() => {
    if (roles.length > 0 && !roles.includes(activeRole)) {
      setActiveRole(roles[0]);
    }
  }, [roles, activeRole]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (    
    <ShoppingBagContext.Provider value={{
      bagItems,
      addToBag,
      removeBagItem,
      clearBag,
      getBagCount
    }}>
      <UserContext.Provider value={{ 
        roles, 
        activeRole, 
        setActiveRole,
        isLoggedIn
      }}>
        <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
        {/* Role Switcher - visible on all pages if logged in */}
        {isLoggedIn && (
          <div className="fixed top-6 right-20 z-50">
            <RoleSwitcher />
          </div>
        )}
        
        <button
          aria-label="Toggle dark mode"
          className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 shadow-soft hover:bg-surface-300 dark:hover:bg-surface-600 transition-all"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-surface-600" />
          )}
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/bag" element={<ShoppingBag />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastStyle={{
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
          }}
        />
        </div>
      </UserContext.Provider>
    </ShoppingBagContext.Provider>
  );
}

export default App;