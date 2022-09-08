const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
    const event = req.body;

    events.push(event);

    try {

      const p1 = axios.post('http://posts-clusterip-srv:4000/events', event);
      const p2 = axios.post('http://comments-clusterip-srv:4001/events', event);
      const p3 = axios.post('http://query-clusterip-srv:4002/events', event);
      const p4 = axios.post('http://moderation-clusterip-srv:4003/events', event);

      await Promise.all([p1,p2,p3,p4]);

    } catch(err) {
      console.log(err.message);
    }

    res.send({ status: 'OK' });

});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});