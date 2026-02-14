import { SentimentIntensityAnalyzer } from 'vader-sentiment';
import natural from 'natural';

// Initialize Vader analyzer
// Note: vader-sentiment declaration might be missing types, so we might need a validation here or just usage.
// If it fails, we might need a require or different import. 
// Standard import: import { SentimentIntensityAnalyzer } from 'vader-sentiment';

export interface SentimentResult {
    score: number; // Compound score: -1 to 1
    keywords: string[];
    analysis: string;
}

export function analyzeSentiment(text: string): SentimentResult {
    // Initialized statically
    // @ts-ignore
    const result = SentimentIntensityAnalyzer.polarity_scores(text);
    const score = result.compound;

    // Simple keyword extraction using natural
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);

    // Filter for significant words (simple stopword filtering + length)
    // implementing a basic filter here, ideally use natural's stopwords
    const stopwords = new Set(['the', 'and', 'is', 'to', 'in', 'of', 'for', 'it', 'my', 'that', 'this', 'with', 'on']);
    const keywords = tokens
        .filter(t => t.length > 3 && !stopwords.has(t.toLowerCase()))
        .slice(0, 5); // Start with top 5 distinct

    let analysis = '';
    if (score >= 0.05) analysis = 'Positive';
    else if (score <= -0.05) analysis = 'Negative';
    else analysis = 'Neutral';

    return {
        score,
        keywords: Array.from(new Set(keywords)), // Dedup
        analysis,
    };
}
