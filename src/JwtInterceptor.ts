import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceService } from './app/service/service.service';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private service: ServiceService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.service.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    username: this.service.getUserName() || '',
                    name: this.service.getName() || '',
                    role: this.service.getRole() || '',

                }
            });
            // this.service.resetSessionTimeout();
        }
        return next.handle(request);
    }
}
