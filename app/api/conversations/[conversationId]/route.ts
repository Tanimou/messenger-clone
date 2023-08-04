import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    conversationId?: string;
}

export async function DELETE(request:Request,{params}:{params:IParams}){
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;
        
        if (!currentUser?.email || !currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
                // messages: {
                //     include: {
                //         // sender: true,
                //         seenByUsers: true,
                //     }
                // }
            }
        });

        if (!existingConversation) {
            return new NextResponse("Not Conversation found", { status: 400 });
        }
        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });
        return NextResponse.json(deletedConversation);
    
    } catch (error:any) {
        console.log(error, "Error_Conversaton_Delete");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}