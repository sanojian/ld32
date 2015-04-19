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
	misses: 0,
	currentClub: 'wood',
	textColor: 0xD04648,
	excuses: [
		'The sun was in\n   my eyes.',
		'Wait, these are\n not my clubs.',
		'Why does this\nwind keep changing?'
	]
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
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 200, y: 140 }
		],
		par: 3,
		buildings: [
			{ sprite: 'building', x: 224, y: 140 }
		],
		music: 'squiggy'
	},
	2: {
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 200, y: 140 }
		],
		par: 4,
		buildings: [
			{ sprite: 'building', x: 120, y: 140 }
		]
	},
	3: {
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 250, y: 160 }
		],
		par: 4,
		buildings: [
			{ sprite: 'building', x: 160, y: 140 },
			{ sprite: 'building', x: 280, y: 160 }
		]
	},
	4: {
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 200, y: 140 }
		],
		par: 4,
		buildings: [
			{ sprite: 'building', x: 220, y: 140 },
			{ sprite: 'building2', x: 120, y: 140 }
		],
		music: 'somber'
	},
	5: {    // par 15
		tee: { x: 20, y: 180},
		ships: [
			{ sprite: 'smallShip', x: 90, y: 120 }
		],
		par: 5,
		buildings: [
			{ sprite: 'building', x: 60, y: 120 },
			{ sprite: 'building2', x: 120, y: 140 },
			{ sprite: 'building2', x: 90, y: 160 }
		]
	},
	6: {
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 200, y: 180 }
		],
		par: 4,
		buildings: [
			{ sprite: 'building', x: 170, y: 160 },
			{ sprite: 'building2', x: 230, y: 160 }
		]
	},
	7: {    // par 22
		tee: { x: 60, y: 180},
		ships: [
			{ sprite: 'smallShip', x: 200, y: 140 }
		],
		par: 5,
		buildings: [
			{ sprite: 'building', x: 220, y: 140 },
			{ sprite: 'building2', x: 194, y: 120 },
			{ sprite: 'building2', x: 206, y: 120 },
			{ sprite: 'building', x: 180, y: 132 }
		],
		music: 'getitdone'
	},
	8: {
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 268, y: 114 }
		],
		par: 4,
		buildings: [
			{ sprite: 'building2', x: 200, y: 140 }
		]
	},
	9: {
		tee: { x: 20, y: 150},
		ships: [
			{ sprite: 'smallShip', x: 80, y: 180 }
		],
		par: 4,
		buildings: [
			{ sprite: 'building', x: 60, y: 160 },
			{ sprite: 'building', x: 120, y: 160 }
		]
	}
};