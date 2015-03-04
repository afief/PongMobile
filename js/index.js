function init() {
	var dimensi = {width: 900, height: 444};

	var table;
	var ball;
	var bats = [];
	var pointer1Bat;
	var pointer2Bat;

	var game = new Phaser.Game(dimensi.width, dimensi.height, Phaser.CANVAS, 'arena', {preload: onPreload, create: onCreate, update: onUpdate, render: onRender}, false);
	function onPreload() {
		game.load.image("table", "images/pingpong_table.png");
		game.load.image("ball", "images/ball.png");
		game.load.image("bat_blue", "images/bat_blue.png");
		game.load.image("bat_red", "images/bat_red.png");
	}
	function onCreate() {
		game.stage.backgroundColor = '#ffffff';
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

		table = game.add.sprite(0, 0, "table");
		table.anchor.set(0.5, 0.5);
		table.x = game.width / 2;
		table.y = game.height / 2;

		ball = game.add.sprite(0, 0, "ball");
		ball.anchor.set(0.5, 0.5);
		ball.x = game.width / 2;
		ball.y = game.height / 2;

		bats[0] = game.add.sprite(0,0, "bat_blue");
		bats[0].anchor.set(0, 0.5);
		bats[0].scale.set(0.4, 0.4);
		bats[0].x = 0;
		bats[0].y = game.height / 2;

		bats[1] = game.add.sprite(0,0, "bat_red");
		bats[1].anchor.set(1, 0.5);
		bats[1].scale.set(0.4, 0.4);
		bats[1].x = game.width;
		bats[1].y = game.height / 2;

		game.input.addPointer();
		game.input.addPointer();
	}
	function onUpdate() {

		//controller update
		if (game.input.pointer1.isDown) {
			if (game.input.pointer1.x > (game.width/2))
				pointer1Bat = bats[1];
			else
				pointer1Bat = bats[0];

			pointer1Bat.y = game.input.pointer1.y;
		}
		if (game.input.pointer2.isDown) {
			if (pointer1Bat == bats[0])
				pointer2Bat = bats[1];
			else
				pointer2Bat = bats[0];

			pointer2Bat.y = game.input.pointer2.y;
		}
	}
	function onRender() {
		// game.debug.pointer(game.input.pointer1);
		// game.debug.pointer(game.input.pointer2);
	}
}

window.addEventListener("load", init);