import '../App.css'
import axios from 'axios'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import Modal from '../components/Modal';
const api = axios.create({
  baseURL: `http://localhost:8000`
})

function generateUUID() {
  return uuidv4()
}



interface BaseEntry {
  id: string; // Or the appropriate ID type
}

const presets = ["Languages", "Frameworks", "Libraries", "Developer Tools", "Soft Skills"];
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
  instituteName: "Indian Institute Of Technology Bombay",
  degree: "Bachelor of Technology in Computer Science and Engineering",
  location: "Mumbai, India",
  startDate: "2020-08",
  endDate: "2020-09",
  gradeType: "CGPA",
  cgpa: "",
  percentage: "",
}

const defaultExperienceEntry:ExperienceDetails = {
  id: "cvhu7654wdfghj",
  jobTitle: "CEO",
  companyName: "Apple Inc.",
  location: "Cupertino, California",
  startDate: "2020-08",
  endDate: "2020-09",
  workList: ["Worked on iOS", "Worked on MacOS", "Worked on iPadOS"],
}

const defaultProjectEntry:ProjectDetails = {
  id: "0okmhgfdr543edf",
  projectName: "Resume Builder",
  technologiesUsed: "React, Node.js, Express",
  startDate: "2020-08",
  endDate: "2020-09",
  featureList: ["Feature 1", "Feature 2", "Feature 3"],
}
const defaultSkillEntry:SkillDetails = {
  id: "3edfty7unbvcxae567j",
  key: "",
  value: "",
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
  const [educationEntries, setEducationEntries] = useState<EducationDetails[]>([defaultEducationEntry]);
  const [imageFile,setImageFile] = useState<File|null>(null);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceDetails[]>([defaultExperienceEntry]);
  const [projectEntries, setProjectEntries] = useState<ProjectDetails[]>([defaultProjectEntry])
  const [skills, setSkills] = useState<SkillDetails[]>([]);
  const [name , setName] = useState<string>("Jake Smith")
  const [email , setEmail] = useState<string>("2228090@kiit.ac.in")
  const [phoneNumber , setPhoneNumber] = useState<string>("6386419509")
  const [githubLink , setGithubLink] = useState<string>("")
  const [linkedInLink , setLinkedInLink] = useState<string>("")
  const [globalId , setGlobalId] = useState<string>("")

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
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalId(generateUUID());
   
    const Code:string = String.raw`
    %------------------------------------------------------------------------------
% CV in Latex
% Author : Charles Rambo
% Based off of: https://github.com/sb2nov/resume and Jake's Resume on Overleaf
% Most recently updated version may be found at https://github.com/fizixmastr 
% License : MIT
%------------------------------------------------------------------------------

\documentclass[A4,11pt]{article}
%\documentclass[letterpaper,11pt]{article} %For use in US
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

\begin{comment}
I am by no means a professional when it comes to the CV's/resumes, I have
received various trainings on how to write a CV and resume from my high 
school, as well as the Austin College and University of Eastern Finland's
career counseling departments. As I intend to share my CV as a template, I 
feel that it is my responsibility to provide explanations of my work.
\end{comment}


%-----FONT OPTIONS-------------------------------------------------------------
\begin{comment}
The font of the document will impact not just how readable it is, but how it is
perceived. In the "The Craft of Scientific Writing" by Michael Alley, shares a
common fonts for publication as well as their use. I have chosen to use
Palatino for its legibility, some others are given below. There is far too much
about typography to discus here. Note: serif fonts have short projecting
strokes, sans-serif fonts are sans (without) these strokes.
\end{comment}


% serif
 \usepackage{palatino}
% \usepackage{times} %This is the default as well
% \usepackage{charter}

% sans-serif
% \usepackage{helvet}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

%-----PAGE SETUP---------------------------------------------------------------

% Adjust margins
\addtolength{\oddsidemargin}{-1cm}
\addtolength{\evensidemargin}{-1cm}
\addtolength{\textwidth}{2cm}
\addtolength{\topmargin}{-1cm}
\addtolength{\textheight}{2cm}

% Margins for US Letter size
%\addtolength{\oddsidemargin}{-0.5in}
%\addtolength{\evensidemargin}{-0.5in}
%\addtolength{\textwidth}{1in}
%\addtolength{\topmargin}{-.5in}
%\addtolength{\textheight}{1.0in}

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
    \node at (0,0) {\includegraphics[width = 4cm]{image-${globalId}}}; 
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
      {University of Eastern Finland}{Joensuu, Finland}
    \CVSubheading
      {{Bachelor of Arts $|$ \emph{\small{Major: Physics, Minor: Education}}}}{Aug. 2016 -- May 2018}
      {Austin College}{Sherman, TX}
    \CVSubheading
      {Associate of Liberal Sciences}{Aug. 2015 -- May 2016}
      {North Lake College}{Irving, TX}
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
      {Integration Engineering Intern}{June 2018 -- August 2019}
      {Finisar Corp.}{Sherman, TX}
      \CVItemListStart
        \CVItem{Worked in ISO 4 cleanroom developing applications to improve efficiency and creating specs}
        \CVItem{Employed metrology and microscopy for failure analysis and developing process for wet etching}
        \CVItem{Member of Emergency Response Team}
      \CVItemListEnd
    \CVSubheading
      {Laboratory Assistant}{January 2016 -- July 2016}
      {North Lake College}{Irving, TX}
      \CVItemListStart
        \CVItem{Inventoried and maintained Physics Department lab equipment}
        \CVItem{Physics tutoring}
    \CVItemListEnd
    \CVSubheading
      {Assistant Manager}{December 2006 -- August 2015}
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

\section{Projects and Research}
  \CVSubHeadingListStart
%    \CVSubheading
%      {Title of Work}{When it was done}
%      {Institution you worked with}{unused}
    \CVSubheading
      {{Surface Plasmon Propagation in the Kretschmann-Raether Configuration} $|$ \emph{\small{Python}}}{Fall 2020}
      {University of Eastern Finland}{}
    \CVSubheading
      {{Simulation of Vector Beams Through High Numerical Aperture Lens} $|$ \emph{\small{Python}}}{Fall 2020}
      {University of Eastern Finland}{}
    \CVSubheading
      {Characterization of the Flame-S Spectrometer for Spectral Imaging Research}{Spring 2020}
      {University of Eastern Finland}{}
    \CVSubheading
      {{Free Form Lens Systems for 3D Printing} $|$ \emph{\small{MATLAB, OpTaliX}}}{Spring 2019}
      {University of Eastern Finland}{}
    \CVSubheading
      {Procedures for Plating and Wet-Etching in III-V Semiconductor Devices}{Summer 2019}
      {Finisar Corp.}{}
    \CVSubheading
      {Photo-Filter Characterization for Photometric Identification of Be Stars}{Fall 2017}
      {Austin College}{}
    \CVSubheading
      {Improved Calibrating Equations for Volumetric Soil Moisture Measurement}{Spring 2017}
      {Austin College}{}
    \CVSubheading
      {{Product Design, and Manufacturing Using 3D Printing} $|$ \emph{\small{Autodesk 123D}}}{Fall 2016}
      {Austin College}{}
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
\section{Honors and Awards}
  \CVSubHeadingListStart
%    \CVSubheading %Example
%      {What}{When}
%      {Short Description}{}
    \CVSubheading
      {Dean's List}{Fall 2017}
      {Recognition for to 20\% of students in academics at Austin College}{}
    \CVSubheading
      {Noyce STEM Education Leadership Scholarship}{June 2017}
      {Merit based grant for students pursuing education in STEM fields}{}
    \CVSubheading
      {Stephens Scholarship}{May 2017}
      {Merit based scholarship to support international study experiences within Austin College}{}
    \CVSubheading
      {John D . Mosely Scholarship}{July 2016}
      {Merit based scholarship requiring Austin College alumnus nomination}{}
    \CVSubheading
      {Presidents List}{Spring 2016}
      {Overall GPA above 3.8 at Austin College}{}
    \CVSubheading
      {Eagle Scout}{April 2006}
      {Highest level of achievement within the Boy Scouts of America}{}
  \CVSubHeadingListEnd

%-----TEACHING EXPERIENCE------------------------------------------------------
\begin{comment}
Section is here as it applied to my application for positions in academia. 
Remember to tailor the resume for to the position.
\end{comment}

\section{Teaching Experience}
  \CVSubHeadingListStart
%    \CVSubheading
%      {What}{When}
%      {School}{Where}
    \CVSubheading
      {High School Physics (11 Weeks Teaching/Observing)}{Fall 2017}
      {Denison High School}{Denison, TX}
    \CVSubheading
      {High School Calculus (11 Weeks Teaching/Observing)}{Fall 2017}
      {Denison High School}{Denison, TX}
    \CVSubheading
      {High School Geometry (9 Weeks Teaching/Observing)}{Spring 2016}
      {Sherman High School}{Sherman, TX}
  \CVSubHeadingListEnd

%-----COMMUNITY INVOLVEMENT----------------------------------------------------
\section{Community Involvement}
  \CVSubHeadingListStart
%    \CVSubheading %Example
%      {What you did}{When you worked there}
%      {Who you worked for}{Where they are located}
    \CVSubheading
      {Austin College Community Tutors}{Fall 2017 -- Fall 2018}
      {Free tutoring for local students in science and mathematics}{Sherman, TX}
    \CVSubheading
      {River Legacy Nature Center}{September 2015 -- August 2016}
      {Provided assistance for various youth science education programs}{Arlington, TX}
    \CVSubheading
      {Back on My Feet Run Club}{April 2014 -- August 2015}
      {Helping to reestablish homeless persons in the community}{Austin, TX}
  \CVSubHeadingListEnd

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


const parseEducationString = () => {

  const newString:string|void = educationEntries.map((entry) => {
    return`\\resumeSubheading
      {${entry.instituteName}}{${entry.location}}
      {${entry.degree}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}} 

  `
  }
).join("")

  return newString

}

const parseExperienceString = () => {
  const newString:string|void = experienceEntries.map((entry) => {
    return `\\resumeSubheading
      {${entry.jobTitle}}{${formatMonthYear(entry.startDate)} -- ${formatMonthYear(entry.endDate)}}
      {${entry.companyName}}{${entry.location}}
      \\resumeItemListStart
        ${entry.workList.map((work) => {
        return `\\resumeItem{${work}}`
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
  return `\\resumeItem{${feature}}`
}).join("")}
\\resumeItemListEnd
`
}
).join("")
return newString
}

const parseSkillString = () => {
const newString = skills.map((entry) => {
  return`\\textbf{${entry.key}}: ${entry.value} \\

  `
}).join("")

return newString
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
  console.log(projectEntries)
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
     <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
     <form action="" onSubmit={handleFormSubmit} className="bg-[#222831] shadow-md rounded px-8 pt-6 pb-8 mb-4">
       
        <button type='button' onClick={()=> setModalOpen(true)}>Select Image</button>
        {modalOpen && (
         <Modal updateAvatar={updateAvatar} closeModal = {()=> setModalOpen(false)}/>   
        )}
  <div className="mb-4">
    <label htmlFor="name" className="block text-[#DFD0B8] text-sm font-bold mb-2">
      Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#393E46] border-[#948979]"
    />

    <div
  contentEditable
  onInput={(e) => {
    console.log(e.currentTarget.innerText);
  }}
  className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#393E46] border-[#948979]"
>
  <span className='font-bold'>Hello</span>
</div>

  </div>
  <div className="mb-4">
    <label htmlFor="email" className="block text-[#DFD0B8] text-sm font-bold mb-2">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#393E46] border-[#948979]"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="phoneNumber" className="block text-[#DFD0B8] text-sm font-bold mb-2">
      Phone Number
    </label>
    <input
      type="text"
      id="phoneNumber"
      name="phoneNumber"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#393E46] border-[#948979]"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="githubLink" className="block text-[#DFD0B8] text-sm font-bold mb-2">
      GitHub Link
    </label>
    <input
      type="text"
      id="githubLink"
      name="githubLink"
      onChange={(e) => setGithubLink(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#393E46] border-[#948979]"
    />
  </div>
  <div className="mb-6">
    <label htmlFor="linkedInLink" className="block text-[#DFD0B8] text-sm font-bold mb-2">
      LinkedIn Link
    </label>
    <input
      type="text"
      id="linkedInLink"
      name="linkedInLink"
      onChange={(e) => setLinkedInLink(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#393E46] border-[#948979]"
    />
  </div>

      {/* ________EDUCATION DETAILS____________ */}
      <div className="mb-8">
  <h2 className="text-3xl font-semibold mb-4 text-[#DFD0B8]">Education</h2>
  <div className='Education'>
    {educationEntries.map((entry, index) => (
      <div key={entry.id} className="mb-8 p-6 bg-[#393E46] rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-[#DFD0B8]">Education #{index + 1}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-[#DFD0B8] font-medium mb-2">
              Institute Name
            </label>
            <input
              type="text"
              value={entry.instituteName}
              onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'instituteName', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#DFD0B8] font-medium mb-2">
              Degree*
            </label>
            <input
              type="text"
              value={entry.degree}
              onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'degree', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#DFD0B8] font-medium mb-2">
              Location*
            </label>
            <input
              type="text"
              value={entry.location}
              onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'location', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#DFD0B8] font-medium mb-2">
              Start Date*
            </label>
            <input
              type="month"
              value={entry.startDate}
              onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'startDate', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
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
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={entry.cgpa}
                  onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'cgpa', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[#DFD0B8] font-medium mb-2">
                  Percentage
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={entry.percentage}
                  onChange={(e) => handleInputChange(setEducationEntries, educationEntries, index, 'percentage', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(setEducationEntries, index)}
          className="mt-4 px-4 py-2 text-amber-800 rounded-md hover:bg-[#948979] focus:outline-none focus:ring-2 focus:ring-[#948979]"
        >
          Remove Education
        </button>
      </div>
    ))}
    <button
    type='button'
      onClick={() => addEntry(setEducationEntries, defaultEducationEntry)}
      className="mt-4 px-4 py-2 bg-[#DFD0B8] text-green-700 rounded-md hover:bg-[#948979] focus:outline-none focus:ring-2 focus:ring-[#948979]"
    >
      Add More Education
    </button>
  </div>
</div>

{/* _______Experience Section____________ */}
<div className="mb-8">
  <h2 className="text-xl font-semibold mb-4 text-[#DFD0B8]">Experience</h2>
  <div className="Experience">
    {experienceEntries.map((entry, index) => (
      <div key={entry.id} className="mb-8 p-6 bg-[#393E46] rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-[#DFD0B8]">Experience #{index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input fields remain the same */}
          <div>
            <label htmlFor={`jobTitle-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Job Title:</label>
            <input
              type="text"
              id={`jobTitle-${entry.id}`}
              value={entry.jobTitle}
              onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'jobTitle', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>
          <div>
            <label htmlFor={`companyName-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Company Name:</label>
            <input
              type="text"
              id={`companyName-${entry.id}`}
              value={entry.companyName}
              onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'companyName', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>
          <div>
            <label htmlFor={`location-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Location:</label>
            <input
              type="text"
              id={`location-${entry.id}`}
              value={entry.location}
              onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'location', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>
          <div>
            <label htmlFor={`startDate-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">Start Date:</label>
            <input
              type="month"
              id={`startDate-${entry.id}`}
              value={entry.startDate}
              onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'startDate', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
            />
          </div>
          <div>
            <label htmlFor={`endDate-${entry.id}`} className="block text-[#DFD0B8] font-medium mb-2">End Date:</label>
            <input
              type={entry.endDate === "Present" ? "text" : "month"}

              id={`endDate-${entry.id}`}
              value={entry.endDate}
              onChange={(e) => handleInputChange(setExperienceEntries, experienceEntries, index, 'endDate', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
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
            <h4 className="text-md font-semibold mb-2 text-[#DFD0B8]">Work Details:</h4>
            {entry.workList.map((work, workIndex) => (
              <div key={workIndex} className="mb-2 flex items-center space-x-4">
                <label htmlFor={`work-${entry.id}-${workIndex}`} className="block text-[#DFD0B8] font-medium mb-1">Work {workIndex + 1}:</label>
                <input
                  type="text"
                  id={`work-${entry.id}-${workIndex}`}
                  value={work}
                  onChange={(e) => handleSubListInputChange(setExperienceEntries, index, 'workList', workIndex, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
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
                className="px-4 py-2 bg-green-700 text-[#DFD0B8] rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              >
                Add Work
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={() => removeEntry(setExperienceEntries, index)}
            className="px-4 py-2 text-amber-800 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 text-sm"
          >
            Remove Experience
          </button>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addEntry(setExperienceEntries, defaultExperienceEntry)}
      className="mt-4 px-4 py-2  text-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
    >
      Add New Experience
    </button>
  </div>
</div>
     
      {/* ________PROJECT DETAILS____________ */}
      <div className='Projects mb-8'>
  <h2 className="text-xl font-semibold mb-4 text-[#DFD0B8]">Projects</h2>
  {projectEntries.map((entry, index) => (
    <div key={entry.id} className="mb-8 p-6 bg-[#393E46] rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-[#DFD0B8]">Project #{index + 1}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-[#DFD0B8] font-medium mb-2">
            Project Name*
          </label>
          <input
            type="text"
            value={entry.projectName}
            onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'projectName', e.target.value)}
            className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#222831] text-[#DFD0B8]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#DFD0B8] font-medium mb-2">
            Technologies Used
          </label>
          <input
            type="text"
            value={entry.technologiesUsed}
            onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'technologiesUsed', e.target.value)}
            className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#222831] text-[#DFD0B8]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#DFD0B8] font-medium mb-2">
            Start Date
          </label>
          <input
            type="month"
            value={entry.startDate || ''}
            onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'startDate', e.target.value)}
            className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#222831] text-[#DFD0B8]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#DFD0B8] font-medium mb-2">
            End Date
          </label>
          <input
            type={entry.endDate === "Present" ? "text" : "month"}
            disabled={entry.endDate === "Present"}
            value={entry.endDate || ''}
            onChange={(e) => handleInputChange(setProjectEntries, projectEntries, index, 'endDate', e.target.value)}
            className= {`w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#222831] text-[#DFD0B8] ${entry.endDate=="Present"? ' bg-gray-500 cursor-not-allowed' : ''}`}
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

      <h4 className="text-md font-semibold mb-2 text-[#DFD0B8]">Features:</h4>
      {entry.featureList.map((feature, featureIndex) => (
        <div key={`${entry.id}-feature-${featureIndex}`} className="mb-2 flex items-center space-x-4">
          <label htmlFor={`feature-${entry.id}-${featureIndex}`} className="block text-[#DFD0B8] font-medium mb-1">Feature {featureIndex + 1}:</label>
          <input
            type="text"
            id={`feature-${entry.id}-${featureIndex}`}
            value={feature}
            onChange={(e) => handleSubListInputChange(setProjectEntries, index, 'featureList', featureIndex, e.target.value)}
            className="w-full px-3 py-2 border border-[#948979] rounded-md focus:outline-none focus:ring-2 focus:ring-[#DFD0B8] bg-[#222831] text-[#DFD0B8]"
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
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => removeEntry(setProjectEntries, index)}
          className="px-4 py-2 text-amber-800 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 text-sm"
        >
          Remove Project
        </button>
      </div>
    </div>
  ))}
  <button
    type="button"
    onClick={() => addEntry(setProjectEntries, defaultProjectEntry)}
    className="mt-4 px-6 py-3 text-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
  >
    Add New Project
  </button>
</div>
{/* Technical Skills */}
<div className="technicalSkills mb-8">
  <h2 className="text-xl font-semibold mb-4 text-[#DFD0B8]">Technical Skills</h2>
  <div className="presets mb-4">
    <span className="text-[#DFD0B8] font-medium mr-2">Presets:</span>
    {presets.map((preset, index) => (
      <label key={index} className="inline-flex items-center mr-4">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-[#DFD0B8] bg-[#222831] border-[#948979] focus:ring-2 focus:ring-[#DFD0B8]"
          onChange={(e) => {
            if (e.target.checked) {
              addEntry(setSkills, { ...defaultSkillEntry, key: preset, value: "" });
            }
            else{
              setSkills(skills.filter(skill => skill.key !== preset));
            }
          }}
          checked={skills.some(skills=> skills.key === preset)}
        />
        <span className="ml-2 text-[#DFD0B8]">{preset}</span>
      </label>
    ))}
  </div>

  {skills.map((skill, index) => (
    <div className="inputGroup mb-4 flex items-center space-x-4" key={index}>
      <input
        type="text"
        placeholder="Skill Type (e.g., Frameworks)"
        value={skill.key}
        onChange={(e) => handleInputChange(setSkills, skills, index, "key", e.target.value)}
        className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
      />
      <input
        type="text"
        placeholder="Skills (e.g., React, Node)"
        value={skill.value}
        onChange={(e) => handleInputChange(setSkills, skills, index, "value", e.target.value)}
        className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-[#DFD0B8] leading-tight focus:outline-none focus:shadow-outline bg-[#222831] border-[#948979]"
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

  <button
  type='button'
    onClick={() => addEntry(setSkills, defaultSkillEntry)}
    className="mt-4 px-6 py-3 bg-green-700 text-[#DFD0B8] rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
  >
    Add New Skill
  </button>
</div>
      <button type="submit">Submit</button>
     </form>
    {pdfUrl && (
      <div>
      <iframe
         src={pdfUrl}
         className='w-full h-screen sticky top-0'
         
         
       />
     </div>
    )}
     </div>

    </>
  )
}

export default ResumeWithPhoto
