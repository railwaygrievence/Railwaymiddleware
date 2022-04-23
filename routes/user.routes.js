const express = require("express");
var multer  = require('multer')
var formidable = require('formidable')
const fs = require('fs')
const usersService = require("../service/user.service");
const { userAuth, adminAuth } = require('../middleware/auth.middleware');
const userService = require("../service/user.service");
const {setPathgrievanceApplication, setPathFilledApplication, setPathAck} = require('../Middleware/file-system.middleware');
const userRouter = express.Router();
const path = require('path');


// const storage=multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,'./routes')
//     },
//     filename:function(req,file,cb){
//         cb(null,file.originalname)
//     }
// });

// var upload = multer({storage:storage})

userRouter.post("/login", (req, res, next) => {
    console.log("asdfghj")
    usersService.loginUser(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});

userRouter.post("/create", (req, res, next) => {
    console.log("Routeshghj")
    usersService.createUser(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});


userRouter.get("/search/:PFNumber", (req, res, next) => {
    usersService.getUseryId(req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});

// userRouter.post("/edit/:PFNumber", adminAuth, (req, res, next) => {
//     usersService.editUserById(req.params.PFNumber,req.body)
//     .then(response => res.send(response))
//     .catch(error => next(error));
// });

userRouter.post("/all", (req, res, next) => {
    console.log("In a Routes")
    usersService.getAllUserDetails()
    .then(response => res.send(response))
    .catch(error => next(error));
});

userRouter.post("/waiting", (req, res, next) => {
    usersService.getWaitingUserDetails(req.body)
    .then(response => res.send(response))
    .catch(error => next(error));
});

userRouter.get("/validate/:PFNumber",(req, res, next) => {
    usersService.validateUser(req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});
userRouter.get("/reject/:PFNumber", (req, res, next) => {
    console.log('in a Routes')
    usersService.rejectUser(req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});

// Password Reset functions
// userRouter.get("/forgotpassword/:PFNumber", (req, res, next) => {
//     usersService.forgotPassword(req.params.PFNumber)
//     .then(response => res.send(response))
//     .catch(error => next(error));
// });
userRouter.post("/changePassword/:PFNumber", (req, res, next) => {
    usersService.updatePassword(req.body.Password, req.params.PFNumber)
    .then(response => res.send(response))
    .catch(error => next(error));
});
// USER Complaints
userRouter.post("/grievance/add-remark/:refKey",(req, res, next) => {
    userService.addRemark(req.params.refKey,req.body.Remarks)
    .then(response => res.send(response))
    .catch(error => next(error));
});
userRouter.get("/userComplaints/:PFNumber",(req,res,next) =>{
    userService.getAllUserComplaints(req.params.PFNumber)
    .then(response =>res.send(response))
    .catch(error => next(error));
});

userRouter.get("/userComplaints/:referenceKey",(req,res,next) =>{
    userService.getAllUserRefComplaints(req.params.referenceKey)
    .then(response =>res.send(response))
    .catch(error => next(error));
});



userRouter.post("/userallComplaints", (req, res, next) => {
    usersService.getAllComplaints()
    .then(response => res.send(response))
    .catch(error => next(error));
});

userRouter.post("/new-Complaints", (req, res, next) => {
    userService.createNewComplaint(req.body)
        .then(response => res.status(201).send(response))
        .catch(error => next(error));
});
// userRouter.get("/Complaints/:refKey",(req,res,next) =>{
//     userService.getOneGrievances(req.params.refKey)
//     .then(response =>res.send(response))
//     .catch(error => next(error));
// });
//File upload

// userRouter.post("/download", (req, res, next) => {
//     const docPath = path.join(__dirname,`../`) + req.body.path;
//     res.sendFile(docPath);
// });

// userRouter.put("/complaint-file-upload/:PFNumber",
//     userAuth,
//     setPathgrievanceApplication,
//     upload.single('file'),
//     (req, res, next) => {
//     const filledApplication = {
//     path : req.body.file.destination,
//     fileName: req.body.file.filename
//     }
//     res.status(200).send(filledApplication)
//     });
// userRouter.post("/complaint-file-upload/:PFNumber/",upload.single('photo'),(res,req,next) => {
//     return res.json({
//         image:req.file.path
//     })
// });

userRouter.post("/complaint-file-upload/:PFNumber/",(req,res,next) => {
    var form = new formidable.IncomingForm();
    let PFNumber = req.params.PFNumber
    form.parse(req);
    req.folderPath = `/Grievance/${req.params.PFNumber}/File/`;
    console.log(req.folderPath)
    const ppath = `./FileSystem/${req.folderPath}`;
    console.log(ppath)
        let folderNames = ppath.split('/');
        let currentPath = '.';
        let i = 1;
        do{     
            currentPath += `/${folderNames[i]}`;
            if (!fs.existsSync(currentPath)){
                fs.mkdirSync(currentPath);
            }
            ++i;
        }while(i < folderNames.length);
    form.on('fileBegin',function (name,file){
        console.log(file)
        var date = new Date().getTime();
        console.log(date)
        let type=file.type.split('/')[1]

        file.name=PFNumber+'-'+date+'.'+type
        file.path = path.join(currentPath)+file.name;
        console.log(file)
    })

    form.on('file',function (name, file){
        console.log('Uploaded' + file.name)
        global.filledApplication = {
            path : file.path,
            fileName: file.name
            }
    console.log(filledApplication)
    })
    // console.log(res.sendFile(__dirname +'../ComplaintForm.js'));
    res.json(filledApplication)
});


userRouter.post("/download", (req, res, next) => {
    console.log("hi")
    console.log(req.body)

    const docPath = path.join(__dirname,`../`) + req.body.path;
    console.log(docPath)
    res.sendFile(docPath);
});

module.exports = userRouter;