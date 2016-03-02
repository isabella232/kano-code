'use strict';

let rooms = {},
    id = 0,
    restify = require('restify'),
    server = restify.createServer({
        name: 'signaling'
    });

server.use(restify.CORS());
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.post('/create', (req, res) => {
    let body = JSON.parse(req.body);
    rooms[id] = {
        offer: body.offer,
        id: id
    };
    res.send(rooms[id]);
    id++;
});

server.post('/join/:id', (req, res) => {
    let body = JSON.parse(req.body);
    rooms[req.params.id].answer = body.answer;
    res.send(rooms[req.params.id]);
});

server.get('/join/:id', (req, res) => {
    console.log(rooms);
    res.send(rooms[req.params.id]);
});

server.listen(2222);
