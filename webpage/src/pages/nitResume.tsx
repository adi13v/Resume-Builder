import "../App.css";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import hello from "../assets/hello.pdf";
import Tooltip from "../components/Tooltip";
import Modal from "../components/Modal";
import {
  generateUUID,
  BaseEntry,
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
import PdfBox from "../components/PdfBox";
import { ImageCropper } from "../components/ImageCropper";

const api = axios.create({
  baseURL: `http://localhost:8000`,
});

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
  skillEntries: SkillDetails[];
  honorEntries: HonorDetails[];
  clubEntries: ClubDetails[];
  certificateEntries: CertificateDetails[];
  positionEntries: PositionDetails[];
}

const presets = [
  "Languages",
  "Frameworks",
  "Libraries",
  "Developer Tools",
  "Soft Skills",
];

enum RestrictionType {
  ALREADY_BOLD = "already_bold",
  ALREADY_ITALIC = "already_italic",
  NOT_ALLOWED = "not_allowed",
}

interface EducationDetails extends BaseEntry {
  instituteName: string;
  degree: string;
  branch: string;
  location: string;
  startDate: string;
  endDate: string;
  gradeType: string;
  cgpa: string;
  percentage: string;
}

interface ExperienceDetails extends BaseEntry {
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  workList: string[];
}

interface ProjectDetails extends BaseEntry {
  projectName: string;
  description: string;
  tools: string;
  startDate: string;
  endDate: string;
  achievements: string[];
  link: string;
  linkType: "GitHub" | "Website";
}

interface SkillDetails extends BaseEntry {
  skillName: string;
  skillList: string[];
}

interface HonorDetails extends BaseEntry {
  title: string;
  linkTitle: string;
  link: string;
}

interface ClubDetails extends BaseEntry {
  clubName: string;
  clubList: string[];
}

interface CertificateDetails extends BaseEntry {
  title: string;
  link: string;
  date: string;
}

interface PositionDetails extends BaseEntry {
  positionName: string;
  societyName: string;
  date: string;
}

const defaultEducationEntry: EducationDetails = {
  id: "dfcvbhu7654efghnbvcd",
  instituteName: "Massachusetts Institute of Technology",
  degree: "Master of Science",
  branch: "Computer Science",
  location: "Cambridge, Massachusetts",
  startDate: "2020-09",
  endDate: "2022-05",
  gradeType: "cgpa",
  cgpa: "3.9",
  percentage: "",
};

const defaultEducationEntry2: EducationDetails = {
  id: "dfcvbhu7654efghnbvcd2",
  instituteName: "Stanford University",
  degree: "Bachelor of Science",
  branch: "Computer Science",
  location: "Stanford, California",
  startDate: "2016-09",
  endDate: "2020-05",
  gradeType: "cgpa",
  cgpa: "3.8",
  percentage: "",
};

const defaultEducationEntry3: EducationDetails = {
  id: "dfcvbhu7654efghnbvcd3",
  instituteName: "University of California, Berkeley",
  degree: "Bachelor of Arts",
  branch: "Mathematics",
  location: "Berkeley, California",
  startDate: "2014-09",
  endDate: "2016-05",
  gradeType: "CGPA",
  cgpa: "3.7",
  percentage: "",
};

const defaultExperienceEntry: ExperienceDetails = {
  id: "cvhu7654wdfghj",
  jobTitle: "Senior Software Engineer",
  companyName: "Google",
  location: "Mountain View, California",
  startDate: "2022-06",
  endDate: "Present",
  workList: [
    "Led development of scalable microservices architecture handling 1M+ daily requests",
    "Implemented CI/CD pipeline reducing deployment time by 40%",
    "Mentored junior developers and conducted code reviews for team of 5 engineers",
  ],
};

const defaultExperienceEntry2: ExperienceDetails = {
  id: "cvhu7654wdfghj2",
  jobTitle: "Software Engineer",
  companyName: "Microsoft",
  location: "Redmond, Washington",
  startDate: "2020-06",
  endDate: "2022-05",
  workList: [
    "Developed and maintained Azure cloud services with 99.99% uptime",
    "Optimized database queries reducing response time by 30%",
    "Collaborated with cross-functional teams to deliver features on schedule",
  ],
};

const defaultProjectEntry: ProjectDetails = {
  id: generateUUID(),
  projectName: "",
  description: "",
  tools: "",
  startDate: "",
  endDate: "",
  achievements: [""],
  link: "",
  linkType: "GitHub"
};

const defaultProjectEntry2: ProjectDetails = {
  id: generateUUID(),
  projectName: "Distributed Task Scheduler",
  description: "A scalable distributed task scheduling system",
  tools: "Go, Docker, Kubernetes, Redis",
  startDate: "2022-07",
  endDate: "2022-12",
  achievements: [
    "Implemented distributed consensus using Raft algorithm",
    "Achieved 99.9% task execution reliability",
    "Scaled to handle 100K+ concurrent tasks",
    "Added monitoring and alerting system"
  ],
  link: "https://github.com/username/task-scheduler",
  linkType: "GitHub"
};

const defaultEmptySkillEntry: SkillDetails = {
  id: "3edfty7unbvcxae567j",
  skillName: "",
  skillList: [""],
};
const defaultSkillEntry: SkillDetails = {
  id: "3edfty7unbvcxae567j",
  skillName: "Languages",
  skillList: ["Python, JavaScript, TypeScript, Java, C++"],
};

const defaultSkillEntry2: SkillDetails = {
  id: "3edfty7unbvcxae567j2",
  skillName: "Frameworks",
  skillList: ["React, Node.js, Express, Django, Spring Boot"],
};

const defaultSkillEntry3: SkillDetails = {
  id: "3edfty7unbvcxae567j3",
  skillName: "Developer Tools",
  skillList: ["Git, Docker, Kubernetes, AWS, Azure, CI/CD"],
};

const defaultSkillEntry4: SkillDetails = {
  id: "3edfty7unbvcxae567j4",
  skillName: "Databases",
  skillList: ["MongoDB, PostgreSQL, Redis, MySQL"],
};

const defaultSkillEntry5: SkillDetails = {
  id: "3edfty7unbvcxae567j5",
  skillName: "Soft Skills",
  skillList: ["Leadership, Team Collaboration, Problem Solving, Communication"],
};

const defaultHonorEntry: HonorDetails = {
  id: generateUUID(),
  title: "",
  linkTitle: "",
  link: ""
};

const defaultHonorEntry2: HonorDetails = {
  id: "honor2",
  title: "Best Project Award",
  date: "2022-12",
  description:
    "Awarded for outstanding performance in the annual project competition",
  linkTitle: "Profile Link",
  link: "https://example.com/profile",
};

const defaultClubEntry: ClubDetails = {
  id: "club1",
  title: "Web Development Lead",
  societyName: "KIIT MLSA",
  startDate: "2023-01",
  endDate: "2024-01",
  achievements: [
    "Led a team of 20+ members in developing and maintaining the society's website",
    "Organized monthly coding workshops and hackathons",
  ],
};

const defaultClubEntry2: ClubDetails = {
  id: "club2",
  title: "Public Speaking Mentor",
  societyName: "KIIT MUN Society",
  startDate: "2022-08",
  endDate: "2023-08",
  achievements: [
    "Mentored 50+ students in public speaking and debate",
    "Organized inter-college MUN conference with 200+ participants",
  ],
};

const defaultCertificateEntry: CertificateDetails = {
  id: generateUUID(),
  title: "",
  link: "",
  date: ""
};

const defaultCertificateEntry2: CertificateDetails = {
  id: "cert2",
  title: "Google Cloud Professional Data Engineer",
  link: "https://example.com/certificate2",
};

const defaultPositionEntry: PositionDetails = {
  id: generateUUID(),
  positionName: "",
  societyName: "",
  date: ""
};

function ResumeWithPhoto() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
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
  const [name, setName] = useState<string>("Jake Smith");
  const [email, setEmail] = useState<string>("2228090@kiit.ac.in");
  const [phoneNumber, setPhoneNumber] = useState<string>("6386419509");
  const [portfolioLink, setPortfolioLink] = useState<string>("google.com");
  const [githubLink, setGithubLink] = useState<string>("");
  const [linkedInLink, setLinkedInLink] = useState<string>("");
  const [globalId, setGlobalId] = useState<string>(generateUUID());
  console.log(globalId);
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
  const [positionEntries, setPositionEntries] = useState<PositionDetails[]>([
    defaultPositionEntry,
  ]);

  // Add new state variables for section toggles
  const [includeExperience, setIncludeExperience] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeSkills, setIncludeSkills] = useState(true);
  const [includeHonors, setIncludeHonors] = useState(true);
  const [includeClubs, setIncludeClubs] = useState(true);
  const [includeCertificates, setIncludeCertificates] = useState(true);
  const [includeProjectLinks, setIncludeProjectLinks] = useState(true);
  const [includePicture, setIncludePicture] = useState(true);
  const [includePositions, setIncludePositions] = useState(true);

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
      positionEntries: positionEntries,
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
    positionEntries,
  ]);

  useEffect(() => {
    const data = localStorage.getItem(storageKeyName);
    if (data) {
      const store = JSON.parse(data) as FormDataStore;
      console.log("store", store);
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
      setPositionEntries(store.positionEntries || [defaultPositionEntry]);
    }
  }, []);

  const parseEducationString = () => {
    const newString: string | void = educationEntries
      .map((entry) => {
        return `\\CVSubheading
    {{${sanitizeInput(entry.degree)} $|$ \\emph{\\small{${sanitizeInput(
          entry.branch
        )}}}}} {${formatMonthYear(entry.startDate)} -- ${formatMonthYear(
          entry.endDate
        )}}
    {${sanitizeInput(entry.instituteName)} $|$ ${sanitizeInput(
          entry.location
        )}}{${
          entry.gradeType === "cgpa"
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
      entry.link
    )}}{\\color{blue}${sanitizeInputForDisplay(
            sanitizeInput(entry.projectName)
          )}}}{}
    \\CVItemListStart
      ${entry.achievements
        .map((achievement) => {
          return `\\CVItem{${sanitizeInput(achievement)}}`;
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
    ${entry.achievements
      .map((achievement) => {
        return `\\CVItem{${sanitizeInput(achievement)}}`;
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
    if (!includeProjects) {
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
    {${sanitizeInput(entry.societyName)}} {}
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
        \\href{${sanitizeInputForLink(
          entry.link
        )}}{\\color{blue}Certificate Link} \\\\
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
      if(skills.length === 0 || educationEntries.length === 0 ||
       experienceEntries.length === 0 || projectEntries.length === 0 || (includePicture && imageFile === null)) {
        if (includePicture && imageFile === null) toast.error("Please upload a profile picture");
        if (skills.length === 0) toast.error("Please select at least one skill");
        if (educationEntries.length === 0) toast.error("Please add at least one education entry");
        if (experienceEntries.length === 0) toast.error("Please add at least one experience entry");
        if (projectEntries.length === 0) toast.error("Please add at least one project entry");
      return;
    }
      setGlobalId(generateUUID());
      console.log(globalId)

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
      % \\scshape sets small capital letters, remove if desired
      \\small{${sanitizeInput(phoneNumber)}} \\\\
      \\href{mailto:${sanitizeInput(email)}}{\\underline{${sanitizeInput(email)}}}\\\\
      ${linkedInLink!=='' ? `\\href{${sanitizeInputForLink(linkedInLink)}}{\\underline{${sanitizeInputForDisplay(linkedInLink)}}} ` : ``} ${githubLink!=='' ? `\\href{${sanitizeInputForLink(githubLink)}}{\\underline{${sanitizeInputForDisplay(githubLink)}}}  ` : ``}  ${portfolioLink!=='' ? `\\href{${sanitizeInputForLink(portfolioLink)}}{\\underline{${sanitizeInputForDisplay(portfolioLink)}}}` : ``}
    \\end{minipage}
      ` : `
       %Without picture
    \\begin{center}
        \\textbf{\\Huge \\scshape ${sanitizeInput(name)}} \\\\ \\vspace{1pt} %\\scshape sets small capital letters, remove if desired
        \\small ${sanitizeInput(phoneNumber)} $|$
        \\href{mailto:${sanitizeInput(email)}}{\\underline{${sanitizeInput(email)}}} ${portfolioLink ? `$|$ \\href{${sanitizeInputForLink(portfolioLink)}}{\\underline{${sanitizeInputForDisplay(portfolioLink)}}}`:``} ${linkedInLink || githubLink ? ` $|$ \\\\ ` : ``}
        ${linkedInLink ? `\\href{${sanitizeInputForLink(linkedInLink)}}{\\underline{${sanitizeInputForDisplay(linkedInLink)}}}` : ``} ${githubLink && linkedInLink ? ` $|$` : ``}
        % you should adjust you linked in profile name to be professional and recognizable
        ${githubLink ? `\\href{${sanitizeInputForLink(githubLink)}}{\\underline{${sanitizeInputForDisplay(githubLink)}}}` : ``}
    \\end{center}
      `}
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

    %-----Positions of Responsibility--------------------------------------------------------
    ${parsePositionString()}

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

      })
      .catch((err)=>{
        console.log(err)
      })
    }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 font-sans min-h-screen w-[100%] overflow-x-hidden bg-gray-950">
        <form
          action=""
          onSubmit={handleFormSubmit}
          className="bg-gray-900/50 mt-15 backdrop-blur-md shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4 w-[100%] border border-white/10"
        >
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
                    Tip: Remove the https://, also if URL is too long,{" "}
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
                    Tip: Remove the https://
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
                    Tip: Remove the https://
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
                        Branch*{" "}
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
                        Grade Format
                      </label>
                      <div className="flex space-x-4 mb-2">
                        <label className="inline-flex items-center text-[#44BCFF]">
                          <input
                            type="radio"
                            name={`gradeType-${entry.id}`}
                            checked={entry.gradeType === "cgpa"}
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
                            checked={entry.gradeType === "percentage"}
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

                      {entry.gradeType === "cgpa" ? (
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
                            Job Title:
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
                            Company Name:
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
                            Location:
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
                            Start Date:
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
                            End Date:
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
                                Remove
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

                      <div className="mb-4">
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Description*
                        </label>
                        <Tooltip
                          title="Not Allowed Here"
                          message="Making Text Bold is not allowed here"
                        >
                          <textarea
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
                          Tools Used*{" "}
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
                            value={entry.tools}
                            onChange={(e) =>
                              handleInputChange(
                                setProjectEntries,
                                projectEntries,
                                index,
                                "tools",
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
                          Link Type*
                        </label>
                        <select
                          value={entry.linkType}
                          onChange={(e) =>
                            handleInputChange(
                              setProjectEntries,
                              projectEntries,
                              index,
                              "linkType",
                              e.target.value as 'github' | 'website'
                            )
                          }
                          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                          required
                        >
                          <option value="github">GitHub</option>
                          <option value="website">Website</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[#44BCFF] font-medium mb-2">
                          Project Link*
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
                                setProjectEntries,
                                projectEntries,
                                index,
                                "link",
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
                          Start Date*
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
                          End Date*
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
                          <label className="ml-2 text-white">Currently Working</label>
                        </div>
                      </div>

                      <div className="col-span-full">
                        <h4 className="text-md font-semibold mb-2 text-[#44BCFF]">
                          Achievements:*{" "}
                          <span className="mx-0.5 text-xs text-white">
                            Tip: Use Bold For Highlighting but don't overdo it
                          </span>
                        </h4>
                        {entry.achievements.map((achievement, achievementIndex) => (
                          <div
                            key={`${entry.id}-achievement-${achievementIndex}`}
                            className="mb-2 flex items-center space-x-4"
                          >
                            <label className="block text-[#44BCFF] font-medium mb-1">
                              Achievement {achievementIndex + 1}:
                            </label>
                            <input
                              type="text"
                              value={achievement}
                              onKeyDown={(e) =>
                                handleKeyActionOnSublist(
                                  e,
                                  setProjectEntries,
                                  "achievements",
                                  index,
                                  achievementIndex
                                )
                              }
                              onChange={(e) =>
                                handleSubListInputChange(
                                  setProjectEntries,
                                  index,
                                  "achievements",
                                  achievementIndex,
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
                                  "achievements",
                                  achievementIndex
                                )
                              }
                              className="px-2 py-1 text-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 text-xs"
                            >
                              Remove
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
              )}
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
          </div>

          {/* Honors and Achievements Section */}
          <div className="mb-8 border-b pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">Achievements</h2>
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
            <div className={`${!includeHonors ? "opacity-50 pointer-events-none" : ""}`}>
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
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Title*
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
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Link Title*
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
                                  setHonorEntries,
                                  honorEntries,
                                  index,
                                  "linkTitle",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="col-span-full">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Link*
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
                                  setHonorEntries,
                                  honorEntries,
                                  index,
                                  "link",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
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
                            Achievements:*{" "}
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
                                  Achievement {achievementIndex + 1}:
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
                                  Remove
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
          <div className="mb-8 border-b pb-6">
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
            <div className={`${!includeCertificates ? "opacity-50 pointer-events-none" : ""}`}>
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
                          onClick={() => removeEntry(setCertificateEntries, index)}
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
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Date*
                          </label>
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
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Certificate Link*{" "}
                            <span className="mx-0.5 text-xs text-white">
                              Tip: The URL of your certificate or verification page
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
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
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
                  onClick={() => addEntry(setCertificateEntries, defaultCertificateEntry)}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Certificate
                </button>
              </div>
            </div>
          </div>

          {/* Positions of Responsibility Section */}
          <div className="mb-8 border-b pb-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-light text-white">Positions of Responsibility</h2>
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
            <div className={`${!includePositions ? "opacity-50 pointer-events-none" : ""}`}>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Position Name*
                          </label>
                          <Tooltip
                            title="Not Allowed Here"
                            message="Making Text Bold is not allowed here"
                          >
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
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Society Name*
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
                                  setPositionEntries,
                                  positionEntries,
                                  index,
                                  "societyName",
                                  e.target.value
                                )
                              }
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 border-white/10"
                              required
                            />
                          </Tooltip>
                        </div>

                        <div>
                          <label className="block text-[#44BCFF] font-medium mb-2">
                            Date*
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
                                  setPositionEntries,
                                  positionEntries,
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => addEntry(setPositionEntries, defaultPositionEntry)}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <PlusIcon className="w-4 h-4" /> Add Position
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
                  title="Get quote now"
                  className="relative  inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Generate Resume
                </button>
              </div>
            </div>
          </div>
        </form>
        <PdfBox pdfUrl={pdfUrl} defaultPdfUrl={hello} />
      </div>
    </>
  );
}

export default ResumeWithPhoto;
