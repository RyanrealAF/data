export type Cluster =
  | 'Introduction'
  | 'Key Takeaways'
  | 'Detailed Analysis'
  | 'Conclusion'
  | 'Examples'
  | 'Quotes'
  | 'Statistics'
  | 'Methodology'
  | 'Background'
  | 'Future Outlook'
  | 'Challenges'
  | 'Solutions'
  | 'Recommendations'
  | 'Call to Action';

export type Zone = 'anchor' | 'ticker' | 'ghost';

export type Weight = 'critical' | 'high' | 'medium' | 'low' | 'optional';

export interface Snippet {
  id: string;
  content: string;
  cluster: Cluster;
  zone: Zone;
  weight: Weight;
  attribution?: string;
  emphasisWords?: string;
}

export interface IntelligenceReport {
  title: string;
  executiveSummary: string;
  keyFindings: string[];
  tacticalAnalysis: {
    tactic: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
  recommendedCountermeasures: string[];
  conclusion: string;
}

export const CLUSTERS: Cluster[] = [
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
];

export const ZONES: Zone[] = ['anchor', 'ticker', 'ghost'];

export const WEIGHTS: Weight[] = ['critical', 'high', 'medium', 'low', 'optional'];
