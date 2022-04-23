const collection = require('./db/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const stationListModel = {};
stationListModel.allSseList =() =>{
    return collection.getCollection(COLLECTION_NAME.SSESTATION)
    .then(model => model.find())
    .then(response =>  response);
}
stationListModel.sseStationList =(station) =>{
    return collection.getCollection(COLLECTION_NAME.SSESTATION)
    .then(model => model.findOne({ SSE: station }))
    .then(response =>  response);
}
stationListModel.adenSseList =(sse) =>{
    console.log(sse)
    return collection.getCollection(COLLECTION_NAME.ADENSSELIST)
    .then(model => model.findOne({ADEN:sse}))
    .then(response =>  response);
}
stationListModel.denAdenList =(aden) =>{
    return collection.getCollection(COLLECTION_NAME.DENADENLIST)
    .then(model => model.findOne({DEN:aden}))
    .then(response =>  response);
}
module.exports = stationListModel;