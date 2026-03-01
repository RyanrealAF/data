"use client"

import * as React from "react"
import { Snippet, CLUSTERS, ZONES, WEIGHTS } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SnippetEditorCardProps {
  snippet: Snippet
  onUpdate: (updated: Snippet) => void
  onDelete: (id: string) => void
}

export function SnippetEditorCard({ snippet, onUpdate, onDelete }: SnippetEditorCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  const handleCopyId = () => {
    navigator.clipboard.writeText(snippet.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const zoneColors = {
    anchor: "bg-primary text-primary-foreground",
    ticker: "bg-accent text-accent-foreground",
    ghost: "bg-muted text-muted-foreground",
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md bg-white">
      <div 
        className="flex items-center justify-between px-4 py-3 bg-background/20 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Badge variant="outline" className={`${zoneColors[snippet.zone]} border-none font-semibold uppercase text-[10px]`}>
            {snippet.zone}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground truncate max-w-[200px]">
            {snippet.content.substring(0, 40)}...
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(snippet.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Snippet Content</label>
            <Textarea
              value={snippet.content}
              onChange={(e) => onUpdate({ ...snippet, content: e.target.value })}
              className="min-h-[100px] text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cluster</label>
              <Select
                value={snippet.cluster}
                onValueChange={(val) => onUpdate({ ...snippet, cluster: val as any })}
              >
                <SelectTrigger className="h-9 capitalize">
                  <SelectValue placeholder="Select Cluster" />
                </SelectTrigger>
                <SelectContent>
                  {CLUSTERS.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Zone</label>
              <Select
                value={snippet.zone}
                onValueChange={(val) => onUpdate({ ...snippet, zone: val as any })}
              >
                <SelectTrigger className="h-9 capitalize">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z} className="capitalize">{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weight</label>
              <Select
                value={snippet.weight.toString()}
                onValueChange={(val) => onUpdate({ ...snippet, weight: parseFloat(val) as any })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Weight" />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHTS.map((w) => (
                    <SelectItem key={w} value={w.toString()}>{w.toFixed(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attribution</label>
              <Input
                value={snippet.attribution || ""}
                onChange={(e) => onUpdate({ ...snippet, attribution: e.target.value })}
                className="h-9 text-sm"
                placeholder="Source section..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Emphasis</label>
            <Input
              value={snippet.emphasis || ""}
              onChange={(e) => onUpdate({ ...snippet, emphasis: e.target.value })}
              className="h-9 text-sm"
              placeholder="Emotional or rhetorical weight..."
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border/50">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              ID: {snippet.id}
              <button 
                onClick={handleCopyId}
                className="hover:text-primary transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
