// Wait untill DOM is properly loaded
window.addEventListener('DOMContentLoaded', function () {

    approx_methodes = document.getElementsByClassName("button");

    for (var i = 0; i < approx_methodes.length; i++) {

        approx_methodes[i].addEventListener("click", function () {
            let f_prime = document.getElementById("formula").querySelector("input").value;
            let h = document.getElementById("stepsize").querySelector("input").value;
            let x_0 = document.getElementById("initial-conditions").querySelector("input#x").value;
            let y_0 = document.getElementById("initial-conditions").querySelector("input#y").value;
            let x_final = document.getElementById("final-conditions").querySelector("input").value;
            params_valid = checkParameters(f_prime, h, x_0, y_0, x_final);

            if (params_valid.isValid) {
                if (this.id === "euler-button") {
                    eulerMethode(f_prime, parseFloat(h), parseFloat(x_0), parseFloat(y_0), parseFloat(x_final));
                } else {
                    runegekuttaMethode(f_prime, parseFloat(h), parseFloat(x_0), parseFloat(y_0), parseFloat(x_final));
                }

            } else {
                alert(params_valid.errorMessage);
            }
        })

    }
});

/**
 * This function determines if given inputs are valid.
 * @param {String}      f_prime     Determine if given formula is of the correct format
 *                                  and can be evaluated by eval()   
 * @param {Float}       h           Determine if given input is a valid float
 * @param {Float}       x_0         Determine if given input is a valid float
 * @param {Float}       y_0         Determine if given input is a valid float
 * @param {Float}       x_final     Determine if given input is a valid float
 * 
 * @returns {Object}
 */
function checkParameters(f_prime, h, x_0, y_0, x_final) {
    var params_validity = {
        errorMessage: "",
        isValid: true,
    };

    try {
        x = x_0;
        y = y_0;
        eval(f_prime);
    } catch (error) {
        params_validity.errorMessage += "Invalid function. \n";
        params_validity.isValid = false;
    }

    if (isNaN(h)) {
        params_validity.errorMessage += "Invalid stepsize. \n";
        params_validity.isValid = false;
    }

    if (isNaN(x_0)) {
        params_validity.errorMessage += "Invalid initial x. \n";
        params_validity.isValid = false;
    }

    if (isNaN(y_0)) {
        params_validity.errorMessage += "Invalid initial y. \n";
        params_validity.isValid = false;
    }

    if (isNaN(x_final)) {
        params_validity.errorMessage += "Invalid final x. \n";
        params_validity.isValid = false;
    }

    return params_validity;
}

/**
 * This function uses the Euler methode to approximate an Ordinary Differential Equation,
 * then display it on the screen for the user. 
 * Read more about it here: https://en.wikipedia.org/wiki/Euler_method
 * @param {String}      f_prime     Ordinary differential Equation of the form y'=f(x,y)  
 * @param {Float}       h           Euler step size. 
 * @param {Float}       x_0         Initial condition x
 * @param {Float}       y_0         Initial condition y
 * @param {Float}       x_final     Final condition y
 */
function eulerMethode(f_prime, h, x_0, y_0, x_final) {

    for (var x = x_0 + h, y = y_0; x <= x_final; x += h) {
        f_eval = eval(f_prime);
        y += f_eval * h;
    }

    alert(y);
}

/**
 * This function uses the Runge_Kutta methode to approximate an Ordinary Differential Equation,
 * then display it on the screen for the user. 
 * Read more about it here: https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 * @param {String}      f_prime     Ordinary differential Equation of the form y'=f(x,y)  
 * @param {Float}       h           Euler step size. 
 * @param {Float}       x_0         Initial condition x
 * @param {Float}       y_0         Initial condition y
 * @param {Float}       x_final     Final condition y
 */
function runegekuttaMethode(f_prime, h, x_0, y_0, x_final) {

    for (var x_temp = x_0, y_temp = y_0; x_temp <= x_final; x_temp += h) {
        x = x_temp;
        y = y_temp;
        k1 = eval(f_prime);
        x = (x_temp + h / 2);
        y = (y_temp + (0.5 * h * k1));
        k2 = eval(f_prime);
        y = (y_temp + (0.5 * h * k2));
        k3 = eval(f_prime);
        y = (y_temp + (0.5 * h * k3));
        k4 = eval(f_prime);

        average_slope = (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        y_temp += h * average_slope;
    }
    alert(y_temp);
}