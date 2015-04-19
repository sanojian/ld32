/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.create = function() {

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

	g_game.sfx.drive = this.game.add.audio('drive');
	g_game.sfx.hit_ship = this.game.add.audio('hit_ship');
	g_game.sfx.ship_done = this.game.add.audio('ship_done');
	g_game.sfx.ship_falling = this.game.add.audio('ship_falling');
	g_game.sfx.ship_shoot = this.game.add.audio('ship_shoot');
	g_game.sfx.building_done = this.game.add.audio('building_done');
	g_game.sfx.ricochet = this.game.add.audio('ricochet');
	g_game.sfx.laugh = this.game.add.audio('laugh');
	g_game.sfx.laugh2 = this.game.add.audio('laugh2');


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
		this.game.add.sprite(72+ 7*b, 85 , 'assets', 'building_destroyed' + (1 + Math.floor(Math.random() * 4)));
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



	g_game.txtHole = this.game.add.bitmapText(this.game.width/2, 18, 'pressStart2p', 'Hole ' + g_game.currentHole + ' Par ' + g_game.holes[g_game.currentHole].par, 11);
	g_game.txtHole.tint = g_game.textColor;
	g_game.txtHole.anchor.setTo(0.5, 0.5);


	g_game.currentStroke = 1;
	g_game.txtStroke = this.game.add.bitmapText(this.game.width/2, 30, 'pressStart2p', 'Stroke ' + g_game.currentStroke, 9);
	g_game.txtStroke.tint = g_game.textColor;
	g_game.txtStroke.anchor.setTo(0.5, 0.5);

	g_game.txtScore = this.game.add.bitmapText(260, 80, 'pressStart2p', 'Score ' + g_game.score, 9);
	g_game.txtScore.tint = 0xDEEED6;
	g_game.txtScore.anchor.setTo(0.5, 0.5);

	var swingText = this.game.add.bitmapText(swingMeterSprite.x+swingMeterSprite.width/2, swingMeterSprite.y+swingMeterSprite.height/2, 'pressStart2p', 'Swing!', 10);
	swingText.tint = 0xDEEED6;
	swingText.anchor.setTo(0.5, 0.5);

	this.game.physics.arcade.gravity.y = g_game.gravity;

	loadHole(this.game);

	g_game.explosion = this.game.add.sprite(200, 100, 'assets', 'explosion1');
	g_game.explosion.anchor.setTo(0.5, 0.5);
	g_game.explosion.animations.add('explode', ['explosion1', 'explosion2', 'explosion3', 'explosion4', 'explosion5', 'explosion6', 'explosion7']);
	//g_game.explosion.animations.play('explode', 8, true);
	g_game.explosion.events.onAnimationComplete.add(function() { g_game.explosion.alpha = 0; });
	g_game.explosion.alpha = 0;

	g_game.bBallInAir = false;
	g_game.swingDirection = 1;
	g_game.bHoleOver = false;

	playMusic();
};

function showExplosion(x, y) {
	g_game.explosion.x = x;
	g_game.explosion.y = y + 6;
	g_game.explosion.animations.play('explode', 8, false);
	g_game.explosion.bringToTop();
	g_game.explosion.alpha = 1;

}

function resetBall() {
	if (g_game.bHoleOver) {
		return;
	}

	g_game.bBallInAir = false;
	g_game.misses++;
	g_game.bShipBlasting = true;
	g_game.sfx.ship_shoot.play();
	g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
		g_game.blastArea.clear();
		// add destroyed building
		var destoyedBuilding = g_game.golfBall.game.add.sprite(72+ 7*(g_game.misses-1), 85 , 'assets', 'building_destroyed' + (1 + Math.floor(Math.random() * 4)));
		showExplosion(destoyedBuilding.x + destoyedBuilding.width/2 -1, destoyedBuilding.y);
		g_game.sfx.building_done.play();
		g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
			g_game.sfx['laugh' + (Math.random() > 0.5 ? '2' : '')].play();
		}, this);


		g_game.bShipBlasting = false;
		if (g_game.misses >= 30) {
			var excuse = g_game.excuses[Math.floor(Math.random() * g_game.excuses.length)];
			var txtLoseGame = g_game.golfBall.game.add.bitmapText(g_game.baseWidth/2, g_game.baseHeight/2-30, 'pressStart2p', excuse, 16);
			txtLoseGame.tint = g_game.textColor;
			txtLoseGame.anchor.setTo(0.5, 0.5);
			txtLoseGame.inputEnabled = true;
			txtLoseGame.input.useHandCursor = true;
			txtLoseGame.events.onInputDown.add(function() {
				g_game.currentHole = 1;
				g_game.score = 0;
				g_game.misses = 0;
				g_game.golfBall.game.state.start('game');
			}, txtLoseGame);

			return;
		}

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
	txtHoleScore.tint = g_game.textColor;
	txtHoleScore.anchor.setTo(0.5, 0.5);

}

function nextHole() {
	g_game.score += g_game.currentStroke - g_game.holes[g_game.currentHole].par;
	g_game.currentHole++;

	// check if game over
	if (g_game.currentHole > 9) {
		var txtWinGame = g_game.golfBall.game.add.bitmapText(g_game.baseWidth/2, 2*g_game.baseHeight/3, 'pressStart2p', '  City saved!\nNow you can play\n  in peace.', 16);
		txtWinGame.tint = g_game.textColor;
		txtWinGame.anchor.setTo(0.5, 0.5);
		txtWinGame.inputEnabled = true;
		txtWinGame.input.useHandCursor = true;
		txtWinGame.events.onInputDown.add(function() {
			g_game.currentHole = 1;
			g_game.score = 0;
			g_game.misses = 0;
			g_game.golfBall.game.state.start('game');
		}, txtWinGame);

		return;

	}

	g_game.golfBall.game.state.start('game');
}

function playMusic() {
	if (g_game.holes[g_game.currentHole].music) {
		if (g_game.music) {
			g_game.music.stop();
		}
		g_game.music = g_game.golfBall.game.add.audio(g_game.holes[g_game.currentHole].music);
		if (g_game.music) {
			g_game.music.loop = true;
			g_game.music.play();
		}
	}
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
	g_game.alienShip.animations.add('hover', [hole.ships[0].sprite, hole.ships[0].sprite + '1']);
	g_game.alienShip.animations.add('hover_damaged', [hole.ships[0].sprite + '_damaged', hole.ships[0].sprite + '1_damaged']);
	g_game.alienShip.animations.play('hover', 10, true);

	g_game.alienShip.body.acceleration.y = -g_game.gravity;
	g_game.alienShip.body.immovable = true;

	g_game.alienPilot = game.add.sprite(g_game.alienShip.x, g_game.alienShip.y-7, 'assets', 'alienPilot');
	g_game.alienPilot.anchor.setTo(0.5, 0.5);
	game.physics.enable(g_game.alienPilot, Phaser.Physics.ARCADE);
	g_game.alienPilot.body.mass = 4;

	g_game.alienPilot.body.acceleration.y = -g_game.gravity;

	g_game.buildings = game.add.group();
	for (var i=0; i<hole.buildings.length; i++) {
		var building = game.add.sprite(hole.buildings[i].x, hole.buildings[i].y, 'assets', hole.buildings[i].sprite);
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
	if (g_game.bBallInAir || g_game.bShipBlasting) {
		return;
	}
	g_game.bSwinging = true;
}

function hitBall() {
	if (!g_game.bSwinging) {
		return;
	}
	g_game.bSwinging = false;
	g_game.bBallInAir = true;

	var power = Math.max(0.2, g_game.swingPower) / (2*Math.PI);

	var hitTimer = this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function() {
		g_game.sfx.drive.play();
		g_game.golfBall.body.velocity.x = g_game.clubs[g_game.currentClub].powerX * power;
		g_game.golfBall.body.velocity.y = -g_game.clubs[g_game.currentClub].powerY * power;
	}, this);

}