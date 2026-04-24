import Link from "next/link";
import { Button } from "../ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-stone-100">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-coral" />
            <span className="text-xl font-semibold text-stone-800">
              Focinhos Carentes
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#adopt"
              className="text-sm text-stone-600 transition-colors hover:text-stone-900"
            >
              Adopt
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-stone-600 transition-colors hover:text-stone-900"
            >
              How it Works
            </Link>
            <Link
              href="#stories"
              className="text-sm text-stone-600 transition-colors hover:text-stone-900"
            >
              Stories
            </Link>
            <Link
              href="#volunteer"
              className="text-sm text-stone-600 transition-colors hover:text-stone-900"
            >
              Volunteer
            </Link>
          </nav>

          {/* CTA Button */}
          <Link href="/sign-up">
            <Button className="rounded-md bg-coral px-5 py-2 text-sm font-medium text-white hover:bg-coral-dark">
              Donate Now
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-cats.jpg')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          {/* Badge */}
          <div className="mb-8 inline-block rounded-full bg-stone-700/80 px-5 py-2">
            <span className="text-sm text-white">
              Over 5,000 Happy Tails & Counting
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 font-serif text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
            Give a Life a
            <br />
            <span className="italic text-coral">Second Chance</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-xl text-lg text-stone-200">
            Every animal deserves a loving home. Join our community of
            compassionate hearts and find your perfect companion today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-in">
              <Button className="min-w-[160px] rounded-md bg-coral px-8 py-3 text-base font-medium text-white hover:bg-coral-dark">
                Adopt Now
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="min-w-[160px] rounded-md bg-stone-800 px-8 py-3 text-base font-medium text-white hover:bg-stone-700">
                Donate Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
