var Display = function(){


    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
};

Display.prototype = {
    constructor: Display,

    drawObject:function(origin_x, origin_y, object_width, object_height, color){
        dest_x = origin_x + object_width;
        dest_y = origin_y - object_height;
        
        this.context.fillStyle =color;
        this.context.fillRect(origin_x, origin_y, dest_x, dest_y);
    },

    clearDisplay:function(canvas_width, canvas_height){
        this.context.clearRect(0,0,canvas_width, canvas_height);
    }
};