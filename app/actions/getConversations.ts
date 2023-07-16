import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return []
        }
        return await prisma.conversation.findMany({
                    orderBy: {
                        lastMessageAt: 'desc'
                    },
                    where: {
                        userIds: {
                            has: currentUser.id
                        }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seenByUsers: true,
                    },
                }
            }
                });

    } catch (error: any) {
        return []
    }
}

export default getConversations;