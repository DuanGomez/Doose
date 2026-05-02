import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/models';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  selected: ContactMessage | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<ApiResponse<ContactMessage[]>>('http://localhost:8080/api/contact')
      .pipe(map(r => r.data))
      .subscribe(data => this.messages = data.reverse());
  }

  open(msg: ContactMessage)  { this.selected = msg; }
  close()                    { this.selected = null; }
}
