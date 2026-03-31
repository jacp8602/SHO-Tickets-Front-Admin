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

    set recaptchaVerifier(value: RecaptchaVerifier) {
        this._recaptchaVerifier.next(value);
    }

    get recaptchaVerifier$(): Observable<RecaptchaVerifier> {
        return this._recaptchaVerifier.asObservable();
    }

    private _twoFactorChallenge = signal<TwoFactorChallenge | null>(null);

    // ----------------------------------------------------------------------
    // @ Enrollment methods
    // ----------------------------------------------------------------------

    /**
     * Enroll MFA by sending SMS to phone number
     */
    enrollMfaSendSms(
        user: User,
        phoneNumber: string,
        recaptchaVerifier: RecaptchaVerifier
    ): Observable<string> {
        const mfaUser = multiFactor(user);

        const observer = new Observable<string>((observer) => {
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
                            observer.next(verificationId);
                            observer.complete();
                        },
                        (error) => {
                            console.log(error);
                            observer.error(error);
                        }
                    );
            });
        });

        return observer;
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

            return new Observable<TwoFactorChallenge>((observer) => {
                this.recaptchaVerifier$.subscribe({
                    next: (recaptchaVerifier) => {
                        if (!recaptchaVerifier) {
                            observer.error(new Error('reCAPTCHA verifier not initialized'));
                            return;
                        }

                        provider
                            .verifyPhoneNumber(
                                {
                                    multiFactorHint: phoneInfo,
                                    session: resolver.session,
                                },
                                recaptchaVerifier
                            )
                            .then((verificationId) => {
                                observer.next({
                                    resolver,
                                    verificationId,
                                });
                                observer.complete();
                            })
                            .catch((err) => {
                                console.error('Error in verifyPhoneNumber:', err);
                                observer.error(err);
                            });
                    },
                    error: (err) => {
                        console.error('Error subscribing to recaptchaVerifier:', err);
                        observer.error(err);
                    },
                });
            }).pipe(
                map((challenge) => {
                    this._twoFactorChallenge.set(challenge);
                    return challenge;
                }),
                catchError((err) => throwError(() => err))
            );
        } catch (err) {
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
