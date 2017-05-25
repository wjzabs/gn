import { AuthGuard } from './services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FwModule } from '../fw/fw.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountriesComponent } from './countries/countries.component';
import { SettingsComponent } from './settings/settings.component';
import { RouterModule } from "@angular/router";
import { appRoutes } from './app.routing';
import { SettingsModule } from "app/settings/settings.module";
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryMaintComponent } from './country-maint/country-maint.component';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { UserService } from "app/services/user.service";
import { UserApi } from "fw/users/user-api";


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CountriesComponent,
    SettingsComponent,
    CountryDetailComponent,
    CountryListComponent,
    CountryMaintComponent,
    AuthenticatedUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FwModule,
    RouterModule.forRoot(appRoutes),
    SettingsModule
  ],
  // providers: [FrameworkConfigService],
  providers: [
    UserService,
   //  { provide: UserService, useClass: UserService}
    { provide: UserApi, useExisting: UserService},
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
