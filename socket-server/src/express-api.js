var express = require("express");
var port = 3700;

var opcua = require("node-opcua");
var async = require("async");
var fs = require('fs');


var jsonFile = require('jsonfile');
var fileName = 'model.json';
let jsonData = jsonFile.readFileSync(fileName);
var copyJsonData = JSON.parse(JSON.stringify(jsonData));
console.log(copyJsonData);

/*
jsonFile.readFile(fileName, function(err, jsonData) {
  if (err) throw err;
  for (var i = 0; i < jsonData.length; ++i) {

    console.log("Emp ID: "+jsonData[i].id);
    console.log("Emp Name: "+jsonData[i].activity);
    console.log("Emp Address: "+jsonData[i].rotability);
    console.log("Designation: "+jsonData[i].description);
    console.log("----------------------------------");
  }
});
*/

/**
 *   Let´s connect to the OPC server
 */

var client = new opcua.OPCUAClient({});
var hostname = require("os").hostname().toUpperCase();
var endpointUrl = "opc.tcp://" + hostname + ":4204/MyLittleServer";
var the_subscription, the_session;
var userIdentity = null;
//xx var  userIdentity = { userName: "opcuauser", password: "opcuauser" };


async.series([
  // step 1 : connect to
  function (callback) {
    console.log(" connecting to ", endpointUrl.cyan.bold);
    client.connect(endpointUrl, callback);
  },
  // step 2 : createSession
  function (callback) {
    client.createSession(userIdentity, function (err, session) {
      if (!err) {
        the_session = session;
        console.log(" session created".yellow);
      }
      callback(err);
    });
  },
  // step 3: install a subscription and install a monitored item
  function (callback) {
    the_subscription = new opcua.ClientSubscription(the_session, {
      requestedPublishingInterval: 1000, //important pour pouvoir reguler le temps d´intervalle minimal dans le setInterval plus bas.
      requestedMaxKeepAliveCount: 2000,
      requestedLifetimeCount: 6000,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10
    });
    the_subscription.on("started", function () {
      console.log("subscription started");
      callback();
    }).on("keepalive", function () {
      console.log("keepalive");

    }).on("terminated", function () {
      console.log(" TERMINATED ------------------------------>")
    });

  }
], function (err) {
  if (!err) {
    startHTTPServer();
  } else {
    // cannot connect to client
    console.log(err);
  }
});


/**
 *   here, we start the http-server && put all the subscription Logic within
 */

function startHTTPServer() {
  var app = express();
  app.get("/", function (req, res) {
    res.send("Express -Api  works!");
  });
  app.use(express.static(__dirname + '/'));

  var io = require('socket.io').listen(app.listen(port));

  io.sockets.on('connection', function (socket) {
    console.log('Socket succesfully connected with id: ' + socket.id ) ;
    let currentSocket_id = socket.id ;
     socket.on('disconnect', function (socket) {
        console.log(`Socket with id : ${currentSocket_id} , got disconnected `);
     });
  });

  var monitoredItem = the_subscription.monitor(
    {
      nodeId: "ns=1;b=1020FFAB",
      browseName: "MyVariable2",
      attributeId: 13
    },
    {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100
    },
    opcua.read_service.TimestampsToReturn.Both, function (err) {
      if (err) {
        console.log("Monitor  " + nodeIdToMonitor.toString() + " failed");
        console.loo("ERr = ", err.message);
      }
    }
  );
  var monitoredItem2 = the_subscription.monitor(
    {
      nodeId: "ns=1;b=1020FFAA"
    },
    {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100
    },
    opcua.read_service.TimestampsToReturn.Both, function (err) {
      if (err) {
        console.log("Monitor  " + nodeIdToMonitor.toString() + " failed");
        console.loo("ERr = ", err.message);
      }

    }
  );
  var monitoredItem3 = the_subscription.monitor(
    {
      nodeId: "ns=1;b=1020FFAC"
    },
    {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100
    },
    opcua.read_service.TimestampsToReturn.Both, function (err) {
      if (err) {
        console.log("Monitor  " + nodeIdToMonitor.toString() + " failed");
        console.loo("ERr = ", err.message);
      }

    }
  );

  var monitoredItem4 = the_subscription.monitor(
    {
      nodeId: "s=free_memory"
    },
    {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100
    },
    opcua.read_service.TimestampsToReturn.Both, function (err) {
      if (err) {
        console.log("Monitor  " + nodeIdToMonitor.toString() + " failed");
        console.loo("ERr = ", err.message);
      }

    }
  );

  monitoredItem.on("changed", function (dataValue) {
    jsonData[0].rotability = dataValue.value.value;
    /*   io.sockets.emit('dataChanged', {
         value: jsonData
         timestamp: dataValue.serverTimestamp,
         nodeId: nodeIdToMonitor.toString(),
         browseName: "rotability"
        });
    */
  });

  monitoredItem2.on("changed", function (dataValue) {
    jsonData[1].rotability = dataValue.value.value;
  });

  monitoredItem3.on("changed", function (dataValue) {
    jsonData[2].rotability = dataValue.value.value;
  });

  monitoredItem4.on("changed", function (dataValue) {
    jsonData[3].rotability = dataValue.value.value;
  });


  setInterval(() => {
    var n = JSON.stringify(copyJsonData).localeCompare(JSON.stringify(jsonData));
    if (n !== 0) {
      io.sockets.emit('dataChanged', {
        value: jsonData
      });
      copyJsonData = JSON.parse(JSON.stringify(jsonData));
      //writeToJsonFile(fileName, jsonData);
    }
  }, 100)


  io.sockets.on('resetAll', () => {
    console.log("RESET- Event received !! ");
    for (let i = 0; i < jsonData.length; i++) {
      jsonData[i].rotability = 0;
    }
    copyJsonData = JSON.parse(JSON.stringify(jsonData));
    writeToJsonFile(fileName, jsonData);
  });

}

function writeToJsonFile(myFile, myData) {
  /**
   *  update the model JSON file, we add the parameter in the Json.stringify Function to maintain a JSON Format
   */
  fs.writeFile(myFile, JSON.stringify(myData, null, 4), 'utf8', function (err) {
    if (err) throw err;
    // if no error
    //console.log("Data is written to file successfully.")});
  });
}

console.log("Listening on port " + port);

