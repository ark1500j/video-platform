"use client";

import { Video } from "@prisma/client";
import useSWR from "swr";
import "@/styles/style.css";
import { Navbar } from "@/components/navbar";
import { Card2 } from "@/components/card";
import Loader from "@/components/loader";
export default function Page() {
  const { data, error, isLoading } = useSWR("/api/videos", async () => {
    const response = await fetch("/api/videos");
    const data = await response.json();
    return data;
  });

  return (
    <div className="">
      <Navbar />
      <div className="pt-24 h-full w-screen px-10">
      {isLoading && (
            <div className="flex min-h-screen">
              <div className="w-1/3">
                <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="px-6 py-4">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-2/3"></div>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <div className="h-4 bg-gray-300 w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/3">
                <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="px-6 py-4">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-2/3"></div>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <div className="h-4 bg-gray-300 w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/3">
                <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="px-6 py-4">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-2/3"></div>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <div className="h-4 bg-gray-300 w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="card-grid">
          
          {data &&
            data.map((video: Video) => {
              return (
                <Card2
                  key={video.id}
                  id={`${video.id}`}
                  title={video.title}
                  url={video.url}
                  type={video.type}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
