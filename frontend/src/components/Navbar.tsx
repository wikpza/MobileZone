// import { Button } from "@/components/ui/button";
// import { User, Menu, X } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
//
// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//
//   return (
//     <nav className="fixed top-0 w-full z-50 glass-card">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex-shrink-0">
//             <Link to="/" className="text-2xl font-bold text-gradient">
//               MobileZone
//             </Link>
//           </div>
//
//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/" className="text-gray-300 hover:text-white px-3 py-2">
//               Index
//             </Link>
//             <Link to="/products" className="text-gray-300 hover:text-white px-3 py-2">
//               Products
//             </Link>
//             <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2">
//               Admin
//             </Link>
//             <Link to="/profile" className="text-gray-300 hover:text-white px-3 py-2">
//               Profile
//             </Link>
//             <Button variant="secondary" className="hover-glow" asChild>
//               <Link to="/login">
//                 <User className="mr-2 h-4 w-4" />
//                 Login
//               </Link>
//             </Button>
//           </div>
//
//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <Button
//               variant="ghost"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="inline-flex items-center justify-center p-2"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>
//
//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Link
//                 to="/"
//                 className="block text-gray-300 hover:text-white px-3 py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Index
//               </Link>
//               <Link
//                 to="/products"
//                 className="block text-gray-300 hover:text-white px-3 py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Products
//               </Link>
//               <Link
//                 to="/admin"
//                 className="block text-gray-300 hover:text-white px-3 py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Admin
//               </Link>
//               <Link
//                 to="/profile"
//                 className="block text-gray-300 hover:text-white px-3 py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Profile
//               </Link>
//               <Link
//                 to="/login"
//                 className="block text-gray-300 hover:text-white px-3 py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <Button variant="secondary" className="w-full hover-glow">
//                   <User className="mr-2 h-4 w-4" />
//                   Login
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <nav className="fixed top-0 w-full z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gradient">
                MobileZone
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Products
              </Link>
              <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Admin
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Profile
              </Link>
              <Button variant="outline" className="hover-glow border-gray-200" asChild>
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                  variant="ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 text-gray-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                      to="/"
                      className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                      to="/products"
                      className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                      to="/admin"
                      className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <Link
                      to="/profile"
                      className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                      to="/login"
                      className="block px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full hover-glow border-gray-200">
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
          )}
        </div>
      </nav>
  );
}