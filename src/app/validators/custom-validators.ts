import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StringUtils } from '../utils/string.utils';

export class CustomValidators {
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const cpfNumbers = StringUtils.onlyNumbers(control.value);

      if (cpfNumbers.length !== 11) {
        return { cpfInvalid: { message: 'CPF deve ter 11 dígitos' } };
      }

      const isValid = StringUtils.isValidCPF(cpfNumbers);
      return isValid ? null : { cpfInvalid: { message: 'CPF inválido' } };
    };
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneNumbers = StringUtils.onlyNumbers(control.value);

      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        return { phoneInvalid: { message: 'Telefone deve ter 10 ou 11 dígitos' } };
      }

      const isValid = StringUtils.isValidPhone(phoneNumbers);
      return isValid ? null : { phoneInvalid: { message: 'Telefone inválido' } };
    };
  }

  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate >= today ? null : { pastDate: { message: 'Data não pode ser no passado' } };
    };
  }

  static minValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      return control.value >= min ? null : {
        minValue: {
          min,
          actual: control.value,
          message: `Valor deve ser maior ou igual a ${min}`
        }
      };
    };
  }
}
