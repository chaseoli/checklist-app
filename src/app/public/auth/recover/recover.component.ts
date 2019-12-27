import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

interface IRecoverForm {
  password: string
}

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  public recoverAttemptInProgress = false;
  public notification: {
    type: string
    title: string
    message: string
    showClose: boolean
  };
  public recoverForm: FormGroup;
  private recoveryCode: string;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.recoverForm = this.formBuilder.group({
      password: ''
    });

  }

  @HostBinding('attr.class') cls = 'flex-fill';

  ngOnInit(){
    this.recoveryCode = this.route.snapshot.paramMap.get('code');
    console.log('recovery code: ', this.recoveryCode);
    
  }

  onSubmit(formData: IRecoverForm) {

    this.recoverAttemptInProgress = true

    console.log('formData', formData);

    this.authService.auth.auth.confirmPasswordReset(this.recoveryCode, formData.password)
      .then(() => {
        
        this.redirect();

      }, (errorMsg) => {

        this.recoverForm.reset();

        this.recoverAttemptInProgress = false;
        this.notification = {
          type: 'error',
          title: 'Recovery failed',
          message: errorMsg.msg,
          showClose: false
        };

      })

  }

  redirect() {
    // user already logged in so redirect      
    this.router.navigate(['/private']);
  }
  
}


