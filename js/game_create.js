/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.create = function() {

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

	this.game.add.image(0, 0, 'background');
	g_game.clouds = this.game.add.group();
	for (var i=0; i<7; i++) {
		var cloud = this.game.add.sprite(Math.floor(Math.random() * 300), Math.floor(Math.random() * 60), 'assets', 'cloud');
		this.game.physics.enable(cloud, Phaser.Physics.ARCADE);
		cloud.body.velocity.x = 2 + Math.floor(Math.random() * 10);
		cloud.body.acceleration.y = -g_game.gravity;
		g_game.clouds.add(cloud);
	}

	var cloudTimer = this.game.time.create(false);
	cloudTimer.loop(Phaser.Timer.SECOND * 2, function() {
		var numClouds = g_game.clouds.countLiving();
		for (var i=0; i<numClouds; i++) {
			var cloud = g_game.clouds.getChildAt(i);
			if (cloud.x > this.game.width) {
				cloud.x = -cloud.width;
				cloud.y =  Math.floor(Math.random() * 60);
				cloud.body.velocity.x = 2 + Math.floor(Math.random() * 10);
				return;
			}
		}
	}, this);
	cloudTimer.start();


	for (var b=0; b<g_game.misses; b++) {
		var destroyedBuilding = this.game.add.sprite(72+ 7*b, 88 , 'assets', 'building_destroyed');
	}

	g_game.swingPower = 0;
	g_game.swingMeter = this.game.add.bitmapData(64, 64);
	var swingMeterSprite = this.game.add.sprite(4, 4, g_game.swingMeter);
	swingMeterSprite.inputEnabled = true;
	swingMeterSprite.events.onInputDown.add(startSwing, this);
	swingMeterSprite.events.onInputUp.add(hitBall, this);
	swingMeterSprite.input.useHandCursor = true;

	//g_game.blastArea = this.game.add.bitmapData(209, 109);
	//this.game.add.sprite(72, 91, g_game.blastArea);
	g_game.blastArea = this.game.add.bitmapData(300, 200);
	this.game.add.sprite(0, 0, g_game.blastArea);

	// UI
	g_game.clubButtons = {};
	var startX = swingMeterSprite.x + swingMeterSprite.width/2 - 16;
	var startY = swingMeterSprite.y + swingMeterSprite.height + 10;
	for (var key in g_game.clubs) {
		var button = this.game.add.sprite(startX, startY, 'ui', 'button_' + key);
		button.anchor.setTo(0.5, 0.5);
		button.inputEnabled = true;
		button.clubType = key;
		button.input.useHandCursor = true;
		button.events.onInputDown.add(chooseClub, button);

		//button.alpha = key == g_game.currentClub ? 1 : 0.3;
		button.frameName = key == g_game.currentClub ? 'button_' + key : 'button_' + key + 1;

		g_game.clubButtons[key] = button;
		if (key == 'wood') {
			startX += button.width + 2;
			startY -= 1;
		}
		else {
			startX += 25;
			startY -= 25;
		}
	}

	g_game.txtHole = this.game.add.bitmapText(this.game.width/2, 18, 'pressStart2p', 'Hole ' + g_game.currentHole + ' Par ' + g_game.holes[g_game.currentHole].par, 10);
	g_game.txtHole.tint = 0xff0000;
	g_game.txtHole.anchor.setTo(0.5, 0.5);


	g_game.currentStroke = 1;
	g_game.txtStroke = this.game.add.bitmapText(this.game.width/2, 30, 'pressStart2p', 'Stroke ' + g_game.currentStroke, 9);
	g_game.txtStroke.tint = 0xff0000;
	g_game.txtStroke.anchor.setTo(0.5, 0.5);

	g_game.txtScore = this.game.add.bitmapText(260, 40, 'pressStart2p', 'Score ' + g_game.score, 9);
	g_game.txtScore.tint = 0xff0000;
	g_game.txtScore.anchor.setTo(0.5, 0.5);

	this.game.physics.arcade.gravity.y = g_game.gravity;

	loadHole(this.game);

	g_game.bBallInAir = false;
	g_game.swingDirection = 1;
	g_game.bHoleOver = false;
};

function resetBall() {
	if (g_game.bHoleOver) {
		return;
	}

	g_game.bBallInAir = false;
	g_game.misses++;
	g_game.bShipBlasting = true;
	g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
		g_game.blastArea.clear();
		g_game.golfBall.game.add.sprite(72 + 7*(g_game.misses-1), 88 , 'assets', 'building_destroyed');

		var hole = g_game.holes[g_game.currentHole];

		g_game.golfBall.x = hole.tee.x;
		g_game.golfBall.y = hole.tee.y-8;
		g_game.golfBall.body.velocity.x = 0;
		g_game.golfBall.body.velocity.y = 0;

		g_game.swingDirection = 1;
		g_game.bSwinging = false;
		g_game.swingPower = 0;
		g_game.currentStroke++;
		g_game.txtStroke.setText('Stroke ' + g_game.currentStroke);

		g_game.bShipBlasting = false;
	}, this);
}

function checkHoleOver() {
	g_game.bHoleOver = true;

	var holeScore = g_game.currentStroke - g_game.holes[g_game.currentHole].par;
	var scoreText = '';
	if (holeScore == -3) {
		scoreText = 'Albatross!';
	}
	else if (holeScore == -2) {
		scoreText = 'Eagle!';
	}
	else if (holeScore == -1) {
		scoreText = 'Birdie!';
	}
	else if (holeScore === 0) {
		scoreText = 'Par';
	}
	else if (holeScore == 1) {
		scoreText = 'Bogey';
	}
	else if (holeScore === 2) {
		scoreText = 'Double Bogey';
	}
	else if (holeScore === 3) {
		scoreText = 'Triple Bogey';
	}
	else if (holeScore >= 4) {
		scoreText = 'Bogey Town';
	}

	var txtHoleScore = g_game.golfBall.game.add.bitmapText(g_game.baseWidth/2, g_game.baseHeight/2-30, 'pressStart2p', scoreText, 16);
	txtHoleScore.tint = 0xff0000;
	txtHoleScore.anchor.setTo(0.5, 0.5);

}

function nextHole() {
	g_game.score += g_game.currentStroke - g_game.holes[g_game.currentHole].par;
	g_game.currentHole++;

	// TODO: check if game over
	g_game.golfBall.game.state.start('game');
}

function loadHole(game) {
	var hole = g_game.holes[g_game.currentHole];

	g_game.golfBall = game.add.sprite(hole.tee.x, hole.tee.y-8, 'assets', 'golfBall');
	g_game.golfBall.anchor.setTo(0.5, 0.5);
	game.physics.enable(g_game.golfBall, Phaser.Physics.ARCADE);
	g_game.golfBall.body.bounce.setTo(0.5, 0.5);

	g_game.tee = game.add.sprite(hole.tee.x, hole.tee.y, 'assets', 'tee');
	g_game.tee.anchor.setTo(0.5, 0.5);
	game.physics.enable(g_game.tee, Phaser.Physics.ARCADE);
	g_game.tee.body.acceleration.y = -g_game.gravity;
	g_game.tee.body.immovable = true;


	g_game.alienShip = game.add.sprite(hole.ships[0].x, hole.ships[0].y, 'assets', hole.ships[0].sprite);
	g_game.alienShip.anchor.setTo(0.5, 0.5);
	g_game.alienShip.hitPoints = 2;
	game.physics.enable(g_game.alienShip, Phaser.Physics.ARCADE);

	g_game.alienShip.body.acceleration.y = -g_game.gravity;
	g_game.alienShip.body.immovable = true;

	g_game.alienPilot = game.add.sprite(g_game.alienShip.x, g_game.alienShip.y-7, 'assets', 'alienPilot');
	g_game.alienPilot.anchor.setTo(0.5, 0.5);
	game.physics.enable(g_game.alienPilot, Phaser.Physics.ARCADE);
	g_game.alienPilot.body.mass = 4;

	g_game.alienPilot.body.acceleration.y = -g_game.gravity;

	g_game.buildings = game.add.group();
	for (var i=0; i<hole.buildings.length; i++) {
		var building = game.add.sprite(hole.buildings[0].x, hole.buildings[0].y, 'assets', hole.buildings[0].sprite);
		building.anchor.setTo(0.5, 1);
		game.physics.enable(building, Phaser.Physics.ARCADE);
		building.body.immovable = true;
		building.body.acceleration.y = -g_game.gravity;
		g_game.buildings.add(building);
	}

	g_game.swingDirection = 1;
}

function chooseClub() {

	for (var key in g_game.clubButtons) {
		//g_game.clubButtons[key].alpha = 0.3;
		g_game.clubButtons[key].frameName = 'button_' + key + 1;
	}

	this.frameName = 'button_' + this.clubType;
	g_game.currentClub = this.clubType;
}

function startSwing() {
	if (g_game.bBallInAir) {
		return;
	}
	g_game.bSwinging = true;
}

function hitBall() {
	if (g_game.bBallInAir) {
		return;
	}
	g_game.bSwinging = false;
	g_game.bBallInAir = true;

	var power = Math.max(0.2, g_game.swingPower) / (2*Math.PI);

	var hitTimer = this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function() {
		g_game.golfBall.body.velocity.x = g_game.clubs[g_game.currentClub].powerX * power;
		g_game.golfBall.body.velocity.y = -g_game.clubs[g_game.currentClub].powerY * power;
	}, this);

}