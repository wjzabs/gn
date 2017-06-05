import { Component, Input, OnInit } from '@angular/core';
import { Country } from "app/view-models/country";

@Component({
  selector: 'app-country-panel',
  templateUrl: './country-panel.component.html',
  styleUrls: ['./country-panel.component.css']
})
export class CountryPanelComponent implements OnInit {

  @Input() country: Country;
  @Input() index = 1;

  constructor() { }

  ngOnInit() {
  }

}
