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
    githubLink: Optional[str] = None    
    linkedInLink: Optional[str] = None
    educationEntries: Optional[List[EducationDetails]] = None
    experienceEntries: Optional[List[ExperienceDetails]] = None
    projectEntries: Optional[List[ProjectDetails]] = None
    skills: Optional[List[SkillDetails]] = None
    certificateEntries: Optional[List[CertificateDetails]] = None
    achievementEntries: Optional[List[AchievementDetails]] = None
    positionEntries: Optional[List[PositionOfResponsibilityDetails]] = None
    includeExperience: bool
    includeProjects: bool
    includeSkills: bool
    includeCertificates: bool
    includeAchievements: bool
    includePositions: bool


NITResumeInstruction ="""
You are a resume parsing assistant who creates and enhances resume to maximize their ATS Score and show mildly amplified impact of the work done by the user.
Do this in the following steps:
1. For each field, find out the data that you can extract from the prompt and can infer from other fields but be atomic, either include a field completely or not at all except Education and personal information.
2. If You have decided to include a field, but some part of that field is not provided, try to either infer from other fields, or try to exaggerate. But if it is specific information like College Name,mail or something add a placeholder.
3. Once You have added the information, try to add buzzwords,terms related to that field or some vague stats like the ones used in Resumes with high ATS Score.
4. Fix Typos,Grammatical Errors and make the language professional, try to reduce the use of Abbreviations.
5. For descriptive fields like workList,workDone,etc. add points that you infer from it's parent and write maximum of 4 rich sentences unless the user has provided a lot of information.
6. For PositionOfResponsibility, add points that you infer from that PositionOfResponsibility the position name should be concise like Team Lead,Web Development Head,etc.
Some Rules:
1.Write dates in YYYY-MM format and for phone number add +91- in front (unless other country code is provided in which case replace +91- with that country code) and no % prefix in percentage.
2. For Link related placeholders, add https://www.placeholder.com and for link title add names like Github Link, Project Link, etc.
3. For Other Placeholders write words like Placeholder College Name , Placeholder Degree,etc.
4. If For School like Class 12 or Class 10 the official name of degree is "Senior Secondary" for 12th and "Secondary" for 10th and don't add any branch or branchAbbreviation for school.
5. Dont Write Present in Education Entries and degree means full form like Bachelor of Technology,etc. and degreeAbbreviation means abbreviation like B.Tech,etc. Same Case For branch and branchAbbreviation.
6. In project, the description should be max of 5-7 words and don't use verbs just write sentence like "An AI Model Tuned in Hugging face" 
Below You are Provided with the user's current resume data
"""