const mongoose = require("mongoose");
const {COLLECTION_NAME} = require('../../keys/constant');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

const userObj = {
    "PFNumber":{ type:String, required:true },
    "Name": { type: String, required: true },
    "Password": { type: String, required: true },
    "Mobile":{type:String},
    // "email":{type:String,default:''},
    "Role": { type: String, default:' ' },
    "Token":{type:String},
    "Department": { type:String, default:'' },
    "Station": { type: String,required:true},
    "QtrNumber": { type: String,required:true},
    "Colony":{type:String,required:true},
    "Hint":{type:String},
    "validated":{type:Boolean,default:false},
    "isDataCorrect":{type:Boolean,default:true}
    // "DOB":{type:String},
    // "DOA":{type:String},
    // "Token":{type:String},
    // "OTP":{type:String,default:''}
};

const departmentObj = {
    "departmentId":{ type:String, required:true },
    "departmentName": { type:String, required:true },
    "Sections": { 
        type: [ {
            "sectionId": { type: String, required: true },
            "sectionName": { type: String, required: true },
        }],
        default: []
    }   
};

const complaintObj = {
    "PFNumber":{ type:String },
    "Name": { type: String },
    "Mobile":{type:String},
    //"Email":{type:String,default:''},
    "Station": { type: String},
    "ComplaintCategory": { 
        type: [{ type: String } ,]
    
    },
    "imgNam":{type:String},
    "imgUrl":{type:Array},
    "Role":{ type: String},
    "QtrNumber":{ type: String},
    "Colony":{ type: String},
    "Token":{type:String},
    "Description":{ type:String},
    "Department":{type:String},
    "imgArray":{type:Array},
    "referenceKey":{ type:String},
    "status": { type: String,default:'00'},
    "Remarks":{ type:[{type:String}]}, 
    "documents":{
        type:{
           filledApplication:
            {type:[{
                fileName:{ type:String},
                path:{type:String}
            }]}
        }
    },
    "dates":{
        "submitted":{type:Date},
        "start":{type:Date},
        "end":{type:Date}
    }
    
    
};
const EmployeeObj={
    "DEPT": {type:String},
        "BILLUNIT": {type:String},
        "EMPNO": {type:String,required:true},
        "EMPNAME": {type:String},
        "DESIG": {type:String},
        "STATIONCODE": {type:String},
        "DOB": {type:String},
        "DOA": {type:String},
        "EMPGROUP": {type:String},
        "PAYRATE": {type:String},
        "PC7_LEVEL": {type:String},
        "PAN": {type:String},
        "PRAN": {type:String},
        "FATHERNAME": {type:String},
        "SEX": {type:String},
        "EMPTYPE": {type:String},
        "SERVICESTATUS": {type:String}
}
const notificationObj = {
    "id":{type:String, required:true},
    "from": { type: String, required: true },
    "to":{
        type:[{ type: String, required: true}]
    },
    "payload":{ type:String, required: true},
    "unread":{type:Boolean,default:true},
    "type":{type:String,default:'alert info'}
};
const ssestationObj = {
    "SSE":{type:String,required:true},
    "STATIONS":{
        type:[{type:String,required:true}]
    }
};
const adensseObj = {
    "ADEN":{type:String,required:true},
    "SSE":{
        type:[{type:String,required:true}]
    }
};
const denadenObj = {
    "DEN":{type:String,required:true},
    "ADEN":{
        type:[{type:String,required:true}]
    }
};

const connection = {};
const usersSchema = new Schema(userObj, { collection: "Users", timestamps: true });
const departmentsSchema = new Schema(departmentObj, { collection: "Departments", timestamps: true });
const complaintsSchema = new Schema(complaintObj, { collection: "Complaints", timestamps: true });
const notificationsSchema = new Schema(notificationObj, { collection: "Notifications", timestamps: true });
const EmployeeSchema = new Schema(EmployeeObj, { collection: "Employee", timestamps: true });
const SsestationSchema = new Schema(ssestationObj, { collection: "SSE-STATIONS", timestamps: true });
const AdensseSchema = new Schema(adensseObj, { collection: "ADEN-SSE", timestamps: true });
const DenadenSchema = new Schema(denadenObj, { collection: "DEN-ADEN", timestamps: true });


connection.getCollection = collectionName => {
    // const DB_HOST = "mongodb://localhost:27017";
    // mongodb+srv://ragulhchc:Omsakthi14101972@railway.cbxnl.mongodb.net/RQCRP?retryWrites=true&w=majority
    
    const DB_HOST = "mongodb+srv://User1:Forhostingpurpose@cluster0.sjmq5.mongodb.net/RQCRP?retryWrites=true&w=majority";
    return mongoose.connect(`${DB_HOST}`, 
    {useNewUrlParser: true, useUnifiedTopology: true}).then((db) => {
        switch (collectionName){
            case COLLECTION_NAME.USERS: return db.model(collectionName, usersSchema);
            case COLLECTION_NAME.DEPARTMENTS: return db.model(collectionName, departmentsSchema);
            case COLLECTION_NAME.COMPLAINTS: return db.model(collectionName, complaintsSchema);
            case COLLECTION_NAME.NOTIFICATIONS: return db.model(collectionName, notificationsSchema);
            case COLLECTION_NAME.EMPLOYEE: return db.model(collectionName,EmployeeSchema);
            case COLLECTION_NAME.SSESTATION: return db.model(collectionName,SsestationSchema);
            case COLLECTION_NAME.ADENSSELIST: return db.model(collectionName,AdensseSchema);
            case COLLECTION_NAME.DENADENLIST: return db.model(collectionName,DenadenSchema);
        }
    }).catch(err => {
        let error = new Error("Could not connect to database");
        error.status = 500;
        throw error;
    });
}

module.exports = connection;