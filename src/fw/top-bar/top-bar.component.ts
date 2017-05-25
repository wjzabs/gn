import { UserApi } from 'fw/users/user-api';
import { FrameworkConfigService } from '../services/framework-config.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fw-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(
    private frameworkConfigService: FrameworkConfigService,
    private userApi: UserApi) { }

  ngOnInit() {
  }

  signOut() {
    this.userApi.signOut();
  }

}
