import {Component} from '@angular/core';
import {OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import { SocialAuthServiceConfig } from "angularx-social-login";
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [SocialAuthService]
})
export class HomePageComponent implements OnInit{

  signUpForm : FormGroup;
  loginForm: FormGroup;

  emailAlreadyExist: boolean = false;
  nicknameAlreadyExist: boolean = false;
  incorrectEmailPassword: boolean = false;

  user?: SocialUser;
  loggedIn?: boolean;

  constructor(private router: Router, private socialAuthService: SocialAuthService, private authService: AuthService,
              private socketService: SocketService) {
    this.signUpForm = new FormGroup({
      nickname: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[а-яА-ЯёЁa-zA-Z0-9]+$/)
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') && localStorage.getItem('userId')) {
      this.router.navigate(['/profile', localStorage.getItem('userId')]);
    }
  }

  loginSubmit() {
    this.authService.logIn(this.loginForm.value.email, this.loginForm.value.password).subscribe( (responseData) => {
        if (responseData.status == 200) {
          localStorage.setItem('token', responseData.body.token);
          localStorage.setItem('refresh', responseData.body.refresh.token);
          localStorage.setItem('userId', responseData.body.userId);
          this.socketService.initSocket();
          this.router.navigate(['/profile', responseData.body.userId]);
        }
      },
      error =>
      {
        console.log(error);
        if (error.status == 401) {
          this.incorrectEmailPassword = true;
        }
      });
  }

  signupSubmit() {
    this.authService.signUp(this.signUpForm.value.nickname ,this.signUpForm.value.email, this.signUpForm.value.password).subscribe((responseData) => {
        localStorage.setItem('token', responseData.body.token);
        localStorage.setItem('refresh', responseData.body.refresh.token);
        localStorage.setItem('userId', responseData.body.userId);
        if (responseData.status == 200) {
          document.getElementById('close-modal')?.click();
          this.socketService.initSocket();
          this.router.navigate(['/profile', responseData.body.userId]);
        }
      },
      error => {
        console.log(error);
        if (error.status == 409) {
          this.emailAlreadyExist = true;
        }
        if (error.status == 406) {
          this.nicknameAlreadyExist = true;
        }
      });
  }

  authWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.socialAuthService.authState.subscribe((user) => {
          this.user = user;
          this.loggedIn = (user != null);
          this.authService.googleAuth(user.email, user.email, user.provider).subscribe((responseData) => {
              if (responseData.status == 200) {
                localStorage.setItem('token', responseData.body.token);
                localStorage.setItem('refresh', responseData.body.refresh.token);
                localStorage.setItem('userId', responseData.body.userId);
                this.socketService.initSocket();
                this.router.navigate(['/profile', responseData.body.userId]);
              }
            },
            error => console.log(error));
        });
      });
  }

}
