import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CountriesComponent } from './countries/countries.component';
import { SettingsComponent } from './settings/settings.component';
import { POComponent } from "app/settings/components/po/po.component";
import { PoPortsComponent } from "app/settings/components/po-ports/po-ports.component";
import { BaseballComponent } from 'app/settings/components/baseball/baseball.component';
import { BulletsComponent } from 'app/settings/components/bullets/bullets.component';
import { CountryListComponent } from "app/country-list/country-list.component";
import { CountryDetailComponent } from "app/country-detail/country-detail.component";
import { CountryMaintComponent } from "app/country-maint/country-maint.component";
import { SignInComponent } from "fw/users/sign-in/sign-in.component";
import { RegisterUserComponent } from "fw/users/register-user/register-user.component";
import { AuthGuard } from './services/auth-guard.service';

export const appRoutes: Routes = [
    { path: 'signin', component: SignInComponent },
    { path: 'register', component: RegisterUserComponent },
    { path: 'authenticated', component: AuthenticatedUserComponent, 
        canActivate: [AuthGuard], 
     //   canActivateChild: [AuthGuard],
      children: [
        { path: '', canActivateChild: [AuthGuard], 
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
        //  { path: 'countries', component: CountriesComponent },
          { path: 'country-list/:count', component: CountryListComponent },
          { path: 'country-detail/:id/:operation', component: CountryDetailComponent },
          { path: 'country-maint', component: CountryMaintComponent },
          { path: 'settings', component: SettingsComponent },

          { path: 'settings/:id', component: SettingsComponent,
            children: [
              { path: '', redirectTo: 'bullets', pathMatch: 'full' },
              { path: 'bullets', component: BulletsComponent },
              { path: 'pos', component: POComponent },
              { path: 'ports', component: PoPortsComponent },
              { path: 'baseball', component: BaseballComponent }
            ]},
        ]},
       ]},
    { path: '', component: SignInComponent },
    { path: '**', component: SignInComponent }
];