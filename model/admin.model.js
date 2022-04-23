const collection = require('./db/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const adminModel = {};
adminModel.showComplaints =() =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.find())
    .then(response =>  response);
}
adminModel.changeComplaintDetails = (refKey,complaintDetails) =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.findOneAndUpdate({referenceKey:refKey},{$set:{...complaintDetails}}))
    .then(response =>  response);
}
adminModel.addRemark =(refKey,remark) =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.findOneAndUpdate( {referenceKey:refKey}, {$set:{Remarks:remark}}, {new:true}) )
    .then(response =>  response);
}
adminModel.getDatewiseComplaints =(start,end) =>{
    return collection.getCollection(COLLECTION_NAME.COMPLAINTS)
    .then(model => model.find( {createdAt: {$gte: start, $lte: end}} ).sort({createdAt: -1}))
    .then(response =>  response);
}
// adminModel.getsendtolist = (role) =>{
//     return collection.getCollection(COLLECTION_NAME.USERS)
//     .then(model => model.find())
//     .then(response => response);
// }
module.exports = adminModel;