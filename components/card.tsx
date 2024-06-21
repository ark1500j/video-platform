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
import Link from "next/link";
import { mutate } from "swr";

interface Props {
  id: string;
  url: string;
  type: string;
  title: string;
}
export default function Card({ url, type, title, id }: Props) {
  async function handleDelete() {
    const res = await fetch("/api/videos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const response = await res.json();
    if (response?.message === "valid") {
      mutate("/api/videos");
    }
  }
  return (
    <article className="card">
      <video controls className="h-40 w-full">
        <source src={url} type={type} />
      </video>
      <div className="card-body">
        <p>{title}</p>
      </div>
      <div className="card-footer">
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
