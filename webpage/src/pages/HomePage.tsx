import image from '../assets/image.png'; // Adjust the path as necessary
import { Link, redirect} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, FileText, CheckCircle, X } from 'lucide-react';

// Sample resume data (replace with your actual data)
const resumeTemplates = {
    tech: [
        { id: 'tech1', title: 'Technical Resume 1', description: 'For software engineers.', imageUrl: image, redirectUrl: '/jake' },
        { id: 'tech2', title: 'Technical Resume 2', description: 'Clean layout for developers.', imageUrl: image },
        { id: 'tech2', title: 'Technical Resume 2', description: 'Clean layout for developers.', imageUrl: image },
    ],
    fresh: [
        { id: 'fresh1', title: 'Fresher Resume 1', description: 'Entry-level professionals.', imageUrl: image },
        { id: 'fresh2', title: 'Fresher Resume 2', description: 'For recent graduates.', imageUrl: image },
    ],
    photo: [
        { id: 'photo1', title: 'Resume with Photo 1', description: 'Photo on the left.', imageUrl: image },
        { id: 'photo2', title: 'Resume with Photo 2', description: 'Photo at the top.', imageUrl: image },
    ],
};

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    hover: { scale: 1.01,  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.08)" },
    tap: { scale: 0.99 },
};

// Parallax effect component
const Parallax = ({ children, offset = 50 }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrollY = window.scrollY;
                ref.current.style.transform = `translateY(${scrollY * (offset / 100)}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    return (
        <div ref={ref} style={{ willChange: 'transform' }}>
            {children}
        </div>
    );
};

const ResumeCatalog = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';        // Allow scrolling again
    };

    return (
        <>
            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="mt-20 space-y-16"
            >
                {Object.entries(resumeTemplates).map(([category, templates]) => (
                    <div key={category} className="w-full">
                        <h2 className="text-2xl font-semibold text-white mb-8 tracking-tight text-center">
                            {category.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </h2>
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                                {templates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800
                                                    transition-all duration-300 group">
                                            <div
                                                className="relative aspect-[3/4] w-full cursor-pointer" // Added cursor-pointer
                                                onClick={() => openModal(template.imageUrl)} // Added onClick
                                            >
                                                <img
                                                    src={template.imageUrl}
                                                    alt={template.title}
                                                    className="object-cover w-full h-full rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{template.title}</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">{template.description}</p>
                                                <div className="mt-6">
                                                    <a
                                                        href={template.redirectUrl || '#'}
                                                        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white
                                                                rounded-xl text-center inline-block transition-all duration-300
                                                                font-medium border border-white/10 backdrop-blur-md"
                                                    >
                                                        Use Template
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                        onClick={closeModal} // Added onClick to close modal
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
                        >
                            <img
                                src={selectedImage}
                                alt="Full Screen"
                                className="max-h-screen max-w-screen rounded-xl shadow-2xl"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute top-1 right-[-4rem] rounded-full opacity-100 bg-white text-white p-10
                                            hover:bg-black/70 hover:opacity-70  transition-opacity duration-200 z-10"
                            >
                                <X className="h-6 w-6 rounded" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const LandingPage = () => {
    const fontClass = "font-sans";

    const scrollToCatalog = () => {
        const catalogElement = document.querySelector('.mt-20');
        if (catalogElement) {
            catalogElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
            <div className="relative container mx-auto px-4 py-12 z-10">
                <Parallax offset={-10}>
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="text-center"
                    >
                        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                            Overleaf is the industry standard <br/> of professional resumes,
                            <span className="block text-gray-400 mt-2 font-normal text-xl">But it's so damn complicated.</span>
                        </h1>
                        <p className="text-2xl text-green-400 mt-6 font-medium tracking-tight">So we made it simple.</p>

                        <div className="mt-16 flex justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8  text-left w-full max-w-7xl">
                                <div
                                    className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md cursor-pointer transition-all hover:scale-105"
                                    onClick={scrollToCatalog}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <Rocket className="w-6 h-6 text-green-400" />
                                        <h3 className="text-lg font-semibold text-white">1. Choose Template</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">Select from our ATS-friendly resume templates.</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                                     <div className="flex items-center gap-4 mb-4">
                                        <FileText className="w-6 h-6 text-blue-400" />
                                        <h3 className="text-lg font-semibold text-white">2. Fill Details</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">Easily input your information.</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                                    <div className="flex items-center gap-4 mb-4">
                                        <CheckCircle className="w-6 h-6 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-white">3. Get Resume</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">Download your ready-to-use resume.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Parallax>

                <ResumeCatalog />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <div className="min-h-screen bg-gray-950 overflow-hidden w-[100vw]">
            <LandingPage />
        </div>
    )
};

export default App;

