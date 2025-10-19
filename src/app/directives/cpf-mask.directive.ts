// src/app/directives/cpf-mask.directive.ts

import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { StringUtils } from '../utils/string.utils';

@Directive({
  selector: '[appCpfMask]'
})
export class CpfMaskDirective {
  private previousValue: string = '';

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove tudo que não é número
    const numbersOnly = StringUtils.onlyNumbers(value);

    // Limita a 11 dígitos
    const limited = numbersOnly.substring(0, 11);

    // Aplica máscara visual
    const masked = StringUtils.applyCPFMaskWhileTyping(limited);

    // Atualiza o input com a máscara
    input.value = masked;

    // Atualiza o FormControl com apenas números
    if (this.control && this.control.control) {
      // Usa setTimeout para evitar problemas de sincronização
      setTimeout(() => {
        this.control.control?.setValue(limited, { emitEvent: false });
        // Dispara validação
        this.control.control?.updateValueAndValidity({ emitEvent: false });
      });
    }

    this.previousValue = masked;
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.control && this.control.control) {
      const value = this.control.control.value;
      if (value) {
        // Atualiza a exibição com máscara completa
        const input = this.el.nativeElement as HTMLInputElement;
        input.value = StringUtils.maskCPF(value);
      }
      // Força validação ao sair do campo
      this.control.control.markAsTouched();
      this.control.control.updateValueAndValidity();
    }
  }

  @HostListener('focus')
  onFocus(): void {
    if (this.control && this.control.control) {
      const value = this.control.control.value;
      if (value) {
        const input = this.el.nativeElement as HTMLInputElement;
        input.value = StringUtils.maskCPF(value);
      }
    }
  }
}
