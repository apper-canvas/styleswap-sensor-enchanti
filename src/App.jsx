import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Browse from './pages/Browse';
import CreateListing from './pages/CreateListing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import getIcon from './utils/iconUtils';
import ShoppingBag from './pages/ShoppingBag';
import ItemDetail from './pages/ItemDetail';
import Checkout from './pages/Checkout';
import { getUserByEmail } from './services/userService';

const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');
const UserIcon = getIcon('User');
const ChevronDownIcon = getIcon('ChevronDown');

// Create authentication context
export const AuthContext = createContext({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  logout: () => {}
});

// Create context for user roles (extended with authentication info)
export const UserContext = createContext({
  roles: [],
  activeRole: '',
  setActiveRole: () => {},
  isLoggedIn: false,
  user: null
});

// Create context for shopping bag
export const ShoppingBagContext = createContext({
  bagItems: [],
  addToBag: () => {},  
  removeBagItem: () => {},
  clearBag: () => {},
  getBagCount: () => 0
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

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
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  
  // State for dark/light mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || (
      !savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  
  // Authentication initialization state
  const [isInitialized, setIsInitialized] = useState(false);

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

  // User role management (enhanced with authentication)
  const [roles, setRoles] = useState(() => {
    return userState?.user?.roles || [];
  });
  
  const [activeRole, setActiveRole] = useState(userState?.user?.active_role || roles[0] || '');
  
  // Update roles and activeRole when user changes
  useEffect(() => {
    if (userState?.user) {
      setRoles(userState.user.roles || []);
      setActiveRole(userState.user.active_role || userState.user.roles?.[0] || '');
    } else {
      setRoles([]);
      setActiveRole('');
    }
  }, [userState?.user]);

  // Initialize ApperUI for authentication
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    // Initialize ApperClient
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Setup authentication
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: async function(user) {
        // CRITICAL: Exact currentPath logic for proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
          '/callback') || currentPath.includes('/error');

        if (user) {
          // User is authenticated
          try {
            // Get user data from database to retrieve roles
            const dbUser = await getUserByEmail(user.emailAddress);
            
            // Add roles from database to user object
            const enrichedUser = {
              ...user,
              roles: dbUser?.roles || ['renter'],
              active_role: dbUser?.active_role || 'renter'
            };
            
            // Store user in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(enrichedUser))));
            
            // Navigate based on redirection rules
            if (redirectPath) {
              navigate(redirectPath);
            } else if (!isAuthPage) {
              if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                navigate(currentPath);
              } else {
                navigate('/');
              }
            } else {
              navigate('/');
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
            navigate('/');
          }
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
              ? `/signup?redirect=${currentPath}`
              : currentPath.includes('/login')
              ? `/login?redirect=${currentPath}`
              : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
        
        setIsInitialized(true);
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
        dispatch(clearUser());
      }
    });
  }, [dispatch, navigate]);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Authentication methods for context
  const authMethods = useMemo(() => ({
    isInitialized,
    isAuthenticated: !!userState?.user,
    user: userState?.user,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  }), [isInitialized, userState?.user, dispatch, navigate]);

  // If not initialized yet, show a loading screen
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-300">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (    
    <AuthContext.Provider value={authMethods}>
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
          isLoggedIn: !!userState?.user,
          user: userState?.user
        }}>
          <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
            {/* Role Switcher - visible on all pages if logged in */}
            {userState?.user && (
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
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/bag" element={<ShoppingBag />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </UserContext.Provider>
      </ShoppingBagContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;