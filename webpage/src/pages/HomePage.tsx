import jakeWithGrade from '../assets/photos/Jake_Resume_With_Grade_page-0001.jpg';
import nitWithPhoto from '../assets/photos/NIT-Resume-With-Photo_page-0001.jpg';
import nitWithoutPhoto from '../assets/photos/NIT-Resume-Without-Photo_page-0001.jpg';
import resumeWithPhoto from '../assets/photos/Resume_with_photo_page-0001.jpg';
import resumeWithPhotoDisabled from '../assets/photos/Resume_with_photo_Photo_Disabled_page-0001.jpg';
import nitWithLogo from '../assets/photos/Nit-Resume-With-Logo_page-0001.jpg';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, FileText, CheckCircle } from 'lucide-react';
import FAQSection from '../components/faq-accordion';
import Footer from '../components/Footer';

// Sample resume data (replace with your actual data)
const resumeTemplates = {
    Popular: [
        { id: 'tech1', title: 'Classic Jake\'s Resume', description: 'Our Most Popular Pick. Popularised by the name of Jake\'s Resume', imageUrl: jakeWithGrade, redirectUrl: '/jake' },
        { id: 'tech2', title: 'Education in Tabular', description: 'Clean Resume for those wanting to highlight their academics', imageUrl: nitWithoutPhoto, redirectUrl: '/nit-without-photo' },
        { id: 'tech3', title: 'Less is More', description: 'Works best for those who don\'t have much content', imageUrl: resumeWithPhotoDisabled, redirectUrl: '/photo-disabled' },
    ],
   
    photo: [
        { id: 'photo1', title: 'Resume with Photo 1', description: 'Clean,Minimal and has circular photo, similar in format to Jake\'s Resume', imageUrl: resumeWithPhoto, redirectUrl: '/photo' },
        { id: 'photo2', title: 'Resume with Photo 2', description: 'Resume with photo, preferred by those with strong academics', imageUrl: nitWithPhoto, redirectUrl: '/nit-with-logo' },
    ],
    CollegeLogo: [
        { id: 'fresh1', title: 'Resume With Logo', description: 'Preferred for on-campus interviews and for prestigious colleges', imageUrl: nitWithLogo, redirectUrl: '/nit-with-logo' },
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
const Parallax = ({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) => {
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
                                               
                                            >
                                                <img
                                                    loading='lazy'
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
                        <h1 className="text-5xl mt-15 font-bold text-white mb-4 tracking-tight">
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
                <FAQSection />
            </div>
        </div>
    );
};

const HomePage = () => {

    return (
        <div className="min-h-screen bg-gray-950 overflow-hidden w-[100vw]">
            <LandingPage />
            <Footer />
        </div>
    )
};

export default HomePage;


