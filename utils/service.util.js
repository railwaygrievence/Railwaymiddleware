const {ID_PREFIX} = require('../keys/constant');
const userModel = require('../model/user.model');

const serviceUtils = {};

serviceUtils.mapProjectForUser =  projects =>{
    let result = [];
    if(projects.length > 0)
        result =  projects.map( ({
            projectId,
            projectTitle,
            status,
            projectDepartment,
            remarks,
            approved,
            keywords,
            review,
            createdAt,
            start
            }) => ({
                projectId,
                projectTitle,
                status,
                projectDepartment,
                remarks,
                approved,
                keywords,
                review,
                createdAt,
                start
                    }) );
    return result;
}

serviceUtils.mapPublicationForUser =  publication =>{
    let result = [];
    if(publication.length > 0)
        result =  publication.map( ({
                publicationId,
                publicationType,
                publicationName,
                paperTitle,
                publisherId,
                volumeNumber,
                yearOfPublication,
                ISSN,
                indexing,
                reach,
                pagesFrom,
                pagesTo,
                ISBN,
                contributionAs,
                issueNumber,
                impactFactor,
                editionNumber,
                DOIorURL,
                Remarks,
                approved,
                visibility,
                isarchived,
                Department,
                file,
                coAuthor,
                extraCoAuthor

            }) => ({
                publicationId,
                publicationType,
                publicationName,
                paperTitle,
                publisherId,
                volumeNumber,
                yearOfPublication,
                ISSN,
                indexing,
                reach,
                pagesFrom,
                pagesTo,
                ISBN,
                contributionAs,
                issueNumber,
                impactFactor,
                editionNumber,
                DOIorURL,
                Remarks,
                approved,
                visibility,
                isarchived,
                Department,
                file,
                coAuthor,
                extraCoAuthor
}) );
    return result;
}

serviceUtils.mapFundingProjectForUser =  fundingProject =>{
    let result = [];
    if(fundingProject.length > 0)
        result =  fundingProject.map( ({
            fundingProjectId,
            fundingOrganisation,
            fundingAmount,
            fundingType,
            status,
            nameOfGrant,
            isExternal,
            keywords,
            isUserApplied}) => ({
                fundingProjectId,
                fundingOrganisation,
                fundingAmount,
                fundingType,
                status,
                nameOfGrant,
                isExternal,
                keywords,
                isUserApplied}) );
    return result;
}

serviceUtils.mapProjectSummary =  projects =>{
    let result = [];
    if(projects.length > 0)
        result =  projects.map( ({
            projectId,
            projectTitle,
            projectSummary,
            team,
            remarks,
            projectDepartment,
            approved,
            keywords,
            visibility,
            isarchived,
            start,
            createdAt,
            updatedAt,
            status}) => ({
                projectId,
                projectTitle,
                projectSummary,
                team,
                remarks,
                projectDepartment,
                approved,
                keywords,
                visibility,
                isarchived,
                start,
                createdAt,
                updatedAt,
                status}) );
    return result;
}

serviceUtils.mapIdToUser =  team =>{
    return team.map( id  =>  {
        return userModel.getUserById(id).then( ({userId, userName}) =>{
            return `${userId}-${userName}`;
        })
    })
}


serviceUtils.generateId = ( prefix, count) =>{
    count=String(count+1).padStart(3,'0');

    refKey={prefix:prefix.substring(prefix.length-8),count:count};
    return refKey;
    switch(prefix){
        case ID_PREFIX.NOTIFICATION: return `${ID_PREFIX.NOTIFICATION}${100000+count+1}`;
        default: return `${prefix.substring(prefix.length-8)}-${count+1}`;
    }
}

module.exports = serviceUtils;