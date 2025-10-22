import axios, { AxiosInstance } from "axios";

/**
 * Content Generation Service
 * Handles AI-powered content generation using Gemini and OpenAI
 * Setup: Get API keys from https://ai.google.dev and https://openai.com
 */

export interface ContentGenerationConfig {
  geminiApiKey?: string;
  openaiApiKey?: string;
  openaiModel?: string; // e.g., "gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"
}

export interface ContentRequest {
  type: "post" | "ad_copy" | "email" | "script" | "hashtags" | "description";
  platform: "instagram" | "facebook" | "tiktok" | "linkedin" | "twitter" | "whatsapp";
  topic: string;
  tone: "professional" | "casual" | "humorous" | "urgent" | "inspirational";
  language: string;
  targetAudience?: string;
  keywords?: string[];
  maxLength?: number;
}

export interface GeneratedContent {
  id: string;
  type: string;
  platform: string;
  content: string;
  variations: string[];
  hashtags: string[];
  metadata: {
    generatedAt: Date;
    model: string;
    estimatedEngagement?: number;
    seoScore?: number;
  };
}

export class ContentGenerationService {
  private geminiClient: AxiosInstance | null = null;
  private openaiClient: AxiosInstance | null = null;
  private config: ContentGenerationConfig | null = null;

  /**
   * Initialize content generation service
   */
  initialize(config: ContentGenerationConfig) {
    this.config = config;

    if (config.geminiApiKey) {
      this.geminiClient = axios.create({
        baseURL: "https://generativelanguage.googleapis.com/v1beta/models",
        params: {
          key: config.geminiApiKey,
        },
      });
      console.log("[Content Generation] Gemini initialized");
    }

    if (config.openaiApiKey) {
      this.openaiClient = axios.create({
        baseURL: "https://api.openai.com/v1",
        headers: {
          Authorization: `Bearer ${config.openaiApiKey}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[Content Generation] OpenAI initialized");
    }
  }

  /**
   * Generate content using Gemini or OpenAI
   */
  async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    try {
      // Prefer OpenAI if available, fallback to Gemini
      let content: string;
      let model: string;

      if (this.openaiClient) {
        const result = await this.generateWithOpenAI(request);
        content = result.content;
        model = this.config?.openaiModel || "gpt-4";
      } else if (this.geminiClient) {
        const result = await this.generateWithGemini(request);
        content = result.content;
        model = "gemini-pro";
      } else {
        throw new Error("No content generation service initialized");
      }

      // Generate variations
      const variations = await this.generateVariations(request, content);

      // Extract hashtags
      const hashtags = this.extractHashtags(content);

      // Calculate engagement score
      const estimatedEngagement = this.calculateEngagementScore(content, request.platform);

      return {
        id: `content_${Date.now()}`,
        type: request.type,
        platform: request.platform,
        content,
        variations,
        hashtags: Array.from(hashtags),
        metadata: {
          generatedAt: new Date(),
          model,
          estimatedEngagement,
        },
      };
    } catch (error) {
      console.error("[Content Generation] Error generating content:", error);
      throw error;
    }
  }

  /**
   * Generate content using OpenAI
   */
  private async generateWithOpenAI(request: ContentRequest): Promise<{ content: string }> {
    if (!this.openaiClient) {
      throw new Error("OpenAI client not initialized");
    }

    const prompt = this.buildPrompt(request);

    try {
      const response = await this.openaiClient.post("/chat/completions", {
        model: this.config?.openaiModel || "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert content creator for ${request.platform} marketing campaigns. 
                     Create engaging, high-quality content that resonates with the target audience.
                     Tone: ${request.tone}
                     Language: ${request.language}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: request.maxLength || 500,
      });

      const content = response.data.choices[0].message.content;
      return { content };
    } catch (error) {
      console.error("[Content Generation] OpenAI error:", error);
      throw error;
    }
  }

  /**
   * Generate content using Gemini
   */
  private async generateWithGemini(request: ContentRequest): Promise<{ content: string }> {
    if (!this.geminiClient) {
      throw new Error("Gemini client not initialized");
    }

    const prompt = this.buildPrompt(request);

    try {
      const response = await this.geminiClient.post(
        "/gemini-pro:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: request.maxLength || 500,
          },
        }
      );

      const content = response.data.candidates[0].content.parts[0].text;
      return { content };
    } catch (error) {
      console.error("[Content Generation] Gemini error:", error);
      throw error;
    }
  }

  /**
   * Generate content variations
   */
  private async generateVariations(
    request: ContentRequest,
    originalContent: string
  ): Promise<string[]> {
    try {
      if (!this.openaiClient && !this.geminiClient) {
        return [];
      }

      const variations: string[] = [];

      // Generate 2-3 variations
      for (let i = 0; i < 2; i++) {
        const variationPrompt = `Create a different version of this ${request.type} for ${request.platform}:
        
Original: ${originalContent}

Make it ${i === 0 ? "more concise" : "more detailed"} while maintaining the same message.`;

        let variation: string;

        if (this.openaiClient) {
          const response = await this.openaiClient.post("/chat/completions", {
            model: this.config?.openaiModel || "gpt-4",
            messages: [{ role: "user", content: variationPrompt }],
            temperature: 0.7,
            max_tokens: request.maxLength || 500,
          });
          variation = response.data.choices[0].message.content;
        } else if (this.geminiClient) {
          const response = await this.geminiClient.post(
            "/gemini-pro:generateContent",
            {
              contents: [{ parts: [{ text: variationPrompt }] }],
              generationConfig: { maxOutputTokens: request.maxLength || 500 },
            }
          );
          variation = response.data.candidates[0].content.parts[0].text;
        } else {
          continue;
        }

        variations.push(variation);
      }

      return variations;
    } catch (error) {
      console.error("[Content Generation] Error generating variations:", error);
      return [];
    }
  }

  /**
   * Build prompt based on request
   */
  private buildPrompt(request: ContentRequest): string {
    const basePrompt = `Create a ${request.type} for ${request.platform} about: "${request.topic}"`;

    const details = [
      basePrompt,
      `Target audience: ${request.targetAudience || "General"}`,
      request.keywords ? `Keywords to include: ${request.keywords.join(", ")}` : "",
      `Tone: ${request.tone}`,
      `Language: ${request.language}`,
      request.maxLength ? `Maximum length: ${request.maxLength} characters` : "",
    ]
      .filter((d) => d)
      .join("\n");

    return details;
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
   * Calculate engagement score (0-100)
   */
  private calculateEngagementScore(content: string, platform: string): number {
    let score = 50; // Base score

    // Length score
    if (content.length > 100 && content.length < 280) score += 15; // Optimal length
    if (content.length > 280 && content.length < 500) score += 10;

    // Emoji score
    const emojiRegex = /\p{Emoji}/gu;
    const emojiCount = (content.match(emojiRegex) || []).length;
    if (emojiCount > 0 && emojiCount <= 3) score += 10;
    if (emojiCount > 3) score += 5;

    // Hashtag score
    const hashtagCount = (content.match(/#[\w]+/g) || []).length;
    if (platform === "instagram" && hashtagCount >= 5 && hashtagCount <= 30) score += 15;
    if (platform === "twitter" && hashtagCount >= 1 && hashtagCount <= 3) score += 10;

    // Call-to-action score
    const ctaKeywords = [
      "click",
      "share",
      "comment",
      "like",
      "subscribe",
      "clique",
      "compartilhe",
      "comente",
      "curta",
      "inscreva-se",
    ];
    if (ctaKeywords.some((keyword) => content.toLowerCase().includes(keyword))) score += 10;

    return Math.min(100, score);
  }

  /**
   * Optimize content for SEO
   */
  async optimizeForSEO(content: string, keywords: string[]): Promise<string> {
    if (!this.openaiClient && !this.geminiClient) {
      throw new Error("No content generation service initialized");
    }

    const prompt = `Optimize this content for SEO using these keywords: ${keywords.join(", ")}
    
Content: ${content}

Provide the optimized version that naturally incorporates the keywords.`;

    try {
      if (this.openaiClient) {
        const response = await this.openaiClient.post("/chat/completions", {
          model: this.config?.openaiModel || "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        });
        return response.data.choices[0].message.content;
      } else if (this.geminiClient) {
        const response = await this.geminiClient.post(
          "/gemini-pro:generateContent",
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1000 },
          }
        );
        return response.data.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error("[Content Generation] SEO optimization error:", error);
      throw error;
    }

    return content;
  }

  /**
   * Check if services are initialized
   */
  isInitialized(): boolean {
    return (this.geminiClient !== null || this.openaiClient !== null) && this.config !== null;
  }
}

export const contentGenerationService = new ContentGenerationService();

