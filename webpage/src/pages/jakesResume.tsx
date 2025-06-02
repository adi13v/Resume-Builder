/* eslint-disable react-hooks/exhaustive-deps */
import "../App.css";
import { useState, useRef, useEffect, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { XIcon } from "lucide-react";
import Jake_Resume_Without_Grade from '../assets/Jake_Resume_Without_Grade.pdf';
import Jake_Resume_With_Grade from '../assets/Jake_Resume_With_Grade.pdf';
import Tooltip from "../components/Tooltip";
import ChatbotModal from "../components/ChatbotModal";

import {
  generateUUID,
  handleInputChange,
  sanitizeInputForDisplay,
  formatMonthYear,
  sanitizeInput,
  sanitizeInputForLink,
  debounce,
  addItemToSubList,
  removeItemFromSubList,
  handleSubListInputChange,
  addEntry,
  removeEntry,
  handleKeyActiononList,
  handleKeyActionOnSublist,
  api
} from "../helper/helperFunctions";
import { EducationDetails, ExperienceDetails, ProjectDetails, SkillDetails, FormDataStore, CertificateDetails, ClubDetails, AchievementDetails } from "../types/jakeResume";
import PdfBox from "../components/PdfBox";

const defaultEducationEntry:EducationDetails = {
  instituteName: "",
  degree: "",
  branch: "",
  location: "",
  startDate: "",
  endDate: "",
  gradeType: "cgpa",
  cgpa: "",
  percentage: "",
  id: generateUUID(),
}

function JakeResume({defaultGradeSetting}:{defaultGradeSetting:boolean}) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [portfolioLink, setPortfolioLink] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [linkedInLink, setLinkedInLink] = useState<string>("");
  const [globalId, setGlobalId] = useState<string>(generateUUID());
  
  const storageKeyName = `formData-${window.location.pathname}`;
  const [certificateEntries, setCertificateEntries] = useState<CertificateDetails[]>([]);
  const [clubEntries, setClubEntries] = useState<ClubDetails[]>([]);
  const [achievementEntries, setAchievementEntries] = useState<AchievementDetails[]>([]);
  const [educationEntries, setEducationEntries] = useState<EducationDetails[]>([defaultEducationEntry]);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceDetails[]>([]);
  const [projectEntries, setProjectEntries] = useState<ProjectDetails[]>([]);
  const [skills, setSkills] = useState<SkillDetails[]>([]);

  // Add new state variables for section toggles
  const [includeExperience, setIncludeExperience] = useState(false);
  const [includeProjects, setIncludeProjects] = useState(false);
  const [includeSkills, setIncludeSkills] = useState(false);
  const [includeCertificates, setIncludeCertificates] = useState(false);
  const [includeClubs, setIncludeClubs] = useState(false);
  const [includeAchievements, setIncludeAchievements] = useState(false);
  const [includeGrade, setIncludeGrade] = useState(defaultGradeSetting);
  
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [prompt, setPrompt] = useState<string>("");

  const loadToStore = (store: FormDataStore) => {
    localStorage.setItem(storageKeyName, JSON.stringify(store));
  };
  const debouncedStoreRef = useRef(debounce(loadToStore, 1000));
  const formRef = useRef<HTMLFormElement>(null);
  const [triggerSubmit, setTriggerSubmit] = useState(false);


  const selectedPdf = useMemo(()=>{
    if(includeGrade){
      return Jake_Resume_With_Grade
    }
    else{
      return Jake_Resume_Without_Grade
    }
  },[includeGrade])

  useEffect(() => {
    if (triggerSubmit && formRef.current) {
      formRef.current.requestSubmit();
      toast((t) => (
        <span>
          AI Generated data can have errors, especially with links. Please check <span className=" font-bold text-red-700">carefully</span>
          <button className=" text-white " onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </span>
      ),{duration: 10000});
      setTriggerSubmit(false);
    }
  }, [triggerSubmit]);

  useEffect(() => {
    const store = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      githubLink: githubLink,
      linkedInLink: linkedInLink,
      portfolioLink: portfolioLink,
      educationEntries: educationEntries,
      experienceEntries: experienceEntries,
      projectEntries: projectEntries,
      skills: skills,
      certificateEntries: certificateEntries,
      clubEntries: clubEntries,
      includeGrade: includeGrade,
      achievementEntries: achievementEntries,
      includeExperience: includeExperience,
      includeProjects: includeProjects,
      includeSkills: includeSkills,
      includeCertificates: includeCertificates,
      includeClubs: includeClubs,
      includeAchievements: includeAchievements,
      prompt: prompt,
    };
    debouncedStoreRef.current(store);
  }, [
    name,
    email,
    phoneNumber,
    githubLink,
    linkedInLink,
    portfolioLink,
    educationEntries,
    experienceEntries,
    projectEntries,
    skills,
    certificateEntries,
    clubEntries,
    achievementEntries,
    includeGrade,
    includeExperience,
    includeProjects,
    includeSkills,
    includeCertificates,
    includeClubs,
    includeAchievements,
    prompt,
  ]);

  useEffect(() => {
    const data = localStorage.getItem(storageKeyName);
    if (data) {
      const store = JSON.parse(data) as FormDataStore;
      setName(store.name);
      setEmail(store.email);
      setPhoneNumber(store.phoneNumber);
      setGithubLink(store.githubLink);
      setLinkedInLink(store.linkedInLink);
      setPortfolioLink(store.portfolioLink);
      setEducationEntries(store.educationEntries || []);
      setExperienceEntries(store.experienceEntries || []);
      setProjectEntries(store.projectEntries || []);
      setSkills(store.skills || []);
      setCertificateEntries(store.certificateEntries || []);
      setClubEntries(store.clubEntries || []);
      setAchievementEntries(store.achievementEntries || []);
      setIncludeExperience(store.includeExperience);
      setIncludeProjects(store.includeProjects);
      setIncludeSkills(store.includeSkills);
      setIncludeCertificates(store.includeCertificates);
      setIncludeClubs(store.includeClubs);
      setIncludeAchievements(store.includeAchievements);
      setPrompt(store.prompt || "");
      setIncludeGrade(store.includeGrade || defaultGradeSetting);
    }
  }, []);

  

  const parseEducationString = () => {
    let newString: string|void
    if (includeGrade){
    newString = educationEntries.map((entry)=>{
      return `\\resumeSubheading
      {${sanitizeInput(entry.degree)} ${entry.branch?`in ${sanitizeInput(entry.branch)}`:""}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
      {${sanitizeInput(entry.instituteName)},${sanitizeInput(entry.location)}}{${entry.gradeType.toUpperCase() === "CGPA" ? `CGPA: ${entry.cgpa?sanitizeInput(entry.cgpa):""}` : `Percentage: ${entry.percentage?sanitizeInput(entry.percentage):""}`}}

  `
    }).join("")
    }
    else{
      newString=  educationEntries
      .map((entry) => {
        return `\\resumeSubheading
  {${sanitizeInput(entry.instituteName)}}{${sanitizeInput(entry.location)}}
  {${sanitizeInput(entry.degree)}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
  `;
      })
      .join("");
    }

    return `\\section{Education}
  \\resumeSubHeadingListStart
  ${newString}
  \\resumeSubHeadingListEnd
  `
  };

  const parseExperienceString = () => {
    if (!includeExperience) {
      return ``;
    }
    return `\\section{Experience}
      \\resumeSubHeadingListStart
      ${experienceEntries.map((entry)=>{
        return `\\resumeSubheading
        {${sanitizeInput(entry.jobTitle)}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
        {${sanitizeInput(entry.companyName)}}{${sanitizeInput(entry.location)}}
         \\resumeItemListStart
         ${entry.workList.map((work)=>{
          return `
          \\resumeItem{${sanitizeInput(work)}}
          `
         }).join("")}
         \\resumeItemListEnd
        `
      }).join("")}
      \\resumeSubHeadingListEnd
    `
    
  };

  const parseProjectString = () => {
    if (!includeProjects) {
      return ``;
    }

    return `\\section{Projects}
    \\resumeSubHeadingListStart
    ${projectEntries.map((entry)=>{
      return ` \\resumeProjectHeading
      {\\textbf{${entry.projectName}} ${entry.projectLink!==''?`$|$ \\href{${sanitizeInputForLink(entry.projectLink)}}{\\color{blue}${sanitizeInput(entry.projectLinkTitle)}}`:``}  } {${formatMonthYear(entry.startDate)}-- ${formatMonthYear(entry.endDate)}}
          \\resumeItemListStart
          ${entry.featureList.map((feature)=>{
            return `
            \\resumeItem{${sanitizeInput(feature)}}`
          }).join("")}
          \\resumeItemListEnd
      `
    }).join("")}
    \\resumeSubHeadingListEnd
`}

const parseClubString = () => {
  if (!includeClubs) {
    return ``;
  }
  return `\\section{Clubs And Societies}
  \\resumeSubHeadingListStart
  ${clubEntries.map((entry)=>{
    return `\\resumeSubheading
    {${sanitizeInput(entry.title)}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
    {${sanitizeInput(entry.societyName)}}{}
    \\resumeItemListStart
    ${entry.achievements.map((achievement)=>{
      return `\\resumeItem{${sanitizeInput(achievement)}}`
    }).join("")}
    \\resumeItemListEnd
    `
  }).join("")}
  \\resumeSubHeadingListEnd
  `
}


  const parseCertificateString = () => {
    if (!includeCertificates) {
      return ``;
    }
      return `\\section{Certifications}
\\begin{itemize}[leftmargin=0.15in, itemsep=2pt, parsep=0pt, label={}]
  \\small ${certificateEntries.map((entry)=>{
    return `\\item \\textbf{${sanitizeInput(entry.title)}${entry.link!==''?`:`:``}} {${entry.link!==''?`\\href{${sanitizeInputForLink(entry.link)}}{\\color{blue}Certificate Link}`:``}}`
  }).join("")}

\\end{itemize}`;
    
    };

  const parseAchievementString = () => {
    if (!includeAchievements) {
      return ``;
    }

    return `\\section{Achievements}
\\begin{itemize}[leftmargin=0.15in, itemsep=1pt, parsep=0pt, label={}]
\\small ${achievementEntries.map((entry)=>{
  return `\\item \\textbf{${sanitizeInput(entry.title)}} {\\href{${sanitizeInputForLink(entry.link)}}{\\color{blue}${sanitizeInput(entry.linkTitle)}}}`
}).join("")}
\\end{itemize}`;
}


  const parseSkillString = () => {
    if (!includeSkills) {
      return ``;
    }
  
    return `\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in,itemsep=2pt, label={}]
 \\small{\\item{
 ${skills.map((skill)=>{
  return `\\textbf{${sanitizeInput(skill.key)}}{: ${sanitizeInput(skill.value)}} \\\\`
 }).join("")}
}}
 \\end{itemize}
 `
  }



  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
       if (educationEntries.length === 0) {toast.error("Please add at least one education entry");
      return
       }
    
      if (includeSkills && skills.length === 0) {toast.error("Please select at least one skill");
        return
      }
      
      if (includeExperience && experienceEntries.length === 0) {toast.error("Please add at least one experience entry");
        return
      }
      if (includeProjects && projectEntries.length === 0) {toast.error("Please add at least one project entry");
        return
      }

    
    setIsLoading(true);
    setGlobalId(generateUUID());
    

  const Code:string = String.raw`\documentclass[letterpaper,11pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}

%----------HEADING----------
% \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
%   \textbf{\href{http://sourabhbajaj.com/}{\Large Sourabh Bajaj}} & Email : \href{mailto:sourabh@sourabhbajaj.com}{sourabh@sourabhbajaj.com}\\
%   \href{http://sourabhbajaj.com/}{http://www.sourabhbajaj.com} & Mobile : +1-123-456-7890 \\
% \end{tabular*}

\begin{center}
    \textbf{\Huge \scshape ${sanitizeInput(name)}} \\ \vspace{1pt}
    \small ${sanitizeInput(phoneNumber)} $|$ \href{mailto:${sanitizeInput(email)}}{\underline{${sanitizeInput(email)}}} 
    ${linkedInLink!==''?` $|$ \\href{${sanitizeInputForLink(linkedInLink)}}{\\underline{${sanitizeInputForDisplay(linkedInLink)}}}`:""}
    ${githubLink!==''?` $|$ \\href{${sanitizeInputForLink(githubLink)}}{\\underline{${sanitizeInputForDisplay(githubLink)}}}`:""}
    ${portfolioLink!==''?` $|$ \\href{${sanitizeInputForLink(portfolioLink)}}{\\underline{${sanitizeInputForDisplay(portfolioLink)}}}`:""}
\end{center}

%-----------EDUCATION-----------
${parseEducationString()}
%-----------EXPERIENCE-----------
${parseExperienceString()}
%-----------PROJECTS-----------
${parseProjectString()}
%-----------Clubs And Societies-----------
${parseClubString()}
%%---Certifications----------
${parseCertificateString()}
%%---Achievements----------
${parseAchievementString()}
%%---PROGRAMMING SKILLS-----------
${parseSkillString()}
\end{document}
`

  const formData = new FormData()
    formData.append('payload', Code)
    formData.append('globalId', globalId)
    api.post('/' , formData, {responseType: 'blob',
        headers:{
        'Content-Type': 'multipart/form-data'
    }})
    .then((res)=>{
      if(res.status === 200){
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
      toast.success('Resume generated successfully!');
    }
    else{
      toast.error('Failed to generate resume. Please try again.');
    }
    })
    .catch((err)=>{
      console.error(err);
      toast.error('Failed to generate resume. Please try again.');
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  // Add this function to handle the AI-generated form data
  const handleAIGeneratedData = (data: FormDataStore) => {
    setName(data.name || "");
    setEmail(data.email || "");
    setPhoneNumber(data.phoneNumber || "");
    setGithubLink(data.githubLink || "");
    setLinkedInLink(data.linkedInLink || "");
    setPortfolioLink(data.portfolioLink || "");
    setEducationEntries(data.educationEntries || []);
    setExperienceEntries(data.experienceEntries || []);
    setProjectEntries(data.projectEntries || []);
    setSkills(data.skills || []);
    setCertificateEntries(data.certificateEntries || []);
    setClubEntries(data.clubEntries || []);
    setAchievementEntries(data.achievementEntries || []);
    setIncludeClubs(data.includeClubs);
    setIncludeAchievements(data.includeAchievements);
    setIncludeProjects(data.includeProjects);
    setIncludeSkills(data.includeSkills);
    setIncludeExperience(data.includeExperience);
    setIncludeCertificates(data.includeCertificates);
    setTriggerSubmit(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 font-sans min-h-screen w-[100%] bg-gray-950">
        <form
          ref={formRef}
          action=""
          onSubmit={handleFormSubmit}
          className="bg-gray-900/50 mt-15 backdrop-blur-md shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 w-[100%] border border-white/10 "
        >
          {/* Add AI Generator Button at the top */}
          
          <div className="flex justify-end ">
           
            <div className=" bg-black rounded-xl flex justify-center items-center">
              <div className="relative inline-flex rounded-xl  group">
                <div className="absolute transitiona-all  rounded-xl duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                <button
                  type="button"
                  
                  onClick={() => setChatbotModalOpen(true)}
                  className="relative  inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Generate with AI
                </button>
              </div>
            </div>
            
          </div>

          {/* Personal Information Section */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-white">
                Personal Information
              </h2>
            </div>
            <div className="space-y-6">
              
             
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  Name<span className="text-red-500">*</span>
                </label>
                <Tooltip
                  title="Not Allowed Here"
                  message="Making Text Bold is not allowed here"
                >
                  <input
                    id="tooltip"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. John Smith"
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                    required
                  />
                </Tooltip>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  Email<span className="text-red-500">*</span>
                </label>
                <Tooltip
                  title="Not Allowed Here"
                  message="Making Text Bold is not allowed here"
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex. john.smith@gmail.com"
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                    required
                  />
                </Tooltip>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  Phone Number<span className="text-red-500">*</span>{" "}
                  <span className=" mx-0.5 text-xs text-white">
                    Tip: Write Country Code followed by - and then the number
                  </span>
                </label>
                <Tooltip
                  title="Not Allowed Here"
                  message="Making Text Bold is not allowed here"
                >
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ex. +1-555-123-4567"
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                    required
                  />
                </Tooltip>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="linkedInLink"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  LinkedIn Link{" "}
                  <span className=" mx-0.5 text-xs text-white">
                    Tip: Write full url with https://, also if URL is too long,{" "}
                    <a  className="text-blue-500" href="https://youtu.be/oga5s3Yngc8?si=XhzKVeKdUMhG6hrg">
                      edit in Linkedin
                    </a>
                  </span>
                </label>
                <Tooltip
                  title="Not Allowed Here"
                  message="Making Text Bold is not allowed here"
                >
                  <input
                    type="text"
                    id="linkedInLink"
                    name="linkedInLink"
                    value={linkedInLink}
                    placeholder="Ex. linkedin.com/in/johnsmith"
                    onChange={(e) => setLinkedInLink(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                  />
                </Tooltip>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="githubLink"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  GitHub Link{" "}
                  <span className=" mx-0.5 text-xs text-white">
                    Tip: Write full url with https://
                  </span>
                </label>
                <Tooltip
                  title="Not Allowed Here"
                  message="Making Text Bold is not allowed here"
                >
                  <input
                    type="text"
                    id="githubLink"
                    name="githubLink"
                    value={githubLink}
                    placeholder="Ex. github.com/johnsmith"
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                  />
                </Tooltip>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="portfolioLink"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  Portfolio Link{" "}
                  <span className=" mx-0.5 text-xs text-white">
                    Tip: Write full url with https://
                  </span>
                </label>
                <Tooltip
                  title="Not Allowed Here"
                  message="Making Text Bold is not allowed here"
                >
                  <input
                    type="text"
                    id="portfolioLink"
                    name="portfolioLink"
                    value={portfolioLink}
                    placeholder="Ex. johnsmith.dev"
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8 border-b pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">Education</h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGrade}
                  onChange={(e) => setIncludeGrade(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Grade <span className="text-xs text-gray-400">Will Cause Slight Format Change</span></span>
                
              </label>
            </div>
            <div className="space-y-6">
              {educationEntries.map((entry, index) => (
                <div key={entry.id} className="bg-white/5 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-light text-[#44BCFF]">
                      Education #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeEntry(setEducationEntries, index)}
                      className="text-red-400 hover:text-red-300 focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Institute Name<span className="text-red-500">*</span> <span className="text-xs text-white">Tip:Write Full Form and in capitalised form</span>
                      </label>
                      <input
                        type="text"
                        value={entry.instituteName}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "instituteName",
                            e.target.value
                          )
                        }
                        placeholder="Ex. Massachusetts Institute of Technology"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Degree<span className="text-red-500">*</span> <span className="text-xs text-white">Tip: For School, write Secondary or Senior Secondary</span>
                      </label>
                      <input
                        type="text"
                        value={entry.degree}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        placeholder="Ex. Master of Science"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Branch
                        <span className="text-xs text-white"> Tip: Leave Blank For School</span>
                      </label>
                      <input
                        type="text"
                        value={entry.branch}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "branch",
                            e.target.value
                          )
                        }
                        placeholder="Ex. Computer Science"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                       
                      />
                    </div>
                    <div>
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.location}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "location",
                            e.target.value
                          )
                        }
                        placeholder="Ex. Cambridge, Massachusetts"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={entry.startDate}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type={entry.endDate === "Present" ? "text" : "month"}
                        value={entry.endDate}
                        disabled={entry.endDate === "Present"}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10 ${
                          entry.endDate === "Present"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        required
                      />
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          checked={entry.endDate === "Present"}
                          onChange={(e) => {
                            handleInputChange(
                              setEducationEntries,
                              educationEntries,
                              index,
                              "endDate",
                              e.target.checked ? "Present" : ""
                            );
                          }}
                          className="form-checkbox h-4 w-4 text-white focus:ring-white"
                        />
                        <label className="ml-2 text-white">Currently Pursuing</label>
                      </div>
                    </div>
                    {includeGrade && (
                      <>
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Grade Type<span className="text-red-500">*</span>
                          </label>
                          <select
                            value={entry.gradeType}
                            onChange={(e) =>
                              handleInputChange(
                                setEducationEntries,
                                educationEntries,
                                index,
                                "gradeType",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          >
                            <option style={{backgroundColor:"Black",color:"white"}} value="cgpa">CGPA</option>
                            <option style={{backgroundColor:"Black",color:"white"}} value="percentage">Percentage</option>
                          </select>
                        </div>
                        {entry.gradeType === "cgpa" ? (
                          <div>
                            <label className="block text-[#44BCFF] font-medium mb-2">
                              CGPA<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={entry.cgpa}
                              onChange={(e) =>
                                handleInputChange(
                                  setEducationEntries,
                                  educationEntries,
                                  index,
                                  "cgpa",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[#44BCFF] font-medium mb-2">
                              Percentage<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={entry.percentage}
                              onChange={(e) =>
                                handleInputChange(
                                  setEducationEntries,
                                  educationEntries,
                                  index,
                                  "percentage",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => addEntry(setEducationEntries, {
                    instituteName: "",
                    degree: "",
                    branch: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    gradeType: "cgpa",
                    cgpa: "",
                    percentage: ""
                  })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Education</span>
                </button>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">Experience</h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExperience}
                  onChange={(e) => setIncludeExperience(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includeExperience ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeExperience && (
                <div className="space-y-6">
                  {experienceEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-light text-[#44BCFF]">
                          Experience #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            removeEntry(setExperienceEntries, index)
                          }
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`jobTitle-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Job Title<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              id={`jobTitle-${entry.id}`}
                              value={entry.jobTitle}
                              onChange={(e) =>
                                handleInputChange(
                                  setExperienceEntries,
                                  experienceEntries,
                                  index,
                                  "jobTitle",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. Software Engineer"
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                        <div>
                          <label
                            htmlFor={`companyName-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Company Name<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              id={`companyName-${entry.id}`}
                              value={entry.companyName}
                              onChange={(e) =>
                                handleInputChange(
                                  setExperienceEntries,
                                  experienceEntries,
                                  index,
                                  "companyName",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. Google"
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                        <div>
                          <label
                            htmlFor={`location-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Location<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              id={`location-${entry.id}`}
                              value={entry.location}
                              onChange={(e) =>
                                handleInputChange(
                                  setExperienceEntries,
                                  experienceEntries,
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. Mountain View, California"
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                        <div>
                          <label
                            htmlFor={`startDate-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Start Date<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="month"
                            id={`startDate-${entry.id}`}
                            value={entry.startDate}
                            onChange={(e) =>
                              handleInputChange(
                                setExperienceEntries,
                                experienceEntries,
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`endDate-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            End Date<span className="text-red-500">*</span>
                          </label>
                          <input
                            type={
                              entry.endDate === "Present" ? "text" : "month"
                            }
                            id={`endDate-${entry.id}`}
                            value={entry.endDate}
                            onChange={(e) =>
                              handleInputChange(
                                setExperienceEntries,
                                experienceEntries,
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10 ${
                              entry.endDate === "Present"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            required
                          />
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange(
                                  setExperienceEntries,
                                  experienceEntries,
                                  index,
                                  "endDate",
                                  "Present"
                                );
                              } else {
                                handleInputChange(
                                  setExperienceEntries,
                                  experienceEntries,
                                  index,
                                  "endDate",
                                  ""
                                );
                              }
                            }}
                          />

                          <label htmlFor="">Currently Pursuing</label>
                        </div>
                        <div className="col-span-full">
                          <h4 className="text-md font-semibold mb-2 text-[#44BCFF]">
                            Work Details{" "}
                            <span className=" mx-0.5 text-xs text-white">
                              Tip: Use Bold For Highlighting but don't overdo it
                            </span>
                          </h4>
                          {entry.workList.map((work, workIndex) => (
                            <div
                              key={workIndex}
                              className="mb-2 flex items-center space-x-4"
                            >
                             
                              <input
                                type="text"
                                id={`work-${entry.id}-${workIndex}`}
                                value={work}
                                onChange={(e) =>
                                  handleSubListInputChange(
                                    setExperienceEntries,
                                    index,
                                    "workList",
                                    workIndex,
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyActionOnSublist(
                                    e,
                                    setExperienceEntries,
                                    "workList",
                                    index,
                                    workIndex
                                  )
                                }
                                placeholder="Ex. Developed scalable REST APIs using FastAPI, reducing response time by 30%"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeItemFromSubList(
                                    setExperienceEntries,
                                    index,
                                    "workList",
                                    workIndex
                                  )
                                }
                                className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                addItemToSubList(
                                  setExperienceEntries,
                                  index,
                                  "workList",
                                  ""
                                )
                              }
                              className="px-4 py-2 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm"
                            >
                              Add Work
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    addEntry(setExperienceEntries, {
                      jobTitle: "",
                      companyName: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      workList: [""]
                    })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Experience</span>
                </button>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8 border-b pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">Projects</h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProjects}
                  onChange={(e) => setIncludeProjects(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div className={`${!includeProjects ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="space-y-6">
                {projectEntries.map((entry, index) => (
                  <div key={entry.id} className="bg-white/5 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-light text-[#44BCFF]">
                        Project #{index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeEntry(setProjectEntries, index)}
                        className="text-red-400 hover:text-red-300 focus:outline-none"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Project Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={entry.projectName}
                          onChange={(e) =>
                            handleInputChange(
                              setProjectEntries,
                              projectEntries,
                              index,
                              "projectName",
                              e.target.value
                            )
                          }
                          placeholder="Ex. AI-Powered Resume Builder"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Project Link Title
                        </label>
                        <input
                          type="text"
                          value={entry.projectLinkTitle}
                          onChange={(e) =>
                            handleInputChange(
                              setProjectEntries,
                              projectEntries,
                              index,
                              "projectLinkTitle",
                              e.target.value
                            )
                          }
                          placeholder="Ex. GitHub Link"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"

                        />
                      </div>
                      <div>
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Project Link
                        </label>
                        <input
                          type="url"
                          value={entry.projectLink}
                          onChange={(e) =>
                            handleInputChange(
                              setProjectEntries,
                              projectEntries,
                              index,
                              "projectLink",
                              e.target.value
                            )
                          }
                          placeholder="Ex. https://github.com/username/resume-builder"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"

                        />
                      </div>
                      <div>
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Start Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="month"
                          value={entry.startDate}
                          onChange={(e) =>
                            handleInputChange(
                              setProjectEntries,
                              projectEntries,
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          End Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type={entry.endDate === "Present" ? "text" : "month"}
                          value={entry.endDate}
                          disabled={entry.endDate === "Present"}
                          onChange={(e) =>
                            handleInputChange(
                              setProjectEntries,
                              projectEntries,
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10 ${
                            entry.endDate === "Present"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          required
                        />
                        <div className="mt-2 flex items-center">
                          <input
                            type="checkbox"
                            checked={entry.endDate === "Present"}
                            onChange={(e) => {
                              handleInputChange(
                                setProjectEntries,
                                projectEntries,
                                index,
                                "endDate",
                                e.target.checked ? "Present" : ""
                              );
                            }}
                            className="form-checkbox h-4 w-4 text-white focus:ring-white"
                          />
                          <label className="ml-2 text-white">Ongoing Project</label>
                        </div>
                      </div>
                      <div className="col-span-full">
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Features<span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {entry.featureList.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}

                                onChange={(e) =>
                                  handleSubListInputChange(
                                    setProjectEntries,
                                    index,
                                    "featureList",
                                    featureIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Ex. Built a resume parsing tool with OpenAI API to optimize ATS scores"
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeItemFromSubList(
                                    setProjectEntries,
                                    index,
                                    "featureList",
                                    featureIndex
                                  )
                                }
                                className="text-red-400 hover:text-red-300 focus:outline-none"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              addItemToSubList(
                                setProjectEntries,
                                index,
                                "featureList",
                                ""
                              )
                            }
                            className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                          >
                            <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Feature</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => addEntry(setProjectEntries, {
                    projectName: "",
                    projectLinkTitle: "",
                    projectLink: "",
                    startDate: "",
                    endDate: "",
                    featureList: [""]
                  })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Project</span>
                </button>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">
                Technical Skills
              </h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSkills}
                  onChange={(e) => setIncludeSkills(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                  
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includeSkills ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeSkills && (
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div
                      className="inputGroup mb-4 flex items-center space-x-4"
                      key={index}
                    >
                      <Tooltip
                        title="This will already be bold"
                        message="Making Text Bold is not allowed here"
                      >
                        <input
                          type="text"
                          placeholder="Ex. Languages"
                          value={skill.key}
                          onChange={(e) =>
                            handleInputChange(
                              setSkills,
                              skills,
                              index,
                              "key",
                              e.target.value
                            )
                          }
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                          required
                        />
                      </Tooltip>
                      <input
                        type="text"
                        placeholder="Ex. Python, JavaScript, TypeScript, Java, C++"
                        value={skill.value}
                        onKeyDown={(e) =>
                          handleKeyActiononList(
                            e,
                            setSkills,
                            skills,
                            index,
                            "value"
                          )
                        }
                        onChange={(e) =>
                          handleInputChange(
                            setSkills,
                            skills,
                            index,
                            "value",
                            e.target.value
                          )
                        }
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeEntry(setSkills, index)}
                        className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => addEntry(setSkills, {
                    key: "",
                    value: ""
                  })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Skill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="mb-8 border-b  pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">Certifications</h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCertificates}
                  onChange={(e) => setIncludeCertificates(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includeCertificates ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeCertificates && (
                <div className="space-y-6">
                  {certificateEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-light text-[#44BCFF]">
                          Certificate #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            removeEntry(setCertificateEntries, index)
                          }
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Certificate Title<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              value={entry.title}
                              onChange={(e) =>
                                handleInputChange(
                                  setCertificateEntries,
                                  certificateEntries,
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. AWS Certified Cloud Practitioner"
                              className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Certificate Link{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: The URL of your certificate or verification
                              page
                            </span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="url"
                              value={entry.link}
                              onChange={(e) =>
                                handleInputChange(
                                  setCertificateEntries,
                                  certificateEntries,
                                  index,
                                  "link",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. https://example.com/certificate"
                              className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    addEntry(setCertificateEntries, {
                      title: "",
                      link: ""
                    })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Certificate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clubs and Societies Section */}
          <div className="mb-8 border-b  pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">
                Clubs and Societies
              </h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeClubs}
                  onChange={(e) => setIncludeClubs(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includeClubs ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeClubs && (
                <div className="space-y-6">
                  {clubEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-light text-[#44BCFF]">
                          Club #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeEntry(setClubEntries, index)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Position Title<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              value={entry.title}
                              onChange={(e) =>
                                handleInputChange(
                                  setClubEntries,
                                  clubEntries,
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. Web Development Lead"
                              className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Society/Club Name<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              value={entry.societyName}
                              onChange={(e) =>
                                handleInputChange(
                                  setClubEntries,
                                  clubEntries,
                                  index,
                                  "societyName",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. Computer Science Association"
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Start Date<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="month"
                            value={entry.startDate}
                            onChange={(e) =>
                              handleInputChange(
                                setClubEntries,
                                clubEntries,
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            End Date<span className="text-red-500">*</span>
                          </label>
                          <input
                            type={
                              entry.endDate === "Present" ? "text" : "month"
                            }
                            value={entry.endDate}
                            disabled={entry.endDate === "Present"}
                            onChange={(e) =>
                              handleInputChange(
                                setClubEntries,
                                clubEntries,
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10 ${
                              entry.endDate === "Present"
                                ? "bg-gray-500 cursor-not-allowed"
                                : ""
                            }`}
                            required
                          />
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange(
                                  setClubEntries,
                                  clubEntries,
                                  index,
                                  "endDate",
                                  "Present"
                                );
                              } else {
                                handleInputChange(
                                  setClubEntries,
                                  clubEntries,
                                  index,
                                  "endDate",
                                  ""
                                );
                              }
                            }}
                          />
                          <label className="ml-2 text-[#DFD0B8]">
                            Currently Active
                          </label>
                        </div>

                        <div className="col-span-full">
                          <h4 className="text-md font-semibold mb-2 text-[#44BCFF]">
                            Achievements:{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: Use Bold For Highlighting but don't overdo it. End each achievement with a full stop.
                            </span>
                          </h4>
                          {entry.achievements.map(
                            (achievement, achievementIndex) => (
                              <div
                                key={`${entry.id}-achievement-${achievementIndex}`}
                                className="mb-2 flex items-center space-x-4"
                              >
                                
                                <input
                                  type="text"
                                  value={achievement}
                                  onKeyDown={(e) =>
                                    handleKeyActionOnSublist(
                                      e,
                                      setClubEntries,
                                      "achievements",
                                      index,
                                      achievementIndex
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSubListInputChange(
                                      setClubEntries,
                                      index,
                                      "achievements",
                                      achievementIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ex. Led workshops on Git and DevOps with 300+ participants"
                                  className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItemFromSubList(
                                      setClubEntries,
                                      index,
                                      "achievements",
                                      achievementIndex
                                    )
                                  }
                                  className="px-2 py-1 text-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          )}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                addItemToSubList(
                                  setClubEntries,
                                  index,
                                  "achievements",
                                  ""
                                )
                              }
                              className="px-4 py-2  flex items-center gap-2 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm"
                            >
                              <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Achievement</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => addEntry(setClubEntries, {
                    title: "",
                    societyName: "",
                    startDate: "",
                    endDate: "",
                    achievements: [""]
                  })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Club/Society</span>
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8 border-b  pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">
                Honors and Achievements
              </h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAchievements}
                  onChange={(e) => setIncludeAchievements(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includeAchievements ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeAchievements && (
                <div className="space-y-6">
                  {achievementEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-light text-[#44BCFF]">
                          Achievement #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeEntry(setAchievementEntries, index)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`title-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Title<span className="text-red-500">*</span>:
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              id={`title-${entry.id}`}
                              value={entry.title}
                              onChange={(e) =>
                                handleInputChange(
                                  setAchievementEntries,
                                  achievementEntries,
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. ACM ICPC Regional Finalist"
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                        <div>
                          <label
                            htmlFor={`linkTitle-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Link Title:
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              id={`linkTitle-${entry.id}`}
                              value={entry.linkTitle}
                              onChange={(e) =>
                                handleInputChange(
                                  setAchievementEntries,
                                  achievementEntries,
                                  index,
                                  "linkTitle",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. Certificate"
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            
                            />
                          </Tooltip>
                        </div>
                        <div>
                          <label
                            htmlFor={`link-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Link:
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="url"
                              id={`link-${entry.id}`}
                              value={entry.link}
                              onChange={(e) =>
                                handleInputChange(
                                  setAchievementEntries,
                                  achievementEntries,
                                  index,
                                  "link",
                                  e.target.value
                                )
                              }
                              placeholder="Ex. https://example.com/certificate"
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => addEntry(setAchievementEntries, {
                    title: "",
                    linkTitle: "",
                    link: ""
                  })}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4 text-white" /> <span className="text-white">Add Achievement</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
           
            <div className=" bg-black rounded-xl flex justify-center items-center">
              <div className="relative inline-flex rounded-xl  group">
                <div className="absolute transitiona-all  rounded-xl duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Resume'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-10 w-full">
          <PdfBox pdfUrl={pdfUrl} defaultPdfUrl={selectedPdf} />
        </div>
      </div>

      {/* Add ChatbotModal */}
      {chatbotModalOpen && (
        <ChatbotModal
          closeModal={() => setChatbotModalOpen(false)}
          updateFormData={handleAIGeneratedData}
          prompt={prompt}
          formDataStore={JSON.parse(localStorage.getItem(storageKeyName) || "{}")}
          setPrompt={setPrompt}
          api = {api}
          // THIS format of string is required because it maps to enum in backend
          resumeType= {"JAKE_RESUME"}
        />
      )}
    </>
  );
}

export default JakeResume;
