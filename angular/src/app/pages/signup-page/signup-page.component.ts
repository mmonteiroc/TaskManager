import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {AuthService} from '../../auth.service';
import {TaskService} from '../../task.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSignUpClicked(email: string, password: string): void {
    this.authService.signUp(email, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      if (res.status===200){
        this.router.navigate(['/lists']);
      }
    });
  }
}
