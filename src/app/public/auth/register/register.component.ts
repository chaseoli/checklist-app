import { Component, OnInit, HostBinding, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { get, isEmpty } from 'lodash';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserMeta } from '../../shared/models/user.interface'

interface IRegisterForm {
  email: string
  password: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public showPasswordBlock = false;
  public registerAttemptInProgress = false;
  public registerErrorNotification: {
    type: string
    title: string
    message: string
    showClose: boolean
  };
  public registerForm: FormGroup;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) {

    this.registerForm = this.formBuilder.group({
      email: '',
      password: ''
    });

  }

  @HostBinding('attr.class') cls = 'flex-fill';

  ngOnInit() {

    // check if firebase user exists
    if (!isEmpty(get(this.authService, 'auth.auth.currentUser'))) {
      this.redirect();
    }

  }

  onSubmit(formData: IRegisterForm) {

    this.registerAttemptInProgress = true

    console.log('formData', formData);

    this.authService.registerEmailPassword(formData.email, formData.password)
      .then(() => {
        
        this.redirect();

        // this.registerForm.reset();
        // this.registerAttemptInProgress = false;
        // this.showPasswordBlock = false;

      }, (errorMsg) => {

        this.registerAttemptInProgress = false;
        this.showPasswordBlock = false;
        this.registerErrorNotification = {
          type: 'error',
          title: 'Sign up failed',
          message: errorMsg,
          showClose: false
        };

      })

  }

  redirect() {
    // user already logged in so redirect      
    this.router.navigate(['/private']);
  }

}
