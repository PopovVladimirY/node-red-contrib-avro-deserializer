module.exports = function(RED) {

    function MsensorAvro(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.avroSchema = config.avroSchema || "default avro schema"
        node.on('input', function(msg) {
            node.log(node.avroSchema);
            msg.payload = msg.payload.toLowerCase() + node.avroSchema.toString();
            node.send(msg);
        });
    }
    RED.nodes.registerType("msensor-avro",MsensorAvro);
}

