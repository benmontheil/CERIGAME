export interface Quizz {
    fournisseur:string;
    thème: string;
    rédacteur:string;
    quizz:{id:number, question:string, propositions:string[], réponse:string, anecdote:string}[];
}
