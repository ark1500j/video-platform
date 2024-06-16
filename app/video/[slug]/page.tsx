import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Share2Icon } from "lucide-react";
import React from "react";

export default function VideoPage({ params }: { params: { slug: string } }) {
    // console.log(params.slug)
  return (
    <>
      <div className="">
        <Navbar />
      </div>

      <div className="flex justify-between gap-10 px-12 pt-20">
        <div className="sm:w-[60%] w-full mt-6">
          <iframe
            className="rounded-lg outline sm:outline-offset-8 outline-[#F3F4F6] outline-none w-[100%] sm:h-96 h-64"
            src="https://www.youtube.com/embed/AcYF18oGn6Y"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <div className="mt-2 p-2 font-semibold text-xl">
            Hello world, Welcome to MY youtube Chanel
            {params.slug}
          </div>
          <div className="">hello world <Share2Icon/></div>
           
          <div className="mt-2 p-2 flex flex-wrap outline-none rounded-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Consequuntur aut mollitia magnam tenetur voluptates, natus
            perspiciatis adipisci. Nemo architecto voluptatibus fugiat corporis
            modi aliquam neque, quae ad at adipisci eveniet
            <div className="text-sm text-purple-800 cursor-pointer hover:text-purple-600 duration-300">
              show more...
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 p-2">
            <button className="border bg-neutral-400 p-2 rounded-sm hover:bg-neutral-300 duration-300">
              Previous
            </button>
            <button className="border border-neutral-400 p-2 px-6 rounded-sm hover:bg-neutral-400 duration-300">
              Next
            </button>
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://www.youtube.com/embed/AcYF18oGn6Y" alt="" />
      <Footer />
    </>
  );
}
