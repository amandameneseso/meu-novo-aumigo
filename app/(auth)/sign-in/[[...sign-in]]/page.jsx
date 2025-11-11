"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link
            href="/" 
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 size-4" />
            Voltar ao início
          </Link>

          <div className="mb-4 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-orange-500">
              <PawPrint className="size-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Meu Novo Aumigo
          </h1>
          <p className="mt-2">Bem vindo! Faça login e encontre seu mais novo amigo aqui.</p>
        </div>

        {/* Sign in component */}
        <div className="flex justify-center">
          {/* <div className="p-6"> */}
            <SignIn />
          {/* </div> */}
        </div>

        {/* Features */}
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-500">O que você receberá:</p>

          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="size-2 rounded-full bg-orange-500"></div>
              <span>Recomendações personalizadas de animais de estimação</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="size-2 rounded-full bg-orange-500"></div>
              <span>Mensagens diretas com donos de animais</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="size-2 rounded-full bg-orange-500"></div>
              <span>Acompanhamento e notificações da sua inscrição</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}