'use server';
/**
 * @fileOverview Global Intelligence Synthesis Flow.
 *
 * - generateIntelligenceReport - Synthesizes multiple source documents into a holistic tactical report.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligenceReportInputSchema = z.object({
  corpusContent: z.string().describe('The aggregated text of all source documents in the library.'),
});

const TacticalAnalysisSchema = z.object({
  tactic: z.string().describe('Name of the identified tactic.'),
  description: z.string().describe('Deep dive into how the tactic works across different contexts found in the data.'),
  severity: z.enum(['High', 'Medium', 'Low']).describe('Risk level of the tactic.'),
});

const IntelligenceReportOutputSchema = z.object({
  title: z.string().describe('Formal title of the global intelligence synthesis.'),
  executiveSummary: z.string().describe('High-level overview of findings across the entire document repository.'),
  keyFindings: z.array(z.string()).describe('List of critical cross-document observations and recurring patterns.'),
  tacticalAnalysis: z.array(TacticalAnalysisSchema).describe('Detailed breakdown of manipulative mechanics identified throughout the corpus.'),
  recommendedCountermeasures: z.array(z.string()).describe('Actionable steps to mitigate threats based on the collective doctrine.'),
  conclusion: z.string().describe('Final closing statement on the state of the intelligence landscape.'),
});

export async function generateIntelligenceReport(input: { corpusContent: string }) {
  return generateIntelligenceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligenceReportPrompt',
  input: { schema: IntelligenceReportInputSchema },
  output: { schema: IntelligenceReportOutputSchema },
  prompt: `You are a Senior Intelligence Analyst specializing in cross-document synthesis and psychosocial operations.

Your task is to analyze the PROVIDED REPOSITORY of documents as a single cohesive corpus and generate a comprehensive Global Intelligence Report.

REPOSITORY CONTENT:
{{{corpusContent}}}

Your report must:
1. Identify RECURRING PATTERNS and psychological doctrines that appear across multiple documents.
2. Synthesize a unified tactical framework based on the collective evidence.
3. Identify specific manipulative tactics (e.g., Gaslighting, DARVO, Civilian Weaponization) demonstrated across different case studies or manuals.
4. Assess the systemic impact on cognitive integrity.
5. Provide high-level, actionable countermeasures based on the "Breadcrumb Web" and other defensive protocols described throughout the archive.

Do not treat documents in isolation. Look for the "Operational Signature" that connects the entire archive. Format the output as a professional, structured intelligence debrief.`,
});

const generateIntelligenceReportFlow = ai.defineFlow(
  {
    name: 'generateIntelligenceReportFlow',
    inputSchema: IntelligenceReportInputSchema,
    outputSchema: IntelligenceReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
