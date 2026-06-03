

import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  DateAdapter,
} from '@angular/material/core';

import {
  MatMomentDateModule,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';

import { MatIconModule } from '@angular/material/icon';
import { DateRangePickerHeaderComponent } from './date-range-picker-header.component';
import * as moment from 'moment';
import { DateRangeService } from './date-range.service';

export const APP_DATE_FORMATS = {

  parse: {
    dateInput: 'DD/MM/YYYY',
  },

  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },

};

@Component({
  selector: 'app-date-range-picker',

  standalone: true,

  templateUrl: './date-range-picker.component.html',

  styleUrls: ['./date-range-picker.component.scss'],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    MatIconModule,
    DateRangePickerHeaderComponent,
  ],

  providers: [

    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB',
    },

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [
        MAT_DATE_LOCALE,
        MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ],
    },

    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },

  ],

})
export class DateRangePickerComponent {
readonly customHeader = DateRangePickerHeaderComponent;
  @Output()
  rangeChange = new EventEmitter<{
    start: Date | null;
    end: Date | null;
  }>();

  range = new FormGroup({

    start: new FormControl<any>(null),

    end: new FormControl<any>(null),

  });

 constructor(private dateRangeService: DateRangeService) {
  this.range = this.dateRangeService.range;

  this.range.valueChanges.subscribe(value => {
    this.rangeChange.emit({
      start: value.start ? value.start.toDate() : null,
      end: value.end ? value.end.toDate() : null,
    });
  });
}

  // AUTO FORMAT DATE
  formatDateInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    // remove non numbers
    let value = input.value.replace(/\D/g, '');

    // max DDMMYYYY
    value = value.substring(0, 8);

    let formatted = '';

    // DAY
    if (value.length >= 2) {
      formatted += value.substring(0, 2) + '/';
    } else {
      formatted += value;
    }

    // MONTH
    if (value.length >= 4) {
      formatted += value.substring(2, 4) + '/';
    } else if (value.length > 2) {
      formatted += value.substring(2);
    }

    // YEAR
    if (value.length > 4) {
      formatted += value.substring(4);
    }

    input.value = formatted;
  }

  // SMOOTH DELETE
  handleBackspace(event: KeyboardEvent): void {

    const input = event.target as HTMLInputElement;

    if (
      event.key === 'Backspace' &&
      (input.selectionStart === 3 || input.selectionStart === 6)
    ) {

      event.preventDefault();

      const pos = input.selectionStart!;

      input.value =
        input.value.substring(0, pos - 1) +
        input.value.substring(pos);

      setTimeout(() => {
        input.setSelectionRange(pos - 1, pos - 1);
      });
    }
  }
  

  // CLEAR DATE RANGE
  

  clearRange(): void {

    this.range.reset();

    this.rangeChange.emit({
      start: null,
      end: null,
    });

  }
  

}
