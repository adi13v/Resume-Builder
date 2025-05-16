import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github } from 'lucide-react';
import Footer from '../components/Footer';

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const AboutPage = () => {
    const fontClass = "font-sans";

    return (
        <div className={`relative min-h-screen bg-gray-950 overflow-hidden ${fontClass}`}>
            {/* Background effects (particles) */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-15 blur-3xl"
                />
                <div
                    className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 opacity-10 blur-3xl"
                />
                <div
                    className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 opacity-10 blur-3xl"
                />
            </div>

            <div className="relative container mx-auto px-4 py-12 z-10 text-white text-center">
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="pt-20"
                >
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">
                        About Me
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Hi there! I'm Aditya Verma a web developer with a passion for building things. Connect with me for collaborations or complaints about the site.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12 ">
                        {/* Email Link */}
                        <a
                            href="mailto:aditya1310v@gmail.com" // Replace with your actual email
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300 border border-white/10 backdrop-blur-md"
                        >
                            <Mail className="w-6 h-6" />
                            <span className="text-lg font-medium">Email Me</span>
                        </a>

                        {/* GitHub Link */}
                        <a
                            href="https://github.com/adi13v"  
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2  px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300 border border-white/10 backdrop-blur-md"
                        >
                            <Github className="w-6 h-6" />
                            <span className="text-lg font-medium">GitHub</span>
                        </a>
                    </div>
                </motion.div>
            </div>
           
        </div>
    );
};

export default AboutPage;
