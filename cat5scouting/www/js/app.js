var db = null;

angular.module('cat5scouting', ['ionic', 'cat5scouting.controllers', 'cat5scouting.services', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if (window.cordova) {
      db = $cordovaSQLite.openDB("cat5scouting.db");
    } else {
      db = window.openDatabase("cat5scouting.db", "1.0", "cat5scouting", -1);
    }
    
    /* Delete the database to start from scratch
     * Add to this section each time you add a new table definition */
     
      $cordovaSQLite.execute(db, "DROP TABLE `team`");
      $cordovaSQLite.execute(db, "DROP TABLE `match`");
      $cordovaSQLite.execute(db, "DROP TABLE `teamMatch`");
    /**/

    /* The following tables should be updated each year to match the questions
       that match that year's competition. The following questions match the 
       2015 FRC competition. Each team will likely have its own list of 
       questions. See the documentation for the project for details about 
       branching this code so that you can keep your secret sauce secret. */

    /* The team table contains information ab out the team, itself, as well as
       the claims that they make about their robot's capabilities (known as "pit
       scouting.") */
    
    $cordovaSQLite.execute(db, "CREATE TABLE `team` ( `id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
                                                   + "`name` TEXT UNIQUE,	" 
                                                   + "`number` INTEGER NOT NULL UNIQUE, "
                                                   + "`driveMode` INTEGER, "
                                                   + "`driveSpeed` INTEGER, "
                                                   + "`driveOverPlatform` INTEGER, "
                                                   + "`autonomousCapability` INTEGER, "
                                                   + "`coopStep` INTEGER, "
                                                   + "`pickupLoc` INTEGER, "
                                                   + "`maxToteHeight` INTEGER, "
                                                   + "`maxContHeight` INTEGER, "
                                                   + "`stackContInd` INTEGER, "
                                                   + "`collectContStep` INTEGER, "
                                                   + "`note` TEXT)");
    
    /* The match table contains a list of numbers from 1 to n, where n is the 
    number of matches planned for a given competition */

    $cordovaSQLite.execute(db, "CREATE TABLE `match` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `number` INTEGER NOT NULL UNIQUE)");

    /* The teamMatch table contains information about the observed capabilties 
       for a robot within a given match (known as "match scouting"). */

    $cordovaSQLite.execute(db, "CREATE TABLE `teamMatch` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
                                                        + "`matchId` INTEGER, "
                                                        + "`teamId` INTEGER, "
                                                        + "`driveSpeed` INTEGER, "
                                                        + "`driveOverPlatform` INTEGER, "
                                                        + "`botSet` INTEGER, "
                                                        + "`toteSet` INTEGER, "
                                                        + "`containerSet` INTEGER, "
                                                        + "`stackedToteSet` INTEGER, "
                                                        + "`coopScoreStep` INTEGER, "
                                                        + "`feedstation` INTEGER, "
                                                        + "`landfill` INTEGER, "
                                                        + "`scoredToteHeight` INTEGER, "
                                                        + "`containerStep` INTEGER, "
                                                        + "`scoredIndContainerHeight` INTEGER, "
                                                        + "`scoredContainerHeight` INTEGER, "
                                                        + "FOREIGN KEY(`matchId`) REFERENCES match ( id ), "
                                                        + "FOREIGN KEY(`teamId`) REFERENCES team ( id ))");
    
    /* Load the database with test values
     * Add to this section each time you add a new table definition
     * if appropriate */
    
    /*
    var query = "INSERT INTO team (name, number) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["Category 5", 3489]).then(function(res) {
      console.log("team insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
     
    var query = "INSERT INTO team (name, number) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["The Burning Magnetos", 342]).then(function(res) {
      console.log("team insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    */
    
    var teams = [
                  1225, 1226, 1293, 1398, 1553, 1598, 1758, 2059, 281, 2815, 
                  283, 342, 343, 3489, 3490, 3976, 408, 4451, 4533, 4534, 
                  4901, 4935, 4955, 4965, 8101
                ];
                
    var query = "INSERT INTO team (name, number) VALUES (?,?)";
    for (var i=0; i<teams.length; i++) {
      $cordovaSQLite.execute(db, query, ["Team "+ teams[i], i]).then(function(res) {
        console.log("team insertId: " + res.insertId);
      }, function (err) {
        console.error(err);
      });
    }
    
    for (var i=1; i<32; i++) {
      var query = "INSERT INTO match (number) VALUES (?)";
      $cordovaSQLite.execute(db, query, [i]).then(function(res) {
        console.log("match insertId: " + res.insertId);
      }, function (err) {
        console.error(err);
      });
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  
  .state('app.pit', {
    url: '/pit',
    views: {
      'menuContent': {
        templateUrl: 'templates/pit.html',
        controller: 'PitCtrl'
      }
    }
  })

  .state('app.match', {
    url: '/match',
    views: {
      'menuContent': {
        templateUrl: 'templates/match.html',
        controller: 'MatchCtrl'
      }
    }
  })
  
  .state('app.sync', {
    url: '/sync',
    views: {
      'menuContent': {
        templateUrl: 'templates/sync.html',
        controller: 'SyncCtrl'
      }
    }
  })
  
  .state('app.config', {
    url: '/config', 
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
