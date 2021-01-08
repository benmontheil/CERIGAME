import { Component, OnInit} from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { Quizz } from '../quizz';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  currentQuizz !: Quizz;
  questionId : number = 0;
  seenQuestions : number[] = [];
  theme : string = "";
  answersNumber : number = 0;
  propositions : string[] = [];
  reponse : string = "";
  bonneReponse : string = "";
  time : number = 0;
  interval : any;
  score : number = 0;
  fin : boolean = false;

  constructor(private _auth : AuthentificationService) { }

  ngOnInit(): void {
  }

  startQuizz(){
    this._auth.getQuizz().subscribe(
      data => {
        this.currentQuizz = data;
        this.questionId = 0;
        this.seenQuestions = [];
        this.answersNumber = 0;
        this.theme = "";
        this.propositions = [];
        this.reponse = "";
        this.bonneReponse = "";
        this.theme = this.currentQuizz.thème;
        this.time = 0;
        this.fin = false;
        clearInterval(this.interval);
      },
    );
  }

  chooseDifficulty(difficulty : string){
    if(difficulty == "facile")
      this.answersNumber = 2;
    else if(difficulty == "intermédiaire")
      this.answersNumber = 3;
    else
      this.answersNumber = 4;
    this.getQuestion();
  }

  getQuestion(){
    this.reponse = "";
    if(this.seenQuestions.length == 5)
      this.endQuizz();
    else
      this.questionId = Math.floor(Math.random() * this.currentQuizz.quizz.length-1)+1;
      while(this.seenQuestions.includes(this.questionId))
        this.questionId = Math.floor(Math.random() * this.currentQuizz.quizz.length-1)+1;
      this.seenQuestions.push(this.questionId);
      this.getPropositions();
      this.interval = setInterval(() => { this.time++; },1000);
  }

  getPropositions(){
    this.propositions = this.currentQuizz.quizz[this.questionId].propositions;
    while(this.propositions.length > this.answersNumber){
      const randomIndex = Math.floor(Math.random() * this.propositions.length);
      if(this.propositions[randomIndex] != this.currentQuizz.quizz[this.questionId].réponse)
        this.propositions.splice(randomIndex, 1);
    }
  }

  pickProposition(proposition : string){
    clearInterval(this.interval);
    this.bonneReponse = this.currentQuizz.quizz[this.questionId].réponse
    if(proposition == this.bonneReponse){
      this.reponse = "Bonne";
      this.score += 100;
    }
    else
      this.reponse = "Mauvaise";
  }

  endQuizz(){
    clearInterval(this.interval);
    this.fin = true;
    this.score = Math.round(this.score*this.answersNumber/this.time);
    this.theme = "";
  }
}
