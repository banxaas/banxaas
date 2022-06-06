// import {
//     AbstractControl,
//     ValidatorFn,
//     FormControl,
//     FormGroup
//   } from '@angular/forms';
  
//   export class CustomValidators {
//     constructor() {}
  
//     static onlyChar(): ValidatorFn {
//       return (control: AbstractControl): { [key: string]: boolean } | null => {
//         if (control.value == '') return null;
  
//         let re = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$');
//         if (re.test(control.value)) {
//           return null;
//         } else {
//           return { onlyChar: true };
//         }
//       };
//     }
//     static mustMatch(controlName: string, matchingControlName: string) {
//       return (formGroup: FormGroup) => {
//         const control = formGroup.controls[controlName];
//         const matchingControl = formGroup.controls[matchingControlName];
  
//         if (matchingControl.errors && !matchingControl.errors.mustMatch) {
//           return;
//         }
  
//         // set error on matchingControl if validation fails
//         if (control.value !== matchingControl.value) {
//           matchingControl.setErrors({ mustMatch: true });
//         } else {
//           matchingControl.setErrors(null);
//         }
//         return null;
//       };
//     }
//   }
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}