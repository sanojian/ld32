/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.create = function() {

	this.game.stage.smoothed = false;
	this.game.stage.disableVisibilityChange = true;

	g_game.golfBall = this.game.add.sprite(60, 200, 'assets', 'golfBall');
	g_game.golfBall.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(g_game.golfBall, Phaser.Physics.ARCADE);
	//g_game.golfBall.body.bounce.setTo(1, 1);

	g_game.golfBall.body.collideWorldBounds = true;
	//g_game.golfBall.body.velocity.x = 200;
	//g_game.golfBall.body.velocity.y = -100;

	g_game.tee = this.game.add.sprite(g_game.golfBall.x, g_game.golfBall.y + 4, 'assets', 'tee');
	g_game.tee.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(g_game.tee, Phaser.Physics.ARCADE);
	g_game.tee.body.acceleration.y = -g_game.gravity;
	g_game.tee.body.immovable = true;


	g_game.alienShip = this.game.add.sprite(300, 200, 'assets', 'ship');
	g_game.alienShip.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(g_game.alienShip, Phaser.Physics.ARCADE);

	g_game.alienShip.body.acceleration.y = -g_game.gravity;
	g_game.alienShip.body.immovable = true;

	g_game.alienPilot = this.game.add.sprite(g_game.alienShip.x, g_game.alienShip.y-4, 'assets', 'alienPilot');
	g_game.alienPilot.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(g_game.alienPilot, Phaser.Physics.ARCADE);
	g_game.alienPilot.body.mass = 4;

	g_game.alienPilot.body.acceleration.y = -g_game.gravity;

	g_game.swingPower = 0;
	g_game.swingMeter = this.game.add.bitmapData(80, 80);
	var swingMeterSprite = this.game.add.sprite(10, 10, g_game.swingMeter);
	swingMeterSprite.inputEnabled = true;
	swingMeterSprite.events.onInputDown.add(startSwing, this);
	swingMeterSprite.events.onInputUp.add(hitBall, this);
	swingMeterSprite.input.useHandCursor = true;


	this.game.physics.arcade.gravity.y = g_game.gravity;

};

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