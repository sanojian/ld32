/**
 * Created by jonas on 2015-04-17.
 */

var GameState = function(game) {
};



window.onload = function() {

	var Boot = function(game) {};
	Boot.prototype = {
		preload: function() {

			//Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

			this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');
			this.load.atlasJSONHash('assets', 'assets/gfx/sprites.png', null, g_game.spriteAtlas.assets);

			//this.load.image('splashBackground', 'assets/gfx/Background.png');

		},
		create: function() {

			this.game.stage.smoothed = false;
			this.scale.minWidth = g_game.baseWidth;
			this.scale.minHeight = g_game.baseHeight;
			this.scale.maxWidth = g_game.baseWidth * 2;
			this.scale.maxHeight = g_game.baseHeight * 2;
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.setScreenSize(true);

			// catch right click mouse
			this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

			this.state.start('game');
		}
	};

	var width = navigator.isCocoonJS ? window.innerWidth : g_game.baseWidth;
	var height = navigator.isCocoonJS ? window.innerHeight : g_game.baseHeight;

	//g_game.phaserGame = new Phaser.Game(g_game.baseWidth, (g_game.baseWidth / g_game.gameWidth) * g_game.gameHeight, Phaser.AUTO, 'game', null, false, false);
	//                                  width, height, renderer,        parent,     state,      transparent,    antialias, physicsConfig
	g_game.phaserGame = new Phaser.Game(width, height, Phaser.CANVAS,   '',     null,       false,          false);
	//g_game.phaserGame = new Phaser.Game(g_game.baseWidth, g_game.baseHeight, Phaser.AUTO,   '',     null,       false,          false);
	g_game.phaserGame.state.add('Boot', Boot);
	//g_game.phaserGame.state.add('Splash', SplashScreen);
	g_game.phaserGame.state.add('game', GameState);
	g_game.phaserGame.state.start('Boot');

};
/**
 * Created by jonas on 2015-04-17.
 */

window.g_game = {
	sounds: {},
	gameWidth: window.innerWidth * window.devicePixelRatio,
	gameHeight: window.innerHeight * window.devicePixelRatio,
	baseWidth: 480,
	baseHeight: 320,
	scale: 1,
	masterVolume: 0,//.3,
	gravity: 200,      // pixels/second/second
	sfx: {},
	currentHole: 1,
	currentClub: 'wedge'
};

g_game.clubs = {
	wood: {
		powerX: 400,
		powerY: 100,
		control: 2
	},
	iron: {
		powerX: 300,
		powerY: 100,
		control: 10
	},
	wedge: {
		powerX: 200,
		powerY: 200,
		control: 6
	}
};

g_game.holes = {
	1: {
		tee: { x: 40, y: 300}
	}
};
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

	//this.game.input.onTap.add(hitBall, this);
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
/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.preload = function() {

};
/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.update = function() {

	this.game.physics.arcade.collide(g_game.golfBall, g_game.alienShip, alienShipHit);
	this.game.physics.arcade.collide(g_game.golfBall, g_game.alienPilot, alienPilotHit);
	this.game.physics.arcade.collide(g_game.golfBall, g_game.tee);

	//g_game.swingMeter.circle(50, 50, 50, 'rgba(0, 255, 0, 1)');
	g_game.swingMeter.ctx.strokeStyle = '#FFFFFF';
	g_game.swingMeter.ctx.beginPath();
	g_game.swingMeter.ctx.arc(40,40,40,0,2*Math.PI);
	g_game.swingMeter.ctx.stroke();

	if (g_game.bSwinging) {
		g_game.swingPower += 0.1;
	}

	g_game.swingMeter.ctx.fillStyle = '#00FF00';
	g_game.swingMeter.ctx.beginPath();
	g_game.swingMeter.ctx.moveTo(40, 40);
	g_game.swingMeter.ctx.lineTo(40, 0);
	g_game.swingMeter.ctx.arc(40, 40, 40, 0 - Math.PI/2, g_game.swingPower - Math.PI/2);
	g_game.swingMeter.ctx.fill();

	g_game.swingMeter.dirty = true;

};

function alienShipHit() {
	var hitTimer = g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.02, function() {
		g_game.golfBall.kill();
	}, this);
}

function alienPilotHit() {
	var hitTimer = g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.02, function() {
		g_game.golfBall.kill();
	}, this);

	g_game.alienPilot.body.acceleration.y = 0;
	g_game.alienShip.body.acceleration.y = -g_game.gravity/2;
}
/**
 * Created by jonas on 2015-04-18.
 */

g_game.spriteAtlas = {};

g_game.spriteAtlas.assets = {
	frames: {
		golfBall: { frame: { x: 0, y: 0, w: 3, h: 3 } },
		tee: { frame: { x: 0, y: 10, w: 21, h: 6 } },
		alienPilot: { frame: { x: 0, y: 4, w: 5, h: 5 } },
		ship: { frame: { x: 8, y: 0, w: 13, h: 7 } }
	}
};
