"use client";
import { Navbar } from "@/components/navbar";
import { ChevronLeft, ChevronRight, Share2Icon } from "lucide-react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUrl } from "nextjs-current-url";
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

export default function Page({ params }: { params: { slug: string } }) {
  const { href: currentUrl, pathname } = useUrl() ?? {};
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

  if (error) {
    if (error.message === "Not Found") {
      return <div>Video not found</div>;
    }
    return <div>Error loading video: {error.message}</div>;
  }

  const { currentVideo, nextVideo, previousVideo } = data || {};

  const handleNext = () => {
    if (nextVideo) {
      const next = nextVideo.id.toString();
      router.push("/video/" + next);
    }
  };

  const handlePrevious = () => {
    if (previousVideo) {
      const prev = previousVideo.id.toString();
      router.push("/video/" + prev);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-1/3">
            <div className="max-w-full rounded overflow-hidden shadow-lg animate-pulse">
              <div className="h-56 bg-gray-300"></div>
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
      {currentVideo && (
        <main className="flex flex-col items-center w-screen pt-24 mx-auto">
          <div className="flex flex-grow justify-center items-center">
            <button className="px-4">
              {previousVideo && (
                <div
                  className="text-neutral-400 opacity-0 duration-500 hover:opacity-100 cursor-pointer self-stretch flex items-center justify-center"
                  onClick={handlePrevious}
                >
                  <ChevronLeft size={50} />
                </div>
              )}
            </button>
            <div className="sm:max-w-[50%] max-w-[70%] flex flex-shrink relative">
              <video className="w-full h-full rounded-md" controls>
                <source src={currentVideo.url} type={currentVideo.type} />
              </video>
            </div>
            <button className="px-4">
              {nextVideo && (
                <div
                  className="text-neutral-400 opacity-0 duration-500 hover:opacity-100 cursor-pointer self-stretch flex items-center justify-center"
                  onClick={handleNext}
                >
                  <ChevronRight size={50} />
                </div>
              )}
            </button>
          </div>
          <div className="sm:w-[50%] w-[72%] flex justify-between items-start p-2">
            <div className="pb-2 pl-4">
              <h1 className="text-xl ">{currentVideo.title}</h1>
            </div>
            <div className="">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">share</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Share link to video
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <Label
                          htmlFor="height"
                          className="cursor-pointer"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              `${currentUrl}`
                            );
                            toast.success("copied url to clipboard");
                          }}
                        >
                          Copy
                        </Label>
                        <Input
                          id="width"
                          defaultValue="100%"
                          value={currentUrl}
                          className="col-span-1 h-8 outline-none focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-4 ">
                        <div className="">
                          <TwitterShareButton url={`${currentUrl}`}>
                            <TwitterIcon size={30} round />
                          </TwitterShareButton>
                        </div>
                        <div className="">
                          <WhatsappShareButton url={`${currentUrl}`}>
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>{" "}
                        </div>
                        <div className="">
                          <FacebookShareButton url={`${currentUrl}`}>
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                        </div>
                        <div className="">
                          <TelegramShareButton url={`${currentUrl}`}>
                            <TelegramIcon size={32} round />
                          </TelegramShareButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="sm:w-[50%] w-[72%] flex justify-between items-start p-2 pl-4">
            <span className="text-base text-grey-darken ml-3">
              {currentVideo.description}{" "}
            </span>
          </div>
        </main>
      )}
      <Toaster />
    </>
  );
}
