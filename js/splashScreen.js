/**
 * Created by jonas on 2015-04-20.
 */

var SplashScreen = function(game) {};
SplashScreen.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/gfx/loading-bar.png');

		this.load.atlasJSONHash('assets', 'assets/gfx/sprites.png', null, g_game.spriteAtlas.assets);
		this.load.atlasJSONHash('ui', 'assets/gfx/ui.png', null, g_game.spriteAtlas.ui);
		this.load.bitmapFont('pressStart2p', 'assets/fonts/pressStart2p_0.png', 'assets/fonts/pressStart2p.xml');

		this.game.load.audio('drive', ['assets/audio/sfx/drive.wav']);
		this.game.load.audio('hit_ship', ['assets/audio/sfx/hit_ship.wav']);
		this.game.load.audio('ship_done', ['assets/audio/sfx/ship_done.wav']);
		this.game.load.audio('ship_falling', ['assets/audio/sfx/ship_falling.wav']);
		this.game.load.audio('ship_shoot', ['assets/audio/sfx/ship_shoot.wav']);
		this.game.load.audio('building_done', ['assets/audio/sfx/building_done.wav']);
		this.game.load.audio('ricochet', ['assets/audio/sfx/ricochet.wav']);
		this.game.load.audio('laugh', ['assets/audio/sfx/laugh.wav']);
		this.game.load.audio('laugh2', ['assets/audio/sfx/laugh2.wav']);

		this.game.load.audio('squiggy', ['https://dl.dropboxusercontent.com/u/102070389/ld32/squiggy.OGG']);
		this.game.load.audio('somber', ['https://dl.dropboxusercontent.com/u/102070389/ld32/somber.OGG']);
		this.game.load.audio('getitdone', ['https://dl.dropboxusercontent.com/u/102070389/ld32/getitdone.OGG']);

	},
	create: function() {
		var back = this.game.add.image(0, 0, 'background');
		back.inputEnabled = true;
		back.events.onInputDown.add(function() {
			this.game.state.start('game');
		}, back);



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

		var title = this.game.add.bitmapText(this.game.width/2, 30, 'pressStart2p', 'Teed Off', 16);
		title.tint = g_game.textColor;
		title.anchor.setTo(0.5, 0.5);

		var saying = this.game.add.bitmapText(this.game.width/2, 130, 'pressStart2p', 'Alien invasion?  But I\n just got a tee time!', 9);
		saying.tint = 0xDEEED6;
		saying.anchor.setTo(0.5, 0.5);

		var author = this.game.add.bitmapText(this.game.width-60, 190, 'pressStart2p', 'by Sanojian', 8);
		author.tint = g_game.textColor;
		author.anchor.setTo(0.5, 0.5);


		this.game.physics.arcade.gravity.y = g_game.gravity;
	}
};