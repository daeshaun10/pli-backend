const router = require('express').Router();
const {
  postLogin,
  postRegister,
  postiApprovedLoan,
  getApprovalNeededLoans,
  getLoans,
  getLoan,
  getApproveNeededAdmins,
  postApprovalNededAdmins,
} = require('../controllers/admin.controller');
const { verifyAdmin } = require('../utils/verify');

router.post('/login', postLogin);

router.post('/register', postRegister);

router.post('/approve', verifyAdmin, postiApprovedLoan);

router.post('/verify', verifyAdmin, postApprovalNededAdmins);

router.get('/verify', verifyAdmin, getApproveNeededAdmins);

router.get('/approvals', verifyAdmin, getApprovalNeededLoans);

router.get('/loans', verifyAdmin, getLoans);

router.get('/loans/:loanId', verifyAdmin, getLoan);

module.exports = router;
