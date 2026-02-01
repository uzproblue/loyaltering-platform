const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RegisterUserData {
  fullName: string;
  email: string;
  businessName?: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  user?: T;
  error?: string;
  statusCode?: number;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  role: 'admin' | 'user';
}

/**
 * Register a new platform user
 */
export async function registerUser(
  data: RegisterUserData
): Promise<ApiResponse<UserResponse>> {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Registration failed',
        error: result.error || result.message,
        statusCode: response.status,
      };
    }

    return result;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Login a platform user
 */
export async function loginUser(
  data: LoginUserData
): Promise<ApiResponse<UserResponse>> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Login failed',
        error: result.error || result.message,
        statusCode: response.status,
      };
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Request a password reset link for the given email.
 * Calls the platform route which proxies to the server.
 */
export async function requestPasswordReset(email: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Request failed',
        error: result.error || result.message,
        statusCode: response.status,
      };
    }

    return { success: true, message: result.message || '' };
  } catch (error) {
    console.error('Request password reset error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Reset password using the token from the reset email.
 * Calls the platform route which proxies to the server.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Reset failed',
        error: result.error || result.message,
        statusCode: response.status,
      };
    }

    return { success: true, message: result.message || '' };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

