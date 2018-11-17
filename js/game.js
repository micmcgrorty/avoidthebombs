
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

    var game = new Phaser.Game(config);

    function preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('ship', 'assets/shuttle2.png');
    }

    function create() {
        this.add.image(400, 300, 'sky');
        player = this.physics.add.sprite(400, 300, 'ship').setScale(0.7);
        player.setCollideWorldBounds(true);
        player.setBounce(1);

        cursors = this.input.keyboard.createCursorKeys();

        bombs = this.physics.add.group();
        var bomb;

        for (var i = 0; i < 10; i++) {
            bomb = bombs.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(200, 200);
            bomb.allowGravity = false;
        }
        
        this.physics.add.collider(bombs, player, collideWithBomb, null, this);
    }

    function update() {
        player.setVelocity(0, 0);

        if (gameOver) {
            return;
        }
        
        if (cursors.up.isDown) {
            player.setVelocity(0, -200);
        } else if (cursors.down.isDown) {
            player.setVelocity(0, 200);
        } else if (cursors.left.isDown) {
            player.setVelocity(-200, 0);
        } else if (cursors.right.isDown) {
            player.setVelocity(200, 0);
        }

    }

    function collideWithBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        gameOver = true;
    }