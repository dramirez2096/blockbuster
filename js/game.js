var game;

var globalOptions = {
    ballSize: 0.04
}

window.onload = function() {
    game = new Phaser.Game(500, 400, Phaser.CANVAS);
    game.state.add("PlayGame", playGame, true);
}

var playGame = function(){}
playGame.prototype = {
    preload: function(){
        game.load.image("ball", "img/ball-sprite.png");
    }
}