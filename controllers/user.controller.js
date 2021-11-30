const User = require('../models/User.model');
const Loan = require('../models/Loan.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const req = require('express/lib/request');

exports.postRegister = (req, res, next) => {
  const { email, contactNo, password, username, cardDetails } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.status(400).send({
        success: false,
        message: 'email repeated',
      });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      bcrypt.hash(JSON.stringify(cardDetails), 10, (err, cardHash) => {
        const newUser = new User({
          username,
          email,
          contactNo,
          password: hash,
          cardDetails: cardHash,
        });

        newUser.save().then((savedUser) => {
          const token = jwt.sign(
            { id: savedUser._id, isAdmin: false },
            process.env.TOKEN_KEY,
            {
              expiresIn: '48h',
            }
          );

          savedUser.token = token;

          savedUser.save().then(() => {
            return res.status(200).send({
              success: true,
              message: 'Account created successfully!',
            });
          });
        });
      });
    });
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          res.status(400).send({
            success: false,
            message: 'Invalid password',
          });
        } else {
          const token = jwt.sign(
            { id: user._id, isAdmin: false },
            process.env.TOKEN_KEY,
            {
              expiresIn: '48h',
            }
          );
          user.token = token;

          user.save().then(() => {
            return res.status(200).send({
              success: true,
              message: 'User logged in successfully!',
              isAdmin: false,
              expiresIn: new Date(new Date().getTime() + 172800000).getTime(),
              token,
            });
          });
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: 'Invalid email',
      });
    }
  });
};

exports.postLoan = (req, res, next) => {
  const { amount, installment, noInstallments, date } = req.body;

  const newLoan = new Loan({
    user: req.user,
    amount,
    installment,
    noInstallments,
    dueDate: date,
  });

  newLoan
    .save()
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'Applied for loan successfully',
      });
    })
    .catch(console.log);
};

exports.getLoans = (req, res, next) => {
  Loan.find({ user: req.user }).then((loanData) => {
    res.status(200).send({
      success: true,
      loanData,
    });
  });
};

exports.getLoan = (req, res, next) => {
  Loan.findById(req.params.loanId).then((loanData) => {
    res.status(200).send({
      success: true,
      loanData,
    });
  });
};

exports.getNotifications = (req, res, next) => {
  User.findById(req.user).then((userData) => {
    res.status(200).send({
      success: true,
      notifications: userData.notifications,
    });
  });
};

exports.updateViewed = (req, res, next) => {
  User.findById(req.user).then((notes) => {
    notes.notifications.forEach((note) => {
      note.viewed = true;
    });

    notes.save().then(() => {
      res.status(200).send({
        viewed: true,
        success: true,
      });
    });
  });
};

exports.payLoan = (req, res, next) => {
  const { amount, loanId } = req.body;
  Loan.findById(loanId)
    .populate('user')
    .then((loan) => {
      if (loan.installment * loan.noInstallments <= loan.paid + amount) {
        loan.finished = true;
        loan.user.notifications.push({
          message: 'Loan payment completed',
        });
      }
      loan.paid += amount;
      loan.user.save().then(() => {
        loan.save().then(() => {
          res.status(200).send({
            success: true,
            message: 'Payment done successfully',
          });
        });
      });
    })
    .catch(console.log);
};
