import {Injectable} from '@angular/core';
import {WebRequestService} from './web-request.service';
import {Router} from '@angular/router';
import {shareReplay, tap} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private webService: WebRequestService,
    private router: Router,
    private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // local storage
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    );
  }

  signUp(email: string, password: string): Observable<any> {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // local storage
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    );
  }

  logout(): void {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getNewAccessToken(): Observable<any> {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefrehToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>)=>{
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    );
  }

  /*
  * Private methods
  * */
  private setSession(userId: string, accessToken: string, refreshToken: string): void {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession(): void {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  getAccessToken(): string {
    return localStorage.getItem('access-token');
  }

  setAccessToken(accessToken): void {
    localStorage.setItem('access-token', accessToken);
  }

  getRefrehToken(): string {
    return localStorage.getItem('refresh-token');
  }

  setRefreshToken(accessToken): void {
    localStorage.setItem('refresh-token', accessToken);
  }

  getUserId(): string {
    return localStorage.getItem('user-id');
  }
}
