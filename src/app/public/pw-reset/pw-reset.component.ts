
import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { get, isEmpty } from 'lodash';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

interface IResetForm {
  email: string
  password: string
}

@Component({
  selector: 'app-pw-reset',
  templateUrl: './pw-reset.component.html',
  styleUrls: ['./pw-reset.component.scss']
})
export class PwResetComponent implements OnInit {

  public resetAttemptInProgress = false;
  public emailResetNotification: {
    type: string
    title: string
    message: string
    showClose: boolean
  };
  public resetForm: FormGroup;
  private rememberMe: boolean;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.resetForm = this.formBuilder.group({
      email: '',
    });

  }

  @HostBinding('attr.class') cls = 'flex-fill';

  ngOnInit() {

    // check if firebase user exists
    if (!isEmpty(get(this.authService, 'auth.auth.currentUser'))) {
      this.redirect()
    }

  }

  onSubmit(formData: IResetForm) {

    this.resetAttemptInProgress = true

    console.log('formData', formData);

    this.authService.signInEmailPassword(formData.email, formData.password, this.rememberMe)
      .then(() => {

        this.redirect();

        this.resetForm.reset();
        this.resetAttemptInProgress = false;

        this.emailResetNotification = {
          type: 'success',
          title: 'Email sent',
          showClose: false,
          message: 'A Reset email has been sent to the your inbox, if an account already exists with this email. '
        }

      }, (errorMsg) => {

        this.resetAttemptInProgress = false;

        this.emailResetNotification = {
          type: 'error',
          title: 'reset failed',
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


