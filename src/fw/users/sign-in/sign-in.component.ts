import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserApi } from "fw/users/user-api";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'fw-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  formError: string;
  submitting = false;

  constructor(
    private userApi: UserApi, 
    private router: Router) { }

  onSubmit (signInForm: NgForm) {
    if (signInForm.valid) {

      console.log('submitting...', signInForm);
      this.submitting = true;
      this.formError = null;

      this.userApi.signIn(
        signInForm.value.username,
        signInForm.value.password, 
        signInForm.value.rememberMe)
        .subscribe((data) => {
          console.log('got valid: ', data);
          this.router.navigate(['/authenticated']);
        },
        (err)=> {
          this.submitting = false;
          console.log('got error: ', err);
          this.formError = err;
        });
    }
  }

  ngOnInit() {
  }

}
