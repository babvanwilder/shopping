import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../service/store.service';
import { ToastService } from 'src/app/toast/service/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-store-add',
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.scss']
})
export class StoreAddComponent implements OnInit {
  public storeAddForm: FormGroup;

  constructor(
    private storesService: StoreService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private headService: HeadService
  ) { }

  ngOnInit(): void {
    this.headService.setTitle('Ajouter un magasin');
    this.initForm();
  }

  private initForm(): void {
    this.storeAddForm = this.formBuilder.group({
      name: [
        'Mon magasin',
        [
          Validators.required
        ]
      ],
      address: [
        ''
      ],
      zipCode: [
        ''
      ],
      city: [
        ''
      ]
    });
  }

  public onSubmit(): void {
    const values = this.storeAddForm.value;
    const title = 'Ajout de magasin';
    this.storesService.add(values).then(() => {
      this.router.navigate(['stores']);
      this.toastService.addToast(title, 'Votre magasin \'' + values.name + '\' à bien été ajouté.');
    }).catch(() => {
      this.toastService.addToast(title, 'Une erreur est survenue lors de la tentative de création de votre magasin. Effectuez une nouvelle tentative. Si le problème persiste, merci de contacter un administrateur afin qu\'il puisse vous aider.');
    });
  }

}
