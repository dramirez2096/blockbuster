var game;

// global game options
var globalOptions = {
    ballSize: 0.04,
    scorePanelHeight: 0.08,
    bottomPanelHeight: 0.18
}

// starts up game when window loads
window.onload = function() {
    game = new Phaser.Game(640, 960, Phaser.CANVAS);
    game.state.add("PlayGame", playGame, true);
}

// code for PlayGame state
var playGame = function(){}
playGame.prototype = {

    // preloads sprites
    preload: function(){
        game.load.image("ball", "img/ball-sprite.png");
        game.load.image("panel", "img/panel.png");
        game.load.image("path", "img/trajectory.png");
    },

    // creates game elements
    create: function(){

        // import Phaser Arcade physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // scales and sets background color
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;

        // creates score panel
        var scorePanel = game.add.image(0, 0, "panel");
        scorePanel.width = game.width;
        scorePanel.height = Math.round(game.height * globalOptions.scorePanelHeight);

        // creates bottom panel
        this.bottomPanel = game.add.sprite(0, game.height, "panel");
        this.bottomPanel.width = game.width;
        this.bottomPanel.height = Math.round(game.height * globalOptions.bottomPanelHeight);
        this.bottomPanel.anchor.set(0, 1);

        // adds Phaser arcade physics engine on bottom panel
        game.physics.enable(this.bottomPanel, Phaser.Physics.ARCADE);

        // creates ball 
        var ballSize = game.width * globalOptions.ballSize;
        this.ball = game.add.sprite(game.width / 2, game.height - this.bottomPanel.height - ballSize / 2, "ball");
        this.ball.width = ballSize;
        this.ball.height = ballSize;
        this.ball.anchor.set(0.5);
        console.log(this.ball);

        // adds Phaser arcade physics engine to ball
        game.physics.enable(this.ball, Phaser.Physics.ARCADE);

        // makes ball collide on bounds
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);

        // creates ball shooting path 
        this.path = game.add.sprite(this.ball.x, this.ball.y, "path");
        this.path.anchor.set(0.5, 1);
        this.path.visible = false;
    },

    aimBall: function(e){
        if(!this.shooting){
            this.aiming = true;
        }
    },

    shootBall: function (){

    }
}