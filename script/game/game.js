var Game = function () {

    this.world = new Game.World();
};

Game.prototype = {
    constructor: Game
};

Game.Canvas = function () {
    this.width = 800;
    this.height = 300;
    this.color = "blue";
};

Game.Canvas.prototype = {
    constructor: Game.Canvas
};

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

Game.Player.prototype = {
    constructor: Game.Player,

    reset: function () {
        this.x = this.canvas_width / 2 - this.width / 2;
        this.y = this.canvas_height - this.height;
    },

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

Game.Block.prototype = {
    constructor: Game.Block,

    updateBlock: function () {
        this.y += this.yspeed;

        if (this.y > this.canvas_heigth) {
            this.alive = false;
        }
    }
};

Game.Blocks = function () {
    this.blocks = [];

    this.blockSpawnSec = 1;
}

Game.Blocks.prototype = {
    constructor: Game.Blocks,

    updateBlocks: function () {
        this.blocks.forEach(block => {
            block.updateBlock();

            if (!block.alive) {
                this.remove();
            }
        });
    },

    add: function (canvas_width, canvas_heigth) {
        block = new Game.Block(canvas_width, canvas_heigth);
        this.blocks.push(block);
    },

    remove: function () {
        this.blocks.shift();
    },

    resetAllBlocks: function () {
        this.blocks = [];
    }
}

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

Game.Timer.prototype = {
    constructor: Game.Timer,

    setTimeStart_blockspawn: function (time_blockspawn) {
        this.timeStart_blockspawn = time_blockspawn;
    },

    setTimeFrame_blockspawn: function (time_blockspawn) {
        this.timeFrame_blockspawn = time_blockspawn;
    },

    setTimeStart_countdown: function (time_countdown) {
        this.timeStart_countdown = time_countdown;
    },

    setTimeFrame_countdown: function (time_countdown) {
        this.timeFrame_countdown = time_countdown;
    },

    decrementCountDown: function () {
        this.countdown -= 1;
    },

    isCountDownDone: function () {
        if (this.countdown > 0) {
            return false;
        } else {
            return true;
        }
    },

    resetCountdown: function () {
        this.countdown = 50;
    },

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

Game.World.prototype = {
    constructor: Game.World,

    updateWorld: function () {

        switch (this.state) {
            case "game_start":
                if (this.keyOn[32]) {
                    this.state = "game_play";
                }
                break;
            case "game_play":

                if (this.player.alive) {

                    date = new Date().getTime();

                    this.timer.setTimeFrame_blockspawn(date);
                    if (this.timer.intervalLapsed(this.blocks.blockSpawnSec,  this.timer.time_type_blockspawn)) {
                        this.blocks.add(this.canvas.width, this.canvas.height);
                        this.timer.setTimeStart_blockspawn(this.timer.timeFrame_blockspawn);
                    }

                    this.timer.setTimeFrame_countdown(date);
                    if (this.timer.intervalLapsed(this.timer.countdownSec, this.timer.time_type_countdown)){
                        this.timer.decrementCountDown();
                        this.timer.setTimeStart_countdown(this.timer.timeFrame_countdown);
                    }
                    
                    this.blocks.blocks.forEach(block => {
                        if(this.collision.checkCollision(this.player, block)){
                            this.player.alive =false;
                            this.outcome = "lost";
                        }
                    });
                    this.player.updatePlayer();
                    this.blocks.updateBlocks();
                    if(this.timer.isCountDownDone()){
                        this.player.alive = false;
                        this.outcome = "won";
                    }


                } else {
                    this.state = "game_over";
                }
                break;
            case "game_over":
                if (this.keyOn[32]) {
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
