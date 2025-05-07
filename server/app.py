from fastapi import FastAPI, Form, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import os
from typing import Optional
from pydantic import BaseModel
import json
from google import genai
import dotenv

dotenv.load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class PromptModel(BaseModel):
    prompt: str



app = FastAPI()
DEMO_JSON = """
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+91-1234567890",
  "githubLink": "https://github.com/johndoe",
  "linkedInLink": "https://linkedin.com/in/johndoe",
  "portfolioLink": "https://johndoe.dev",
  "educationEntries": [
    {
      "id": "1",
      "instituteName": "ABC University",
      "degree": "B.Tech",
      "branch": "Computer Science",
      "location": "New York, USA",
      "startDate": "August 2020",
      "endDate": "May 2024",
      "gradeType": "CGPA",
      "cgpa": "9.1"
    },
  ],
  "experienceEntries": [
    {
      "id": "1",
      "jobTitle": "Software Engineer Intern",
      "companyName": "TechCorp",
      "location": "San Francisco",
      "startDate": "June 2023",
      "endDate": "August 2023",
      "workList": [
        "Built scalable backend services",
        "Implemented CI/CD pipelines"
      ]
    }
  ],
  "projectEntries": [
    {
      "id": "1",
      "projectName": "AI Resume Builder",
      "projectLinkTitle": "Live Demo",
      "projectLink": "https://resume.ai",
      "featureList": [
        "PDF generation using TeXLive",
        "JSON resume schema with Gemini API"
      ],
      "startDate": "Jan 2024",
      "endDate": "Apr 2024"
    }
  ],
  "skills": [
    {
      "id": "1",
      "key": "Languages",
      "value": "TypeScript, Python, C++"
    }
  ],
  "honorEntries": [
    {
      "id": "1",
      "title": "Best Intern Award",
      "date": "August 2023",
      "description": "Recognized for outstanding contributions at TechCorp",
      "linkTitle": "Certificate",
      "link": "https://example.com/certificate"
    }
  ],
  "clubEntries": [
    {
      "id": "1",
      "title": "Technical Head",
      "societyName": "Code Club",
      "startDate": "Jan 2022",
      "endDate": "Dec 2023",
      "achievements": [
        "Organized 10+ hackathons",
        "Mentored juniors"
      ]
    }
  ],
  "certificateEntries": [
    {
      "id": "1",
      "title": "Full Stack Developer",
      "link": "https://certificates.dev/fullstack"
    }
  ],
  "includeExperience": true,
  "includeProjects": true,
  "includeSkills": true,
  "includeHonors": true,
  "includeClubs": true,
  "includeCertificates": true
}
"""

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/convert-prompt-to-json")
def call_llm(prompt: PromptModel):
    
    response = client.models.generate_content(model="gemini-1.5-flash", contents=f"""You are a resume parsing assistant who enhances resume by providing keywords like enhanced,integrated,spearheded,Lead,etc. Based on the input text provided, convert the user's information into a strictly formatted JSON string matching the following example:
                {DEMO_JSON}
             Instructions:
             - Use industry standard so that ATS score of resume can be maximized.
             - Use placeholder values like "January 1111" or "Location Placeholder" or if certain data is missing.
             - Ensure every required field is present in the JSON.
             - education is important apart from that don't include fields for which you can't infer susbtantial data.
             - Whatver the user provides, add some buzzwords, and more dense text with some related information to the one provided
             -Add skill inferred from experience,projects,other data given by the user and also the ones provided by the user
             Now, convert the following user input into a similar structure to the one provided in example json :
             
             {prompt}  
             """)
    final = response.text.strip().removeprefix("```json\n").removesuffix("\n```")
    return json.loads(final)


@app.post("/")
async def send_code(
    background_tasks: BackgroundTasks,
    payload: str = Form(...),
    imageFile: Optional[UploadFile] = None,
    globalId: Optional[str] = Form(None),
):
    # print(imageFile)
    # return {"message": "Image received"}

    image_format = imageFile.content_type.split("/")[1] if imageFile else None
    if imageFile and image_format not in ["jpeg", "png"]:
        return {"error": "Invalid image format. Only JPEG and PNG are supported."}

    with open(f"code-{globalId}.tex", "w", encoding="utf-8", newline="") as f:
        f.write(payload)
    if imageFile:
        with open(f"image-{globalId}.{image_format}", "wb") as f:
            f.write(await imageFile.read())

    # TO:DO  "-interaction=nonstopmode",
    subprocess.run(["pdflatex", f"-jobname=pdf-{globalId}", f"code-{globalId}.tex"])
    file_path = f"pdf-{globalId}.pdf"
    response = FileResponse(file_path, media_type="application/pdf")
    # To-DO add the code file to the delete list
    # f"code-{globalId}.tex",
    delete_list = [
        f"image-{globalId}.{image_format}",
        f"pdf-{globalId}.aux",
        f"pdf-{globalId}.log",
        f"pdf-{globalId}.out",
        f"pdf-{globalId}.pdf",
    ]

    def cleanup():
        for file in delete_list:
            if os.path.exists(file):
                os.remove(file)

    background_tasks.add_task(cleanup)
    return response


@app.post("/test")
async def test():
    subprocess.run(["pdflatex", "code.tex"])
