//Imports
const db = require("../models");
const jwt = require("jsonwebtoken");

//Midellware
//Création d'un commentaire
exports.createComment = (req, res) => {
  //On récupère l'userId de la personne connecté
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  if (req.body.content === null) {
    return res.status(402).json({ message: "Veuillez écrire un message!" });
  }

  if (req.body.content <= 2) {
    return res
      .status(401)
      .json({ message: "Veuillez écrire au moins 3 caractères !" });
  }

  db.Message.findOne({ where: { id: req.body.messageId } })
    .then((message) => {
      if (message) {
        db.Comment.create({
          content: req.body.content,

          MessageId: message.id,
          UserId: userId, //demander à mon mentor comment faire autrement
        })
          .then((comment) => {
            if (comment) {
              res.status(201).json({
                comment,
              });
            } else {
              res
                .status(512)
                .json({ error: "Impossible de poster le commentraire !" });
            }
          })
          .catch((err) => {
            res.status(500).json({ err: "test" });
          });
      } else {
        res.status(404).json({ message: "Message introuvable !" });
      }
    })
    .catch((err) => {
      res.status(501).json({ err });
      console.log(err);
    });
};

//Récupérations de tout les commentaires
exports.getAllComments = (req, res) => {
  db.Comment.findAll()
    .then((comments) => res.status(200).json({ comments }))
    .catch((error) => res.status(400).json({ error }));
};

//Récupération d'un commentaire via son ID
exports.getOneComment = (req, res) => {
  db.Comment.findOne({
    where: { id: req.params.id },
  })
    .then((comment) => {
      res.status(200).json({ comment });
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
};

//Modification d'un commentaire
exports.updateComment = (req, res) => {
  db.Comment.findOne({
    where: { id: req.params.id },
  })
    .then((comment) => {
      if (comment) {
        comment
          .update({
            content: req.body.content,
          })
          .then(() => {
            res.status(201).json({ message: "commentaire modifié !" });
          })
          .catch((err) => {
            res.status(400).json({ err });
          });
      } else {
        res.status(404).json({ messahe: "commentaire introuvable !" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

//Suppression d'un commentaire
exports.deleteComment = (req, res) => {
  db.Comment.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      res.status(200).json({ message: "Commentaire supprimé !" });
    })
    .catch((err) => {
      res.status(505).json({ err });
    });
};
