from fastapi import FastAPI, Form, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import os
import asyncio
import aiofiles
from enum import Enum
from typing import Optional
from pydantic import BaseModel
import json
from google import genai
import logging
import dotenv
from models.resumewithphoto import ResumeWithPhotoModel, ResumeWithPhotoInstruction
from models.nitResume import NITResumeModel, NITResumeInstruction
from models.jakeResume import JakeResumeModel, JakeResumeInstruction
from typing import Union


dotenv.load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ResumeType(str, Enum):
    RESUME_WITH_PHOTO = "RESUME_WITH_PHOTO"
    NIT_RESUME = "NIT_RESUME"
    JAKE_RESUME = "JAKE_RESUME"


MODEL_MAP = {
    ResumeType.RESUME_WITH_PHOTO: [ResumeWithPhotoModel, ResumeWithPhotoInstruction],
    ResumeType.NIT_RESUME: [NITResumeModel, NITResumeInstruction],
    ResumeType.JAKE_RESUME: [JakeResumeModel, JakeResumeInstruction],
}


class PromptModel(BaseModel):
    prompt: str
    type: ResumeType
    formDataStore: Optional[
        Union[ResumeWithPhotoModel, NITResumeModel, JakeResumeModel]
    ]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEBPAGE_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/convert-prompt-to-json")
async def call_llm(prompt: PromptModel):
    try:
        type = prompt.type
        response = client.models.generate_content(
            model="gemini-1.5-flash-8b",
            contents=f"{MODEL_MAP[type][1]} \n Current Resume: {prompt.formDataStore if prompt.formDataStore else ''}\n Now here is the user's prompt \n Prompt: {prompt} \n Now incorporate the additional details provided in the prompt into the existing resume if it is non empty,for which you create a fresh one, if there are conflicts, prioritize the prompt information and finally generate a JSON string", 
            config={
                "response_mime_type": "application/json",
                "response_schema": MODEL_MAP[type][0],
            },
        )
        final = response.text.strip().removeprefix("```json\n").removesuffix("\n```")
        return json.loads(final)
    except Exception as e:
        logger.error(f"Error in call_llm: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/")
async def send_code(
    background_tasks: BackgroundTasks,
    payload: str = Form(...),
    imageFile: Optional[UploadFile] = None,
    globalId: Optional[str] = Form(None),
):
    try:
        image_format = imageFile.content_type.split("/")[1] if imageFile else None
        if imageFile and image_format not in ["jpeg", "png"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid image format. Only JPEG and PNG are supported.",
            )

        delete_list = [
            f"image-{globalId}.{image_format}",
            f"pdf-{globalId}.aux",
            f"pdf-{globalId}.log",
            f"pdf-{globalId}.out",
            f"pdf-{globalId}.pdf",
            f"code-{globalId}.tex",
        ]

        def cleanup():
            for file in delete_list:
                if os.path.exists(file):
                    os.remove(file)

        background_tasks.add_task(cleanup)

        async with aiofiles.open(
            f"code-{globalId}.tex", "w", encoding="utf-8", newline=""
        ) as f:
            await f.write(payload)
        if imageFile:
            async with aiofiles.open(f"image-{globalId}.{image_format}", "wb") as f:
                await f.write(await imageFile.read())

        await asyncio.to_thread(
            subprocess.run,
            [
                "pdflatex",
                f"-jobname=pdf-{globalId}",
                "-interaction=nonstopmode",
                f"code-{globalId}.tex",
            ],
        )

        file_path = f"pdf-{globalId}.pdf"
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=500, detail="Failed to generate resume. Please try again."
            )
        response = FileResponse(file_path, media_type="application/pdf")

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
