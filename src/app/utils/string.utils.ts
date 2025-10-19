// src/app/utils/string.utils.ts

export class StringUtils {
  /**
   * Normaliza string removendo acentos
   */
  static normalize(str: string | undefined | null): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Remove todos os caracteres não numéricos
   */
  static onlyNumbers(str: string | undefined | null): string {
    if (!str) return '';
    return str.replace(/\D/g, '');
  }

  /**
   * Remove máscara do CPF (retorna apenas números)
   */
  static removeCPFMask(cpf: string): string {
    return this.onlyNumbers(cpf);
  }

  /**
   * Remove máscara do telefone (retorna apenas números)
   */
  static removePhoneMask(phone: string): string {
    return this.onlyNumbers(phone);
  }

  /**
   * Valida CPF
   */
  static isValidCPF(cpf: string): boolean {
    cpf = this.onlyNumbers(cpf);

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  /**
   * Valida telefone brasileiro
   */
  static isValidPhone(phone: string): boolean {
    const cleanPhone = this.onlyNumbers(phone);
    // Aceita: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }

  /**
   * Aplica máscara de CPF (apenas para exibição)
   */
  static maskCPF(value: string | undefined | null): string {
    if (!value) return '';
    const cpf = this.onlyNumbers(value);
    if (cpf.length !== 11) return cpf;

    return cpf
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Aplica máscara de telefone (apenas para exibição)
   */
  static maskPhone(value: string | undefined | null): string {
    if (!value) return '';
    const phone = this.onlyNumbers(value);

    if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  }

  /**
   * Aplica máscara dinamicamente enquanto digita
   */
  static applyCPFMaskWhileTyping(value: string): string {
    const cpf = this.onlyNumbers(value);
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  /**
   * Aplica máscara de telefone dinamicamente enquanto digita
   */
  static applyPhoneMaskWhileTyping(value: string): string {
    const phone = this.onlyNumbers(value);
    if (phone.length <= 10) {
      return phone
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return phone
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  }
}
