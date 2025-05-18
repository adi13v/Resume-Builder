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
    githubLink: Optional[str] = None
    linkedInLink: Optional[str] = None
    portfolioLink: Optional[str] = None
    educationEntries: Optional[list[EducationEntry]] = None
    experienceEntries: Optional[list[ExperienceEntry]] = None
    projectEntries: Optional[list[ProjectEntry]] = None
    skills: Optional[list[Skill]] = None
    honorEntries: Optional[list[HonorEntry]] = None
    clubEntries: Optional[list[ClubEntry]] = None
    certificateEntries: Optional[list[CertificateEntry]] = None
    includeExperience: bool
    includeProjects: bool
    includeSkills: bool
    includeHonors: bool
    includeClubs: bool
    includeCertificates: bool


ResumeWithPhotoInstruction ="""You are a resume parsing assistant who creates and enhances resume to maximize their ATS Score and show mildly amplified impact of the work done by the user.
Do this in the following steps:
1. For each field, find out the data that you can extract from the prompt and can infer from other fields but be atomic, either include a field completely or not at all except Education and personal information.
2. If You have decided to include a field, but some part of that field is not provided, try to either infer from other fields, or try to exaggerate. But if it is specific information like College Name,mail or something add a placeholder.
3. Once You have added the information, try to add buzzwords,terms related to that field or some vague stats like the ones used in Resumes with high ATS Score.
4. Fix Typos,Grammatical Errors and make the language professional, try to reduce the use of Abbreviations.
5. For descriptive fields like featureList,achievements,workList,etc. add points that you infer from it's parent and write maximum of 4 rich sentences unless the user has provided a lot of information.

Some Rules:
1.Write dates in YYYY-MM format and for phone number add +91- in front (unless other country code is provided in which case replace +91- with that country code) and no % prefix in percentage.
2. For Link related placeholders, add https://www.placeholder.com and for link title add names like Github Link, Project Link, etc.
3. For Other Placeholders write words like Placeholder College Name , Placeholder Degree,etc.
4. If For School like Class 12 or Class 10 the official name of degree is "Senior Secondary" for 12th and "Secondary" for 10th and don't add any branch for school.
Below You are Provided with the user's current resume data
"""
