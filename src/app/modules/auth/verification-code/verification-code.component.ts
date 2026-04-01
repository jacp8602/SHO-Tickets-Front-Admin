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
    }

    /**
     * After view init - Initialize reCAPTCHA and start 2FA flow if needed
     */
    ngAfterViewInit(): void {
        // Initialize reCAPTCHA verifier first
        this.initializeRecaptcha();

        // If we have a firebaseError (user with existing MFA), start the 2FA flow
        // after reCAPTCHA is initialized
        if (this.firebaseError && !this.isEnrolling) {
            // Small delay to ensure reCAPTCHA is ready time in seconds
            setTimeout(() => {
                this.start2faFlow();
            }, 1);
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
     * Initialize reCAPTCHA verifier
     */
    initializeRecaptcha(): void {
        const auth = this._firebase2FAService['auth'];

        // Clear any existing reCAPTCHA container
        const existingContainer = document.getElementById('recaptcha-container');
        if (existingContainer) {
            existingContainer.innerHTML = '';
        }

        this._firebase2FAService.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
                size: 'invisible',
                callback: () => {
                    console.log('reCAPTCHA resolved');
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired');
                },
            }
        );
    }

    /**
     * Start 2FA flow for existing MFA users
     */
    start2faFlow(): void {
        if (this.firebaseError) {
            this._firebase2FAService.start2fa(this.firebaseError).subscribe({
                next: (challenge) => {
                    console.log('2FA challenge started', challenge);
                },
                error: (error) => {
                    console.error('Error starting 2FA flow:', error);
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

        this.verifyForm.disable();

        const user: User = this.userData?.user;
        if (!user) {
            this.alert = {
                type: 'error',
                message: 'User not found',
            };
            this.showAlert = true;
            return;
        }

        const recaptchaVerifier = this._firebase2FAService[
            'recaptchaVerifier'
        ] as any as RecaptchaVerifier;

        this._firebase2FAService
            .enrollMfaSendSms(user, this.phoneNumber, recaptchaVerifier)
            .pipe(
                finalize(() => {
                    this.verifyForm.enable();
                })
            )
            .subscribe({
                next: (verificationId) => {
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
                    console.error('Error sending SMS:', error);
                    this.alert = {
                        type: 'error',
                        message: this._firebaseService.getFirebaseErrorMessage(error),
                    };
                    this.showAlert = true;
                },
            });
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
            const recaptchaVerifier = this._firebase2FAService[
                'recaptchaVerifier'
            ] as any as RecaptchaVerifier;

            this._firebase2FAService
                .enrollMfaSendSms(
                    this.userData.user,
                    this.phoneNumber,
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
                        this.alert = {
                            type: 'error',
                            message: this._firebaseService.getFirebaseErrorMessage(error),
                        };
                        this.showAlert = true;
                    },
                });
        } else if (this.firebaseError) {
            // Re-start 2FA flow for existing user
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
