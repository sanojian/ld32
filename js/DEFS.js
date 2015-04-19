/**
 * Created by jonas on 2015-04-17.
 */

window.g_game = {
	sounds: {},
	gameWidth: window.innerWidth * window.devicePixelRatio,
	gameHeight: window.innerHeight * window.devicePixelRatio,
	//baseWidth: 480,
	//baseHeight: 320,
	//scale: 2,
	baseWidth: 300,
	baseHeight: 200,
	scale: 3,
	masterVolume: 0,//.3,
	gravity: 200,      // pixels/second/second
	sfx: {},
	currentHole: 1,
	score: 0,
	currentClub: 'wedge'
};

g_game.clubs = {
	wood: {
		powerX: 300,
		powerY: 75,
		control: 4
	},
	iron: {
		powerX: 160,
		powerY: 160,
		control: 8
	},
	wedge: {
		powerX: 75,
		powerY: 260,
		control: 6
	}
};

g_game.holes = {
	1: {
		tee: { x: 20, y: 140},
		ships: [
			{ sprite: 'smallShip', x: 200, y: 140 }
		],
		par: 3,
		buildings: [
			{ sprite: 'building', x: 220, y: 140 }
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