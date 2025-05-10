import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SCROLL_BREAKPOINT = 40; // px, adjust as needed

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_BREAKPOINT);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed  justify-center top-0 left-0   right-0 w-full p-5 flex  items-center z-50 transition-all duration-300 ${scrolled ? 'bg-black/30 backdrop-blur-md text-black' : 'bg-transparent text-white'}`}
    >  
<div className="flex w-full md:w-5/6 flex-wrap md:flex-row justify-evenly gap-4 md:gap-6 px-2">
<Link to="/jake" className="!text-white hover:underline hover:!text-white transition">Blog</Link>
    <Link to="/jake" className="!text-white hover:underline hover:!text-white transition">Categories</Link>
    <Link to="/" className="!text-white hover:underline hover:!text-white transition">
        <img src="/logo.png" alt="logo" className="max-w-8 max-h-8  hover:scale-110 transition-all duration-300" />
    </Link>
    <Link to="/photo" className="!text-white hover:underline hover:!text-white transition">Resume Tips</Link>
    <Link to="/photo" className="!text-white hover:underline hover:!text-white transition">About</Link>
    </div>      
    </div>
  );
};

export default Header; 