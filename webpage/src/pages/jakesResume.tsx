import '../App.css'
import axios from 'axios'
import { useState,useRef,useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from 'lucide-react'
import toast from 'react-hot-toast';
import hello from '../assets/hello.pdf'
import Tooltip from '../components/Tooltip';
const api = axios.create({
  baseURL: `http://localhost:8000`
})

function generateUUID() {
  return uuidv4();
}
interface BaseEntry {
  id: string; // Or the appropriate ID type
}

interface FormDataStore {
  name: string;
  email: string;
  phoneNumber: string;
  githubLink: string;
  linkedInLink: string;
  portfolioLink: string;
  educationEntries: EducationDetails[];
  experienceEntries: ExperienceDetails[];
  projectEntries: ProjectDetails[];
  skills: SkillDetails[];
}

const presets = ["Languages", "Frameworks", "Libraries", "Developer Tools", "Soft Skills"];

enum RestrictionType {
  ALREADY_BOLD = "already_bold",
  ALREADY_ITALIC = "already_italic",
  NOT_ALLOWED = "not_allowed",
}
interface EducationDetails extends BaseEntry {
  instituteName : string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gradeType: string;
  cgpa? : string;
  percentage? : string;
}

interface ExperienceDetails extends BaseEntry {
  jobTitle : string;
  companyName : string;
  location : string;
  startDate : string;
  endDate : string;
  workList : string[];
}

interface ProjectDetails extends BaseEntry {
  projectName : string;
  technologiesUsed : string;
  featureList : string[];
  startDate:string,
  endDate:string
}
interface SkillDetails extends BaseEntry {
  key: string;
  value: string;
}

const defaultEducationEntry:EducationDetails = {
  id: "dfcvbhu7654efghnbvcd",
  instituteName: "Massachusetts Institute of Technology",
  degree: "Master of Science in Computer Science",
  location: "Cambridge, Massachusetts",
  startDate: "2020-09",
  endDate: "2022-05",
  gradeType: "CGPA",
  cgpa: "3.9",
  percentage: "",
}

const defaultEducationEntry2:EducationDetails = {
  id: "dfcvbhu7654efghnbvcd2",
  instituteName: "Stanford University",
  degree: "Bachelor of Science in Computer Science",
  location: "Stanford, California",
  startDate: "2016-09",
  endDate: "2020-05",
  gradeType: "CGPA",
  cgpa: "3.8",
  percentage: "",
}

const defaultEducationEntry3:EducationDetails = {
  id: "dfcvbhu7654efghnbvcd3",
  instituteName: "University of California, Berkeley",
  degree: "Bachelor of Arts in Mathematics",
  location: "Berkeley, California",
  startDate: "2014-09",
  endDate: "2016-05",
  gradeType: "CGPA",
  cgpa: "3.7",
  percentage: "",
}

const defaultExperienceEntry:ExperienceDetails = {
  id: "cvhu7654wdfghj",
  jobTitle: "Senior Software Engineer",
  companyName: "Google",
  location: "Mountain View, California",
  startDate: "2022-06",
  endDate: "Present",
  workList: [
    "Led development of scalable microservices architecture handling 1M+ daily requests",
    "Implemented CI/CD pipeline reducing deployment time by 40%",
    "Mentored junior developers and conducted code reviews for team of 5 engineers"
  ],
}

const defaultExperienceEntry2:ExperienceDetails = {
  id: "cvhu7654wdfghj2",
  jobTitle: "Software Engineer",
  companyName: "Microsoft",
  location: "Redmond, Washington",
  startDate: "2020-06",
  endDate: "2022-05",
  workList: [
    "Developed and maintained Azure cloud services with 99.99% uptime",
    "Optimized database queries reducing response time by 30%",
    "Collaborated with cross-functional teams to deliver features on schedule"
  ],
}

const defaultProjectEntry:ProjectDetails = {
  id: "0okmhgfdr543edf",
  projectName: "AI-Powered Resume Builder",
  technologiesUsed: "React, TypeScript, Node.js, Express, MongoDB",
  startDate: "2023-01",
  endDate: "2023-06",
  featureList: [
    "Real-time LaTeX PDF generation with custom templates",
    "AI-powered content suggestions and grammar checking",
    "Responsive design with dark/light mode support",
    "Local storage for draft saving and auto-recovery"
  ],
}

const defaultProjectEntry2:ProjectDetails = {
  id: "0okmhgfdr543edf2",
  projectName: "Distributed Task Scheduler",
  technologiesUsed: "Go, gRPC, Redis, Docker, Kubernetes",
  startDate: "2022-07",
  endDate: "2022-12",
  featureList: [
    "Implemented distributed consensus using Raft algorithm",
    "Achieved 99.9% task execution reliability",
    "Scaled to handle 100K+ concurrent tasks",
    "Added monitoring and alerting system"
  ],
}

const defaultEmptySkillEntry:SkillDetails = {
  id: "3edfty7unbvcxae567j",
  key: "",
  value: "",
}
const defaultSkillEntry:SkillDetails = {
  id: "3edfty7unbvcxae567j",
  key: "Languages",
  value: "Python, JavaScript, TypeScript, Java, C++",
}

const defaultSkillEntry2:SkillDetails = {
  id: "3edfty7unbvcxae567j2",
  key: "Frameworks",
  value: "React, Node.js, Express, Django, Spring Boot",
}

const defaultSkillEntry3:SkillDetails = {
  id: "3edfty7unbvcxae567j3",
  key: "Developer Tools",
  value: "Git, Docker, Kubernetes, AWS, Azure, CI/CD",
}

const defaultSkillEntry4:SkillDetails = {
  id: "3edfty7unbvcxae567j4",
  key: "Databases",
  value: "MongoDB, PostgreSQL, Redis, MySQL",
}

const defaultSkillEntry5:SkillDetails = {
  id: "3edfty7unbvcxae567j5",
  key: "Soft Skills",
  value: "Leadership, Team Collaboration, Problem Solving, Communication",
}

// Function to format date from YYYY-MM to MMM YYYY
function formatMonthYear(dateString) {
  if (!dateString || !dateString.match(/^\d{4}-\d{2}$/)) {
    return 'Present';
  }
  
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  // Get month name
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  
  // Add period after month name except for May
  const formattedMonth = monthName === 'May' ? 'May' : `${monthName}.`;
  
  return `${formattedMonth} ${year}`;
}

function JakeResume() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [educationEntries, setEducationEntries] = useState<EducationDetails[]>([defaultEducationEntry,defaultEducationEntry2,defaultEducationEntry3]);
  
  const [experienceEntries, setExperienceEntries] = useState<ExperienceDetails[]>([defaultExperienceEntry,defaultExperienceEntry2]);
  const [projectEntries, setProjectEntries] = useState<ProjectDetails[]>([defaultProjectEntry,defaultProjectEntry2])
  const [skills, setSkills] = useState<SkillDetails[]>([defaultSkillEntry,defaultSkillEntry2,defaultSkillEntry3,defaultSkillEntry4,defaultSkillEntry5]);
  const [name , setName] = useState<string>("Jake Smith")
  const [email , setEmail] = useState<string>("2228090@kiit.ac.in")
  const [phoneNumber , setPhoneNumber] = useState<string>("6386419509")
  const[portfolioLink , setPortfolioLink] = useState<string>("google.com")
  const [githubLink , setGithubLink] = useState<string>("")
  const [linkedInLink , setLinkedInLink] = useState<string>("")
  const [globalId , setGlobalId] = useState<string>("")
  const storageKeyName = `formData-${window.location.pathname}`

  
const loadToStore = (store: FormDataStore) => {
  localStorage.setItem(storageKeyName, JSON.stringify(store));
}
const debouncedStoreRef = useRef(debounce(loadToStore,1000));

  function debounce<T extends (...args:Parameters<T>)=> void>(func:T,delay:number):(...args:Parameters<T>)=>void {
    let timer: ReturnType<typeof setTimeout>;
    
    return (...args:Parameters<T>)=>{
      clearTimeout(timer);
      timer = setTimeout(()=>{
        func(...args);
      },delay);
    }
      
    }

  useEffect(()=>{
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
    }
    debouncedStoreRef.current(store) ;
  } , [name,email,phoneNumber,githubLink,linkedInLink,portfolioLink,educationEntries,experienceEntries,projectEntries,skills])


  useEffect(()=>{
    const data = localStorage.getItem(storageKeyName)
    if(data){
      const store = JSON.parse(data) as FormDataStore;
      console.log("store" , store)
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
    }
  },[])
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if(skills.length === 0 || educationEntries.length === 0 || 
   experienceEntries.length === 0 || projectEntries.length === 0) {
  
    if (skills.length === 0) toast.error("Please select at least one skill");
    if (educationEntries.length === 0) toast.error("Please add at least one education entry");
    if (experienceEntries.length === 0) toast.error("Please add at least one experience entry");
    if (projectEntries.length === 0) toast.error("Please add at least one project entry");
  return;
}
   
    setGlobalId(generateUUID());
    const Code:string = String.raw`
  \documentclass[letterpaper,11pt]{article}
  
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
  
  \begin{center}
      \textbf{\Huge \scshape ${sanitizeInput(name)}} \\ \vspace{1pt}
      \small ${sanitizeInput(phoneNumber)} $|$ \href{mailto:${email}}{\underline{${sanitizeInput(email)}}}
       ${linkedInLink!=="" ? ` $|$\\href{${sanitizeInputForLink(linkedInLink)}}{\\underline{${sanitizeInputForDisplay(sanitizeInput(linkedInLink))}}}` : ""}${githubLink!=="" ? ` $|$\\href{${sanitizeInputForLink(githubLink)}}{\\underline{${sanitizeInputForDisplay(sanitizeInput(githubLink))}}}` : ""} ${portfolioLink!=="" ? ` $|$\\href{${sanitizeInputForLink(portfolioLink)}}{\\underline{${sanitizeInputForDisplay(sanitizeInput(portfolioLink))}}}` : ""}
  \end{center}
  
  
  %-----------EDUCATION-----------
  \section{Education}
    \resumeSubHeadingListStart
     ${
      parseEducationString()
     }
    \resumeSubHeadingListEnd
  
  
  %-----------EXPERIENCE-----------
  \section{Experience}
    \resumeSubHeadingListStart
      ${
        parseExperienceString()
      }
    \resumeSubHeadingListEnd
  
  
  %-----------PROJECTS-----------
  \section{Projects}
      \resumeSubHeadingListStart
        ${parseProjectString()}
      \resumeSubHeadingListEnd

  %-----------PROGRAMMING SKILLS-----------
  \section{Technical Skills}
   \begin{itemize}[leftmargin=0.15in, label={}]
      \small{\item{
       ${parseSkillString()}
      }}
   \end{itemize}
  
  %-------------------------------------------
  \end{document}
  `
  const formData = new FormData()
    formData.append('payload', Code)
    formData.append('globalId', globalId)  
    api.post('/' , formData, {responseType: 'blob'})
    .then((res)=>{
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
      
    })
    .catch((err)=>{
      console.log(err)
    })
  }


const parseEducationString = () => {

  const newString:string|void = educationEntries.map((entry) => {
    return`\\resumeSubheading
      {${sanitizeInput(entry.instituteName)}}{${sanitizeInput(entry.location)}}
      {${sanitizeInput(entry.degree)}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
  `
  }
).join("")

  return newString

}

const parseExperienceString = () => {
  const newString:string|void = experienceEntries.map((entry) => {
    return `\\resumeSubheading
      {${sanitizeInput(entry.jobTitle)}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
      {${sanitizeInput(entry.companyName)}}{${sanitizeInput(entry.location)}}
      \\resumeItemListStart
        ${entry.workList.map((work) => {
        return `\\resumeItem{${sanitizeInput(work)}}`
        }).join("")}
      \\resumeItemListEnd
      `
  }).join("")
  console.log(newString)
  return newString
  }

const parseProjectString = () => {
const newString = projectEntries.map((entry) => {
return `\\resumeProjectHeading
 {\\textbf{${entry.projectName}} $|$ \\emph{${entry.technologiesUsed}}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
\\resumeItemListStart
${entry.featureList.map((feature) => {
  return `\\resumeItem{${sanitizeInput(feature)}}`
}).join("")}
\\resumeItemListEnd
`
}
).join("")
return newString
}

const parseSkillString = () => {
const newString = skills.map((entry) => {
  return`\\textbf{${sanitizeInput(entry.key)}}: ${sanitizeInput(entry.value)} \\

  `
}).join("")

return newString
}

const sanitizeInput = (input:string) => {

  // Dont Disrupt The order because if __bold__ becomes \textbf and 
  // then We change \ to \backslash, then even \textbf will suffer
  let sanitizedInput = input.replace(/\\/g, '\\textbackslash ');
  sanitizedInput = sanitizedInput.replace(/__bold\[(.*?)\]__/g, '\\textbf{$1}');
  sanitizedInput = sanitizedInput.replace(/__italic\[(.*?)\]__/g, '\\textit{$1}');
  sanitizedInput = sanitizedInput.replace(/%/g, '\\%');
  
  return sanitizedInput;
}

const sanitizeInputForDisplay = (input:string) => {
  return input.replace(/https?:\/\//, '');
}

const sanitizeInputForLink = (input:string) => {
  if (!input) return "";
  const trimmedInput = input.trim();
  if (!trimmedInput.startsWith("http://") && !trimmedInput.startsWith("https://")){
    return "https://" + trimmedInput;
  }
  return trimmedInput;
}

const handleKeyActiononList = <T extends BaseEntry>(e:React.KeyboardEvent<HTMLInputElement>,setEntries: React.Dispatch<React.SetStateAction<T[]>>,Entries:T[],index:number, key:string)  => {
  if (e.ctrlKey && e.key === 'b'){
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    if (!input) return;
    const value = input.value;
    if (!value) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === null || end === null) return;
    if (start !== end){
      const selectedText = value.slice(start,end);
      const wrapped = `bold[${selectedText}]`;
      const newText = value.slice(0,start) + wrapped + value.slice(end);
      handleInputChange(setEntries,Entries,index,key,newText)
    }
  }

}
const handleKeyActionOnSublist = <T extends BaseEntry> (e:React.KeyboardEvent<HTMLInputElement>, setState:React.Dispatch<React.SetStateAction<T[]>> , listName:keyof T , index:number , listIndex:number) => {

if (e.ctrlKey && (e.key === 'b' || e.key === 'i')){
  e.preventDefault();
  const input = e.target as HTMLInputElement;
  if (!input) return;
  const value = input.value;
  if (!value) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;
 if (start === null || end === null) return;

  if (start!== end){
    const selectedText = value.slice(start, end);
    const wrapped = e.key === 'b' ? `__bold[${selectedText}]__` : `__italic[${selectedText}]__`;
    const newText = value.slice(0, start) + wrapped + value.slice(end);
    handleSubListInputChange(setState,index,listName,listIndex,newText)
  }
  
}
}
const handleInputChange = <T extends BaseEntry>(setEntries: React.Dispatch<React.SetStateAction<T[]>>,Entries:T[],index:number, key:string, value:string) => {
const newEntries = [...Entries]
newEntries[index] = { ...newEntries[index], [key]: value };
setEntries(newEntries);
}

const addItemToSubList = <T extends BaseEntry>(setEntries: React.Dispatch<React.SetStateAction<T[]>>,index:number, listName: keyof T , value:string) => {
  setEntries(prevEntries=> prevEntries.map((entry,idx)=>{
  if(idx === index){
    const currentList = entry[listName];
    if(Array.isArray(currentList)){
      const newList = [...currentList, value]
      console.log(sanitizeInput(experienceEntries[0].workList[2]))
    return {
      ...entry,
      [listName]: newList,
    } as T;
  }
}

  return entry
}))
}

const removeItemFromSubList = <T extends BaseEntry>(setEntries: React.Dispatch<React.SetStateAction<T[]>>,index:number, listName: keyof T , listIndex:number) => {
setEntries(prevEntries => prevEntries.map((entry,idx)=>{
  if (idx === index){
    const currentList = entry[listName];
    if(Array.isArray(currentList)){
      const newList = currentList.filter((_,i) => i !== listIndex);
      return {
        ...entry,
        [listName]: newList,
      } as T;
    }
  }
  return entry
}))

}

const handleSubListInputChange = <T extends BaseEntry>(setEntries:React.Dispatch<React.SetStateAction<T[]>>,index:number, listName: keyof T , listIndex:number, value:string) => {
 setEntries(prevEntries => prevEntries.map((entry,idx)=>{
  if(idx === index){
    const currentList = entry[listName];
    if(Array.isArray(currentList)){
      currentList[listIndex] = value;
      return {
        ...entry,
        [listName]: currentList,
      } as T;
    }
  }
  return entry
 }))
}

const addEntry =  <T extends BaseEntry>(
  setEntries: React.Dispatch<React.SetStateAction<T[]>>,
  defaultEntry: Omit<T, 'id'>,
 
)=>{
 
  setEntries((prevEntries)=> [
    ...prevEntries,
    {...defaultEntry,id: generateUUID() } as T
  ])
}

const removeEntry = <T extends BaseEntry>(
  setEntries: React.Dispatch<React.SetStateAction<T[]>>,
  index:number
) => {
  setEntries((prevEntries) => prevEntries.filter((_,idx) => idx !== index));
};

  return (
    <>
     <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 font-sans min-h-screen w-[100%] overflow-x-hidden bg-gray-950'>
     <form action="" onSubmit={handleFormSubmit} className="bg-gray-900/50 mt-15  backdrop-blur-md shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 w-[100%] border border-white/10">
      {/* Personal Information Section */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-light text-white mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-white text-sm font-bold mb-2">
              Name*
            </label>
            <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
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
            <label htmlFor="email" className="block text-white text-sm font-bold mb-2">
              Email*
            </label>
            <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
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
            <label htmlFor="phoneNumber" className="block text-white text-sm font-bold mb-2">
              Phone Number* <span className=" mx-0.5 text-xs text-white">Tip: Write Country Code followed by - and then the number</span>
            </label>
            <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
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
            <label htmlFor="githubLink" className="block text-white text-sm font-bold mb-2">
              GitHub Link <span className=" mx-0.5 text-xs text-white">Tip: Remove the https://</span>
            </label>
            <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
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
              <label htmlFor="linkedInLink" className="block text-white text-sm font-bold mb-2">
                LinkedIn Link <span className=" mx-0.5 text-xs text-white">Tip: Remove the https://, also if URL is too long, <a href="https://youtu.be/oga5s3Yngc8?si=XhzKVeKdUMhG6hrg">edit in Linkedin</a></span>
            </label>
            <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
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
            <label htmlFor="portfolioLink" className="block text-white text-sm font-bold mb-2">
              Portfolio Link <span className=" mx-0.5 text-xs text-white">Tip: Remove the https://</span>
            </label>
            <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
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
            <div key={entry.id} className="bg-white/5 p-6 rounded-xl shadow border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-white">Education #{index + 1}</h3>
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
                  <label className="block text-white font-medium mb-2">
                    Institute Name* <span className=" mx-0.5 text-xs text-white">Tip: Write Institute Name without any abbreviations.</span>
                  </label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    placeholder="Massachusetts Institute of Technology"
                    value={entry.instituteName}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'instituteName', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    Degree with Branch* <span className=" mx-0.5 text-xs text-white">Tip: For School, write Secondary/High School or Senior Secondary.</span> 
                  </label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.degree}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'degree', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    Location*
                  </label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.location}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'location', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    Start Date*
                  </label>
                  <input
                    type="month"
                    value={entry.startDate}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'startDate', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    End Date*
                  </label>
                  <input
                    type={entry.endDate === "Present" ? "text" : "month"}
                    value={entry.endDate}
                    disabled={entry.endDate === "Present"}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'endDate', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                  required/>
                  <input type="checkbox" onChange={
                    (e) => {
                      if (e.target.checked) {
                        handleInputChange(setEducationEntries, educationEntries, index, 'endDate', "Present");
                      }
                      
                      else {
                        handleInputChange(setEducationEntries, educationEntries, index, 'endDate', "");
                      }
                    }
                  } />
                  
                  <label htmlFor="">Currently Pursuing</label>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-white font-medium mb-2">
                    Grade Format
                  </label>
                  <div className="flex space-x-4 mb-2">
                    <label className="inline-flex items-center text-white">
                      <input
                        type="radio"
                        name={`gradeType-${entry.id}`}
                        checked={entry.gradeType === 'cgpa'}
                        onChange={() => handleInputChange(setEducationEntries, educationEntries, index, 'gradeType', 'cgpa')}
                      
                        className="form-radio h-4 w-4 text-white"
                      />
                      <span className="ml-2">CGPA</span>
                    </label>
                    <label className="inline-flex items-center text-white">
                      <input
                        type="radio"
                        name={`gradeType-${entry.id}`}
                        checked={entry.gradeType === 'percentage'}
                        onChange={() => handleInputChange(setEducationEntries, educationEntries, index, 'gradeType', 'percentage')}
                       
                        className="form-radio h-4 w-4 text-white"
                      />
                      <span className="ml-2">Percentage</span>
                    </label>
                  </div>

                  {entry.gradeType === 'cgpa' ? (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        CGPA
                      </label>
                      <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={entry.cgpa}
                        onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'cgpa', e.target.value)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                      />
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Percentage
                      </label>
                      <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={entry.percentage}
                        onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'percentage', e.target.value)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
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
            onClick={() => addEntry(setEducationEntries, defaultEducationEntry)}
            className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusIcon className="w-4 h-4" /> Add Education
          </button>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-white">Experience</h2>
        </div>
        <div className="space-y-6">
          {experienceEntries.map((entry, index) => (
            <div key={entry.id} className="bg-white/5 p-6 rounded-xl shadow border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-white">Experience #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeEntry(setExperienceEntries, index)}
                  className="text-red-400 hover:text-red-300 focus:outline-none"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`jobTitle-${entry.id}`} className="block text-white font-medium mb-2">Job Title:</label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    id={`jobTitle-${entry.id}`}
                    value={entry.jobTitle}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'jobTitle', e.target.value)}
                    
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                  </Tooltip>
                </div>
                <div>
                  <label htmlFor={`companyName-${entry.id}`} className="block text-white font-medium mb-2">Company Name:</label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    id={`companyName-${entry.id}`}
                    value={entry.companyName}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'companyName', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                  </Tooltip>
                </div>
                <div>
                  <label htmlFor={`location-${entry.id}`} className="block text-white font-medium mb-2">Location:</label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    id={`location-${entry.id}`}
                    value={entry.location}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'location', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                  </Tooltip>
                </div>
                <div>
                  <label htmlFor={`startDate-${entry.id}`} className="block text-white font-medium mb-2">Start Date:</label>
                  <input
                    type="month"
                    id={`startDate-${entry.id}`}
                    value={entry.startDate}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'startDate', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`endDate-${entry.id}`} className="block text-white font-medium mb-2">End Date:</label>
                  <input
                    type={entry.endDate === "Present" ? "text" : "month"}
                    id={`endDate-${entry.id}`}
                    value={entry.endDate}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'endDate', e.target.value)}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                    required
                  />
                   <input type="checkbox" onChange={
                    (e) => {
                      if (e.target.checked) {
                        handleInputChange(setExperienceEntries, experienceEntries, index, 'endDate', "Present");
                      }
                      
                      else {
                        handleInputChange(setExperienceEntries, experienceEntries, index, 'endDate', "");
                      }
                    }
                  } />
                  
                  <label htmlFor="">Currently Pursuing</label>
                </div>
                <div className="col-span-full">
                  <h4 className="text-md font-semibold mb-2 text-white">Work Details: <span className=" mx-0.5 text-xs text-white">Tip: Use Bold For Highlighting but don't overdo it</span></h4>
                  {entry.workList.map((work, workIndex) => (
                    <div key={workIndex} className="mb-2 flex items-center space-x-4">
                      <label htmlFor={`work-${entry.id}-${workIndex}`} className="block text-white font-medium mb-1">Work {workIndex + 1}:</label>
                      <input
                        type="text"
                        id={`work-${entry.id}-${workIndex}`}
                        value={work}
                        onChange={(e) => handleSubListInputChange(setExperienceEntries, index, 'workList', workIndex, e.target.value)}
                        onKeyDown={(e)=>handleKeyActionOnSublist(e,setExperienceEntries,'workList',index,workIndex)}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeItemFromSubList(setExperienceEntries, index, 'workList', workIndex)}
                        className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => addItemToSubList(setExperienceEntries, index, 'workList', '')}
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
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addEntry(setExperienceEntries, defaultExperienceEntry)}
            className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusIcon className="w-4 h-4" /> Add Experience
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-white">Projects</h2>
        </div>
        <div className="space-y-6">
          {projectEntries.map((entry, index) => (
            <div key={entry.id} className="bg-white/5 p-6 rounded-xl shadow border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-white">Project #{index + 1}</h3>
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
                  <label className="block text-white font-medium mb-2">
                    Project Name*
                  </label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.projectName}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'projectName', e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20  text-white"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    Technologies Used*
                  </label>
                  <Tooltip title="Not Allowed Here" message="Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.technologiesUsed}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'technologiesUsed', e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20  text-white"
                    required
                  />
                  </Tooltip>
                </div>
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    Start Date*
                  </label>
                  <input
                    type="month"
                    value={entry.startDate || ''}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20  text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">
                    End Date*
                  </label>
                  <input
                    type={entry.endDate === "Present" ? "text" : "month"}
                    disabled={entry.endDate === "Present"}
                    value={entry.endDate || ''}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'endDate', e.target.value)}
                    className= {`w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20  text-white ${entry.endDate=="Present"? ' bg-gray-500 cursor-not-allowed' : ''}`}
                  />
                  <input type="checkbox" onChange={
                      (e) => {
                        if (e.target.checked) {
                          handleInputChange(setProjectEntries, projectEntries, index, 'endDate', "Present");
                        }
                        
                        else {
                          handleInputChange(setProjectEntries, projectEntries, index, 'endDate', "");
                        }
                      }
                    } />
                    
                    <label htmlFor="">Currently Pursuing</label>
                  
                </div>
              </div>

              <h4 className="text-md font-semibold mb-2 text-white">Features:* <span className=" mx-0.5 text-xs text-white">Tip: Use Bold For Highlighting but don't overdo it</span></h4>
              {entry.featureList.map((feature, featureIndex) => (
                <div key={`${entry.id}-feature-${featureIndex}`} className="mb-2 flex items-center space-x-4">
                  <label htmlFor={`feature-${entry.id}-${featureIndex}`} className="block text-white font-medium mb-1">Feature {featureIndex + 1}:</label>
                  <input
                    type="text"
                    id={`feature-${entry.id}-${featureIndex}`}
                    value={feature}
                    onKeyDown={(e)=>handleKeyActionOnSublist(e,setProjectEntries,'featureList',index,featureIndex)}
                    onChange={(e) => handleSubListInputChange(setProjectEntries, index, 'featureList', featureIndex, e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20  text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemFromSubList(setProjectEntries, index, 'featureList', featureIndex)}
                    className="px-2 py-1 text-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => addItemToSubList(setProjectEntries, index, 'featureList', '')}
                  className="px-4 py-2 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-sm"
                >
                  Add Feature
                </button>
              </div>
            </div>
          ))}
        </div>
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
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-white">Technical Skills</h2>
        </div>
        {/* Presets checkboxes */}
        <div className="flex flex-wrap gap-4 mb-4">
          {presets.map((preset) => {
            const checked = skills.some(skill => skill.key === preset);
            return (
              <label key={preset} className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => {
                    if (e.target.checked) {
                      setSkills(prev => [...prev, { ...defaultSkillEntry, key: preset, value: "" }]);
                    } else {
                      setSkills(prev => prev.filter(skill => skill.key !== preset));
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-white border-white/20 focus:ring-2 focus:ring-white/20 bg-white/5"
                />
                <span className="ml-2 text-white">{preset}</span>
              </label>
            );
          })}
        </div>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div className="inputGroup mb-4 flex items-center space-x-4" key={index}>
            <Tooltip title="This will already be bold" message="Making Text Bold is not allowed here">
              <input
                type="text"
                placeholder="Skill Type (e.g., Frameworks)"
                value={skill.key}
                onChange={(e) => handleInputChange(setSkills, skills, index, "key", e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
              />
              </Tooltip>
              <input
                type="text"
                placeholder="Skills (e.g., React, Node)"
                value={skill.value}
                onKeyDown={(e)=>handleKeyActiononList(e,setSkills,skills,index,"value")}
                onChange={(e) => handleInputChange(setSkills, skills, index, "value", e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline  border-white/10"
              />
              <button
                type="button"
                onClick={() => removeEntry(setSkills, index)}
                className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addEntry(setSkills, defaultEmptySkillEntry)}
            className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusIcon className="w-4 h-4" /> Add Skill
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-black rounded-xl flex justify-center items-center">
          <div className="relative inline-flex rounded-xl group">
            <div className="absolute transition-all rounded-xl duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
            </div>
            <button 
              type="submit" 
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Generate Resume
            </button>
          </div>
        </div>
      </div>
     </form>
    

    {pdfUrl && (
      <div className="pdf-viewer-container md:fixed md:top-19 md:right-0 md:w-1/2 sm:w-full">
        <iframe
          src={pdfUrl + '#zoom=88%'}
          className="w-full h-screen rounded-xl border border-white/10"
        />
      </div>
     )}
     {!pdfUrl && (
      <div className="pdf-viewer-container md:fixed md:top-19 md:right-0 md:w-1/2 sm:w-full">
        <iframe
          src={hello + '#zoom=88%'}
          className="w-full h-screen rounded-xl border border-white/10"
        />
      </div>
     )}
     
   
     </div>
    </>
  )
}

export default JakeResume
