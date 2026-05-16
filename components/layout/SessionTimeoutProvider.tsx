"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function SessionTimeoutProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const supabase = createSupabaseBrowser();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(async () => {
        try {
            await supabase.auth.signOut();
            // Clear custom admin session cookie
            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.push("/login");
            router.refresh();
        } catch (err) {
            console.error("Logout error:", err);
        }
    }, [router, supabase]);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Refresh the cookie expiration to be 15 minutes from now
        document.cookie = `admin_session=true; path=/; max-age=${15 * 60}`;

        // Set new timeout for 15 minutes
        timeoutRef.current = setTimeout(() => {
            handleLogout();
        }, INACTIVITY_TIMEOUT);
    }, [handleLogout]);

    useEffect(() => {
        // Initial setup
        resetTimeout();

        // Events that indicate user activity
        const events = [
            "mousedown",
            "mousemove",
            "keydown",
            "scroll",
            "touchstart"
        ];

        // Wrap resetTimeout in a throttled version to avoid huge performance hit 
        // from resetting on every single mousemove pixel
        let throttleTimeout: NodeJS.Timeout | null = null;
        const handleActivity = () => {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    resetTimeout();
                    throttleTimeout = null;
                }, 10000); // Only actually update the timeout/cookie at most once every 10 seconds
            }
        };

        // Attach event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (throttleTimeout) clearTimeout(throttleTimeout);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimeout]);

    return <>{children}</>;
}
