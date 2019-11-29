var Display = function(){


    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
};

Display.prototype = {
    constructor: Display,

    drawObject:function(origin_x, origin_y, object_width, object_height, color){
        this.context.fillStyle =color;
        this.context.fillRect(origin_x, origin_y, object_width, object_height);
    },

    clearDisplay:function(canvas_width, canvas_height){
        this.context.clearRect(0,0,canvas_width, canvas_height);
    },

    initPage:function(canvas_width, canvas_height){
        this.canvas.width = canvas_width;
        this.canvas.height = canvas_height;
    }
};