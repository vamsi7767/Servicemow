import { Component } from '@angular/core';
import { AiService } from '../../service/AiService ';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatcomp',
  imports: [CommonModule,FormsModule],
  templateUrl: './chatcomp.html',
  styleUrl: './chatcomp.css',
})
export class Chatcomp {

  prompt = '';
  response = '';

  constructor(private ai: AiService) {

//    this.send();
  }

 
}


