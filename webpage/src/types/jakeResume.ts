export interface BaseEntry {
  id: string; // Or the appropriate ID type
}

export interface FormDataStore {
  name: string;
  email: string;
  phoneNumber: string;
  githubLink: string;
  linkedInLink: string;
  portfolioLink: string;
  educationEntries: EducationDetails[];
  experienceEntries: ExperienceDetails[];
  projectEntries: ProjectDetails[];
  certificateEntries: CertificateDetails[];
  achievementEntries: AchievementDetails[];
  clubEntries: ClubDetails[];
  skills: SkillDetails[];
  includeExperience: boolean;
  includeProjects: boolean;
  includeSkills: boolean;
  includeCertificates: boolean;
  includeAchievements: boolean;
  includeClubs: boolean;
  includeGrade: boolean;
  prompt: string;
  
}



export interface EducationDetails extends BaseEntry {
  instituteName: string;
  degree: string;
  branch:string
  location: string;
  startDate: string;
  endDate: string;
  gradeType: string;
  cgpa?: string;
  percentage?: string;
}

export interface ExperienceDetails extends BaseEntry {
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  workList: string[];
}

export interface ProjectDetails extends BaseEntry {
  projectName: string;
  projectLinkTitle: string;
  projectLink: string;
  featureList: string[];
  startDate: string;
  endDate: string;
}
export interface CertificateDetails extends BaseEntry {
    title: string;
    link: string;
  }

 
export interface ClubDetails extends BaseEntry {
    title: string;
    societyName: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }

  export interface AchievementDetails extends BaseEntry {
    title: string;
    linkTitle: string;
    link: string;
  }

export interface SkillDetails extends BaseEntry {
  key: string;
  value: string;
}
