import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseError } from 'firebase/app';
import { MultiFactorError, sendEmailVerification } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { Observable } from 'rxjs';
import { firebaseErrors } from './firebase.config';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    http = inject(HttpClient);
    sanitizer = inject(DomSanitizer);

    constructor() {}

    async getDownloadUrlFromRef(address: string): Promise<string | null> {
        const storage = getStorage();
        const storageRef = ref(storage, address);
        return await getDownloadURL(storageRef)
            .then((downloadUrl) => {
                console.log('[FirebaseService.getDownloadUrlFromRef] Success.');
                console.log(downloadUrl);
                return downloadUrl;
            })
            .catch((error) => {
                console.log(
                    '[FirebaseService.getDownloadUrlFromRef] Error: ',
                    error
                );
                return null;
            });
    }

    // -----------------------------------------------------------------
    // @ Email Related Methods
    // -----------------------------------------------------------------

    sendVerificationEmail(user: any): void {
        sendEmailVerification(user)
            .then(() => {
                console.log('Verification email sent');
            })
            .catch((emailError) => {
                console.error('Error sending verification email:', emailError);
            });
    }

    // -----------------------------------------------------------------
    // @ Url Related Methods
    // -----------------------------------------------------------------

    async getFileFromUrl(url: string): Promise<File | null> {
        return await fetch(url)
            .then((response) => {
                console.log('[FileHandlerService.getFileFromUrl]');
                console.log(response);
                if (!response) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .catch((error) => {
                console.log('Error getting file from url: ', error);
                return null;
            });
    }

    downloadFile(fileUrl: string): Observable<Blob> {
        return this.http.get(fileUrl, { responseType: 'blob' });
    }

    // -----------------------------------------------------------------
    // @ Error Message Transform
    // -----------------------------------------------------------------

    getFirebaseErrorMessage(error: FirebaseError | MultiFactorError): string {
        return (
            firebaseErrors[error.code] ??
            'An unknown error occurred. Please try again or contact support if the issue persists.'
        );
    }
}
