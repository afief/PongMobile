var Game = function () {
	this.preload = function() {
		this.load.image("table", "images/pingpong_table.png");
	}

	this.create = function() {
		var table = this.add.sprite(0,0,"table");
	}

	this.update = function() {

	}

	this.shutdown = function() {

	}
}