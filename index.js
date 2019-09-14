var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let totalOnlineUsers = 0;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  totalOnlineUsers++;
  console.log('a user connected');

  socket.on('disconnect', () => {
    totalOnlineUsers--;
    console.log('a user disconnected');
    io.emit('users online', { usersOnline: totalOnlineUsers });
  });

  socket.on('chat message', (payload) => {
    console.log(payload);
    io.emit('chat message', payload);
  });

  io.emit('users online', { usersOnline: totalOnlineUsers });

  socket.on('user typing', (payload) => {
    io.emit('user typing', payload);
  });

  console.log(`${totalOnlineUsers} users online`);
});


const PORT = process.env.PORT || 5000;
http.listen(PORT, function() {
	console.log(`listening on *:${PORT}`);
});
