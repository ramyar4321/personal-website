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

        open = [];
        high = [];
        low = [];
        close = [];
        volume = [];
        for (var time in stockData) {
            open.push([time, stockData[time]["1. open"]]);
            high.push([time, stockData[time]["2. high"]]);
            low.push([time, stockData[time]["3. low"]]);
            close.push([time, stockData[time]["4. close"]]);
            volume.push([time, stockData[time]["5. volume"]]);
        }

        stock_info = {
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
        stock_lengths = [stock_info.open_info.length, stock_info.high_info.length,
        stock_info.low_info.length, stock_info.close_info.length, stock_info.volume_info.length];
        if (!stock_lengths.every(function (v) { return v === stock_lengths[0]; })) {
            reject("Stock informations are not of the same lengths");
        }

        //for(var){}
        for (var i = 0; i < stock_lengths[0]; i++) {
            if (isNaN(Date.parse(stock_info.open_info[i][0])) ||
                isNaN(Date.parse(stock_info.high_info[i][0])) ||
                isNaN(Date.parse(stock_info.low_info[i][0])) ||
                isNaN(Date.parse(stock_info.close_info[i][0])) ||
                isNaN(Date.parse(stock_info.volume_info[i][0]))) {
                reject("Invalid date given");
            }
            if (isNaN(stock_info.open_info[i][1]) ||
                isNaN(stock_info.high_info[i][1]) ||
                isNaN(stock_info.low_info[i][1]) ||
                isNaN(stock_info.close_info[i][1]) ||
                isNaN(stock_info.volume_info[i][1])) {
                reject("Invalid value given");
            }

        }

        resolve(stock_info);
    });
};

/**
 * 
 * @param {Object} stock_info Contains time and stock value for:
 *                                  - Opening prices
 *                                  - High prices
 *                                  - Low prices
 *                                  - Close prices
 *                                  - Volume prices
 */
let plot_stock_info = function (stock_info) {
    return new Promise(function (resolve, reject) {

        labels = [];
        data = [];
        //console.log(stock_info.close_info);
        labels.push(stock_info.close_info.map(function (x) {
            return x[0];
        }));
        data.push(stock_info.close_info.map(function (x) {
            return x[1];
        }));


        //console.log(data);

        var canvas = document.getElementById("open_stock_info");
        var context = canvas.getContext('2d');


        var myChart = new Chart(context, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        resolve();
    });
};