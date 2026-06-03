// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-home',
// //   templateUrl: 'home.page.html',
// //   styleUrls: ['home.page.scss'],
// //   standalone: false,
// // })
// // export class HomePage {

// //   form = {
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     phone: '',
// //     gender: '',
// //     dob: '',
// //     address: '',
// //   };

// //   dd = '';
// //   mm = '';
// //   yyyy = '';
// //   activeSegment: 'dd' | 'mm' | 'yyyy' = 'dd';

// //   onDateInput(event: any) {
// //   const input = event.target;
// //   const raw = input.value.replace(/[^0-9]/g, '').slice(0, 8);

// //   let dd   = raw.slice(0, 2);
// //   let mm   = raw.slice(2, 4);
// //   let yyyy = raw.slice(4, 8);

// //   if (dd.length === 2 && parseInt(dd) > 31) dd = '31';
// //   if (dd.length === 2 && parseInt(dd) === 0) dd = '01';
// //   if (mm.length === 2 && parseInt(mm) > 12)  mm = '12';
// //   if (mm.length === 2 && parseInt(mm) === 0)  mm = '01';

// //   let formatted = dd;
// //   if (dd.length === 2)  formatted += '/';
// //   if (mm)               formatted += mm;
// //   if (mm.length === 2)  formatted += '/';
// //   if (yyyy)             formatted += yyyy;

// //   this.form.dob      = formatted;
// //   this.dd            = dd;
// //   this.mm            = mm;
// //   this.yyyy          = yyyy;
// //   input.value        = formatted;

// //   const len = raw.length;
// //   if (len < 2)      this.activeSegment = 'dd';
// //   else if (len < 4) this.activeSegment = 'mm';
// //   else              this.activeSegment = 'yyyy';
// // }

// // // add this new method
// // onDateKeydown(event: KeyboardEvent) {
// //   if (event.key === 'Backspace') {
// //     const input = event.target as HTMLInputElement;
// //     const val = input.value;

// //     // if ends with / remove the slash AND the digit before it
// //     if (val.endsWith('/')) {
// //       event.preventDefault();
// //       const newVal = val.slice(0, -2); // remove e.g. "15/" → "1"
// //       input.value = newVal;
// //       this.onDateInput({ target: input });
// //     }
// //   }
// // }

// //   onSave() {
// //     console.log('form value:', this.form);
// //   }

// //   onCancel() {
// //     this.form = { firstName: '', lastName: '', email: '', phone: '', gender: '', dob: '', address: '' };
// //     this.dd = ''; this.mm = ''; this.yyyy = '';
// //   }
// //   showResult = false;

// // showDate() {
// //   this.showResult = true;
// // }
// // }
// import { Component, Input, OnInit } from '@angular/core';
// import { ModalController } from '@ionic/angular';

// @Component({
//   selector: 'app-date-range-picker',
//   templateUrl: './date-range-picker.component.html',
//   styleUrls: ['./date-range-picker.component.scss'],
//   standalone: false,
// })
// export class DateRangePickerComponent implements OnInit {

//   @Input() fromDate = '';
//   @Input() toDate   = '';

//   today    = new Date();
//   curYear  = new Date().getFullYear();
//   curMonth = new Date().getMonth();

//   startDate: Date | null = null;
//   endDate:   Date | null = null;
//   hovDate:   Date | null = null;

//   months = [
//     'January','February','March','April',
//     'May','June','July','August',
//     'September','October','November','December'
//   ];

//   constructor(private modalCtrl: ModalController) {}

//   ngOnInit() {
//     if (this.fromDate) this.startDate = this.parse(this.fromDate);
//     if (this.toDate)   this.endDate   = this.parse(this.toDate);
//   }

//   parse(str: string): Date {
//     const [d, m, y] = str.split('/');
//     return new Date(+y, +m - 1, +d);
//   }

//   format(date: Date): string {
//     const d = String(date.getDate()).padStart(2, '0');
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     return `${d}/${m}/${date.getFullYear()}`;
//   }

//   get monthLabel() {
//     return `${this.months[this.curMonth]} ${this.curYear}`;
//   }

//   get calDays(): { date: Date | null; empty: boolean }[] {
//     const firstDay = new Date(this.curYear, this.curMonth, 1).getDay();
//     const total    = new Date(this.curYear, this.curMonth + 1, 0).getDate();
//     const days: { date: Date | null; empty: boolean }[] = [];

//     for (let i = 0; i < firstDay; i++)
//       days.push({ date: null, empty: true });

//     for (let d = 1; d <= total; d++)
//       days.push({ date: new Date(this.curYear, this.curMonth, d), empty: false });

//     return days;
//   }

//   prevMonth() {
//     if (this.curMonth === 0) { this.curMonth = 11; this.curYear--; }
//     else this.curMonth--;
//   }

//   nextMonth() {
//     if (this.curMonth === 11) { this.curMonth = 0; this.curYear++; }
//     else this.curMonth++;
//   }

//   sameDay(a: Date | null, b: Date | null): boolean {
//     return !!a && !!b && a.toDateString() === b.toDateString();
//   }

//   isInRange(date: Date): boolean {
//     const re = this.endDate ?? (
//       this.hovDate && this.startDate && this.hovDate > this.startDate
//         ? this.hovDate : null
//     );
//     return !!(this.startDate && re && date > this.startDate && date < re);
//   }

//   isToday(date: Date): boolean {
//     return this.sameDay(date, this.today);
//   }

//   pickDate(date: Date) {
//     if (!this.startDate || this.endDate || date < this.startDate) {
//       this.startDate = date;
//       this.endDate   = null;
//       this.hovDate   = null;
//     } else if (this.sameDay(date, this.startDate)) {
//       this.startDate = null;
//       this.endDate   = null;
//     } else {
//       this.endDate = date;
//     }
//   }

//   onHover(date: Date) {
//     if (this.startDate && !this.endDate) this.hovDate = date;
//   }

//   clearHover() { this.hovDate = null; }

//   clear() {
//     this.startDate = null;
//     this.endDate   = null;
//     this.hovDate   = null;
//   }

//   apply() {
//     this.modalCtrl.dismiss({
//       fromDate: this.format(this.startDate!),
//       toDate:   this.format(this.endDate!),
//     });
//   }

//   dismiss() { this.modalCtrl.dismiss(); }
// }

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateRangePickerComponent } from '../components/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  fromDate = '';
  toDate   = '';
  selectedRange: any;

onRangeChange(range: any) {
  this.selectedRange = range;

  console.log('Start:', range.start);
  console.log('End:', range.end);
}

  constructor(private modalCtrl: ModalController) {}

  async openDatePicker() {
    const modal = await this.modalCtrl.create({
      component: DateRangePickerComponent,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      handle: true,
      componentProps: {
        fromDate: this.fromDate,
        toDate:   this.toDate,
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.fromDate = data.fromDate;
      this.toDate   = data.toDate;
      console.log('from:', this.fromDate);
      console.log('to:',   this.toDate);
    }
  }

  get triggerLabel(): string {
    if (this.fromDate && this.toDate)
      return `${this.fromDate}  →  ${this.toDate}`;
    return 'Select date range';
  }
  showPicker = false;

// startDate: string = '';
// endDate: string = '';

confirmDateRange() {

  console.log('Start:', this.startDate);
  console.log('End:', this.endDate);

  // Example API call
  // this.loadData(this.startDate, this.endDate);

}
showRangePicker = false;
  startDate: string | null = null;
  endDate: string | null = null;

  toggleRangePicker() {
    this.showRangePicker = !this.showRangePicker;
  }

  confirmRange() {
    console.log('Start:', this.startDate, 'End:', this.endDate);
    // You can emit these values to parent or use them in API calls
  }
}