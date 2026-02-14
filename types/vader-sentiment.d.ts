declare module 'vader-sentiment' {
    export class SentimentIntensityAnalyzer {
        polarity_scores(text: string): {
            compound: number;
            pos: number;
            neu: number;
            neg: number;
        };
    }
}
