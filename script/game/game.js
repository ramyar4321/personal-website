var Game = function(){

    this.world = new Game.World();
};

Game.prototype = {
    constructor: Game
};

Game.Canvas = function(){
    this.width =800;
    this.height = 300;
    this.color = "blue";
};

Game.Canvas.prototype = {
    constructor: Game.Canvas
};

Game.Player = function(canvas_width, canvas_height, keyOn) {
    this.width = 30;
    this.height = 20;
    this.xspeed = 1;
    this.color = "red";

    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;

    this.x = canvas_width/2 - this.width/2;
    this.y = canvas_height - this.height;

    this.alive = true;

    this.keyOn = keyOn;
};

Game.Player.prototype = {
    constructor : Game.Player,

    reset:function(){
        this.x = this.canvas_width /2 - this.width/ 2;
        this.y = this.canvas_heigth - this.height;
    },

    updatePlayer:function() {

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

Game.Block = function(canvas_width, canvas_height){
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

    updateBlock:function(){
        this.y += this.yspeed;

        if(this.y > this.canvas_heigth){
            this.alive =false;
        }
    }
};

Game.Blocks = function(){
    this.blocks = [];

    this.blockSpawnSec = 1;
}

Game.Blocks.prototype = {
    constructor: Game.Blocks,

    updateBlocks:function(){
        this.blocks.forEach(block => {
            block.updateBlock();

            if(!block.alive){
                this.remove();
            }
        });
    },

    add:function(canvas_width, canvas_heigth){
        block = new Game.Block(canvas_width, canvas_heigth);
        this.blocks.push(block);
    },

    remove:function(){
        this.blocks.shift();
    }
}

Game.Timer = function(){
    this.timeStart = 0;
    this.timeFrame = 0;
}

Game.Timer.prototype = {
    constructor: Game.Timer,

    setTimeStart:function(time){
        this.timeStart = time;
    },

    setTimeFrame:function(time){
        this.timeFrame = time;
    },

    intervalLapsed:function(interval){
        if(this.timeFrame > (this.timeStart +interval*1000)){
            return true;
        }else{
            return false;
        }
    }
} 

Game.World = function() {

    this.keyOn = [];

    this.canvas = new Game.Canvas();

    this.player = new Game.Player(this.canvas.width, this.canvas.height, this.keyOn);

    this.blocks = new Game.Blocks();

    this.timer = new Game.Timer();
};

Game.World.prototype = {
    constructor : Game.World,

    updateWorld:function(){
        this.timer.setTimeFrame(new Date().getTime());

        this.player.updatePlayer();
        this.blocks.updateBlocks();
        if(this.timer.intervalLapsed(this.blocks.blockSpawnSec)){
            this.blocks.add(this.canvas.width, this.canvas.height);
            this.timer.setTimeStart(this.timer.timeFrame);
        }
    }
};
