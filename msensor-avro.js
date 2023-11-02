module.exports = function(RED) {
    function MsensorNode(config) {
        RED.nodes.createNode(this.config);
        var node = this;
        node.on('input', function(msg, send, done) 
        {
            error(msg)
            // do something with 'msg'
            msg.payload = msg.payload;
            send(msg);

            // Once finished, call 'done'.
            // This call is wrapped in a check that 'done' exists
            // so the node will work in earlier versions of Node-RED (<1.0)
//            err = ""
            if (done) {
//                done(err);
                done();
            }
        });
        
        node.on('close', function(removed, done) {
            // tidy up any state
            if (removed){
                // this node has been disabled/deleted
            }
            else {
                // this node is being restarted
            }
            done();
        });

    }
    RED.nodes.registerType("msensor-avro", MsensorNode);
}