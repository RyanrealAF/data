"use client"

import * as React from "react"
import { getSourceFiles, getFileContent } from "@/app/actions/source-files"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, FileSearch, Loader2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SourceLibraryProps {
  onFileSelected: (title: string, content: string) => void
  isProcessing: boolean
}

export function SourceLibrary({ onFileSelected, isProcessing }: SourceLibraryProps) {
  const [files, setFiles] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null)

  const loadFiles = async () => {
    setIsLoading(true)
    const fileList = await getSourceFiles()
    setFiles(fileList)
    setIsLoading(false)
  }

  React.useEffect(() => {
    loadFiles()
  }, [])

  const handleSelect = async (filename: string) => {
    setSelectedFile(filename)
    const content = await getFileContent(filename)
    if (content) {
      onFileSelected(filename, content)
    }
  }

  return (
    <Card className="h-full border-none shadow-md bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-headline text-primary flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Doctrine Repository
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={loadFiles} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Select a document from the <code className="bg-muted px-1 rounded">src/data</code> directory to analyze.
        </p>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Scanning backend files...</p>
              </div>
            ) : files.length > 0 ? (
              files.map((file) => (
                <button
                  key={file}
                  onClick={() => handleSelect(file)}
                  disabled={isProcessing}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${
                    selectedFile === file 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'border-border/50 hover:border-primary/30 hover:bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-md ${selectedFile === file ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                      <FileSearch className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium truncate">{file}</span>
                  </div>
                  {selectedFile === file && (
                    <Badge variant="secondary" className="text-[10px] uppercase">Active</Badge>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-muted-foreground">No files found in backend folder.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
