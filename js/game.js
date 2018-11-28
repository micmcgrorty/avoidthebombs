// Define scenes
let mainScene = new Phaser.Scene('main');
let titleScene = new Phaser.Scene('title');
let gameOverScene = new Phaser.Scene('gameoverscene');

// Define game config
let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [titleScene, mainScene, gameOverScene]
};

// Define global variables    
let cursors;
let bombs;
let gameOver = false;
let score = 0;
let engineSound;
let highScore = 0;
let difficulty = 2;
let interval = 5000;

// Define game
let game = new Phaser.Game(config);

// Title preload - load background and ship
titleScene.preload = function() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ship', 'assets/shuttle2.png');
}

// Title create - display background and ship
//              - display difficulty levels
//              - define keyboard inputs for selecting difficulty
titleScene.create = function() {
    this.add.image(400, 300, 'sky');
    player = this.physics.add.sprite(400, 300, 'ship').setScale(0.7);
    this.add.text(150, 150, 'PRESS E TO START ON EASY!', {fontSize: '32px'});
    this.add.text(150, 190, 'PRESS M TO START ON MEDIUM!', {fontSize: '32px'});
    this.add.text(150, 230, 'PRESS H TO START ON HARD!', {fontSize: '32px'});
    cursors = this.input.keyboard.createCursorKeys();
    diffSelect = this.input.keyboard.addKeys({ 'easy': Phaser.Input.Keyboard.KeyCodes.E, 'med': Phaser.Input.Keyboard.KeyCodes.M, 'hard':Phaser.Input.Keyboard.KeyCodes.H });
}

// Title update - set bomb interval depending on which key pressed then start main scene
titleScene.update = function() {
    if (diffSelect.easy.isDown) {
        interval = 10000;
        this.scene.start('main');
    } else if (diffSelect.med.isDown) {
        interval = 5000;
        this.scene.start('main');
    } else if (diffSelect.hard.isDown) {
        interval = 2000;
        this.scene.start('main');
    }
}

// Main preload - load bomb and star images
mainScene.preload = function() {
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('star', 'assets/star.png');
}

// Main create - add background and ship
//             - add score and high score text and instruction text
//             - add bomb group and star group, add collision detection and add timed event for adding bombs
mainScene.create = function() {
    this.add.image(400, 300, 'sky');
    scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '16px'});
    highScoreText = this.add.text(660, 16, 'High Score: ' + highScore, {fontSize: '16px'});
    instructions = this.add.text(100, 400, 'Turn with left and right, thrust with up and blast with space!', {fontSize: '16px'});
    if (highScore > 0) {
        instructions.setText('');
    }
        
    player = this.physics.add.sprite(400, 300, 'ship').setScale(0.7);

    cursors = this.input.keyboard.createCursorKeys();

    bombs = this.physics.add.group();
    let bomb;

    stars = this.physics.add.group();
    let star;

    addBombs = this.time.addEvent({
        delay: interval,
        callback: addBomb,
        callbackScope: this,
        repeat: 99
    });
            
    this.physics.add.collider(bombs, player, collideWithBomb, null, this);
    this.physics.add.collider(stars, bombs, starHitBomb, null, this);

    gameOver = false;
    
    score = 0;

}

// Main update - Update score and high score
//             - Move ship or fire star depending on button pressed
//             - If game over then start new scene
mainScene.update = function() {

    if (score >= 2) {
        instructions.setText('');
    }

    if (score > highScore) {
        highScore = score;
    }

    player.setVelocity(0, 0);

    if (cursors.up.isDown && cursors.left.isDown) {
        player.angle -= 5;
        this.physics.velocityFromAngle(player.angle - 90, 200, player.body.velocity);
    } else if (cursors.up.isDown && cursors.right.isDown) {
        player.angle += 5;
        this.physics.velocityFromAngle(player.angle - 90, 200, player.body.velocity);
    } else if (cursors.up.isDown) {
        this.physics.velocityFromAngle(player.angle - 90, 200, player.body.velocity);
    } else if (cursors.left.isDown) {
        player.angle -= 5;
    } else if (cursors.right.isDown) {
        player.angle += 5;
    } else if (cursors.space.isDown) {
        fireLaser(this);
    } 

    if (player.x < -10) {
        player.x = 800;
    } else if (player.x > 810) {
        player.x = 0;
    } else if (player.y < -10) {
        player.y = 600;
    } else if (player.y > 610) {
        player.y = 0;
    }

    if (gameOver) {
        this.scene.start('gameoverscene');
    }

}

// Game over create - Add instructions to restart and update high score
gameOverScene.create = function() {
    this.add.image(400, 300, 'sky');
    this.add.text(200, 150, "GAME OVER!", { fontSize: '64px' });
    this.add.text(100, 300, "PRESS SPACE BAR TO RESTART!", { fontSize: '32px'});
    highScoreText.setText('High Score: ' + highScore);
}

// Game over update - back to title if button pressed
gameOverScene.update = function() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.space.isDown) {
        this.scene.start('title');
    }
}

// Game over if ship and bomb collide
function collideWithBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    gameOver = true;

}

// Add bombs at a random place off screen and increase score by 1
function addBomb() {

    if (gameOver) {
        return;
    }

    let side = Phaser.Math.Between(0, 3);
    let x;
    let y;

    if (side == 0) {
        x = Phaser.Math.Between(0, 0);
        y = Phaser.Math.Between(0, 600);
    } else if (side == 1) {
        x = Phaser.Math.Between(0, 800);
        y = Phaser.Math.Between(0, 0);
    } else if (side == 2) {
        x = Phaser.Math.Between(800, 800);
        y = Phaser.Math.Between(0, 600);
    } else if (side == 3) {
        x = Phaser.Math.Between(0, 800);
        y = Phaser.Math.Between(660, 600);
    }

    bomb = bombs.create(x, y, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(200, 200);
    bomb.allowGravity = false;

    score += 1;
    scoreText.setText('Score: ' + score);
}

// Fire stars from the front of the ship
function fireLaser(game) {
    star = stars.create(player.x, player.y, 'star').setScale(0.7);
    star.allowGravity = false;
    game.physics.velocityFromAngle(player.angle - 90, 200, star.body.velocity);

}

// Remove the star and the bomb if they collide
function starHitBomb(star, bomb) {
    star.disableBody(true, true);
    bomb.disableBody(true, true);

}