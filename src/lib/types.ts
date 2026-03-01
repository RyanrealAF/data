export type Cluster =
  | 'betrayal'
  | 'surveillance'
  | 'resilience'
  | 'tactical'
  | 'systemic'
  | 'connection';

export type Zone = 'anchor' | 'ticker' | 'ghost';

export type Weight = 0.5 | 1.0 | 1.5 | 2.0;

export interface Snippet {
  id: string;
  content: string;
  cluster: Cluster;
  zone: Zone;
  weight: Weight;
  attribution?: string;
  emphasis?: string;
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
  'betrayal',
  'surveillance',
  'resilience',
  'tactical',
  'systemic',
  'connection',
];

export const ZONES: Zone[] = ['anchor', 'ticker', 'ghost'];

export const WEIGHTS: Weight[] = [0.5, 1.0, 1.5, 2.0];
