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

export async function DELETE(request:Request){
   const {id}= await request.json()
   
     try {
       const video = await prisma.video.delete({where:{id:id}}) 
       await utapi.deleteFiles(video.key)
       return Response.json({message:'valid'})
     } catch (error) {
        return Response.json({message:'invalid'})
     }

}