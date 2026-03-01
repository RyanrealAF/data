'use server';
/**
 * @fileOverview This file defines a Genkit flow for holistic snippet extraction and tagging from a document corpus.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

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

// This schema is what the AI is expected to return
const AiSnippetResultSchema = z.object({
  content: z.string().describe('The extracted text snippet.'),
  cluster: ClusterEnum.describe('The main theme of the snippet.'),
  zone: ZoneEnum.describe('The content type: anchor (long emotional quote), ticker (short phrase < 15 words), or ghost (atmospheric fragment).'),
  weight: WeightEnum.describe('The power/distinctiveness level: 0.5, 1.0, 1.5, or 2.0.'),
  attribution: z.string().describe('The likely source document or section.').optional(),
  emphasis: z.string().describe('Words or phrases within the snippet that carry the most emotional or rhetorical weight.').optional(),
});

// This is the final schema including the system-generated ID
const SnippetSchema = AiSnippetResultSchema.extend({
  id: z.string().uuid().describe('A unique identifier (UUID) for the snippet.'),
});

const AiAssistedSnippetExtractionInputSchema = z.object({
  corpusContent: z.string().describe('The full aggregated content of the intelligence library.'),
});
export type AiAssistedSnippetExtractionInput = z.infer<typeof AiAssistedSnippetExtractionInputSchema>;

const AiAssistedSnippetExtractionOutputSchema = z.array(SnippetSchema).describe('An array of automatically extracted snippets representing the most critical insights from the entire repository.');
export type AiAssistedSnippetExtractionOutput = z.infer<typeof AiAssistedSnippetExtractionOutputSchema>;

export async function extractAndTagSnippets(
  input: AiAssistedSnippetExtractionInput
): Promise<AiAssistedSnippetExtractionOutput> {
  return aiAssistedSnippetExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedSnippetExtractionPrompt',
  input: { schema: AiAssistedSnippetExtractionInputSchema },
  output: { schema: z.array(AiSnippetResultSchema) },
  prompt: `You are an AI assistant specialized in extracting tactical content snippets from an intelligence repository. Your goal is to identify the most meaningful, self-contained segments from ACROSS all documents provided.

Analyze the following corpus and extract approximately 15-20 distinct snippets that represent the core pillars of the data. For each snippet:

- 'content': The exact text of the segment.
- 'cluster': 'betrayal', 'surveillance', 'resilience', 'tactical', 'systemic', 'connection'.
- 'zone': 
    - 'anchor': Long, emotional, or foundational quotes.
    - 'ticker': Short, clipped phrases under 15 words.
    - 'ghost': Atmospheric fragments, barely a full sentence.
- 'weight': 0.5, 1.0, 1.5, or 2.0 based on power and distinctiveness.
- 'attribution': The specific document title or context if identifiable.
- 'emphasis': The emotional or rhetorical "heart" of the snippet.

CORPUS CONTENT:
{{{corpusContent}}}

Prioritize high-signal content that defines the "unseen war" architecture.`,
});

const aiAssistedSnippetExtractionFlow = ai.defineFlow(
  {
    name: 'aiAssistedSnippetExtractionFlow',
    inputSchema: AiAssistedSnippetExtractionInputSchema,
    outputSchema: AiAssistedSnippetExtractionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    // Generate valid UUIDs programmatically to avoid AI hallucination errors
    const snippetsWithIds = (output || []).map(snippet => ({
      ...snippet,
      id: uuidv4()
    }));

    return snippetsWithIds;
  }
);
