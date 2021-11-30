const router = require('express').Router();
const {
  postLogin,
  postRegister,
  postLoan,
  updateViewed,
  getLoans,
  getLoan,
  getNotifications,
  payLoan,
} = require('../controllers/user.controller');
const { verifyUser } = require('../utils/verify');

router.post('/login', postLogin);

router.post('/register', postRegister);

router.post('/loan', verifyUser, postLoan);

router.post('/update-viewed', verifyUser, updateViewed);

router.get('/loans', verifyUser, getLoans);

router.get('/loans/:loanId', verifyUser, getLoan);

router.get('/notifications', verifyUser, getNotifications);

router.post('/pay', verifyUser, payLoan);

module.exports = router;
