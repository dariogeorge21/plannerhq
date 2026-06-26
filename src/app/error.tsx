"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white py-16 lg:py-24">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-lg mx-auto text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                        Something went wrong
                    </h1>
                    <p className="mt-4 text-[#111111]/60">
                        We're sorry, but an unexpected error occurred. Our team has been notified.
                    </p>
                    {error.digest && (
                        <p className="mt-2 text-sm text-[#111111]/40">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={() => reset()}
                            variant="default"
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try again
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="secondary"
                            className="gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Go home
                        </Button>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}