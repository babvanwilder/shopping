import { Component, OnInit } from '@angular/core';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private headService: HeadService
  ) { }

  ngOnInit() {
    this.headService.setTitle('Accueil');
  }

}
