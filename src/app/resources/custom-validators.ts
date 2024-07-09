import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
    // validate text fields with white spaces
    static checkForWhiteSpace(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const isWhitespace = control?.value?.includes(' ');
            return isWhitespace ? { 'whitespace': true } : null;
        };
    }

    // checks for special characters excpet for hyphens due to hyphenated names
    static checkSpecialCharacters(control: AbstractControl): ValidationErrors | null {
        const value: string = control.value;
        const pattern: RegExp = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;

        const specialCharacter = pattern.test(value)

        return specialCharacter ? { 'specialChar': true } : null;
    }

    // validate password
    static passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');

        // Check if both fields have values and if they match
        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            return { 'passwordMismatch': true };
        }

        return null; // Return null if validation passes
    }

}