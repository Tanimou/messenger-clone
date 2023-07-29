import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';


const getConversationById = async (conversationId: string) => {
    try {
        const user = await getCurrentUser();
        if (!user?.email) {
            return null
        }
        return await prisma.conversation.findUnique({
                    where: {
                        id: conversationId,
                    },
                    include: {
                        users: true,
                        
                    }
                });

    } catch (error: any) {
        return null
    }
}

export default getConversationById;