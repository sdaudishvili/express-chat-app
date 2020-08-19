/* eslint-disable no-underscore-dangle */
const { emit } = require('process');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render(`${__dirname}/index.html`);
});

let users = [];
let usersTyping = [];

io.on('connection', (socket) => {
  const { username } = socket.request._query;
  users.push(username);
  console.log(`${username} connected!`);
  io.emit('users connection changed', users);

  socket.on('disconnect', () => {
    users = users.filter((x) => x !== username);
    usersTyping = usersTyping.filter((x) => x !== username);
    io.emit('users connection changed', users);
    io.emit('typing', usersTyping);
    console.log(`${username} disconnected!`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    usersTyping = usersTyping.filter((x) => x !== username);
    io.emit('typing', usersTyping);
  });

  socket.on('typing', (data) => {
    if (data.msg) {
      if (!usersTyping.includes(data.username)) {
        usersTyping.push(data.username);
        io.emit('typing', usersTyping);
      }
    } else {
      usersTyping = usersTyping.filter((x) => x !== data.username);
      io.emit('typing', usersTyping);
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
