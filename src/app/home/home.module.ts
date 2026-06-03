import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MaskitoDirective } from '@maskito/angular';
import { DateRangePickerComponent } from '../components/date-range-picker/date-range-picker.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
     MaskitoDirective,
     DateRangePickerComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
