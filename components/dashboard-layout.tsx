"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Bell,
  MessageCircle,
  Activity,
  Target,
  Brain,
  Calendar,
  SettingsIcon,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

const sidebarItems = [
  { name: "Dashboard", icon: Activity, href: "/" },
  { name: "Chatbot", icon: MessageCircle, href: "/chatbot" },
  { name: "Challenges", icon: Target, href: "/challenges" },
  { name: "Habits", icon: Brain, href: "/habits" },
  { name: "Meditation", icon: Heart, href: "/meditation" },
  { name: "Schedule", icon: Calendar, href: "/schedule" },
  { name: "Settings", icon: SettingsIcon, href: "/settings" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function DashboardLayout({
  children,
  currentPage,
}: DashboardLayoutProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("trika_user_email");
    const storedUsername = localStorage.getItem("trika_user_name");
    if (storedEmail) setEmail(storedEmail);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  if (!email) return <div>Loading...</div>;
  const getPersonalGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      const morningGreetings = [
        "Rise and shine!",
        "Good morning, sunshine ☀️",
        "Hope your day starts with a smile 😊",
        "New day, fresh start 🌱",
        "Top of the morning to you!",
      ];
      return morningGreetings[
        Math.floor(Math.random() * morningGreetings.length)
      ];
    } else if (hour >= 12 && hour < 17) {
      const afternoonGreetings = [
        "Hope your afternoon’s going well ☕",
        "How's the day treating you so far?",
        "Stay focused — you're doing great!",
        "Keep pushing, you’ve got this 💪",
        "Don’t forget to breathe and smile 🌞",
      ];
      return afternoonGreetings[
        Math.floor(Math.random() * afternoonGreetings.length)
      ];
    } else if (hour >= 17 && hour < 21) {
      const eveningGreetings = [
        "Evening vibes only 🌇",
        "Relax, you’ve earned it 🛋️",
        "Hope your evening is peaceful ✨",
        "Unwind and recharge 🌙",
        "You made it through the day 🎉",
      ];
      return eveningGreetings[
        Math.floor(Math.random() * eveningGreetings.length)
      ];
    } else {
      const nightGreetings = [
        "Time to rest your mind 🌌",
        "Sweet dreams when you get there 🌙",
        "You've done enough for today 💤",
        "Let the stars watch over you ✨",
        "Catch some Zzz's 😴",
      ];
      return nightGreetings[Math.floor(Math.random() * nightGreetings.length)];
    }
  };
const getMotivationalPrompt = () => {
  const prompts = [
    "Ready to achieve your fitness goals today?",
    "Let’s crush your goals together 💪",
    "One step closer to a healthier you!",
    "Small efforts today, big results tomorrow!",
    "Time to sweat, smile, and shine ✨",
    "Your future self will thank you — let’s move!",
    "You vs. You. Let’s win today 🔥",
    "Progress, not perfection — go get it!",
    "Consistency beats intensity — keep going!",
    "Let’s make today count!"
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
};


  const AppSidebar = () => (
    <Sidebar
      className="border-r border-slate-800 bg-slate-900"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 lg:p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8   to-slate-600 rounded-lg flex items-center justify-center">
              <Image 
    src="/trikalogo.png" 
    alt="Logo" 
    width={70} 
    height={70} 
    className="object-contain rounded-lg"
  />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
              Trika.ai
            </h1>
            <p className="text-xs text-slate-400">BODY • MIND • TECH</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.name === currentPage}
                    className="w-full justify-start gap-3 px-4 lg:px-6 py-3 hover:bg-slate-800 text-slate-300 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-950">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col w-full overflow-hidden">
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-4 lg:px-6 py-5 flex-shrink-0 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 min-w-0">
                <SidebarTrigger className="text-slate-300 hover:text-white" />
                <div className="min-w-0">
                  <h2 className="text-lg lg:text-xl font-semibold text-white truncate">
                    {getPersonalGreeting()}, {username}! 👋
                  </h2>
                  <p className="text-sm text-slate-400 hidden sm:block">
                    {getMotivationalPrompt()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                </Button> */}
                {/* <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-slate-600 text-black">
                    A
                  </AvatarFallback>
                </Avatar> */}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto w-full">
            <div className="w-full h-full p-4 lg:p-6">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
