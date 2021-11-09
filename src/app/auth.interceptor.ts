import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token;

    if (localStorage.getItem('token')) {
      token = localStorage.getItem('token');
    }
    if (!localStorage.getItem('token')) {
      token = 'some token';
    }

      const request = req.clone({
        headers: req.headers.append('Authorization',
          token as string)
      });

    return next.handle(request);
  }
}
