import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/service/auth.service';
import { ToastService } from 'src/app/toast/service/toast.service';
import { IUser } from '../../interface/user';
import { Router } from '@angular/router';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private headService: HeadService
  ) { }

  ngOnInit(): void {
    this.headService.setTitle('Connexion');
    this.initForm();
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.email,
          Validators.required
        ]
      ],
      password: [
        '',
        [
          Validators.required
        ]
      ],
      rememberMe: false
    });
  }

  onSubmit() {
    const formValues = this.signInForm.value;
    const title = 'Connexion';
    this.authService.signIn(formValues.email, formValues.password, formValues.rememberMe).then((user: IUser) => {
      let welcomeMessage = 'Bon retour parmis nous';
      if (user.displayName !== null) {
        welcomeMessage += ' ' + user.displayName;
      }
      this.toastService.addToast(title, welcomeMessage);
      this.router.navigate(['']);
    }).catch((error: string) => {
      this.toastService.addToast(title, 'Erreur dans le login/mot de passe');
    });
  }

}
