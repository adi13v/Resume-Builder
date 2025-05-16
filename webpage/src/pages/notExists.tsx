import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react'; // Using AlertTriangle for error indication

// Animation variants (can be reused or simplified)
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const NotFoundPage = () => {
  const fontClass = "font-sans"; // Assuming 'Inter' or a similar sans-serif font is loaded globally or via Tailwind config

  // Function to navigate to homepage (replace with your actual router logic if using one)
  const goToHome = () => {
    window.location.href = '/'; // Simple redirect, adjust if using React Router
  };

  return (
    <div className={`relative min-h-screen bg-gray-950 overflow-hidden ${fontClass} flex flex-col items-center justify-center p-4 text-center`}>
      {/* Background decorative elements (similar to the landing page) */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-15 blur-3xl animate-pulse"
          style={{ animationDuration: '5s' }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 opacity-10 blur-3xl animate-pulse"
          style={{ animationDuration: '7s' }}
        />
         <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 opacity-15 blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
      </div>

      {/* Content container */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center"
      >
        {/* Icon */}
        <AlertTriangle className="w-24 h-24 text-yellow-400 mb-8" />

        {/* 404 Title */}
        <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">
          404
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6">
          Page Not Found
        </p>

        {/* Description */}
        <p className="text-md md:text-lg text-gray-400 mb-10 max-w-md">
          Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or maybe you just mistyped the URL.
        </p>

        {/* Go Home Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(255, 255, 255, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={goToHome}
          className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white
                     rounded-xl text-lg font-medium border border-white/20 backdrop-blur-md
                     transition-all duration-300 shadow-lg"
        >
          <Home className="w-5 h-5" />
          Go to Homepage
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
