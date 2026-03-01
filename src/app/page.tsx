"use client"

import * as React from "react"
import { ReviewQueue } from "@/components/ReviewQueue"
import { SourceLibrary } from "@/components/SourceLibrary"
import { IntelligenceReportView } from "@/components/IntelligenceReportView"
import { Snippet, IntelligenceReport } from "@/lib/types"
import { Sparkles, FileText, LayoutGrid, ShieldCheck, Loader2, Library, Network } from "lucide-react"
import { generateIntelligenceReport } from "@/ai/flows/generate-intelligence-report"
import { extractAndTagSnippets } from "@/ai/flows/ai-assisted-snippet-extraction"
import { getAllFilesContent } from "@/app/actions/source-files"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

export default function SnippetForgePage() {
  const [snippets, setSnippets] = React.useState<Snippet[]>([])
  const [report, setReport] = React.useState<IntelligenceReport | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSnippetsExtracted = (newSnippets: Snippet[]) => {
    setSnippets((prev) => [...newSnippets, ...prev])
  }

  const runGlobalAnalysis = async () => {
    setIsProcessing(true)
    try {
      // 1. Fetch All Content
      const corpusContent = await getAllFilesContent()
      
      if (!corpusContent) {
        toast({
          variant: "destructive",
          title: "Library Empty",
          description: "No source documents found in src/data to analyze."
        })
        return
      }

      // 2. Generate Global Report
      const reportResult = await generateIntelligenceReport({
        corpusContent
      })
      setReport(reportResult as IntelligenceReport)

      // 3. Extract Global Snippets
      const snippetResult = await extractAndTagSnippets({ 
        corpusContent 
      })
      handleSnippetsExtracted(snippetResult as Snippet[])

      toast({
        title: "Synthesis Complete",
        description: "Global intelligence report and corpus snippets generated successfully."
      })
    } catch (error) {
      console.error("Global analysis failed:", error)
      toast({
        variant: "destructive",
        title: "Synthesis Failed",
        description: "There was an error processing the intelligence library."
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
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Analysis Mode</span>
              <span className="text-sm font-semibold text-accent flex items-center gap-1">
                <Network className="h-3 w-3" />
                Global Corpus Synthesis
              </span>
            </div>
            <Button 
              disabled={isProcessing}
              onClick={runGlobalAnalysis}
              className="bg-accent hover:bg-accent/90 text-white shadow-md shadow-accent/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synthesizing Library...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run Global Analysis
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
            <SourceLibrary onFileSelected={() => {}} isProcessing={isProcessing} />
            
            <div className="p-6 bg-white border border-border/50 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Tactical Manual</h3>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                  <p><strong>Review</strong> source documents in the Doctrine Repository above.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                  <p><strong>Execute</strong> "Run Global Analysis" to synthesize all documents into a unified report.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                  <p><strong>Examine</strong> patterns, severity scores, and countermeasures in the Report tab.</p>
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
                    <Library className="h-16 w-12 text-muted-foreground opacity-20 mb-4" />
                    <h2 className="text-xl font-headline font-semibold text-primary/40">Repository Analysis Pending</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                      Initiate Global Analysis to generate a holistic synthesis of the entire repository.
                    </p>
                  </div>
                )}
                {isProcessing && (
                  <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-border/50 shadow-sm">
                    <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
                    <h2 className="text-xl font-headline font-semibold text-primary">Cross-Document Synthesis</h2>
                    <p className="text-sm text-muted-foreground mt-2 animate-pulse">
                      Aggregating archive and mapping global tactical signatures...
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
