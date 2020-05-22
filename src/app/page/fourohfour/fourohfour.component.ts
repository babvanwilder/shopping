import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeadService } from 'src/app/service/head.service';

@Component({
  selector: 'app-fourohfour',
  templateUrl: './fourohfour.component.html',
  styleUrls: ['./fourohfour.component.scss']
})
export class FourohfourComponent implements OnInit {

  constructor(
    private headService: HeadService
  ) { }

  ngOnInit(): void {
    this.headService.setTitle('Page non trouvé');
  }

}
