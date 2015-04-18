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
			this.load.atlasJSONHash('ui', 'assets/gfx/ui.png', null, g_game.spriteAtlas.ui);
			this.game.load.bitmapFont('pressStart2p', 'assets/fonts/pressStart2p_0.png', 'assets/fonts/pressStart2p.xml');

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
		control: 4
	},
	iron: {
		powerX: 300,
		powerY: 100,
		control: 8
	},
	wedge: {
		powerX: 100,
		powerY: 300,
		control: 6
	}
};

g_game.holes = {
	1: {
		tee: { x: 40, y: 200},
		ships: [
			{ sprite: 'smallShip', x: 300, y: 200 }
		],
		par: 3,
		buildings: [
			{ sprite: 'building', x: 320, y: 200 }
		]
	},
	2: {
		tee: { x: 100, y: 200},
		ships: [
			{ sprite: 'smallShip', x: 300, y: 200 }
		],
		par: 3,
		buildings: [
			{ sprite: 'building', x: 200, y: 200 }
		]
	}
};
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
	this.game.physics.arcade.collide(g_game.golfBall, g_game.buildings);

	// is ball out of bounds
	if (g_game.golfBall.x > this.game.world.width || g_game.golfBall.x < 0 || g_game.golfBall.y > this.game.world.height) {
		resetBall();
	}
	drawSwingMeter();


};

function drawSwingMeter() {
	g_game.swingMeter.clear();
	g_game.swingMeter.ctx.strokeStyle = '#FFFFFF';
	g_game.swingMeter.ctx.beginPath();
	g_game.swingMeter.ctx.arc(g_game.swingMeter.width/2, g_game.swingMeter.height/2, g_game.swingMeter.width/2, 0, 2*Math.PI);
	g_game.swingMeter.ctx.stroke();

	if (g_game.bSwinging) {
		//g_game.swingPower += 0.1;
		g_game.swingPower = (g_game.swingPower + (11 - g_game.clubs[g_game.currentClub].control)/35) % (Math.PI*2);
	}

	g_game.swingMeter.ctx.fillStyle = '#00FF00';
	g_game.swingMeter.ctx.beginPath();
	g_game.swingMeter.ctx.moveTo(g_game.swingMeter.width/2, g_game.swingMeter.height/2);
	g_game.swingMeter.ctx.lineTo(g_game.swingMeter.width/2, 0);
	g_game.swingMeter.ctx.arc(g_game.swingMeter.width/2, g_game.swingMeter.height/2, g_game.swingMeter.width/2, 0 - Math.PI/2, g_game.swingPower - Math.PI/2);
	g_game.swingMeter.ctx.fill();

	g_game.swingMeter.dirty = true;

}

function alienShipHit() {
	//g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.02, function() {
	//	g_game.golfBall.kill();
	//}, this);

}

function alienPilotHit() {
	//g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.02, function() {
	//	g_game.golfBall.kill();
	//}, this);

	g_game.alienPilot.body.acceleration.y = 0;
	g_game.alienShip.body.acceleration.y = -g_game.gravity/2;

	g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
		g_game.currentHole = 2;
		g_game.golfBall.game.state.start('game');
	}, this);

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
		smallShip: { frame: { x: 8, y: 0, w: 13, h: 7 } },

		building: { frame: { x: 24, y: 0, w: 8, h: 32 } }
	}
};

g_game.spriteAtlas.ui = {
	frames: {
		button_wood: { frame: { x: 0, y: 0, w: 32, h: 32 } },
		button_iron: { frame: { x: 32, y: 0, w: 32, h: 32 } },
		button_wedge: { frame: { x: 0, y: 32, w: 32, h: 32 } },
	}
};
