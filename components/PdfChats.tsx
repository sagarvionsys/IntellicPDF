"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Send } from "lucide-react";

const PdfChats = () => {
  const bubbleClass =
    "rounded-lg p-4 max-w-[280px] text-sm bg-zinc-100 dark:bg-zinc-800";
  const chatIconClass =
    "w-8 h-8 flex items-center justify-center rounded-full shrink-0";

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* User Message */}
        <div className="flex gap-3 items-start">
          <div className={`${chatIconClass} bg-zinc-200 dark:bg-zinc-700`}>
            <FileText className="w-4 h-4" />
          </div>
          <div className={bubbleClass}>
            <p>What are the key findings of this research paper?</p>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex gap-3 items-start">
          <div className={`${chatIconClass} bg-black dark:bg-white`}>
            <Bot className="w-4 h-4 text-white dark:text-black" />
          </div>
          <div className="rounded-lg p-4 max-w-[280px] text-sm bg-black dark:bg-white text-white dark:text-black">
            <p>
              Based on the paper, the main findings indicate significant
              improvements in...
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-2 border-t bg-white dark:bg-zinc-900">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 flex items-center">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border-0 focus:outline-none text-sm px-2"
            disabled
          />
          <Button
            size="sm"
            className="bg-black text-white dark:bg-white dark:text-black"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfChats;
