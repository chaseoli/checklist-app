import { Component, OnInit, HostBinding, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { get, isEmpty } from 'lodash';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserMeta } from '../../shared/models/user.interface'

interface ILoginForm {
  email: string
  password: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public showPasswordBlock = false;
  public loginAttemptInProgress = false;
  public loginErrorNotification: {
    type: string
    title: string
    message: string
    showClose: boolean
  };
  public loginForm: FormGroup;
  private rememberMe: boolean;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) {

    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });

  }

  @HostBinding('attr.class') cls = 'flex-fill';

  ngOnInit() {

    // check if firebase user exists
    if (!isEmpty(get(this.authService, 'auth.auth.currentUser'))) {
      this.redirect()
    }

  }

  onRememberMe(event) {
    console.log('event', event);
    this.rememberMe = event.checked;
  }

  onSubmit(formData: ILoginForm) {

    this.loginAttemptInProgress = true

    console.log('formData', formData);

    this.authService.signInEmailPassword(formData.email, formData.password, this.rememberMe)
      .then(() => {

        this.redirect();

        // this.loginForm.reset();
        // this.loginAttemptInProgress = false;
        // this.showPasswordBlock = false;

      }, (errorMsg) => {

        this.loginAttemptInProgress = false;
        this.showPasswordBlock = false;

        this.loginErrorNotification = {
          type: 'error',
          title: 'Login failed',
          showClose: false,
          message: errorMsg
        };

      })

  }

  
  redirect() {
    // user already logged in so redirect      
    this.router.navigate(['/private']);
  }

}
