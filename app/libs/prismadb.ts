import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const client = new PrismaClient() || globalThis.prisma;
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = client;
}

export default client;