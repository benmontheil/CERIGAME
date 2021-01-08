import { Component, OnInit } from '@angular/core';
import { Input, EventEmitter } from '@angular/core'; // déclaration du module Input

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.css']
})
export class BandeauComponent implements OnInit {
  
  @Input() // déclaration d’une propriété messageIn avec le décorateur @Input
  messageIn !: string; // valeur venant du composant parent

  constructor() { }

  ngOnInit(): void {
  }

}
