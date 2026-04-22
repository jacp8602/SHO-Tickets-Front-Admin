import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Firebase2FAService } from 'app/core/auth/firebase/firebase-2fa.service';
import { FirebaseService } from 'app/core/auth/firebase/firebase.service';
import {
    MultiFactorError,
    RecaptchaVerifier,
    User,
    UserCredential,
} from 'firebase/auth';
import { finalize } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
    selector: 'auth-verification-code',
    templateUrl: './verification-code.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        // RouterLink,
    ],
})
export class AuthVerificationCodeComponent implements OnInit, AfterViewInit {
    @ViewChild('verificationCodeNgForm') verificationCodeNgForm: NgForm;
    @ViewChild('recaptchaContainer') recaptchaContainer: any;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    verifyForm: UntypedFormGroup;
    showAlert: boolean = false;

    // Code inputs
    codeDigits: string[] = ['', '', '', '', '', ''];
    codeInputs: any[] = [];

    // User data from navigation
    userData: any = null;
    firebaseError: MultiFactorError | null = null;

    // Flags
    isEnrolling: boolean = false;
    isLoading: boolean = true;

    // Timer
    timerSeconds: number = 899; // 14:59
    timerInterval: any;
    timerDisplay: string = '14:59';

    // Phone number for enrollment
    phoneNumber: string = '';
    showPhoneInput: boolean = false;
    verificationId: string | null = null;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _firebase2FAService: Firebase2FAService,
        private _firebaseService: FirebaseService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.verifyForm = this._formBuilder.group({
            code: ['', [Validators.required, Validators.minLength(6)]],
            phoneNumber: ['', Validators.required],
        });

        // Initialize code inputs
        this.initializeCodeInputs();

        // Get user data from navigation
        const navigation = this._router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.userData = navigation.extras.state['user'];
            this.firebaseError = navigation.extras.state['firebaseError'];
            this.isEnrolling = navigation.extras.state['isEnrolling'] ?? false;

            if (this.userData?.phoneNumber && !this.userData?.mfaEnrolled) {
                this.phoneNumber = this.userData.phoneNumber;
                this.showPhoneInput = false;
            } else if (this.userData?.mfaEnrolled) {
                this.showPhoneInput = false;
            } else {
                this.showPhoneInput = true;
            }
        }

        // Start timer
        this.startTimer();

        this.isLoading = false;
        console.log(this.userData);
    }

    /**
     * After view init - Initialize reCAPTCHA and start 2FA flow if needed
     */
    async ngAfterViewInit(): Promise<void> {
        console.log('[VerificationCode] ngAfterViewInit called');
        
        // Initialize reCAPTCHA verifier first and wait for it to be ready
        await this.initializeRecaptcha();

        // If we have a firebaseError (user with existing MFA), start the 2FA flow
        // now that reCAPTCHA is fully initialized and rendered
        if (this.firebaseError && !this.isEnrolling) {
            console.log('[VerificationCode] Starting 2FA flow after reCAPTCHA ready');
            this.start2faFlow();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Initialize code inputs for template binding
     */
    initializeCodeInputs(): void {
        this.codeInputs = Array(6).fill(0).map((_, i) => ({
            id: `code-${i}`,
            model: this.codeDigits[i],
        }));
    }

    /**
     * Initialize reCAPTCHA verifier and wait for it to be ready
     */
    async initializeRecaptcha(): Promise<void> {
        const auth = this._firebase2FAService['auth'];

        // Clear any existing reCAPTCHA container
        const existingContainer = document.getElementById('recaptcha-container');
        if (existingContainer) {
            existingContainer.innerHTML = '';
        }

        console.log('[VerificationCode] Creating reCAPTCHA verifier...');

        this._firebase2FAService.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
                size: 'invisible',
                callback: (response: any) => {
                    console.log('[VerificationCode] reCAPTCHA resolved:', response);
                },
                'expired-callback': () => {
                    console.log('[VerificationCode] reCAPTCHA expired');
                    this.alert = {
                        type: 'warning',
                        message: 'reCAPTCHA expired. Please try again.',
                    };
                    this.showAlert = true;
                },
                'error-callback': (error: any) => {
                    console.error('[VerificationCode] reCAPTCHA error:', error);
                    this.alert = {
                        type: 'error',
                        message: 'reCAPTCHA verification failed. Please try again.',
                    };
                    this.showAlert = true;
                },
            }
        );
        
        console.log('[VerificationCode] reCAPTCHA verifier created, waiting for render...');
        
        // Wait for reCAPTCHA to be fully rendered and ready
        try {
            await this._firebase2FAService.recaptchaVerifier.render();
            console.log('[VerificationCode] reCAPTCHA verifier is now ready!');
        } catch (error) {
            console.error('[VerificationCode] Error rendering reCAPTCHA:', error);
            this.alert = {
                type: 'error',
                message: 'Failed to initialize reCAPTCHA. Please refresh and try again.',
            };
            this.showAlert = true;
            throw error;
        }
    }

    /**
     * Start 2FA flow for existing MFA users
     */
    start2faFlow(): void {
        if (!this.firebaseError) {
            console.error('[VerificationCode] No firebaseError to start 2FA flow');
            return;
        }

        const recaptchaVerifier = this._firebase2FAService.getRecaptchaVerifier();
        
        // This should not happen anymore since we wait for reCAPTCHA in ngAfterViewInit
        if (!recaptchaVerifier) {
            console.error('[VerificationCode] reCAPTCHA verifier not initialized - this should not happen!');
            this.alert = {
                type: 'error',
                message: 'reCAPTCHA not initialized. Please refresh and try again.',
            };
            this.showAlert = true;
            return;
        }

        console.log('[VerificationCode] Starting 2FA flow...');
        
        this._firebase2FAService.start2fa(this.firebaseError).subscribe({
            next: (challenge) => {
                console.log('[VerificationCode] 2FA challenge started', challenge);
                this.alert = {
                    type: 'success',
                    message: 'Verification code sent to your phone',
                };
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                }, 4000);
            },
            error: (error) => {
                console.error('[VerificationCode] Error starting 2FA flow:', error);
                console.error('[VerificationCode] Error code:', error?.code);
                console.error('[VerificationCode] Error message:', error?.message);
                
                let errorMessage = 'Failed to send verification code. Please try again.';
                
                // Handle specific Firebase error codes
                if (error?.code === 'auth/captcha-check-failed') {
                    errorMessage = 'reCAPTCHA verification failed. Please refresh and try again.';
                } else if (error?.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
                } else if (error?.code === 'auth/invalid-verification-code') {
                    errorMessage = 'Invalid verification code. Please try again.';
                } else if (error?.message) {
                    errorMessage = this._firebaseService.getFirebaseErrorMessage(error);
                }
                
                this.alert = {
                    type: 'error',
                    message: errorMessage,
                };
                this.showAlert = true;
            },
        });
    }

    /**
     * Start the countdown timer
     */
    startTimer(): void {
        this.timerInterval = setInterval(() => {
            if (this.timerSeconds > 0) {
                this.timerSeconds--;
                const minutes = Math.floor(this.timerSeconds / 60);
                const seconds = this.timerSeconds % 60;
                this.timerDisplay = `${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                clearInterval(this.timerInterval);
                this.timerDisplay = '00:00';
            }
        }, 1000);
    }

    /**
     * Handle code input changes
     */
    onCodeInput(event: any, index: number): void {
        const input = event.target;
        const value = input.value;

        // Only allow numbers
        if (value && !/^\d+$/.test(value)) {
            input.value = '';
            return;
        }

        // Update digit
        this.codeDigits[index] = value;

        // Update form value
        const fullCode = this.codeDigits.join('');
        this.verifyForm.get('code')?.setValue(fullCode);

        // Move to next input if has value
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) {
                (nextInput as HTMLInputElement).focus();
            }
        }
    }

    /**
     * Handle keydown events for backspace
     */
    onCodeKeyDown(event: KeyboardEvent, index: number): void {
        if (
            event.key === 'Backspace' &&
            !this.codeDigits[index] &&
            index > 0
        ) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) {
                (prevInput as HTMLInputElement).focus();
            }
        }
    }

    /**
     * Handle paste event for code
     */
    onCodePaste(event: ClipboardEvent): void {
        event.preventDefault();
        const pastedText = event.clipboardData?.getData('text');

        if (pastedText && /^\d+$/.test(pastedText)) {
            const digits = pastedText.slice(0, 6).split('');

            digits.forEach((digit, index) => {
                if (index < 6) {
                    this.codeDigits[index] = digit;

                    const input = document.getElementById(
                        `code-${index}`
                    ) as HTMLInputElement;
                    if (input) {
                        input.value = digit;
                    }
                }
            });

            const fullCode = this.codeDigits.join('');
            this.verifyForm.get('code')?.setValue(fullCode);

            const nextIndex = Math.min(digits.length, 5);
            const nextInput = document.getElementById(`code-${nextIndex}`);
            if (nextInput) {
                (nextInput as HTMLInputElement).focus();
            }
        }
    }

    /**
     * Send SMS for enrollment
     */
    sendSmsForEnrollment(): void {
        if (!this.phoneNumber || this.phoneNumber.length < 10) {
            this.alert = {
                type: 'error',
                message: 'Please enter a valid phone number',
            };
            this.showAlert = true;
            return;
        }

        // Format phone number to E.164 format
        const formattedPhoneNumber = this.formatPhoneNumber(this.phoneNumber);
        
        if (!formattedPhoneNumber) {
            this.alert = {
                type: 'error',
                message: 'Invalid phone number format. Please include country code (e.g., +1 for USA)',
            };
            this.showAlert = true;
            return;
        }

        console.log('[VerificationCode] Sending SMS to:', formattedPhoneNumber);

        this.verifyForm.disable();

        const user: User = this.userData?.user;
        if (!user) {
            this.alert = {
                type: 'error',
                message: 'User not found',
            };
            this.showAlert = true;
            this.verifyForm.enable();
            return;
        }

        const recaptchaVerifier = this._firebase2FAService.getRecaptchaVerifier();
        
        if (!recaptchaVerifier) {
            console.error('[VerificationCode] reCAPTCHA verifier not initialized');
            this.alert = {
                type: 'error',
                message: 'reCAPTCHA not initialized. Please try again.',
            };
            this.showAlert = true;
            this.verifyForm.enable();
            return;
        }

        this._firebase2FAService
            .enrollMfaSendSms(user, formattedPhoneNumber, recaptchaVerifier)
            .pipe(
                finalize(() => {
                    this.verifyForm.enable();
                })
            )
            .subscribe({
                next: (verificationId) => {
                    console.log('[VerificationCode] SMS sent successfully. Verification ID:', verificationId);
                    this.verificationId = verificationId;
                    this.alert = {
                        type: 'success',
                        message: 'Verification code sent to your phone',
                    };
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 3000);
                },
                error: (error) => {
                    console.error('[VerificationCode] Error sending SMS:', error);
                    console.error('[VerificationCode] Error code:', error?.code);
                    console.error('[VerificationCode] Error message:', error?.message);
                    
                    let errorMessage = 'Failed to send SMS. Please try again.';
                    
                    // Handle specific Firebase error codes
                    if (error?.code === 'auth/argument-error') {
                        errorMessage = 'Invalid phone number format. Please use format: +1234567890';
                    } else if (error?.code === 'auth/captcha-check-failed') {
                        errorMessage = 'reCAPTCHA verification failed. Please refresh and try again.';
                    } else if (error?.code === 'auth/too-many-requests') {
                        errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
                    } else if (error?.code === 'auth/quota-exceeded') {
                        errorMessage = 'SMS quota exceeded. Please try again later or contact support.';
                    } else if (error?.message) {
                        errorMessage = this._firebaseService.getFirebaseErrorMessage(error);
                    }
                    
                    this.alert = {
                        type: 'error',
                        message: errorMessage,
                    };
                    this.showAlert = true;
                },
            });
    }

    /**
     * Format phone number to E.164 format
     * @param phoneNumber - Raw phone number input
     * @returns Formatted phone number with country code (e.g., +1234567890) or null if invalid
     */
    private formatPhoneNumber(phoneNumber: string): string | null {
        // Remove all non-digit characters except +
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        
        // If doesn't start with +, assume USA/Canada (+1)
        if (!cleaned.startsWith('+')) {
            // If starts with 1 and length is 11, it's already correct
            if (cleaned.length === 11 && cleaned.startsWith('1')) {
                cleaned = '+' + cleaned;
            } 
            // If length is 10, add +1 prefix
            else if (cleaned.length === 10) {
                cleaned = '+1' + cleaned;
            }
            // If length is 7, it's just local number - can't format properly
            else if (cleaned.length === 7) {
                // Assume USA area code 555 for local numbers (should be handled by UI)
                cleaned = '+1555' + cleaned;
            }
            else {
                return null; // Invalid format
            }
        }
        
        // Validate minimum length for E.164 (at least + and 7-15 digits)
        if (cleaned.length < 8 || cleaned.length > 16) {
            return null;
        }
        
        return cleaned;
    }

    /**
     * Verify code
     */
    verifyCode(): void {
        if (this.verifyForm.get('code')?.invalid) {
            return;
        }

        const smsCode = this.verifyForm.get('code')?.value;

        this.verifyForm.disable();

        if (this.isEnrolling && this.verificationId && this.userData?.user) {
            // Complete enrollment
            this._firebase2FAService
                .confirmEnrollMfa(
                    this.userData.user,
                    this.verificationId,
                    smsCode
                )
                .pipe(
                    finalize(() => {
                        this.verifyForm.enable();
                    })
                )
                .subscribe({
                    next: async () => {
                        // Enrollment successful, get new ID token with 2FA claim
                        const user: User = this.userData.user;
                        const idToken = await user.getIdToken(true);

                        // Send to backend to get JWT
                        this._authService.complete2FaSignIn(idToken).subscribe({
                            next: () => {
                                this._router.navigateByUrl('/example');
                            },
                            error: (error) => {
                                console.error('Error completing sign in:', error);
                                this.alert = {
                                    type: 'error',
                                    message: 'Failed to complete authentication',
                                };
                                this.showAlert = true;
                                this.verifyForm.enable();
                            },
                        });
                    },
                    error: (error) => {
                        console.error('Error enrolling MFA:', error);
                        this.alert = {
                            type: 'error',
                            message: this._firebaseService.getFirebaseErrorMessage(error),
                        };
                        this.showAlert = true;
                        this.verifyForm.enable();
                    },
                });
        } else {
            // Complete existing 2FA verification
            this._firebase2FAService
                .complete2fa(smsCode)
                .pipe(
                    finalize(() => {
                        this.verifyForm.enable();
                    })
                )
                .subscribe({
                    next: async (cred: UserCredential) => {
                        // Get ID token with 2FA claim
                        console.log(cred);
                        const idToken = await cred.user.getIdToken();

                        // Send to backend to get JWT
                        this._authService.complete2FaSignIn(idToken).subscribe({
                            next: () => {
                                this._router.navigateByUrl('/example');
                            },
                            error: (error) => {
                                console.error('Error completing sign in:', error);
                                this.alert = {
                                    type: 'error',
                                    message: 'Failed to complete authentication',
                                };
                                this.showAlert = true;
                            },
                        });
                    },
                    error: (error) => {
                        console.error('Error verifying 2FA:', error);
                        this.alert = {
                            type: 'error',
                            message: this._firebaseService.getFirebaseErrorMessage(error),
                        };
                        this.showAlert = true;
                    },
                });
        }
    }

    /**
     * Resend code
     */
    resendCode(): void {
        console.log('[VerificationCode] Resending code...');
        
        // Reset timer
        clearInterval(this.timerInterval);
        this.timerSeconds = 899;
        this.timerDisplay = '14:59';
        this.startTimer();

        // Clear code
        this.codeDigits = ['', '', '', '', '', ''];
        this.verifyForm.get('code')?.setValue('');

        // Resend SMS
        if (this.isEnrolling && this.userData?.user) {
            const recaptchaVerifier = this._firebase2FAService.getRecaptchaVerifier();
            
            if (!recaptchaVerifier) {
                console.error('[VerificationCode] reCAPTCHA verifier not found for resend');
                this.alert = {
                    type: 'error',
                    message: 'reCAPTCHA not initialized. Please refresh and try again.',
                };
                this.showAlert = true;
                return;
            }

            // Format phone number
            const formattedPhoneNumber = this.formatPhoneNumber(this.phoneNumber);
            
            if (!formattedPhoneNumber) {
                this.alert = {
                    type: 'error',
                    message: 'Invalid phone number format',
                };
                this.showAlert = true;
                return;
            }

            this._firebase2FAService
                .enrollMfaSendSms(
                    this.userData.user,
                    formattedPhoneNumber,
                    recaptchaVerifier
                )
                .subscribe({
                    next: (verificationId) => {
                        this.verificationId = verificationId;
                        this.alert = {
                            type: 'success',
                            message: 'Verification code resent to your phone',
                        };
                        this.showAlert = true;
                        setTimeout(() => {
                            this.showAlert = false;
                        }, 3000);
                    },
                    error: (error) => {
                        console.error('[VerificationCode] Error resending SMS:', error);
                        this.alert = {
                            type: 'error',
                            message: this._firebaseService.getFirebaseErrorMessage(error),
                        };
                        this.showAlert = true;
                    },
                });
        } else if (this.firebaseError) {
            // Re-start 2FA flow for existing user
            console.log('[VerificationCode] Restarting 2FA flow for resend');
            this.start2faFlow();
            this.alert = {
                type: 'success',
                message: 'Verification code resent to your phone',
            };
            this.showAlert = true;
            setTimeout(() => {
                this.showAlert = false;
            }, 3000);
        }
    }

    /**
     * Go back
     */
    goBack(): void {
        this._router.navigateByUrl('/sign-in');
    }

    /**
     * Clean up on destroy
     */
    ngOnDestroy(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}
