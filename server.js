const express = require('express'); //définit l'infrastructure expressJS
const app = express(); //enregistre l'appel à expressJS dans une constante

const bodyParser= require('body-parser'); // définit le middleware permettant de parser les données envoyées par la méthode post
app.use(bodyParser.urlencoded({extended: true})); // Charge le middlewarebodyParser dans la pile pour lire les données au format HTML (&, =, %)
app.use(bodyParser.json({limit: '10mb'}));

const pgClient = require('pg'); // définit le middleware pg

const crypto =  require("crypto") // définit le middleware crypto pour encrypter le mot de passe

var cors = require('cors')
app.use(cors())

const session = require('express-session'); // définit le middleware express-session
const MongoDBStore = require('connect-mongodb-session')(session); // définit le middleware connect-mongodb-session pour gérer le stockage des informations de sessions gérées par express-session

const MongoClient = require('mongodb').MongoClient; // définit le middlewaremongodb et l’instance MongoClient
const dsnMongoDB = "mongodb://127.0.0.1:27017/db"; // spécification du Data Source Name (DSN) de mongoDB => BD://host:port/db

app.use(session({ // charge le middleware express-session dans la pile
    secret: 'ma phrase secrete',
    saveUninitialized: false, // Session créée uniquement à la première sauvegarde de données
    resave: false, // pas de session sauvegardée si pas de modif
    store : new MongoDBStore({ // instance de connect-mongodb-session
        uri: "mongodb://127.0.0.1:27017/benmontheildb",
        collection: 'mySessions',
        touchAfter: 24 * 3600 // 1 sauvegarde toutes les 24h hormis si données MAJ
    }),
    cookie : {maxAge : 24 * 3600 * 1000} // millisecond valeur par défaut { path: '/', httpOnly: true, secure: false, maxAge: null }
}));

var server = app.listen(3065,function(){ //définit le port sur lequel écouter pour les requêtes HTTP
    console.log('écoute sur 3065') //affiche un message sur le terminal
})

app.all('/',(request,response) =>{ //route sur toutes les méthodes depuis l'url '/'
    response.sendFile(__dirname+'/CERIGAME/src/index.html') //renvoie le formulaire de connexion
})

app.post('/login',(request,response) =>{ //route sur le post de '/login', donc après envoi du formulaire de connexion

    // vérification des informations de login auprès de la base postgresql
    var responseData = {data:"",statusMsg:""};

    sql = "select * from fredouil.users where identifiant='"+request.body.username+"';";

    var pool = new pgClient.Pool({user: 'uapv1701911', host: '127.0.0.1', database: 'etd',password: '******', port: '5432' });
    // Connexion à la base => objet de connexion : client
    // fonctionne également en promesse avec then et catch !
    pool.connect(function(err, client, done) {
        if(err) {console.log('Error connecting to pg server' + err.stack);}
        else{
            console.log('Connection established with pg db server');

            // Exécution de la requête SQL et resultats stocké dans le param result
            client.query(sql, (err, result) => {
                if(err){console.log('Erreur d’exécution de la requete' + err.stack);}
                // et traitement du résultat
                else if((result.rows[0] != null) && (result.rows[0].motpasse == require("crypto").createHash("sha1").update(request.body.pwd).digest("hex"))){
                    request.session.isConnected = true;
                    responseData.data=result.rows[0].nom;
                    request.session.username = result.rows[0].prenom
                    responseData.statusMsg='Connexion réussie : bonjour '+result.rows[0].prenom;
                    response.send(result.rows[0]);
                }
                else{
                    console.log('Connexion échouée : informations de connexion incorrectes'); responseData.statusMsg='Connexion échouée : informations de connexion incorrectes';
                    console.log(responseData.data);
                    response.send(request.session);
                }
            });
            client.release(); // connexion libérée
        }
    })
})

app.get('/getQuizz',(request,response) =>{ //route sur le get de '/getQuizz', pour récupérer un quizz de la mongodb
    // Connexion MongoDB
    MongoClient.connect(dsnMongoDB, { useNewUrlParser: true,    useUnifiedTopology: true }, function(err, mongoClient) {
        if(err) {return console.log('erreur connexion base de données'); }

        if(mongoClient) { // Exécution des requêtes - findOne
            // findOne(req, callback(err, resultat)) => retourne le 1e document (ici restaurant) correspondant à la requête passée en paramètre reqDB
            mongoClient.db().collection('quizz').find().toArray((function(err,data){
            if(err) return console.log('erreur base de données');
            if(data){
                console.log('requete ok');
                mongoClient.close(); // fermeture de la connexion
                response.send(data[Math.floor(Math.random() * data.length)]); // renvoi du résultat comme réponse de la requête
            }
            }));
        }
    })
})

app.get('/logout',(request,response) =>{ //route sur le get de '/logout', détruire l'object session
    request.session.destroy();
    response.send(true);
})