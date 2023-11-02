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
                    msg.payload = msensor_type.fromBuffer(msg.payload.value);
                    node.error(msg.payload['temperature']);
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

