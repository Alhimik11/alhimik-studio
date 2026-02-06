'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Главная' },
    { href: '/services', label: 'Услуги' },
    { href: '/portfolio', label: 'Портфолио' },
    { href: '/about', label: 'О нас' },
    { href: '/contact', label: 'Контакты' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.png"
                alt="Alhimik Studio"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">
              Alhimik Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-accent-400 transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-500 to-primary-500 transition-all group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Связаться
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-accent-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-white font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Связаться
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
