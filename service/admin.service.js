const { response } = require('express');
const jwt = require('jsonwebtoken');

const adminModel = require('../model/admin.model');
const { sseStationList } = require('../model/stationList.model');
const stationListModel = require('../model/stationList.model');
const userModel = require('../model/user.model');
const { ApiError } = require('../objectCreator/objectCreator');
const serviceUtils = require('../utils/service.util');

const adminService ={};
var currentdate=new Date(); 
var startdate=new Date(2021,0,1)

// adminService.test =(station,dept)=>{
//     console.log("Service test",station)
//     return stationListModel.sseStationList(station)
//     .then(res=>{
//         let sseres;
//         res=res.map(res=>res.SSE)
//         for(var i=0;i<res.length;i++){
//             let d=res[i].split('/')[0]
//             console.log('fjdhkjahdj',d)
//             if(d==dept){
//                 sseres=res[i]
//             }
//         }
//         console.log('SSE DEPATRT',sseres)
//         return stationListModel.adenSseList(sseres)
//         .then(adenres=>{
//             adenres=adenres.map(adenres=>adenres.ADEN)
//             console.log('ADEN',adenres)
//             return stationListModel.denAdenList(adenres[0])
//             .then(denres=>{
//                 denres=denres.map(denres=>denres.DEN)
//                 let list={
//                     SSE:sseres,
//                     ADEN:adenres,
//                     DEN:denres
//                 }
//                 if(list) return list;
//             })
//         })
//     })
// }

adminService.showComplaints = (mgmtData) => {
    return adminModel.showComplaints()
    .then(response =>{ 
        //Admin
        if(mgmtData.Role==0){
            return response;
        }       
        //SDE
        if(mgmtData.Role==1){
            console.log(response.filter(complaint=>complaint.Department == mgmtData.Department))
            return response.filter(complaint=>complaint.Department == mgmtData.Department);
        }
        // //Admin
        // if(mgmtData.Role==6){
        //     console.log(response.filter(complaint=>complaint.Department == mgmtData.Department))
        //     return response.filter(complaint=>complaint.Department == mgmtData.Department);
        // }
        // if(mgmtData.Role==1){
        //     console.log("Service")
        //     console.log(response.filter(complaint.Department == mgmtData.Department));
        //     return response.filter(complaint.Department == mgmtData.Department);
        // }
        //DE
        if(mgmtData.Role==2){
            return response.filter(complaint=>complaint.status=='02' && complaint.Department == mgmtData.Department);
        }
        //ADE
        if(mgmtData.Role==3){
            return response.filter(complaint=>complaint.status=='01'  && complaint.Department == mgmtData.Department);
        }  
        //SSE
        if(mgmtData.Role==4){
            return response.filter(complaint=>(complaint.status=='00' ||complaint.status=='04') && complaint.Department == mgmtData.Department)
    }
        //JE
        if(mgmtData.Role==5){
            return response.filter(complaint=>complaint.status=='04' && complaint.Department == mgmtData.Department && complaint.Station==mgmtData.Station);
        }
        //OCCUPANT
        if(mgmtData.Role==6){
            return response.filter(complaint=>complaint.PFNumber==mgmtData.PFNumber && complaint.Station==mgmtData.Station);
        }
        if(response) return response;
        throw new ApiError("complaint not found", 404);
    });
} 

adminService.verifyComplaints= (refKey,userRole) => {
    console.log("testtver")
    return userModel.getOneComplaint(refKey)
    .then(response =>{
        if(userRole==0){
            if(response.status=='03' || response.status=='02' || response.status=='01' || response.status=='00')
            {
                response.status='04';
            }
        }
        //SDE
        if(userRole==1){
            if(response.status=='03')
            {
                response.status='04';
            }      
        }
        //DE
        if(userRole==2){
            if(response.status=='02')
            {
                response.status='04';
            }
        }
        //ADE
        if(userRole==3){
            if(response.status=='01')
            {
                response.status='04';
            }      
        }
        //SSE
        if(userRole==4){
            if(response.status=='00')
            {
                response.status='04';
            }
        }
        //JE
        if(userRole==5){
            if(response.status=='04')
            {
                response.status='10';
            }
        }
        // if(userRole==0){
        //     if(response.status=='00')
        //     {
        //         response.status='10';
        //     }
        // }
        return adminModel.changeComplaintDetails(refKey,response).then(response =>{
        if(response) return response;
        throw new ApiError("Complaint not verified", 403);});
    });
}

adminService.verComplaints= (refKey,userRole) => {
    return userModel.getOneComplaint(refKey)
    .then(response =>{
        if(userRole==0){
            if(response.status=='03' || response.status=='02' || response.status=='01' || response.status=='00')
            {
                response.status='10';
            }
        }
        //SDE
        if(userRole==1){
            if(response.status=='04')
            {
                response.status='10';
            }      
        }
        //DE
        if(userRole==2){
            if(response.status=='04')
            {
                response.status='10';
            }
        }
        //ADE
        if(userRole==3){
            if(response.status=='04')
            {
                response.status='10';
            }      
        }
        //SSE
        if(userRole==4){
            if(response.status=='04')
            {
                response.status='10';
            }
        }
        //JE
        if(userRole==5){
            if(response.status=='04')
            {
                response.status='10';
            }
        }
        return adminModel.changeComplaintDetails(refKey,response).then(response =>{
        if(response) return response;
        throw new ApiError("Complaint not verified", 403);});
    });
}

adminService.forwardComplaints= (refKey,userRole) => {
    console.log("testt")
    return userModel.getOneComplaint(refKey)
    .then(response =>{
        if(userRole==0){
            if(response.status=='03' || response.status=='02' || response.status=='01' || response.status=='00')
            {
                response.status='01';
            }
        }
        //SDE
        if(userRole==1){
            if(response.status=='03')
            {
                response.status='04';
            }
        }
        //DE
        if(userRole==2){
            if(response.status=='02')
            {
                response.status='03';
            }
        }
        //ADE
        if(userRole==3){
            if(response.status=='01')
            {
                response.status='02';
            }
        }
        //SSE
        if(userRole==4){
            if(response.status=='00')
            {
                response.status='01';
            }
        }
        return adminModel.changeComplaintDetails(refKey,response).then(response =>{
        if(response) return response;
        throw new ApiError("Complaint not verified", 403);});
    });
}

adminService.rejectComplaint = (refKey,userRole) => {
    return userModel.getOneComplaint(refKey)
    .then(response =>{
        console.log(userRole)
        if(userRole==0){
            if(response.status=='03' || response.status=='02' || response.status=='01' || response.status=='00')
            {
                response.status='-01';
            }
        }
        //SDE
        if(userRole==1){
            if(response.status=='03')
            {
                response.status='-01';
            }
        }
        //DE
        if(userRole==2){
            if(response.status=='02')
            {
                response.status='-01';
            }
        }
        //ADE
        if(userRole==3){
            if(response.status=='01')
            {
                response.status='-01`';
            }
        }
        //SSE
        if(userRole==4){
            if(response.status=='00')
            {
                response.status='-01';
            }
        }
        return adminModel.changeComplaintDetails(refKey,response).then(response =>{
        if(response) return response;
        throw new ApiError("Complaint not verified", 403);});
    });
}
adminService.getsendtolist = (mgmtData) => {
    console.log("hjfsdhfh")
    if(mgmtData.Role>5){throw new ApiError("Unauthorized",401);}
        // if(mgmtData.Role==1){
        //     return response;
        // }
        
        if(mgmtData.Role==2){
            return stationListModel.denAdenList(mgmtData.Station)
            .then(r=>{
                for(var k=0; k<r.ADEN.length;k++)
                {
                    var stationl=[]
                    return stationListModel.adenSseList(r.ADEN[k])
                    .then(response =>{
                        for(var i=0;i<response.SSE.length;i++){
                            return stationListModel.sseStationList(response.SSE[i])
                            .then(resp=>{
                                for(var j=0; j<resp.STATIONS.length;j++){
                                stationl.push(resp.STATIONS[j]);
                                }
                                                        
                                if(i==response.SSE.length-1){
                                    console.log("s",stationl)
                                    var Station=stationl
                                    return Station;
                                }
                            })
                        }
                    });
                }
            });    
        }
        if(mgmtData.Role==3){
            return stationListModel.adenSseList(mgmtData.Station)
            .then(response =>{
                var stationl=[]
                for(var i=0;i<response.SSE.length;i++){
                    return stationListModel.sseStationList(response.SSE[i])
                    .then(resp=>{
                        for(var j=0; j<resp.STATIONS.length;j++){
                        stationl.push(resp.STATIONS[j]);
                        }
                                                
                        if(i==response.SSE.length-1){
                            console.log(stationl)
                            var Station=stationl
                            return Station;
                        }
                    })
                }
            });
        }
        
        if(mgmtData.Role==4){
            return stationListModel.sseStationList(mgmtData.Station)
            .then(response =>{
                return response.STATIONS;
            });
        }
        
        // if(mgmtData.userRole==5){
        //     return response.filter(grievance=>grievance.status=='04' && grievance.Departments.dealerSection == mgmtData.userSection);
        // }
        if(response) return response;
        throw new ApiError("Grievance not found", 404);
} 
adminService.addRemark = (refKey, remark) => {
    return adminModel.addRemark(refKey,remark)
    .then(response => {
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}
adminService.getDatewiseGrievance = (start, end) => {

    if(!start){start=startdate}
    if(!end){end=currentdate}
    return adminModel.getDatewiseComplaints(start,end)
    .then(response => {
        console.log(response)
        if(response) return response;
        throw new ApiError("Cannot add remark", 500);
    });
}
module.exports = adminService;