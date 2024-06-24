"use client";
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { Navbar } from "@/components/navbar";
import React from "react";
import "@/styles/style.css";
import { useState,useRef } from "react";
import { uploadVideoAction } from "@/app/actions";
import Videolist from "@/components/videolist";
import { useSWRConfig } from "swr";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {mutate}= useSWRConfig()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    if (file && file.type.startsWith("video/")) {
      const formData = new FormData(event.currentTarget);
      const response = await uploadVideoAction(formData);
      console.log(response)
      if (response?.message==='valid') {
        mutate('/api/videos')
        setFile(null);
        setPreviewUrl(null);
        setForm({ title: "", description: "" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        console.log(response);
      }else{
        toast.error("couldn't upload")
      }
    }
    setLoading(false);
  }
  return (
    <>
      <Navbar />
      <main className="main">
        <div className="responsive-wrapper">
          <div className="main-header">
            <form
              className="border border-neutral-200 rounded-lg px-1 sm:px-4 py-2 w-full relative"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start align-baseline pb-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div></div>
                  <label className="w-full mt-4">
                    <div className="text-neutral-500 font-semibold">Title</div>
                    <input
                      className="bg-transparent flex-1 border-none outline-none"
                      type="text"
                      required
                      value={form.title}
                      name="title"
                      onChange={(e) => {
                        setForm((prev) => {
                          return { ...prev, title: e.target.value };
                        });
                      }}
                      placeholder="enter the title ..."
                    />
                  </label>
                  <label className="w-full ">
                    <div className="text-neutral-500 font-semibold">
                      Description
                    </div>
                    <input
                      className="bg-transparent flex-1 border-none outline-none"
                      type="text"
                      required
                      name="description"
                      value={form.description}
                      onChange={(e) => {
                        setForm((prev) => {
                          return { ...prev, description: e.target.value };
                        });
                      }}
                      placeholder="enter the description..."
                    />
                  </label>
                  <label className="flex ">
                    <svg
                      className="w-5 h-5 hover:cursor-pointer transform-gpu active:scale-75 transition-all text-neutral-400"
                      aria-label="Attach media"
                      role="img"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M13.9455 9.0196L8.49626 14.4688C7.16326 15.8091 5.38347 15.692 4.23357 14.5347C3.07634 13.3922 2.9738 11.6197 4.30681 10.2794L11.7995 2.78669C12.5392 2.04694 13.6745 1.85651 14.4289 2.60358C15.1833 3.3653 14.9855 4.4859 14.2458 5.22565L6.83367 12.6524C6.57732 12.9088 6.28435 12.8355 6.10124 12.6671C5.94011 12.4986 5.87419 12.1983 6.12322 11.942L11.2868 6.78571C11.6091 6.45612 11.6164 5.97272 11.3088 5.65778C10.9938 5.35749 10.5031 5.35749 10.1808 5.67975L4.99529 10.8653C4.13835 11.7296 4.1823 13.0626 4.95134 13.8316C5.77898 14.6592 7.03874 14.6446 7.903 13.7803L15.3664 6.32428C16.8678 4.81549 16.8312 2.83063 15.4909 1.4903C14.1799 0.179264 12.1584 0.106021 10.6496 1.60749L3.10564 9.16608C1.16472 11.1143 1.27458 13.9268 3.06169 15.7139C4.8488 17.4937 7.6613 17.6109 9.60955 15.6773L15.1027 10.1841C15.4103 9.87653 15.4103 9.30524 15.0881 9.00495C14.7878 8.68268 14.2677 8.70465 13.9455 9.0196Z"
                        className="fill-current"
                      ></path>
                    </svg>
                    <div className="text-sm text-neutral-400 mb-2 px-2">
                      Attach video
                    </div>
                    <input
                      className="bg-transparent flex-1 border-none outline-none hidden"
                      name="media"
                      type="file"
                      required
                      ref={fileInputRef}
                      accept="video/mp4,video/quicktime"
                      onChange={handleFileChange}
                    />
                  </label>
                  <label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="border border-neutral-200 rounded-lg hover:bg-neutral-200 p-1 duration-700 text-sm text-neutral-300 hover:text-neutral-400 px-2"
                    >
                      Upload video
                    </button>
                  </label>
                </div>
                {previewUrl && file && (
                  <div className="mt-4">
                    {file.type.startsWith("image/") ? (
                      <img src={previewUrl} alt="Selected file" />
                    ) : file.type.startsWith("video/") ? (
                      <video className="rounded-lg" src={previewUrl} controls />
                    ) : null}
                  </div>
                )}
              </div>
              {loading && (
                <div className="spinner">
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                </div>
              )}
            </form>
          </div>
          <div className="content">
            <div className="content-panel">
              <div className="vertical-tabs">
                <a href="#" className="active">
                  All Videos
                </a>
              </div>
            </div>
            <div className="content-main">
               <Videolist/>
            </div>
          </div>
        </div>
      </main>
      <Toaster/>
    </>
  );
}
