/**
 * Created by jonas on 2015-04-18.
 */

g_game.spriteAtlas = {};

g_game.spriteAtlas.assets = {
	frames: {
		golfBall: { frame: { x: 0, y: 0, w: 4, h: 4 } },
		tee: { frame: { x: 0, y: 27, w: 24, h: 8 } },
		alienPilot: { frame: { x: 0, y: 19, w: 7, h: 8 } },
		smallShip: { frame: { x: 0, y: 10, w: 17, h: 8 } },

		building: { frame: { x: 24, y: 0, w: 8, h: 32 } },

		cloud: { frame: { x: 0, y: 40, w: 60, h: 24 } }
	}
};

g_game.spriteAtlas.ui = {
	frames: {
		button_wood: { frame: { x: 0, y: 0, w: 32, h: 32 } },
		button_wood1: { frame: { x: 32, y: 0, w: 32, h: 32 } },
		button_iron: { frame: { x: 0, y: 64, w: 32, h: 32 } },
		button_iron1: { frame: { x: 32, y: 64, w: 32, h: 32 } },
		button_wedge: { frame: { x: 0, y: 32, w: 32, h: 32 } },
		button_wedge1: { frame: { x: 32, y: 32, w: 32, h: 32 } }
	}
};
