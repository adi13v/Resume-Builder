from fastapi import FastAPI, Form, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import os
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
            
#TO:DO  "-interaction=nonstopmode",
    subprocess.run(["pdflatex",  f"-jobname=pdf-{globalId}", f"code-{globalId}.tex"])
    file_path = f"pdf-{globalId}.pdf"
    response = FileResponse(file_path, media_type="application/pdf")
    #To-DO add the code file to the delete list
    # f"code-{globalId}.tex",
    delete_list = [f"image-{globalId}.{image_format}",f"pdf-{globalId}.aux",f"pdf-{globalId}.log",f"pdf-{globalId}.out",f"pdf-{globalId}.pdf"]
    def cleanup():
        for file in delete_list:
            if os.path.exists(file):
                os.remove(file)

    background_tasks.add_task(cleanup)
    return response


@app.post("/test")
async def test():
    subprocess.run(["pdflatex", "code.tex"])
