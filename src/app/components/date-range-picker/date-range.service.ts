import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class DateRangeService {
  range = new FormGroup({
    start: new FormControl<any>(null),
    end: new FormControl<any>(null),
  });
}