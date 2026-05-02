import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TattooServiceService } from '../../core/services/tattoo.service';
import { TattooService } from '../../core/models/models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: TattooService[] = [];

  constructor(private svc: TattooServiceService) {}
  ngOnInit() { this.svc.getAll().subscribe(data => this.services = data); }
}
