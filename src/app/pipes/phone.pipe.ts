// src/app/pipes/phone.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../utils/string.utils';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return StringUtils.maskPhone(value);
  }
}
