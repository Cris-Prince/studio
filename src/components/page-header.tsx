'use client';

import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const [isBotOnline, setIsBotOnline] = useState(false);

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setIsBotOnline(!isBotOnline)}>
          <div className={`w-3 h-3 rounded-full transition-colors ${isBotOnline ? 'bg-accent animate-pulse' : 'bg-destructive'}`}></div>
          <Badge variant={isBotOnline ? "outline" : "destructive"} className={isBotOnline ? 'bg-accent/20 text-accent border-accent/50' : ''}>
            {isBotOnline ? 'Bot Online' : 'Bot Offline'}
          </Badge>
        </div>
      </div>
      <p className="text-lg text-muted-foreground">{description}</p>
    </header>
  );
}
