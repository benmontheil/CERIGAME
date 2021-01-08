import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subscriber } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Quizz } from './quizz';
import { User } from './user';

@Injectable()
export class AuthentificationService {
  quizz !: Quizz;

  constructor(private _http : HttpClient) { }

  IsLogged(): boolean {
    if (localStorage.getItem('accessToken') == 'true')
      return true;
    else
      return false;
  };

  VerifyId(user: string, password: string): Observable<boolean> {
    var trueId: boolean = false;
    // la méthode renvoie un observable et un booléen en données
    return Observable.create((observer: Subscriber<boolean>) => {
      this._http.post<any>('http://pedago01c.univ-avignon.fr:3065/login/', { username: user, pwd: password }).subscribe(
        (data : any) => { // succes de l’observable httpClient
          if (data != false) {
            const date : Date =  new Date();
            var user : User = data;
            localStorage.setItem('connectedUser', user);
            localStorage.setItem('dateConnexion', JSON.stringify(date));
            trueId = true;
          }
          else {
            trueId = false;
          }
        },
        (error : any) => {// erreur de l’observable httpClient
          console.error('une erreur est survenue!', error);
          trueId = false;
        },
        () => {// terminaison de l’observable httpClient
          observer.next(trueId); // renvoi des données pour l’observable principal
        }
      );
    });
  };

  endSession(){

    var logout: boolean = false;
    // la méthode renvoie un observable et un booléen en données
    return Observable.create((observer: Subscriber<boolean>) => {
      this._http.get<any>('http://pedago01c.univ-avignon.fr:3065/logout/').subscribe(
        (data : any) => { // succes de l’observable httpClient
          logout = true;
          console.error('Déconnexion est ', logout);
        },
        (error : any) => {// erreur de l’observable httpClient
          console.error('Déconnexion est ', logout);
        },
        () => {// terminaison de l’observable httpClient
          observer.next(logout); // renvoi des données pour l’observable principal
        }
      );
    });
  };

  getQuizz(): Observable<Quizz> {
    // la méthode renvoie un observable et un booléen en données
    return Observable.create((observer: Subscriber<Quizz>) => {
      this._http.get<any>('http://pedago01c.univ-avignon.fr:3065/getQuizz/').subscribe(
        (data : any) => { // succes de l’observable httpClient
          this.quizz = data;
        },
        (error : any) => {// erreur de l’observable httpClient
          console.error('une erreur est survenue!', error);
        },
        () => {// terminaison de l’observable httpClient
          observer.next(this.quizz); // renvoi des données pour l’observable principal
        }
      );
    });
  };
}
