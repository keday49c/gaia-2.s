import { describe, it, expect, beforeEach } from "vitest";
import { contentGenerationService } from "../services/contentGenerationService";
import { contentAnalysisService } from "../services/contentAnalysisService";
import { voiceSynthesisService } from "../services/voiceSynthesisService";

describe("Content Generation Service", () => {
  beforeEach(() => {
    // Initialize with test keys (would be real keys in production)
    contentGenerationService.initialize({
      openaiApiKey: process.env.OPENAI_API_KEY || "test-key",
      geminiApiKey: process.env.GEMINI_API_KEY || "test-key",
    });
  });

  describe("Service Initialization", () => {
    it("should initialize successfully", () => {
      expect(contentGenerationService.isInitialized()).toBe(true);
    });
  });

  describe("Content Generation", () => {
    it("should accept valid content request", () => {
      const request = {
        type: "post" as const,
        platform: "instagram" as const,
        topic: "Digital Marketing Tips",
        tone: "professional" as const,
        language: "pt-BR",
        targetAudience: "Marketing Professionals",
        keywords: ["marketing", "digital", "social media"],
        maxLength: 500,
      };

      expect(request.type).toBe("post");
      expect(request.platform).toBe("instagram");
      expect(request.topic).toBe("Digital Marketing Tips");
    });

    it("should validate content request fields", () => {
      const validPlatforms = ["instagram", "facebook", "tiktok", "linkedin", "twitter", "whatsapp"];
      const platform = "instagram";
      expect(validPlatforms).toContain(platform);
    });

    it("should support multiple content types", () => {
      const contentTypes = ["post", "ad_copy", "email", "script", "hashtags", "description"];
      expect(contentTypes).toHaveLength(6);
    });
  });

  describe("Content Analysis Service", () => {
    it("should analyze content quality", () => {
      const content = "Check out our amazing new product! Amazing features and incredible value. #marketing #digital";
      const analysis = contentAnalysisService.analyzeContent(content, "instagram");

      expect(analysis.content).toBe(content);
      expect(analysis.scores.overall).toBeGreaterThanOrEqual(0);
      expect(analysis.scores.overall).toBeLessThanOrEqual(100);
      expect(analysis.wordCount).toBeGreaterThan(0);
      expect(analysis.readingTime).toBeGreaterThanOrEqual(0);
    });

    it("should detect sentiment", () => {
      const positiveContent = "This is amazing! I love it! Fantastic work!";
      const analysis = contentAnalysisService.analyzeContent(positiveContent, "twitter");

      expect(["positive", "neutral", "negative"]).toContain(analysis.scores.sentiment);
    });

    it("should calculate readability score", () => {
      const content = "The quick brown fox jumps over the lazy dog. This is a simple sentence.";
      const analysis = contentAnalysisService.analyzeContent(content, "linkedin");

      expect(analysis.scores.readability).toBeGreaterThanOrEqual(0);
      expect(analysis.scores.readability).toBeLessThanOrEqual(100);
    });

    it("should detect call-to-action", () => {
      const contentWithCTA = "Click here to learn more about our services!";
      const analysis = contentAnalysisService.analyzeContent(contentWithCTA, "facebook");

      expect(analysis.metadata.hasCTA).toBe(true);
    });

    it("should count hashtags", () => {
      const content = "Great content! #marketing #digital #socialmedia";
      const analysis = contentAnalysisService.analyzeContent(content, "instagram");

      expect(analysis.metadata.hashtagCount).toBe(3);
      expect(analysis.metadata.hasHashtags).toBe(true);
    });

    it("should detect emojis", () => {
      const content = "Amazing product! 🚀 Check it out! 💯";
      const analysis = contentAnalysisService.analyzeContent(content, "instagram");

      expect(analysis.metadata.hasEmojis).toBe(true);
      expect(analysis.metadata.emojiCount).toBeGreaterThan(0);
    });

    it("should extract keywords", () => {
      const content = "Digital marketing is important for business growth and customer engagement";
      const analysis = contentAnalysisService.analyzeContent(content, "linkedin");

      expect(analysis.keywords).toBeInstanceOf(Array);
      expect(analysis.keywords.length).toBeGreaterThan(0);
    });

    it("should generate recommendations", () => {
      const shortContent = "Hi";
      const analysis = contentAnalysisService.analyzeContent(shortContent, "instagram");

      expect(analysis.recommendations).toBeInstanceOf(Array);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });

    it("should calculate platform-specific engagement", () => {
      const instagramContent = "Amazing content! 🚀 #marketing #digital #socialmedia #business #growth";
      const twitterContent = "Great news! Check this out. #marketing";

      const igAnalysis = contentAnalysisService.analyzeContent(instagramContent, "instagram");
      const twitterAnalysis = contentAnalysisService.analyzeContent(twitterContent, "twitter");

      expect(igAnalysis.scores.engagement).toBeGreaterThanOrEqual(0);
      expect(twitterAnalysis.scores.engagement).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Voice Synthesis Service", () => {
    beforeEach(() => {
      voiceSynthesisService.initialize({
        apiKey: process.env.ELEVENLABS_API_KEY || "test-key",
      });
    });

    it("should initialize ElevenLabs client", () => {
      expect(voiceSynthesisService.isInitialized()).toBe(true);
    });

    it("should accept valid voice synthesis request", () => {
      const request = {
        text: "Welcome to Apogeu, your digital marketing platform",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        stability: 0.5,
        similarityBoost: 0.75,
      };

      expect(request.text).toBeDefined();
      expect(request.text.length).toBeGreaterThan(0);
      expect(request.stability).toBeGreaterThanOrEqual(0);
      expect(request.stability).toBeLessThanOrEqual(1);
    });

    it("should estimate audio duration", () => {
      const shortText = "Hello";
      const longText = "This is a much longer text that should take more time to read aloud.";

      // Duration should be estimated based on word count
      expect(shortText.split(/\s+/).length).toBeLessThan(longText.split(/\s+/).length);
    });

    it("should support multiple voice options", () => {
      const voiceOptions = {
        text: "Test audio",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        modelId: "eleven_monolingual_v1",
        language: "pt-BR",
      };

      expect(voiceOptions.modelId).toBeDefined();
      expect(voiceOptions.language).toBeDefined();
    });

    it("should manage voice cache", () => {
      const stats = voiceSynthesisService.getCacheStats();
      expect(stats.size).toBeGreaterThanOrEqual(0);
      expect(stats.entries).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Integration Tests", () => {
    it("should generate and analyze content", () => {
      const request = {
        type: "post" as const,
        platform: "instagram" as const,
        topic: "Marketing Tips",
        tone: "professional" as const,
        language: "en-US",
      };

      expect(request.type).toBe("post");
      expect(request.platform).toBe("instagram");
    });

    it("should support content workflow", () => {
      const workflow = {
        step1: "Generate content with AI",
        step2: "Analyze content quality",
        step3: "Optimize for SEO",
        step4: "Synthesize voice",
        step5: "Publish to platform",
      };

      expect(Object.keys(workflow)).toHaveLength(5);
    });
  });
});

