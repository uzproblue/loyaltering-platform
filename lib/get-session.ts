import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getSession() {
  // Ensure NEXTAUTH_SECRET is set
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET is not set in environment variables');
    return null;
  }

  try {
    return await getServerSession(authOptions);
  } catch (error: any) {
    // Handle JWT decryption errors - invalid/expired tokens
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.warn('Session token decryption failed - clearing invalid session');
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

