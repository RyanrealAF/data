"use client"

import * as React from "react"
import { Snippet } from "@/lib/types"
import { SnippetEditorCard } from "./SnippetEditorCard"
import { Button } from "@/components/ui/button"
import { Download, Database, ListChecks, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { v4 as uuidv4 } from 'uuid'

interface ReviewQueueProps {
  snippets: Snippet[]
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>
}

export function ReviewQueue({ snippets, setSnippets }: ReviewQueueProps) {
  const handleUpdate = (updatedSnippet: Snippet) => {
    setSnippets((prev) => prev.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s)))
  }

  const handleDelete = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id))
  }

  const handleAddSnippet = () => {
    const newSnippet: Snippet = {
      id: uuidv4(),
      content: "",
      cluster: "Introduction",
      zone: "anchor",
      weight: "medium",
      attribution: "",
      emphasisWords: ""
    }
    setSnippets([newSnippet, ...snippets])
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ content_items: snippets }, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'snippetforge_export.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handlePushToFirestore = async () => {
    // This is a placeholder for actual Firebase integration
    alert(`Pushing ${snippets.length} snippets to Firestore collection '/content_items/'...`)
    console.log("Firestore Data:", snippets)
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline text-primary flex items-center gap-2 font-semibold">
          <ListChecks className="h-5 w-5 text-accent" />
          Review Queue ({snippets.length})
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportJSON}
            disabled={snippets.length === 0}
            className="border-primary/20 hover:bg-primary/5"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePushToFirestore}
            disabled={snippets.length === 0}
            className="border-primary/20 hover:bg-primary/5"
          >
            <Database className="h-4 w-4 mr-2" />
            Push
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full border-dashed border-2 border-border hover:border-primary/50 hover:bg-primary/5 py-8"
        onClick={handleAddSnippet}
      >
        <Plus className="h-4 w-4 mr-2" />
        Manual Add Snippet
      </Button>

      <ScrollArea className="flex-1 rounded-xl pr-4">
        <div className="space-y-3">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <SnippetEditorCard
                snippet={snippet}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          ))}
          {snippets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-white/50 rounded-xl border border-dashed border-border">
              <ListChecks className="h-12 w-12 opacity-20 mb-2" />
              <p>No snippets in queue yet.</p>
              <p className="text-sm">Add manually or use AI extraction.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
