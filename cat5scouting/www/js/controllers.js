/*
  Much of the code in this file and services.js that has to do with SQLite is
  derived from the gist created by Borris Sondagh, here: 
  https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
*/
angular.module('cat5scouting.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('HomeCtrl', function($scope, $stateParams) {
  
})

.controller('MatchCtrl', function($scope, Team) {
  $scope.teams = [];
  $scope.teams = null;
  
  $scope.updateTeam = function() {
    Team.all().then(function(teams) {
      $scope.teams = teams;
    })
  }
  
  $scope.updateTeam();
})


.controller('PitCtrl', function($scope, Team) {
  $scope.teams = [];
  $scope.teams = null;
  
  $scope.updateTeam = function() {
    Team.all().then(function(teams) {
      $scope.teams = teams;
    })
  }
  
  $scope.updateTeam();
})


.controller('SyncCtrl', function($scope, $cordovaFile, TeamMatch) {
  
  $scope.exportData = function() {
    
    console.log("exportData called");
    
    //Create the exported Team data to write to a file
    var exportData = "Test data for export";
    /*
    TeamMatch.all().then(function(team) {
      for (var i=0; i<team.length; i++) {
        exportData += team[i].name;
        exportData += ", ";
      }
    })
    */
    
    console.log("exportData = " + exportData);
    
    $cordovaFile.writeFile(cordova.file.dataDirectory, "Cat5Scouting.Pit.txt", exportData, true)
      .then(function (success) {
        console.log("Data exported to Cat5Scouting.Pit.txt");
      }, function (error) {
        console.log("Problem writing text to Pit file");
      });

    //Create the exported Team Match data to write to a file
    var exportData = "";
    TeamMatch.all().then(function(teamMatches) {
      for (var i=0; i<teamMatches.length; i++) {
        exportData += teamMatches[i].teamId;
        exportData += ", ";
      }
    })
    
    $cordovaFile.writeFile(cordova.file.dataDirectory, "Cat5Scouting.Match.txt", exportData, true)
      .then(function (success) {
        console.log("Data exported to Cat5Scouting.Match.txt");
      }, function (error) {
        console.log("Problem writing text to Match file");
      });
  }
})



.controller('SettingsCtrl', function($scope, $stateParams) {
  
})





.controller('PitScoutingController', function($scope, $stateParams, Team) {
  ///TODO Convert these to SQLite database calls
  /*
    teamName: the name of the team; values provided via PitCtrl controller
    driveMode: the type of wheels/locomotion that the robot uses
    driveSpeed: how fast the robot can move about the field
    driveOverPlatform: whether the robot is capable of driving over the platform
    autonomousCapability: what the robot can accomplish during autonomous play
    coopStep: how many totes the robot can load onto the cooperative step
    pickupLoc: where the robot can retrieve totes from on the field
    maxToteHeight: the maximum # of totes the robot can stack
    maxContHeight: the maximum # of totes the robot can top with a container
    stackContInd: can the robot stack containers independently?
    collectContStep: can the robot collect a container from the step?
    note: free-form field for providing additional observations
  */
  
  $scope.team = [];
  $scope.team = null;
  
  //TODO: Investigate if iPhones and iPads can export to thumb drives
  //TODO: Capture images on the Pit Scouting page
  //TODO: Picklist for quickly choosing the best matches

  $scope.data = {
    yesNo: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    driveModes: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'KOP'},
      {id: '2', name: 'Mecanum'},
      {id: '3', name: 'Omni'},
      {id: '4', name: 'Omni'}
    ],
    driveSpeeds: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Slow'},
      {id: '2', name: 'Medium'},
      {id: '3', name: 'Fast'}
    ],
    autonomousCapabilities: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Bot set'},
      {id: '2', name: 'Tote set'},
      {id: '3', name: 'Container set'},
      {id: '4', name: 'Stacked Tote set'},
      {id: '5', name: 'None'}
    ],
    coopStepOptions: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1'},
      {id: '3', name: '2'},
      {id: '4', name: '3'},
      {id: '5', name: 'None'}
    ],
    pickupLocs: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Feed station'},
      {id: '2', name: 'Landfill'},
      {id: '3', name: 'Neither'},
      {id: '4', name: 'Both'}
    ],
    maxToteHeights: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1-2'},
      {id: '3', name: '3-4'},
      {id: '4', name: '5-6'}
    ],
    maxContHeights: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1-2'},
      {id: '3', name: '3-4'},
      {id: '4', name: '5-6'}
    ]
  }

  /*
    This function is called to determine if non-team and non-robot fields should
    be anbled. If and only if both a team and a robot have been selected, it 
    returns false (meaning don't disable the fields)
  */
  $scope.disableFields = function() {
    return $scope.selectedTeam == null;
  }
  
  /*
    This function is called when the user changes the team. It loads values for
    the team's fields from the SQLite database. 
  */
  $scope.selectTeam = function() {
    //reset all the fields
    $scope.driveMode = $scope.data.driveModes[0];
    $scope.driveSpeed = $scope.data.driveSpeeds[0];
    $scope.driveOverPlatform = $scope.data.yesNo[0];
    $scope.autonomousCapability = $scope.data.autonomousCapabilities[0];
    $scope.coopStep = $scope.data.coopStepOptions[0];
    $scope.pickupLoc = $scope.data.pickupLocs[0];
    $scope.maxToteHeight = $scope.data.maxToteHeights[0];
    $scope.maxContHeight = $scope.data.maxContHeights[0];
    $scope.stackContInd = $scope.data.yesNo[0];
    $scope.collectContStep = $scope.data.yesNo[0];
    $scope.note = "";
  }
  
  
  /*
    This function is called each time a field is updated.
  */
  $scope.teamChanged = function() {
    //TODO: Figure out why Stack Containers Independently isn't populating when 
    //the robot is selected after the value has been persisted
    var editTeam = angular.copy($scope.selectedRobot);
    editTeam.driveMode = $scope.driveMode || $scope.data.driveModes[0];
    editTeam.driveSpeed = $scope.driveSpeed || $scope.data.driveSpeeds[0];
    editTeam.driveOverPlatform = $scope.driveOverPlatform || $scope.data.yesNo[0];
    editTeam.autonomousCapability = $scope.autonomousCapability || $scope.data.autonomousCapabilities[0];
    editTeam.coopStep = $scope.coopStep || $scope.data.coopStepOptions[0];
    editTeam.pickupLoc = $scope.pickupLoc || $scope.data.pickupLocs[0];
    editTeam.maxToteHeight = $scope.maxToteHeight || $scope.data.maxToteHeights[0];
    editTeam.maxContHeight = $scope.maxContHeight || $scope.data.maxContHeights[0];
    editTeam.stackContInd = $scope.stackContInd || $scope.data.yesNo[0];
    editTeam.collectContStep = $scope.collectContStep || 0;
    editTeam.note = $scope.note || "";
    Team.update($scope.selectedRobot, editTeam);
  }
})






.controller('MatchScoutingController', function($scope, $stateParams, Team, TeamMatch, Match) {
  /*
    teamName: the name of the team
    robotName: the name of the robot that a team has
    matchNum: the match during which data was retrieved
    driveSpeed: how fast the robot can move about the field
    driveOverPlatform: whether the robot is capable of driving over the platform
    botSet: was the robot able to create a Robot Set?
    toteSet: was the robot able to create a Tote Set?
    containerSet: was the robot able to create a Container Set?
    stackedToteSet: was the robot able to create a Stacked Tote Set?
    coopScoreStep: how many points did the robot score on the cooperative step?
    feedstation: did the robot collect from the human player station?
    landfill: did the robot pick up from the landfill?
    scoredToteHeight: what is the highest number of totes the robot stacked?
    containerStep: did the robot pick up a container from the step?
    scoredIndContainerHeight: [TODO: Consult with Brandon on this field]
    scoredContainerHeight: [TODO: Consult with Brandon on this field]
  */
  $scope.data = {
    yesNo: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    driveSpeeds: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Slow'},
      {id: '2', name: 'Medium'},
      {id: '3', name: 'Fast'}
    ]
  }

  //Pull matches out of the database. They are not dependent on other values,
  //so there is no need to wrap them in a function
  Match.all().then(function(matches) {
    $scope.matches = matches;
  })

  /*
    This function is called when the user changes the team. It loads values for
    the fields from the SQLite database or, if there is no record for the 
    selected team, it sets all of the fields to [Unknown]. 
  */
  $scope.selectTeam = function() {
    /** TEST START **/
    alert("$scope.selectTeam triggered");
    /** TEST END **/
    
    //the if statement skips the contents if this function was triggered by the 
    //field being set to no-value or if both a team and match haven't been 
    //selectd
    if ($scope.selectedTeam && $scope.match) {
      //retrieve all team data for the selected team
      TeamMatch.getById($scope.selectedTeam.id, $scope.match.id).then(function(team) {
        //verify that a team was returned instead of null (null = no matching record in the db)
        if (team) {
          
          /** TEST BEGIN **/
          console.log("TeamMatch.getById found a team/match combination");
          /** TEST END **/
          
          
          //set the current team
          $scope.team = team;
          
          //set the values for the fields in the form based on the database if they
          //exist. Otherwise, set to the unselected value.
          if (team.driveSpeed) {
            alert("Setting drive speed to " + team.driveSpeed);
            $scope.driveSpeed = $scope.data.driveSpeeds[team.driveSpeed];
          } else {
            alert("Setting team drive speed to the default");
            $scope.driveSpeed = $scope.data.driveSpeeds[0];
          }
          
          if (team.driveOverPlatform) {
            $scope.driveOverPlatform = $scope.data.yesNo[team.driveOverPlatform];
          } else {
            $scope.driveOverPlatform = $scope.data.yesNo[0];
          }
          
          if (team.botSet) {
            $scope.botSet = $scope.data.yesNo[team.botSet];
          } else {
            $scope.botSet = $scope.data.yesNo[0];
          }
          
          if (team.toteSet) {
            $scope.toteSet = $scope.data.yesNo[team.toteSet];
          } else {
            $scope.toteSet = $scope.data.yesNo[0];
          }
          
          if (team.containerSet) {
            $scope.containerSet = $scope.data.yesNo[team.containerSet];
          } else {
            $scope.containerSet = $scope.data.yesNo[0];
          }
          
          if (team.stackedToteSet) {
            $scope.stackedToteSet = $scope.data.yesNo[team.stackedToteSet];
          } else {
            $scope.stackedToteSet = $scope.data.yesNo[0];
          }
          
          if (team.coopScoreStep) {
            $scope.coopScoreStep = team.coopScoreStep
          } else {
            $scope.coopScoreStep = 0;
          }
          
          if (team.feedstation) {
            $scope.feedstation = $scope.data.yesNo[team.feedstation];
          } else {
            $scope.feedstation = $scope.data.yesNo[0];
          }
          
          if (team.landfill) {
            $scope.landfill = $scope.data.yesNo[team.landfill];
          } else {
            $scope.landfill = $scope.data.yesNo[0];
          }
          
          if (team.scoredToteHeight) {
            $scope.scoredToteHeight = team.scoredToteHeight;
          } else {
            $scope.scoredToteHeight = 0;
          }
          
          if (team.containerStep) {
            $scope.containerStep = $scope.data.yesNo[team.containerStep];
          } else {
            $scope.containerStep = $scope.data.yesNo[0];
          }
          
          if (team.scoredIndContainerHeight) {
            $scope.scoredIndContainerHeight = team.scoredIndContainerHeight;
          } else {
            $scope.scoredIndContainerHeight = 0;
          }
          
          if (team.scoredContainerHeight) {
            $scope.scoredContainerHeight = team.scoredContainerHeight;
          } else {
            $scope.scoredContainerHeight = 0;
          }
        } else {
          //if no database record, set all fields to unselected values for the 
          //form to display
          $scope.driveSpeed = $scope.data.driveSpeeds[0];
          $scope.driveOverPlatform = $scope.data.yesNo[0];
          $scope.botSet = $scope.data.yesNo[0];
          $scope.toteSet = $scope.data.yesNo[0];
          $scope.containerSet = $scope.data.yesNo[0];
          $scope.stackedToteSet = $scope.data.yesNo[0];
          $scope.coopScoreStep = 0;
          $scope.feedstation = $scope.data.yesNo[0];
          $scope.landfill = $scope.data.yesNo[0];
          $scope.scoredToteHeight = 0;
          $scope.containerStep = $scope.data.yesNo[0];
          $scope.scoredIndContainerHeight = 0;
          $scope.scoredContainerHeight = 0;
          
          //then create a robot object with the same values
          var newTeamMatch = [];
          newTeamMatch.robotId = $scope.selectedRobot.id;
          newTeamMatch.matchId = $scope.match.id;
          newTeamMatch.driveSpeed = $scope.data.driveSpeeds[0];
          newTeamMatch.driveOverPlatform = $scope.data.yesNo[0];
          newTeamMatch.botSet = $scope.data.yesNo[0];
          newTeamMatch.toteSet = $scope.data.yesNo[0];
          newTeamMatch.containerSet = $scope.data.yesNo[0];
          newTeamMatch.stackedToteSet = $scope.data.yesNo[0];
          newTeamMatch.coopScoreStep = 0;
          newTeamMatch.feedstation = $scope.data.yesNo[0];
          newTeamMatch.landfill = $scope.data.yesNo[0];
          newTeamMatch.scoredToteHeight = 0;
          newTeamMatch.containerStep = $scope.data.yesNo[0];
          newTeamMatch.scoredIndContainerHeight = 0;
          newTeamMatch.scoredContainerHeight = 0;
          
          //and then persist the values to a new data store record
          console.log("Adding new records to TeamMatch with team ID '" + newTeamMatch.teamId + "' and match ID '" + newTeamMatch.matchId + "'");
          TeamMatch.add(newTeamMatch);
        }
      })
    }
  }
  
  /*
    This function is called when a match number is selected
  */
  $scope.selectMatch = function() {
    $scope.selectRobot();
  }
  
  /*
    This function is called each time a field is updated.
  */
  $scope.teamMatchChanged = function() {
    var editTeamMatch = angular.copy($scope.selectedTeam);
    
    if ($scope.driveSpeed) {
      editTeamMatch.driveSpeed = angular.copy($scope.driveSpeed);
    } else {
      editTeamMatch.driveSpeed = $scope.data.driveSpeeds[0];
    }
    
    if ($scope.driveOverPlatform) {
      editTeamMatch.driveOverPlatform = angular.copy($scope.driveOverPlatform);
    } else {
      editTeamMatch.driveOverPlatform = $scope.data.yesNo[0];;
    }
    
    if ($scope.botSet) {
      editTeamMatch.botSet = angular.copy($scope.botSet);
    } else {
      editTeamMatch.botSet = $scope.data.yesNo[0];
    }
    
    if ($scope.toteSet) {
      editTeamMatch.toteSet = angular.copy($scope.toteSet);
    } else {
      editTeamMatch.toteSet = $scope.data.yesNo[0];
    }
    
    if ($scope.containerSet) {
      editTeamMatch.containerSet = angular.copy($scope.containerSet);
    } else {
      editTeamMatch.containerSet = $scope.data.yesNo[0];
    }
    
    if ($scope.stackedToteSet) {
      editTeamMatch.stackedToteSet = angular.copy($scope.stackedToteSet);
    } else {
      editTeamMatch.stackedToteSet = $scope.data.yesNo[0];
    }
    
    if ($scope.coopScoreStep) {
      editTeamMatch.coopScoreStep = angular.copy($scope.coopScoreStep);
    } else {
      editTeamMatch.coopScoreStep = 0;
    }
    
    if ($scope.feedstation) {
      editTeamMatch.feedstation = angular.copy($scope.feedstation);
    } else {
      editTeamMatch.feedstation = $scope.data.yesNo[0];
    }
    
    if ($scope.landfill) {
      editTeamMatch.landfill = angular.copy($scope.landfill);
    } else {
      editTeamMatch.landfill = $scope.data.yesNo[0];
    }
    
    if ($scope.scoredToteHeight) {
      editTeamMatch.scoredToteHeight = angular.copy($scope.scoredToteHeight);
    } else {
      editTeamMatch.scoredToteHeight = 0;
    }
    
    if ($scope.containerStep) {
      editTeamMatch.containerStep = angular.copy($scope.containerStep);
    } else {
      editTeamMatch.containerStep = $scope.data.yesNo[0];
    }
    
    if ($scope.scoredIndContainerHeight) {
      editTeamMatch.scoredIndContainerHeight = angular.copy($scope.scoredIndContainerHeight);
    } else {
      editTeamMatch.scoredIndContainerHeight = 0;
    }
    
    if ($scope.scoredContainerHeight) {
      editTeamMatch.scoredContainerHeight = angular.copy($scope.scoredContainerHeight);
    } else {
      editTeamMatch.scoredContainerHeight = 0;
    }
    
    if ($scope.match) {
      editTeamMatch.matchId = angular.copy($scope.match.id);
    }
    
    TeamMatch.update($scope.selectedTeam, editTeamMatch);
  }
});
