"use client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Share2Icon } from "lucide-react";
import React from "react";
import useSWR from "swr";

type VideoData = {
  id: number;
  url: string;
  key: string;
  name: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  admin_id: string;
};

type ApiResponse = {
  currentVideo: VideoData;
  nextVideo?: VideoData;
  previousVideo?: VideoData;
};

export default function VideoPage({ params }: { params: { slug: string } }) {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/videos/${params.slug}`,
    async (url: string | URL | Request) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );

  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    if (error.message === "Not Found") {
      return <div>Video not found</div>;
    }
    return <div>Error loading video: {error.message}</div>;
  }

  const { currentVideo, nextVideo, previousVideo } = data || {};

  const handleNext = () => {
    if (nextVideo) {
      router.push(`/videos/${nextVideo.id}`);
    }
  };

  const handlePrevious = () => {
    if (previousVideo) {
      router.push(`/videos/${previousVideo.id}`);
    }
  };

  return (
    <>
      <div className="">
        <Navbar />
      </div>

      {currentVideo && (
        <div className="flex justify-between gap-10 px-12 pt-20">
          <div className="sm:w-[60%] w-full mt-6">
            <video
              className="rounded-lg outline sm:outline-offset-8 outline-[#F3F4F6] outline-none w-[100%] sm:h-96 h-64"
              controls
            >
              <source src={currentVideo.url} type={currentVideo.type} />
            </video>
            <div className="mt-2 p-2 font-semibold text-xl">
              {currentVideo.title}
            </div>
            <div className="">
              hello world <Share2Icon />
            </div>

            <div className="mt-2 p-2 flex flex-wrap outline-none rounded-sm">
              {currentVideo.description}
            </div>
            <div className="flex items-center justify-between mt-4 p-2">
              {previousVideo && (
                <button
                  className="border bg-neutral-400 p-2 rounded-sm hover:bg-neutral-300 duration-300"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
              )}
              {nextVideo && (
                <button
                  className="border border-neutral-400 p-2 px-6 rounded-sm hover:bg-neutral-400 duration-300"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}