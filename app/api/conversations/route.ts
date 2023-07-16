import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import Prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const { userId, isGroup, members, name } = body;
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (isGroup && (!name || !members || members.length < 2)) {
            return new NextResponse("Invalid data", { status: 400 });
        }
        if (isGroup) {
            const newConversation = await Prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [...members.map((member: {value:string}) => ({
                            id: member.value,
                        })),
                            {
                                id: currentUser.id,
                            }],
                        
                    },
                
                },
                include: {
                    users: true,
                },
            });
            return NextResponse.json(newConversation);
        }
        const existingConversations = await Prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId],
                        },
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id],
                        },
                    },
                    
                ],
            },
        });
        const signleConversation = existingConversations[0];
        if (signleConversation) {
            return NextResponse.json(signleConversation);
        }
        const newConversation = await Prisma.conversation.create({
            data: {
                isGroup: false,
                users: {
                    connect: [
                        {
                            id: currentUser.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });
        return NextResponse.json(newConversation);
    } catch (error: any) {
        return NextResponse.error()
    }
    }