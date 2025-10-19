// src/app/pipes/date-br.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date.utils';

@Pipe({
  name: 'dateBr'
})
export class DateBrPipe implements PipeTransform {
  transform(value: string | undefined): string {
    return DateUtils.formatToBrazilian(value);
  }
}
