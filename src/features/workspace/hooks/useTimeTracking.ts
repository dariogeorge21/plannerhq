import { useEffect, useState, useRef } from 'react';
import { GetWorkspaceTime, TrackWorkspaceTime } from '../workspace';

interface UseTimeTrackingProps {
    workspaceId: string;
    syncIntervalSeconds?: number;
}

export function useTimeTracking({ workspaceId, syncIntervalSeconds = 30 }: UseTimeTrackingProps) {
    const [totalSeconds, setTotalSeconds] = useState<number>(0);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    
    const activeSecondsRef = useRef<number>(0);
    const lastActivityRef = useRef<number>(Date.now());
    const isTrackingRef = useRef<boolean>(true);

    // Fetch initial time
    useEffect(() => {
        let mounted = true;
        const fetchInitialTime = async () => {
            try {
                const res = await GetWorkspaceTime(workspaceId);
                if (mounted && res.success && res.data !== undefined) {
                    setTotalSeconds(res.data);
                    setIsInitialized(true);
                }
            } catch (err) {
                console.error("Failed to fetch initial workspace time", err);
            }
        };

        if (workspaceId) {
            fetchInitialTime();
        }

        return () => {
            mounted = false;
        };
    }, [workspaceId]);

    // Activity tracking
    useEffect(() => {
        if (!workspaceId) return;

        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        events.forEach(event => window.addEventListener(event, updateActivity));

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isTrackingRef.current = false;
            } else {
                isTrackingRef.current = true;
                updateActivity();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const timerInterval = setInterval(() => {
            if (!isTrackingRef.current) return;

            const now = Date.now();
            const timeSinceLastActivity = now - lastActivityRef.current;

            // Consider active if activity happened within the last 5 seconds
            if (timeSinceLastActivity < 5000) {
                activeSecondsRef.current += 1;
                setTotalSeconds(prev => prev + 1);

                // Sync to server if threshold reached
                if (activeSecondsRef.current >= syncIntervalSeconds) {
                    const secondsToSync = activeSecondsRef.current;
                    activeSecondsRef.current = 0; // Reset early to avoid double sync

                    TrackWorkspaceTime(workspaceId, secondsToSync).catch(err => {
                        console.error("Failed to sync workspace time", err);
                        // Re-add to ref if failed
                        activeSecondsRef.current += secondsToSync;
                    });
                }
            }
        }, 1000);

        return () => {
            events.forEach(event => window.removeEventListener(event, updateActivity));
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(timerInterval);
            
            // Attempt to sync remaining time on unmount
            if (activeSecondsRef.current > 0) {
                TrackWorkspaceTime(workspaceId, activeSecondsRef.current).catch(err => console.error("Failed to sync workspace time on unmount", err));
            }
        };
    }, [workspaceId, syncIntervalSeconds]);

    // Formatting logic
    const totalMinutes = Math.floor(totalSeconds / 60);
    let formattedTime = '0 min';

    if (totalMinutes < 100) {
        formattedTime = `${totalMinutes} min`;
    } else {
        const hours = totalMinutes / 60;
        formattedTime = `${hours.toFixed(1)} hrs`;
    }

    return {
        totalSeconds,
        formattedTime,
        isInitialized
    };
}
