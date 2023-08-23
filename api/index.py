from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
import subprocess
import os
import uuid
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

@app.post("/api/convert")
async def convert_audio_format(
    file: UploadFile = File(...),
    format: str = Form(...)
):
    input_format, output_format = format.split("_")

    try:
        file_content = await file.read()

        temp_second_file = f"temp_{str(uuid.uuid4())}.{output_format}"
        subprocess.run(["ffmpeg", "-i", "-", temp_second_file], input=file_content, check=True)

        response = StreamingResponse(io.BytesIO(file_content), media_type=f"audio/{output_format}")
        response.headers["Content-Disposition"] = f"attachment; filename=converted.{output_format}"

        return response

    except Exception as e:
        return {"error": str(e)}
