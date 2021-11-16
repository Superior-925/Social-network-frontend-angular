import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {configDev} from "../environments/environment.dev";
import {HttpHeaders} from "@angular/common/http";
import {OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {responseUserDataAuth} from "../app/interfaces";
import {responseRefreshToken} from "../app/interfaces";
import {responseStatus} from "../app/interfaces";

const httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), observe: 'response'};

@Injectable({providedIn: 'root'})

export class AuthService implements OnInit{

  timerToken: any;

  constructor(private http: HttpClient, private router: Router){ }

  ngOnInit(): void {

  }

  refreshTokens(): Observable<responseRefreshToken> {

    const body = {refreshToken: localStorage.getItem('refresh')};

    let jsonBody = JSON.stringify(body);

    return this.http.post<responseRefreshToken>(`http://${configDev.url}/refresh`, jsonBody, httpOptions);
  }

  signUp(nickname: string, email: string, password: string): Observable<responseUserDataAuth> {

    const body = {email: email, password: password, nickname: nickname};

    let jsonBody = JSON.stringify(body);

    return this.http.post<responseUserDataAuth>(`http://${configDev.url}/signup`, jsonBody, httpOptions);

  };

  logIn(email: string, password: string): Observable<responseUserDataAuth> {
    const body = {email: email, password: password};

    let jsonBody = JSON.stringify(body);

    return this.http.post<responseUserDataAuth>(`http://${configDev.url}/login`, jsonBody, httpOptions);

  };

  googleAuth(nickname: string, email: string, provider: string): Observable<responseUserDataAuth> {

    let body: {} = { nickname: nickname, email: email, provider: provider};
    let jsonBody = JSON.stringify(body);

    return this.http.post<responseUserDataAuth>(`http://${configDev.url}/signup/google`, jsonBody, httpOptions);

  };

  logOut(): Observable<responseStatus> {

    let body: {} = {accessToken: localStorage.getItem('token') as string};

    let jsonBody = JSON.stringify(body);

    let httpOptions: {} = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') as string}), observe: 'response'};

    return this.http.post<responseStatus>(`http://${configDev.url}/logout`, jsonBody, httpOptions);
  }

  startRefresh() {
    this.timerToken = setInterval(() => {
      if (localStorage.getItem('token')) {
        this.refreshTokens().subscribe((responseData) => {
            localStorage.removeItem('refresh');
            localStorage.removeItem('token');

            localStorage.setItem('refresh', responseData.body.refresh.token);
            localStorage.setItem('token', responseData.body.token);
          },
          error =>
          {
            console.log(error);
            if (error.status == 406) {
              this.router.navigate(['/home']);
            }
          }
        )
      }
    }, 180000);
  }

  stopRefresh() {
    clearTimeout(this.timerToken)
  }

}


