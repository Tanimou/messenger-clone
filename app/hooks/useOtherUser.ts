import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {users:User[]}) => {
    const session = useSession();
    return useMemo(() => {
            
            return conversation.users.filter(
                    (user: User) => user.email !== session?.data?.user?.email
                    )[0];
        }, [conversation, session]);
}
    
export default useOtherUser;