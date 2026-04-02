import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-stone-600">
            Made with <Heart className="w-4 h-4 inline text-red-400" /> for parents everywhere
          </div>
          <div className="text-sm text-stone-500">
            &copy; {new Date().getFullYear()} ClarifyHW. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
