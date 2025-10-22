/**
 * Content Analysis Service
 * Analyzes and optimizes generated content for engagement and SEO
 */

export interface ContentAnalysis {
  content: string;
  scores: {
    readability: number; // 0-100
    sentiment: "positive" | "neutral" | "negative";
    engagement: number; // 0-100
    seo: number; // 0-100
    overall: number; // 0-100
  };
  recommendations: string[];
  keywords: string[];
  wordCount: number;
  readingTime: number; // in seconds
  metadata: {
    hasEmojis: boolean;
    hasCTA: boolean;
    hasHashtags: boolean;
    hashtagCount: number;
    emojiCount: number;
  };
}

export class ContentAnalysisService {
  /**
   * Analyze content quality and engagement
   */
  analyzeContent(content: string, platform: string): ContentAnalysis {
    const wordCount = this.countWords(content);
    const readingTime = this.calculateReadingTime(wordCount);
    const sentiment = this.analyzeSentiment(content);
    const readabilityScore = this.calculateReadability(content);
    const engagementScore = this.calculateEngagement(content, platform);
    const seoScore = this.calculateSEOScore(content);
    const overallScore = Math.round((readabilityScore + engagementScore + seoScore) / 3);

    const recommendations = this.generateRecommendations(
      content,
      platform,
      readabilityScore,
      engagementScore,
      seoScore
    );

    const keywords = this.extractKeywords(content);
    const emojiCount = this.countEmojis(content);
    const hasEmojis = emojiCount > 0;
    const hasCTA = this.hasCTA(content);
    const hashtags = content.match(/#[\w]+/g) || [];
    const hasHashtags = hashtags.length > 0;

    return {
      content,
      scores: {
        readability: readabilityScore,
        sentiment,
        engagement: engagementScore,
        seo: seoScore,
        overall: overallScore,
      },
      recommendations,
      keywords,
      wordCount,
      readingTime,
      metadata: {
        hasEmojis,
        hasCTA,
        hasHashtags,
        hashtagCount: hashtags.length,
        emojiCount,
      },
    };
  }

  /**
   * Calculate readability score (Flesch-Kincaid)
   */
  private calculateReadability(content: string): number {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const syllables = this.countSyllables(content);

    if (words === 0 || sentences === 0) return 0;

    // Flesch Reading Ease formula
    const score =
      206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

    // Convert to 0-100 scale
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagement(content: string, platform: string): number {
    let score = 50;

    // Length optimization by platform
    const length = content.length;
    if (platform === "twitter") {
      if (length >= 100 && length <= 280) score += 20;
      else if (length > 280) score -= 10;
    } else if (platform === "instagram") {
      if (length >= 150 && length <= 2200) score += 20;
    } else if (platform === "linkedin") {
      if (length >= 200 && length <= 3000) score += 20;
    }

    // Emoji usage
    const emojiCount = this.countEmojis(content);
    if (platform === "instagram" && emojiCount >= 2 && emojiCount <= 5) score += 15;
    if (platform === "twitter" && emojiCount >= 1 && emojiCount <= 2) score += 10;

    // Hashtags
    const hashtagCount = (content.match(/#[\w]+/g) || []).length;
    if (platform === "instagram" && hashtagCount >= 5 && hashtagCount <= 30) score += 15;
    if (platform === "twitter" && hashtagCount >= 1 && hashtagCount <= 3) score += 10;
    if (platform === "linkedin" && hashtagCount >= 1 && hashtagCount <= 5) score += 10;

    // Call-to-action
    if (this.hasCTA(content)) score += 15;

    // Mentions
    const mentionCount = (content.match(/@[\w]+/g) || []).length;
    if (mentionCount > 0 && mentionCount <= 3) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate SEO score
   */
  private calculateSEOScore(content: string): number {
    let score = 50;

    // Keyword density
    const words = content.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words).size;
    const keywordDensity = uniqueWords / words.length;

    if (keywordDensity >= 0.02 && keywordDensity <= 0.08) score += 20;

    // Headings (if applicable)
    const headingCount = (content.match(/^#+\s/gm) || []).length;
    if (headingCount > 0) score += 10;

    // Links
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (linkCount > 0 && linkCount <= 3) score += 10;

    // Meta description length
    if (content.length >= 120 && content.length <= 160) score += 10;

    return Math.min(100, score);
  }

  /**
   * Analyze sentiment
   */
  private analyzeSentiment(content: string): "positive" | "neutral" | "negative" {
    const positiveWords = [
      "amazing",
      "awesome",
      "great",
      "excellent",
      "wonderful",
      "fantastic",
      "love",
      "best",
      "incredible",
      "perfeito",
      "incrível",
      "ótimo",
      "excelente",
      "maravilhoso",
      "fantástico",
      "adorei",
      "melhor",
    ];

    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "hate",
      "worst",
      "horrible",
      "poor",
      "ruim",
      "terrível",
      "horrível",
      "pior",
      "odeio",
      "péssimo",
    ];

    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerContent.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerContent.includes(word)
    ).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  /**
   * Check for call-to-action
   */
  private hasCTA(content: string): boolean {
    const ctaKeywords = [
      "click",
      "share",
      "comment",
      "like",
      "subscribe",
      "buy",
      "join",
      "sign up",
      "learn more",
      "clique",
      "compartilhe",
      "comente",
      "curta",
      "inscreva-se",
      "compre",
      "junte-se",
      "cadastre-se",
      "saiba mais",
    ];

    return ctaKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword)
    );
  }

  /**
   * Extract keywords
   */
  private extractKeywords(content: string): string[] {
    const words = content
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4);

    // Remove common stop words
    const stopWords = new Set([
      "the",
      "and",
      "for",
      "with",
      "that",
      "this",
      "from",
      "are",
      "have",
      "been",
      "mais",
      "para",
      "com",
      "que",
      "este",
      "este",
      "sido",
    ]);

    const keywords = words.filter((word) => !stopWords.has(word));

    // Count frequency
    const frequency: { [key: string]: number } = {};
    keywords.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Return top 10 keywords
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Count emojis in content
   */
  private countEmojis(content: string): number {
    // Simple emoji detection using surrogate pairs
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    const matches = content.match(emojiRegex);
    return matches ? matches.length : 0;
  }

  /**
   * Extract hashtags from content
   */
  private extractHashtags(content: string): Set<string> {
    const hashtagRegex = /#[\w]+/g;
    const hashtags = content.match(hashtagRegex) || [];
    return new Set(hashtags); // Remove duplicates
  }

  /**
   * Count syllables (simplified)
   */
  private countSyllables(content: string): number {
    const words = content.split(/\s+/);
    let syllableCount = 0;

    words.forEach((word) => {
      word = word.toLowerCase();
      const vowels = word.match(/[aeiouy]/gi) || [];
      let count = vowels.length;

      // Adjust for silent e
      if (word.endsWith("e")) count--;
      if (word.endsWith("le")) count++;

      syllableCount += Math.max(1, count);
    });

    return syllableCount;
  }

  /**
   * Count words
   */
  private countWords(content: string): number {
    return content.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Calculate reading time in seconds
   */
  private calculateReadingTime(wordCount: number): number {
    // Average reading speed: 200 words per minute
    return Math.ceil((wordCount / 200) * 60);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    content: string,
    platform: string,
    readability: number,
    engagement: number,
    seo: number
  ): string[] {
    const recommendations: string[] = [];

    // Readability recommendations
    if (readability < 60) {
      recommendations.push("Simplify sentences for better readability");
    }

    // Engagement recommendations
    if (engagement < 60) {
      recommendations.push("Add a call-to-action to increase engagement");
      const emojiCount = this.countEmojis(content);
      if (emojiCount === 0) {
        recommendations.push("Consider adding relevant emojis");
      }
    }

    // Platform-specific recommendations
    if (platform === "instagram") {
      const hashtagCount = (content.match(/#[\w]+/g) || []).length;
      if (hashtagCount < 5) {
        recommendations.push("Add more hashtags (5-30 recommended for Instagram)");
      }
    }

    if (platform === "twitter") {
      if (content.length > 280) {
        recommendations.push("Content exceeds Twitter character limit");
      }
    }

    // SEO recommendations
    if (seo < 60) {
      recommendations.push("Improve SEO by adding relevant keywords");
    }

    // General recommendations
    if (content.length < 50) {
      recommendations.push("Content is too short. Add more details");
    }

    return recommendations;
  }
}

export const contentAnalysisService = new ContentAnalysisService();

