
/**
 * Stores game world settings and logic.
 */
var Game = function () {

    this.world = new Game.World();
};

/**
 * 
 * Constructs a Game object.
 * 
 * @constructor
 */
Game.prototype = {
    constructor: Game
};

/**
 * Stores Canvas data.
 */
Game.Canvas = function () {
    this.width = 800;
    this.height = 300;
    this.color = "blue";
};

/**
 * Constructs Canvas object.
 * 
 * @constructor
 * 
 */
Game.Canvas.prototype = {
    constructor: Game.Canvas
};

/**
 * Stores Player data and logic.
 */
Game.Player = function (canvas_width, canvas_height, keyOn) {
    this.width = 30;
    this.height = 20;
    this.xspeed = 1;
    this.color = "red";

    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;

    this.x = canvas_width / 2 - this.width / 2;
    this.y = canvas_height - this.height;

    this.alive = true;

    this.keyOn = keyOn;
};

/**
 * Construct the player
 * 
 * @constructor
 * 
 */
Game.Player.prototype = {
    constructor: Game.Player,

    /** 
     * This function resets the player back to the 
     * bottom middle of the screen.
    */
    reset: function () {
        this.x = this.canvas_width / 2 - this.width / 2;
        this.y = this.canvas_height - this.height;
    },

    /**
     * This function moves the player left or right depending
     * on key presses.
     */
    updatePlayer: function () {

        if (this.keyOn[37])
            this.x -= this.xspeed;

        if (this.keyOn[39])
            this.x += this.xspeed;

        if (this.x < 0)
            this.x = 0;

        if (this.x + this.width >= this.canvas_width)
            this.x = this.canvas_width - this.width;
    }
}

/**
 * Stores Block data and logic. 
 */
Game.Block = function (canvas_width, canvas_height) {
    this.width = 20;
    this.height = 10;
    this.yspeed = 1;
    this.color = "black";

    this.canvas_width = canvas_width;
    this.canvas_heigth = canvas_height;

    this.x = Math.floor(Math.random() * (this.canvas_width - 0 + 1)) + 0;
    this.y = 0;

    this.alive = true;
};

/**
 * Construct Block object.
 * 
 * @constructor
 */
Game.Block.prototype = {
    constructor: Game.Block,

    /**
     * This function moves the block object
     * at a given spend.
     */
    updateBlock: function () {
        this.y += this.yspeed;

        if (this.y > this.canvas_heigth) {
            this.alive = false;
        }
    }
};

/**
 * Stores all the blocks and spawn speed.
 */
Game.Blocks = function () {
    this.blocks = [];

    this.blockSpawnSec = 1;
}


Game.Blocks.prototype = {
    constructor: Game.Blocks,

    /**
     * Update each block in list of blocks.
     */
    updateBlocks: function () {
        this.blocks.forEach(block => {
            // Update each block, i.e move it.
            block.updateBlock();

            // A block is not alive if it has moved
            // outside of the screen.
            if (!block.alive) {
                this.remove();
            }
        });
    },


    /**
     * This function adds a new block to list of blocks.
     * @param {number} canvas_width     Width of Canvas
     * @param {number} canvas_heigth    Height of Canvas
     */
    add: function (canvas_width, canvas_heigth) {
        block = new Game.Block(canvas_width, canvas_heigth);
        this.blocks.push(block);
    },

    /**
     * This function is called when a block is to be removed
     * from the list of blocks. This happens when a block has 
     * moved outside of Canvas. Logically, the first block
     * in the list would be the first to move outside of the canvas 
     * thus we only need to remove the first block and shift the rest.
     */
    remove: function () {
        this.blocks.shift();
    },

    /**
     * Empty the list of blocks. This function is called
     * when the game is reset. 
     */
    resetAllBlocks: function () {
        this.blocks = [];
    }
}

/**
 * Stores all the timer data, namely, the timer data
 * corresponding to tracking block spawn time and 
 * countdown time.
 */
Game.Timer = function () {
    this.time_type_blockspawn = "blockspawn";
    this.time_type_countdown = "countdown";

    this.timeStart_blockspawn = 0;
    this.timeFrame_blockspawn = 0;

    this.timeStart_countdown = 0;
    this.timeFrame_countdown = 0;
    this.countdown = 50;
    this.countdownSec = 1;
}

/**
 * Construct the game object.
 * 
 * @constructor
 */
Game.Timer.prototype = {
    constructor: Game.Timer,

    /**
     * Setter function for Time Start ticker
     * 
     * @param {number} time_blockspawn  Time Start for blockspawn ticker 
     */
    setTimeStart_blockspawn: function (time_blockspawn) {
        this.timeStart_blockspawn = time_blockspawn;
    },

    /**
     * Setter function for Time Frame ticker
     * 
     * @param {number} time_blockspawn  Time Frame for blockspawn ticker 
     */
    setTimeFrame_blockspawn: function (time_blockspawn) {
        this.timeFrame_blockspawn = time_blockspawn;
    },

    /**
     * Setter function for Time Start ticker
     * 
     * @param {number} time_countdown  Time Start for blockspawn ticker 
     */
    setTimeStart_countdown: function (time_countdown) {
        this.timeStart_countdown = time_countdown;
    },

    /**
     * Setter function for Time Frame ticker
     * 
     * @param {number} time_countdown  Time Frame for countdown ticker 
     */
    setTimeFrame_countdown: function (time_countdown) {
        this.timeFrame_countdown = time_countdown;
    },

    /**
     * Decrease the counter by 1.
     */
    decrementCountDown: function () {
        this.countdown -= 1;
    },

    /**
     * This function determines if the counter has reached 0.
     */
    isCountDownDone: function () {
        if (this.countdown > 0) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Reset counter back to 50. 
     */
    resetCountdown: function () {
        this.countdown = 50;
    },

    /**
     * 
     * @param {number} interval     Time in milliseconds that ticker must count
     * @param {string} time_type    Determine if function is being called for
     *                              countdown ticker or block spawn ticker.
     */
    intervalLapsed: function (interval, time_type) {

        return_value = false;

        switch (time_type) {
            case "blockspawn":
                if (this.timeFrame_blockspawn > (this.timeStart_blockspawn + interval * 1000)) {
                    return_value = true;
                } else {
                    return_value = false;
                }
                break;
            case "countdown":
                if (this.timeFrame_countdown > (this.timeStart_countdown + interval * 1000)) {
                    return_value = true;
                } else {
                    return_value = false;
                }
                break;
            default:
                return_value = false;
                break;
        }
        return return_value;
    }
}

/**
 * Store collision logic .
 */
Game.Collision = function () {

}


Game.Collision.prototype = {
    constructor: Game.Collision,

    checkCollision: function (player, block) {
        collision_x = false;
        collision_y = false;


        if ((block.y + block.height) >= player.y) {
            collision_y = true;
        }

        cond1 = (block.x >= player.x) && (block.x <= (player.x + player.width));
        cond2 = ((block.x + block.width) >= player.x) && ((block.x + block.width) <= (player.x + player.width));
        if (cond1 || cond2) {
            collision_x = true;
        }

        if (collision_x && collision_y) {
            return true;
        }
    }
}

/**
 * Store game world data and logic.
 */
Game.World = function () {

    this.keyOn = [];

    this.canvas = new Game.Canvas();

    this.player = new Game.Player(this.canvas.width, this.canvas.height, this.keyOn);

    this.blocks = new Game.Blocks();

    this.timer = new Game.Timer();

    this.collision = new Game.Collision();

    this.state = "game_start";

    this.outcome = "";
};

/**
 * Construct Game WOrld object
 */
Game.World.prototype = {
    constructor: Game.World,

    /**
     * This function updates the state of the game world.
     */
    updateWorld: function () {

        switch (this.state) {
            // If the game is at loading screen:
            case "game_start":
                // once the player has hit the space button, start the game
                if (this.keyOn[32]) {
                    this.state = "game_play";
                }
                break;

            // If the game is being played:
            case "game_play":

                // Check if the game has ended
                if (this.player.alive) {

                    // If the game is not yet over:

                    // Determine if an interval has passed:
                    date = new Date().getTime();
                    this.timer.setTimeFrame_blockspawn(date);
                    if (this.timer.intervalLapsed(this.blocks.blockSpawnSec, this.timer.time_type_blockspawn)) {
                        // If interval has passed, then spawn new block
                        // and start ticking till next spawn time.
                        this.blocks.add(this.canvas.width, this.canvas.height);
                        this.timer.setTimeStart_blockspawn(this.timer.timeFrame_blockspawn);
                    }
                    // Determine if an interval has passed:
                    this.timer.setTimeFrame_countdown(date);
                    if (this.timer.intervalLapsed(this.timer.countdownSec, this.timer.time_type_countdown)) {
                        // If an interval has passed, the decrement the game counter by 1
                        // and start ticking till next spawn time.
                        this.timer.decrementCountDown();
                        this.timer.setTimeStart_countdown(this.timer.timeFrame_countdown);
                    }

                    // Check if the player has collided with any blocks.
                    this.blocks.blocks.forEach(block => {
                        if (this.collision.checkCollision(this.player, block)) {
                            // If so, the game is over and the player has lost.
                            this.player.alive = false;
                            this.outcome = "lost";
                        }
                    });

                    // Update the blocks and player, i.e move the blocks down
                    // and the player right or left depending on key presses.
                    this.player.updatePlayer();
                    this.blocks.updateBlocks();


                    // Check if the game counter has reached zero.
                    if (this.timer.isCountDownDone()) {
                        // if so, the the game is over and the player has won
                        this.player.alive = false;
                        this.outcome = "won";
                    }


                } else {
                    // Game has ended.
                    this.state = "game_over";
                }
                break;
                
            case "game_over":
                // Check if the game is over:
                if (this.keyOn[32]) {
                    // Reset game world.
                    this.state = "game_play";
                    this.player.reset();
                    this.blocks.resetAllBlocks();
                    this.timer.resetCountdown();
                    this.outcome = "";
                    this.player.alive = true;
                }
                break;
            default:
                break;
        }
    }
};
