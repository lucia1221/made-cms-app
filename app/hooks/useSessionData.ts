import { useContext } from "react";
import { RequestContext } from "~/components/context";
import { SessionUser } from "~/models/user";

/**
 * Get session data from global context.
 * 
 * @returns Session data
 */
export function useSessionData(): SessionUser | null {
    let context = useContext(RequestContext);

    return context.session;
}
