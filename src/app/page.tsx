"use client"

import * as React from "react"
import { ReviewQueue } from "@/components/ReviewQueue"
import { SourceLibrary } from "@/components/SourceLibrary"
import { IntelligenceReportView } from "@/components/IntelligenceReportView"
import { Snippet, IntelligenceReport } from "@/lib/types"
import { Sparkles, FileText, LayoutGrid, ShieldCheck, Loader2, Info } from "lucide-react"
import { generateIntelligenceReport } from "@/ai/flows/generate-intelligence-report"
import { extractAndTagSnippets } from "@/ai/flows/ai-assisted-snippet-extraction"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

export default function SnippetForgePage() {
  const [snippets, setSnippets] = React.useState<Snippet[]>([])
  const [report, setReport] = React.useState<IntelligenceReport | null>(null)
  const [activeSource, setActiveSource] = React.useState<{ title: string; content: string } | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSnippetsExtracted = (newSnippets: Snippet[]) => {
    setSnippets((prev) => [...newSnippets, ...prev])
  }

  const handleFileSelected = (title: string, content: string) => {
    setActiveSource({ title, content })
    toast({
      title: "Document Loaded",
      description: `Ready to analyze ${title}.`
    })
  }

  const runFullAnalysis = async () => {
    if (!activeSource) return
    setIsProcessing(true)
    try {
      // 1. Generate Report
      const reportResult = await generateIntelligenceReport({
        documentTitle: activeSource.title,
        documentContent: activeSource.content
      })
      setReport(reportResult as IntelligenceReport)

      // 2. Extract Snippets
      const snippetResult = await extractAndTagSnippets({ 
        rawSourceDocument: activeSource.content 
      })
      handleSnippetsExtracted(snippetResult as Snippet[])

      toast({
        title: "Analysis Complete",
        description: "Intelligence report and snippets generated successfully."
      })
    } catch (error) {
      console.error("Analysis failed:", error)
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error processing the intelligence document."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-border/50 py-4 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">SnippetForge</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">AI Counter-Intelligence Lab</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeSource && (
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Current Target</span>
                <span className="text-sm font-semibold text-primary truncate max-w-[200px]">{activeSource.title}</span>
              </div>
            )}
            <Button 
              disabled={!activeSource || isProcessing}
              onClick={runFullAnalysis}
              className="bg-accent hover:bg-accent/90 text-white shadow-md shadow-accent/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run Full Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar: Library & Tools */}
          <div className="lg:col-span-4 space-y-6">
            <SourceLibrary onFileSelected={handleFileSelected} isProcessing={isProcessing} />
            
            <div className="p-6 bg-white border border-border/50 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Tactical Manual</h3>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                  <p><strong>Select</strong> a document from the Doctrine Repository above.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                  <p><strong>Process</strong> using "Run Full Analysis" to generate a deep synthesis and extraction.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                  <p><strong>Review</strong> findings in the Report tab and edit snippets in the Queue.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area: Report & Queue */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="report" className="w-full">
              <div className="flex items-center justify-between mb-6 bg-white p-1 rounded-xl border border-border/50 shadow-sm">
                <TabsList className="bg-transparent border-none">
                  <TabsTrigger value="report" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                    Intelligence Report
                  </TabsTrigger>
                  <TabsTrigger value="queue" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                    Extraction Queue ({snippets.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="report" className="mt-0">
                {!report && !isProcessing && (
                  <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-border/50">
                    <FileText className="h-16 w-12 text-muted-foreground opacity-20 mb-4" />
                    <h2 className="text-xl font-headline font-semibold text-primary/40">No Analysis Generated</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                      Select a source document and run analysis to populate this tactical intelligence briefing.
                    </p>
                  </div>
                )}
                {isProcessing && (
                  <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-border/50 shadow-sm">
                    <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
                    <h2 className="text-xl font-headline font-semibold text-primary">Synthesizing Intelligence</h2>
                    <p className="text-sm text-muted-foreground mt-2 animate-pulse">
                      Processing patterns and mapping tactical signatures...
                    </p>
                  </div>
                )}
                {report && !isProcessing && <IntelligenceReportView report={report} />}
              </TabsContent>

              <TabsContent value="queue" className="mt-0">
                <div className="h-[calc(100vh-240px)] min-h-[600px]">
                  <ReviewQueue snippets={snippets} setSnippets={setSnippets} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
