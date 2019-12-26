import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Component } from '@angular/compiler/src/core';
import { AuthService } from '../services/auth.service';
import { get } from 'lodash';

@Injectable()
export class UserMetaResolver implements Resolve<Component> {

    constructor(
        private authService: AuthService
    ) { }

    resolve(): Observable<any> | Promise<any> | any {

        // check if the current user's information is already set in authService
        // otherwise go set it on the authService
        if (get(this.authService, 'userMeta.profile.email') === this.authService.auth.auth.currentUser.email) {
            return;
        }

        return this.authService.getUserMeta(this.authService);

    }
}
