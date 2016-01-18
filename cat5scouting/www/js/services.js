/*
  Much of the code in this file and controllers.js that has to do with SQLite is
  derived from the gist created by Borris Sondagh, here: 
  https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
*/
angular.module('cat5scouting.services', [])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;
    
    self.query = function(query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();
        
        $ionicPlatform.ready(function() {
           $cordovaSQLite.execute(db, query, parameters)
           .then(function (result) {
               q.resolve(result);
           }, function (error) {
               console.warn('Error encountered: ');
               console.warn(error);
               q.reject(error);
           });
        });
        return q.promise;
    }
    
    self.getAll = function(result) {
        var output = [];
        
        for (var i=0; i<result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    }
    
    self.getById = function(result) {
        var output = null;
        if (result.rows.length > 0) {
            output = angular.copy(result.rows.item(0));
        }
        return output;
    }
    
    return self;
})
    
/******************************************************************************/
    
.factory('Team', function($cordovaSQLite, DBA) {
    var self = this;
    
    self.all = function() {
        return DBA.query("SELECT id, name, number FROM team")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.getByTeam = function(teamId) {
        var parameters = [teamId];
        return DBA.query("SELECT id, name, number FROM team WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getAll(result);
            })
    }

    self.getById = function(teamId) {
        var parameters = [teamId];
        return DBA.query("SELECT `id`, `name`, `driveMode`, `driveSpeed`, "
                    +    "`driveOverPlatform`, `autonomousCapability`, "
                    +    "`coopStep`, `pickupLoc`, `maxToteHeight`, "
                    +    "`maxContHeight`, `stackContInd`, `collectContStep`, "
                    +    "`note` from team "
                    +    "WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }

    self.update = function(origTeam, editTeam) {
        //build an update statement to include only values that have selections 
        //on the form
        var parameters = [];
        var query = "UPDATE `team` SET ";

        if (editTeam.driveMode) { 
            parameters.push(editTeam.driveMode.id); 
            query += " driveMode = (?),";
        }
        if (editTeam.driveSpeed) { 
            parameters.push(editTeam.driveSpeed.id); 
            query += " driveSpeed = (?),";
        }
        if (editTeam.driveOverPlatform) { 
            parameters.push(editTeam.driveOverPlatform.id); 
            query += " driveOverPlatform = (?),";
        }
        if (editTeam.autonomousCapability) { 
            parameters.push(editTeam.autonomousCapability.id); 
            query += " autonomousCapability = (?),";
        }
        if (editTeam.coopStep) { 
            parameters.push(editTeam.coopStep.id); 
            query += " coopStep = (?),";
        }
        if (editTeam.pickupLoc) { 
            parameters.push(editTeam.pickupLoc.id); 
            query += " pickupLoc = (?),";
        }
        if (editTeam.maxToteHeight) { 
            parameters.push(editTeam.maxToteHeight.id); 
            query += " maxToteHeight = (?),";
        }
        if (editTeam.maxContHeight) { 
            parameters.push(editTeam.maxContHeight.id); 
            query += " maxContHeight = (?),";
        }
        if (editTeam.stackContInd) { 
            parameters.push(editTeam.stackContInd); 
            query += " stackContInd = (?),";
        }
        if (editTeam.collectContStep) { 
            parameters.push(editTeam.collectContStep.id); 
            query += " collectContStep = (?),";
        }
        if (editTeam.note) { 
            parameters.push(editTeam.note); 
            query += " note = (?),";
        }

        //add the team ID to the parameters
        parameters.push(editTeam.id);

        //remove the trailing comma from the last part of the query text
        var length = query.length;
        if (query.substr(length-1,1) == ",") {
            query = query.substring(0,length-1);
        }
        
        //add the team ID and the match ID to the query
        query += "WHERE (id = (?))";
        
        //output the query to the console for testing purposes
        console.log("Query to update team record: " + query + " with teamId '" + editTeam.id + "'");

        //execute the query
        return DBA.query(query, parameters);
    }    
    
    return self;
})
    

/******************************************************************************/

.factory('TeamMatch', function($cordovaSQLite, DBA) {
    var self = this;
    
    /*
        This function returns all recorded team/match number combinations
        by joining the `team` table and `match` table with the `teamMatch` 
        table
    */
    self.all = function() {
        return DBA.query("SELECT "
                        +"  t.name, "
                        +"	m.number "
                        +"FROM "
                        +"	`teamMatch` tm "
                        +"LEFT OUTER JOIN "
                        +"  `match` m ON tm.matchId=m.id "
                        +"LEFT OUTER JOIN "
                        +"	`team` t ON tm.teamId=t.id")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.getById = function(teamId, matchId) {
        if (teamId && matchId) {
            var parameters = [teamId, matchId];
            return DBA.query("SELECT tm.id, `matchId`, `teamId`, t.`teamId`, "
                           + "tm.`driveSpeed`, tm.`driveOverPlatform`, `botSet`, "
                           + "`toteSet`, `containerSet`, `stackedToteSet`, "
                           + "`coopScoreStep`, `feedstation`, `landfill`, "
                           + "`scoredToteHeight`, `containerStep`, "
                           + "`scoredIndContainerHeight`, `scoredContainerHeight` "
                           + "FROM `teamMatch` tm "
                           + "LEFT OUTER JOIN "
                           + "`team` t ON (tm.teamId = t.id) "
                           + "WHERE t.id = (?) "
                           + "AND tm.`matchId` = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                })
        }
    }
    
    self.update = function(origTeam, editTeam, match) {
        //build an update statement to include only values that have selections 
        //on the form
        var parameters = [];
        var query = "UPDATE `teamMatch` SET ";
        if (editTeam.driveSpeed) { 
            parameters.push(editTeam.driveSpeed.id); 
            query += " driveSpeed = (?),";
        }
        if (editTeam.driveOverPlatform) {
            parameters.push(editTeam.driveOverPlatform.id); 
            query += " driveOverPlatform = (?),";
        }
        if (editTeam.botSet) {
            parameters.push(editTeam.botSet.id); 
            query += " botSet = (?),";
        }
        if (editTeam.toteSet) {
            parameters.push(editTeam.toteSet.id); 
            query += " toteSet = (?),";
        }
        if (editTeam.containerSet) {
            parameters.push(editTeam.containerSet.id); 
            query += " containerSet = (?),";
        }
        if (editTeam.stackedToteSet) {
            parameters.push(editTeam.stackedToteSet.id); 
            query += " stackedToteSet = (?),";
        }
        if (editTeam.coopScoreStep) {
            parameters.push(editTeam.coopScoreStep); 
            query += " coopScoreStep = (?),";
        }
        if (editTeam.feedstation) {
            parameters.push(editTeam.feedstation.id); 
            query += " feedstation = (?),";
        }
        if (editTeam.landfill) {
            parameters.push(editTeam.landfill.id); 
            query += " landfill = (?),";
        }
        if (editTeam.scoredToteHeight) {
            parameters.push(editTeam.scoredToteHeight); 
            query += " scoredToteHeight = (?),";
        }
        if (editTeam.containerStep) {
            parameters.push(editTeam.containerStep.id); 
            query += " containerStep = (?),";
        }
        if (editTeam.scoredIndContainerHeight) {
            parameters.push(editTeam.scoredIndContainerHeight); 
            query += " scoredIndContainerHeight = (?),";
        }
        if (editTeam.scoredContainerHeight) {
            parameters.push(editTeam.scoredContainerHeight); 
            query += " scoredContainerHeight = (?),";
        }

        //add the team ID and the match ID to the parameters
        parameters.push(editTeam.teamId);
        parameters.push(editTeam.matchId);
        
        //remove the trailing comma from the last part of the query text
        var length = query.length;
        if (query.substr(length-1,1) == ",") {
            query = query.substring(0,length-1);
        }
        
        //add the team ID and the match ID to the query
        query += "WHERE (teamId = (?)) AND (matchId = (?))";
        
        //output the query to the console for testing purposes
        console.log("Query to update team match record: " + query + " with teamId '" + editTeam.teamId + "' and matchId '" + editTeam.matchId + "'");

        //execute the query
        return DBA.query(query, parameters);
    }
    
    self.add = function(teamMatch) {
        var parameters = [
                            teamMatch.teamId, 
                            teamMatch.matchId
                         ];
        return DBA.query("INSERT INTO `teamMatch` (teamId, matchId) "
                        +"VALUES (?,?)", parameters);
    }
    
    return self;
})

/******************************************************************************/
    
.factory('Match', function($cordovaSQLite, DBA) {
    var self = this;
    
    self.all = function() {
        return DBA.query("SELECT id, number FROM match")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.get = function(matchId) {
        var parameters = [matchId];
        return DBA.query("SELECT id, number FROM match WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }
    
    return self;
})
    
