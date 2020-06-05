// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 105;
var lifeLeft = 3;
var totalAwsTokens = 9;
var badgeShown = false;
var failed = false;
var intro = true;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(375, 400, 'aws_green');
  createItem(575, 500, 'aws_violet');
  createItem(225, 500, 'aws_green');
  createItem(45, 250, 'aws_violet');
  createItem(100, 250, 'poison'); // poison by coin
  createItem(595, 150, 'aws_violet');
  createItem(555, 150, 'poison'); // poison next to coin
  createItem(525, 300, 'aws_violet');
  createItem(650, 250, 'aws_green');
  createItem(225, 200, 'aws_violet');
  createItem(325, 100, 'aws_green');
  createItem(375, 100, 'poison');
  createItem(70, 50, 'star');
  createItem(150, 90, 'poison'); // poison next to star
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(450, 550, 'platform');
  platforms.create(100, 550, 'platform2');
  platforms.create(300, 450, 'platform');
  platforms.create(250, 150, 'platform');
  platforms.create(50, 300, 'platform2');
  platforms.create(60, 125, 'platform2'); // add top left
  platforms.create(150, 250, 'platform');
  platforms.create(650, 300, 'platform2');
  platforms.create(550, 200, 'platform2');
  platforms.create(300, 450, 'platform');
  platforms.create(400, 350, 'platform');
  platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(590, 100, 'badge');
  badgeShown = true;
  //badge.animations.add('spin');
  //badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  //console.log(item);
  item.kill();
  if (item.key.startsWith('aws_')) {
    intro = false;
    totalAwsTokens = totalAwsTokens - 1;
    currentScore = currentScore + 10;
  } else if (item.key === 'star') {
    currentScore = currentScore + 25;
  } else if (item.key === 'poison') {
    currentScore -= 10;
    lifeLeft -= 1;
  }

  if (currentScore === winningScore) {
      createBadge();
  }

  if(totalAwsTokens == 0 && !badgeShown){
    failed = true;
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  //badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');

    //Load spritesheets
    game.load.spritesheet('player', 'dubey.png', 48, 62);
    game.load.spritesheet('aws_violet', 'aws_violet.png', 36, 44);
    game.load.spritesheet('aws_green', 'aws_green.png', 36, 44);
    game.load.image('badge', 'nischay.png');
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'praveen.png', 32, 32);
  } // end preload

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = cursors.up; //game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    // add LIVES counter
    text2 = game.add.text(600, 16, "LIVES: " + lifeLeft, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    losingMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 25px Arial", fill: "white" });
    introMessage = game.add.text(game.world.centerX, 275, 'Help Dubey to meet Nishchay. Use arrow keys to navigate.', { font: "bold 25px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
    introMessage.anchor.setTo(0.5, 1);
    losingMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    text2.text = "LIVES: " + lifeLeft;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player wins the game
    if (won) {
      winningMessage.text = "Congratulations!";
      game.add.text(game.world.centerX, game.world.centerY, "You helped Dubey to attend the meeting.", { font: "35px Arial", fill: "white" }).anchor.setTo(0.5, 0);
      cursors =false;
    }

    if(!intro){
      introMessage.text = '';
    }

    if (failed){
      losingMessage.text = "YOU LOST YOUR CHANCE TO MEET NISHCHAY."
      losingDesc = 'Minimum '+winningScore+' score needed';
      game.add.text(game.world.centerX, game.world.centerY, losingDesc, { font: "25px Arial", fill: "white" }).anchor.setTo(0.5, 0);
    }

    // when the player loses the game
    if (lifeLeft === 0) {
      losingMessage.text = "YOU LOST YOUR LAST LIFE...";
      player.kill();
    }
  }

  function render() { }

}; // end window onLoad
