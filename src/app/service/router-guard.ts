import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class RouterGuard implements CanActivate {

    constructor(public router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let nama = sessionStorage.getItem('userName');
        if(nama!=null){
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}