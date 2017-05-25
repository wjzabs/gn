import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fw-framework-body',
templateUrl: './framework-body.component.html',
  // template: `
  // <div *ngIf="testobject">
  //   testobject.key: {{testobject.key}}  </div>
  // <div>
  //   testobject2.key: {{testobject2.key}}  </div>
  // `,
  styleUrls: ['./framework-body.component.css']
})
export class FrameworkBodyComponent implements OnInit {
   testobject: test;  
   testobject2: test; 
  constructor() { 
  //  this.testobject = {key:"key", value:"value"}
  // this.testobject2 = {key:"key2", value:"value"}
  }

  ngOnInit() {
   //  this.testobject = {key:"key", value:"value"}
    //   this.testobject2 = {key:"key2", value:"value"}
  }
}

export interface test {
  key: string,
  value: string
}