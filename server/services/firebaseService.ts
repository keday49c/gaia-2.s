import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { Database } from "firebase-admin/database";

/**
 * Firebase Service
 * Handles connection to Firebase Realtime Database (free tier)
 * Setup instructions:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Realtime Database (free tier)
 * 3. Download service account JSON from Project Settings
 * 4. Set FIREBASE_CREDENTIALS environment variable with the JSON path
 * 5. Set FIREBASE_DATABASE_URL with your database URL
 */

export class FirebaseService {
  private db: Database | null = null;
  private initialized = false;

  /**
   * Initialize Firebase connection
   */
  async initialize(credentialsPath: string, databaseUrl: string): Promise<void> {
    try {
      // Load service account credentials
      const serviceAccount = require(credentialsPath);

      // Initialize Firebase Admin SDK
      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: databaseUrl,
      });

      // Get database reference
      this.db = getDatabase();
      this.initialized = true;

      console.log("[Firebase] Connected successfully");
    } catch (error) {
      console.error("[Firebase] Initialization error:", error);
      throw error;
    }
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    return this.initialized && this.db !== null;
  }

  /**
   * Save data to Firebase
   */
  async saveData(path: string, data: any): Promise<void> {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    try {
      await this.db.ref(path).set(data);
      console.log(`[Firebase] Data saved to ${path}`);
    } catch (error) {
      console.error(`[Firebase] Error saving data to ${path}:`, error);
      throw error;
    }
  }

  /**
   * Read data from Firebase
   */
  async readData(path: string): Promise<any> {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    try {
      const snapshot = await this.db.ref(path).get();
      return snapshot.val();
    } catch (error) {
      console.error(`[Firebase] Error reading data from ${path}:`, error);
      throw error;
    }
  }

  /**
   * Update data in Firebase
   */
  async updateData(path: string, updates: any): Promise<void> {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    try {
      await this.db.ref(path).update(updates);
      console.log(`[Firebase] Data updated at ${path}`);
    } catch (error) {
      console.error(`[Firebase] Error updating data at ${path}:`, error);
      throw error;
    }
  }

  /**
   * Delete data from Firebase
   */
  async deleteData(path: string): Promise<void> {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    try {
      await this.db.ref(path).remove();
      console.log(`[Firebase] Data deleted from ${path}`);
    } catch (error) {
      console.error(`[Firebase] Error deleting data from ${path}:`, error);
      throw error;
    }
  }

  /**
   * Query data with filters
   */
  async queryData(path: string, filters?: any): Promise<any[]> {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    try {
      let ref: any = this.db.ref(path);

      if (filters?.orderByChild) {
        ref = ref.orderByChild(filters.orderByChild);
      }

      if (filters?.limitToFirst) {
        ref = ref.limitToFirst(filters.limitToFirst);
      }

      if (filters?.limitToLast) {
        ref = ref.limitToLast(filters.limitToLast);
      }

      const snapshot = await ref.get();
      const results: any[] = [];

      snapshot.forEach((child: any) => {
        results.push({
          id: child.key,
          ...child.val(),
        });
      });

      return results;
    } catch (error) {
      console.error(`[Firebase] Error querying data at ${path}:`, error);
      throw error;
    }
  }

  /**
   * Listen to real-time updates
   */
  listenToUpdates(
    path: string,
    callback: (data: any) => void,
    errorCallback?: (error: any) => void
  ): () => void {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    this.db.ref(path).on("value", (snapshot) => {
      callback(snapshot.val());
    });

    // Return unsubscribe function
    return () => {
      this.db?.ref(path).off();
    };
  }

  /**
   * Batch write operations
   */
  async batchWrite(operations: Array<{ path: string; data: any; operation: "set" | "update" | "delete" }>): Promise<void> {
    if (!this.db) {
      throw new Error("Firebase not initialized");
    }

    try {
      const updates: Record<string, any> = {};

      for (const op of operations) {
        if (op.operation === "set") {
          updates[op.path] = op.data;
        } else if (op.operation === "update") {
          Object.keys(op.data).forEach((key) => {
            updates[`${op.path}/${key}`] = op.data[key];
          });
        } else if (op.operation === "delete") {
          updates[op.path] = null;
        }
      }

      await this.db.ref().update(updates);
      console.log("[Firebase] Batch write completed");
    } catch (error) {
      console.error("[Firebase] Error in batch write:", error);
      throw error;
    }
  }

  /**
   * Get database reference for advanced operations
   */
  getDatabase(): Database | null {
    return this.db;
  }
}

export const firebaseService = new FirebaseService();

