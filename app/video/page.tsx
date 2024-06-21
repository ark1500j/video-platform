"use client";

import { Video } from "@prisma/client";
import useSWR from "swr";
import "@/styles/style.css";
import { Navbar } from "@/components/navbar";
import { Card2 } from "@/components/card";
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
        <div className="card-grid">{isLoading && <>loading...</>}
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
