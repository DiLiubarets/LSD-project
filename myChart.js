

// CHART.JS
var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var labels = ["", "", "", "", "", "", "", "", "", "", "Live"];
var liveInterval;
var historicalInterval;
// let color = [];
// for (i = 0; i < 50; i++) {
//   arr.push(10,30,45,23,13,89,55,67,32,12,7,43,67,86,24,89);
//   labels.push("Bitcoin");
//   color.push("green");
// }
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
        //backgroundColor: 'none',
        //  backgroundColor:[
        //    'green',
        //    'red',
        //    'yellow',
        //    'blue',
        //  ],
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
      text: "Bitcoin",
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
      arr[i-delta-1] = price
      labels[i-delta-1] = "Bitcoin"
    }
    massPopChart.update()
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

})

}

$('#timeDropdown').click(function (event) {
  var intervalNum = event.target.value
  var intervalString = event.target.id
  configPrice("bitcoin", intervalString, intervalNum)
})








// function addData(chart, label, data) {
//   chart.data.labels.push(label);
//   chart.data.datasets.forEach((dataset) => {
//     dataset.data.push(data);
//   });
//   chart.update();
// }

// function removeData(chart) {
//   chart.data.labels.pop();
//   chart.data.datasets.forEach((dataset) => {
//     dataset.data.pop();
//   });
//   chart.update();
// }
