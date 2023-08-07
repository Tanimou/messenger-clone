import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const { conversationId, image, message } = body;

        if (!currentUser?.email || !currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const newMessage = await prisma.message.create({
            data: {
                conversation: {
                    connect: {
                        id: conversationId
                    }
                    },
                sender: {
                    connect: {
                        id: currentUser.id
                    }
                },
                seenByUsers: {
                    connect: {
                        id: currentUser.id
                    }
                },
                image: image,
                text: message,
            },
            include: {
                sender: true,
                seenByUsers: true,
            }
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    // orderBy: {
                    //     createdAt: 'asc'
                    // },
                    include: {
                        // sender: true,
                        seenByUsers: true,
                    }
                }
            }
        });
        await pusherServer.trigger(conversationId, 'messages:new', newMessage)
        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        })
        return NextResponse.json(newMessage)
    } catch (error:any) {
        console.log(error, "Error messages")
        return new NextResponse("Internal server error", { status: 500 })
    }
}