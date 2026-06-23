"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white py-16 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="text-8xl font-bold text-[#EAEAEA] select-none">404</div>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
            Page not found
          </h1>
          <p className="mt-4 text-[#111111]/60">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="default"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Go home
            </Button>
            <Button
              onClick={() => router.back()}
              variant="secondary"
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Go back
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}