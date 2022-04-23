const collection = require('./db/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const userModel = {};

userModel.createUser = userDetails => {
    console.log("djbfhsgd")
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.create(userDetails))
        .then(response =>  response);
}
userModel.getAllUser = () => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.find())
        .then(response =>  response);
}
userModel.getUserById = PFNumber => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOne({PFNumber:PFNumber}))
        .then(response =>  response);
}

userModel.addRemark =(refKey,remark) =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.findOneAndUpdate( {referenceKey:refKey}, {$set:{Remarks:remark}}, {new:true}) )
    .then(response =>  response);
}

userModel.getWaitingUsers = () => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.find({validated:false,isDataCorrect:true}))
        .then(response =>  response);
}

userModel.changeData = (PFNumber,validated,isDataCorrect) => {
    console.log('in a model')
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOneAndUpdate({PFNumber:PFNumber},{$set:{validated:validated,isDataCorrect}},{new:true}))
        .then(response =>  response);
}
// userModel.editUserById = (PFNumber) => {
//     return collection.getCollection(COLLECTION_NAME.USERS)
//         .then(model => model.findOneAndUpdate({PFNumber:PFNumber},{$set:{...userData}},{new:true}))
//         .then(response =>  response);
// }
// userModel.putOTP=(PFNumber,OTP)=>{
//     return collection.getCollection(COLLECTION_NAME.USERS)
//         .then(model => model.findOneAndUpdate( {PFNumber:PFNumber}, {$set:{OTP:OTP}}, {new:true}) )
//         .then(response =>  response);
// }
userModel.updatePassword = (Password, PFNumber) => {
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOneAndUpdate( {PFNumber}, {$set:{Password:Password}}, {new:true}) )
        .then(response =>  response);
};

userModel.TokenUpdate = (PFNumber, Token) => {
    console.log("tokenUpdate")
    return collection.getCollection(COLLECTION_NAME.USERS)
        .then(model => model.findOneAndUpdate( {PFNumber}, {$set:{Token:Token}}, {new:true}) )
        .then(response =>  response);
};
/*-------------Complaints----------------*/
userModel.getAllUserComplaints = PFNumber =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.find({PFNumber:PFNumber}))
    .then(response =>  response);
}
userModel.getAllUserRefComplaints = referenceKey =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.find({referenceKey:referenceKey}))
    .then(response =>  response);
}
userModel.submitComplaint =complaintDetails =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.create(complaintDetails))
    .then(response =>  response);
}

userModel.getAllComplaints = () => {
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
        .then(model => model.find())
        .then(response =>  response);
}


// userModel.submitGrievances = grievanceDetails =>{
//     return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
//     .then(model => model.insert(grievanceDetails))
//     .then(response =>  response);
// }
userModel.getOneComplaint = refKey =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.findOne({referenceKey:refKey}))
    .then(response =>  response);
}

userModel.getUserByStation = sse =>{
    return collection.getCollection(COLLECTION_NAME.USERS)
    .then(model => model.findOne({Station:sse}))
    .then(response =>  response);
}
/*------------------file------------------*/
userModel.addFolderPathApplication = (filledApplication, refKey) => {
    console.log("inside model",refKey)
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
        .then(model => model.findOneAndUpdate({referenceKey:refKey},{$set:{'documents.filledApplication':filledApplication}},{new:true}))
        .then(response =>  response);
}

// /*-----------Employee Register-------------*/
// userModel.getEmployeeById = empId => {
//     return collection.getCollection(COLLECTION_NAME.EMPLOYEE)
//         .then(model => model.findOne({EMPNO:empId}))
//         .then(response =>  response);
// }
// userModel.createEmployee = userDetails => {
//     return collection.getCollection(COLLECTION_NAME.EMPLOYEE)
//         .then(model => model.create(userDetails))
//         .then(response =>  response);
// }
module.exports = userModel;