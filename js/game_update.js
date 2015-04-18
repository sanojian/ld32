/**
 * Created by jonas on 2015-04-17.
 */

GameState.prototype.update = function() {

	this.game.physics.arcade.collide(g_game.golfBall, g_game.alienShip);
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