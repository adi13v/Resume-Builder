from typing import List, Optional
from pydantic import BaseModel, HttpUrl


# BaseEntry equivalent
class BaseEntry(BaseModel):
    id: str  # Or the appropriate ID type, e.g., int, UUID


class EducationDetails(BaseEntry):
    instituteName: str
    degree: str
    branch: str
    location: str
    startDate: str  # Consider using date or datetime type if more specific validation is needed
    endDate: str  # Consider using date or datetime type
    gradeType: str
    cgpa: Optional[str] = None
    percentage: Optional[str] = None


# ExperienceDetails equivalent
class ExperienceDetails(BaseEntry):
    jobTitle: str
    companyName: str
    location: str
    startDate: str  # Consider using date or datetime type
    endDate: str  # Consider using date or datetime type
    workList: List[str]


# ProjectDetails equivalent
class ProjectDetails(BaseEntry):
    projectName: str
    projectLinkTitle: str
    projectLink: str  # Pydantic's HttpUrl for URL validation
    featureList: List[str]
    startDate: str  # Consider using date or datetime type
    endDate: str  # Consider using date or datetime type


# CertificateDetails equivalent
class CertificateDetails(BaseEntry):
    title: str
    link: str


# ClubDetails equivalent
class ClubDetails(BaseEntry):
    title: str
    societyName: str
    startDate: str  # Consider using date or datetime type
    endDate: str  # Consider using date or datetime type
    achievements: List[str]


# AchievementDetails equivalent
class AchievementDetails(BaseEntry):
    title: str
    linkTitle: str
    link: str


# SkillDetails equivalent
class SkillDetails(
    BaseModel
):  # Changed from BaseEntry as 'id' was not in TS, but 'key' seems to be the identifier
    key: str  # This was 'key' in the TS interface, not 'id'.
    value: str


# FormDataStore equivalent
class JakeResumeModel(BaseModel):
    name: str
    email: str
    phoneNumber: str
    githubLink: Optional[str] = None
    linkedInLink: Optional[str] = None
    portfolioLink: Optional[str] = None
    educationEntries: Optional[List[EducationDetails]] = None
    experienceEntries: Optional[List[ExperienceDetails]] = None
    projectEntries: Optional[List[ProjectDetails]] = None
    certificateEntries: Optional[List[CertificateDetails]] = None
    achievementEntries: Optional[List[AchievementDetails]] = None
    clubEntries: Optional[List[ClubDetails]] = None
    skills: Optional[List[SkillDetails]] = None
    includeExperience: bool
    includeProjects: bool
    includeSkills: bool
    includeCertificates: bool
    includeAchievements: bool
    includeClubs: bool
    includeGrade: bool
    prompt: str


# JakeResumeInstruction = """You are a resume parsing assistant who creates and enhances resume to maximize their ATS Score and show mildly amplified impact of the work done by the user.
#              Instructions:
#              - Write dates in YYYY-MM format and for phone number add +91- in front (unless other country code is provided in which case replace +91- with that country code) and no % prefix in percentage.
#              - Be atomic, either don't include the field or populate all the entry of that field with data(Add Placeholder if you can't infer data)
#              - Use placeholder data for specific fields like name,location,data,link,percentage,cgpa,etc, unless provided by the user.
#              - Use Keywords and Sentence Structures Present in High ATS Score Resumes.
#              - For generalized fields like workList,skillListFeatureList, if you are not provided specific information, write data that you infer from other sections.
#              - Education is important, apart from that don't include fields for which you can't infer susbtantial data.
#              - Whatver the user provides, add some buzzwords,add terms related to their education field, and more dense text with some related information to the one provided
#              -Add skill inferred from experience,projects,other data given by the user, in addition to the ones provided by the user
#              Now, convert the following user input into a JSON string
#              """


JakeResumeInstruction = """You are a resume parsing assistant who creates and enhances resume to maximize their ATS Score and show mildly amplified impact of the work done by the user.
Do this in the following steps:
1. For each field, find out the data that you can extract from the prompt and can infer from other fields but be atomic, either include a field completely or not at all except Education and personal information.
2. If You have decided to include a field, but some part of that field is not provided, try to either infer from other fields, or try to exaggerate. But if it is specific information like College Name,mail or something add a placeholder.
3. Once You have added the information, try to add buzzwords,terms related to that field or stats like the ones used in Resumes with high ATS Score.
4. Fix Typos,Grammatical Errors and make the language professional, try to reduce the use of Abbreviations especcially in Branch of Education section. For ex. convet Btech to Bachelor of Technology.
5. For descriptive fields like workList,featureList, add points that you infer from that Project/Experience entry and add some points in the list. Add maximum of 4 rich sentences unless the user has provided a lot of information.
Some Rules:
1.Write dates in YYYY-MM format and for phone number add +91- in front (unless other country code is provided in which case replace +91- with that country code) and no % prefix in percentage.
2. For Link related placeholders, add https://www.placeholder.com and for link title add names like Github Link, Project Link, etc.
3. For Other Placeholders write words like Placeholder College Name , Placeholder Degree,etc.
4. If For School like Class 12 or Class 10 the official name of degree is "Senior Secondary" for 12th and "Secondary" for 10th and the branch should be left empty for school.
Below You are Provided with the user's current resume data
"""
