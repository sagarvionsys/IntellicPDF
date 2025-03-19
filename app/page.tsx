"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FileText, Send } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-grow flex items-center relative overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl font-extrabold tracking-tight">
                  Chat with your
                  <br />
                  <span className="text-black dark:text-white">Documents</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Upload your PDFs and get instant, intelligent answers powered
                  by advanced AI technology.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  <Link href="/drop">
                    Try Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Right side - Demo UI */}
            <div className="relative">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl  border overflow-hidden">
                {/* Window Controls */}
                <div className="px-4 py-3 border-b bg-zinc-50 dark:bg-zinc-900 flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    research-paper.pdf
                  </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-2 h-[500px]">
                  {/* PDF Preview */}
                  <div className="border-r p-6 bg-zinc-50 dark:bg-zinc-900">
                    <div className="space-y-4">
                      <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
                      <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="flex flex-col">
                    <div className="flex-1 p-6 space-y-6 overflow-auto">
                      {/* User Message */}
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 max-w-[280px]">
                          <p className="text-sm">
                            What are the key findings of this research paper?
                          </p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-white dark:text-black" />
                        </div>
                        <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-4 max-w-[280px]">
                          <p className="text-sm">
                            Based on the paper, the main findings indicate
                            significant improvements in...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-2 border-t">
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
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square bg-gradient-to-r from-zinc-500/10 to-zinc-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started with our AI-powered document chat in three simple
              steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Upload PDF",
                description:
                  "Simply drag and drop your PDF file or select it from your computer",
              },
              {
                icon: <Bot className="h-8 w-8" />,
                title: "AI Processing",
                description:
                  "Our AI analyzes and understands your document content",
              },
              {
                icon: <ArrowRight className="h-8 w-8" />,
                title: "Start Chatting",
                description:
                  "Ask questions and get instant, accurate answers about your document",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-zinc-500/20 to-zinc-500/20 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative p-8 bg-white dark:bg-black rounded-lg border">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
