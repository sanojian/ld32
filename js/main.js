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