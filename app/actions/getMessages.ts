import prisma from '@/app/libs/prismadb';

const getMessages = async (conversationId: string) => {
    try {
        return await prisma.message.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seenByUsers: true,
            }
        });

    } catch (error: any) {
        return []
    }
}

export default getMessages;