import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
    };

    return (
        <motion.footer
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900 py-8 border-t border-gray-800"
        >
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center mb-6 space-x-6">
                    <a
                        href="https://github.com/your-github-profile"  // Replace with actual GitHub profile
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="w-6 h-6" />
                    </a>
                    <a
                        href="mailto:your-email@example.com" // Replace with actual email
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Email"
                    >
                        <Mail className="w-6 h-6" />
                    </a>
                   
                    
                </div>
                <p className="text-gray-400 text-sm">
                    &copy; {currentYear} Resume Builder. All rights reserved.
                </p>
                
                <p className="text-gray-500 text-s mt-2">
                    Thanks to the creators who provided templates for the site: <a href="/credits" className="text-blue-400 hover:text-blue-500">Credits</a>
                </p>
            </div>
        </motion.footer>
    );
};

export default Footer;
