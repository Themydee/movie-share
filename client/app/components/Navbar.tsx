'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800/95 p-4 sticky top-0 z-50 shadow-lg border-b border-accent/30">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-white flex items-center" onClick={closeMobileMenu}>
          🎬 MovieShare
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-300 hover:text-accent transition-colors" onClick={closeMobileMenu}>
            Home
          </Link>
          <Link href="/add-movie" className="text-gray-300 hover:text-accent transition-colors" onClick={closeMobileMenu}>
            Add Movie
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-accent transition-colors" onClick={closeMobileMenu}>
            Profile
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-accent transition-colors" onClick={closeMobileMenu}>
            Login/Register
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-gray-300 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-gray-800/95 border-t border-accent/30 animate-slide-in">
          <ul className="flex flex-col items-center py-4 space-y-4">
            <li>
              <Link href="/" className="text-gray-300 hover:text-accent text-lg transition-colors" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/add-movie" className="text-gray-300 hover:text-accent text-lg transition-colors" onClick={closeMobileMenu}>
                Add Movie
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-gray-300 hover:text-accent text-lg transition-colors" onClick={closeMobileMenu}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gray-300 hover:text-accent text-lg transition-colors" onClick={closeMobileMenu}>
                Login/Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}