/**
 * Created by jonas on 2015-04-18.
 */

g_game.spriteAtlas = {};

g_game.spriteAtlas.assets = {
	frames: {
		golfBall: { frame: { x: 0, y: 0, w: 4, h: 4 } },
		tee: { frame: { x: 0, y: 27, w: 24, h: 8 } },
		alienPilot: { frame: { x: 0, y: 18, w: 7, h: 8 } },
		smallShip: { frame: { x: 0, y: 104, w: 25, h: 17 } },
		smallShip1: { frame: { x: 26, y: 104, w: 25, h: 17 } },
		smallShip_damaged: { frame: { x: 52, y: 104, w: 25, h: 17 } },
		smallShip1_damaged: { frame: { x: 78, y: 104, w: 25, h: 17 } },

		building: { frame: { x: 0, y: 68, w: 14, h: 34 } },
		building2: { frame: { x: 18, y: 86, w: 11, h: 15 } },
		building_destroyed1: { frame: { x: 0, y: 121, w: 6, h: 15 } },
		building_destroyed2: { frame: { x: 7, y: 121, w: 6, h: 15 } },
		building_destroyed3: { frame: { x: 14, y: 121, w: 6, h: 15 } },
		building_destroyed4: { frame: { x: 21, y: 121, w: 6, h: 15 } },

		explosion1: { frame: { x: 0, y: 139, w: 7, h: 12 } },
		explosion2: { frame: { x: 7, y: 139, w: 7, h: 12 } },
		explosion3: { frame: { x: 14, y: 139, w: 7, h: 12 } },
		explosion4: { frame: { x: 21, y: 139, w: 7, h: 12 } },
		explosion5: { frame: { x: 28, y: 139, w: 7, h: 12 } },
		explosion6: { frame: { x: 35, y: 139, w: 7, h: 12 } },
		explosion7: { frame: { x: 42, y: 139, w: 7, h: 12 } },

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
