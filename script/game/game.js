var Game = function(){

    this.world = new Game.World();
};

Game.prototype = {
    constructor: Game
};

Game.Canvas = function(){
    this.width = "500";
    this.height = "600";
    this.color = "white";
};

Game.Canvas.prototype = {
    constructor: Game.Canvas
}

Game.Player = function(canvas_width, canvas_height, keyOn) {
    this.width = 60;
    this.height = 25;
    this.xspeed = 2;
    this.color = "red";

    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;

    this.x = canvas_width /2 - this.width/ 2;
    this.y = canvas_height - this.height;

    this.keyOn = keyOn;
};

Game.Player.prototype = {
    constructor : Game.Player,

    reset:function(){
        this.x = this.canvas_width /2 - this.width/ 2;
        this.y = this.canvas_heigth - this.height;
    },

    update:function() {

        if (keyOn[37]) 
            this.x -= this.xSpeed; 
      
        if (keyOn[39]) 
            this.x += this.xSpeed;

        if (this.x < 0) 
            this.x = 0; 

        if (this.x + this.width < this.canvas_width) 
            this.x = this.canvas_width - this.width;
        }
}

Game.World = function() {

    this.canvas = new Game.Canvas();

    this.player = new Game.Player();

    this.keyOn = [];
};

Game.World.prototype = {
    constructor : Game.World
};
