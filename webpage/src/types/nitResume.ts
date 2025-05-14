export interface EducationDetails {
  id: string;
  instituteName: string;
  degree: string;
  degreeAbbreviation?: string
  branch: string;
  branchAbbreviation?:string
  location: string;
  endDate: string;
  gradeType: string;
  cgpa: string;
  percentage: string;
}

export interface ExperienceDetails {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  workList: string[];
}

export interface ProjectDetails {
  id: string;
  projectName: string;
  description: string;
  toolsUsed: string;
  linkTitle: string;
  projectLink: string;
  startDate: string;
  endDate: string;
  workDone: string[];
}

export interface SkillDetails {
  id: string;
  key: string;
  value: string;
}

export interface CertificateDetails {
  id: string;
  title: string;
  link: string;
  date: string;
}

export interface AchievementDetails {
  id: string;
  title: string;
  linkTitle: string;
  link: string;
}

export interface PositionOfResponsibilityDetails {
  id: string;
  positionName: string;
  organizationName: string;
  date: string;
}

export interface FormDataStore {
  name: string;
  email: string;
  phoneNumber: string;
  githubLink: string;
  linkedInLink: string;
  educationEntries: EducationDetails[];
  experienceEntries: ExperienceDetails[];
  projectEntries: ProjectDetails[];
  skills: SkillDetails[];
  certificateEntries: CertificateDetails[];
  achievementEntries: AchievementDetails[];
  positionEntries: PositionOfResponsibilityDetails[];
  includeExperience: boolean;
  includeProjects: boolean;
  includeSkills: boolean;
  includeCertificates: boolean;
  includeAchievements: boolean;
  includePositions: boolean;
  prompt: string;
}
