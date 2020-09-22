import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {empty, Observable, Subject, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  refreshingAccessToken: boolean;
  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = this.addAuthHeader(req);
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);

        if (err.status === 401) {
          // Refresh token and if fails logout
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              req = this.addAuthHeader(req);
              return next.handle(req);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authService.logout();
              return empty();
            })
          );
        }
        return throwError(err);
      }));
  }

  refreshAccessToken(): Observable<any> {
    if (this.refreshingAccessToken) {
      return new Observable(observer =>{
        this.accessTokenRefreshed.subscribe(()=>{
          // THIS CODE RUN WHEN ACCESS TOKEN HAS BEN REFRESHED
          observer.next();
          observer.complete();
        });
      });
    }else {
      this.refreshingAccessToken = true;
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          this.refreshingAccessToken = false;
          console.log('Token refreshed');

          this.accessTokenRefreshed.next();
        })
      );
    }
  }

  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    // GET ACCCESS TOKEN
    const token = this.authService.getAccessToken();
    if (token) {
      return req.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return req;
  }


}
