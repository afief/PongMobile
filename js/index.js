var game;
function init() {
	var dimensi = {width: 1000, height: 444};

	game = new Phaser.Game(dimensi.width, dimensi.height, Phaser.CANVAS, 'arena', null, false);
	game.state.add("game", Game);
	game.state.start("game");
}

window.addEventListener("load", init);