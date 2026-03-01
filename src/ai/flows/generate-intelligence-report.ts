'use server';
/**
 * @fileOverview Intelligence Report Generation AI agent.
 *
 * - generateIntelligenceReport - A function that synthesizes raw documents into a structured report.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligenceReportInputSchema = z.object({
  documentTitle: z.string().describe('The name of the source document.'),
  documentContent: z.string().describe('The full text content of the document to analyze.'),
});

const TacticalAnalysisSchema = z.object({
  tactic: z.string().describe('Name of the identified tactic.'),
  description: z.string().describe('Deep dive into how the tactic works.'),
  severity: z.enum(['High', 'Medium', 'Low']).describe('Risk level of the tactic.'),
});

const IntelligenceReportOutputSchema = z.object({
  title: z.string().describe('Formal title of the intelligence report.'),
  executiveSummary: z.string().describe('High-level overview of the findings.'),
  keyFindings: z.array(z.string()).describe('List of critical observations.'),
  tacticalAnalysis: z.array(TacticalAnalysisSchema).describe('Detailed breakdown of manipulative mechanics found.'),
  recommendedCountermeasures: z.array(z.string()).describe('Actionable steps to mitigate the identified threats.'),
  conclusion: z.string().describe('Final closing statement.'),
});

export async function generateIntelligenceReport(input: { documentTitle: string; documentContent: string }) {
  return generateIntelligenceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligenceReportPrompt',
  input: { schema: IntelligenceReportInputSchema },
  output: { schema: IntelligenceReportOutputSchema },
  prompt: `You are a Senior Intelligence Analyst specializing in psychosocial operations and counter-intelligence. 

Your task is to analyze the provided document and generate a comprehensive Intelligence Report. 

Source Document: {{{documentTitle}}}
Content:
{{{documentContent}}}

Your report must:
1. Synthesize the core psychological doctrines presented.
2. Identify specific manipulative tactics (e.g., Gaslighting, DARVO, Civilian Weaponization) described or demonstrated.
3. Assess the impact on the target's cognitive integrity.
4. Provide clear, actionable countermeasures based on the "Breadcrumb Web" or other defensive protocols mentioned.

Format the output as a professional, structured intelligence debrief.`,
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
