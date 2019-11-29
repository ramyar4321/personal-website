var Controller =function(Game, Display){
    this.game = Game;
    this.display = Display;
};

Controller.prototype = {
    constructor: Controller,

    gameLoop:function(){
        this.display.clearDisplay(this.game.world.canvas.width, this.game.world.canvas.height);
        
        this.game.world.player.update();

        this.display.drawObject(0, 0, this.game.world.canvas.width, this.game.world.canvas.height, this.game.world.canvas.color);
        this.display.drawObject(this.game.world.player.x, this.game.world.player.y, this.game.world.player.width, this.game.world.player.height, this.game.world.player.color);
    },

    run:function(){

        this.display.initPage(this.game.world.canvas.width, this.game.world.canvas.height);

        that = this.game.world;
        document.addEventListener("keydown", function(event){
            //this.game.world.keyOn[event.keyCode] = true;
            that.keyOn[event.keyCode] = true;
        },false);

        document.addEventListener("keyup", function(event){
            that.keyOn[event.keyCode] = false;
        },false);

        interval = setInterval(this.gameLoop, 30/1000);
    }
};