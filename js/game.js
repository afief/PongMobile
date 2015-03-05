var Game = function () {

	var table;
	var ball;
	var bats = [];
	var lastSmash;
	var isPlay = false;
	var direction;
	var speed;
	var tapText;
	var p1Text;
	var p2Text;

	var p1ai; //player 1 artificial enemy
	var p2ai; //player 2 artificial enemy


	var game;
	this.playerInput = undefined;

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
		this.playerInput = new PlayerInput(game, bats[0], bats[1]);

		//setup physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.enable([ball, bats[0], bats[1]], Phaser.Physics.ARCADE);
		bats[0].body.immovable = true;
		bats[1].body.immovable = true;

		//setup texts
		tapText = game.add.bitmapText(table.width/2, table.height * 3/4, 'comicneue_regular_white','', 40);
		tapText.align = "center";
		

		p1Text = game.add.bitmapText(table.width * 1 / 4, table.height * 1/3, 'comicneue_regular_white','Tap to Join!', 40);
		p1Text.align = "center";

		p2Text = game.add.bitmapText(table.width * 3 / 4, table.height * 1/3, 'comicneue_regular_white','Tap to Join!', 40);
		p2Text.align = "center";
		
		//setup artificial enemy
		p1ai = new ArtificialEnemy(game, bats[0], ball);
		p2ai = new ArtificialEnemy(game, bats[1], ball);

		p1ai.active = true;
		p2ai.active = true;

		//setup ball speed
		game.time.events.loop(Phaser.Timer.SECOND * 3, speedUpgrade, this);
		reset();
	}
	function reset() {
		isPlay = false;
		speed = 500;
		ball.body.velocity.x = 0;
		ball.body.velocity.y = 0;

		ball.x = game.width / 2;
		ball.y = game.height / 2

		bats[0].y = game.height / 2;
		bats[1].y = game.height / 2;

		lastSmash = null;

		tapText.text = "";
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

		this.playerInput.update();

		p1ai.update();
		p2ai.update();

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

var PlayerInput = function(game, bat1, bat2) {

	var pointer1Bat = null;
	var pointer2Bat = null;

	var p1atas = game.input.keyboard.addKey(Phaser.Keyboard.A);
	var p1bawah = game.input.keyboard.addKey(Phaser.Keyboard.S);

	var p2atas = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	var p2bawah = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	this.player1 = {};
	this.player2 = {};

	this.addYPos = function(playerIndex, ypos) {
		var _player = (playerIndex == 1) ? bat1 : bat2;
		this.updateBatYPos(_player, _player.y += ypos);
	}
	this.updateBatYPos = function(bat, ypos) {
		if ((ypos > 0) && (ypos < game.height))
			bat.y = ypos;
	}

	this.update = function() {
		if (game.input.pointer1.isDown) {
			if (game.input.pointer1.x > (game.width/2))
				pointer1Bat = bat2;
			else
				pointer1Bat = bat1;

			this.updateBatYPos(pointer1Bat, game.input.pointer1.y);
		}
		if (game.input.pointer2.isDown) {
			if (pointer1Bat == bat1)
				pointer2Bat = bat2;
			else
				pointer2Bat = bat1;

			this.updateBatYPos(pointer2Bat, game.input.pointer2.y);			
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.A))
			this.addYPos(1, -4);
			
		if (game.input.keyboard.isDown(Phaser.Keyboard.D))
			this.addYPos(1, +4);

		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			this.addYPos(2, +4);
			
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			this.addYPos(2, -4);
	}	
}

var ArtificialEnemy = function(game, bat, ball) {
	this.speed = 5;
	this.active = false;

	this.update = function() {
		if (!this.active) return;
		// console.log(ball.body.velocity.x);
		if ((bat.y > ball.y) && (Math.abs(ball.y - bat.y) > bat.height/4)) {
			if (!xor(bat.x < game.width/2, ball.body.velocity.x < 0))
				bat.y -= this.speed;
		} else if ((bat.y < ball.y) && (Math.abs(ball.y - bat.y) > bat.height/4)) {
			if (!xor(bat.x < game.width/2, ball.body.velocity.x < 0))
				bat.y += this.speed;
		}
	}
}

function xor(a,b) {
  return ( a || b ) && !( a && b );
}