const mongoose = require('../../node_modules/mongoose');
const User = require('../models/user');
const bcrypt = require('../../node_modules/bcrypt');
const jwt = require('../../node_modules/jsonwebtoken');

exports.users_list = (req, res) => {
  User.find({ username: { $ne: req.userData.username } }).exec()
    .then((docs) => {
      res.status(200).json({
        users: docs,
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.user_delete = (req, res) => {
  User.remove({ _id: req.body.userId })
    .exec()
    .then(() => res.status(200).json({ message: 'User deleted!' }))
    .catch(err => res.status(500).json({ error: err }));
  console.log(req.body.userId);
};

exports.user_register = (req, res) => {
  User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .exec()
    .then((doc) => {
      if (doc.length > 0) {
        res.status(409).json({ message: 'User already exist!' });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res
                  .status(201)
                  .json({
                    message: 'User successfuly registered!',
                    userData: result,
                  });
              })
              .catch(err2 => res.status(400).json({ error: err2 }));
          }
        });
      }
    })
    .catch(err3 => res.status(500).json({ error: err3 }));
};
exports.user_login = (req, res) => {
  User.find({ username: req.body.username })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        res.status(401).json({ message: 'Auth Failed' });
      } else {
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
          if (err) {
            res.status(401).json({ message: 'Auth Failed' });
          } else if (result) {
            const token = jwt.sign(
              {
                email: req.body.email,
                name: req.body.name,
                username: req.body.username,
                _id: req.body._id,
              },
              'secret',
              {
                expiresIn: '1h',
              },
            );
            res
              .status(200)
              .json({ message: 'Auth granted', signinToken: token });
          } else {
            res.status(401).json({ message: 'Auth Failed' });
          }
        });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};
