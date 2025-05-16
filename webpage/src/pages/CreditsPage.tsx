import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';


const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const CreditsPage = () => {
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
                        Credits
                    </h1>
                    <p className="text-xl text-gray-400 mb-12">
                        We extend our gratitude to the creators of the open-source LaTeX templates that inspired and made this project possible.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Charles Rambo's Credits */}
                        <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md text-left">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Charles Rambo
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                For the foundational "CV in Latex" template, based on the excellent work by {' '}
                                <a
                                    href="https://github.com/sb2nov/resume"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    sb2nov/resume
                                </a>{' '}
                                and Jake's Resume on Overleaf.
                            </p>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Most recently updated version may be found at {' '}
                                <a
                                    href="https://github.com/fizixmastr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    github.com/fizixmastr
                                </a>
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                License: <span className="font-semibold">MIT</span>
                            </p>
                            <div className="flex justify-center md:justify-start mt-6 space-x-4">
                                <a
                                    href="https://github.com/fizixmastr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-400 transition-colors"
                                >
                                    <Github size={28} />
                                </a>
                            </div>
                        </div>

                        {/* Pavan Kumar Dubasi's Credits */}
                        <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md text-left">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Pavan Kumar Dubasi
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                For the "NIT Patna Resume Template v2.1".
                            </p>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                NIT Patna - IMSc., Mathematics (2019-24)
                            </p>
                            <div className="flex justify-center md:justify-start mt-6 space-x-4">
                                <a
                                    href="https://www.linkedin.com/in/im-pavankumar/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-gray-400 transition-colors"
                                >
                                    <Linkedin size={28} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
           
        </div>
    );
};

export default CreditsPage;