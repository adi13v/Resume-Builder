from pydantic import BaseModel
from typing import List, Optional


class EducationDetails(BaseModel):
    id: str
    instituteName: str
    degree: str
    degreeAbbreviation: Optional[str] = None
    branch: str
    branchAbbreviation: Optional[str] = None
    location: str
    endDate: str
    gradeType: str
    cgpa: str
    percentage: str


class ExperienceDetails(BaseModel):
    id: str
    jobTitle: str
    companyName: str
    location: str
    startDate: str
    endDate: str
    workList: List[str]


class ProjectDetails(BaseModel):
    id: str
    projectName: str
    description: str
    toolsUsed: str
    linkTitle: str
    projectLink: str
    startDate: str
    endDate: str
    workDone: List[str]


class SkillDetails(BaseModel):
    id: str
    key: str
    value: str


class CertificateDetails(BaseModel):
    id: str
    title: str
    link: str
    date: str


class AchievementDetails(BaseModel):
    id: str
    title: str
    linkTitle: str
    link: str


class PositionOfResponsibilityDetails(BaseModel):
    id: str
    positionName: str
    organizationName: str
    date: str


class NITResumeModel(BaseModel):
    name: str
    email: str
    phoneNumber: str
    githubLink: str
    linkedInLink: str
    portfolioLink: str
    educationEntries: List[EducationDetails]
    experienceEntries: List[ExperienceDetails]
    projectEntries: List[ProjectDetails]
    skills: List[SkillDetails]
    certificateEntries: List[CertificateDetails]
    achievementEntries: List[AchievementDetails]
    positionEntries: List[PositionOfResponsibilityDetails]
    includeExperience: bool
    includeProjects: bool
    includeSkills: bool
    includeCertificates: bool
    includeAchievements: bool
    includePositions: bool



NITResumeInstruction ="""You are a resume parsing assistant who creates and enhances resume to maximize their ATS Score and show mildly amplified impact of the work done by the user.
             Instructions:
             - Write dates in YYYY-MM format and country code with - in front of phone number and no % prefix in percentage.
             - Use placeholder data for specific fields like name,location,data,link,percentage,cgpa,etc, unless provided by the user.
             - For Link placeholder, use proper formatted url like https://www.google.com.
             - Dont Write Present in Education Entries and degree means full form like Bachelor of Technology,etc. and degreeAbbreviation means abbreviation like B.Tech,etc. Same Case For branch and branchAbbreviation.
             - For Link Title, the placeholder should be like "Link","Project Link","Profile Link".
             - Education is important, apart from that don't include fields for which you can't infer substantial data. Enforce it by using the varibales with prefix include and return false if you can't infer substantial data.
             - Use Keywords and Sentence Structures Present in High ATS Score Resumes and preferably sentense like "Developed [specific achievement] achieving [specific metric] in [specific area]" this, but don't overdo it.
             - For generalized fields like workList,skillListFeatureList, if you are not provided specific information, write data that you infer from other sections.
             - Whatver the user provides, add some buzzwords,add terms related to their education field, and more dense text with some related information to the one provided
             - Add skill inferred from experience,projects,other data given by the user, in addition to the ones provided by the user. The skill's values are collection of words seperated by commas.
             - The Project section has all the fields interconnected , fill or amplify and missing field based on it's other fields of that entry, but don't include if no information is provided.
             -In project, the description should be max of 5-7 words and don't use verbs just write sentence like "An AI Model Tuned in Hugging face"
             Now, convert the following user input into a JSON string 
             """