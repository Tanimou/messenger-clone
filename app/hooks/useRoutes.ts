import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import useConversation from "./useConversation";
import { signOut } from "next-auth/react";

const useRoutes = () => {
    const pathname = usePathname();
    const { conversationId } = useConversation();
    return useMemo(() => [
            {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            isActive: pathname === '/conversations' || !!conversationId
            },
            {
                label: 'Users',
                href: '/users',
                icon: HiUsers,
                isActive: pathname === '/users'
            },
            {
                label: 'SignOut',
                href: '#',
                icon: HiArrowLeftOnRectangle,
                onClick: () => signOut()
    
            }
        ], [pathname, conversationId]);
}

export default useRoutes;