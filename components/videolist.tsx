"use client";
import React, { useEffect, useState } from "react";
import Card from "./card";
import { Video } from "@prisma/client";
import useSWR from "swr";

const Videolist = () => {
  const { data, error, isLoading } = useSWR("/api/videos", async (url) => {
    const response = await fetch("/api/videos");
    return response.json();
  });

  if(isLoading) return (<div className="card-grid">
          <div className="card">
            <div className="w-full">
              <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="px-6 py-4">
                  <div className="h-6 bg-gray-300 mb-2"></div>                 
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="w-full">
              <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="px-6 py-4">
                  <div className="h-6 bg-gray-300 mb-2"></div>                 
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="w-full">
              <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="px-6 py-4">
                  <div className="h-6 bg-gray-300 mb-2"></div>                 
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="w-full">
              <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="px-6 py-4">
                  <div className="h-6 bg-gray-300 mb-2"></div>                 
                </div>
              </div>
            </div>
          </div>

  </div>)
  return (
    <div className="card-grid">
      {data &&
        data.map((video: Video) => {
          return (
            <Card
              key={video.id}
              url={video.url}
              type={video.type}
              title={video.title}
              id={`${video.id}`}
            />
          );
        })}
    </div>
  );
};

export default Videolist;
