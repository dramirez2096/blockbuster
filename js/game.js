var game;

window.onload = function() {
    game = new Phaser.Game(500, 400, Phaser.CANVAS);

    game.state.add("PlayGame", playGame, true);
}

var playGame = function(){}