"use client"

import * as React from "react"
import { RawInputSection } from "@/components/RawInputSection"
import { ReviewQueue } from "@/components/ReviewQueue"
import { Snippet } from "@/lib/types"
import { Sparkles } from "lucide-react"

export default function SnippetForgePage() {
  const [snippets, setSnippets] = React.useState<Snippet[]>([])

  const handleSnippetsExtracted = (newSnippets: Snippet[]) => {
    setSnippets((prev) => [...newSnippets, ...prev])
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-white border-b border-border/50 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">SnippetForge</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">AI-Powered Content Lab</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">Workspace</p>
              <p className="text-xs text-muted-foreground">Draft Content Queue</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input & Controls */}
          <div className="space-y-8 sticky top-28">
            <section>
              <RawInputSection onSnippetsExtracted={handleSnippetsExtracted} />
            </section>
            
            <section className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
              <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                User Guide
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-accent font-bold">1.</span>
                  Paste raw research or document text into the editor.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">2.</span>
                  Click "AI Snippet Extraction" to find candidate content.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">3.</span>
                  Review tags and edit snippets in the queue on the right.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">4.</span>
                  Export as structured JSON or push to Firestore.
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column: Review Queue */}
          <div className="h-[calc(100vh-140px)] min-h-[600px]">
            <ReviewQueue snippets={snippets} setSnippets={setSnippets} />
          </div>
        </div>
      </div>
    </main>
  )
}
