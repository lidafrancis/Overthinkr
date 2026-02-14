
const Vader = require('vader-sentiment');

console.log('Vader:', Vader);
console.log('Vader.polarity_scores:', Vader.polarity_scores);

try {
    if (Vader.polarity_scores) {
        const res = Vader.polarity_scores('I am happy');
        console.log('Success (Static):', res);
    } else if (Vader.SentimentIntensityAnalyzer && Vader.SentimentIntensityAnalyzer.polarity_scores) {
        const res = Vader.SentimentIntensityAnalyzer.polarity_scores('I am happy');
        console.log('Success (Nested Static):', res);
    } else {
        console.log('Still could not find polarity_scores');
    }
} catch (e) {
    console.log('Error:', e);
}
