import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../authentification.service';
import { AppComponent } from '../app.component';
import {NgForm, FormBuilder, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  bandeauInfo !: string;
  user : {[username: string]: any} = {};
  auth :AuthentificationService;
  
  constructor(_auth : AuthentificationService){ 
    this.auth = _auth;
  }

  @Output('messageOutBandeau') // déclaration d’une propriété sendMessageEmitter de type EventEmitter avec le décorateur @Output
  notification = new EventEmitter<string>();

  onNotificationChange() {
    this.notification.emit(this.bandeauInfo); // déclenchement de l’event pour le parent avec le message associé en paramètre
  }

  ngOnInit(): void {
  }

  login(){
    this.auth.VerifyId(this.user.username, this.user.password).subscribe(
      (data : any) => {
        if(data != null){
          this.bandeauInfo = "Bienvenue "+this.user.username;
        }
        else{
          this.bandeauInfo = "Connexion echouee !";
        }
        this.onNotificationChange();
      },
    );
  }

  logout(){
    var data : any
    this.auth.endSession().subscribe(
      (data : any)  => {
        console.log(data);
        localStorage.setItem('accessToken', 'false');
        this.bandeauInfo = "Vous vous êtes déconnecté"
        this.onNotificationChange();
      },
    );
  }
}
