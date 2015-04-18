/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.create = function() {

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

	loadHole(this.game);

	g_game.swingPower = 0;
	g_game.swingMeter = this.game.add.bitmapData(80, 80);
	var swingMeterSprite = this.game.add.sprite(10, 10, g_game.swingMeter);
	swingMeterSprite.inputEnabled = true;
	swingMeterSprite.events.onInputDown.add(startSwing, this);
	swingMeterSprite.events.onInputUp.add(hitBall, this);
	swingMeterSprite.input.useHandCursor = true;


	// UI
	g_game.clubButtons = {};
	var startX = 10;
	var startY = 100;
	for (var key in g_game.clubs) {
		var button = this.game.add.sprite(startX, startY, 'ui', 'button_' + key);
		button.inputEnabled = true;
		button.clubType = key;
		button.input.useHandCursor = true;
		button.events.onInputDown.add(chooseClub, button);

		button.alpha = key == g_game.currentClub ? 1 : 0.3;

		g_game.clubButtons[key] = button;
		startX += 40;
	}

	g_game.txtHole = this.game.add.bitmapText(400, 20, 'pressStart2p', 'Hole ' + g_game.currentHole, 12);
	g_game.txtHole.tint = 0xff0000;
	g_game.txtHole.anchor.setTo(0.5, 0.5);

	g_game.txtPar = this.game.add.bitmapText(400, 40, 'pressStart2p', 'Par ' + g_game.holes[g_game.currentHole].par, 12);
	g_game.txtPar.tint = 0xff0000;
	g_game.txtPar.anchor.setTo(0.5, 0.5);

	g_game.currentStroke = 1;
	g_game.txtStroke = this.game.add.bitmapText(400, 60, 'pressStart2p', 'Stroke ' + g_game.currentStroke, 12);
	g_game.txtStroke.tint = 0xff0000;
	g_game.txtStroke.anchor.setTo(0.5, 0.5);


	//chooseClub(g_game.clubButtons[g_game.currentClub]);

	this.game.physics.arcade.gravity.y = g_game.gravity;

	g_game.bBallInAir = false;
};

function resetBall() {
	var hole = g_game.holes[g_game.currentHole];

	g_game.golfBall.x = hole.tee.x;
	g_game.golfBall.y = hole.tee.y-8;
	g_game.golfBall.body.velocity.x = 0;
	g_game.golfBall.body.velocity.y = 0;

	g_game.bBallInAir = false;
	g_game.bSwinging = false;
	g_game.swingPower = 0;
	g_game.currentStroke++;
	g_game.txtStroke.setText('Stroke ' + g_game.currentStroke);
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
	game.physics.enable(g_game.alienShip, Phaser.Physics.ARCADE);

	g_game.alienShip.body.acceleration.y = -g_game.gravity;
	g_game.alienShip.body.immovable = true;

	g_game.alienPilot = game.add.sprite(g_game.alienShip.x, g_game.alienShip.y-4, 'assets', 'alienPilot');
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


}

function chooseClub() {

	for (var key in g_game.clubButtons) {
		g_game.clubButtons[key].alpha = 0.3;
	}

	this.alpha = 1;
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

	var power = g_game.swingPower / (2*Math.PI);

	var hitTimer = this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function() {
		g_game.golfBall.body.velocity.x = g_game.clubs[g_game.currentClub].powerX * power;
		g_game.golfBall.body.velocity.y = -g_game.clubs[g_game.currentClub].powerY * power;
	}, this);

}