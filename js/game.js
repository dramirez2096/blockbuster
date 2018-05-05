var game;

// global game options
var globalOptions = {
    ballSize: 0.04,
    scorePanelHeight: 0.08,
    bottomPanelHeight: 0.18,
    ballSpeed: 1000,
    blocksPerLine: 7,
    maxBlocksPerLine: 4
}

// starts up game when window loads
window.onload = function() {
    game = new Phaser.Game(640, 960, Phaser.CANVAS);
    game.state.add("PlayGame", playGame, true);
    console.log("on load works");
}

// code for PlayGame state
var playGame = function(){}
playGame.prototype = {

    // preloads sprites
    preload: function(){
        game.load.image("ball", "img/ball-sprite.png");
        game.load.image("panel", "img/panel.png");
        game.load.image("path", "img/trajectory.png");
        game.load.image("block", "img/block-sprite.png");
    },

    // creates game elements
    create: function(){

        // scales and sets background color
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;

        // import Phaser Arcade physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // creates score panel
        this.scorePanel = game.add.sprite(0, 0, "panel");
        this.scorePanel.width = game.width;
        this.scorePanel.height = Math.round(game.height * globalOptions.scorePanelHeight);

        game.physics.enable(this.scorePanel, Phaser.Physics.ARCADE);

        // this.scorePanel.body.enable = true;

        this.scorePanel.body.immovable = true;

        // creates bottom panel
        this.bottomPanel = game.add.sprite(0, game.height, "panel");
        this.bottomPanel.width = game.width;
        this.bottomPanel.height = Math.round(game.height * globalOptions.bottomPanelHeight);
        this.bottomPanel.anchor.set(0, 1);

        // adds Phaser arcade physics engine on bottom panel
        game.physics.enable(this.bottomPanel, Phaser.Physics.ARCADE);

        this.bottomPanel.body.immovable = true;

        // creates ball 
        var ballSize = game.width * globalOptions.ballSize;
        this.ball = game.add.sprite(game.width / 2, game.height - this.bottomPanel.height - ballSize / 2, "ball");
        this.ball.width = ballSize;
        this.ball.height = ballSize;
        this.ball.anchor.set(0.5);

        // adds Phaser arcade physics engine to ball
        game.physics.enable(this.ball, Phaser.Physics.ARCADE);

        // makes ball collide on bounds
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);

        // creates ball shooting path 
        this.path = game.add.sprite(this.ball.x, this.ball.y, "path");
        this.path.anchor.set(0.5, 1);
        this.path.visible = false;

        // code for player inputs
        game.input.onDown.add(this.aimBall, this);
        game.input.onUp.add(this.shootBall, this);
        game.input.addMoveCallback(this.adjustBall, this);

        // player not aiming by default
        this.aiming = false;

        // player not shooting by default
        this.shooting = false;

        // creates a new line of blocks
        this.placeLine();
    },

    placeLine: function(){
        var blockSize = game.width / globalOptions.blocksPerLine;

        var placedBlocks = [];

        for(var i = 0; i < globalOptions.maxBlocksPerLine; i++){
            var blockPosition = game.rnd.between(0, globalOptions.blocksPerLine - 1);

            if (placedBlocks.indexOf(blockPosition) == -1 ){
                placedBlocks.push(blockPosition);

                var block = game.add.sprite(blockPosition * blockSize + blockSize / 2, blockSize / 2 + game.height * globalOptions.scorePanelHeight, "block");
                block.width = blockSize;
                block.height = blockSize;
                block.anchor.set(0.5);

                // apply Phaser ARCADE physics to block
                game.physics.enable(block, Phaser.Physics.ARCADE);

                block.body.enable = true;

                // block.body.immovable = true;

                // makes block appear at row 1
                block.row = 1;

                this.blockGroup = [];
                this.blockGroup.add = function(){
                    this.add = function(block){
                        this.blockGroup.push(block);
                    }
                }
            }
        }
    },

    // function for aiming ball
    aimBall: function(e){
        if(!this.shooting){
            this.aiming = true;
        }
    },

    // makes trajectory sprite visible and sets shooting angle
    adjustBall: function(e){
        if(this.aiming){
            var distX = e.position.x - e.positionDown.x;
            var distY = e.position.y - e.positionDown.y;
            console.log(distX,distY);

            if (distY > 10){
                this.path.position.set(this.ball.x, this.ball.y);
                this.path.visible = true;
                this.direction = Phaser.Math.angleBetween(e.position.x, e.position.y, e.positionDown.x, e.positionDown.y);
                this.path.angle = Phaser.Math.radToDeg(this.direction) + 90;
            }
            else{
                this.path.visible = false;
            }
        }
    },

    // shoots ball at angle
    shootBall: function (){
        if(this.path.visible){
            var shootingAngle = Phaser.Math.degToRad(this.path.angle - 90);
            this.ball.body.velocity.set(globalOptions.ballSpeed * Math.cos(shootingAngle), globalOptions.ballSpeed * Math.sin(shootingAngle));
            this.shooting = true;
        }
        this.aiming = false;
        this.path.visible = false;
    },

    // stops ball when it hits the bottom panel
    update: function(){
        if(this.shooting){
            game.physics.arcade.collide(this.ball, this.scorePanel);
            game.physics.arcade.collide(this.ball, this.blockGroup, function(ball, block){
                block.destroy();
            }, null, this);

            game.physics.arcade.collide(this.ball, this.bottomPanel, function(){
                console.log('Again! Again! :D');
                this.ball.body.velocity.set(0);

                var scrollTween = game.add.tween(this.blockGroup).to({
                    y: this.blockGroup.y + game.width / globalOptions.blocksPerLine
                }, 200, Phaser.Easing.Linear.None, true);

                scrollTween.onComplete.add(function(){
                    this.shooting = false;
                    this.blockGroup.y = 0;
                    this.blockGroup.forEach(function(i){
                        i.y += game.width / globalOptions.blocksPerLine;
                        i.row++;
                        if(i.row == globalOptions.blocksPerLine){
                            game.state.start("PlayGame");
                        }
                    }, this);
                    this.placeLine();
                }, this)
            }, null, this);
        }
    }
}