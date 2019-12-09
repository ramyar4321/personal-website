window.addEventListener('DOMContentLoaded', function () {

    time_series = "function=TIME_SERIES_DAILY";
    symbol = "symbol=MSFT";
    outputsize = "outputsize=full";
    apikey = "apikey=demo";

    // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=demo
    url = "https://www.alphavantage.co/query?" + time_series + "&" + symbol + "&" + outputsize + "&" + apikey;

    getStockData(url)
        .then(responseText =>
            parseStockData(responseText)
        )
        .then(stock_info =>
            data_cleaning(stock_info)
        )
        .then(stock_info =>
            prep_data(stock_info)
        )
        /*.then(stock_info =>
            build_rnn(stock_info)
        )
        .then(rnn =>
            train_rnn(rnn)
        )
        .then(rnn =>
            perdict_rnn(rnn)
        )*/
        .then(stock_info =>
            plot_stock_info(stock_info)
        )
        .catch(error => {
            alert("Oops Something Went Wrong!" + error)
        });
});

/**
 * 
 * This function will resolve a promise if it gets stock data, in JSON format, with given URL
 * and reject a promise if URL request fails to retrieve stock data.
 * 
 * @param {String} url  The URL string to get data from.
 * 
 */
let getStockData = function (url) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send(null);

        request.onload = function () {
            if (request.readyState == 4 && request.status == 200) {
                resolve(request.responseText);
            } else {
                reject(Error(request.statusText));
            }
        };
        // Handle network errors
        request.onerror = function () {
            reject(Error("Network Error"));
        };
    });
};


let parseStockData = function (jsonData) {
    return new Promise(function (resolve, reject) {
        try {
            data = JSON.parse(jsonData);
        } catch (error) {
            reject(Error(error));
        }

        stockData = data["Time Series (Daily)"];
        if (typeof stockData === 'undefined') {
            reject("Undefined Stock data")
        }

        time = [];
        open = [];
        high = [];
        low = [];
        close = [];
        volume = [];
        for (var t in stockData) {
            time.push(t);
            open.push(stockData[t]["1. open"]);
            high.push(stockData[t]["2. high"]);
            low.push(stockData[t]["3. low"]);
            close.push(stockData[t]["4. close"]);
            volume.push(stockData[t]["5. volume"]);
        }

        stock_info = {
            time_info: time,
            open_info: open,
            high_info: high,
            low_info: low,
            close_info: close,
            volume_info: volume
        }

        //console.log(stock_info);
        resolve(stock_info);
    });
};

/**
 * 
 * This function will make sure the data is clean before analyzing and
 * plotting it:
 *      1. We make sure that all stock information is of the same length.
 *      2. First we make sure that each data point is of number.
 * 
 * @param {Object} stock_info   Contains time and stock value for:
 *                                  - Opening prices
 *                                  - High prices
 *                                  - Low prices
 *                                  - Close prices
 *                                  - Volume prices
 */
let data_cleaning = function (stock_info) {
    return new Promise(function (resolve, reject) {
        stock_lengths = [stock_info.time_info.length, stock_info.open_info.length, stock_info.high_info.length,
        stock_info.low_info.length, stock_info.close_info.length, stock_info.volume_info.length];
        if (!stock_lengths.every(function (v) { return v === stock_lengths[0]; })) {
            reject("Stock informations are not of the same lengths");
        }

        for (var i = 0; i < stock_lengths[0]; i++) {
            if (isNaN(Date.parse(stock_info.time_info[i]))) {
                reject("Invalid date given");
            }
            if (isNaN(stock_info.open_info[i]) ||
                isNaN(stock_info.high_info[i]) ||
                isNaN(stock_info.low_info[i]) ||
                isNaN(stock_info.close_info[i]) ||
                isNaN(stock_info.volume_info[i])) {
                reject("Invalid value given");
            }

        }

        resolve(stock_info);
    });
};

/**
 * 
 * This function will promise to prepare the data to be used in ML.
 * It will do the following:
 *      1. Decrease the size of the dataset to 3000 datapoints 
 *      2. Convert strings to floating values for a given stock data field.
 *      3. Normalize the closing and rolling average data
 *      4. Compute the rolling averages for stock data field, in this case closing data
 *      5. Split the data into training and test data
 * Resolve will return closing, rolling averages, and time data.
 * @param {Object} data 
 */
let prep_data = function (stock_data) {

    return new Promise(function (resolve, reject) {
        slice_start_position = 3000;
        if (slice_start_position < stock_data.close_info.length) {
            stock_data.close_info = stock_data.close_info.slice(0, slice_start_position);
            stock_data.time_info = stock_data.time_info.slice(0, slice_start_position);
        } else {
            reject("Dataset contains less than 3000 data points.");
        }

        stock_data.close_info = stock_data.close_info.map(close_info => {
            return parseFloat(close_info)
        });


        max = Math.max(...stock_info.close_info);
        min = Math.min(...stock_info.close_info);
        if (max - min == 0) {
            // If all values in the list are the same then max and min are the same
            // so do not divide
            close_info_normalized = stock_info.close_info.map(function (x) {
                return 1 / stock_info.close_info.length;
            });
        } else {
            close_info_normalized = stock_info.close_info.map(function (x) {
                return (x - min) / (max - min);
            });
        }
        //console.log(max);
        //console.log(min);
        //console.log(stock_info.close_info);
        //console.log(close_info_normalized);



        window_size = 50;
        //console.log( stock_info.close_info.length % window_size);
        if (stock_info.close_info.length % window_size != 0) {
            reject("Window size of 50 is not divisble number of data points");
        }
        X = [];
        Y = [];
        x_window = [];
        for (i = 0; i < stock_info.close_info.length - window_size; i++) {
            x_window = [];
            //curr_y = [];
            curr_avg = 0;
            t = i + window_size;
            for (k = i; k < t && k < stock_info.close_info.length; k++) {
                curr_avg += stock_info.close_info[k];
                x_window.push(stock_info.close_info[k]);
            }
            curr_avg = curr_avg / window_size;
            Y.push(curr_avg);
            X.push(x_window);
        }

        training_size = 70;
        X_train = X.slice(0, Math.floor(training_size / 100 * X.length));
        X_test = X.slice(Math.floor(training_size / 100 * X.length), X.length);
        Y_train = Y.slice(0, Math.floor(training_size / 100 * Y.length));
        Y_test = Y.slice(Math.floor(training_size / 100 * Y.length), Y.length);
        T_train = stock_data.time_info.slice(0, Math.floor(training_size / 100 * stock_data.time_info.length));
        T_test = stock_data.time_info.slice(Math.floor(training_size / 100 * stock_data.time_info.length), stock_data.time_info.length);
        /*console.log(X_train);
        console.log(X_test);
        console.log(Y_train);
        console.log(Y_test);
        console.log(X_train.length);
        console.log(Y_train.length);
        console.log(X_test.length);
        console.log(Y_test.length);*/
        train_size = X_train.length;
        test_size = X_test.length;


        prepared_data = {
            original_data: stock_info.close_info,
            X: X,
            Y: Y,
            X_train: X_train,
            Y_train: Y_train,
            X_test: X_test,
            Y_test: Y_test,
            window_size: window_size,
            train_size: train_size,
            test_size: test_size,
            normalized_data: close_info_normalized,
            time: stock_info.time_info,
        };

        resolve(prepared_data);

    });
};

/**
 * 
 * This function will build the RNN model.
 * 
 * @param {Object} prepared_data Data
 */
let build_rnn = function (prepared_data) {
    return new Promise(function (resolve, reject) {
        try {

            const learning_rate = 0.1;

            const input_layer_shape = prepared_data.window_size;
            const input_layer_neurons = 50;

            const n_layers = 2;

            const rnn_input_layer_features = 10;
            const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

            const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps];
            const rnn_output_neurons = 20;

            const output_layer_shape = rnn_output_neurons;
            const output_layer_neurons = 1;

            const model = tf.sequential();

            model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [input_layer_shape] }));
            model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));

            let lstm_cells = [];
            for (let index = 0; index < n_layers; index++) {
                lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
            }

            model.add(tf.layers.rnn({
                cell: lstm_cells,
                inputShape: rnn_input_shape,
                returnSequences: false
            }));

            model.add(tf.layers.dense({ units: output_layer_neurons, inputShape: [output_layer_shape] }));

            model.compile({
                optimizer: tf.train.adam(learning_rate),
                loss: 'meanSquaredError'
            });


            rnn = {
                model: model,
                prepared_data: prepared_data
            };
            resolve(rnn);
        } catch (error) {
            reject(Error(error));
        }


    });


};

/**
 * 
 * This function will train the rnn.
 * 
 * TODO: having a await in a promise might cause problems with error proegation
 * so I need to fix it.
 * 
 * @param {Object} rnn Contains data and model
 */
let train_rnn = function (rnn) {
    return new Promise(async (resolve, reject) => {

        try {
            let X = prepared_data.X_train
            let Y = prepared_data.Y_train;

            const xs = tf.tensor2d(X, [X.length, X[0].length]);
            const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]);


            const history = await rnn.model.fit(
                xs,
                ys, {
                batchSize: rnn.prepared_data.window_size,
                epochs: 30
            })

            rnn.hist = history;
            //console.log(rnn);
            resolve(rnn);
        } catch (error) {
            reject(Error(error));
        }
    });
};

let perdict_rnn = function (rnn) {

};

/**
 * 
 * @param {Object} stock_info Contains time and stock value for:
 *                                  - Dates 
 *                                  - Opening prices
 *                                  - High prices
 *                                  - Low prices
 *                                  - Close prices
 *                                  - Volume prices
 */
let plot_stock_info = function (prepared_data) {
    return new Promise(function (resolve, reject) {


        var canvas = document.getElementById("open_stock_info");
        var context = canvas.getContext('2d');
        //console.log(prepared_data.original_data);
        //console.log(prepared_data.time);

        //original_data = Object.assign(...prepared_data.time.map((k, i) => ({[k]: [prepared_data.original_data[i]]})));

        original_data = [];
        for(i = 0; i < prepared_data.time.length; i++){
            data = {};
            data.x = prepared_data.time[i];
            data.y = prepared_data.original_data[i];
            original_data.push(data);
        }
        console.log(original_data);
        var myChart = new Chart(context, {
            type: 'bar',
            data: data = {
                labels: prepared_data.time,
                datasets: [
                    {
                        type: 'line',
                        label: "Close",
                        fill: false,
                        yAxisID: 'y-axis-a',
                        lineTension: 0.1,
                        backgroundColor: 'rgb(75, 214, 238)',
                        borderColor: 'rgb(75, 214, 238)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(75, 214, 238)',
                        pointBackgroundColor: 'rgb(75, 214, 238)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: 'rgb(75, 214, 238)',
                        pointHoverBorderColor: 'rgb(75, 214, 238)',
                        pointHoverBorderWidth: 3,
                        pointRadius: 0.2,
                        pointHitRadius: 10,
                        data: original_data,
                    },
                    {
                        type: 'line',
                        label: "RollingAverageTrain",
                        fill: false,
                        yAxisID: 'y-axis-a',
                        lineTension: 0.1,
                        backgroundColor: 'rgb(210, 221, 72)',
                        borderColor: 'rgb(210, 221, 72)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(210, 221, 72)',
                        pointBackgroundColor: 'rgb(210, 221, 72)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: 'rgb(210, 221, 72)',
                        pointHoverBorderColor: 'rgb(210, 221, 72)',
                        pointHoverBorderWidth: 3,
                        pointRadius: 0.2,
                        pointHitRadius: 10,
                        data: prepared_data.Y,
                    },
                    {
                        type: 'line',
                        label: "NormalizedData",
                        fill: false,
                        yAxisID: 'y-axis-b',
                        lineTension: 0.1,
                        backgroundColor: 'rgb(238, 79, 75)',
                        borderColor: 'rgb(238, 79, 75)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgb(238, 79, 75)',
                        pointBackgroundColor: 'rgb(238, 79, 75)',
                        pointBorderWidth: 1,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: 'rgb(238, 79, 75)',
                        pointHoverBorderColor: 'rgb(238, 79, 75)',
                        pointHoverBorderWidth: 3,
                        pointRadius: 0.2,
                        pointHitRadius: 10,
                        data: prepared_data.normalized_data,
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Share Price - Past 7 Days',
                    fontSize: '20',
                    fontFamily: 'Open Sans, sans-serif',
                    // fontColor
                    // fontStyle
                    // padding
                    // lineHeight
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0
                        }
                    }],
                    yAxes: [{
                        position: "left",
                        id: "y-axis-a",
                    }, {
                        position: "right",
                        id: "y-axis-b",
                    }]
                }
            }
        });
        

        resolve();
    });
};