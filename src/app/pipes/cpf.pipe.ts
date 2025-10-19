// src/app/pipes/cpf.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../utils/string.utils';

@Pipe({
  name: 'cpf'
})
export class CpfPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return StringUtils.maskCPF(value);
  }
}
