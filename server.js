const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require('cors'); // Importez le module cors

const server = express();
server.use(bodyParser.json());

// Utilisez le middleware cors
server.use(cors());


//connexion
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "app_contenu",
});


db.connect(function (error) {
    if (error) {
      console.log("Echec de connexion à la bdd");
    } else {
      console.log("Connexion avec succès à la bdd");
    }
  });

  //Port
  server.listen(8080,function check(error) {
    if (error) 
    {
    console.log("Error....!");
    }
    else 
    {
        console.log("Started....!");
    }
});


//-------------------------------UTILISATEUR-----------------------------------------------
//créer utilisateur
server.post("/utilisateur/add", (req, res) => {
  let details = {
    nom: req.body.nom,
    mot_de_passe: req.body.mot_de_passe
  };
  let sql = "INSERT INTO utilisateur SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "échec de création d'utilisateur" });
      console.log(error);
    } else {
      res.send({ status: true, message: "Création d'utilisateur avec succès" });
    }
  });
});

  
//lire utilisateur
server.get("/utilisateur", (req, res) => {
  var sql = "SELECT * FROM utilisateur";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

// Endpoint pour se connecter
server.post("/utilisateur/login", (req, res) => {
  const { nom, mot_de_passe } = req.body;

  // Requête SQL pour récupérer les détails de l'utilisateur en fonction du nom
  const sql = "SELECT * FROM utilisateur WHERE nom = ?";
  db.query(sql, [nom], (error, results) => {
    if (error) {
      res.send({ status: false, message: "Erreur de connexion à la base de données" });
      console.log(error);
    } else {
      if (results.length === 0) {
        res.send({ status: false, message: "Nom d'utilisateur incorrect" });
      } else {
        const user = results[0];
        if (user.mot_de_passe === mot_de_passe) {
          res.send({ status: true, message: "Connexion réussie", data: user });
        } else {
          res.send({ status: false, message: "Mot de passe incorrect" });
        }
      }
    }
  });
});

//-------------------------------ARTICLES--------------------------------------------------

//créer article
server.post("/article/add", (req, res) => {
  const utilisateurId = req.body.utilisateur_id || '1';

  let details = {
   // auteur: req.body.auteur,
    titre: req.body.titre,
    contenu: req.body.contenu,
    utilisateur_id: utilisateurId
  };


  let sql = "INSERT INTO article SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "échec de création d'article" });
      console.log(error);
    } else {
      res.send({ status: true, message: "Création d'article avec succès" });
    }
  });
});

server.get('/article', (req, res) => {
  const sql = `
    SELECT article.id, article.titre, article.contenu, article.datemodif, utilisateur.nom AS nom_utilisateur
    FROM article
    JOIN utilisateur ON article.utilisateur_id = utilisateur.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
      return;
    }

    res.json(results);
  });
});
  /*
//lire article
server.get("/article", (req, res) => {
  var sql = "SELECT * FROM article";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});
*/

//Search article
server.get("/article/:id", (req, res) => {
  var articleid = req.params.id;
  var sql = "SELECT * FROM article WHERE id=" + articleid;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//modifier article
server.put("/article/update/:id", (req, res) => {
  let sql =
    "UPDATE article SET titre='" +
    req.body.titre +
    "',contenu='" +
    req.body.contenu +
    "'  WHERE id=" +
    req.params.id;

  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "échec de modificatioon d'article" });
    //  console.log(error);
    } else {
      res.send({ status: true, message: "Article modifié avec succès" });
    }
  });
});


//Delete the Records
server.delete("/article/delete/:id", (req, res) => {
  let sql = "DELETE FROM article WHERE id=" + req.params.id + "";
  let query = db.query(sql, (error) => {
    if (error) {
      res.send({ status: false, message: "échec de suppression d'article" });
    } else {
      res.send({ status: true, message: "article supprimé avec succès" });
    }
  });
});

//-------------------------j'aimes--------------------------------------------------
//lire jaime
server.get("/jaimes", (req, res) => {
  var sql = "SELECT * FROM jaimes";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});


server.post("/jaimes/add", (req, res) => {
  const utilisateurId = req.body.utilisateur_id || '1';
  let details = {
    article_id: req.body.article_id,
    utilisateur_id: utilisateurId
  };
  let sql = "INSERT INTO jaimes SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "échec de création de jaimes" });
      console.log(error);
    } else {
      res.send({ status: true, message: "Création de jaimes avec succès" });
    }
  });
});