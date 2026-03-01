'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-assisted snippet extraction and tagging from raw source documents.
 *
 * - extractAndTagSnippets - A function that leverages AI to extract candidate snippets and suggest initial tags.
 * - AiAssistedSnippetExtractionInput - The input type for the extractAndTagSnippets function.
 * - AiAssistedSnippetExtractionOutput - The return type for the extractAndTagSnippets function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the valid options for cluster, zone, and weight tags
const ClusterEnum = z.enum([
  'betrayal',
  'surveillance',
  'resilience',
  'tactical',
  'systemic',
  'connection',
]);

const ZoneEnum = z.enum(['anchor', 'ticker', 'ghost']);

const WeightEnum = z.union([
  z.literal(0.5),
  z.literal(1.0),
  z.literal(1.5),
  z.literal(2.0),
]);

// Schema for a single extracted snippet
const SnippetSchema = z.object({
  id: z.string().uuid().describe('A unique identifier (UUID) for the snippet.'),
  content: z.string().describe('The extracted text snippet.'),
  cluster: ClusterEnum.describe('The main theme of the snippet.'),
  zone: ZoneEnum.describe('The content type: anchor (long emotional quote), ticker (short phrase < 15 words), or ghost (atmospheric fragment).'),
  weight: WeightEnum.describe('The power/distinctiveness level: 0.5, 1.0, 1.5, or 2.0.'),
  attribution: z.string().describe('The likely source section if detectable.').optional(),
  emphasis: z.string().describe('Words or phrases within the snippet that carry the most emotional or rhetorical weight.').optional(),
});

// Input schema for the flow
const AiAssistedSnippetExtractionInputSchema = z.object({
  rawSourceDocument: z.string().describe('The raw source document from which to extract snippets.'),
});
export type AiAssistedSnippetExtractionInput = z.infer<typeof AiAssistedSnippetExtractionInputSchema>;

// Output schema for the flow, an array of snippets
const AiAssistedSnippetExtractionOutputSchema = z.array(SnippetSchema).describe('An array of automatically extracted and tagged candidate snippets.');
export type AiAssistedSnippetExtractionOutput = z.infer<typeof AiAssistedSnippetExtractionOutputSchema>;

// Wrapper function for the Genkit flow
export async function extractAndTagSnippets(
  input: AiAssistedSnippetExtractionInput
): Promise<AiAssistedSnippetExtractionOutput> {
  return aiAssistedSnippetExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedSnippetExtractionPrompt',
  input: { schema: AiAssistedSnippetExtractionInputSchema },
  output: { schema: AiAssistedSnippetExtractionOutputSchema },
  prompt: `You are an AI assistant specialized in extracting and tagging content snippets from raw documents. Your goal is to identify meaningful, self-contained text segments and assign relevant tactical tags.

Extract multiple distinct snippets from the provided raw source document. For each extracted snippet, you must provide:

- 'id': A unique identifier for the snippet in standard UUID format.
- 'content': The exact text of the extracted snippet.
- 'cluster': Assign one of: 'betrayal', 'surveillance', 'resilience', 'tactical', 'systemic', 'connection'.
- 'zone': Categorize by length and depth:
    - 'anchor': Long, emotional, or foundational quotes.
    - 'ticker': Short, clipped phrases under 15 words.
    - 'ghost': Atmospheric fragments, barely a full sentence.
- 'weight': Assign 0.5, 1.0, 1.5, or 2.0 based on how distinctive and powerful the snippet is.
- 'attribution': The likely source section or context if detectable.
- 'emphasis': Words or phrases within the snippet that carry the most emotional or rhetorical weight.

Ensure the output is a valid JSON array of snippet objects.

Raw Source Document:
{{{rawSourceDocument}}}`,
});

const aiAssistedSnippetExtractionFlow = ai.defineFlow(
  {
    name: 'aiAssistedSnippetExtractionFlow',
    inputSchema: AiAssistedSnippetExtractionInputSchema,
    outputSchema: AiAssistedSnippetExtractionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
