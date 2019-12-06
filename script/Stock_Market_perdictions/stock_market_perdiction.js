window.addEventListener('DOMContentLoaded', function () {

    time_series = "TIME_SERIES_DAILY";
    symbol = "MSFT";
    interval = "full";
    apikey = "demo";

    data = getStockData(time_series, symbol, interval,  apikey);
});

var HttpClient = function() {
    this.get = function(url, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
                callback(httpRequest.responseText);
        };

        httpRequest.open("GET", url, true);
        httpRequest.send(null);
    };


};

/**
 * 
 * This function gets stock data from https://www.alphavantage.co/
 * 
 * @param {String} time_series  The time series of your choice.
 * @param {String} symbol       The name of the equity of your choice.
 * @param {String} interval     Time interval between two consecutive data points.
 * @param {String} apikey       API key.
 * 
 */
function getStockData(time_series, symbol, interval,  apikey){
    url = "https://www.alphavantage.co/query?function="+time_series+"&symbol="+symbol+"&outputsize="+interval+"&apikey="+apikey;

    var client = new HttpClient();

    client.get(url, function(response){
        console.log(response);
    });
};

