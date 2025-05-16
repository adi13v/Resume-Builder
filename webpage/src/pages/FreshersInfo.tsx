import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Briefcase, ArrowRight } from 'lucide-react';

import  '../index.css';

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
};



const FresherInfoPage = () => {
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
                    className="pt-20 space-y-8"
                >
                    <h1 className="text-4xl font-bold tracking-tight">
                        Perfect Resumes for Freshers & Students
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Our resume templates are designed to help you showcase your skills and experiences, even if you don't have extensive work history. We understand the importance of highlighting your academic achievements and extracurricular involvement.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                        {/* Optional Work Experience */}
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-4">
                                <Briefcase className="w-6 h-6 text-blue-400" />
                                <h2 className="text-xl font-semibold text-white">Optional Work Experience</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Include any internships, part-time jobs, or projects.  If you lack formal work experience, this section won't detract from your resume.
                            </p>
                        </div>

                        {/* Rich Clubs/Societies Section */}
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-4">
                                <Users className="w-6 h-6 text-green-400" />
                                <h2 className="text-xl font-semibold text-white">Rich Clubs/Societies Section</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Showcase your leadership, teamwork, and organizational skills gained from clubs, societies, and extracurricular activities.
                            </p>
                        </div>

                        {/* Focus on Academics */}
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                           <div className="flex items-center gap-4 mb-4">
                                <BookOpen className="w-6 h-6 text-purple-400" />
                                <h2 className="text-xl font-semibold text-white">Focus on Academics</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                  Highlight your academic achievements, including your GPA, coursework, and any relevant projects or research.
                            </p>
                        </div>
                    </div>

                    {/* Link to Catalog Page */}
                    <Link
                        to="/#catalog" //  Make sure you have a route set up for /catalog
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300 border border-white/10 backdrop-blur-md text-lg font-medium"
                    >
                        <ArrowRight className="w-5 h-5" />
                        <span>Browse Templates</span>
                    </Link>
                </motion.div>
            </div>
         
        </div>
    );
};

export default FresherInfoPage;
