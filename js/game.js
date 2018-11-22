let mainScene = new Phaser.Scene('main');
let titleScene = new Phaser.Scene('title');
let gameOverScene = new Phaser.Scene('gameoverscene');

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
    
let cursors;
let bombs;
let gameOver = false;
let score = 0;
let engineSound;
let highScore = 0;
let difficulty = 2;
let interval = 5000;

let game = new Phaser.Game(config);

mainScene.preload = function() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ship', 'assets/shuttle2.png');
    this.load.image('star', 'assets/star.png');

    this.load.audio('gameover', 'assets/gameover.wav');
}

mainScene.create = function() {
    this.add.image(400, 300, 'sky');
    scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '16px'});
    highScoreText = this.add.text(660, 16, 'High Score: ' + highScore, {fontSize: '16px'});
        
    player = this.physics.add.sprite(400, 300, 'ship').setScale(0.7);
    player.setBounce(1);

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

mainScene.update = function() {

    if (score > highScore) {
        highScore = score;
    }

    player.setVelocity(0, 0);
            
    if (cursors.up.isDown) {
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

function collideWithBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    gameOver = true;

    this.sound.play('gameover');

}

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

function fireLaser(game) {
    star = stars.create(player.x, player.y, 'star').setScale(0.7);
    star.allowGravity = false;
    game.physics.velocityFromAngle(player.angle - 90, 200, star.body.velocity);

}

function starHitBomb(star, bomb) {
    star.disableBody(true, true);
    bomb.disableBody(true, true);

}

titleScene.preload = function() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ship', 'assets/shuttle2.png');
}

titleScene.create = function() {
    this.add.image(400, 300, 'sky');
    player = this.physics.add.sprite(400, 300, 'ship').setScale(0.7);
    this.add.text(150, 150, 'PRESS E TO START ON EASY!', {fontSize: '32px'});
    this.add.text(150, 190, 'PRESS M TO START ON MEDIUM!', {fontSize: '32px'});
    this.add.text(150, 230, 'PRESS H TO START ON HARD!', {fontSize: '32px'});
    cursors = this.input.keyboard.createCursorKeys();
    diffSelect = this.input.keyboard.addKeys({ 'easy': Phaser.Input.Keyboard.KeyCodes.E, 'med': Phaser.Input.Keyboard.KeyCodes.M, 'hard':Phaser.Input.Keyboard.KeyCodes.H });
}

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

gameOverScene.preload = function() {
    this.load.image('sky', 'assets/sky.png');
}

gameOverScene.create = function() {
    this.add.image(400, 300, 'sky');
    this.add.text(200, 150, "GAME OVER!", { fontSize: '64px' });
    this.add.text(100, 300, "PRESS SPACE BAR TO RESTART!", { fontSize: '32px'});
    highScoreText.setText('High Score: ' + highScore);
}

gameOverScene.update = function() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.space.isDown) {
        this.scene.start('title');
    }
}