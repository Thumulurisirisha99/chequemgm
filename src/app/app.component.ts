import { Component, OnInit } from '@angular/core';
import { ServiceService } from './service/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cequemgt';
  constructor(private authService: ServiceService, private router: Router) { }
  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['login']);
    }
  }
}
