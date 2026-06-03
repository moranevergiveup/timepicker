import {
  Component,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,Input
} from '@angular/core';


// import {
//   Component,
//   EventEmitter,
//   Output
// } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { DateRangeService } from './date-range.service';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
// import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-date-range-picker-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="custom-header">

      <!-- YEAR ROW -->
      <div class="year-row">
  <button mat-icon-button (click)="prevMonth()">
    <mat-icon>chevron_left</mat-icon>
  </button>

 <mat-select
  class="year-select"
  panelClass="year-panel"
  [value]="activeYear"
  (selectionChange)="onYearChange($event)">
  <mat-option
    *ngFor="let y of yearList"
    [value]="y"
    [class.current-year]="y === currentYear">
    {{ y }}
  </mat-option>
</mat-select>

  <button mat-icon-button (click)="nextMonth()">
    <mat-icon>chevron_right</mat-icon>
  </button>
</div>

      <!-- MONTH GRID -->
      <div class="month-grid">
   <button
  mat-stroked-button
  *ngFor="let m of months; let i = index"
  [class.selected]="isSelected(i)"
  [class.in-range]="isInRange(i)"
  [style.backgroundColor]="isSelected(i) ? '#1976d2' : 'transparent'"
  [style.color]="isSelected(i) ? '#ffffff' : '#000000'"
  (click)="toggleMonth(i)">
  {{ m }}
</button>
      </div>

    </div>
  `,
  styles: [`
    .custom-header {
      padding: 8px 12px 4px;
      font-family: inherit;
      margin-bottom: 10px;
    }

    .year-row {
      display: flex;
      align-items: center;
      justify-content: center;
     gap: 12px;
      margin-bottom: 12px;
    }

    .year-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    
    }

    .month-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    button {
      text-transform: none;
      font-size: 13px;
      font-weight: 500;
   
    }
      .year-select {
  width: 90px;
  font-size: 15px;
  font-weight: 600;
  padding: 10px;
  

  .mat-mdc-select-arrow {
    display: none;  // hide arrow, looks cleaner next to nav buttons
  }
}
  .year-panel {
  background: #fff;
  max-height: 240px !important;

  .mat-mdc-option {
    font-size: 14px;
    min-height: 36px;
    width: 60px !important;
    justify-content: center;
    text-align: center;
    display: inline-flex !important;
  }

  .mdc-list {
    display: flex !important;
    flex-wrap: wrap !important;
    padding: 8px !important;
    width: 260px;
  }
}
  .year-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;        // ← 10px gap same for all
  margin-bottom: 12px;
}

.year-select {
  width: auto;

  .mat-mdc-select-trigger {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .mat-mdc-select-value {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    width: auto;
  }

  .mat-mdc-select-arrow-wrapper {
    display: none !important;   // ← hides the dropdown arrow
  }
}
  
  
  `],
  imports: [CommonModule, MatButtonModule, MatIconModule,MatSelectModule],
})
export class DateRangePickerHeaderComponent<D> implements OnDestroy {
  private readonly _destroyed = new Subject<void>();
  @Input() range!: FormGroup;
  readonly months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    private dateRangeService: DateRangeService,
    private cdr: ChangeDetectorRef,
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get activeYear(): number {
    return this._dateAdapter.getYear(this._calendar.activeDate);
  }

  get activeMonthIndex(): number {
    return this._dateAdapter.getMonth(this._calendar.activeDate);
  }

  prevYear(): void {
    const current = this._calendar.activeDate;
    this._calendar.activeDate = this._dateAdapter.addCalendarYears(current, -1);
  }

  nextYear(): void {
    const current = this._calendar.activeDate;
    this._calendar.activeDate = this._dateAdapter.addCalendarYears(current, 1);
  }

  // goToMonth(monthIndex: number): void {
  //   const current = this._calendar.activeDate;
  //   this._calendar.activeDate = this._dateAdapter.createDate(
  //     this._dateAdapter.getYear(current),
  //     monthIndex,
  //     1,
  //   );
  //   this._calendar.currentView = 'month';
  // }


 goToMonth(monthIndex: number): void {
  const year = this._dateAdapter.getYear(this._calendar.activeDate);
  const firstDay = this._dateAdapter.createDate(year, monthIndex, 1);
  const daysInMonth = this._dateAdapter.getNumDaysInMonth(firstDay);
  const lastDay = this._dateAdapter.createDate(year, monthIndex, daysInMonth);

  this.dateRangeService.range.setValue({ start: firstDay, end: lastDay });

  this._calendar.activeDate = firstDay;
  this._calendar.currentView = 'month';
}
get yearList(): number[] {
  const minYear = this._calendar.minDate
    ? this._dateAdapter.getYear(this._calendar.minDate)
    : 1900;

  const maxYear = this._calendar.maxDate
    ? this._dateAdapter.getYear(this._calendar.maxDate)
    : 2100;

  return Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i  // smallest → biggest
  );
}

onYearChange(event: MatSelectChange): void {
  this._calendar.activeDate = this._dateAdapter.createDate(
    event.value,
    this._dateAdapter.getMonth(this._calendar.activeDate),
    1
  );
}
readonly currentYear = new Date().getFullYear();
selectedMonths: number[] = [];

isSelected(monthIndex: number): boolean {
  return this.selectedMonths.includes(monthIndex);
}

isInRange(monthIndex: number): boolean {
  if (this.selectedMonths.length !== 2) return false;
  const min = Math.min(this.selectedMonths[0], this.selectedMonths[1]);
  const max = Math.max(this.selectedMonths[0], this.selectedMonths[1]);
  return monthIndex > min && monthIndex < max;
}

toggleMonth(monthIndex: number): void {
  if (this.selectedMonths.includes(monthIndex)) {
    this.selectedMonths = this.selectedMonths.filter(m => m !== monthIndex);
    this.updateRange(); // ← was: this.dateRangeService.range.setValue({ start: null, end: null });
    this.cdr.markForCheck();
    return;
  }

  if (this.selectedMonths.length < 2) {
    this.selectedMonths.push(monthIndex);
  } else {
    this.selectedMonths = [this.selectedMonths[0], monthIndex];
  }

  this.updateRange();
  this.cdr.markForCheck();
}
updateRange(): void {
  const year = this._dateAdapter.getYear(this._calendar.activeDate);

  if (this.selectedMonths.length === 1) {
    // single month → set start and end to full month
    const month = this.selectedMonths[0];
    const firstDay = this._dateAdapter.createDate(year, month, 1);
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(firstDay);
    const lastDay = this._dateAdapter.createDate(year, month, daysInMonth);

    this.dateRangeService.range.setValue({ start: firstDay, end: lastDay });
    this._calendar.activeDate = firstDay;
    this._calendar.currentView = 'month';
    return;
  }

  if (this.selectedMonths.length === 2) {
    const sorted = [...this.selectedMonths].sort((a, b) => a - b);

    const firstDay = this._dateAdapter.createDate(year, sorted[0], 1);
    const daysInLastMonth = this._dateAdapter.getNumDaysInMonth(
      this._dateAdapter.createDate(year, sorted[1], 1)
    );
    const lastDay = this._dateAdapter.createDate(year, sorted[1], daysInLastMonth);

    this.dateRangeService.range.setValue({ start: firstDay, end: lastDay });
    this._calendar.activeDate = firstDay;
    this._calendar.currentView = 'month';
    return;
  }

  this.dateRangeService.range.setValue({ start: null, end: null });
}
readonly monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

prevMonth(): void {
  this._calendar.activeDate = this._dateAdapter.addCalendarMonths(
    this._calendar.activeDate, -1
  );
  this.cdr.markForCheck();
}

nextMonth(): void {
  this._calendar.activeDate = this._dateAdapter.addCalendarMonths(
    this._calendar.activeDate, 1
  );
  this.cdr.markForCheck();
}
}
