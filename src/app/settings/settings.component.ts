import { ScreenService } from './../../fw/services/screen.service';
// import {Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Directive, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';

import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-settings',
  template: `
  <nav>
      <a [routerLink]="['bullets']">Bullets</a>
      <a [routerLink]="['pos']">POs</a>
      <a [routerLink]="['ports']">Ports</a>
      <a [routerLink]="['baseball']">Baseball</a>
  </nav>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['settings.component.css'],

})
export class SettingsComponent  implements OnInit {
  private screenSubscription: Subscription;
  constructor(
    screenService: ScreenService) {

      this.screenSubscription = screenService.resize$.subscribe(() => this.onResize());
  }

  ngOnInit() {
  }
  ngOnDestroy() {
      this.screenSubscription.unsubscribe();
  }
  onResize() {
  //  console.log('resizing');
  }
}