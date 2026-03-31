import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Firebase2FAService } from './firebase/firebase-2fa.service';
import { FirebaseService } from './firebase/firebase.service';
import { environment } from 'environments/environment.development';
import { initializeApp, FirebaseError } from 'firebase/app';
import {
    MultiFactorError,
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';
import {
    Observable,
    catchError,
    from,
    of,
    switchMap,
    take,
    throwError,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _firebaseService = inject(FirebaseService);
    private firebaseMfa = inject(Firebase2FAService);

    private app = initializeApp(environment.firebaseConfig);
    private auth = getAuth(this.app);

    private apiUrl = environment.apiUrl;

    // ----------------------------------------------------------------------
    // @ Accessors
    // ----------------------------------------------------------------------

    /**
     * Setter & getter for authentication status
     */
    set isAuthenticated(value: boolean) {
        this._authenticated = value;
    }

    get isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('logged_user');
        return token !== null && user !== null;
    }

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for user
     */
    set user(user: any) {
        localStorage.setItem('logged_user', JSON.stringify(user));
        this._userService.user = user;
    }

    get user(): any {
        const userStr = localStorage.getItem('logged_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // ----------------------------------------------------------------------
    // @ Firebase Methods
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // @ Sign In
    // ----------------------------------------------------------------------

    /**
     * Sign in with Firebase + backend verification
     */
    signInAndSendToken(email: string, password: string): Observable<any> {
        return new Observable((observer) => {
            this.signInFirebase(email, password)
                .pipe(take(1))
                .subscribe({
                    next: async (cred: UserCredential) => {
                        console.log("CRED");
                        const idToken = await cred.user.getIdToken();

                        // Check email verification
                        if (cred.user.emailVerified === false) {
                            this._firebaseService.sendVerificationEmail(
                                this.auth.currentUser
                            );
                            observer.error({
                                code: 'auth/email-not-verified',
                                message:
                                    'Please verify your email before continuing.',
                            });
                            return;
                        }

                        // Send Firebase ID token to backend
                        this.sendIdTokenToBackend(idToken).subscribe({
                            next: (userData) => {
                                this._authenticated = true;
                                observer.next(userData);
                                observer.complete();
                            },
                            error: (error) => observer.error(error),
                        });
                    },
                    error: (error: MultiFactorError) => {
                        console.log(this._firebaseService.getFirebaseErrorMessage(error));
                        // User is already enrolled with MFA
                        if (error.code === 'auth/multi-factor-auth-required') {
                            this._authenticated = true;
                            this.firebaseMfa.start2fa(error).subscribe({
                                error: (err) => observer.error(err),
                            });
                        }
                        observer.error(error);
                    }
                });
        });
    }

    /**
     * Sign in with Firebase
     */
    signInFirebase(email: string, password: string): Observable<any> {
        return from(signInWithEmailAndPassword(this.auth, email, password));
    }

    /**
     * Send Firebase ID token to backend for verification
     */
    sendIdTokenToBackend(idToken: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
        });

        const url = `${this.apiUrl}/auth/verify-login`;
        return this._httpClient.get(url, {
            headers,
        });
    }

    // ----------------------------------------------------------------------
    // @ 2FA
    // ----------------------------------------------------------------------

    /**
     * Complete 2FA sign in and get JWT from backend
     */
    complete2FaSignIn(idToken2fa: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${idToken2fa}`,
            'Content-Type': 'application/json',
        });

        const url = `${this.apiUrl}/auth/get-token-sho`;

        return this._httpClient.post(url, {}, { headers }).pipe(
            switchMap((response: any) => {
                const result = Array.isArray(response) ? response[0] : response;
                this.user = result.user;
                this.accessToken = result.jwt.jwt;
                return of(true);
            }),
            catchError((error) => {
                console.error('Error in method complete2FaSignIn:', error);
                return throwError(() => error);
            })
        );
    }

    // ----------------------------------------------------------------------
    // @ Public methods
    // ----------------------------------------------------------------------

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        if (this.isAuthenticated) {
            return of(true);
        }

        if (!this.accessToken) {
            return of(false);
        }

        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        return of(false);
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('logged_user');
        this._authenticated = false;
        return of(true);
    }

    /**
     * Verify code
     */
    verifyCode(code: string): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/auth/verify-code`, {
            code,
        });
    }

    /**
     * Send verification email
     */
    sendVerificationEmail(user: any): void {
        sendEmailVerification(user)
            .then(() => {
                console.log('Verification email sent');
            })
            .catch((error) => {
                console.error('Error sending verification email:', error);
            });
    }

    /**
     * Forgot password
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/users/forgot-password`, {
            email,
        });
    }

    /**
     * Reset password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${this.apiUrl}/users/change-password`, {
            password,
        });
    }

    /**
     * Sign up
     */
    signUpFirebaseSendIdTokenToBackend(
        email: string,
        password: string
    ): Observable<any> {
        return new Observable((observer) => {
            createUserWithEmailAndPassword(this.auth, email, password)
                .then(async (userCredential) => {
                    sendEmailVerification(userCredential.user);
                    const idToken = await userCredential.user.getIdToken();

                    this.sendIdTokenToBackendSignUp(
                        idToken,
                        userCredential.user.uid!,
                        userCredential.user.email!
                    ).subscribe({
                        next: (res) => {
                            observer.next(res);
                            observer.complete();
                        },
                        error: (error) => {
                            observer.error(error);
                        },
                    });
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    private sendIdTokenToBackendSignUp(
        idToken: string,
        uid: string,
        email: string
    ): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
        });

        return this._httpClient
            .post(
                `${this.apiUrl}/auth/signup-firebase`,
                { uid, email },
                { headers }
            )
            .pipe(
                switchMap(() => of(true)),
                catchError((error) => {
                    console.error('Authentication error.', error);
                    return of(false);
                })
            );
    }
}
