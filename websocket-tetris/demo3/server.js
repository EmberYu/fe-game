var app = require('http').createServer();
var io = require('socket.io')(app);
var clientCount = 0;
const PORT = 3000;
app.listen(PORT)

io.on('connection', function (socket) {
  clientCount ++
  socket.nickname = 'user' + clientCount;

  io.emit('enter', socket.nickname + " comes in");

  socket.on('message', function(str) {
    io.emit('message', socket.nickname + ' says: ' + str);
  })
  
  socket.on('disconnect', function(str) {
    io.emit('leave', socket.nickname + ' leave');
  })
});

console.log('Server is listening on port 3000, press ctrl+c to leave');