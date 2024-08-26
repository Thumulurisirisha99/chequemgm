import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private service: ServiceService, private router: Router) { }

    canActivate(): boolean {
        if (this.service.isLoggedIn() && this.service.isAdmins()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}

