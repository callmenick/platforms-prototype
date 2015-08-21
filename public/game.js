var preload = function() {
  game.load.image('background', 'assets/background.jpg');
  game.load.image('land', 'assets/land.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('hero', 'assets/hero.png', 32, 48);
};

/**
 * Cache some vars
 */

var create = function() {
  /**
   * Start up the physics engine
   */
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.gravity.y = 300;

  /**
   * Add and pan the background
   */
  this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');
  this.background.autoScroll(-100, 0);

  /**
   * Add the player
   */
  // var player = game.add.sprite(32, 0, 'dude');
  // game.physics.p2.enableBody(player, true);
  // playerGroup.add(player);

  /**
   * Create random data
   */
  var rand = new Phaser.RandomDataGenerator();
  var width = 800;
  var steps = 10;
  var step = width/steps;
  var px = 0;
  var py = rand.integerInRange(450, 600);

  var spline = game.add.bitmapData(800, 600);
  var poly =  game.add.bitmapData(800, 600);
  var polyPoints = [[400, 504], [480, 572], [560, 483], [560, 600]];
  
  spline.ctx.beginPath();
  spline.ctx.lineWidth = '10';
  spline.ctx.strokeStyle = 'rgb(39, 39, 39)';
  spline.ctx.stroke();
  spline.ctx.moveTo(0, 600);

  for (var i = 1; i <= steps; i++) {
    py = rand.integerInRange(450, 600);
    px += step;
    
    spline.ctx.lineTo(px, py);
    spline.ctx.stroke();

    console.log(px, py);
    
    // polyPoints.push([px, py]);
  }

  console.log(polyPoints);

  /**
   * Add spline to game
   */
  spline = game.add.sprite(0, 0, spline);

  /**
   * Add polygon to game
   */
  poly = game.add.sprite(0, 0, poly);
  game.physics.p2.enableBody(poly, true);
  poly.body.static = true;
  poly.body.clearShapes();
  // poly.body.addPolygon(data, 'landscape');
  poly.body.addPolygon({}, polyPoints);
  // poly.body.loadPolygon(data, 'landscape');

};

var update = function() {

  //  Collide the player and the stars with the platforms
  // game.physics.arcade.collide(player, platforms);

  //  Reset the players velocity (movement)
  // player.body.velocity.x = 0;

  // if (cursors.left.isDown) {
  //   //  Move to the left
  //   player.body.velocity.x = -250;
  //   player.animations.play('left');
  // } else if (cursors.right.isDown) {
  //   //  Move to the right
  //   player.body.velocity.x = 250;
  //   player.animations.play('right');
  // } else {
  //   //  Stand still
  //   player.animations.stop();
  //   player.frame = 4;
  // }

  // //  Allow the player to jump if they are touching the ground.
  // if (cursors.up.isDown && player.body.touching.down) {
  //   player.body.velocity.y = -600;
  // }
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
  preload: preload,
  create: create,
  update: update
});