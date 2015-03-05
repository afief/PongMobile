var gs = function(http) {
	var io = require('socket.io')(http);

	/* SOCKET*/
	var gameList = {};

	io.on("connection", function(socket) {

		var idGame = "";
		var isServer = false;

		/* IF SOCKET IS GAME */
		socket.on("game", function(regId) {
			regId = regId || "";
			if ((gameList[regId] != undefined) || (regId == ""))
				idGame = makeid(3);
			else
				idGame = regId;

			socket.join(idGame);
			gameList[idGame] = {socket: socket, players: new Array()};

			isServer = true;

			socket.emit("registered", {result: true, id: idGame});
			console.log("_____________________________________ game login ", idGame);

			/* Add Event to Game Socket */
			socket.on("gameOver", function(data) {
				console.log("game over");
				io.to(idGame).emit("gameOver", data);
				if (gameList[idGame] != undefined) {
					for (var i = 0; i < gameList[idGame].players.length; i++) {
						if (gameList[idGame].players[i].id == data.loseId) {
							gameList[idGame].players.splice(i, 1);
						}
					}
				}
			});
			socket.on("start", function(res) {
				io.to(res.player1ID).emit("start");
				io.to(res.player2ID).emit("start");
			});
			socket.on("disconnect", function() {
				gameList[idGame] = undefined;
			});
		});

		socket.on("player", function(obj) {
			idGame = obj.kode;

			if (gameList[idGame] == undefined) {
				socket.emit("related", {result: false, message: "Tidak ada game dengan URL yang dimaksud."});
				return;
			}

			socket.emit("related", {result: true});
			socket.on("register", function(obj) {
				socket.join(idGame);

				if (gameList[idGame] != undefined) {
					gameList[idGame].players.push({id: socket.id, name: obj.name});
				}

				socket.emit("registered", {id: socket.id, name: obj.name, players: gameList[idGame].players});
				io.to(idGame).emit("newplayer", {id: socket.id, name: obj.name});

				console.log("_____________________________________ plyr login ", idGame, socket.id);

				/* Add Event Player Socket */
				socket.on("move", function(val) {
					if (gameList[idGame] != undefined) {
						gameList[idGame].socket.emit("move", {id: socket.id, val: val});
					}
				});
			});
			socket.on("disconnect", function() {
				io.to(idGame).emit("playerremove", {id: socket.id});
				if (gameList[idGame] != undefined) {
					for (var i = 0; i < gameList[idGame].players.length; i++) {
						if (gameList[idGame].players[i].id == socket.id)
							gameList[idGame].players.splice(i, 1);
					}
				}
			})
		});

		socket.on("disconnect", function() {
			if (isServer) {
				console.log("disconnect server -", idGame);

			}
		});

	});
function makeid(num) {
	num = num || 5;
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyz23456780";

	for( var i=0; i < num; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	if (gameList[text] != undefined)
		text = makeid();

	return text;
}
}

module.exports = gs;