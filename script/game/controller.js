var Controller =function(Game, Display){
    this.game = Game;
    this.display = Display;
};

Controller.prototype = {
    constructor: Controller,

    gameLoop:function(){        
        this.game.world.updateWorld();

        this.display.render(this.game.world.player, this.game.world.canvas, this.game.world.blocks);
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