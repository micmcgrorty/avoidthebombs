
var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    
    var cursors;
    var bombs;
    var gameOver = false;
    var playing = false;
    var score = 0;
    var engineSound;

    var game = new Phaser.Game(config);

    function preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('ship', 'assets/shuttle2.png');

        this.load.audio('engine', 'assets/engine.wav');
        this.load.audio('gameover', 'assets/gameover.wav');
    }

    function create() {
        this.add.image(400, 300, 'sky');
        scoreText = this.add.text(16, 16, 'Score: ', {fontSize: '16px'});
        player = this.physics.add.sprite(400, 300, 'ship').setScale(0.7);
        player.setBounce(1);

        cursors = this.input.keyboard.createCursorKeys();

        bombs = this.physics.add.group();
        var bomb;

        addBombs = this.time.addEvent({
            delay: 2000,
            callback: addBomb,
            callbackScope: this,
            repeat: 99
        });
            
        this.physics.add.collider(bombs, player, collideWithBomb, null, this);
    
    }

    function update() {
        player.setVelocity(0, 0);

        if (gameOver) {
            this.add.text(300, 300, "GAME OVER!", { fontSize: '64px' });

            return;
        }
            
        if (cursors.up.isDown) {
            player.angle = 0;
            player.setVelocity(0, -200);
            this.sound.play('engine');
        } else if (cursors.down.isDown) {
            player.angle = 180;
            player.setVelocity(0, 200);
            this.sound.play('engine');
        } else if (cursors.left.isDown) {
            player.angle = 270;
            player.setVelocity(-200, 0);
            this.sound.play('engine');
        } else if (cursors.right.isDown) {
            player.angle = 90;
            player.setVelocity(200, 0);
            this.sound.play('engine');
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

        bomb = bombs.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(200, 200);
        bomb.allowGravity = false;

        score += 1;
        scoreText.setText('Score: ' + score);
    }