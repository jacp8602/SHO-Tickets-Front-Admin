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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
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
        MatProgressSpinnerModule
    ],
})
export class AuthVerificationCodeComponent implements OnInit {
    @ViewChild('verificationCodeNgForm') verificationCodeNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    
    // Formulario principal que ahora incluirá ambos pasos
    verificationForm: UntypedFormGroup;
    showAlert: boolean = false;
    
    // Propiedades para el código de verificación
    codeDigits: string[] = ['', '', '', '', '', ''];
    codeInputs: any[] = [];
    
    // Temporizador (14:59 minutos en segundos = 899 segundos)
    timerSeconds: number = 899; // 14:59
    timerInterval: any;
    timerDisplay: string = '14:59';
    
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {        
        // Crear el formulario combinado
        this.verificationForm = this._formBuilder.group({
            // Campos para el código de verificación
            code: ['', [Validators.required, Validators.minLength(6)]],
        });

        // Inicializar los inputs del código
        this.initializeCodeInputs();
        
        // Iniciar el temporizador
        this.startTimer();
    }
    
    /**
     * Initialize code inputs for template binding
     */
    initializeCodeInputs(): void {
        this.codeInputs = Array(6).fill(0).map((_, i) => ({
            id: `code-${i}`,
            model: this.codeDigits[i]
        }));
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
                this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
        
        // Solo permitir números
        if (value && !/^\d+$/.test(value)) {
            input.value = '';
            return;
        }
        
        // Actualizar el dígito
        this.codeDigits[index] = value;
        
        // Actualizar el valor del formulario
        const fullCode = this.codeDigits.join('');
        this.verificationForm.get('code')?.setValue(fullCode);
        
        // Mover al siguiente input si hay valor
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
        if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
            // Mover al input anterior si está vacío
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
                    
                    // Actualizar el input visualmente
                    const input = document.getElementById(`code-${index}`) as HTMLInputElement;
                    if (input) {
                        input.value = digit;
                    }
                }
            });
            
            // Actualizar el valor del formulario
            const fullCode = this.codeDigits.join('');
            this.verificationForm.get('code')?.setValue(fullCode);
            
            // Enfocar el siguiente input después del pegado
            const nextIndex = Math.min(digits.length, 5);
            const nextInput = document.getElementById(`code-${nextIndex}`);
            if (nextInput) {
                (nextInput as HTMLInputElement).focus();
            }
        }
    }
    
    /**
     * Verify code
     */
    verifyCode(): void {
        if (this.verificationForm.get('code')?.invalid) {
            return;
        }
        
        // Aquí implementarías la lógica de verificación
        console.log('Verificando código:', this.verificationForm.get('code')?.value);
    }
    
    /**
     * Resend code
     */
    resendCode(): void {
        // Reiniciar el temporizador
        clearInterval(this.timerInterval);
        this.timerSeconds = 899; // 14:59
        this.timerDisplay = '14:59';
        this.startTimer();
        
        // Limpiar el código
        this.codeDigits = ['', '', '', '', '', ''];
        this.verificationForm.get('code')?.setValue('');
        
        // Aquí implementarías la lógica para reenviar el código
        // console.log('Reenviando código a:', this.userEmail);
        
        // Mostrar alerta de éxito
        this.alert = {
            type: 'success',
            message: 'A new code has been sent to your email.',
        };
        this.showAlert = true;
        
        // Ocultar alerta después de 3 segundos
        setTimeout(() => {
            this.showAlert = false;
        }, 3000);
    }

    goBack() {
        this.router.navigate(['/sign-in']);
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
