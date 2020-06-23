// CHART.JS
var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var labels = ["", "", "", "", "", "", "", "", "", "", "Live"];
var liveInterval;
var historicalInterval;
var globalIntervalNum;
var globalIntervalString;
var globalCoin;

var myChart = document.getElementById("myChart").getContext("2d");

// Global Options
Chart.defaults.global.defaultFontFamily = 'Helvetica';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = "black";


let massPopChart = new Chart(myChart, {
  type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: labels,
    datasets: [
      {
        label: "Price",
        data: arr,
        borderWidth: 1,
        borderColor: "black",
        hoverBorderWidth: 7,
        hoverBorderColor: "red",
      },
    ],
  },
  options: {
    scales: {
      xAxes: [
        {
          display: false, //this will remove all the x-axis grid lines
        },
      ],
    },
    title: {

      display: true,
      text: "",
      fontSize: 25,
      fontColor: 'gold',

    },
    legend: {
      display: false,
      position: "left",
      labels: {
        fontColor: "#000",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
    },
    tooltips: {
      enabled: true,
    },
  },
});


var configPrice = function (coin, intervalString, intervalNum) {
  
  globalCoin = coin
  globalIntervalString = intervalString
  globalIntervalNum = intervalNum

  var currentTime = Date.now()
  var startTime = currentTime - 600000 * intervalNum * 1.25
  var queryHistorical = "https://api.coincap.io/v2/assets/" + coin + "/history?interval=" + intervalString + "&start=" + startTime + '&end=' + currentTime
  var queryLive = 'https://api.coincap.io/v2/rates/' + coin

  getHistorical(queryHistorical)
  getLivePrice(queryLive)

  clearInterval(historicalInterval)
  clearInterval(liveInterval)

  historicalInterval = setInterval(function(){
    console.log('works')
    getHistorical(queryHistorical)
  }, intervalNum*60000)
  liveInterval = setInterval(function() {
    getLivePrice(queryLive)
  }, 5000)
}

configPrice("bitcoin", "m1", 1)

function getHistorical(queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var data = response.data

    console.log(data)

    var delta = data.length - arr.length
    var i = delta
    for (i; i < data.length; i++) {
      var price = parseInt(data[i].priceUsd)
      console.log("at "+price)
      arr[i-delta-1] = price
      labels[i-delta-1] = globalCoin
    }
    massPopChart.update()
    // massPopChart.options.title.text=coin.charAt(0).toUpperCase() + coin.slice(1)
  })
}

function getLivePrice(queryURL) {
$.ajax({
  url: queryURL,
  method: "GET",
}).then(function(response){
  var price = response.data.rateUsd
  console.log(price)
  $('#realTimePrice').html('Live price: '+ price)
  arr[arr.length-1] = price
  massPopChart.update()
  massPopChart.options.title.text=globalCoin.charAt(0).toUpperCase() + globalCoin.slice(1)
})
}

$('#timeDropdown').click(function (event) {
  var intervalNum = event.target.value
  var intervalString = event.target.id
  
  configPrice(globalCoin, intervalString, intervalNum)
})

$('#currencyDropdown').click(function (event) {
  var coin = event.target.id
  
  configPrice(coin, globalIntervalString, globalIntervalNum)
  massPopChart.options.title.text = event.target.innerText;
})
