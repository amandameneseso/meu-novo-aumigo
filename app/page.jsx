"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "@/components/landing/landing-page";

export default function Home() {
  return (
    <div className="bg-orange-500 text-white p-4 rounded-lg">
      Teste de Tailwind
    </div>
  );
}