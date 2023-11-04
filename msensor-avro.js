var avro = require('avro-js')

module.exports = function(RED) {
    function MsensorAvro(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.avroSchema = config.avroSchema || "default avro schema"
        var msensor_type = avro.parse(node.avroSchema);

        node.on('input', function(msg, send, done) {
            try {
                if (Buffer.isBuffer(msg.payload.value)) {
                    stats = msensor_type.fromBuffer(msg.payload.value);
                    var data = {}
                    for (const [key, el] of Object.entries(stats)) {
                      for (const [idx, x] of Object.entries(el)) {
                        data[key] = x;
                      }
                    }                    
                    msg.payload = data;
                    send(msg);
                } else {
                    node.error("Payload is not Avro: " + msg.payload.value);
                }
                if (done) {
                    done();
                }
            }
            catch(err) {
                node.error(err.message);
            }                    
    });
    }
    RED.nodes.registerType("msensor-avro",MsensorAvro);
}

