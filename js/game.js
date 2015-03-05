var Game = function () {

	var table;
	var ball;
	var bats = [];
	var lastSmash;
	var pointer1Bat;
	var pointer2Bat;
	var isPlay = false;
	var direction;
	var speed;
	var tapText;

	var game;

	this.preload = function() {
		game = this.game;
		game.stage.disableVisibilityChange = true;

		game.load.image("table", "images/pingpong_table.png");
		game.load.image("ball", "images/ball.png");
		game.load.image("bat_blue", "images/bat_blue.png");
		game.load.image("bat_red", "images/bat_red.png");

		game.load.bitmapFont('comicneue_regular', 'images/fonts/comic_neue_regular.png', 'images/fonts/comic_neue_regular.fnt');
		game.load.bitmapFont('comicneue_regular_white', 'images/fonts/comic_neue_regular_white.png', 'images/fonts/comic_neue_regular_white.fnt');
	}

	this.create = function() {

		game.stage.backgroundColor = '#ffffff';
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

		//setup table
		table = game.add.sprite(0, 0, "table");
		table.anchor.set(0.5, 0.5);
		table.x = game.width / 2;
		table.y = game.height / 2;
		table.inputEnabled = true;
		table.events.onInputDown.add(startGame, this);

		//setup ball
		ball = game.add.sprite(0, 0, "ball");
		ball.anchor.set(0.5, 0.5);
		ball.x = game.width / 2;
		ball.y = game.height / 2;
		direction = new Phaser.Point(0,0);

		//setup bats
		bats[0] = game.add.sprite(0,0, "bat_blue");
		bats[0].anchor.set(0, 0.5);
		bats[0].scale.set(0.4, 0.4);
		bats[0].x = game.width / 2 - table.width/2 - bats[0].width;
		bats[0].y = game.height / 2;

		bats[1] = game.add.sprite(0,0, "bat_red");
		bats[1].anchor.set(1, 0.5);
		bats[1].scale.set(0.4, 0.4);
		bats[1].x = game.width / 2 + table.width/2 + bats[1].width;
		bats[1].y = game.height / 2;

		//setup input
		game.input.addPointer();
		game.input.addPointer();

		//setup physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.enable([ball, bats[0], bats[1]], Phaser.Physics.ARCADE);
		bats[0].body.immovable = true;
		bats[1].body.immovable = true;

		tapText = game.add.bitmapText(game.width/2, game.height * 3/4, 'comicneue_regular_white','Tap to Play!', 40);
		tapText.x -= tapText.width / 2;
		tapText.y -= tapText.height / 2;

		var timer = game.time.events.loop(Phaser.Timer.SECOND * 3, speedUpgrade, this);
		reset();
	}
	function reset() {
		isPlay = false;
		speed = 300;
		ball.body.velocity.x = 0;
		ball.body.velocity.y = 0;

		ball.x = game.width / 2;
		ball.y = game.height / 2

		bats[0].y = game.height / 2;
		bats[1].y = game.height / 2;

		lastSmash = null;
		tapText.text = "Tap to Play!";
	}

	function startGame() {
		if (isPlay) return;

		tapText.text = "";

		direction.x = (5 + Math.random() * 10) * [-1,1][Math.floor(Math.random() * 2)];
		direction.y = (Math.random() * 10) * [-1,1][Math.floor(Math.random() * 2)];
		direction.normalize();
		//console.log(direction, direction.getMagnitude());
		isPlay = true;
	}
	function speedUpgrade() {
		if (isPlay)
			speed += 50;
	}

	this.update = function() {
		//controller update
		if (game.input.pointer1.isDown) {
			if (game.input.pointer1.x > (game.width/2))
				pointer1Bat = bats[1];
			else
				pointer1Bat = bats[0];

			if ((game.input.pointer1.y > 0) && (game.input.pointer1.y < game.height))
			pointer1Bat.y = game.input.pointer1.y;
		}
		if (game.input.pointer2.isDown) {
			if (pointer1Bat == bats[0])
				pointer2Bat = bats[1];
			else
				pointer2Bat = bats[0];

			if ((game.input.pointer2.y > 0) && (game.input.pointer2.y < game.height))
				pointer2Bat.y = game.input.pointer2.y;
		}

		if (isPlay) {
			//cek pinggiran
			if (ball.y < (ball.height/2))
				direction.y = Math.abs(direction.y);
			else if (ball.y > (game.height - (ball.height/2)))
				direction.y = Math.abs(direction.y) * -1;

			//moving ball
			ball.body.velocity.x = direction.x * speed;
			ball.body.velocity.y = direction.y * speed;

			//cek collition
			game.physics.arcade.collide(bats[0], ball, collisionHandler, null, this);
			game.physics.arcade.collide(bats[1], ball, collisionHandler, null, this);

			//cek winner
			if (ball.x < 0) {
				reset();
			} else if (ball.x > game.width) {
				reset();
			}
		}
	}
	function collisionHandler(bat, ball) {
		if (lastSmash != bat) {

			var newDirection = Phaser.Point.normalize(new Phaser.Point(ball.x - bat.x,ball.y - bat.y));
			direction = newDirection;

			lastSmash = bat;
		}
	}

	this.render = function() {
		// game.debug.pointer(game.input.pointer1);
		// game.debug.pointer(game.input.pointer2);

		// game.debug.spriteInfo(ball, 32, 32);
	}

	this.shutdown = function() {

	}
}