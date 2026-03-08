export type Sentiment = 'critical' | 'urgent' | 'concerning' | 'neutral' | 'positive';

export const analyzeSentiment = (text: string): Sentiment => {
    const t = text.toLowerCase();

    const criticalWords = ['emergency', 'death', 'died', 'negligence', 'danger', 'killed', 'blood', 'unconscious', 'threat', 'suicide'];
    const urgentWords = ['pain', 'accident', 'broken', 'breathing', 'bleeding', 'hurry', 'immediate', 'asap', 'worsening'];
    const concerningWords = ['bad', 'rude', 'dirty', 'late', 'mistake', 'wrong', 'unhappy', 'poor', 'expensive', 'wait'];
    const positiveWords = ['good', 'great', 'thank', 'happy', 'recovered', 'excellent', 'helpful', 'kind'];

    if (criticalWords.some(word => t.includes(word))) return 'critical';
    if (urgentWords.some(word => t.includes(word))) return 'urgent';
    if (concerningWords.some(word => t.includes(word))) return 'concerning';
    if (positiveWords.some(word => t.includes(word))) return 'positive';

    return 'neutral';
};

export const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
        case 'critical': return 'text-red-700 bg-red-100';
        case 'urgent': return 'text-orange-700 bg-orange-100';
        case 'concerning': return 'text-amber-700 bg-amber-100';
        case 'positive': return 'text-emerald-700 bg-emerald-100';
        default: return 'text-slate-700 bg-slate-100';
    }
};
