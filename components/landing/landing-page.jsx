import {
  Award,
  Home,
  MessageCircle,
  PawPrint,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PawPrint className="size-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Meu novo aumigo</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default">Cadastre-se</Button>
            </Link>
          </div>
        </nav>
      </header>
      {/* Hero section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Pequenas patinhas,
            <span className="text-orange-500"> grandes histórias.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Estamos muito felizes de ter você aqui! Seu apoio é essencial para continuarmos encontrando lares cheios de cuidado para esses peludinhos. Adotar é um ato de amor que transforma todas as vidas ao redor.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/sign-in">
              <Button variant="default" size="lg">
                Quero adotar
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default" size="lg">
                Quero doar um pet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Por que adotar?
          </h2>
          <p className="mx-auto max-w-2xl text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
            cum rerum reprehenderit quisquam. Mollitia quidem nemo vel odit
            voluptate laboriosam.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100">
                <PawPrint className="size-6 text-orange-500" />
              </div>

              <CardTitle>Smart Matching</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                soluta minima enim ea iusto illo est molestias dolorem placeat
                alias.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="size-6 text-blue-500" />
              </div>

              <CardTitle>Verified profiles</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                soluta minima enim ea iusto illo est molestias dolorem placeat
                alias.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100">
                <Shield className="size-6 text-green-500" />
              </div>

              <CardTitle>Safe and secure</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                soluta minima enim ea iusto illo est molestias dolorem placeat
                alias.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100">
                <MessageCircle className="size-6 text-purple-500" />
              </div>

              <CardTitle>Direct communication</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                soluta minima enim ea iusto illo est molestias dolorem placeat
                alias.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-indigo-100">
                <Home className="size-6 text-indigo-500" />
              </div>

              <CardTitle>Post-adoption support</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                soluta minima enim ea iusto illo est molestias dolorem placeat
                alias.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-pink-100">
                <Award className="size-6 text-pink-500" />
              </div>

              <CardTitle>Success stories</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                soluta minima enim ea iusto illo est molestias dolorem placeat
                alias.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="bg-orange-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready too find your new best friend?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
            numquam recusandae architecto sint modi fugit pariatur magnam.
            Maxime, quod repellendus?
          </p>

          <Link href="/sign-in">
            <Button size="lg" variant="secondary" className="px-8">
              Get started now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <PawPrint className="size-6 text-orange-500" />
                <span className="text-xl font-bold">Meu novo aumigo</span>
              </div>

              <p className="text-gray-400">
                Connecting loving families with pets in need of homes.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">For adopters</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard/discover" className="hover:text-white">
                    Browse pets
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/adoption-guide" className="hover:text-white">
                    Adoption guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">For pet owners</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard/add-pet" className="hover:text-white">
                    List a pet
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="hover:text-white">
                    Success stories
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Meu novo aumigo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}