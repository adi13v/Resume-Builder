"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type FAQItemProps = {
  question: string
  answer: string
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-4 backdrop-blur-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left bg-white/5 hover:bg-white/10 transition-colors duration-200"
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 bg-gray-900 text-gray-400">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FAQSection = () => {
  const faqs = [
    
    {
      question: "Are these templates ATS-friendly?",
      answer:
        "Yes, all our templates are designed to be ATS (Applicant Tracking System) friendly. They use standard fonts, clear section headings, and proper formatting to ensure your resume gets through automated screening systems. However, follow the instructions and check the Resume's ATS Score on different sites",
    },
    {
        question: "Is there anything for freshers?",
        answer:
          "Yes! In every resume work experience section is optional. You can skip it if you don't have any work experience.",
      },
    {
      question: "Can I customize the templates?",
      answer:
        "You can select/deselect the fields to be included but to keep things simple we advise you to just follow the examples.",
    },
    {
      question: "I have a Bad GPA, what should I do?",
      answer:
        "Except the ones where education is in tabular format, all other templates have grade as optional. So you can just leave it blank.☺️",
    },
    {
      question: "How do I download my completed resume?",
      answer:
        "After filling in your details, simply click the 'Download' button to get your resume in PDF format, ready for job applications. You can also save your progress and return to edit later.",
    },
  ]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
      }}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto mt-20 px-4"
    >
      <h2 className="text-2xl font-semibold text-white mb-8 tracking-tight text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </motion.div>
  )
}

export default FAQSection
