//Imports
const db = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");

//Midlleware
//Récuperations de tout les comptes
exports.getAllUsers = (req, res) => {
  db.User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((users) => res.status(200).json({ users }))
    .catch((error) => res.status(404).json({ error }));
};

//Récupération d'un compte
exports.getUser = (req, res) => {
  db.User.findOne({
    attributes: { exclude: ["password"] },
    where: { id: req.params.id },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "Utilisateur introuvable" });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

// //Récuperer son profil - Conflit avec le getUser
// exports.getMe = (req, res) => {
//   const token = req.headers.authorization.split(' ')[1]
//   const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET")
//   const userId = decodedToken.userId
//   console.log(userId);

//   db.User.findOne({
//     where: {id: userId}
//   })
//   .then((user) => {
//     res.status(200).json({user})
//   }).catch((err) => {
//     res.status(404).json({message: "utilisateur non trouvé"})
//   });
// }

// Modification d'un compte
exports.updateUser = (req, res) => {
  db.User.findOne({
    where: { id: req.params.id },
  })

    .then((user) => {
      if (user) {
        user
          .update({
            bio: req.body.bio ? req.body.bio : user.bio,
            picture: req.file
              ? `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`
              : user.picture,
          })
          .then(() => {
            res.status(201).json({ message: "profil mis à jour !" });
            console.log(res);
          })

          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé !" });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

//Supression d'un compte
exports.deleteUser = (req, res) => {
  db.User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => {
      const filename = user.picture.split("/images/")[1];
      if(filename !== "profildefault.png")
      fs.unlink(`images/${filename}`, () => {
        user
          .destroy({
            where: { id: req.params.id },
          })
          .then(() => {
            res.status(200).json({ message: "Utilisateur supprimé !" });
            
          })
          .catch((err) => {
            res.status(400).json({ err });
          });
      });
    })

    .catch((err) => {
      res.status(500).json({ err });
      console.log(err);
    });
};
