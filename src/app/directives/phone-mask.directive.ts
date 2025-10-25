import { Directive, HostListener, ElementRef } from '@angular/core';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {
  private previousValue = '';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove tudo exceto números
    let numbersOnly = value.replace(/\D/g, '');

    // Limita a 15 dígitos
    if (numbersOnly.length > 15) {
      numbersOnly = numbersOnly.substring(0, 15);
    }

    // Formata baseado no comprimento
    let formatted = this.formatPhone(numbersOnly);

    // Atualiza o valor
    input.value = formatted;
    this.previousValue = formatted;

    // Posiciona o cursor
    this.setCursorPosition(input, formatted);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.trim();

    if (!value) return;

    // Ao sair do campo, tenta formatar no formato internacional completo
    try {
      const numbersOnly = value.replace(/\D/g, '');
      const phoneWithPlus = '+' + numbersOnly;

      const phoneNumber = parsePhoneNumber(phoneWithPlus);
      if (phoneNumber.isValid()) {
        // Formata no padrão bonito
        input.value = this.formatPhone(numbersOnly);
      }
    } catch (error) {
      // Mantém o valor atual se não conseguir formatar
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any): void {
    const input = event.target as HTMLInputElement;

    // Ao focar, se estiver vazio, já começa com +
    if (!input.value) {
      input.value = '+';
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Permite: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
      // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Permite: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }

    // Bloqueia + em outras posições que não seja o início
    if (event.key === '+' && input.selectionStart !== 0) {
      event.preventDefault();
      return;
    }

    // Garante que é um número
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
      (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }

  /**
   * Formata o telefone baseado no código do país detectado
   */
  private formatPhone(numbersOnly: string): string {
    if (!numbersOnly) return '';

    // Detecta o país pelos primeiros dígitos
    const countryCode = this.detectCountryCode(numbersOnly);

    switch (countryCode) {
      case '55': // Brasil
        return this.formatBrazilianPhone(numbersOnly);
      case '1': // EUA/Canadá
        return this.formatUSPhone(numbersOnly);
      case '351': // Portugal
        return this.formatPortuguesePhone(numbersOnly);
      case '54': // Argentina
        return this.formatArgentinePhone(numbersOnly);
      default:
        return this.formatGenericPhone(numbersOnly);
    }
  }

  /**
   * Detecta o código do país pelos primeiros dígitos
   */
  private detectCountryCode(numbersOnly: string): string {
    if (numbersOnly.startsWith('55')) return '55';
    if (numbersOnly.startsWith('1')) return '1';
    if (numbersOnly.startsWith('351')) return '351';
    if (numbersOnly.startsWith('54')) return '54';
    if (numbersOnly.startsWith('52')) return '52';
    if (numbersOnly.startsWith('34')) return '34';
    if (numbersOnly.startsWith('44')) return '44';
    if (numbersOnly.startsWith('33')) return '33';
    if (numbersOnly.startsWith('49')) return '49';
    if (numbersOnly.startsWith('39')) return '39';
    return '';
  }

  /**
   * Formata telefone brasileiro: +55 (48) 98859-1509
   */
  private formatBrazilianPhone(numbersOnly: string): string {
    // Remove o código do país (55)
    const withoutCountry = numbersOnly.substring(2);

    if (numbersOnly.length <= 2) {
      return `+${numbersOnly}`;
    } else if (numbersOnly.length <= 4) {
      // +55 (4
      return `+55 (${withoutCountry}`;
    } else if (numbersOnly.length <= 6) {
      // +55 (48) 9
      return `+55 (${withoutCountry.substring(0, 2)}) ${withoutCountry.substring(2)}`;
    } else if (numbersOnly.length <= 10) {
      // +55 (48) 9885-9
      const ddd = withoutCountry.substring(0, 2);
      const firstPart = withoutCountry.substring(2, 6);
      const secondPart = withoutCountry.substring(6);
      return `+55 (${ddd}) ${firstPart}${secondPart ? '-' + secondPart : ''}`;
    } else {
      // +55 (48) 98859-1509
      const ddd = withoutCountry.substring(0, 2);
      const firstPart = withoutCountry.substring(2, 7);
      const secondPart = withoutCountry.substring(7, 11);
      return `+55 (${ddd}) ${firstPart}${secondPart ? '-' + secondPart : ''}`;
    }
  }

  /**
   * Formata telefone americano: +1 (415) 555-2671
   */
  private formatUSPhone(numbersOnly: string): string {
    const withoutCountry = numbersOnly.substring(1);

    if (numbersOnly.length <= 1) {
      return `+${numbersOnly}`;
    } else if (numbersOnly.length <= 4) {
      return `+1 (${withoutCountry}`;
    } else if (numbersOnly.length <= 7) {
      return `+1 (${withoutCountry.substring(0, 3)}) ${withoutCountry.substring(3)}`;
    } else {
      const area = withoutCountry.substring(0, 3);
      const first = withoutCountry.substring(3, 6);
      const second = withoutCountry.substring(6, 10);
      return `+1 (${area}) ${first}${second ? '-' + second : ''}`;
    }
  }

  /**
   * Formata telefone português: +351 912 345 678
   */
  private formatPortuguesePhone(numbersOnly: string): string {
    const withoutCountry = numbersOnly.substring(3);

    if (numbersOnly.length <= 3) {
      return `+${numbersOnly}`;
    } else if (numbersOnly.length <= 6) {
      return `+351 ${withoutCountry}`;
    } else if (numbersOnly.length <= 9) {
      return `+351 ${withoutCountry.substring(0, 3)} ${withoutCountry.substring(3)}`;
    } else {
      return `+351 ${withoutCountry.substring(0, 3)} ${withoutCountry.substring(3, 6)} ${withoutCountry.substring(6, 9)}`;
    }
  }

  /**
   * Formata telefone argentino: +54 9 11 2345-6789
   */
  private formatArgentinePhone(numbersOnly: string): string {
    const withoutCountry = numbersOnly.substring(2);

    if (numbersOnly.length <= 2) {
      return `+${numbersOnly}`;
    } else if (numbersOnly.length <= 3) {
      return `+54 ${withoutCountry}`;
    } else if (numbersOnly.length <= 5) {
      return `+54 ${withoutCountry.substring(0, 1)} ${withoutCountry.substring(1)}`;
    } else if (numbersOnly.length <= 9) {
      return `+54 ${withoutCountry.substring(0, 1)} ${withoutCountry.substring(1, 3)} ${withoutCountry.substring(3)}`;
    } else {
      const mobile = withoutCountry.substring(0, 1);
      const area = withoutCountry.substring(1, 3);
      const first = withoutCountry.substring(3, 7);
      const second = withoutCountry.substring(7, 11);
      return `+54 ${mobile} ${area} ${first}${second ? '-' + second : ''}`;
    }
  }

  /**
   * Formato genérico para outros países: +XX XXX XXX XXXX
   */
  private formatGenericPhone(numbersOnly: string): string {
    if (numbersOnly.length <= 2) {
      return `+${numbersOnly}`;
    } else if (numbersOnly.length <= 5) {
      return `+${numbersOnly.substring(0, 2)} ${numbersOnly.substring(2)}`;
    } else if (numbersOnly.length <= 8) {
      return `+${numbersOnly.substring(0, 2)} ${numbersOnly.substring(2, 5)} ${numbersOnly.substring(5)}`;
    } else {
      return `+${numbersOnly.substring(0, 2)} ${numbersOnly.substring(2, 5)} ${numbersOnly.substring(5, 8)} ${numbersOnly.substring(8, 12)}`;
    }
  }

  /**
   * Posiciona o cursor no final do texto
   */
  private setCursorPosition(input: HTMLInputElement, value: string): void {
    setTimeout(() => {
      const length = value.length;
      input.setSelectionRange(length, length);
    }, 0);
  }
}
