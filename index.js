const express = require('express')
const app = express()
const mqtt = require('mqtt')
const bodyParser = require('body-parser')
app.use(bodyParser.text())

app.post('/:url/:topic', (req, res) => {
  const { url, topic } = req.params
  const client = mqtt.connect(`mqtt://${url}`)

  client.on('connect', () => {
    client.subscribe(topic, (err) => {
      if (!err) {
        client.publish(topic, req.body)
      }
    })
  })

  client.on('message', (topic, message) => {
    res.send(message.toString())
    client.end()
  })
})

app.listen(3000, () => console.log(`Running!`))
