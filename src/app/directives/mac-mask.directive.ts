// src/app/directives/mac-mask.directive.ts

import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMacMask]'
})
export class MacMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();

    // Limita a 12 caracteres (6 pares)
    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    // Adiciona os dois pontos a cada 2 caracteres
    const formatted = value.match(/.{1,2}/g)?.join(':') || value;

    event.target.value = formatted;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    let value = event.target.value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();

    // Se tiver menos de 12 caracteres, completa com zeros
    if (value.length > 0 && value.length < 12) {
      value = value.padEnd(12, '0');
    }

    const formatted = value.match(/.{1,2}/g)?.join(':') || value;
    event.target.value = formatted;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (allowedKeys.indexOf(event.key) !== -1) {
      return true;
    }

    // Permite apenas caracteres hexadecimais (0-9, A-F)
    const regex = /^[0-9a-fA-F]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }
}
