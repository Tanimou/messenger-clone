import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
interface IParams {
    conversationId ?: string;
}

export async function POST(request:Request,{params}:{params:IParams}){
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;
        
        if (!currentUser?.email || !currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
                messages: {
                    include: {
                        // sender: true,
                        seenByUsers: true,
                    }
                }
            }
        });

        if (!conversation) {
            return new NextResponse("Not Conversation found", { status: 400 });
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            data: {
                seenByUsers: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                sender: true,
                seenByUsers: true,
            }
        });
        await pusherServer.trigger(currentUser.email!, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        })

        //check if the user already seen the message
        if (lastMessage.seenByUserIds.indexOf(currentUser.id) !== -1) { 
            return NextResponse.json(conversation);
        }

        //update the conversation with pusher
        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage)
        

        return NextResponse.json(updatedMessage);
    } catch (error:any) {
        console.log(error, "Error messages seen");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}