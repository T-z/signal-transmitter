/*global require,console,setTimeout */
const opcua = require("node-opcua");
const async = require("async");

const client = new opcua.OPCUAClient();

// set the link to server-Adress
const endpointUrl = "opc.tcp://" + require("os").hostname().toUpperCase() + ":4204/MyLittleServer";

let the_session, the_subscription;

async.series([

    // step 1 : connect to
    function(callback)  {
      client.connect(endpointUrl, function (err) {
        if(err) {
          console.log(" cannot connect to endpoint :" , endpointUrl );
        } else {
          console.log("connected !");
        }
        callback(err);
      });
    },

    // step 2 : createSession
    function(callback) {
      client.createSession( function(err, session) {
        if(!err) {
          the_session = session;
        }
        callback(err);
      });
    },

    // step 3 : browse
    function(callback) {
      the_session.browse("RootFolder", function(err, browseResult) {
        if(!err) {
          browseResult.references.forEach( function(reference) {
            console.log( reference.browseName.toString());
          });
        }
        callback(err);
      });
    },

    // step 4 : read a variable with readVariableValue
    function(callback) {
      the_session.readVariableValue("ns=1;b=1020FFAB", function(err, dataValue) {
        if (!err) {
          console.log(" value 1 = " , dataValue.value);
        }
        callback(err);
      });
    },

    // step 4' : read a variable with read
    function(callback) {
      const maxAge = 0;
      const nodeToRead = { nodeId: "ns=1;b=1020FFAA", attributeId: opcua.AttributeIds.Value };

      the_session.read(nodeToRead, maxAge, function(err, dataValue) {
        if (!err) {
          console.log(" Value 2 = " , dataValue.value);
        }
        callback(err);
      });
    },

    // step 5: install a subscription and install a monitored item for 10 seconds
    function(callback) {
      the_subscription = new opcua.ClientSubscription(the_session, {
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 10,
        requestedMaxKeepAliveCount: 2,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 10
      });

      the_subscription.on("started", function() {
        console.log("subscription started for 2 seconds - subscriptionId=",the_subscription.subscriptionId);
      }).on("keepalive", function() {
        console.log("keepalive");
      }).on("terminated", function() {
        console.log("terminated");
      });

      setTimeout( function() {
        the_subscription.terminate(callback);
      }, 10000);

      // install monitored item
      const monitoredItem  = the_subscription.monitor({
          nodeId: opcua.resolveNodeId("ns=1;s=free_memory"),
          attributeId: opcua.AttributeIds.Value
        },
        {
          samplingInterval: 100,
          discardOldest: true,
          queueSize: 10
        },
        opcua.read_service.TimestampsToReturn.Both
      );
      console.log("-------------------------------------");

      monitoredItem.on("changed", function(dataValue) {
        console.log(" % free mem = ", dataValue.value.value);
      });
    },

    // close session
    function(callback) {
      the_session.close( function(err) {
        if(err) {
          console.log("closing session failed ?");
        }
        callback();
      });
    }

  ],
  function(err) {
    if (err) {
      console.log(" failure ",err);
    } else {
      console.log("done!");
    }
    client.disconnect(function(){});
  }) ;
