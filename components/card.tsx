"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUrl } from "nextjs-current-url";
import toast from "react-hot-toast";
interface Props {
  id: string;
  url: string;
  type: string;
  title: string;
}
export default function Card({ url, type, title, id }: Props) {

  const { href: currentUrl, pathname } = useUrl() ?? {};
  async function handleDelete() {
    const res = await fetch("/api/videos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    console.log(response)
    if (response?.message === "valid") {
      mutate("/api/videos");
    }
  }
  return (
    <article className="card">
      <video controls className="h-40 w-full rounded-sm">
        <source src={url} type={type} />
      </video>
      <div className="card-body">
        <p>{title}</p>
      </div>
      <div className="card-footer  w-full">

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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                video and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}

export function Card2({ url, type, title, id }: Props) {
  return (
    <a
      href={`/video/${id}`}
      className="card cursor-pointer hover:bg-black hover:bg-opacity-30 duration-500 border border-neutral-500"
    >
      <video className="h-52 w-full p-5 rounded-sm">
        <source src={url} type={type} />
      </video>

      <div className="card-footer bg-neutral-200">
        <p className="font-semibold">{title}</p>
      </div>
    </a>
  );
}
