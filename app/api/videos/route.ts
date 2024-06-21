import { prisma } from "@/utils/dbclient";
import { utapi } from "@/utils/transporter";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(request:Request) {
    
    const token = cookies().get("token");

    if (!token) return NextResponse.redirect(new URL("/", request.url));
    
    const res = await prisma.video.findMany()
    
    return Response.json(res)
}


export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const newId= parseInt(id)
    const video = await prisma.video.delete({
      where: { id:newId },
    });
    await utapi.deleteFiles(video.key);
    return NextResponse.json({ message: "valid" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ message: "invalid" }, { status: 500 });
  }
}