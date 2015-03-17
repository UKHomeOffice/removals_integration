module.exports = function(io) {

    io.sockets.on('connection', function (socket) {
        console.log("connection made at " + new Date());
        socket.emit('centre-update',"socket centre update");
        socket.on('captain', function(data) {
            console.log(data);
            socket.emit('Hello');
        });
    });
};
