"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { 
  Menu, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  PawPrint, 
  Home, 
  Search, 
  FileText, 
  PlusCircle,
  X
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Feed", href: "/dashboard", icon: Home },
  { name: "Adotar", href: "/dashboard/discover", icon: Search },
  { name: "Doar pet", href: "/dashboard/add-pet", icon: PlusCircle },
];

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    currentUser?._id ? { userId: currentUser._id } : "skip",
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/dashboard" className="shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="font-heading text-xl font-bold text-neutral-900 hidden sm:block">Focinhos Carentes</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <Button 
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={`font-medium ${pathname === link.href ? "text-primary-600 bg-primary-50" : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"}`}
                  >
                    <link.icon className="mr-2 size-4" />
                    {link.name}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notificações Icon (Desktop & Mobile) */}
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm" className="relative text-neutral-600 hover:text-primary-600 hover:bg-primary-50">
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex size-5 items-center justify-center p-0 text-[10px] bg-primary-500"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-10 rounded-full p-0 border border-neutral-200 hover:border-primary-200 transition-colors">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={user?.imageUrl || ""}
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback className="bg-primary-50 text-primary-600">
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 mt-2" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-bold text-neutral-900">
                        {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                      </p>
                      <p className="text-neutral-500 text-xs leading-none">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <Link href="/dashboard/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/dashboard/applications">
                    <DropdownMenuItem className="cursor-pointer">
                      <FileText className="mr-2 size-4" />
                      <span>Solicitações</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/dashboard/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 size-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <SignOutButton>
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                      <LogOut className="mr-2 size-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-neutral-600 hover:text-primary-600 hover:bg-primary-50 p-2"
                >
                  {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-100 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button 
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={`w-full justify-start font-medium ${pathname === link.href ? "text-primary-600 bg-primary-50" : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"}`}
                  >
                    <link.icon className="mr-3 size-5" />
                    {link.name}
                  </Button>
                </Link>
              ))}
              <DropdownMenuSeparator />
              <Link href="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-neutral-600">
                  <User className="mr-3 size-5" />
                  Meu Perfil
                </Button>
              </Link>
              <Link href="/dashboard/applications" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-neutral-600">
                  <FileText className="mr-3 size-5" />
                  Solicitações
                </Button>
              </Link>
              <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-neutral-600">
                  <Settings className="mr-3 size-5" />
                  Configurações
                </Button>
              </Link>
              <DropdownMenuSeparator />
              <SignOutButton>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="mr-3 size-5" />
                  Sair
                </Button>
              </SignOutButton>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
