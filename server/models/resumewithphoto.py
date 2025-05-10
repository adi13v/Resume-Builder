from pydantic import BaseModel
from typing import Optional

class EducationEntry(BaseModel):
    id: str
    instituteName: str
    degree: str
    branch: str
    location: str
    startDate: str
    endDate: str
    gradeType: str
    cgpa: Optional[str]
    percentage: Optional[str]


class ExperienceEntry(BaseModel):
    id: str
    jobTitle: str
    companyName: str
    location: str
    startDate: str
    endDate: str
    workList: list[str]


class ProjectEntry(BaseModel):
    id: str
    projectName: str
    projectLinkTitle: str
    projectLink: str
    featureList: list[str]
    startDate: str
    endDate: str


class Skill(BaseModel):
    id: str
    key: str
    value: str


class HonorEntry(BaseModel):
    id: str
    title: str
    date: str
    description: str
    linkTitle: str
    link: str


class ClubEntry(BaseModel):
    id: str
    title: str
    societyName: str
    startDate: str
    endDate: str
    achievements: list[str]


class CertificateEntry(BaseModel):
    id: str
    title: str
    link: str


class ResumeWithPhotoModel(BaseModel):
    name: str
    email: str
    phoneNumber: str
    githubLink: str
    linkedInLink: str
    portfolioLink: str
    educationEntries: list[EducationEntry]
    experienceEntries: list[ExperienceEntry]
    projectEntries: list[ProjectEntry]
    skills: list[Skill]
    honorEntries: list[HonorEntry]
    clubEntries: list[ClubEntry]
    certificateEntries: list[CertificateEntry]
    includeExperience: bool
    includeProjects: bool
    includeSkills: bool
    includeHonors: bool
    includeClubs: bool
    includeCertificates: bool


ResumeWithPhotoInstruction ="""You are a resume parsing assistant who creates and enhances resume by providing keywords like enhanced,integrated,spearheded,Lead,etc and your job is to write a resume of industry standard and maxiize ATS Score and maximize the impact of the resume.
             Instructions:
             -Write dates in YYYY-MM format and country code with - in front of phone number and no % prefix in percentage.
             - Use placeholder data for specific fields like name,location,data,link,percentage,cgpa,etc, unless provided by the user.
             - For generalized fields like workList,skillListFeatureList, if you are not provided specific information, write data that you infer from other sections.
             - Education is important, apart from that don't include fields for which you can't infer susbtantial data.
             - Whatver the user provides, add some buzzwords,add terms related to their education field, and more dense text with some related information to the one provided
             -Add skill inferred from experience,projects,other data given by the user, in addition to the ones provided by the user
             Now, convert the following user input into a JSON string 
             """
