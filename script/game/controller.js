/**
 * 
 * This object facilitates communication between the model Game class
 * and the view Display class.
 * 
 * @param {Game} Game 
 * @param {Display} Display 
 */
var Controller = function (Game, Display) {
    this.game = Game;
    this.display = Display;
};

/**
 * This function is called every 30/1000 milliseconds by the setInterval function
 * It will call the model Game object to update the game world, the all the
 * view Display class to render the game on screen.
 * 
 * @constructor
 * 
 */
Controller.prototype = {
    constructor: Controller,

    gameLoop: function () {

        this.game.world.updateWorld();

        switch (this.game.world.state) {
            case "game_start":
                this.display.renderStart();
                break;
            case "game_play":
                this.display.renderGame(this.game.world.player, this.game.world.canvas, this.game.world.blocks, this.game.world.timer);
                break;
            case "game_over":
                this.display.renderOver(this.game.world.outcome);
                break;
            default:
                break;
        }

    },

    /**
     * This function will:
     *      1. Initiate the canvas onto which the game will be rendered.
     *      2. Create listeners for key events. 
     *      3. Use setInterval to call game loop every 30/1000 milliseconds.
     */
    run: function () {

        this.display.initCanvas(this.game.world.canvas.width, this.game.world.canvas.height);

        that = this.game.world;
        document.addEventListener("keydown", function (event) {
            that.keyOn[event.keyCode] = true;
        }, false);

        document.addEventListener("keyup", function (event) {
            that.keyOn[event.keyCode] = false;
        }, false);

        interval = setInterval(this.gameLoop, 30 / 1000);
    }
};