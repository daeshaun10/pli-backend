const Admin = require('../models/Admin.model');
const Loan = require('../models/Loan.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  Admin.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          if (!user.verified) {
            res.status(400).send({
              success: false,
              message: 'You must have a verified admin account to continue',
            });
          } else {
            const token = jwt.sign(
              { id: user._id, isAdmin: true, verified: user.verified },
              process.env.TOKEN_KEY,
              {
                expiresIn: '48h',
              }
            );

            user.token = token;

            user.save().then(() => {
              res.status(200).send({
                success: true,
                message: 'User logged in successfully!',
                isAdmin: true,
                expiresIn: new Date(new Date().getTime() + 172800000).getTime(),
                token,
              });
            });
          }
        } else {
          res.status(400).send({
            success: false,
            message: 'Invalid password',
          });
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: 'Cannot find an account',
      });
    }
  });
};

exports.postRegister = (req, res, next) => {
  const { email, password } = req.body;
  Admin.findOne({ email: email }).then((user) => {
    if (user) {
      return res.status(400).send({
        success: false,
        message: 'A user with the same email address already exists',
      });
    }

    bcrypt.hash(password, 10, (err, newPassword) => {
      const newAdmin = new Admin({
        email,
        password: newPassword,
      });

      newAdmin.save().then((user) => {
        const token = jwt.sign(
          { id: user._id, isAdmin: true, verified: false },
          process.env.TOKEN_KEY,
          {
            expiresIn: '48h',
          }
        );
        user.token = token;
        user
          .save()
          .then(() => {
            res.status(200).send({
              success: true,
              message: 'Account created successfully wait for the approval!',
            });
          })
          .catch(console.log);
      });
    });
  });
};

exports.postiApprovedLoan = (req, res, next) => {
  const { approved, loanId } = req.body;

  Loan.findById(loanId)
    .populate('user')
    .then((loan) => {
      if (approved) {
        loan.approved = true;
        loan.user.notifications.push({
          message: `Loan ${loan._id} accepted!`,
        });
      } else {
        loan.rejected = true;
        loan.user.notifications.push({
          message: `Loan ${loan._id} rejected!`,
        });
      }
      loan.user.save().then(() => {
        loan.save().then(() => {
          res.status(200).send({
            success: true,
            message: 'Loan data updated successfully',
          });
        });
      });
    })
    .catch(console.log);
};

exports.getApprovalNeededLoans = (req, res, next) => {
  Loan.find({ approved: false, rejected: false })
    .populate('user')
    .then((loans) => {
      res.status(200).send({
        success: true,
        loanData: loans,
      });
    })
    .catch(console.log);
};

exports.getLoans = (req, res, next) => {
  Loan.find()
    .populate('user')
    .then((loans) => {
      res.status(200).send({
        success: true,
        loanData: loans,
      });
    })
    .catch(console.log);
};

exports.getLoan = (req, res, next) => {
  Loan.findById(req.params.loanId)
    .populate('user')
    .then((loanData) => {
      res.status(200).send({
        success: true,
        loanData,
      });
    });
};

exports.getApproveNeededAdmins = (req, res, next) => {
  Admin.find({ verified: false }).then((result) => {
    res.status(200).send({
      success: true,
      admins: result.map((admin) => admin.email),
    });
  });
};

exports.postApprovalNededAdmins = (req, res, next) => {
  const { email, approved } = req.body;
  if (!approved) {
    Admin.deleteOne({ email: email }).then(() => {
      res.status(200).send({
        success: true,
        message: 'Admin deleted successfully',
      });
    });
  } else {
    Admin.findOne({ email }).then((result) => {
      result.verified = true;
      result.save().then(() => {
        res.status(200).send({
          success: true,
          message: 'Admin approved successfully',
        });
      });
    });
  }
};
