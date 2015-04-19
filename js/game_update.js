/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.update = function() {

	this.game.physics.arcade.collide(g_game.golfBall, g_game.alienShip, alienShipHit);
	this.game.physics.arcade.collide(g_game.golfBall, g_game.alienPilot, alienPilotHit);
	this.game.physics.arcade.collide(g_game.golfBall, g_game.tee);
	this.game.physics.arcade.collide(g_game.golfBall, g_game.buildings, ricochet);

	// is ball out of bounds
	if (g_game.bBallInAir) {
		if (g_game.golfBall.x > this.game.world.width || g_game.golfBall.x < 0 || g_game.golfBall.y > this.game.world.height) {
			resetBall();
		}
	}

	// if alien shooting
	if (g_game.bShipBlasting) {
		g_game.blastArea.clear();
		g_game.blastArea.ctx.strokeStyle = Math.random() > 0.3 ? '#DAD45E' : '#D27D2C';
		g_game.blastArea.ctx.beginPath();
		g_game.blastArea.ctx.moveTo(g_game.alienShip.x, g_game.alienShip.y);
		g_game.blastArea.ctx.lineTo(75 + 7*(g_game.misses-1), 98);
		g_game.blastArea.ctx.stroke();
	}

	drawSwingMeter();

};

function ricochet() {
	g_game.sfx.ricochet.play();
}

function drawSwingMeter() {
	g_game.swingMeter.clear();
	g_game.swingMeter.ctx.strokeStyle = '#DEEED6';
	g_game.swingMeter.ctx.beginPath();
	g_game.swingMeter.ctx.arc(g_game.swingMeter.width/2, g_game.swingMeter.height/2, g_game.swingMeter.width/2, 0, 2*Math.PI);
	//g_game.swingMeter.ctx.arc(g_game.swingMeter.width/2, g_game.swingMeter.height/2, g_game.swingMeter.width/2-1, 0, 2*Math.PI);
	g_game.swingMeter.ctx.stroke();

	if (g_game.bSwinging) {
		//g_game.swingPower += 0.1;
		//g_game.swingPower = (g_game.swingPower + (11 - g_game.clubs[g_game.currentClub].control)/35) % (Math.PI*2);
		g_game.swingPower = g_game.swingPower + g_game.swingDirection * (11 - g_game.clubs[g_game.currentClub].control)/35;
		if (g_game.swingPower >= 2*Math.PI) {
			g_game.swingPower = 2*Math.PI;
			g_game.swingDirection = -1;
		}
		else if (g_game.swingPower <= 0) {
			g_game.swingPower = 0;
			g_game.swingDirection = 1;
		}
	}

	g_game.swingMeter.ctx.fillStyle = '#6DAA2C';
	g_game.swingMeter.ctx.beginPath();
	g_game.swingMeter.ctx.moveTo(g_game.swingMeter.width/2, g_game.swingMeter.height/2);
	g_game.swingMeter.ctx.lineTo(g_game.swingMeter.width/2, 0);
	g_game.swingMeter.ctx.arc(g_game.swingMeter.width/2, g_game.swingMeter.height/2, g_game.swingMeter.width/2, 0 - Math.PI/2, g_game.swingPower - Math.PI/2);
	g_game.swingMeter.ctx.fill();

	g_game.swingMeter.dirty = true;

}

function alienShipHit(ball, ship) {
	//g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.02, function() {
	//	g_game.golfBall.kill();
	//}, this);

	g_game.sfx.hit_ship.play();
	ship.frameName = 'smallShip_damaged';
	ship.animations.stop();
	ship.animations.play('hover_damaged', 10, true);
	ship.hitPoints -= 1;
	if (ship.hitPoints <= 0) {
		g_game.sfx.ship_falling.play();
		g_game.alienPilot.body.acceleration.y = -g_game.gravity/2;
		g_game.alienShip.body.acceleration.y = -g_game.gravity/2;
		checkHoleOver();
		g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 1, function() {
			showExplosion(g_game.alienShip.x, g_game.alienShip.y);
			g_game.sfx.ship_done.play();
		}, this);
		g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 2, nextHole, this);

	}

}

function alienPilotHit() {
	//g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 0.02, function() {
	//	g_game.golfBall.kill();
	//}, this);
	g_game.sfx.drive.play();
	g_game.alienPilot.body.acceleration.y = 0;
	g_game.alienShip.body.acceleration.y = -g_game.gravity/2;

	checkHoleOver();
	g_game.golfBall.game.time.events.add(Phaser.Timer.SECOND * 2, nextHole, this);

}