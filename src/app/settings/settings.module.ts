import { ABSFunctions } from './abs';
import { SettingsService } from 'app/settings/settings.service';
import { BulletsComponent } from 'app/settings/components/bullets/bullets.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POComponent } from "app/settings/components/po/po.component";
import {DataTableModule} from 'primeng/primeng';
import {DataTableModule as DataTableModule2 } from "angular2-datatable";
import { DataFilterPipe }   from 'app/settings/components/po/data-filter.pipe';
import { PoPortsComponent } from 'app/settings/components/po-ports/po-ports.component';
import { BaseballComponent } from 'app/settings/components/baseball/baseball.component';

// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, FormsModule, 
    RouterModule, DataTableModule, DataTableModule2
  ],
  declarations: [
    POComponent, DataFilterPipe,
    BulletsComponent,
    PoPortsComponent,BaseballComponent
    ],
  providers: [
    SettingsService, ABSFunctions
    ],
  exports: [

  ]
})
export class SettingsModule { }
