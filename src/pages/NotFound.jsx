import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const HomeIcon = getIcon('Home');
const FrownIcon = getIcon('Frown');

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <FrownIcon className="w-24 h-24 mx-auto mb-6 text-primary" />
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          Oops! The fashion piece you're looking for seems to have gone out of style.
        </p>
        
        <Link 
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}