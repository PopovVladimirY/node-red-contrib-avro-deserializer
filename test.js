var avro = require('avro-js')
const { Kafka, logLevel } = require('kafkajs')


avro_schema = {
    "namespace": "msensor.avro",
    "type": "record",
    "name": "msensor",
    "fields": [
        {"name": "device", "type": ["string", "null"]},
        {"name": "timestamp", "type": ["float", "null"]},
        {"name": "wakeup_count", "type": ["int", "null"]},
        {"name": "temperature",  "type": ["float", "null"]},
        {"name": "pressure", "type": ["float", "null"]},
        {"name": "humidity", "type": ["float", "null"]},
        {"name": "battery", "type": ["float", "null"]},
        {"name": "soil", "type": ["float", "null"]}
    ]
};

const kafka = new Kafka({
        logLevel: logLevel.INFO,
        brokers: [`192.168.200.12:9092`],
        clientId: 'example-consumer',
    });
  
var msensor_type = avro.parse(avro_schema);

const topic = 'red_msensor_live_topic'
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      var value = message.value;
      var stats = msensor_type.fromBuffer(message.value);
      console.log(stats)
      var data = {}
      for (const [key, el] of Object.entries(stats)) {
        console.log(key);
        for (const [idx, x] of Object.entries(el)) {
          data[key] = x;
          console.log(x)
        }
      }
      console.log(data);

      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}`)
    },
  })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
