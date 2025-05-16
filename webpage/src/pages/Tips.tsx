import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Search, FileText } from 'lucide-react'; // Import icons


const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
};

const Tips = () => {
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
                        Resume & Site Building Tips
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Helpful advice for creating effective resumes and making the most of our platform.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto text-left">
                        {/* Shortening Links */}
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-4">
                                <LinkIcon className="w-6 h-6 text-blue-400" />
                                <h2 className="text-xl font-semibold text-white">Shortening Links</h2>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>
                                    <span className="font-semibold">Our Site's Automatic Shortening:</span> When you generate your resume as a PDF, our site automatically shortens the links for you.  You don't need to do anything extra!
                                </li>
                                <li>
                                    <span className="font-semibold">LinkedIn Profile Links:</span> For your LinkedIn profile, you can edit your profile URL directly on LinkedIn to make it shorter and more professional.
                                </li>
                                 <li>
                                     <span className="font-semibold">Link Shorteners:</span> Avoid using third-party link shorteners (like bit.ly) unless you are willing to pay for their services.
                                 </li>
                            </ul>
                        </div>

                        {/* Checking ATS Score for Free */}
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-4">
                                <Search className="w-6 h-6 text-green-400" />
                                <h2 className="text-xl font-semibold text-white">Checking ATS Score for Free</h2>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                <li>
                                    <span className="font-semibold">Free ATS Check Limitations:</span>  Most high-quality ATS scoring tools are paid services.  Free options are generally limited.
                                </li>
                                <li>
                                    <span className="font-semibold">"High-Scoring Resume" Hack:</span> A useful technique is to find a resume online that is known to have a very high ATS score, and upload to the ATS checker. Then compare the ATS score of that resume with the score of your own resume.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link
                        to="/catalog" //  Make sure you have a route set up for /catalog
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300 border border-white/10 backdrop-blur-md text-lg font-medium"
                    >
                        <FileText className="w-5 h-5" />
                        <span>Go to Resume Catalog</span>
                    </Link>
                </motion.div>
            </div>
            
        </div>
    );
};

export default Tips;

