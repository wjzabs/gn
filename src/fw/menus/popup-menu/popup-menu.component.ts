import { MenuService, MenuItem } from '../../services/menu.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fw-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css']
})
export class PopupMenuComponent implements OnInit {
  @Input() menu: Array<MenuItem>;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

}
