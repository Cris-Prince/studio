'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-background border rounded-md p-3 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
        aria-label="Copy to clipboard"
      >
        {hasCopied ? <Check className="h-4 w-4 text-accent" /> : <Clipboard className="h-4 w-4" />}
      </Button>
    </div>
  );
}
