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
    this.xspeed = 2;
    this.color = "red";

    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;

    this.x = canvas_width/2 - this.width/2;
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

Game.World = function() {

    this.keyOn = [];

    this.canvas = new Game.Canvas();

    this.player = new Game.Player(this.canvas.width, this.canvas.height, this.keyOn);
};

Game.World.prototype = {
    constructor : Game.World
};
