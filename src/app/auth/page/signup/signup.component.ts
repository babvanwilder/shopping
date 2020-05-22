import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ToastService } from 'src/app/toast/service/toast.service';
import { Router } from '@angular/router';
import { IUser } from '../../interface/user';
import { StoreService } from 'src/app/shopping/service/store.service';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private storeService: StoreService,
    private headService: HeadService
  ) { }

  ngOnInit(): void {
    this.headService.setTitle('Créer mon Compte');
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      email: new FormControl(
        '',
        [
          Validators.email,
          Validators.required
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required
        ]
      ),
      firstName: new FormControl(
        ''
      ),
      lastName: new FormControl(
        ''
      ),
      displayName: new FormControl(
        ''
      ),
      rememberMe: false
    });
  }

  onSubmit(): void {
    const formValues = this.signUpForm.value;
    const title = 'Inscription';
    this.authService.signUp(
      formValues.email,
      formValues.password,
      formValues.firstName,
      formValues.lastName,
      formValues.displayName,
      formValues.rememberMe
    ).then((user: IUser) => {
      // On creer un premier magasin (une creation de magasin implique la creation d'un article d'exemple)
      return this.storeService.add({
        name: 'Magasin exemple',
        address: null,
        zipCode: null,
        city: null,
        photoUrl: null
      }).then(() => {
        return user;
      });
    }).then((user: IUser) => {
      let welcomeMessage = 'Bienvenu';
      if (user.displayName !== null) {
        welcomeMessage += ' ' + user.displayName;
      }
      this.toastService.addToast(title, welcomeMessage);
      this.router.navigate(['auth/me']);
    }).catch((error: string) => {
      this.toastService.addToast(title, 'Une erreur est survenue lors de la tentative de création de votre compte, cela peut être dû à l\'utilisation d\'une adresse email déjà utilisée. Si vous avez perdu votre mot de passe veuillez faire une demande de réinitialisation de votre mot de passe sur le formulaire de connexion', 15000);
    });
  }

}
