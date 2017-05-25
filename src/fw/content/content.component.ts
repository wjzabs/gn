import { ScreenService } from './../services/screen.service';
import { MenuService } from '../services/menu.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fw-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(
    private menuService: MenuService,
    private screenService: ScreenService) { }

  ngOnInit() {
  }

}
