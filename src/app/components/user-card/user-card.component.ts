import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { LoginService } from '../../core/services/login/login.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-user-card',
  imports :[SharedModule,CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  user: any;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

    logout() {
    this.loginService.logout();
    sessionStorage.clear();
  }
}
