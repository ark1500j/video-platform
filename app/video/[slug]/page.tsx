"use client";
import { Navbar } from "@/components/navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import toast, { Toaster } from "react-hot-toast";
import { useUrl } from "nextjs-current-url";
import Link from "next/link";
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
    return (
      <div>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-red-600">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
               Error:{error.message}
            </div>
          </div>
        </main>
      </div>
    );
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
        <div className="flex pt-24 sm:min-h-screen items-center justify-center">
          <div className="sm:w-1/3 w-[90%] sm:mt-0">
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
        <main className="flex flex-col items-center w-full sm:w-screen pt-28 mx-auto">
          <Link href={"/video"} className="absolute top-20 left-10 flex items-center cursor-pointer text-neutral-400"><HomeIcon size={15}/>{""}<span className="">/{pathname?.split("/")[1]}</span></Link>
          <div className="flex flex-grow justify-center items-center">
            {previousVideo && (
              <div
                className="text-neutral-400 -translate-y-10  sm:opacity-0 duration-500 sm:hover:opacity-100 cursor-pointer self-stretch flex items-center justify-center"
                onClick={handlePrevious}
              >
                <ChevronLeft size={50} />
              </div>
            )}

            <div className="sm:max-w-[50%] max-w-[60%] flex flex-shrink relative flex-col">
              <video className="w-full h-full rounded-md" controls>
                <source src={currentVideo.url} type={currentVideo.type} />
              </video>
              <div className="full w-full flex justify-between items-start p-2">
                <div className="pb-2">
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
              <div className="w-full flex justify-between items-start py-5 px-3 border border-neutral-300 rounded-md">
                <span className="text-base text-grey-darken">
                  {currentVideo.description}{" "}
                </span>
              </div>
            </div>
            {nextVideo && (
              <div
                className="text-neutral-400 -translate-y-10  sm:opacity-0 duration-500 sm:hover:opacity-100 cursor-pointer self-stretch flex items-center justify-center"
                onClick={handleNext}
              >
                <ChevronRight size={50} />
              </div>
            )}
          </div>
        </main>
      )}
      <Toaster />
    </>
  );
}
