const express = require("express");
const adminService = require("../service/admin.service");
const { userAuth, adminAuth,mgmtAuth } = require('../middleware/auth.middleware');

const adminRouter = express.Router();

// adminRouter.get("/test",(req, res, next) => {
//     adminService.test('ANU')
//     .then(response => res.send(response))
//     .catch(error => next(error));
// });
adminRouter.post("/showComplaints",(req, res, next) => {
    adminService.showComplaints(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});

adminRouter.post("/verComplaints/:refKey",(req, res, next) => {
    adminService.verComplaints(req.params.refKey,req.body.Role)
    .then(response => res.send(response))
    .catch(error => next(error));
});

adminRouter.post("/verifyComplaints/:refKey",(req, res, next) => {
    adminService.verifyComplaints(req.params.refKey,req.body.Role)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/forwardComplaints/:refKey",(req, res, next) => {
    adminService.forwardComplaints(req.params.refKey,req.body.Role)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/rejectComplaint/:refKey",(req, res, next) => {
    console.log(req.body.Role)
    adminService.rejectComplaint(req.params.refKey,req.body.Role)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/getList", (req, res, next) => {
    console.log("dsjhgjhs")
    adminService.getsendtolist(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/grievance/add-remark/:refKey",(req, res, next) => {
    adminService.addRemark(req.params.refKey,req.body.remarks)
    .then(response => res.send(response))
    .catch(error => next(error));
});
adminRouter.post("/grievance/date-wise/",(req, res, next) => {
    console.log(req.body.start,req.body.end)
    adminService.getDatewiseGrievance(req.body.start,req.body.end)
    .then(response => res.send(response))
    .catch(error => next(error));
});
module.exports = adminRouter;