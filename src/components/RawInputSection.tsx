"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sparkles, Loader2, Eraser } from "lucide-react"
import { extractAndTagSnippets } from "@/ai/flows/ai-assisted-snippet-extraction"
import { Snippet } from "@/lib/types"

interface RawInputSectionProps {
  onSnippetsExtracted: (snippets: Snippet[]) => void
}

export function RawInputSection({ onSnippetsExtracted }: RawInputSectionProps) {
  const [rawText, setRawText] = React.useState("")
  const [isExtracting, setIsExtracting] = React.useState(false)

  const handleExtract = async () => {
    if (!rawText.trim()) return
    setIsExtracting(true)
    try {
      const result = await extractAndTagSnippets({ rawSourceDocument: rawText })
      onSnippetsExtracted(result as Snippet[])
    } catch (error) {
      console.error("Extraction failed:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleClear = () => {
    setRawText("")
  }

  return (
    <Card className="h-full border-none shadow-md bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-headline text-primary flex items-center gap-2">
          Raw Source Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste unstructured raw document text here..."
          className="min-h-[400px] font-body text-base leading-relaxed bg-background/30 resize-none border-border/50 focus:border-primary/50"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleExtract}
            disabled={isExtracting || !rawText.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {isExtracting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Snippet Extraction
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isExtracting || !rawText.trim()}
            className="px-3"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
