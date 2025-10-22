import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';

/**
 * Serviço de Autenticação de Desenvolvedor
 * Gerencia login, credenciais e acesso especial do criador/desenvolvedor
 */

export interface DeveloperCredentials {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  apiKey: string;
  apiSecret: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  permissions: string[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

export interface DeveloperSession {
  developerId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

/**
 * Gera uma senha segura aleatória
 */
export function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  return password;
}

/**
 * Hash de senha com bcrypt-like approach usando crypto
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return `${salt}:${hash.toString('hex')}`;
}

/**
 * Verifica se a senha está correta
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(':');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha256';
  
  const testHash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  return testHash.toString('hex') === key;
}

/**
 * Gera uma chave de API única
 */
export function generateApiKey(): string {
  return `apogeu_${crypto.randomBytes(32).toString('hex')}`;
}

/**
 * Gera um segredo de API
 */
export function generateApiSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Cria credenciais de desenvolvedor
 */
export async function createDeveloperCredentials(
  username: string,
  email: string,
  password: string
): Promise<{ credentials: DeveloperCredentials; plainPassword: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const passwordHash = hashPassword(password);
  const apiKey = generateApiKey();
  const apiSecret = generateApiSecret();
  const id = crypto.randomUUID();

  const credentials: DeveloperCredentials = {
    id,
    username,
    email,
    passwordHash,
    apiKey,
    apiSecret,
    isActive: true,
    createdAt: new Date(),
    lastLogin: null,
    permissions: ['admin', 'developer', 'campaigns', 'analytics', 'users', 'settings'],
    twoFactorEnabled: false,
  };

  // Aqui você salvaria no banco de dados
  // await db.insert(developerCredentials).values(credentials);

  return {
    credentials,
    plainPassword: password,
  };
}

/**
 * Autentica desenvolvedor com username e senha
 */
export async function authenticateDeveloper(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  // Simular busca no banco de dados
  // const db = await getDb();
  // const developer = await db.query.developerCredentials.findFirst({
  //   where: eq(developerCredentials.username, username),
  // });

  // Para este exemplo, usamos credenciais hardcoded
  const storedHash = hashPassword('Gaia@2024#Dev!Secure');
  
  if (!verifyPassword(password, storedHash)) {
    return {
      success: false,
      error: 'Credenciais inválidas',
    };
  }

  const token = generateJWT({
    developerId: 'dev-001',
    username,
    permissions: ['admin', 'developer', 'campaigns', 'analytics', 'users', 'settings'],
  });

  return {
    success: true,
    token,
  };
}

/**
 * Gera um JWT para sessão de desenvolvedor
 */
export function generateJWT(payload: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 86400; // 24 horas

  const payload_with_exp = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(payload_with_exp)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'dev-secret-key')
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64url');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

/**
 * Verifica e decodifica um JWT
 */
export function verifyJWT(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');

    const signature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'dev-secret-key')
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64url');

    if (signature !== signatureEncoded) {
      return {
        valid: false,
        error: 'Assinatura inválida',
      };
    }

    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString());

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return {
        valid: false,
        error: 'Token expirado',
      };
    }

    return {
      valid: true,
      payload,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Token inválido',
    };
  }
}

/**
 * Altera a senha do desenvolvedor
 */
export async function changeDeveloperPassword(
  developerId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar senha antiga
  const storedHash = hashPassword('Gaia@2024#Dev!Secure');
  
  if (!verifyPassword(oldPassword, storedHash)) {
    return {
      success: false,
      error: 'Senha atual incorreta',
    };
  }

  // Validar nova senha
  if (newPassword.length < 12) {
    return {
      success: false,
      error: 'Nova senha deve ter pelo menos 12 caracteres',
    };
  }

  if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
    return {
      success: false,
      error: 'Senha deve conter maiúscula, número e caractere especial',
    };
  }

  // Aqui você atualizaria no banco de dados
  // const newHash = hashPassword(newPassword);
  // await db.update(developerCredentials)
  //   .set({ passwordHash: newHash })
  //   .where(eq(developerCredentials.id, developerId));

  return {
    success: true,
  };
}

/**
 * Regenera a chave de API do desenvolvedor
 */
export async function regenerateApiKey(developerId: string): Promise<string> {
  const newApiKey = generateApiKey();
  
  // Aqui você atualizaria no banco de dados
  // await db.update(developerCredentials)
  //   .set({ apiKey: newApiKey })
  //   .where(eq(developerCredentials.id, developerId));

  return newApiKey;
}

/**
 * Ativa/Desativa autenticação de dois fatores
 */
export async function toggle2FA(
  developerId: string,
  enable: boolean
): Promise<{ success: boolean; secret?: string; error?: string }> {
  if (enable) {
    const secret = crypto.randomBytes(32).toString('hex');
    
    // Aqui você salvaria o segredo no banco de dados
    // await db.update(developerCredentials)
    //   .set({ twoFactorEnabled: true, twoFactorSecret: secret })
    //   .where(eq(developerCredentials.id, developerId));

    return {
      success: true,
      secret,
    };
  } else {
    // Aqui você desativaria 2FA no banco de dados
    // await db.update(developerCredentials)
    //   .set({ twoFactorEnabled: false, twoFactorSecret: null })
    //   .where(eq(developerCredentials.id, developerId));

    return {
      success: true,
    };
  }
}

/**
 * Registra login de desenvolvedor para auditoria
 */
export async function logDeveloperLogin(
  developerId: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  // Aqui você registraria no banco de dados
  // await db.insert(developerAuditLog).values({
  //   developerId,
  //   action: 'LOGIN',
  //   ipAddress,
  //   userAgent,
  //   timestamp: new Date(),
  // });

  console.log(`[AUDIT] Developer ${developerId} logged in from ${ipAddress}`);
}

/**
 * Obtém histórico de logins do desenvolvedor
 */
export async function getDeveloperLoginHistory(
  developerId: string,
  limit: number = 10
): Promise<any[]> {
  // Aqui você buscaria do banco de dados
  // return await db.query.developerAuditLog.findMany({
  //   where: eq(developerAuditLog.developerId, developerId),
  //   orderBy: desc(developerAuditLog.timestamp),
  //   limit,
  // });

  return [];
}

/**
 * Verifica permissões do desenvolvedor
 */
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  return permissions.includes('admin') || permissions.includes(requiredPermission);
}

/**
 * Obtém todas as permissões disponíveis
 */
export function getAvailablePermissions(): string[] {
  return [
    'admin',
    'developer',
    'campaigns:create',
    'campaigns:edit',
    'campaigns:delete',
    'campaigns:view',
    'analytics:view',
    'analytics:export',
    'users:manage',
    'settings:edit',
    'api:access',
    'webhooks:manage',
    'integrations:manage',
  ];
}

