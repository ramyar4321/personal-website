//window.addEventListener('load',function(){
window.addEventListener('DOMContentLoaded',function(){
//window.onload = function () {

    document.getElementById("euler-button").addEventListener("click", eulerMethode);
    document.getElementById("rungekutta-button").addEventListener("click", runegekuttaMethode);
});
//}

function eulerMethode() {
    let f_prime = document.getElementById("formula").querySelector("input").value;
    let h = parseFloat(document.getElementById("stepsize").querySelector("input").value);
    let x_0 = parseFloat(document.getElementById("initial-conditions").querySelector("input#x").value);
    let y_0 = parseFloat(document.getElementById("initial-conditions").querySelector("input#y").value);
    let x_final = parseFloat(document.getElementById("final-conditions").querySelector("input").value);

    for (var x = x_0 + h, y = y_0; x <= x_final; x += h) {
        f_eval = eval(f_prime);
        y += f_eval * h;
    }
    
}

function runegekuttaMethode () {
    let f_prime = document.getElementById("formula").querySelector("input").value;
    let h = parseFloat(document.getElementById("stepsize").querySelector("input").value);
    let x_0 = parseFloat(document.getElementById("initial-conditions").querySelector("input#x").value);
    let y_0 = parseFloat(document.getElementById("initial-conditions").querySelector("input#y").value);
    let x_final = parseFloat(document.getElementById("final-conditions").querySelector("input").value);

    for (var x_temp = x_0, y_temp = y_0; x_temp <= x_final; x_temp += h){
        x= x_temp;
        y = y_temp;
        k1 = eval(f_prime);
        x = (x_temp + h/2);
        y = (y_temp+ (0.5*h*k1));
        k2 = eval(f_prime);
        y = (y_temp+ (0.5*h*k2));
        k3 = eval(f_prime);
        y = (y_temp+ (0.5*h*k3));
        k4 = eval(f_prime);
        
		average_slope = (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        y_temp += h*average_slope;
    }
    alert(y_temp);
}