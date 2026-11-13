import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <span className="font-bold text-green-700">FoodShare</span>
            <span className="text-sm text-gray-500 ml-2">Reducing food waste, feeding lives</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/browse" className="hover:text-green-600 transition-colors">Browse Food</Link>
            <Link to="/register" className="hover:text-green-600 transition-colors">Join Us</Link>
            <Link to="/login" className="hover:text-green-600 transition-colors">Login</Link>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} FoodShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

