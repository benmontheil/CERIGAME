import { Component } from '@angular/core';
import { AuthentificationService } from './authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CERIGAME';
  bandeauInfo !: string;
  auth : AuthentificationService

  constructor(private _auth : AuthentificationService){ 
    this.auth = _auth;
  }
  
  receiveNotification($event : any){
    console.log($event)
    this.bandeauInfo = $event;
  }
}
