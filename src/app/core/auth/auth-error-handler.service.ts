import { inject, Injectable } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import { MultiFactorError } from 'firebase/auth';
import { FirebaseService } from './firebase/firebase.service';

export interface AuthError {
    code: string;
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
}

/**
 * Service to handle Firebase authentication errors and provide user-friendly messages
 */
@Injectable({
    providedIn: 'root',
})
export class AuthErrorHandlerService {
    private _firebaseService = inject(FirebaseService);

    /**
     * Get user-friendly error message from Firebase error
     */
    getErrorMessage(error: FirebaseError | MultiFactorError | any): string {
        if (!error) {
            return 'An unknown error occurred. Please try again.';
        }

        // Use FirebaseService to get the error message
        return this._firebaseService.getFirebaseErrorMessage(error);
    }

    /**
     * Get complete auth error object with type for UI display
     */
    getAuthError(error: FirebaseError | MultiFactorError | any): AuthError {
        if (!error) {
            return {
                code: 'unknown-error',
                message: 'An unknown error occurred. Please try again.',
                type: 'error',
            };
        }

        const code = error.code || 'unknown-error';
        const message = this.getErrorMessage(error);

        // Determine alert type based on error code
        let type: 'error' | 'warning' | 'info' | 'success' = 'error';

        if (code === 'auth/email-not-verified') {
            type = 'info';
        } else if (code === 'auth/too-many-requests') {
            type = 'warning';
        } else if (code === 'auth/multi-factor-auth-required') {
            type = 'info';
        }

        return {
            code,
            message,
            type,
        };
    }

    /**
     * Check if error is a specific Firebase auth error
     */
    isFirebaseError(error: any): error is FirebaseError | MultiFactorError {
        return error && typeof error.code === 'string';
    }

    /**
     * Handle specific auth errors with custom logic
     */
    handleAuthError(error: any): AuthError {
        const authError = this.getAuthError(error);

        // Add custom handling for specific errors
        switch (authError.code) {
            case 'auth/email-not-verified':
                // Email verification is already handled in the auth service
                break;

            case 'auth/multi-factor-auth-required':
                // MFA flow is handled by Firebase2FAService
                break;

            case 'auth/too-many-requests':
                // Could add rate limiting logic here
                break;
        }

        return authError;
    }
}
