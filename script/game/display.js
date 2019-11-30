var Display = function () {


    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
};

Display.prototype = {
    constructor: Display,

    drawObject: function (origin_x, origin_y, object_width, object_height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(origin_x, origin_y, object_width, object_height);
    },

    drawObjects: function (blocks) {
        blocks.forEach(block => {
            this.drawObject(block.x, block.y, block.width, block.height, block.color);
        });
    },

    clearDisplay: function (canvas_width, canvas_height) {
        this.context.clearRect(0, 0, canvas_width, canvas_height);
    },

    renderStart: function () {
        this.clearDisplay(this.canvas.width, this.canvas.height);

        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';

        this.context.fillText('Survive for 50 seconds. Press Space to Start Game', this.canvas.width / 2, this.canvas.height / 2);
    },

    renderGame: function (player, canvas, blocks, timer) {
        this.clearDisplay(canvas.width, canvas.height);
        this.drawObject(0, 0, canvas.width, canvas.height, canvas.color);
        this.drawObject(player.x, player.y, player.width, player.height, player.color);
        this.drawObjects(blocks.blocks);

        document.getElementById("countdown").innerHTML = timer.countdown;
    },

    renderOver: function (outcome) { 
        this.clearDisplay(this.canvas.width, this.canvas.height);

        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';

        //this.context.fillText('Press Space to replay', this.canvas.width / 2, this.canvas.height / 2);
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

    initCanvas: function (canvas_width, canvas_height) {
        this.canvas.width = canvas_width;
        this.canvas.height = canvas_height;
    }
};