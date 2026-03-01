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
  'Introduction',
  'Key Takeaways',
  'Detailed Analysis',
  'Conclusion',
  'Examples',
  'Quotes',
  'Statistics',
  'Methodology',
  'Background',
  'Future Outlook',
  'Challenges',
  'Solutions',
  'Recommendations',
  'Call to Action',
]);

const ZoneEnum = z.enum(['anchor', 'ticker', 'ghost']);

const WeightEnum = z.enum(['critical', 'high', 'medium', 'low', 'optional']);

// Schema for a single extracted snippet
const SnippetSchema = z.object({
  id: z.string().uuid().describe('A unique identifier (UUID) for the snippet.'),
  content: z.string().describe('The extracted text snippet.'),
  cluster: ClusterEnum.describe('The suggested cluster tag for the snippet, categorizing its main theme or purpose.'),
  zone: ZoneEnum.describe('The suggested zone tag for the snippet, indicating its intended placement or type.'),
  weight: WeightEnum.describe('The suggested importance level (weight) for the snippet.'),
  attribution: z.string().describe('The source or author to attribute the snippet to, if any.').optional(),
  emphasisWords: z.string().describe('A comma-separated list of words within the snippet that should be emphasized.').optional(),
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
  prompt: `You are an AI assistant specialized in extracting and tagging content snippets from raw documents. Your goal is to identify meaningful, self-contained text segments that could be used for content creation, and assign relevant tags.

Extract multiple distinct snippets from the provided raw source document. Each snippet should be a concise, coherent piece of information. For each extracted snippet, you must provide the following details in a JSON array format:

-   'id': A unique identifier for the snippet in standard UUID format (e.g., "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").
-   'content': The exact text of the extracted snippet.
-   'cluster': Assign one of these categories that best describes the snippet's main theme or purpose: 'Introduction', 'Key Takeaways', 'Detailed Analysis', 'Conclusion', 'Examples', 'Quotes', 'Statistics', 'Methodology', 'Background', 'Future Outlook', 'Challenges', 'Solutions', 'Recommendations', 'Call to Action'.
-   'zone': Assign one of these zones indicating its likely use or placement: 'anchor' (core, foundational content), 'ticker' (short, attention-grabbing, or timely content), 'ghost' (supporting, supplementary, or hidden content).
-   'weight': Assign an importance level: 'critical', 'high', 'medium', 'low', 'optional'.
-   'attribution': If the snippet contains a quote or refers to a specific source/person, provide a brief attribution. Otherwise, leave it empty.
-   'emphasisWords': A comma-separated list of 1-3 key words or short phrases within the snippet that should be emphasized. If no words stand out, leave it empty.

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
    // The output schema ensures that 'output' is of type AiAssistedSnippetExtractionOutput (an array of SnippetSchema).
    // No further manual processing or validation for array type is needed here as Genkit handles it via outputSchema.
    return output!;
  }
);
