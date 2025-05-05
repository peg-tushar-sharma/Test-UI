import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsService } from './settings.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule

  ],
  providers:[SettingsService]
})
export class SettingsModule { }
