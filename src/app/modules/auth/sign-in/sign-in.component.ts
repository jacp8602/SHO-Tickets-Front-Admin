import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthErrorHandlerService } from 'app/core/auth/auth-error-handler.service';
import {
    slideInRight,
} from '@fuse/animations/slide';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [fuseAnimations, slideInRight],
    imports: [
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        FuseAlertComponent,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _authErrorHandler: AuthErrorHandlerService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                '',
                [Validators.required, Validators.email],
            ],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in with Firebase + backend verification + 2FA flow
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();
        this.isLoading = true;

        // Hide the alert
        this.showAlert = false;

        // Sign in using Firebase authentication
        console.log(this.signInForm);
        try{
            this._authService.signInAndSendToken(
                this.signInForm.value.email,
                this.signInForm.value.password
            ).subscribe({
                next: (response) => {
                    console.log(response);
                    // Navigate to verify-2fa page
                    this._router.navigate(['/verification-code'], {
                        state: {
                            isEnrolling: false,
                        },
                    });
                },
                error: (error) => {
                    // Handle Firebase MFA required error - redirect to 2FA page
                    if (error?.code === 'auth/multi-factor-auth-required') {
                        // Re-enable the form and hide loading before redirect
                        this.signInForm.enable();
                        this.isLoading = false;

                        this._router.navigate(['/verification-code'], {
                            state: {
                                firebaseError: error,
                                isEnrolling: false,
                            },
                        });
                        return;
                    }

                    // Re-enable the form for other errors
                    this.signInForm.enable();
                    this.isLoading = false;

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Handle email not verified
                    if (error?.code === 'auth/email-not-verified') {
                        const authError = this._authErrorHandler.handleAuthError(error);
                        this.alert = {
                            type: authError.type,
                            message: authError.message,
                        };
                        this.showAlert = true;
                        return;
                    }

                    // Get auth error with user-friendly message
                    const authError = this._authErrorHandler.handleAuthError(error);
                    this.alert = {
                        type: authError.type,
                        message: authError.message || 'Wrong email or password',
                    };

                    // Show the alert
                    this.showAlert = true;
                },
            });
        }catch (error){
            // Get auth error with user-friendly message
            const authError = this._authErrorHandler.handleAuthError(error);
            this.alert = {
                type: authError.type,
                message: authError.message || 'Wrong email or password',
            };

            // Show the alert
            this.showAlert = true;
        }
    }

    togglePasswordVisibility(passwordField: HTMLInputElement) {
        passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    }
}
