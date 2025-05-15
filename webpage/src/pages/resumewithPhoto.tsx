/* eslint-disable react-hooks/exhaustive-deps */
import "../App.css";
import axios from "axios";
import { useState, useRef, useEffect, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import Resume_With_photo_Photo_Enabled from '../assets/Resume_With_Photo.pdf';
import Resume_With_photo_Photo_Disabled from '../assets/Resume_with_photo_Photo_Disabled.pdf';
import Tooltip from "../components/Tooltip";
import Modal from "../components/Modal";
import ChatbotModal from "../components/ChatbotModal";
import { XIcon } from "lucide-react";
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
} from "../helper/helperFunctions";
import { EducationDetails, ExperienceDetails, ProjectDetails, SkillDetails, HonorDetails, ClubDetails, CertificateDetails, FormDataStore } from "../types/resumeWithPhoto";
import PdfBox from "../components/PdfBox";
const api = axios.create({
  baseURL: `https://resume-builder-aditya.onrender.com`,
});


const defaultEducationEntry: EducationDetails = {
  id: "edu1",
  instituteName: "Placeholder Institute of Technology",
  degree: "Bachelor of Technology",
  branch: "Computer Science and Engineering",
  location: "Bangalore, India",
  startDate: "2019-08",
  endDate: "2023-05",
  gradeType: "CGPA",
  cgpa: "9.1",
  percentage: "",
};

const defaultEducationEntry2: EducationDetails = {
  id: "edu2",
  instituteName: "Placeholder Senior Secondary School",
  degree: "Senior Secondary",
  branch: "",
  location: "Delhi, India",
  startDate: "2017-06",
  endDate: "2019-05",
  gradeType: "Percentage",
  cgpa: "",
  percentage: "94",
};

const defaultEducationEntry3: EducationDetails = {
  id: "edu3",
  instituteName: "Placeholder Secondary School",
  degree: "Secondary",
  branch: "",
  location: "Delhi, India",
  startDate: "2015-06",
  endDate: "2017-05",
  gradeType: "Percentage",
  cgpa: "",
  percentage: "96",
};

const defaultExperienceEntry: ExperienceDetails = {
  id: "exp1",
  jobTitle: "Software Engineering Intern",
  companyName: "Placeholder Technologies Pvt Ltd",
  location: "Remote",
  startDate: "2022-05",
  endDate: "2022-08",
  workList: [
    "Developed scalable REST APIs using FastAPI and PostgreSQL, reducing response time by 30%",
    "Collaborated in an Agile team to ship production-level features for a fintech dashboard used by 10,000+ users",
    "Integrated Docker-based CI/CD pipelines to streamline deployment across multiple environments",
  ],
};

const defaultExperienceEntry2: ExperienceDetails = {
  id: "exp2",
  jobTitle: "Backend Developer (Freelance)",
  companyName: "StartupHub Inc.",
  location: "Remote",
  startDate: "2021-12",
  endDate: "2022-03",
  workList: [
    "Designed a microservices-based architecture to decouple services and enhance system modularity",
    "Implemented JWT authentication, OAuth2, and role-based access control improving platform security",
    "Increased API performance by 45% through async optimization and query indexing",
  ],
};

const defaultProjectEntry: ProjectDetails = {
  id: "proj1",
  projectName: "AI Resume Optimizer",
  projectLinkTitle: "Project Link",
  projectLink: "https://www.placeholder.com",
  startDate: "2023-01",
  endDate: "2023-03",
  featureList: [
    "Built a resume parsing tool with OpenAI API to optimize ATS score using NLP techniques",
    "Enabled LaTeX-based PDF resume generation with image and data upload",
    "Integrated file cleanup and async subprocess management using FastAPI background tasks",
  ],
};

const defaultProjectEntry2: ProjectDetails = {
  id: "proj2",
  projectName: "Decentralized Chat App",
  projectLinkTitle: "GitHub Link",
  projectLink: "https://www.placeholder.com",
  startDate: "2022-07",
  endDate: "2022-10",
  featureList: [
    "Implemented peer-to-peer WebRTC-based video calling and Socket.IO-based real-time messaging",
    "Built a responsive frontend with React and TailwindCSS, supporting light/dark modes",
    "Used MongoDB Atlas for scalable chat history storage with encryption",
  ],
};

const defaultSkillEntry: SkillDetails = {
  id: "sk1",
  key: "Languages",
  value: "Python, JavaScript, C++",
};

const defaultSkillEntry2: SkillDetails = {
  id: "sk2",
  key: "Frameworks",
  value: "FastAPI, React, Node.js, Express",
};

const defaultSkillEntry3: SkillDetails = {
  id: "sk3",
  key: "DevOps",
  value: "Docker, GitHub Actions, Render, NGINX",
};

const defaultSkillEntry4: SkillDetails = {
  id: "sk4",
  key: "Tools",
  value: "Postman, Figma, VS Code, MongoDB Compass",
};

const defaultSkillEntry5: SkillDetails = {
  id: "sk5",
  key: "Cloud",
  value: "AWS EC2, S3, Firebase, Railway",
};

const defaultHonorEntry: HonorDetails = {
  id: "hon1",
  title: "Smart India Hackathon Finalist",
  date: "2022-08",
  description: "Developed an AI-driven compliance audit tool that reached top 5 among 500+ national teams",
  linkTitle: "Certificate Link",
  link: "https://www.placeholder.com",
};

const defaultHonorEntry2: HonorDetails = {
  id: "hon2",
  title: "CodeChef Long Challenge Top 1%",
  date: "2023-04",
  description: "Achieved global rank under 150 in April Long Challenge among 20,000+ coders",
  linkTitle: "Contest Link",
  link: "https://www.placeholder.com",
};

const defaultClubEntry: ClubDetails = {
  id: "club1",
  title: "Technical Head",
  societyName: "Coding Club - TechFusion",
  startDate: "2021-07",
  endDate: "2023-03",
  achievements: [
    "Led workshops on Git, DevOps, and Competitive Programming with 300+ participants",
    "Mentored 10+ juniors in open-source development under Hacktoberfest",
  ],
};

const defaultClubEntry2: ClubDetails = {
  id: "club2",
  title: "Technical Head",
  societyName: "Coding Club - TechFusion",
  startDate: "2021-07",
  endDate: "2023-03",
  achievements: [
    "Led workshops on Git, DevOps, and Competitive Programming with 300+ participants",
    "Mentored 10+ juniors in open-source development under Hacktoberfest",
  ],
};

const defaultCertificateEntry: CertificateDetails = {
  id: "cert1",
  title: "AWS Certified Cloud Practitioner",
  link: "https://www.placeholder.com",
};

const defaultCertificateEntry2: CertificateDetails = {
  id: "cert2",
  title: "Full Stack Development - Coursera",
  link: "https://www.placeholder.com",
};

function ResumeWithPhoto({defaultPhotoSetting}:{defaultPhotoSetting:boolean}) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [educationEntries, setEducationEntries] = useState<EducationDetails[]>([
    defaultEducationEntry,
    defaultEducationEntry2,
    defaultEducationEntry3,
  ]);

  const [experienceEntries, setExperienceEntries] = useState<
    ExperienceDetails[]
  >([defaultExperienceEntry, defaultExperienceEntry2]);
  const [projectEntries, setProjectEntries] = useState<ProjectDetails[]>([
    defaultProjectEntry,
    defaultProjectEntry2,
  ]);
  const [skills, setSkills] = useState<SkillDetails[]>([
    defaultSkillEntry,
    defaultSkillEntry2,
    defaultSkillEntry3,
    defaultSkillEntry4,
    defaultSkillEntry5,
  ]);
  const [name, setName] = useState<string>("Snoopy Matthew");
  const [email, setEmail] = useState<string>("snoopymatthew@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState<string>("+91-9876543210");
  const [portfolioLink, setPortfolioLink] = useState<string>("myportfolio.com");
  const [githubLink, setGithubLink] = useState<string>("github.com/snoopymatthew");
  const [linkedInLink, setLinkedInLink] = useState<string>("linkedin.com/in/snoopymatthew");
  const [globalId, setGlobalId] = useState<string>(generateUUID());
  
  const storageKeyName = `formData-${window.location.pathname}`;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [honorEntries, setHonorEntries] = useState<HonorDetails[]>([
    defaultHonorEntry,
    defaultHonorEntry2,
  ]);
  const [clubEntries, setClubEntries] = useState<ClubDetails[]>([
    defaultClubEntry,
    defaultClubEntry2,
  ]);
  const [certificateEntries, setCertificateEntries] = useState<
    CertificateDetails[]
  >([defaultCertificateEntry, defaultCertificateEntry2]);

  // Add new state variables for section toggles
  const [includeExperience, setIncludeExperience] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeSkills, setIncludeSkills] = useState(true);
  const [includeHonors, setIncludeHonors] = useState(true);
  const [includeClubs, setIncludeClubs] = useState(true);
  const [includeCertificates, setIncludeCertificates] = useState(true);
  const [includeProjectLinks, setIncludeProjectLinks] = useState(true);
  const [includePicture, setIncludePicture] = useState(defaultPhotoSetting);
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
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
      portfolioLink: portfolioLink,
      educationEntries: educationEntries,
      experienceEntries: experienceEntries,
      projectEntries: projectEntries,
      skills: skills,
      honorEntries: honorEntries,
      clubEntries: clubEntries,
      certificateEntries: certificateEntries,
      includeExperience: includeExperience,
      includeProjects: includeProjects,
      includeSkills: includeSkills,
      includeHonors: includeHonors,
      includeClubs: includeClubs,
      includeCertificates: includeCertificates,
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
    honorEntries,
    clubEntries,
    certificateEntries,
    includeExperience,
    includeProjects,
    includeSkills,
    includeHonors,
    includeClubs,
    includeCertificates,
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
      setEducationEntries(store.educationEntries);
      setExperienceEntries(store.experienceEntries);
      setProjectEntries(store.projectEntries);
      setSkills(store.skills);
      setHonorEntries(
        store.honorEntries || [defaultHonorEntry, defaultHonorEntry2]
      );
      setClubEntries(
        store.clubEntries || [defaultClubEntry, defaultClubEntry2]
      );
      setCertificateEntries(
        store.certificateEntries || [
          defaultCertificateEntry,
          defaultCertificateEntry2,
        ]
      );
      setIncludeExperience(store.includeExperience);
      setIncludeProjects(store.includeProjects);
      setIncludeSkills(store.includeSkills);
      setIncludeHonors(store.includeHonors);
      setIncludeClubs(store.includeClubs);
      setIncludeCertificates(store.includeCertificates);
      setPrompt(store.prompt || "");
    }
  }, []);


  useEffect(()=>{
    if(includeProjects){
      setIncludeProjectLinks(true)
    }
    else{
      setIncludeProjectLinks(false)
    }
  },[includeProjects])


  const setDefaultPdf = useMemo(() => {
    console.log("hello")
    if(includePicture){
      return Resume_With_photo_Photo_Enabled
    }
    else{
      return Resume_With_photo_Photo_Disabled
    }
  },[includePicture])

  const parseEducationString = () => {
    const newString: string | void = educationEntries
      .map((entry) => {
        return `\\CVSubheading
    {{${sanitizeInput(entry.degree)} ${entry.branch===''?``: `$|$`} \\emph{\\small{${sanitizeInput(
          entry.branch
        )}}}}} {${formatMonthYear(entry.startDate)} -- ${formatMonthYear(
          entry.endDate
        )}}
    {${sanitizeInput(entry.instituteName)} $|$ ${sanitizeInput(
          entry.location
        )}}{${
          entry.gradeType.toUpperCase() === "CGPA"
            ? `CGPA: ${entry.cgpa}`
            : `Percentage: ${entry.percentage}`
        }}
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
        return `\\CVSubheading
    {${sanitizeInput(entry.jobTitle)}}{${formatMonthYear(
          entry.startDate
        )} -- ${formatMonthYear(entry.endDate)}}
    {${sanitizeInput(entry.companyName)}}{${sanitizeInput(entry.location)}}
    \\CVItemListStart
      ${entry.workList
        .map((work) => {
          return `\\CVItem{${sanitizeInput(work)}}`;
        })
        .join("")}
    \\CVItemListEnd
      `;
      })
      .join("");
    newString = `\\section{Work Experience}
  \\CVSubHeadingListStart
  ${newString}
  \\CVSubHeadingListEnd
  `;
    return newString;
  };

  const parseProjectString = () => {
    if (!includeProjects) {
      return ``;
    }

    let newString = "";
    if (includeProjectLinks) {
      newString = projectEntries
        .map((entry) => {
          return `\\CVSubheading
    {${sanitizeInput(entry.projectName)}}{${formatMonthYear(
            entry.startDate
          )} - ${formatMonthYear(entry.endDate)}}
    {\\href{${sanitizeInputForLink(
      entry.projectLink
    )}}{\\color{blue}${sanitizeInputForDisplay(
            sanitizeInput(entry.projectLinkTitle)
          )}}}{}
    \\CVItemListStart
      ${entry.featureList
        .map((feature) => {
          return `\\CVItem{${sanitizeInput(feature)}}`;
        })
        .join("")}
    \\CVItemListEnd
`;
        })
        .join("");
    } else {
      newString = projectEntries
        .map((entry) => {
          return `\\ProjectEntry{${entry.projectName}}{${formatMonthYear(
            entry.startDate
          )} - ${formatMonthYear(entry.endDate)}}
  \\CVItemListStart
    ${entry.featureList
      .map((feature) => {
        return `\\CVItem{${sanitizeInput(feature)}}`;
      })
      .join("")}
  \\CVItemListEnd
`;
        })
        .join("");
    }

    newString =
      `
\\section{Projects}
\\CVSubHeadingListStart
` +
      newString +
      `\\CVSubHeadingListEnd
`;

    return newString;
  };

  const parseHonorString = () => {
    if (!includeHonors) {
      return ``;
    }

    const newString = `
\\section{Honors and Achievments}
\\CVSubHeadingListStart
  ${honorEntries
    .map((entry) => {
      return `\\CVSubheading
    {${sanitizeInput(entry.title)}}{${formatMonthYear(entry.date)}}
    {${sanitizeInput(entry.description)}}{\\href{${sanitizeInputForLink(
        entry.link
      )}}{\\color{blue}${sanitizeInputForDisplay(
        sanitizeInput(entry.linkTitle)
      )}}}
    `;
    })
    .join("")}
\\CVSubHeadingListEnd
`;
    return newString;
  };

  const parseClubString = () => {
    if (!includeClubs) {
      return ``;
    }
    const newString = `
  \\section{Clubs And Societies}
  \\CVSubHeadingListStart
  ${clubEntries
    .map((entry) => {
      return `\\CVSubheading
    {${sanitizeInput(entry.title)}}{${formatMonthYear(
        entry.startDate
      )} - ${formatMonthYear(entry.endDate)}}
    {${sanitizeInput(entry.societyName)}}{}
    \\CVItemListStart
    ${entry.achievements.map((achievement)=>{
    return `\\CVItem{${sanitizeInput(achievement)}}`
    }).join("")}
    \\CVItemListEnd
    `;
    })
    .join("")}
  \\CVSubHeadingListEnd
  `;
    return newString;
  };

  const parseCertificateString = () => {
    if (!includeCertificates) {
      return ``;
    }
    const newString = `
  \\section{Certifications}
  \\CVSubHeadingListStart
  \\item \\small
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      ${certificateEntries
        .map((entry) => {
          return `
        \\textbf{${sanitizeInput(entry.title)}} & 
        ${entry.link!==''?`\\href{${sanitizeInputForLink(
          entry.link
        )}}{\\color{blue}Certificate Link}`:``} \\\\
        `;
        })
        .join("")}
    \\end{tabular*}
    \\end{itemize}
  `;
    return newString;
  };
  const parseSkillString = () => {
    if (!includeSkills) {
      return ``;
    }
    const newString = `
  \\section{Skills}
  \\begin{itemize}[leftmargin=0.5cm, label={}]
    \\small{\\item{
      ${skills
        .map((entry) => {
          return `\\textbf{${sanitizeInput(entry.key)}}{: ${sanitizeInput(
            entry.value
          )}}`;
        })
        .join(" \\\\ ")}
      }}
      \\end{itemize}
  `;
    return newString;
  };

  const addLineBreakInSpacing = (input: string) => {
    return input.replace(/ /g, "\\\\ ");
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
       if (educationEntries.length === 0) {toast.error("Please add at least one education entry");
      return
       }
      if (includePicture && imageFile === null) {toast.error("Please upload a profile picture");
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
  

  const Code:string = String.raw`
  \documentclass[A4,11pt]{article}

  \usepackage{latexsym}
  \usepackage[empty]{fullpage}
  \usepackage{titlesec}
  \usepackage{marvosym}
  \usepackage[usenames,dvipsnames]{color}
  \usepackage{verbatim}
  \usepackage{enumitem}
  \usepackage[hidelinks]{hyperref}
  \usepackage[english]{babel}
  \usepackage{tabularx}
  \usepackage{tikz}
  \input{glyphtounicode}
  \usepackage{palatino}

  % Adjust margins
  \addtolength{\oddsidemargin}{-1cm}
  \addtolength{\evensidemargin}{-1cm}
  \addtolength{\textwidth}{2cm}
  \addtolength{\topmargin}{-1cm}
  \addtolength{\textheight}{2cm}

  \urlstyle{same}

  \raggedbottom
  \raggedright
  \setlength{\tabcolsep}{0cm}

  % Sections formatting
  \titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
  }{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

  % Ensure that .pdf is machine readable/ATS parsable
  \pdfgentounicode=1

  %-----CUSTOM COMMANDS FOR FORMATTING SECTIONS----------------------------------

  \newcommand{\ProjectEntry}[2]{%
    \item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
    \end{tabular*}\vspace{-5pt}
  }

  \newcommand{\CVItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
  }

  \newcommand{\CVSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \small#3 & \small #4 \\
    \end{tabular*}\vspace{-7pt}
  }

  \newcommand{\CVSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \text{\small#1} & \text{\small #2} \\
    \end{tabular*}\vspace{-7pt}
  }

  \newcommand{\CVSubItem}[1]{\CVItem{#1}\vspace{-4pt}}

  \renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

  \newcommand{\CVSubHeadingListStart}{\begin{itemize}[leftmargin=0.5cm, label={}]}
  % \newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]} % Uncomment for US
  \newcommand{\CVSubHeadingListEnd}{\end{itemize}}
  \newcommand{\CVItemListStart}{\begin{itemize}}
  \newcommand{\CVItemListEnd}{\end{itemize}\vspace{-5pt}}

  %------------------------------------------------------------------------------
  % CV STARTS HERE  %
  %------------------------------------------------------------------------------
  \begin{document}

  %-----HEADING------------------------------------------------------------------
  \begin{comment}
  In Europe it is common to include a picture of ones self in the CV. Select
  which heading appropriate for the document you are creating.
  \end{comment}

  ${includePicture? `
    \\begin{minipage}[c]{0.05\\textwidth}
  \\-\\
  \\end{minipage}
  \\begin{minipage}[c]{0.2\\textwidth}
  \\begin{tikzpicture}
    \\clip (0,0) circle (1.75cm);
    \\node at (0,0) {\\includegraphics[width = 4cm]{image-${globalId}}};
    % if necessary the picture may be moved by changing the at (coordinates)
    % width defines the 'zoom' of the picture
  \\end{tikzpicture}
  \\hfill\\vline\\hfill
  \\end{minipage}
  \\begin{minipage}[c]{0.4\\textwidth}
  \\textbf{\\Huge \\scshape{${addLineBreakInSpacing(sanitizeInput(name))}}} \\\\ \\vspace{1pt}
    \\small{${sanitizeInput(phoneNumber)}} \\\\
    \\href{mailto:${sanitizeInput(email)}}{\\underline{${sanitizeInput(email)}}}\\\\
    ${linkedInLink!=='' ? `\\href{${sanitizeInputForLink(linkedInLink)}}{\\underline{${sanitizeInputForDisplay(linkedInLink)}}\\\\}` : ``}${githubLink!=='' ? `\\href{${sanitizeInputForLink(githubLink)}}{\\underline{${sanitizeInputForDisplay(githubLink)}}\\\\}`:``}${portfolioLink!==''?`\\href{${sanitizeInputForLink(portfolioLink)}}{\\underline{${sanitizeInputForDisplay(portfolioLink)}}}` : ``}
  \\end{minipage}
    ` : `
     %Without picture
  \\begin{center}
      \\textbf{\\Huge \\scshape ${sanitizeInput(name)}} \\\\ \\vspace{1pt} %\\scshape sets small capital letters, remove if desired
      \\small ${sanitizeInput(phoneNumber)} $|$
      \\href{mailto:${sanitizeInput(email)}}{\\underline{${sanitizeInput(email)}}} ${portfolioLink ? `$|$ \\href{${sanitizeInputForLink(portfolioLink)}}{\\underline{${sanitizeInputForDisplay(portfolioLink)}}}`:``} ${linkedInLink || githubLink ? ` $|$ \\\\ ` : ``}
      ${linkedInLink ? `\\href{${sanitizeInputForLink(linkedInLink)}}{\\underline{${sanitizeInputForDisplay(linkedInLink)}}}` : ``} ${githubLink && linkedInLink ? ` $|$` : ``}
      % you should adjust you linked in profile name to be professional and recognizable
      ${githubLink ? `\\href{${sanitizeInputForLink(githubLink)}}{\\underline{${sanitizeInputForDisplay(githubLink)}}}`:``}
  \\end{center}
    `}


  %-----EDUCATION----------------------------------------------------------------
  \section{Education}
  \CVSubHeadingListStart
  ${parseEducationString()}
  \CVSubHeadingListEnd

  %-----WORK EXPERIENCE----------------------------------------------------------
  ${parseExperienceString()}
  %-----PROJECTS AND RESEARCH----------------------------------------------------

  ${parseProjectString()}

  %-----HONORS AND AWARDS--------------------------------------------------------
  ${parseHonorString()}

  %-----CLUBS AND SOCIETIES--------------------------------------------------------
  ${parseClubString()}

  %-----Certifications-------------------------------------------------------------------
  ${parseCertificateString()}

  %-----SKILLS-------------------------------------------------------------------
  ${parseSkillString()}

  %------------------------------------------------------------------------------
  \end{document}`

  const formData = new FormData()
    formData.append('payload', Code)
    if(imageFile && includePicture){
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
    setPortfolioLink(data.portfolioLink || '');
    setEducationEntries(data.educationEntries || []);
    setExperienceEntries(data.experienceEntries || []);
    setProjectEntries(data.projectEntries || []);
    setSkills(data.skills || []);
    setHonorEntries(data.honorEntries || []);
    setClubEntries(data.clubEntries || []);
    setCertificateEntries(data.certificateEntries || []);
    setIncludeClubs(data.includeClubs || false);
    setIncludeCertificates(data.includeCertificates || false);
    setIncludeProjects(data.includeProjects || false);
    setIncludeSkills(data.includeSkills || false);
    setIncludeExperience(data.includeExperience || false);
    setIncludeHonors(data.includeHonors || false);
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
              <div className="bg-white/5 p-6 rounded-xl shadow border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-light text-white">
                    Profile Photo
                  </h3>
                  <div
                    className={`relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-white/5 flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors ${
                      !includePicture ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => includePicture && setModalOpen(true)}
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
                        {includePicture
                          ? "Click to add photo"
                          : "Photo disabled"}
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePicture}
                      onChange={(e) => {
                        setIncludePicture(e.target.checked);
                        if (!e.target.checked) {
                          setImageFile(null);
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-green-600 border-[#948979] focus:ring-2 focus:ring-green-400"
                    />
                    <span className="ml-2 text-[#44BCFF]">
                      Include in Resume
                    </span>
                  </label>
                </div>
              </div>
              {modalOpen && (
                <Modal
                  updateAvatar={updateAvatar}
                  closeModal={() => setModalOpen(false)}
                  isCircle={true}
                />
              )}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-[#44BCFF] text-sm font-bold mb-2"
                >
                  Name*
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
                  Email*
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
                  Phone Number*{" "}
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
                    <a href="https://youtu.be/oga5s3Yngc8?si=XhzKVeKdUMhG6hrg">
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
                    onChange={(e) => setPortfolioLink(e.target.value)}
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
                        Institute Name*{" "}
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

                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Degree*{" "}
                        <span className=" mx-0.5 text-xs text-white">
                          Tip: For School, write Secondary/High School or Senior
                          Secondary.
                        </span>
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
                    </div>

                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Branch{" "}
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
                          
                        />
                      </Tooltip>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Location*
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
                        Start Date*
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
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        End Date*
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
                        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline border-white/10 ${
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
                              setEducationEntries,
                              educationEntries,
                              index,
                              "endDate",
                              "Present"
                            );
                          } else {
                            handleInputChange(
                              setEducationEntries,
                              educationEntries,
                              index,
                              "endDate",
                              ""
                            );
                          }
                        }}
                      />

                      <label htmlFor="">Currently Pursuing</label>
                    </div>

                    <div className="mb-4 md:col-span-2">
                      <label className="block text-[#44BCFF] font-medium mb-2">
                        Grade Format <span className="text-xs text-white">
                          Tip: Leave blank if you don't want grade on your resume.
                          </span>
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
                            Job Title*
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
                            Company Name*
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
                            Location*
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
                            Start Date*
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
                            End Date*
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
                              <label
                                htmlFor={`work-${entry.id}-${workIndex}`}
                                className="block text-[#44BCFF] font-medium mb-1"
                              >
                                Work {workIndex + 1}:
                              </label>
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
                    addEntry(setExperienceEntries, defaultExperienceEntry)
                  }
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
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
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeProjectLinks}
                    onChange={(e) => setIncludeProjectLinks(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-white focus:ring-white"
                  />
                  <span className="ml-2 text-white">Include Project Links</span>
                </label>
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
            </div>
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
                          Project Name*
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

                      {includeProjectLinks && (
                        <>
                          <div className="mb-4">
                            <label className="block text-[#44BCFF] font-medium mb-2">
                              Project Link Title*{" "}
                              <span className=" mx-0.5 text-xs text-white">
                                Tip: Use concise text like "Github Link" or
                                "Website Link"
                              </span>
                            </label>
                            <Tooltip
                              title="Not Allowed Here"
                              message="Making Text Bold is not allowed here"
                            >
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
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                                required
                              />
                            </Tooltip>
                          </div>

                          <div className="mb-4">
                            <label className="block text-[#44BCFF] font-medium mb-2">
                              Project Link*{" "}
                              <span className=" mx-0.5 text-xs text-white">
                                Tip: The actual URL of the project (e.g.,
                                https://github.com/username/project)
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
                                required
                              />
                            </Tooltip>
                          </div>
                        </>
                      )}

                      <div className="mb-4">
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Start Date*
                        </label>
                        <input
                          type="month"
                          value={entry.startDate || ""}
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
                          End Date*
                        </label>
                        <input
                          type={entry.endDate === "Present" ? "text" : "month"}
                          disabled={entry.endDate === "Present"}
                          value={entry.endDate || ""}
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
                                setProjectEntries,
                                projectEntries,
                                index,
                                "endDate",
                                "Present"
                              );
                            } else {
                              handleInputChange(
                                setProjectEntries,
                                projectEntries,
                                index,
                                "endDate",
                                ""
                              );
                            }
                          }}
                        />

                        <label htmlFor="">Currently Pursuing</label>
                      </div>
                    </div>

                    <h4 className="text-md font-semibold mb-2 text-[#44BCFF]">
                      Features{" "}
                      <span className=" mx-0.5 text-xs text-white">
                        Tip: Use Bold For Highlighting but don't overdo it
                      </span>
                    </h4>
                    {entry.featureList.map((feature, featureIndex) => (
                      <div
                        key={`${entry.id}-feature-${featureIndex}`}
                        className="mb-2 flex items-center space-x-4"
                      >
                        <label
                          htmlFor={`feature-${entry.id}-${featureIndex}`}
                          className="block text-[#44BCFF] font-medium mb-1"
                        >
                          Feature {featureIndex + 1}:
                        </label>
                        <input
                          type="text"
                          id={`feature-${entry.id}-${featureIndex}`}
                          value={feature}
                          onKeyDown={(e) =>
                            handleKeyActionOnSublist(
                              e,
                              setProjectEntries,
                              "featureList",
                              index,
                              featureIndex
                            )
                          }
                          onChange={(e) =>
                            handleSubListInputChange(
                              setProjectEntries,
                              index,
                              "featureList",
                              featureIndex,
                              e.target.value
                            )
                          }
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
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
                          className="px-2 py-1 text-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
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
                            setProjectEntries,
                            index,
                            "featureList",
                            ""
                          )
                        }
                        className="px-4 py-2 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm"
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => addEntry(setProjectEntries, defaultProjectEntry)}
                className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
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
                      className="inputGroup mb-4 flex items-center space-x-4 "
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
                          className="shadow appearance-none border rounded-lg w-full  py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
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
                  onClick={() => addEntry(setSkills, defaultSkillEntry)}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Skill
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
                  checked={includeHonors}
                  onChange={(e) => setIncludeHonors(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-white focus:ring-white"
                />
                <span className="ml-2 text-white">Include Section</span>
              </label>
            </div>
            <div
              className={`${
                !includeHonors ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {includeHonors && (
                <div className="space-y-6">
                  {honorEntries.map((entry, index) => (
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
                          onClick={() => removeEntry(setHonorEntries, index)}
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
                            Title*
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
                                  setHonorEntries,
                                  honorEntries,
                                  index,
                                  "title",
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
                            htmlFor={`date-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Date*
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              type="text"
                              id={`date-${entry.id}`}
                              value={entry.date}
                              onChange={(e) =>
                                handleInputChange(
                                  setHonorEntries,
                                  honorEntries,
                                  index,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor={`description-${entry.id}`}
                            className="block text-[#44BCFF] font-medium mb-2"
                          >
                            Description* <span className="text-xs text-white">
                              Tip: Keep it short
                            </span>
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
                            <input
                              id={`description-${entry.id}`}
                              value={entry.description}
                              onChange={(e) =>
                                handleInputChange(
                                  setHonorEntries,
                                  honorEntries,
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
                                  setHonorEntries,
                                  honorEntries,
                                  index,
                                  "linkTitle",
                                  e.target.value
                                )
                              }
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
                                  setHonorEntries,
                                  honorEntries,
                                  index,
                                  "link",
                                  e.target.value
                                )
                              }
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
                  onClick={() => addEntry(setHonorEntries, defaultHonorEntry)}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Achievement
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
                            Position Title*
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
                              className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Society/Club Name*
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
                              className="w-full px-3 py-2 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Start Date*
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
                            End Date*
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
                              Tip: Use Bold For Highlighting but don't overdo it
                            </span>
                          </h4>
                          {entry.achievements.map(
                            (achievement, achievementIndex) => (
                              <div
                                key={`${entry.id}-achievement-${achievementIndex}`}
                                className="mb-2 flex items-center space-x-4"
                              >
                                <label className="block text-[#44BCFF] font-medium mb-1">
                                  Achievement {achievementIndex + 1}*:
                                </label>
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
                              className="px-4 py-2 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm"
                            >
                              Add Achievement
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
                  onClick={() => addEntry(setClubEntries, defaultClubEntry)}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Club/Society
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
                            Certificate Title*
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    addEntry(setCertificateEntries, defaultCertificateEntry)
                  }
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Certificate
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
        <PdfBox pdfUrl={pdfUrl} defaultPdfUrl={setDefaultPdf} />
      </div>

      {/* Add ChatbotModal */}
      {chatbotModalOpen && (
        <ChatbotModal
          closeModal={() => setChatbotModalOpen(false)}
          updateFormData={handleAIGeneratedData}
          prompt={prompt}
          setPrompt={setPrompt}
          api = {api}
          // THIS format of string is required because it maps to enum in backend
          resumeType= {"RESUME_WITH_PHOTO"}
        />
      )}
    </>
  );
}

export default ResumeWithPhoto;
