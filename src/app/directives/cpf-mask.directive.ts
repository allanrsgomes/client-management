import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCpfMask]'
})
export class CpfMaskDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove tudo que não é número
    let numbersOnly = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (numbersOnly.length > 11) {
      numbersOnly = numbersOnly.substring(0, 11);
    }

    // Formata o CPF enquanto digita
    const formatted = this.formatCPF(numbersOnly);

    // Atualiza o valor do input
    input.value = formatted;

    // Posiciona o cursor no final
    this.setCursorPosition(input, formatted);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
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

    // Garante que é um número
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
      (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }

  /**
   * Formata o CPF enquanto digita: 123.456.789-01
   */
  private formatCPF(numbersOnly: string): string {
    if (numbersOnly.length === 0) {
      return '';
    } else if (numbersOnly.length <= 3) {
      // 123
      return numbersOnly;
    } else if (numbersOnly.length <= 6) {
      // 123.456
      return `${numbersOnly.substring(0, 3)}.${numbersOnly.substring(3)}`;
    } else if (numbersOnly.length <= 9) {
      // 123.456.789
      return `${numbersOnly.substring(0, 3)}.${numbersOnly.substring(3, 6)}.${numbersOnly.substring(6)}`;
    } else {
      // 123.456.789-01
      return `${numbersOnly.substring(0, 3)}.${numbersOnly.substring(3, 6)}.${numbersOnly.substring(6, 9)}-${numbersOnly.substring(9, 11)}`;
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
