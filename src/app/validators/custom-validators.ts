import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
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

  /**
   * Validador de telefone internacional com detecção automática de país
   *
   * Exemplos de uso:
   * - 5548988594826 → Detecta Brasil (+55) e valida
   * - 14155552671 → Detecta EUA (+1) e valida
   * - 351912345678 → Detecta Portugal (+351) e valida
   *
   * @returns ValidatorFn
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      let phoneValue = control.value.toString().trim();

      // Remove todos os caracteres não numéricos
      const numbersOnly = phoneValue.replace(/\D/g, '');

      // Precisa ter pelo menos 8 dígitos
      if (numbersOnly.length < 8) {
        return {
          phoneInvalid: {
            message: 'Telefone muito curto',
            details: 'Digite o código do país + número (ex: 5548988594826)'
          }
        };
      }

      // Adiciona o + no início se não tiver
      const phoneWithPlus = numbersOnly.startsWith('+') ? numbersOnly : `+${numbersOnly}`;

      try {
        // Tenta validar o número internacionalmente (sem especificar país)
        if (isValidPhoneNumber(phoneWithPlus)) {
          // Parse para obter informações detalhadas
          const phoneNumber = parsePhoneNumber(phoneWithPlus);

          return null; // Número válido!
        }

        // Se não for válido internacionalmente, tenta como número brasileiro
        if (numbersOnly.length >= 10 && numbersOnly.length <= 11) {
          const brPhone = `+55${numbersOnly}`;
          if (isValidPhoneNumber(brPhone)) {
            return null;
          }
        }

        // Tenta identificar qual país poderia ser
        try {
          const phoneNumber = parsePhoneNumber(phoneWithPlus);
          return {
            phoneInvalid: {
              message: `Número inválido para ${phoneNumber.country || 'o país detectado'}`,
              details: `Formato esperado: código do país + DDD + número`
            }
          };
        } catch {
          return {
            phoneInvalid: {
              message: 'Número de telefone inválido',
              details: 'Digite com código do país (ex: 5548988594826 para Brasil)'
            }
          };
        }

      } catch (error) {
        return {
          phoneInvalid: {
            message: 'Formato de telefone inválido',
            details: 'Digite apenas números com código do país (ex: 5548988594826)'
          }
        };
      }
    };
  }

  /**
   * Validador alternativo mais permissivo (apenas verifica comprimento)
   */
  static phoneFlexible(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneNumbers = StringUtils.onlyNumbers(control.value);

      if (phoneNumbers.length < 8 || phoneNumbers.length > 15) {
        return {
          phoneInvalid: {
            message: 'Telefone deve ter entre 8 e 15 dígitos'
          }
        };
      }

      return null;
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
