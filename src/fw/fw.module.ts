import { DynamicFormComponent } from 'fw/dynamic-forms/dynamic-form/dynamic-form.component';
import { DynamicFieldComponent } from 'fw/dynamic-forms/dynamic-field/dynamic-field.component';
import { RegisterUserComponent } from 'fw/users/register-user/register-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from 'fw/users/sign-in/sign-in.component';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from 'fw/menus/menu-item/menu-item.component';
import { MenuComponent } from 'fw/menus/menu/menu.component';
import { ScreenService } from './services/screen.service';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { FrameworkConfigService } from './services/framework-config.service';
import { TitleBarComponent } from 'fw/title-bar/title-bar.component';
import { ContentComponent } from 'fw/content/content.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkBodyComponent } from "fw/framework-body/framework-body.component";
import { ScreenLarge } from "fw/directives/screen.large.directive";
import { ScreenBelowLarge } from "fw/directives/screen-below-large.directive";
import { MenuService } from "fw/services/menu.service";
import { PopupMenuComponent } from "fw/menus/popup-menu/popup-menu.component";
import { PanelComponent } from "fw/panels/panel/panel.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [
    FrameworkBodyComponent,
    ContentComponent,
    TitleBarComponent,
    TopBarComponent,
    StatusBarComponent,
    ScreenLarge,
    ScreenBelowLarge,
    MenuComponent,
    MenuItemComponent,
    PopupMenuComponent,
    SignInComponent,
    RegisterUserComponent,
    DynamicFormComponent,
    DynamicFieldComponent,
    PanelComponent
    ],
  providers: [
    FrameworkConfigService,
    ScreenService,
    MenuService
    ],
  exports: [
    FrameworkBodyComponent,
    DynamicFormComponent,
    PanelComponent,
    ScreenLarge,
    ScreenBelowLarge
  ]
})
export class FwModule { }
