import '../App.css'
import axios from 'axios'
import { useState,useRef,useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from 'lucide-react'
import toast from 'react-hot-toast';
import hello from '../assets/hello.pdf'
import Tooltip from '../components/Tooltip';
import Modal from '../components/Modal';
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

function ResumeWithPhoto() {
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
  const [imageFile,setImageFile] = useState<File|null>(null);
  const [modalOpen, setModalOpen] = useState(false);


const updateAvatar = async (imageUrl: string) => {
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const newFile = new File([blob], "image.png", { type: blob.type || "image/png" });
      setImageFile(newFile);
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to fetch or convert image:", error);
    }
  };

  
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
%-------------------
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

\begin{minipage}[c]{0.05\textwidth}
\-\
\end{minipage}
\begin{minipage}[c]{0.2\textwidth}
\begin{tikzpicture}
  \clip (0,0) circle (1.75cm);
  \node at (0,0) {\includegraphics[width = 4cm]{Aditya Photo.jpg}}; 
  % if necessary the picture may be moved by changing the at (coordinates)
  % width defines the 'zoom' of the picture
\end{tikzpicture}
\hfill\vline\hfill
\end{minipage}
\begin{minipage}[c]{0.4\textwidth}
  \textbf{\Huge \scshape{Charles Rambo}} \\ \vspace{1pt} 
  % \scshape sets small capital letters, remove if desired
  \small{+1 123-456-7890} \\
  \href{mailto:you@provider.com}{\underline{you@provider.com}}\\
  % Be sure to use a professional *personal* email address
  \href{https://www.linkedin.com/in/charles-rambo/}{\underline{linkedin.com/in/charles-rambo}} \\
  % you should adjust you linked in profile name to be professional and recognizable
  \href{https://github.com/fizixmastr}{\underline{github.com/fizixmastr}}
\end{minipage}

% Without picture
%\begin{center}
%    \textbf{\Huge \scshape Charles Rambo} \\ \vspace{1pt} %\scshape sets small capital letters, remove if desired
%    \small +1 123-456-7890 $|$ 
%    \href{mailto:you@provider.com}{\underline{you@provider.com}} $|$\\
%    % Be sure to use a professional *personal* email address
%    \href{https://linkedin.com/in/your-name-here}{\underline{linkedin.com/in/charles-rambo}} $|$
%    % you should adjust you linked in profile name to be professional and recognizable
%    \href{https://github.com/fizixmastr}{\underline{github.com/fizixmastr}}
%\end{center}



\begin{comment}
This CV was written for specifically for positions I was applying for in
academia, and then modified to be a template.

A standard CV is about two pages long where as a resume in the US is one page.
sections can be added and removed here with this in mind. In my experience, 
education, and applicable work experience and skills are the most import things
to include on a resume. For a CV the Europass CV suggests the categories: Work
Experience, Education and Training, Language Skills, Digital Skills,
Communication and Interpersonal Skills, Conferences and Seminars, Creative Works
Driver's License, Hobbies and Interests, Honors and Awards, Management and
Leadership Skills, Networks and Memberships, Organizational Skills, Projects,
Publications, Recommendations, Social and Political Activities, Volunteering.

Your goal is to convey a who, what , when, where, why for every item you share. 
The who is obviously you, but I believe the rest should be done in that order.
For example below. An employer cares most about the degree held and typically 
less about the institution or where it is located (This is still good 
information though). Whatever order you choose be consistent throughout.
\end{comment}

%-----EDUCATION----------------------------------------------------------------
\section{Education}
\CVSubHeadingListStart
%    \CVSubheading % Example
%      {Degree Achieved}{Years of Study}
%      {Institution of Study}{Where it is located}
  \CVSubheading
    {{Master of Science $|$ \emph{\small{Photonics}}}}{Aug. 2019 -- May 2021} 
    {University of Eastern Finland $|$ Joensuu, Finland}{CGPA 9.8}
  \CVSubheading
    {{Bachelor of Arts $|$ \emph{\small{Major: Physics, Minor: Education}}}}{Aug. 2016 -- May 2018}
    {Austin College $|$ Sherman, TX}{CGPA 9.9}
  \CVSubheading
    {Associate of Liberal Sciences}{Aug. 2015 -- May 2016}
    {North Lake College $|$ Irving, TX}{CGPA 7.9}
\CVSubHeadingListEnd

%-----WORK EXPERIENCE----------------------------------------------------------
\begin{comment}
try to briefly explain what you did and why it is relevant to the position you
are seeking
\end{comment}

\section{Work Experience}
\CVSubHeadingListStart
%    \CVSubheading %Example
%      {What you did}{When you worked there}
%      {Who you worked for}{Where they are located}
%      \CVItemListStart
%        \CVItem{Why it is important to this employer}
%      \CVItemListEnd
  \CVSubheading
    {Integration Engineering Intern}{Jun. 2018 -- Aug. 2019}
    {Finisar Corp.}{Sherman, TX}
    \CVItemListStart
      \CVItem{Worked in ISO 4 cleanroom developing applications to improve efficiency and creating specs}
      \CVItem{Employed metrology and microscopy for failure analysis and developing process for wet etching}
      \CVItem{Member of Emergency Response Team}
    \CVItemListEnd
  \CVSubheading
    {Laboratory Assistant}{Jan. 2016 -- Jul. 2016}
    {North Lake College}{Irving, TX}
    \CVItemListStart
      \CVItem{Inventoried and maintained Physics Department lab equipment}
      \CVItem{Physics tutoring}
  \CVItemListEnd
  \CVSubheading
    {Assistant Manager}{Dec. 2006 -- Aug. 2015}
    {Sun \& Ski Sports}{Austin, TX}
    \CVItemListStart
      \CVItem{Led a team of 20+ employees}
      \CVItem{Ran social media, as well as all grassroots marketing}
    \CVItemListEnd
\CVSubHeadingListEnd

%-----PROJECTS AND RESEARCH----------------------------------------------------
\begin{comment}
Ideally the title of the work should speak for what it is. However if you feel
like you should explain more about why the project is applicable to this job,
use item list as is shown in the work experience section.
\end{comment}

\section{Projects}
\CVSubHeadingListStart
  
  \CVSubheading
    {Characterization of the Flame-S Spectrometer for Spectral Imaging Research}{Jan. 2024 - Aug. 2026 }
    {University of Eastern Finland}{\href{https://google.com}{\color{blue}Website Link}}
    \CVItemListStart
      \CVItem{Led a team of 20+ employees}
      \CVItem{Ran social media, as well as all grassroots marketing}
    \CVItemListEnd

 
  
\CVSubHeadingListEnd

%-----CONFERENCES AND PRESENTATIONS--------------------------------------------
\begin{comment}
Again the title should have already been enough, but if it is necessary to add
descriptions maintain the consistency from prior sections
\end{comment}

\section{Conferences and Presentations}
\CVSubHeadingListStart
%    \CVSubheading % Example
%      {Work Presented}{When}
%      {Occasion}{}
  \CVSubheading
    {Photometric Filter Fidelity and Use for Be Star Identification}{November 2017}
    {Austin College Physics Research Seminar}{}
  \CVSubheading
    {Reflectometry for Volumetric Soil Moisture Measurement}{May 2017}
    {Austin College Atmospheric Physics Fair}{}
  \CVSubheading
    {Design and Manufacturing of Products using 3D Printing}{April 2017}
    {Austin College Student Scholarship Conference}{}
\CVSubHeadingListEnd

%-----HONORS AND AWARDS--------------------------------------------------------
\section{Honors and Achievments}
\CVSubHeadingListStart
%    \CVSubheading %Example
%      {What}{When}
%      {Short Description}{}
  \CVSubheading
    {Dean's List}{Fall 2017}
    {Recognition for to 20\% of students in academics at Austin College}{\href{https://google.com}{\color{blue}Certificate}}
    \CVSubheading
    {Dean's List}{Fall 2017}
    {Recognition for to 20\% of students in academics at Austin College}{\href{https://google.com}{\color{blue}Profile Link}}
  
\CVSubHeadingListEnd



%-----PROJECTS AND RESEARCH----------------------------------------------------
\begin{comment}
Ideally the title of the work should speak for what it is. However if you feel
like you should explain more about why the project is applicable to this job,
use item list as is shown in the work experience section.
\end{comment}

\section{Clubs And Societies}
\CVSubHeadingListStart
  
  \CVSubheading
    {Web Development Lead}{Jan. 2024 - Aug. 2026 }
    {KIIT MLSA}{}
    \CVItemListStart
      \CVItem{Led a team of 20+ employees}
      \CVItem{Ran social media, as well as all grassroots marketing}
    \CVItemListEnd

     \CVSubheading
    {Public Speaking Mentor}{Jan. 2024 - Aug. 2026 }
    {KIIT MUN Society}{}
    \CVItemListStart
      \CVItem{Led a team of 20+ employees}
      \CVItem{Ran social media, as well as all grassroots marketing}
    \CVItemListEnd

 
  
\CVSubHeadingListEnd

%-----Certifications-------------------------------------------------------------------
\begin{comment}
This section is compressed from the various skills sections that Euro CV
recommends.
\end{comment}

\section{Certifications}
\begin{itemize}[leftmargin=0.5cm, label={}]
  \item \small
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      AWS Cloud Executive Certificate & \href{https://google.com}{\color{blue}Certificate} \\
      AWS Cloud Practitioner Course & \href{https://google.com}{\color{blue}Certificate} \\
      AWS Advanced Networking & \href{https://google.com}{\color{blue}Certificate} \\
    \end{tabular*}
\end{itemize}
  

%-----SKILLS-------------------------------------------------------------------
\begin{comment}
This section is compressed from the various skills sections that Euro CV
recommends.
\end{comment}

\section{Skills}
\begin{itemize}[leftmargin=0.5cm, label={}]
  \small{\item{
   \textbf{Languages}{: English (Native), Spanish (B1), Finnish (A1)} \\
   \textbf{Programming}{: Python (NumPy, SciPy, Matplotlib, Pandas), MATLAB, Mathematica, Java} \\
   \textbf{Document Creation}{: Microsoft Office Suite, LaTex, Markdown} \\
  }}
\end{itemize}
  
%------------------------------------------------------------------------------
\end{document}`

const formData = new FormData()
  formData.append('payload', Code)
  if(imageFile){ 
  
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
    
  })
  .catch((err)=>{
    console.log(err)
  })
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
     <div className='grid grid-cols-1 md:grid-cols-2  gap-4 p-4 font-sans '>
     <form action="" onSubmit={handleFormSubmit} className="bg-[#1a1a1a] shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-[100%]">
      {/* Personal Information Section */}
      <div className="mb-8 border-b border-gray-700 pb-6">
        <h2 className="text-2xl font-light text-[#DFD0B8] mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label className="block text-[#DFD0B8] text-sm font-bold mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-6">
              <div 
                className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#DFD0B8] bg-[#2a2a2a] flex items-center justify-center cursor-pointer hover:border-[#c0b0a0] transition-colors"
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="text-[#DFD0B8] text-sm text-center p-2">
                    Click to add photo
                  </div>
                )}
              </div>
            </div>
          </div>
          {modalOpen && (
            <Modal updateAvatar={updateAvatar} closeModal={() => setModalOpen(false)}/>   
          )}
          <div className="mb-4">
            
            <label htmlFor="name" className="block text-[#DFD0B8] text-sm font-bold mb-2">
              Name*
            </label>
            <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
            <input
              id="tooltip"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // onKeyDown={(e)=>alertRestrictedKeyPress(e,RestrictionType.NOT_ALLOWED)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#2a2a2a] border-[#3a3a3a]"
              required
            />  
            </Tooltip>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#DFD0B8] text-sm font-bold mb-2">
              Email*
            </label>
            <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
            <input
              type="email"
              // onKeyDown={(e)=>alertRestrictedKeyPress(e,RestrictionType.NOT_ALLOWED)}
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#2a2a2a] border-[#3a3a3a]"
              required
            />
            </Tooltip>
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-[#DFD0B8] text-sm font-bold mb-2">
              Phone Number* <span className=" mx-0.5 text-xs text-white">Tip: Write Country Code followed by - and then the number</span>
            </label>
            <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91-9876543210"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#2a2a2a] border-[#3a3a3a]"
              required
            />
            </Tooltip>
          </div>
          <div className="mb-4">
            <label htmlFor="githubLink" className="block text-[#DFD0B8] text-sm font-bold mb-2">
              GitHub Link <span className=" mx-0.5 text-xs text-white">Tip: Remove the https://</span>
            </label>
            <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
            <input
              type="text"
              id="githubLink"
              name="githubLink"
              value={githubLink}
              placeholder="github.com/adi13v"
              onChange={(e) => setGithubLink(e.target.value)}

              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#2a2a2a] border-[#3a3a3a]"
            />
            </Tooltip>
          </div>
          <div className="mb-4">
              <label htmlFor="linkedInLink" className="block text-[#DFD0B8] text-sm font-bold mb-2">
                LinkedIn Link <span className=" mx-0.5 text-xs text-white">Tip: Remove the https://, also if URL is too long, <a href="https://youtu.be/oga5s3Yngc8?si=XhzKVeKdUMhG6hrg">edit in Linkedin</a></span>
            </label>
            <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
            <input
              type="text"
              id="linkedInLink"
              name="linkedInLink"
              value={linkedInLink}
              placeholder="linkedin.com/in/adityav1313/"
              onChange={(e) => setLinkedInLink(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#2a2a2a] border-[#3a3a3a]"
            />
            </Tooltip>
            </div>
            <div className="mb-4">
            <label htmlFor="portfolioLink" className="block text-[#DFD0B8] text-sm font-bold mb-2">
              Portfolio Link <span className=" mx-0.5 text-xs text-white">Tip: Remove the https://</span>
            </label>
            <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
            <input
              type="text"
              id="portfolioLink"
              name="portfolioLink"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#2a2a2a] border-[#3a3a3a]"
            />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="mb-8 border-b border-gray-700 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-[#DFD0B8]">Education</h2>
        </div>
        <div className="space-y-6">
          {educationEntries.map((entry, index) => (
            <div key={entry.id} className="bg-[#2a2a2a] p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-[#DFD0B8]">Education #{index + 1}</h3>
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
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Institute Name* <span className=" mx-0.5 text-xs text-white">Tip: Write Institute Name without any abbreviations.</span>
                  </label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    placeholder="Massachusetts Institute of Technology"
                    // onKeyDown={(e)=>alertRestrictedKeyPress(e,RestrictionType.NOT_ALLOWED)}
                    value={entry.instituteName}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'instituteName', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Degree with Branch* <span className=" mx-0.5 text-xs text-white">Tip: For School, write Secondary/High School or Senior Secondary.</span> 
                  </label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.degree}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'degree', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Location*
                  </label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.location}
                 
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'location', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Start Date*
                  </label>
                  <input
                    type="month"
                    value={entry.startDate}

                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'startDate', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    End Date*
                  </label>
                  <input
                    type={entry.endDate === "Present" ? "text" : "month"}
                    value={entry.endDate}
                    disabled={entry.endDate === "Present"}
                    onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'endDate', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
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
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Grade Format
                  </label>
                  <div className="flex space-x-4 mb-2">
                    <label className="inline-flex items-center text-[#DFD0B8]">
                      <input
                        type="radio"
                        name={`gradeType-${entry.id}`}
                        checked={entry.gradeType === 'cgpa'}
                        onChange={() => handleInputChange(setEducationEntries, educationEntries, index, 'gradeType', 'cgpa')}
                      
                        className="form-radio h-4 w-4 text-[#DFD0B8]"
                      />
                      <span className="ml-2">CGPA</span>
                    </label>
                    <label className="inline-flex items-center text-[#DFD0B8]">
                      <input
                        type="radio"
                        name={`gradeType-${entry.id}`}
                        checked={entry.gradeType === 'percentage'}
                        onChange={() => handleInputChange(setEducationEntries, educationEntries, index, 'gradeType', 'percentage')}
                       
                        className="form-radio h-4 w-4 text-[#DFD0B8]"
                      />
                      <span className="ml-2">Percentage</span>
                    </label>
                  </div>

                  {entry.gradeType === 'cgpa' ? (
                    <div>
                      <label className="block text-[#DFD0B8] font-medium mb-2">
                        CGPA
                      </label>
                      <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={entry.cgpa}
                        onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'cgpa', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                      />
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[#DFD0B8] font-medium mb-2">
                        Percentage
                      </label>
                      <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={entry.percentage}
                        onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'percentage', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
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
            className="px-4 py-2 flex items-center gap-2 bg-[#DFD0B8] text-green-700 rounded-md hover:bg-[#c0b0a0] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] transition-colors border border-[#c0b0a0]"
          >
            <PlusIcon className="w-4 h-4" /> Add Education
          </button>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mb-8 border-b border-gray-700 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-[#DFD0B8]">Experience</h2>
        </div>
        <div className="space-y-6">
          {experienceEntries.map((entry, index) => (
            <div key={entry.id} className="bg-[#2a2a2a] p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-[#DFD0B8]">Experience #{index + 1}</h3>
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
                  <label htmlFor={`jobTitle-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Job Title:</label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    id={`jobTitle-${entry.id}`}
                    value={entry.jobTitle}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'jobTitle', e.target.value)}
                    
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                  </Tooltip>
                </div>
                <div>
                  <label htmlFor={`companyName-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Company Name:</label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    id={`companyName-${entry.id}`}
                    value={entry.companyName}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'companyName', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                  </Tooltip>
                </div>
                <div>
                  <label htmlFor={`location-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Location:</label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    id={`location-${entry.id}`}
                    value={entry.location}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'location', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                  </Tooltip>
                </div>
                <div>
                  <label htmlFor={`startDate-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Start Date:</label>
                  <input
                    type="month"
                    id={`startDate-${entry.id}`}
                    value={entry.startDate}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'startDate', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`endDate-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">End Date:</label>
                  <input
                    type={entry.endDate === "Present" ? "text" : "month"}

                    id={`endDate-${entry.id}`}
                    value={entry.endDate}
                    onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'endDate', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
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
                  <h4 className="text-md font-semibold mb-2 text-[#DFD0B8]">Work Details: <span className=" mx-0.5 text-xs text-white">Tip: Use Bold For Highlighting but don't overdo it</span></h4>
                  {entry.workList.map((work, workIndex) => (
                    <div key={workIndex} className="mb-2 flex items-center space-x-4">
                      <label htmlFor={`work-${entry.id}-${workIndex}`} className="block text-[#DFD0B8] font-medium mb-1">Work {workIndex + 1}:</label>
                      <input
                        type="text"
                        id={`work-${entry.id}-${workIndex}`}
                        value={work}
                        onChange={(e) => handleSubListInputChange(setExperienceEntries, index, 'workList', workIndex, e.target.value)}
                        onKeyDown={(e)=>handleKeyActionOnSublist(e,setExperienceEntries,'workList',index,workIndex)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeItemFromSubList(setExperienceEntries, index, 'workList', workIndex)}
                        className="px-2 py-1 bg-amber-800 text-[#DFD0B8] rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => addItemToSubList(setExperienceEntries, index, 'workList', '')}
                      className="px-4 py-2 text-[#DFD0B8] rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
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
            className="px-4 py-2 flex items-center gap-2 bg-[#DFD0B8] text-green-700 rounded-md hover:bg-[#c0b0a0] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] transition-colors border border-[#c0b0a0]"
          >
            <PlusIcon className="w-4 h-4" /> Add Experience
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8 border-b border-gray-700 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-[#DFD0B8]">Projects</h2>
        </div>
        <div className="space-y-6">
          {projectEntries.map((entry, index) => (
            <div key={entry.id} className="bg-[#2a2a2a] p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-light text-[#DFD0B8]">Project #{index + 1}</h3>
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
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Project Name*
                  </label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.projectName}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'projectName', e.target.value)}
                    className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]  text-[#DFD0B8]"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Technologies Used*
                  </label>
                  <Tooltip title = "Not Allowed Here" message = "Making Text Bold is not allowed here">
                  <input
                    type="text"
                    value={entry.technologiesUsed}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'technologiesUsed', e.target.value)}
                    className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]  text-[#DFD0B8]"
                    required
                  />
                  </Tooltip>
                </div>
                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    Start Date*
                  </label>
                  <input
                    type="month"
                    value={entry.startDate || ''}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]  text-[#DFD0B8]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[#DFD0B8] font-medium mb-2">
                    End Date*
                  </label>
                  <input
                    type={entry.endDate === "Present" ? "text" : "month"}
                    disabled={entry.endDate === "Present"}
                    value={entry.endDate || ''}
                    onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'endDate', e.target.value)}
                    className= {`w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]  text-[#DFD0B8] ${entry.endDate=="Present"? ' bg-gray-500 cursor-not-allowed' : ''}`}
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

              <h4 className="text-md font-semibold mb-2 text-[#DFD0B8]">Features:* <span className=" mx-0.5 text-xs text-white">Tip: Use Bold For Highlighting but don't overdo it</span></h4>
              {entry.featureList.map((feature, featureIndex) => (
                <div key={`${entry.id}-feature-${featureIndex}`} className="mb-2 flex items-center space-x-4">
                  <label htmlFor={`feature-${entry.id}-${featureIndex}`} className="block text-[#DFD0B8] font-medium mb-1">Feature {featureIndex + 1}:</label>
                  <input
                    type="text"
                    id={`feature-${entry.id}-${featureIndex}`}
                    value={feature}
                    onKeyDown={(e)=>handleKeyActionOnSublist(e,setProjectEntries,'featureList',index,featureIndex)}
                    onChange={(e) => handleSubListInputChange(setProjectEntries, index, 'featureList', featureIndex, e.target.value)}
                    className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8]  text-[#DFD0B8]"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemFromSubList(setProjectEntries, index, 'featureList', featureIndex)}
                    className="px-2 py-1 text-amber-800 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => addItemToSubList(setProjectEntries, index, 'featureList', '')}
                  className="px-4 py-2 text-green-700  rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
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
            className="px-4 py-2 flex items-center gap-2 bg-[#DFD0B8] text-green-700 rounded-md hover:bg-[#c0b0a0] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] transition-colors border border-[#c0b0a0]"
          >
            <PlusIcon className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-[#DFD0B8]">Technical Skills</h2>
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
                  className="form-checkbox h-4 w-4 text-green-600  border-[#948979] focus:ring-2 focus:ring-green-400"
                />
                <span className="ml-2 text-[#DFD0B8]">{preset}</span>
              </label>
            );
          })}
        </div>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div className="inputGroup mb-4 flex items-center space-x-4" key={index}>
            <Tooltip title = "This will already be bold" message = "Making Text Bold is not allowed here">
              <input
                type="text"
                placeholder="Skill Type (e.g., Frameworks)"
                value={skill.key}
                onChange={(e) => handleInputChange(setSkills, skills, index, "key", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
              />
              </Tooltip>
              <input
                type="text"
                placeholder="Skills (e.g., React, Node)"
                value={skill.value}
                onKeyDown={(e)=>handleKeyActiononList(e,setSkills,skills,index,"value")}
                onChange={(e) => handleInputChange(setSkills, skills, index, "value", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline  border-[#948979]"
              />
              <button
                type="button"
                onClick={() => removeEntry(setSkills, index)}
                className="px-2 py-1 bg-amber-800 text-[#DFD0B8] rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 text-xs"
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
            className="px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Add Skill
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        {/* <button 
          type="submit" 
          className="px-8 py-3 bg-[#DFD0B8] text-green-700 rounded-lg font-light hover:bg-[#c0b0a0] focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] transition-colors border border-[#c0b0a0]"
        >
          Generate Resume
        </button> */}
        <div className=" bg-black rounded-xl flex justify-center items-center">

    <div className="relative inline-flex rounded-xl  group">
        <div
            className="absolute transitiona-all  rounded-xl duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
        </div>
        <button type="submit" title="Get quote now"
            className="relative  inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >Generate Resume
        </button>
    </div>
</div>

      </div>
     </form>
     {pdfUrl && (
      <div className="lg:fixed lg:top-0 lg:right-0 lg:w-1/2 lg:h-screen md:fixed md:top-0 md:right-0 md:w-1/2 md:h-screen">
        <iframe
          src={pdfUrl + '#zoom=88%'}
          className='w-full h-screen'
        />
      </div>
      
     )}
     {!pdfUrl && (
      <div className="lg:fixed lg:top-0 lg:right-0 lg:w-1/2 lg:h-screen md:fixed md:top-0 md:right-0 md:w-1/2 md:h-screen">
        <iframe
          src={hello + '#zoom=88%'}
          className='w-full h-screen'
        />
      </div>
     )}
     </div>
    </>
  )
}

export default ResumeWithPhoto

