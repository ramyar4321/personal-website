/**
 * Display the game onto the screen.
 */
var Display = function () {


    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
};

/**
 * Construct the Dispaly object
 */
Display.prototype = {
    constructor: Display,

    /**
     * This function will display a rectangle object with given
     * dimensions and color on the screen by drawing on canvas.
     * @param {Number} origin_x         x coordinate of the upper left corner of the rectangle 
     * @param {Number} origin_y         y coordinate of the upper left corner of the rectangle
     * @param {Number} object_width     x coordinate of the bottom right corner of the rectangle
     * @param {Number} object_height    y coordinate of the bottom right corner of the rectangle
     * @param {String} color            color of the rectangle
     */
    drawObject: function (origin_x, origin_y, object_width, object_height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(origin_x, origin_y, object_width, object_height);
    },

    /**
     * This function will display blocks onto the screen by drawing on the canvas.
     * @param {*Game.Blocks} blocks 
     */
    drawObjects: function (blocks) {
        blocks.forEach(block => {
            this.drawObject(block.x, block.y, block.width, block.height, block.color);
        });
    },

    /**
     * This function will clear the canvas.
     * @param {Number} canvas_width     Canvas height
     * @param {Number} canvas_height    Canvas width
     */
    clearDisplay: function (canvas_width, canvas_height) {
        this.context.clearRect(0, 0, canvas_width, canvas_height);
    },

    /**
     * This function will display the introduction screen.
     */
    renderStart: function () {
        this.clearDisplay(this.canvas.width, this.canvas.height);

        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';

        this.context.fillText('Survive for 50 seconds. Press Space to Start Game', this.canvas.width / 2, this.canvas.height / 2);
    },

    /**
     * This function displays the game to the screen while
     * the player is playing it. 
     * @param {Game.Player} player      The player object that needs to be displayed on screen. 
     * @param {Game.Canvas} canvas      The HTML canvas where the game is rendered.
     * @param {Game.Blocks} blocks      The block object that needs to be displayed on screen.
     * @param {Game.Timer} timer        The timer countdown that needs to be displayed on screen.
     */
    renderGame: function (player, canvas, blocks, timer) {
        this.clearDisplay(canvas.width, canvas.height);
        this.drawObject(0, 0, canvas.width, canvas.height, canvas.color);
        this.drawObject(player.x, player.y, player.width, player.height, player.color);
        this.drawObjects(blocks.blocks);

        document.getElementById("countdown").innerHTML = timer.countdown;
    },

    /**
     * This function will display the game over screen.
     * @param {String} outcome      Outcome of the game which has the value "lost" or "win" 
     */
    renderOver: function (outcome) { 
        this.clearDisplay(this.canvas.width, this.canvas.height);

        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';

        switch(outcome){
            case "won":
                this.context.fillText('Congradulations You Won! Press the space button to replay.', this.canvas.width / 2, this.canvas.height / 2);
                break;
            case "lost":
                this.context.fillText('Game Over. You Lost. Press the space button to restart.', this.canvas.width / 2, this.canvas.height / 2);
                break;
            default:
                break;
        }
    },

    /**
     * 
     * This function sets the canvas height and width.
     * 
     * @param {Number} canvas_width     Canvas Width 
     * @param {Number} canvas_height    Canvas Height
     */
    initCanvas: function (canvas_width, canvas_height) {
        this.canvas.width = canvas_width;
        this.canvas.height = canvas_height;
    }
};