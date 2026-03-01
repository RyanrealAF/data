"use client"

import * as React from "react"
import { IntelligenceReport } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { ShieldAlert, CheckCircle2, AlertTriangle, Terminal, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface IntelligenceReportViewProps {
  report: IntelligenceReport | null
}

export function IntelligenceReportView({ report }: IntelligenceReportViewProps) {
  if (!report) return null

  const severityColors = {
    High: "bg-destructive text-destructive-foreground",
    Medium: "bg-orange-500 text-white",
    Low: "bg-yellow-500 text-white",
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-l-4 border-l-accent shadow-lg overflow-hidden">
        <CardHeader className="bg-accent/5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-headline text-primary mb-1">
                {report.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-tighter text-[10px]">AI-Generated Report</Badge>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Classification: Confidential</span>
              </CardDescription>
            </div>
            <ShieldAlert className="h-10 w-10 text-accent opacity-20" />
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {/* Executive Summary */}
          <section>
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Executive Summary
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-4">
              {report.executiveSummary}
            </p>
          </section>

          <Separator className="bg-border/50" />

          {/* Key Findings */}
          <section>
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Key Intelligence Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.keyFindings.map((finding, i) => (
                <div key={i} className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/30">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80 font-medium">{finding}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tactical Breakdown */}
          <section>
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Tactical Attack Vector Analysis
            </h3>
            <div className="space-y-4">
              {report.tacticalAnalysis.map((item, i) => (
                <div key={i} className="group p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-all bg-white hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-primary">{item.tactic}</h4>
                    <Badge className={severityColors[item.severity]}>{item.severity}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Countermeasures */}
          <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Recommended Countermeasures
            </h3>
            <ul className="space-y-3">
              {report.recommendedCountermeasures.map((measure, i) => (
                <li key={i} className="flex gap-3 text-sm font-medium text-primary/80">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-primary font-bold">{i + 1}</span>
                  </div>
                  {measure}
                </li>
              ))}
            </ul>
          </section>

          {/* Conclusion */}
          <section className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold text-muted-foreground uppercase">Closing Analyst Statement</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {report.conclusion}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
