"use client"

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import verify from "../public/lottie/verify.json";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [first, setFirst] = useState("mp3");
  const [second, setSecond] = useState("choose");
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedFileUrl(null);
    }
  };

  const handleFirstChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFirst = event.target.value;
    setFirst(newFirst);

    if (newFirst !== second) {
      const newSecond = ["mp3", "mp4", "wav", "ogg", "m4a", "flac", "wma", "aac"].find(format => format !== newFirst);
      if (newSecond) {
        setSecond(newSecond);
      }
    }
  };

  const handleSecondChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSecond = event.target.value;
    setSecond(newSecond);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (second === "choose") {
      console.error("Please choose a valid format to convert to.");
      return;
    }

    if (!file) {
      console.error("No file selected");
      return;
    }

    const selectedSecond = second !== first ? second : first;
    const format = `${first}_${selectedSecond}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const endpoint = "http://127.0.0.1:8000/api/convert";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setConvertedFileUrl(url);
      } else {
        console.error("Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDownload = () => {
    if (convertedFileUrl) {
      const downloadFormat = second !== "choose" ? second : first;
      const a = document.createElement("a");
      a.href = convertedFileUrl;
      a.download = `converted.${downloadFormat}`;
      a.click();
      window.URL.revokeObjectURL(convertedFileUrl);
    }
  };

  useEffect(() => {
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension && ["mp3", "wav", "ogg", "m4a", "flac", "wma", "aac", "mp4"].includes(fileExtension)) {
        setFirst(fileExtension);
      }
    }
  }, [file]);

  return (
    <main className="flex min-h-screen flex-row">
      <div className="flex flex-col w-1/2 items-center">
        <div className="flex flex-col justify-end h-1/2 w-[80%] gap-5">
          <h1 className="w-min text-[#1c1107] font-bold text-7xl">Audio Converter</h1>
          <a className="text-black text-2xl font-medium w-[85%]">Simple, easy and fast audio converter tool. Don&apos;t wait and convert your file!</a>
        </div>
        <div className="flex h-1/2 justify-end items-end">
          <span className="text-[#1c1107] justify-end items-end">made by <Link href="https://codenerds.tech" className="hover:text-[#ff50ac]">codenerds.tech</Link></span>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white w-1/2 rounded-l-[5%] border-l-2 border-rose-200 shadow-xl">
      <div className="flex flex-col items-center justify-center w-full">
      {
                convertedFileUrl ? (
                  <div className="flex flex-col items-center justify-center align-center gap-5">
                    <Lottie className="h-32 w-32" animationData={verify} loop={true} />
                    <h1 className="text-black text-xl">Your file is ready to download!</h1>
                    <audio controls src={convertedFileUrl}></audio>
                    <div className="flex flex-row justify-between w-full">
                      <button className="border-2 border-[#ff50ac] text-[#ff50ac] hover:bg-[#ff50ac] hover:border-white hover:text-white py-2 px-4 rounded-2xl font-medium transition" onClick={() => window.location.reload()}>Back</button>
                      <button className="text-white bg-[#ff50ac] hover:bg-white hover:text-[#ff50ac] border-white border-2 hover:border-[#ff50ac] py-2 px-4 rounded-2xl font-medium transition" onClick={handleDownload}>Download</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-1/2 h-64">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="75" height="75" viewBox="0,0,256,256" className="mb-4">
                        <g fill="#8f8f8f" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none"><g transform="scale(5.12,5.12)"><path d="M37,4h-24c-4.962,0 -9,4.037 -9,9v24c0,4.963 4.038,9 9,9h24c4.962,0 9,-4.037 9,-9v-24c0,-4.963 -4.038,-9 -9,-9zM35,27v4v0.021h-0.002c-0.012,2.747 -2.249,4.979 -4.998,4.979h-0.5c-0.987,0 -1.933,-0.42 -2.596,-1.152c-0.662,-0.731 -0.985,-1.718 -0.887,-2.705c0.178,-1.763 1.77,-3.143 3.626,-3.143h1.357c1.103,0 2,-0.897 2,-2v-9.795l-12,2.25v10.545v4c0,2.757 -2.243,5 -5,5h-0.5c-0.987,0 -1.933,-0.42 -2.596,-1.152c-0.662,-0.731 -0.985,-1.718 -0.887,-2.705c0.178,-1.763 1.77,-3.143 3.626,-3.143h1.357c1.103,0 2,-0.897 2,-2v-14.647c0,-0.963 0.687,-1.79 1.633,-1.966l12.591,-2.36c0.439,-0.083 0.891,0.033 1.234,0.319c0.345,0.286 0.542,0.707 0.542,1.154z"></path></g></g>
                      </svg>
                          <p className="mb-2 text-white bg-[#ff50ac] py-3 px-6 rounded-2xl font-medium">Upload track</p>
                          <p className="text-gray-500 mb-2">Or drop file here...</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">MP3, MP4, WAV, OGG, M4A, FLAC, WMA, AAC</p>
                          {file && <p className="text-black mt-3">{file.name}</p>}
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" accept=".mp3, .mp4, .wav, .ogg, .m4a, .flac, .wma, .aac" onChange={handleFileInputChange}/>
                  </label>
                  {file &&
                  <div className="mt-3 gap-3 flex flex-row text-black align-center items-center">
                    <select id="first" onChange={handleFirstChange} value={first} disabled className="rounded-lg border-2 border-gray-300 p-1">
                      <option value="mp3">MP3</option>
                      <option value="mp4">MP4</option>
                      <option value="wav">WAV</option>
                      <option value="ogg">OGG</option>
                      <option value="m4a">M4A</option>
                      <option value="flac">FLAC</option>
                      <option value="wma">WMA</option>
                      <option value="aac">AAC</option>
                    </select>
                    <a>to</a>
                    <select id="second" value={second} onChange={handleSecondChange} className="rounded-lg border-2 border-[#ff50ac] p-1">
  <option value="choose">Choose</option>
  {["mp3", "mp4", "wav", "ogg", "m4a", "flac", "wma", "aac"].map((format) => (
    format !== first && <option key={format} value={format}>{format.toUpperCase()}</option>
  ))}
</select>
                  </div>}
                  {file && <button className="mt-3 text-white bg-[#ff50ac] hover:bg-white hover:text-[#ff50ac] border-white border-2 hover:border-[#ff50ac] py-2 px-4 rounded-2xl font-medium transition">Convert</button>}
                </form>
                )
      }
      </div>
      </div>
    </main>
  );
}