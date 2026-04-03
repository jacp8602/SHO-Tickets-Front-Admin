import { Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment';
import { initializeApp } from 'firebase/app';
import {
    MultiFactorError,
    MultiFactorResolver,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier,
    User,
    getAuth,
    getMultiFactorResolver,
    multiFactor,
} from 'firebase/auth';
import { Observable, Subject, catchError, from, map, throwError } from 'rxjs';

export interface TwoFactorChallenge {
    resolver: MultiFactorResolver;
    verificationId: string;
}

@Injectable({
    providedIn: 'root',
})
export class Firebase2FAService {
    private app = initializeApp(environment.firebaseConfig);
    private auth = getAuth(this.app);
    private _recaptchaVerifier: Subject<RecaptchaVerifier> =
        new Subject<RecaptchaVerifier>();
    
    // Store recaptcha verifier instance
    private recaptchaVerifierInstance: RecaptchaVerifier | null = null;

    set recaptchaVerifier(value: RecaptchaVerifier) {
        this.recaptchaVerifierInstance = value;
        this._recaptchaVerifier.next(value);
    }

    get recaptchaVerifier$(): Observable<RecaptchaVerifier> {
        return this._recaptchaVerifier.asObservable();
    }

    /**
     * Get current recaptcha verifier instance
     */
    getRecaptchaVerifier(): RecaptchaVerifier | null {
        return this.recaptchaVerifierInstance;
    }

    private _twoFactorChallenge = signal<TwoFactorChallenge | null>(null);

    // ----------------------------------------------------------------------
    // @ Enrollment methods
    // ----------------------------------------------------------------------

    /**
     * Enroll MFA by sending SMS to phone number
     * @param user - Firebase user
     * @param phoneNumber - Phone number in E.164 format (e.g., +1234567890)
     * @param recaptchaVerifier - ReCAPTCHA verifier instance
     */
    enrollMfaSendSms(
        user: User,
        phoneNumber: string,
        recaptchaVerifier: RecaptchaVerifier
    ): Observable<string> {
        const mfaUser = multiFactor(user);

        return new Observable<string>((observer) => {
            mfaUser.getSession().then(async (multiFactorSession) => {
                const phoneInfoOptions = {
                    phoneNumber: phoneNumber,
                    session: multiFactorSession,
                };

                const provider = new PhoneAuthProvider(this.auth);

                provider
                    .verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
                    .then(
                        (verificationId) => {
                            console.log('[Firebase2FAService] SMS sent successfully. Verification ID:', verificationId);
                            observer.next(verificationId);
                            observer.complete();
                        },
                        (error) => {
                            console.error('[Firebase2FAService] Error sending SMS:', error);
                            console.error('[Firebase2FAService] Error code:', error.code);
                            console.error('[Firebase2FAService] Error message:', error.message);
                            observer.error(error);
                        }
                    );
            }).catch((sessionError) => {
                console.error('[Firebase2FAService] Error getting MFA session:', sessionError);
                observer.error(sessionError);
            });
        });
    }

    /**
     * Confirm and finalize MFA enrollment with SMS code
     */
    confirmEnrollMfa(
        user: User,
        verificationId: string,
        smsCode: string
    ): Observable<void> {
        const cred = PhoneAuthProvider.credential(verificationId, smsCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

        const mfaUser = multiFactor(user);
        const mfaName = 'My personal phone number';
        return from(mfaUser.enroll(multiFactorAssertion, mfaName));
    }

    // ----------------------------------------------------------------------
    // @ MFA Auth methods
    // ----------------------------------------------------------------------

    /**
     * Initialize 2FA flow (send SMS)
     */
    start2fa(error: MultiFactorError): Observable<TwoFactorChallenge> {
        try {
            const resolver = getMultiFactorResolver(this.auth, error);
            const phoneInfo = resolver.hints[0];
            const provider = new PhoneAuthProvider(this.auth);
            
            console.log('[Firebase2FAService] Starting 2FA flow');
            console.log('[Firebase2FAService] Resolver:', resolver);
            console.log('[Firebase2FAService] Phone hint:', phoneInfo);
            // console.log('[Firebase2FAService] Phone number:', phoneInfo?.phoneNumber);

            return new Observable<TwoFactorChallenge>((observer) => {
                // Wait for recaptcha verifier to be available
                const subscription = this.recaptchaVerifier$.subscribe({
                    next: (recaptchaVerifier) => {
                        subscription.unsubscribe();
                        
                        if (!recaptchaVerifier) {
                            console.error('[Firebase2FAService] reCAPTCHA verifier not initialized');
                            observer.error(new Error('reCAPTCHA verifier not initialized'));
                            return;
                        }

                        console.log('[Firebase2FAService] reCAPTCHA verifier ready');

                        provider
                            .verifyPhoneNumber(
                                {
                                    multiFactorHint: phoneInfo,
                                    session: resolver.session,
                                },
                                recaptchaVerifier
                            )
                            .then((verificationId) => {
                                console.log('[Firebase2FAService] SMS sent successfully. Verification ID:', verificationId);
                                observer.next({
                                    resolver,
                                    verificationId,
                                });
                                observer.complete();
                            })
                            .catch((err) => {
                                console.error('[Firebase2FAService] Error in verifyPhoneNumber:', err);
                                console.error('[Firebase2FAService] Error code:', err.code);
                                console.error('[Firebase2FAService] Error message:', err.message);
                                observer.error(err);
                            });
                    },
                    error: (err) => {
                        console.error('[Firebase2FAService] Error subscribing to recaptchaVerifier:', err);
                        observer.error(err);
                    },
                });

                // If recaptcha verifier already exists, trigger it immediately
                if (this.recaptchaVerifierInstance) {
                    this._recaptchaVerifier.next(this.recaptchaVerifierInstance);
                }
            }).pipe(
                map((challenge) => {
                    this._twoFactorChallenge.set(challenge);
                    return challenge;
                }),
                catchError((err) => throwError(() => err))
            );
        } catch (err) {
            console.error('[Firebase2FAService] Error starting 2FA:', err);
            return throwError(() => err);
        }
    }

    /**
     * Complete 2FA flow with SMS
     */
    complete2fa(verificationCode: string): Observable<any> {
        if (this._twoFactorChallenge() == null) {
            return throwError(() => new Error('No 2FA challenge found'));
        }

        const verificationId = this._twoFactorChallenge().verificationId;
        const resolver = this._twoFactorChallenge().resolver;

        const cred = PhoneAuthProvider.credential(
            verificationId,
            verificationCode
        );

        const assertion = PhoneMultiFactorGenerator.assertion(cred);

        return from(resolver.resolveSignIn(assertion));
    }
}
