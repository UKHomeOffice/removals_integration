module.exports = function(io) {

    io.sockets.on('connection', function (socket) {
        console.log("io connection made at " + new Date());
/*
        socket.on('chicken',function(data){
            console.log('socket got '+data);
        });
*/
    });
};
