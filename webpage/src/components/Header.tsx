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
      className={`fixed  justify-center top-0 left-0   right-0 w-full p-1 flex  items-center z-50 transition-all duration-300 ${scrolled ? 'bg-black/30 backdrop-blur-md text-black' : 'bg-transparent text-white'}`}
    >  
<div className="flex md:flex-1  md:w-5/6 flex-wrap md:flex-row justify-start items-center gap-4 md:gap-6 px-2">
<Link to="/" className="!text-white hover:underline hover:!text-white transition py-0 m-0">
        <img src="/logo.png" alt="logo" className="max-w-10 max-h-10 hover:scale-110 transition-all py-0 ml-2 mt-1 m-0 duration-300 " />
    </Link>
    </div>
    <div className='flex flex-1 w-full md:w-5/6 flex-wrap md:flex-row justify-end items-center gap-4 md:gap-6 px-4'>


<Link to="/#catalog" className="!text-white  transition hover:underline">Catalog</Link>
<Link to="/freshers" className="!text-white  transition hover:underline">For Freshers</Link>
       
    
    <Link to="/tips" className="!text-white  transition hover:underline">Tips</Link>
    <Link to="/about" className="!text-white  transition hover:underline">About</Link>
    </div>      
    </div>
  );
};

export default Header; 