var game;

var globalOptions = {
    ballSize: 0.04,
    scorePanelHeight: 0.08,
    bottomPanelHeight: 0.18
}

window.onload = function() {
    game = new Phaser.Game(640, 960, Phaser.CANVAS);
    game.state.add("PlayGame", playGame, true);
}

var playGame = function(){}
playGame.prototype = {
    preload: function(){
        game.load.image("ball", "img/ball-sprite.png");
        game.load.image("panel", "img/panel.png");
    },
    create: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = 0x202020;

        var scorePanel = game.add.image(0, 0, "panel");
        scorePanel.width = game.width;
        scorePanel.height = Math.round(game.height * globalOptions.scorePanelHeight);

        this.bottomPanel = game.add.sprite(0, game.height, "panel");
        this.bottomPanel.width = game.width;
        this.bottomPanel.height = Math.round(game.height * globalOptions.bottomPanelHeight);
        this.bottomPanel.anchor.set(0, 1);

        var ballSize = game.width * globalOptions.ballSize;
        this.ball = game.add.sprite(game.width / 2, game.height - this.bottomPanel.height - ballSize / 2, "ball");
        this.ball.width = ballSize;
        this.ball.height = ballSize;
        this.ball.anchor.set(0.5);
        console.log(this.ball);
    }
}