import axios, { AxiosInstance } from "axios";
import * as fs from "fs";
import * as path from "path";

/**
 * Voice Synthesis Service
 * Handles text-to-speech using ElevenLabs API
 * Setup: Get API key from https://elevenlabs.io
 */

export interface VoiceSynthesisConfig {
  apiKey: string;
  voiceId?: string; // Default voice ID
  stability?: number; // 0-1, default 0.5
  similarityBoost?: number; // 0-1, default 0.75
}

export interface VoiceOptions {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  modelId?: string; // e.g., "eleven_monolingual_v1", "eleven_multilingual_v2"
  language?: string; // e.g., "pt-BR", "en-US"
}

export interface SynthesizedVoice {
  id: string;
  text: string;
  voiceId: string;
  audioUrl: string;
  duration: number;
  fileSize: number;
  createdAt: Date;
}

export class VoiceSynthesisService {
  private client: AxiosInstance | null = null;
  private config: VoiceSynthesisConfig | null = null;
  private voiceCache: Map<string, SynthesizedVoice> = new Map();

  /**
   * Initialize ElevenLabs client
   */
  initialize(config: VoiceSynthesisConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: "https://api.elevenlabs.io/v1",
      headers: {
        "xi-api-key": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("[Voice Synthesis] ElevenLabs initialized");
  }

  /**
   * Synthesize text to speech
   */
  async synthesizeVoice(options: VoiceOptions): Promise<SynthesizedVoice> {
    if (!this.client) {
      throw new Error("Voice synthesis service not initialized");
    }

    try {
      const voiceId = options.voiceId || this.config?.voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default voice
      const stability = options.stability ?? this.config?.stability ?? 0.5;
      const similarityBoost = options.similarityBoost ?? this.config?.similarityBoost ?? 0.75;
      const modelId = options.modelId || "eleven_monolingual_v1";

      // Check cache first
      const cacheKey = `${voiceId}_${options.text}`;
      if (this.voiceCache.has(cacheKey)) {
        return this.voiceCache.get(cacheKey)!;
      }

      // Call ElevenLabs API
      const response = await this.client.post(`/text-to-speech/${voiceId}`, {
        text: options.text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      });

      // Save audio file
      const audioBuffer = Buffer.from(response.data);
      const audioId = `audio_${Date.now()}`;
      const audioPath = path.join("/tmp", `${audioId}.mp3`);

      fs.writeFileSync(audioPath, audioBuffer);

      const synthesizedVoice: SynthesizedVoice = {
        id: audioId,
        text: options.text,
        voiceId,
        audioUrl: audioPath,
        duration: this.estimateDuration(options.text),
        fileSize: audioBuffer.length,
        createdAt: new Date(),
      };

      // Cache result
      this.voiceCache.set(cacheKey, synthesizedVoice);

      console.log(`[Voice Synthesis] Generated audio: ${audioId}`);
      return synthesizedVoice;
    } catch (error) {
      console.error("[Voice Synthesis] Error synthesizing voice:", error);
      throw error;
    }
  }

  /**
   * Get available voices
   */
  async getAvailableVoices(): Promise<any[]> {
    if (!this.client) {
      throw new Error("Voice synthesis service not initialized");
    }

    try {
      const response = await this.client.get("/voices");
      return response.data.voices;
    } catch (error) {
      console.error("[Voice Synthesis] Error fetching voices:", error);
      throw error;
    }
  }

  /**
   * Create voice clone from sample
   */
  async createVoiceClone(name: string, audioFile: Buffer): Promise<string> {
    if (!this.client) {
      throw new Error("Voice synthesis service not initialized");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      const blob = new Blob([audioFile as unknown as BlobPart], { type: "audio/mpeg" });
      formData.append("files", blob);

      const response = await this.client.post("/voices/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const voiceId = response.data.voice_id;
      console.log(`[Voice Synthesis] Voice cloned: ${voiceId}`);
      return voiceId;
    } catch (error) {
      console.error("[Voice Synthesis] Error creating voice clone:", error);
      throw error;
    }
  }

  /**
   * Synthesize with multiple voices (for variety)
   */
  async synthesizeWithVariety(text: string, voiceIds: string[]): Promise<SynthesizedVoice[]> {
    try {
      const results: SynthesizedVoice[] = [];

      for (const voiceId of voiceIds) {
        const result = await this.synthesizeVoice({
          text,
          voiceId,
        });
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error("[Voice Synthesis] Error synthesizing with variety:", error);
      throw error;
    }
  }

  /**
   * Estimate audio duration based on text
   */
  private estimateDuration(text: string): number {
    // Average speaking rate: ~150 words per minute
    const words = text.split(/\s+/).length;
    const minutes = words / 150;
    return Math.ceil(minutes * 60); // Return seconds
  }

  /**
   * Get audio file as base64
   */
  getAudioBase64(audioPath: string): string {
    try {
      const audioBuffer = fs.readFileSync(audioPath);
      return (audioBuffer as Buffer).toString("base64");
    } catch (error) {
      console.error("[Voice Synthesis] Error reading audio file:", error);
      throw error;
    }
  }

  /**
   * Delete cached audio
   */
  deleteCachedAudio(audioId: string): boolean {
    try {
      const audioPath = path.join("/tmp", `${audioId}.mp3`);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[Voice Synthesis] Error deleting audio:", error);
      return false;
    }
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.client !== null && this.config !== null;
  }

  /**
   * Get voice cache stats
   */
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.voiceCache.size,
      entries: this.voiceCache.size,
    };
  }

  /**
   * Clear voice cache
   */
  clearCache(): void {
    this.voiceCache.forEach((voice) => {
      this.deleteCachedAudio(voice.id);
    });
    this.voiceCache.clear();
    console.log("[Voice Synthesis] Cache cleared");
  }
}

export const voiceSynthesisService = new VoiceSynthesisService();

