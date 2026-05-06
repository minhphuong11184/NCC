const {
    Kafka
} = require('kafkajs')
const utf8 = require('utf8')
const kafka = new Kafka({
    clientId: 'client002',
    brokers: ['127.0.0.1:9092']
})


const producer = kafka.producer()


const consumer = kafka.consumer({
    groupId: 'group002'
})

let string = Buffer.from('Hoàng Văn Hiếu!', 'utf-8')

const run = async () => {
    // // Producing
    // await producer.connect()
    // await producer.send({
    //     topic: 'test',
    //     messages: [{
    //         value: string
    //     }, ],
    // })
    // //console.log(string.toString())
    // //Consuming
    // await consumer.connect()
    // await consumer.subscribe({
    //     topic: 'test',
    //     fromBeginning: true
    // })

    await consumer.run({
        eachMessage: async ({
            topic,
            partition,
            message
        }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString('utf-8'),
            })
        },
    })
}

run().catch(console.error)