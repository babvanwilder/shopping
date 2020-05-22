import { Component, OnInit } from '@angular/core';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  constructor(
    private headService: HeadService
  ) { }

  ngOnInit(): void {
    this.headService.setTitle('Mon compte');
  }

}
