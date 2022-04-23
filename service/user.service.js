const jwt = require('jsonwebtoken');
const adminService =require('./admin.service')

const userModel = require('../model/user.model');
const { ApiError } = require('../objectCreator/objectCreator');
const { JWT_KEY } = require('../keys/constant');
const serviceUtils = require('../utils/service.util');

const userService ={};
const nodemailer = require('nodemailer');
const { response } = require('express');
const stationListModel = require('../model/stationList.model');
userService.createUser = userDetails => {
    console.log("fdagfSHD")
    return userModel.getUserById(userDetails.PFNumber)
        .then(response => {
            if(response) throw new ApiError("PFNumber already exist",400);
             return true;
        })
        .then( canCreate => {
            if(canCreate){
                return userModel.createUser(userDetails)
                .then(response => {
                    console.log(response)
                    return stationListModel.allSseList()
                        .then(sselist=>{
                        console.log(sselist)
                        if (response){
                        console.log("dshgd")
                        for(var i=0; i<sselist.length;i++){
                            if(sselist[i].STATIONS.includes(userDetails.Station)){
                                console.log(sselist[i].SSE)
                                sse=sselist[i].SSE;
                            }
                        }
                        return userModel.getUserByStation(sse)
                        .then(re=>{
                            console.log(re);
                            return re;
                        })
                    }
                        throw new ApiError("Complaint not submitted. Please try Later! ", 500);
                        })
                    
                    //    sendNotification(); 
                        
                });
            }
        })
} 
// userService.editUser = (userDetails,userId) => { 
//         return userModel.editUser(userDetails,userId)
//         .then(response => ({message: `User #${response.userName} Edited successfully`}) )
            
        
// } 
userService.validateUser=(PFNumber)=>{
    return userModel.changeData(PFNumber,true,true)
    .then(response =>{
        if(response) return response;
        throw new ApiError("User not found", 404);
    });
}
userService.rejectUser=(PFNumber)=>{
    return userModel.changeData(PFNumber,false,false)
    .then(response =>{
        if(response) return response;
        throw new ApiError("User not found", 404);
    });
}
userService.getAllUserDetails = () => {
    console.log("In a Service")
    return userModel.getAllUser()
        .then(response =>{
            if(response) return response;
            throw new ApiError("User not found", 404);
        });
} 
userService.getWaitingUserDetails = (mgmtData) => {
    return userModel.getWaitingUsers()
        .then(response =>{
            if(response) return response;
            throw new ApiError("Users not found", 404);
        });
} 
userService.loginUser = async loginDetails  => {
    try{
        const userData = await userModel.getUserById(loginDetails.PFNumber);
        console.log(userData)
        if(!userData) throw 404;
        else{
            const isNotMatch = loginDetails.Password.localeCompare(userData.Password);
            console.log(isNotMatch)
            if (isNotMatch)  throw 401; 
            else {
                
                if(userData.validated==true && userData.isDataCorrect==true) 
                {
                    console.log(loginDetails.PFNumber,loginDetails.Token)
                    return userModel.TokenUpdate(loginDetails.PFNumber,loginDetails.Token)
                    .then(res=>{
                        const message = `Hi ${userData.Name}`;
                    const payload = { PFNumber: userData.PFNumber, Role: userData.Role };
                    const token = jwt.sign(payload, JWT_KEY.SECRET);
                    const user = {
                        userPFNumber: userData.PFNumber,
                        userName: userData.Name,
                        userMobile:userData.Mobile,
                        userRole:userData.Role,
                        userStation:userData.Station,
                        userQtrNumber:userData.QtrNumber,
                        userColony:userData.Colony,
                        userDepartment:userData.Department,
                        userToken:loginDetails.Token
                        //userEmail:userData.Email
                        // userRole: userData.userRole,
                        // userDepartment: userData.userDepartment,
                        // userSection:userData.userSection
                    }       
                    console.log(user)
                    return { message, token, user };

                    })
                    // console.log("dfghjgjhjfhg",userTokenUpdate)   
                } 
                else{

                    return {message:'Invalid'}

                }

            }
        }
    }
    catch(statusCd){
        console.log("error")
        throw new ApiError("Invalid PFNumber or password", statusCd);
    }
}


//Function
sendNotification = (expoPushToken) = async() =>{
    console.log("Hi",expoPushToken)
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { data: 'goes here' },
      };
  
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
}

// -----------------Grievance---------------------
userService.createNewComplaint = (complaintDetails) => {
    console.log("hi")
    return userModel.getAllUserComplaints(complaintDetails.PFNumber).then( a => a.length )
        .then( count => serviceUtils.generateId(complaintDetails.PFNumber,count) )
        .then( refKey =>{
            var referenceKey=refKey.prefix+'-'+refKey.count;
            //ui should send createdAt date
            return userModel.submitComplaint({referenceKey, ...complaintDetails})
                .then(response => {
                    return stationListModel.allSseList()
                        .then(sselist=>{

                        if (response){
                        sselist=sselist.filter(r=>r.SSE[1]==complaintDetails.Department[1].toUpperCase())
                        for(var i=0; i<sselist.length;i++){
                            if(sselist[i].STATIONS.includes(complaintDetails.Station)){
                                console.log(sselist[i].SSE)
                                sse=sselist[i].SSE;
                            }
                        }
                        return userModel.getUserByStation(sse)
                        .then(re=>{
                            console.log(re);
                            return re;
                        })
                    }
                        throw new ApiError("Complaint not submitted. Please try Later! ", 500);
                        })
                    
                    //    sendNotification(); 
                        
                });
        })
        
}

// userService.createNewGrievance = (grievanceDetails, PFNumber) => {
//     return userModel.getAllUserComplaints(PFNumber).then( a => a.length )
//         .then( count => serviceUtils.generateId(PFNumber,count) )
//         .then( refKey =>{
//             grievances=[];
//             categories=grievanceDetails.GCategory
//             delete grievanceDetails['GCategory']
//             for(var i=0; i<categories.length;i++)
//             {   category=categories[i];
//                 var c=String(Number(refKey.count)+i).padStart(3,'0')
//                 var referenceKey=`${refKey.prefix}-${c}`
//                 grievances[i]={referenceKey,GCategory:category, ...grievanceDetails}
//             }
//             return userModel.submitGrievance(grievances)
//             .then(response => {
//                 if(response) return response;
//                 throw new ApiError("Grievance not submitted. Please try Later! ", 500);
//             });
//         })
//         .then( response =>{
//             return {referenceKey: response.referenceKey, message :`Grievance (Reference Key: ${response.referenceKey}) submitted successfully`};
//         });
// }

userService.getAllUserComplaints = (PFNumber) => {
    return userModel.getAllUserComplaints(PFNumber)
        .then(response =>{
            if(response) return response;
            throw new ApiError("User not found", 404);
        });
} 

userService.getAllUserRefComplaints = (referenceKey) => {
    return userModel.getAllUserRefComplaints(referenceKey)
        .then(response =>{
            if(response) return response;
            throw new ApiError("User not found", 404);
        });
} 

    userService.getAllComplaints = () => {
        console.log("In a Service")
        return userModel.getAllComplaints()
            .then(response =>{
                if(response) return response;
                throw new ApiError("User not found", 404);
            });
    } 


// userService.getOneComplaint = (refKey) => {
//     return userModel.getOneComplaint(refKey)
//         .then(response =>{
//             if(response) return response;
//             throw new ApiError("User not found", 404);
//         });
// } 
//File
userService.addFolderPathApplication = (filledApplication, refKey) => {
    //console.log("inside service")
    return userModel.addFolderPathApplication(filledApplication, refKey)
        .then(response => {
            if(response){
                return {response, message :`Filled Application uploaded Successfully`};
            } 
            throw new ApiError("Filled Application not uploaded", 403);
        }) 
}
// //Employee Register 
// userService.registerUser = async registerDetails  => {
//     try{
//         const userData = await userModel.getEmployeeById(registerDetails.PFNumber);
//         console.log(userData)
//         if(!userData) throw 401;
//         else{
//             const isNotMatch = (registerDetails.PFNumber.localeCompare(userData.EMPNO) &&  registerDetails.doa.localeCompare(userData.DOA));
//             console.log(isNotMatch)
//             if (isNotMatch)  throw 401; 
//             else {
//                 const message = `Hi ${userData.userName}`;
//                 const payload = { PFNumber: userData.PFNumber, userRole: userData.userRole };
//                 const token = jwt.sign(payload, JWT_KEY.SECRET);
//                 const user = {
//                     PFNumber: userData.EMPNO,
//                     userName: userData.EMPNAME,
//                     userDepartment: userData.DEPT,
//                     serviceStatus:userData.SERVICESTATUS,
//                     email:registerDetails.email,
//                     phoneNumber:registerDetails.phoneNumber
//                 }             
//                 return { message, token, user };
//             }
//         }
//     }
//     catch(statusCd){
//         console.log("errror")
//         throw new ApiError("Invalid PFNumber or DOB", statusCd);
//     }
// }

// userService.getUserById = (PFNumber) => {
//     return userModel.getUserById(PFNumber)
//     .then(response =>{
//         return userModel.getAllUserComplaints(PFNumber)
//         .then(res =>{
//             if(res){
//                 var details={}
//                 details=response
//                 // details.gcount=res.length;
//             return {details:details}};
//             throw new ApiError("User not found", 404);
//         })
        
        
//     });
// } 

userService.getUseryId=(PFNumber)=>{
    return userModel.getUserById(PFNumber)
    .then(response =>{
        if(response) return response;
        throw new ApiError("PFNumber not found", 404);
    });
}

userService.addRemark = (refKey, remark) => {
    return userModel.addRemark(refKey,remark)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}

// userService.editUserById = (PFNumber,userData) => {
//     return userModel.editUserById(PFNumber,userData)
//     .then(response => ({message: `User #${response.userId} Edited successfully`}) )
// } 
userService.updatePassword = (password,PFNumber) => {
    return userModel.updatePassword(password,PFNumber)

        .then(response => {
            if(response) return response
            throw new ApiError("Cannot change", 403);    
        })
        
}; 
module.exports = userService;