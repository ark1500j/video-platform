
import { NextResponse } from 'next/server';
import prisma from '@/utils/dbclient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const videoId = parseInt(params.id, 10);

  try {
    const currentVideo = await prisma.video.findUnique({
      where: { id: videoId },
    });
    console.log(currentVideo);

    if (!currentVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const nextVideo = await prisma.video.findFirst({
      where: { id: { gt: videoId } },
      orderBy: { id: 'asc' },
    });

    const previousVideo = await prisma.video.findFirst({
      where: { id: { lt: videoId } },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({
      currentVideo,
      nextVideo,
      previousVideo,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}