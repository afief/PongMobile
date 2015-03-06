function init() {
	var dimensi = {width: 1000, height: 550};

	Phaser.Group.prototype.staticWidth = 0;
	Phaser.Group.prototype.staticHeight = 0;

	var game = new Phaser.Game(dimensi.width, dimensi.height, Phaser.CANVAS, 'arena', null, false);
	game.state.add("game", Game);
	game.state.start("game");
}

window.addEventListener("load", init);