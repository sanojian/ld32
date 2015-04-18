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