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
      className={` flex fixed  justify-center top-0 left-0   right-0 w-full p-1   items-center z-50 transition-all duration-300 ${scrolled ? 'bg-black/30 backdrop-blur-md text-black md:gap-10 gap-6' : 'bg-transparent md:gap-15 gap-8 text-white'}`}
    >  





<Link to="/freshers" className="!text-white  transition hover:underline">For Freshers</Link>
<Link to="/" className="!text-white hover:underline hover:!text-white transition p-0 m-0">
        <img src="/logo.png"  alt="logo" className="max-w-10 object-fill  max-h-10  hover:scale-110 transition-all  ml-2 mt-1 m-0 duration-300 " />
    </Link>    
    <Link to="/#catalog" className="!text-white  transition hover:underline">Catalog</Link>

    <Link to="/tips" className="!text-white  transition hover:underline">Tips</Link>
    <Link to="/about" className="!text-white  transition hover:underline">About</Link>
    </div>      
  
  );
};

export default Header; 