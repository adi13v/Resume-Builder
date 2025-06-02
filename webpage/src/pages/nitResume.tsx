/* eslint-disable react-hooks/exhaustive-deps */

import "../App.css";
import { useState, useRef, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { XIcon } from "lucide-react";
import NIT_Resume_With_Logo from '../assets/NIT-Resume-With-Logo.pdf'
import NIT_Resume_With_Photo from '../assets/NIT-Resume-With-Photo.pdf'
import NIT_Resume_Without_Photo from '../assets/NIT-Resume-Without-Photo.pdf'
import Tooltip from "../components/Tooltip";
import Modal from "../components/Modal";
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
  NITEnum,
  api
} from "../helper/helperFunctions";
import { 
  EducationDetails, 
  ExperienceDetails, 
  ProjectDetails, 
  SkillDetails, 
  CertificateDetails, 
  AchievementDetails,
  PositionOfResponsibilityDetails,
  FormDataStore 
} from "../types/nitResume";
import PdfBox from "../components/PdfBox";




const defaultEducationEntry: EducationDetails = {
    "id": "edu1",
    "instituteName": "",
    "degree": "",
    "degreeAbbreviation": "",
    "branch": "",
    "branchAbbreviation": "",
    "location": "",
    "endDate": "",
    "gradeType": "CGPA",
    "cgpa": "",
    "percentage": ""
  }

const defaultExperienceEntry1: ExperienceDetails = {
    "id": "exp1",
    "jobTitle": "",
    "companyName": "",
    "location": "",
    "startDate": "",
    "endDate": "",
    "workList": [""]
  }

const defaultProjectEntry1: ProjectDetails = {
    "id": "proj1",
    "projectName": "",
    "description": "",
    "toolsUsed": "",
    "linkTitle": "",
    "projectLink": "",
    "startDate": "",
    "endDate": "",
    "workDone": [""]
  }

  const defaultSkillEntry1: SkillDetails = { "id": "sk1", "key": "", "value": "" }

  const defaultCertificateEntry1: CertificateDetails = {
    "id": "cert1",
    "title": "",
    "link": "",
    "date": ""
  }

  const defaultAchievementEntry1: AchievementDetails = {
    "id": "ach1",
    "title": "",
    "linkTitle": "",
    "link": ""
  }

  const defaultPositionEntry1: PositionOfResponsibilityDetails = {
    "id": "pos1",
    "positionName": "",
    "organizationName": "",
    "date": ""
  }

function NITResume({defaultPhotoSetting}:{defaultPhotoSetting:NITEnum}) {
  const FormatType = defaultPhotoSetting
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalId, setGlobalId] = useState<string>(generateUUID());
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [linkedInLink, setLinkedInLink] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
  const storageKeyName = `formData-${window.location.pathname}`;
  
  // Section toggles
  const [includeExperience, setIncludeExperience] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeSkills, setIncludeSkills] = useState(true);
  const [includeCertificates, setIncludeCertificates] = useState(true);
  const [includeAchievements, setIncludeAchievements] = useState(true);
  const [includePositions, setIncludePositions] = useState(true);
  
  // Form data states
  const [educationEntries, setEducationEntries] = useState<EducationDetails[]>([
    defaultEducationEntry
  ]);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceDetails[]>([]);
  const [projectEntries, setProjectEntries] = useState<ProjectDetails[]>([]);
  const [skills, setSkills] = useState<SkillDetails[]>([]);
  const [certificateEntries, setCertificateEntries] = useState<CertificateDetails[]>([]);
  const [achievementEntries, setAchievementEntries] = useState<AchievementDetails[]>([]);
  const [positionEntries, setPositionEntries] = useState<PositionOfResponsibilityDetails[]>([]);

  const updateAvatar = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const newFile = new File([blob], "image.png", {
        type: blob.type || "image/png",
      });
      setImageFile(newFile);
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to fetch or convert image:", error);
    }
  };

  const loadToStore = (store: FormDataStore) => {
    localStorage.setItem(storageKeyName, JSON.stringify(store));
  };
  const debouncedStoreRef = useRef(debounce(loadToStore, 1000));
  const formRef = useRef<HTMLFormElement>(null);
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  


  useEffect(() => {
    if (triggerSubmit) {
      formRef.current?.requestSubmit();
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
      
      educationEntries: educationEntries,
      experienceEntries: experienceEntries,
      projectEntries: projectEntries,
      skills: skills,
      certificateEntries: certificateEntries,
      achievementEntries: achievementEntries,
      positionEntries: positionEntries,
      includeExperience: includeExperience,
      includeProjects: includeProjects,
      includeSkills: includeSkills,
      includeCertificates: includeCertificates,
      includeAchievements: includeAchievements,
      includePositions: includePositions,
      prompt: prompt,
    };
    debouncedStoreRef.current(store);
  }, [
    name,
    email,
    phoneNumber,
    githubLink,
    linkedInLink,
    
    educationEntries,
    experienceEntries,
    projectEntries,
    skills,
    certificateEntries,
    achievementEntries,
    positionEntries,
    includeExperience,
    includeProjects,
    includeSkills,
    includeCertificates,
    includeAchievements,
    includePositions,
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

      setEducationEntries(store.educationEntries);
      setExperienceEntries(store.experienceEntries);
      setProjectEntries(store.projectEntries);
      setSkills(store.skills);
      setCertificateEntries(store.certificateEntries || []);
      setAchievementEntries(store.achievementEntries || []);
      setPositionEntries(store.positionEntries || []);
      setIncludeExperience(store.includeExperience);
      setIncludeProjects(store.includeProjects);
      setIncludeSkills(store.includeSkills);
      setIncludeCertificates(store.includeCertificates);
      setIncludeAchievements(store.includeAchievements);
      setIncludePositions(store.includePositions);
      setPrompt(store.prompt || "");
    }
  }, []);


  useEffect(() => {
    if (includeProjects) {
      setIncludeProjects(true);
    } else {
      setIncludeProjects(false);
    }
  }, [includeProjects]);

  const parseEducationString = () => {
    const newString: string | void = educationEntries
      .map((entry) => {
        return `${entry.degreeAbbreviation?`${sanitizeInput(entry.degreeAbbreviation)}`:`${sanitizeInput(entry.degree)}`}${entry.branch!==''?`,`:``}${sanitizeInput(entry.branchAbbreviation?`${sanitizeInput(entry.branchAbbreviation)}`:`${sanitizeInput(entry.branch)}`)} & ${sanitizeInput(entry.instituteName)} & ${entry.gradeType.toUpperCase()=='CGPA'?`${sanitizeInput(entry.cgpa)}`:`${sanitizeInput(entry.percentage)}`} & ${formatMonthYear(entry.endDate)} \\\\ 
  \\hline
  `;
      })
      .join("");

    return newString;
  };

  const parseExperienceString = () => {
    if (!includeExperience) {

      return ``;
    }
   
    let newString: string | void = experienceEntries
      .map((entry) => {
        return `\\resumeSubheading
    {${sanitizeInput(entry.companyName)}}{${sanitizeInput(entry.location)}}
    {${sanitizeInput(entry.jobTitle)}}{${formatMonthYear(entry.startDate)} - ${formatMonthYear(entry.endDate)}}
    \\resumeItemListStart
    ${entry.workList.map((work)=>{
      return `
      \\item ${sanitizeInput(work)}
      `
    }).join("")}
    \\resumeItemListEnd
    `
      })
      .join("");

    newString = `\\section{Experience}
    \\vspace{-0.4mm}
    \\resumeSubHeadingListStart
  ${newString}
  \\resumeSubHeadingListEnd
  \\vspace{-6mm}
  `;
    return newString;
  };

  const parseProjectString = () => {
    if (!includeProjects) {
      return ``;
    }

    const newString = projectEntries
      .map((entry)=> {
        return `\\resumeProject
    {${sanitizeInput(entry.projectName)}: ${sanitizeInput(entry.description)}}
    {Tools: ${sanitizeInput(entry.toolsUsed)}}
    {${formatMonthYear(entry.endDate)}}
    {{}\\href{${sanitizeInputForLink(entry.projectLink)}}{\\textcolor{darkblue}{${sanitizeInput(entry.linkTitle)}}}}
\\resumeItemListStart
    ${entry.workDone.map((work)=>{
      return `\\item ${sanitizeInput(work)}`
    }).join("")}
\\resumeItemListEnd`}).join("");


    return `
\\section{Projects}
\\vspace{-0.4mm}
\\resumeSubHeadingListStart
${newString}
\\resumeSubHeadingListEnd
\\vspace{-8mm}
`;
  
  };




  const parseAchievementString = () => {
    if (!includeAchievements) {
      return ``;
    }
    const newString = `\\section{Achievements} 
\\vspace{-0.2mm}
\\resumeSubHeadingListStart
  ${achievementEntries
    .map((entry: AchievementDetails) => {
      return `
      \\resumePOR{}{${sanitizeInput(entry.title)}}
      {\\href{${sanitizeInputForLink(entry.link)}}{${sanitizeInput(entry.linkTitle)}}}
      `}).join("")}
\\resumeSubHeadingListEnd
\\vspace{-6mm}
`;

    return newString;
  };

  const parseClubString = () => {
    if (!includePositions) {
      return ``;
    }
    const newString = `\\section{Positions of Responsibility} % Removed \textbf{}
\\vspace{-0.4mm}
\\resumeSubHeadingListStart
  ${positionEntries
    .map((entry: PositionOfResponsibilityDetails) => {
      return `\\resumePOR{${sanitizeInput(entry.positionName)} } 
    {${sanitizeInput(entry.organizationName)}} 
    {${formatMonthYear(entry.date)}}`;
    })
    .join("")}
\\resumeSubHeadingListEnd
\\vspace{-5mm}
`;
    return newString;
  };

  const parseCertificateString = () => {
    if (!includeCertificates) {
      return ``;
    }

    const newString = `\\section{Certifications} 
\\vspace{-0.4mm}
\\resumeSubHeadingListStart
      ${certificateEntries.map((entry)=>{
        return `
        \\resumePOR
    {${entry.title}} % Certification Name
    {${entry.link!==''?`, \\href{${sanitizeInputForLink(entry.link)}}{Link}`:``}} % Issuer
    {${entry.date}}
    `}).join("")}
    \\resumeSubHeadingListEnd
    \\vspace{-6mm}
  `;
    return newString;
  };
  const parseSkillString = () => {
    if (!includeSkills) {
      return ``;
    }
    const newString = `
    \\section{Skills}
\\vspace{-0.4mm}
\\resumeHeadingSkillStart
${skills.map((skill)=>{
  return `\\resumeSubItem{${sanitizeInput(skill.key)}}{: ${sanitizeInput(skill.value)}}`
}).join("")}
\\resumeHeadingSkillEnd
\\vspace{-2mm}
  `;
    return newString;
  };



  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
      if (FormatType !== NITEnum.None && imageFile === null) {toast.error("Please upload a college logo"); 
        return}
      if (includeSkills && skills.length === 0) {toast.error("Please select at least one skill"); 
        return}
      if (educationEntries.length === 0) {toast.error("Please add at least one education entry"); 
        return}
      if (includeExperience && experienceEntries.length === 0) {toast.error("Please add at least one experience entry"); 
        return}
      if (includeProjects && projectEntries.length === 0) {toast.error("Please add at least one project entry");
        return}
      if (includeAchievements && achievementEntries.length === 0) {toast.error("Please add at least one achievement entry");
        return}
      if (includePositions && positionEntries.length === 0) {toast.error("Please add at least one position entry");
        return}
     
    setIsLoading(true);
    setGlobalId(generateUUID());
  

  const Code:string = String.raw`
\documentclass[a4paper,11pt]{article}

% Package imports
\usepackage{latexsym}
\usepackage{xcolor}
\usepackage{float}
\usepackage{ragged2e}
\usepackage[empty]{fullpage}
\usepackage{wrapfig}
\usepackage{tabularx}
\usepackage{titlesec}
\usepackage{geometry}
\usepackage{marvosym}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{multicol}
\usepackage{graphicx}
% \usepackage{lmodern} % Removed lmodern
\usepackage{palatino} % Added palatino for Palatino font
\usepackage[T1]{fontenc}

\usepackage[hidelinks]{hyperref}
\usepackage{microtype}
\usepackage{tabularx} % Required for tables that stretch to page width
\usepackage{array} % Required for vertical centering in tables

% Color definitions
\definecolor{darkblue}{RGB}{0,0,139}

% Page layout
\geometry{left=1.4cm, top=0.8cm, right=1.2cm, bottom=1cm}
\setlength{\multicolsep}{0pt} 
\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\setlength{\footskip}{4.08pt}

% Hyperlink setup
\hypersetup{
    colorlinks=true,
    linkcolor=darkblue,
    filecolor=darkblue,
    urlcolor=darkblue,
}

% Custom box settings
\usepackage[most]{tcolorbox}
\tcbset{
    frame code={},
    center title,
    left=0pt,
    right=0pt,
    top=0pt,
    bottom=0pt,
    colback=gray!20,
    colframe=white,
    width=\dimexpr\textwidth\relax,
    enlarge left by=-2mm,
    boxsep=4pt,
    arc=0pt,outer arc=0pt,
}

% URL style
\urlstyle{same}

% Text alignment
\raggedright
\setlength{\tabcolsep}{0in}

% Section formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries % \scshape and \bfseries will use Palatino
}{}{0em}{}[\color{black}\titlerule \vspace{-7pt}]

% Custom commands
\newcommand{\resumeItem}[2]{
  \item{
    \textbf{#1}{\hspace{0.5mm}#2 \vspace{-0.5mm}}
  }
}

\newcommand{\resumePOR}[3]{
\vspace{0.5mm}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
        \textbf{#1}\hspace{0.3mm}#2 & \textit{\small{#3}} 
    \end{tabular*}
    \vspace{-2mm}
}

\newcommand{\resumeSubheading}[4]{
\vspace{0.5mm}\item
    \begin{tabular*}{0.98\textwidth}[t]{l@{\extracolsep{\fill}}r}
        \textbf{#1} & \textit{\footnotesize{#4}} \\
        \textit{\footnotesize{#3}} &  \footnotesize{#2}\\
    \end{tabular*}
    \vspace{-2.4mm}
}

\newcommand{\resumeProject}[4]{
\vspace{0.5mm}\item
    \begin{tabular*}{0.98\textwidth}[t]{l@{\extracolsep{\fill}}r}
        \textbf{#1} & \textit{\footnotesize{#3}} \\
        \footnotesize{\textit{#2}} & \footnotesize{#4}
    \end{tabular*}
    \vspace{-2.4mm}
}

\newcommand{\resumeSubItem}[2]{\resumeItem{#1}{#2}\vspace{-4pt}}

\renewcommand{\labelitemi}{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand{\labelitemii}{$\vcenter{\hbox{\tiny$\circ$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=*,labelsep=1mm]}
\newcommand{\resumeHeadingSkillStart}{\begin{itemize}[leftmargin=*,itemsep=1.7mm, rightmargin=2ex]}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=*,labelsep=1mm,itemsep=0.5mm]}

\newcommand{\resumeSubHeadingListEnd}{\end{itemize}\vspace{2mm}}
\newcommand{\resumeHeadingSkillEnd}{\end{itemize}\vspace{-2mm}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-2mm}}
\newcommand{\cvsection}[1]{%
\vspace{2mm}
\begin{tcolorbox}
    \textbf{\large #1}
\end{tcolorbox}
    \vspace{-4mm}
}

\newcolumntype{L}{>{\raggedright\arraybackslash}X}%
\newcolumntype{R}{>{\raggedleft\arraybackslash}X}%
\newcolumntype{C}{>{\centering\arraybackslash}X}%

% Commands for icon sizing and positioning
\newcommand{\socialicon}[1]{\raisebox{-0.05em}{\resizebox{!}{1em}{#1}}}
\newcommand{\ieeeicon}[1]{\raisebox{-0.3em}{\resizebox{!}{1.3em}{#1}}}

% Font options (these are still available if needed for specific parts, but Palatino is now global)
\newcommand{\headerfonti}{\fontfamily{phv}\selectfont} % Helvetica-like (similar to Arial/Calibri)
\newcommand{\headerfontii}{\fontfamily{ptm}\selectfont} % Times-like (similar to Times New Roman)
\newcommand{\headerfontiii}{\fontfamily{ppl}\selectfont} % Palatino (elegant serif)
\newcommand{\headerfontiv}{\fontfamily{pbk}\selectfont} % Bookman (readable serif)
\newcommand{\headerfontv}{\fontfamily{pag}\selectfont} % Avant Garde-like (similar to Trebuchet MS)
\newcommand{\headerfontvi}{\fontfamily{cmss}\selectfont} % Computer Modern Sans Serif
\newcommand{\headerfontvii}{\fontfamily{qhv}\selectfont} % Quasi-Helvetica (another Arial/Calibri alternative)
\newcommand{\headerfontviii}{\fontfamily{qpl}\selectfont} % Quasi-Palatino (another elegant serif option)
\newcommand{\headerfontix}{\fontfamily{qtm}\selectfont} % Quasi-Times (another Times New Roman alternative)
\newcommand{\headerfontx}{\fontfamily{bch}\selectfont} % Charter (clean serif font)

% Define personal information
\newcommand{\name}{${name}} % Your Name
\newcommand{\course}{${educationEntries[0].degree}} 
\newcommand{\phone}{${phoneNumber}} % Your Phone Number
\newcommand{\emailb}{${email}} % Email


\begin{document}
% \fontfamily{cmr}\selectfont % Removed to allow Palatino to be the default

%----------HEADING-----------------
\parbox{2.35cm}{%
${FormatType!==NITEnum.None ? `\\includegraphics[width=2cm]{image-${globalId}}` : ""}
}
\parbox{\dimexpr\linewidth${FormatType !== NITEnum.None ? "-2.8cm" : ""}\relax}{
\begin{tabularx}{\linewidth}{L r}
  \textbf{\LARGE \scshape \name} & \phone \\ % Name styled with small caps
  \course & \href{mailto:\emailb}{\emailb} \\
  ${sanitizeInput(educationEntries[0].branch)} & \href{${sanitizeInputForLink(linkedInLink)}}{${sanitizeInputForDisplay(linkedInLink)}} \\
  ${sanitizeInput(educationEntries[0].instituteName)}
  & \href{${sanitizeInputForLink(githubLink)}}{${sanitizeInputForDisplay(githubLink)}} \\
\end{tabularx}
}
\vspace{-2mm}

\section{Education} % Removed \textbf{}
\vspace{1mm}
\setlength{\tabcolsep}{5pt}
\begin{tabularx}{\textwidth}{|>{\centering\arraybackslash}X|>{\centering\arraybackslash}p{8cm}|>{\centering\arraybackslash}p{3cm}|>{\centering\arraybackslash}p{2.5cm}|}
  \hline
  \textbf{Degree/Certificate} & \textbf{Institute/Board} & \textbf{CGPA/Percentage} & \textbf{Year} \\
  \hline
  ${parseEducationString()}
\end{tabularx}
\vspace{-4mm}

%---------Experience Section---------
${parseExperienceString()}


%-----------Projects-----------------
${parseProjectString()}

%-----------Skills-----------------
${parseSkillString()}

%-----------Certifications-----------------
${parseCertificateString()}



%-----------ACHIEVEMENTS-----------------
${parseAchievementString()}

%-----------Positions of Responsibility-----------------
${parseClubString()}
    
\end{document}
  `

  const formData = new FormData()
    formData.append('payload', Code)
    if(FormatType !== NITEnum.None && imageFile){
      formData.append('imageFile', imageFile)
    }
    formData.append('globalId', globalId)
    api.post('/' , formData, {responseType: 'blob',
        headers:{
        'Content-Type': 'multipart/form-data'
    }})
    .then((res)=>{
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
      toast.success('Resume generated successfully!');
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
    setName(data.name || '');
    setEmail(data.email || '');
    setPhoneNumber(data.phoneNumber || '');
    setGithubLink(data.githubLink || '');
    setLinkedInLink(data.linkedInLink || '');
    setEducationEntries(data.educationEntries || []);
    setExperienceEntries(data.experienceEntries || []);
    setProjectEntries(data.projectEntries || []);
    setSkills(data.skills || []);
    setCertificateEntries(data.certificateEntries || []);
    setAchievementEntries(data.achievementEntries || []);
    setPositionEntries(data.positionEntries || []);
    setIncludeSkills(data.includeSkills || false);
    setIncludeCertificates(data.includeCertificates || false);
    setIncludeAchievements(data.includeAchievements || false);
    setIncludePositions(data.includePositions || false);
    setIncludeProjects(data.includeProjects || false);
    setIncludeExperience(data.includeExperience || false);
    setTriggerSubmit(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 font-sans min-h-screen w-[100%] overflow-x-hidden bg-gray-950">
        <form
          ref={formRef}
          action=""
          onSubmit={handleFormSubmit}
          className="bg-gray-900/50 mt-15 backdrop-blur-md shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 w-[100%] border border-white/10"
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
             {FormatType !== NITEnum.None && <div className="bg-white/5 p-6 rounded-xl shadow border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-light text-white">
                    {FormatType === NITEnum.Logo ? "College Logo" : "Profile Photo"}
                  </h3>
                  <div
                    className={`relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors `}
                    onClick={() => setModalOpen(true)}
                  >
                    {imageFile ? (
                      <>
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                          }}
                          className="absolute bottom-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="text-white text-sm text-center p-2">
                        Click to add photo
                      </div>
                    )}
                  </div>
                 
                </div>
              </div>}
              {modalOpen && (
                <Modal
                  updateAvatar={updateAvatar}
                  closeModal={() => setModalOpen(false)}
                  isCircle={false}
                />
              )}
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
                    placeholder="+91-9876543210"
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
                    <a className="text-blue-500"  href="https://youtu.be/oga5s3Yngc8?si=XhzKVeKdUMhG6hrg">
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
                    placeholder="linkedin.com/in/adityav1313/"
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
                    placeholder="github.com/adi13v"
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                  />
                </Tooltip>
              </div>
              
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-white">Education</h2>
            </div>
            <div className="space-y-6">
              {educationEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-light text-white">
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
                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Institute Name<span className="text-red-500">*</span>{" "}
                        <span className=" mx-0.5 text-xs text-white">
                          Tip: Write Institute Name without any abbreviations.
                        </span>
                      </label>
                      <Tooltip
                        title="Not Allowed Here"
                        message="Making Text Bold is not allowed here"
                      >
                        <input
                          type="text"
                          placeholder="Massachusetts Institute of Technology"
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
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                          required
                        />
                      </Tooltip>
                    </div>

                    {<div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Degree<span className="text-red-500">*</span> <span className="text-xs text-white">Tip: For School write Secondary or Senior Secondary</span>
                      </label>
                      <Tooltip
                        title="Not Allowed Here"
                        message="Making Text Bold is not allowed here"
                      >
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
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                          required
                        />
                      </Tooltip>
                    </div>}

                     <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Degree (In Abbrevation){" "}
                        <span className=" mx-0.5 text-xs text-white">
                          Ex. : B.Tech,MBA (Leave Empty For School)
                        </span>
                      </label>
                      <Tooltip
                        title="Not Allowed Here"
                        message="Making Text Bold is not allowed here"
                      >
                        <input
                          type="text"
                          value={entry.degreeAbbreviation}
                          onChange={(e) =>
                            handleInputChange(
                              setEducationEntries,
                              educationEntries,
                              index,
                              "degreeAbbreviation",
                              e.target.value
                            )
                          }
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                        />
                      </Tooltip>
                    </div>

                    {index==0 && <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Branch<span className="text-red-500">*</span>{" "}
                        <span className=" mx-0.5 text-xs text-white">
                          Tip: Write your specialization or major.
                        </span>
                      </label>
                      <Tooltip
                        title="Not Allowed Here"
                        message="Making Text Bold is not allowed here"
                      >
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
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                          required
                        />
                      </Tooltip>
                    </div>}

                  <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Branch (In Abbreviation){" "}
                        <span className=" mx-0.5 text-xs text-white">
                          Ex. CSE,Hons. (Leave Empty For School)
                        </span>
                      </label>
                      <Tooltip
                        title="Not Allowed Here"
                        message="Making Text Bold is not allowed here"
                      >
                        <input
                          type="text"
                          value={entry.branchAbbreviation}
                          onChange={(e) =>
                            handleInputChange(
                              setEducationEntries,
                              educationEntries,
                              index,
                              "branchAbbreviation",
                              e.target.value
                            )
                          }
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                          
                        />
                      </Tooltip>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <Tooltip
                        title="Not Allowed Here"
                        message="Making Text Bold is not allowed here"
                      >
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
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                          required
                        />
                      </Tooltip>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Month Of Passing<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={entry.endDate}
                        onChange={(e) =>
                          handleInputChange(
                            setEducationEntries,
                            educationEntries,
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10`}
                        required
                      />
                          
                    </div>

                    <div className="mb-4 md:col-span-2">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Grade Format<span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-4 mb-2">
                        <label className="inline-flex items-center text-[#44BCFF]">
                          <input
                            type="radio"
                            name={`gradeType-${entry.id}`}
                            checked={entry.gradeType.toUpperCase() === "CGPA"}
                            onChange={() =>
                              handleInputChange(
                                setEducationEntries,
                                educationEntries,
                                index,
                                "gradeType",
                                "cgpa"
                              )
                            }
                            className="form-radio h-4 w-4 text-white focus:ring-white"
                          />
                          <span className="ml-2">CGPA</span>
                        </label>
                        <label className="inline-flex items-center text-[#44BCFF]">
                          <input
                            type="radio"
                            name={`gradeType-${entry.id}`}
                            checked={entry.gradeType.toUpperCase() === "PERCENTAGE"}
                            onChange={() =>
                              handleInputChange(
                                setEducationEntries,
                                educationEntries,
                                index,
                                "gradeType",
                                "percentage"
                              )
                            }
                            className="form-radio h-4 w-4 text-white focus:ring-white"
                          
                          />
                          <span className="ml-2">Percentage</span>
                        </label>
                      </div>

                      {entry.gradeType.toUpperCase() === "CGPA" ? (
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            CGPA
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="10"
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
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Percentage
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
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
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  addEntry(setEducationEntries, defaultEducationEntry)
                }
                className="px-4 py-2 flex items-center gap-2  transition-colors"
              >
                <PlusIcon className="w-4 h-4" /> Add Education
              </button>
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
                            Work Details:{" "}
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
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                               
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
                    addEntry(setExperienceEntries, defaultExperienceEntry1)
                  }
                  className="px-4 py-2 flex items-center gap-2 bg-white text-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Experience
                </button>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8 border-b border-white/10 pb-6">
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
            <div
              className={`${
                !includeProjects ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeProjects && (
                <div className="space-y-6">
                  {projectEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                    >
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
                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Project Name<span className="text-red-500">*</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
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
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Description<span className="text-red-500">*</span> <span className="text-xs text-white">Tip:Keep it Very Short</span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              value={entry.description}
                              onChange={(e) =>
                                handleInputChange(
                                  setProjectEntries,
                                  projectEntries,
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Tools Used<span className="text-red-500">*</span>{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: Separate tools with commas (e.g., React, Node.js, MongoDB)
                            </span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              value={entry.toolsUsed}
                              onChange={(e) =>
                                handleInputChange(
                                  setProjectEntries,
                                  projectEntries,
                                  index,
                                  "toolsUsed",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Link Title{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: The text to display for the link (e.g., "GitHub", "Live Demo", etc.)
                            </span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              value={entry.linkTitle}
                              onChange={(e) =>
                                handleInputChange(
                                  setProjectEntries,
                                  projectEntries,
                                  index,
                                  "linkTitle",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Project Link{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: The actual URL of the project
                            </span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
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
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
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
                                setProjectEntries,
                                projectEntries,
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          />
                        </div>

                        <div className="mb-4">
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
                            className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10 ${
                              entry.endDate === "Present" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            required
                          />
                          <div className="mt-2">
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
                            <label className="ml-2 text-white">Currently Working</label>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <h4 className="text-md font-semibold mb-2 text-[#44BCFF]">
                            Work Done{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: Use Bold For Highlighting but don't overdo it
                            </span>
                          </h4>
                          {entry.workDone.map((work, workIndex) => (
                            <div
                              key={`${entry.id}-work-${workIndex}`}
                              className="mb-2 flex items-center space-x-4"
                            >
                              <input
                                type="text"
                                value={work}
                                onKeyDown={(e) =>
                                  handleKeyActionOnSublist(
                                    e,
                                    setProjectEntries,
                                    "workDone",
                                    index,
                                    workIndex
                                  )
                                }
                                onChange={(e) =>
                                  handleSubListInputChange(
                                    setProjectEntries,
                                    index,
                                    "workDone",
                                    workIndex,
                                    e.target.value
                                  )
                                }
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeItemFromSubList(
                                    setProjectEntries,
                                    index,
                                    "workDone",
                                    workIndex
                                  )
                                }
                                className="px-2 py-1 text-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                              >
                                <XIcon className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          ))}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                addItemToSubList(
                                  setProjectEntries,
                                  index,
                                  "workDone",
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
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => addEntry(setProjectEntries, defaultProjectEntry1)}
                disabled={!includeProjects}
                className={`px-4 py-2 flex items-center gap-2 bg-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  !includeProjects ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              >
                <PlusIcon className="w-4 h-4" /> Add Project
              </button>
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
                          placeholder="Skill Type (e.g., Frameworks)"
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
                        placeholder="Skills (e.g., React, Node)"
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
                  onClick={() => addEntry(setSkills, defaultSkillEntry1)}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Skill
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
                              className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                             
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Date<span className="text-red-500">*</span>{" "}
                           
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="month"
                              value={entry.date}
                              onChange={(e) =>
                                handleInputChange(
                                  setCertificateEntries,
                                  certificateEntries,
                                  index,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
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
                    addEntry(setCertificateEntries, defaultCertificateEntry1)
                  }
                  className="px-4 py-2 flex items-center gap-2 bg-white text-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Certificate
                </button>
              </div>
            </div>
          </div>

           {/* Honors and Achievements Section */}
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
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">Title<span className="text-red-500">*</span></label>
                          <input
                            type="text"
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
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">Link Title</label>
                          <input
                            type="text"
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
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">Link</label>
                          <input
                            type="text"
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
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => addEntry(setAchievementEntries, defaultAchievementEntry1)}
                disabled={!includeAchievements}
                className={`px-4 py-2 flex items-center gap-2 bg-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  !includeAchievements ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              >
                <PlusIcon className="w-4 h-4" /> Add Achievement
              </button>
            </div>
          </div>

          {/* Positions of Responsibility Section */}
          <div className="mb-8 border-b  pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">
                Positions of Responsibility
              </h2>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePositions}
                  onChange={(e) => setIncludePositions(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includePositions ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includePositions && (
                <div className="space-y-6">
                  {positionEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white/5 p-6 rounded-xl shadow border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-light text-[#44BCFF]">
                          Position #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeEntry(setPositionEntries, index)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">Position Name<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={entry.positionName}
                            onChange={(e) =>
                              handleInputChange(
                                setPositionEntries,
                                positionEntries,
                                index,
                                "positionName",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">Organization Name<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={entry.organizationName}
                            onChange={(e) =>
                              handleInputChange(
                                setPositionEntries,
                                positionEntries,
                                index,
                                "organizationName",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">Date<span className="text-red-500">*</span></label>
                          <input
                            type="month"
                            value={entry.date}
                            onChange={(e) =>
                              handleInputChange(
                                setPositionEntries,
                                positionEntries,
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                         />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => addEntry(setPositionEntries, defaultPositionEntry1)}
                disabled={!includePositions}
                className={`px-4 py-2 flex items-center gap-2 bg-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  !includePositions ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              >
                <PlusIcon className="w-4 h-4" /> Add Position
              </button>
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
        <PdfBox pdfUrl={pdfUrl} defaultPdfUrl={FormatType === NITEnum.Logo ? NIT_Resume_With_Logo : FormatType === NITEnum.Photo ? NIT_Resume_With_Photo : NIT_Resume_Without_Photo} />
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
          resumeType= {"NIT_RESUME"}
        />
      )}
    </>
  );
}

export default NITResume;
