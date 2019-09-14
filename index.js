var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let totalOnlineUsers = 0;
let usersOnline = [];

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('user connected');
  totalOnlineUsers++;
  
  socket.on('chat message', payload => {
		io.emit('chat message', payload);
	});

	io.emit('users online', { totalUsers: totalOnlineUsers });

	socket.on('user typing', payload => {
		io.emit('user typing', payload);
  });

  socket.on('user joined', payload => {
    usersOnline.push(payload);
    io.emit('user joined', usersOnline);
  });

  io.emit('user joined', usersOnline);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    totalOnlineUsers--;
    io.emit('users online', { usersOnline: totalOnlineUsers });

    var i = usersOnline.findIndex(x => x.socketId === socket.id);
    if (i > -1) {
      usersOnline.splice(i, 1);
    }
    io.emit('user left', usersOnline);
    io.emit('whos online', usersOnline);
	});
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, function() {
	console.log(`listening on *:${PORT}`);
});
