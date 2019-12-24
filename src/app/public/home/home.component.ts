import { Component, OnInit, HostBinding, NgZone } from '@angular/core';
import { get, isEmpty } from 'lodash';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserMeta } from '../../shared/models/user.interface'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router
  ) { }

  @HostBinding('attr.class') cls = 'flex-fill';

  ngOnInit() {

    // NOTE: no need to put this in a route guard or parent component
    // because this is only called after IBMId login callback is
    // fired from back-end node.js server.

    // check if firebase user exists
    if (isEmpty(get(this.authService, 'auth.auth.currentUser'))) {

      // user already signed-in so do nothing...

    } else {

      // already logged in so redirect
      this.authService.getUserMeta(this.authService)
        .then((userMeta: IUserMeta) => {
          this.redirect(userMeta);
        });

    }

  }

  /**
   * redirect user to where they have permissions
   *
   * @param {IUser} userProfile
   * @memberof LoginTokenComponent
   */
  redirect(userMeta: IUserMeta) {

    // redirect to private module and component
    this.ngZone.run(() => {
      return this.router.navigate(['/private']);
    });

  }

}
