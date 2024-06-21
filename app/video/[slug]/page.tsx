"use client";
import { Navbar } from "@/components/navbar";
import { ChevronLeft, ChevronRight, Share2Icon } from "lucide-react";
import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";
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
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TumblrShareCount,
  TwitterIcon,
  TwitterShareButton,
  VKShareCount,
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
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// export function PopoverDemo() {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="outline">Open popover</Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80">
//         <div className="grid gap-4">
//           <div className="space-y-2">
//             <h4 className="font-medium leading-none">Dimensions</h4>
//             <p className="text-sm text-muted-foreground">
//               Set the dimensions for the layer.
//             </p>
//           </div>
//           <div className="grid gap-2">
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="width">Width</Label>
//               <Input
//                 id="width"
//                 defaultValue="100%"
//                 className="col-span-2 h-8"
//               />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="maxWidth">Max. width</Label>
//               <Input
//                 id="maxWidth"
//                 defaultValue="300px"
//                 className="col-span-2 h-8"
//               />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="height">Height</Label>
//               <Input
//                 id="height"
//                 defaultValue="25px"
//                 className="col-span-2 h-8"
//               />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="maxHeight">Max. height</Label>
//               <Input
//                 id="maxHeight"
//                 defaultValue="none"
//                 className="col-span-2 h-8"
//               />
//             </div>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

// <>
//   <div className="">
//     <Navbar />
//   </div>

//   {currentVideo && (
//     <div className="flex justify-between gap-10 pt-24">
//       <div className="w-full flex flex-col ">
//         <div className="flex">
// {previousVideo && (
//   <div
//     className="text-neutral-400 opacity-0 duration-500 hover:opacity-100 cursor-pointer self-stretch flex items-center justify-center"
//     onClick={handlePrevious}
//   >
//     <ChevronLeft size={50} />
//   </div>
// )}
//           <video
//             className="rounded-lg outline sm:outline-offset-8 outline-[#F3F4F6] outline-none sm:h-96 h-64"
//             controls
//           >
//             <source src={currentVideo.url} type={currentVideo.type} />
//           </video>
//           {nextVideo && (
//             <div
//               className="text-neutral-400 opacity-0 duration-500 hover:opacity-100 cursor-pointer self-stretch flex items-center justify-center"
//               onClick={handleNext}
//             >
//               <ChevronRight size={50} />
//             </div>
//           )}
//         </div>
//         <div className="ml-12 flex justify-between items-center">
//           <div className="">
//             <div className="mt-2 p-2 font-semibold text-xl">
//               {currentVideo.title}
//             </div>
//             <div className="mt-2 p-2  flex flex-wrap outline-none rounded-sm">
//               {currentVideo.description}
//             </div>
//           </div>
//           <div className="self-stretch mt-4">
//             share
//           </div>
//         </div>
//       </div>
//     </div>
//   )}
// </>
