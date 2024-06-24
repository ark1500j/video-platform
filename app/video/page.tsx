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
  if (error) {
    return (
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-red-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn&apos;t find the page youre looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
           Error:{error.message}
          </div>
        </div>
      </main>
    );
  }
  return (
    <div className="">
      <Navbar />
      <div className="pt-24 h-full w-screen px-10">
        {isLoading && (
          <div className="flex flex-col sm:flex-row gap-4 min-h-screen">
            <div className="sm:w-1/3 w-full pb-5">
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
            <div className="sm:w-1/3 w-full pb-5">
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
            <div className="sm:w-1/3 w-full pb-5">
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
