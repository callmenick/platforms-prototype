/*
  variable declarations
  Description:
   the global variables we need access to in order to change the velocity of our character and a few others. 
  author: Alex Leonetti
*/

var SPEED = 200;
var GRAVITY = 1;
var LOAD_PLAYER_BOL = false;
var DEAD_PLAYER_X = 1;
var POS_X = 0;
var ANGLE = 0;
var POS_Y = 0;
var DECELERATE = false;
var ACCELERATE = false;
var RESET = false;
var RESETGAMEOVER = false;
var GAMECONTEXT;
var PLAYERS_ARRAY = [];


/*
  variable declarations
  Description:
   These global variables are necessary in order to clear intervals and timeouts when a level is over, as well as 
   when a player dies. 
  author: Alex Leonetti
*/

var players;
var landscape;
var landscapeSprite;

/*
  updatePosition
  Description:
   This is what constantly updates POS_X and POS_Y allowing our player to move 
  author: Alex Leonetti
*/

var updatePosition = function(positionArray) {

  for(var i=0; i < positionArray.length; i++) {
    if(positionArray && positionArray[i]) {
      POS_X = positionArray[i].data.velocity.x;
      POS_Y = positionArray[i].data.velocity.y;
      ANGLE = positionArray[i].data.velocity.x;
      RAD_ANGLE = ANGLE*(Math.PI / 180)
      DECELERATE = positionArray[i].data.decelerate;
      ACCELERATE = positionArray[i].data.accelerate;
      if(RESET && DECELERATE) {
        GAMECONTEXT.move();
      }
      if(RESETGAMEOVER && DECELERATE) {
        GAMECONTEXT.reset();
      }
    }
  }
};

/*
  display
  Description:
   Creates a new display object, connects it to the server, and sets up the updatePosition function
   as the handler for every communciation event 
  author: Alex Leonetti
*/
var display = new Display();
display.connect();
display.setInformationHandler(updatePosition);


/*
  state
  Description:
   The state object of a phaser game typically holds a preload, create, and update function. 
  author: Alex Leonetti
*/
var state = {

  /*
    preload
    Description:
     Loads our assets, spritesheets, and images 
    author: Alex Leonetti
  */
  preload: function() {
    this.load.image("background", "assets/background.jpg");
    this.load.image("player", "assets/triangle.png");
  },

  /*
    create
    Description:
     Adds the assets into the game on load
    author: Alex Leonetti
  */
  create: function() {

    /*
      physics
      Description:
       This statement allows the physics engine to be a part of our game
      author: Alex Leonetti
    */
    this.physics.startSystem(Phaser.Physics.P2JS);

    /*
      background
      Description:
       Creates an autoscrolling world, however the assets in the world do not move automatically
      author: Alex Leonetti
    */
    this.background = this.add.tileSprite(0,0, this.world.width, this.world.height, 'background');
    this.background.autoScroll(-SPEED, 0);

    /*
      players
      Description:
       Put the players in a group object for future optimization and multiplayer ability.
       Not being used now.
      author: Alex Leonetti
    */
    players = game.add.group();
    players.enableBody = true;

    /*
      player
      Description:
       Creates the player and adds the animations depending on the position in the sprite sheet
      author: Alex Leonetti
    */
    this.player = players.create(0, 0, 'player');
    this.player.anchor.setTo(0.5, 0.5);

    /**
     * Some spliney stuff from Nick
     */
    var rand = new Phaser.RandomDataGenerator();
    var width = 800;
    var steps = 10;
    var step = width/steps;
    var px = 0;
    var py = rand.integerInRange(450, 600);

    var landscape = game.add.bitmapData(8000, 600);

    landscape.ctx.beginPath();
    landscape.ctx.lineWidth = '10';
    landscape.ctx.strokeStyle = 'rgb(39, 39, 39)';
    landscape.ctx.stroke();
    landscape.ctx.moveTo(0, 600);

    for (var i = 1; i <= steps*10; i++) {
      py = rand.integerInRange(450, 600);
      px += step;
      landscape.ctx.lineTo(px, py);
      landscape.ctx.stroke();
    }

    landscapeSprite = game.add.sprite(0, 0, landscape);
    landscapeSprite.enableBody = true;
    this.physics.arcade.enableBody(landscapeSprite);

    /*
      reset
      Description:
       Allows the game to load the reset state first when it is created
      author: Alex Leonetti
    */
    this.reset();
  },

  /*
    update
    Description:
     Constantly called by the phaser engine updating all aspects of the game
    author: Alex Leonetti
  */
  update: function() {

    /*
      collide
      Description:
       Phaser has collision detection already, here we declare what the players can collide with
       and what happens when you collide
      author: Alex Leonetti
    */
    this.physics.arcade.collide(players, landscapeSprite);
    this.physics.arcade.collide(players, landscapeSprite, this.setGameOver, null, this);

    /*
      Velocity
      Description:
        Updates the character's velocity in game
      author: Alex Leonetti
    */
    if (POS_X !== 0 && this.player.body.x>1 && !this.player.dead){
      // this.player.body.velocity.x = POS_X*2;
      // this.player.angle = POS_X*1;
      this.player.angle = POS_X*1;
    } else if (POS_X === 0 && !this.player.body.touching.down && !this.player.dead) {
      this.player.angle = POS_X*1;
    }

    // var angle = Math.abs(POS_Y);
    // var radians = Math.tan(angle);
    // var degrees = radians * (180/Math.PI);

    if(DECELERATE && /*this.player.body.touching.down &&*/ !this.player.dead) {
      this.player.body.velocity.x += Math.cos(RAD_ANGLE)*(-20);
      this.player.body.velocity.y += Math.sin(RAD_ANGLE)*(-20);
    } else if(ACCELERATE && !this.player.dead){
      this.player.body.velocity.x += Math.cos(RAD_ANGLE)*20;
      this.player.body.velocity.y += Math.sin(RAD_ANGLE)*(20);
      // this.player.body.velocity.y = 400;
      // this.player.body.velocity.x = degrees;
    } else {
      this.player.body.velocity.x *= .9;//-99*(SPEED/100);
      this.player.body.velocity.y *= .9;
    }
    
 

    /*
      animations
      Description:
        Depending on the velocity of the character it will change character animations
      author: Alex Leonetti
    */
    if(this.gameStarted){
      if(this.player.body.velocity.x > 0 && this.player.body.x<770){
        // this.player.animations.play('still');
      } else if(this.player.body.velocity.x < -99 && this.player.body.x>10){
        // this.player.animations.play('still');
      } 

      if(this.player.body.x <= 10) {
        // this.player.animations.play('still');
        this.player.body.x = 10;
      } 


      if (this.player.body.y <= 25){
        this.player.body.y = 25;
        // this.player.animations.play('still');
      } 

      if (this.player.body.x >= 730) {
        this.player.body.x = 730
      }

    }



    /*
      GameOver
      Description:
        If player falls below the bottom of the world setGameOver. Do the same if the player is touching
        a platform above the world's top.
      author: Alex Leonetti
    */
    if(!this.gameOver){
      if(this.player.body.bottom >= this.world.bounds.bottom + 48){
        this.player.dead = true;
        this.setGameOver();
      }
      if(this.player.body.bottom <= this.world.bounds.top - 30 && this.player.body.touching.down) {
        this.player.dead = true;
        this.setGameOver();
      }
    }
  },

  /*
    Reset
    Description:
      The loading screen, must clear all intervals and timeouts in order for game to function correctly.
      Must also remove all group objects so the game starts from scratch.
    author: Alex Leonetti
  */
  reset:function() {
    DECELERATE = false;
    ACCELERATE = false;
    GAMECONTEXT = this;

    

    this.player.dead = false;
    this.gameStarted = false;
    this.gameOver = false;

    this.player.reset(this.world.width / 4, 100);
    this.player.dead = true;

    this.background.autoScroll(-SPEED * .30 ,0);

    setTimeout(function() {
      RESET = true;
    }, 1000);

  },

  /*
    Start / Move
    Description:
      When called will start the game,
      loads the first level, sets timeouts for each corresponding level,
      clears the timeouts on death
    author: Alex Leonetti
  */
  start: function() {  
    var context = this;

    this.player.dead = false;  
    this.player.body.gravity.y = GRAVITY;
    this.gameStarted = true;
    this.background.autoScroll(-SPEED * .40 ,0);
    landscapeSprite.body.velocity.x = -200;
       
  },
  move: function(){
    if(!this.gameStarted){
      RESET = false;
      RESETGAMEOVER = false;

      this.lastNum = 500;
      this.start();
    }

    if(this.gameOver){
      this.reset();
    }
  },

  /*
    setGameOver
    Description:
      Restores variables
    author: Alex Leonetti
  */
  setGameOver: function() {
    RESETGAMEOVER = true;

    this.gameOver = true;
    this.gameStarted = false;
    // this.scoreText.setText("PRESS JUMP TO\nTRY AGAIN");
    this.background.autoScroll(0, 0);
    this.player.dead = true;
    this.player.body.x = (32 * DEAD_PLAYER_X);
    this.player.body.y = 0;
    this.player.body.gravity.y = 0;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    // this.player.animations.play('still'); 
  }

}

/*
  game
  Description:
    The creation of the actual game.
    Uses the state object within the phaser game.
  author: Alex Leonetti
*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', state);