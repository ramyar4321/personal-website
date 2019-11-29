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

    update:function() {

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

    this.x = Math.floor(Math.random() * (canvas_width - 0 + 1)) + 0;
    this.y = 0;

    this.alive = true;
};

Game.Block.prototype = {
    constructor: Game.Block,

    update:function(){
        this.y += this.yspeed;
    }
};

Game.Blocks = function(){
    this.blocks = [];
}

Game.Blocks.prototype = {
    constructor: Game.Blocks,

    updateBlocks:function(){
        this.blocks.forEach(block => {
            block.update();
        });
    },

    add:function(){
        block = new Block();
        this.blocks.push(block);
    },

    remove:function(){
        this.blocks.shift();
    }
}

Game.World = function() {

    this.keyOn = [];

    this.canvas = new Game.Canvas();

    this.player = new Game.Player(this.canvas.width, this.canvas.height, this.keyOn);

    this.blocks = new Game.Blocks();
};

Game.World.prototype = {
    constructor : Game.World
};
