from fastapi import FastAPI, Form, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import os
from enum import Enum
from typing import Optional
from pydantic import BaseModel
import json
from google import genai
import dotenv
from models.resumewithphoto import ResumeWithPhotoModel,ResumeWithPhotoInstruction
from models.nitResume import NITResumeModel,NITResumeInstruction
dotenv.load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))




class ResumeType(str,Enum):
    RESUME_WITH_PHOTO = "RESUME_WITH_PHOTO"
    NIT_RESUME = "NIT_RESUME"
    
MODEL_MAP = {ResumeType.RESUME_WITH_PHOTO:[ResumeWithPhotoModel,ResumeWithPhotoInstruction],
             ResumeType.NIT_RESUME:[NITResumeModel,NITResumeInstruction]}

class PromptModel(BaseModel):
    prompt: str
    type: ResumeType
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/convert-prompt-to-json")
def call_llm(prompt: PromptModel):
    type = prompt.type
    print(MODEL_MAP[type][1])
    response = client.models.generate_content(
      model="gemini-1.5-flash",
      
      contents=f"${MODEL_MAP[type][1]} \n {prompt}",
        config={
            "response_mime_type": "application/json",
            "response_schema": MODEL_MAP[type][0],
        },
    )
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
