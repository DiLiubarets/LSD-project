var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var avgArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var labels = ["", "", "", "", "", "", "", "", "", "", "Live"];
var labels2 = ["", "", "", "", "", "", "", "", "", "", "Live"];
var liveInterval;
var historicalInterval;
var globalIntervalNum;
var globalIntervalString;
var globalCoin;
var myChart = document.getElementById("myChart").getContext("2d");

// object with description about coins
var aboutCoin = {
  bitcoin:
    "Bitcoin is a cryptocurrency which isn’t managed by a bank or agency but in which transactions are recorded in the blockchain that is public and contains records of each and every transaction that takes place. The cryptocurrency is traded by individuals with cryptographic keys that act as wallets. Bitcoin was first invented in 2009 by an anonymous founder known as Satoshi Nakamoto. Bitcoins are moved in blocks every 10 minutes on a decentralized ledger that connects blocks into a coherent chain dating back to the first genesis block. It was originally described as a peer-to-peer electronic cash but the technology has evolved to emphasize being a settlement layer rather than a payment network. This has left integrated second layer solutions, like Lightning Network, to prioritize that use case. It has remained the largest cryptocurrency by market cap.",
  ethereum:
    "Ethereum is a software system which is part of a decentralised system meaning it is not controlled by any single entity. Ethereum is different to Bitcoin because it expands on its technologies to create a completely new network including an internet browser, coding language and payment system – 'in short, Ethereum is a public, open-source, Blockchain based distributed software platform that allows developers to build and deploy decentralised applications'. The platform’s currency is called Ether. The platform was founded in 2014 by Vitalik Buterin and a team of other developers. The currency is just one aspect/component of Ethereum yet can be mined by individuals more easily than Bitcoin.",
  dash:
    "Dash is derivative of Litecoin, which is a derivative of Bitcoin and was created by Evan Duffield in January of 2014. It was originally known as Darkcoin but later rebranded as Dash in March of 2015. It uses a mix of miners and masternodes to validate transactions. A unique feature of Dash, is that it has has masternodes that stake at least 1000 DASH that have the ability to instantly confirm transactions. Transaction speed can be increased through masternode only validation which excludes miners. Privacy can also be enabled through 'PrivateSend' transactions that mix units. Dash has a voting system in place that can enable quick changes in governance if required rather than having a hard fork",
  eos:
    "EOS is similar to Ethereum in that it is a blockchain platform which allows decentralised apps to be created and developed. The platform should effectively provide its own operating system including cloud storage and has the ability to process one million transactions per second without any fees. A notable distinction is that transaction confirmation is done through a democracy like system where block producers are chosen by the entire EOS ecosystem through voting known as delegated proof of stake (DPoS). Block.one created EOS in September 2017 and it now has over 100 decentralised apps (dapps) with at most 6,000 daily active users.",
  ["bitcoin-cash"]:
    "Bitcoin Cash is a fork of Bitcoin that prioritizes onchain scaling and utility as a peer-to-peer electronic cash system. The 1 megabyte limit on bitcoin blocks meant that there was often a significant delay between transactions being initiated and completing, as well as increased fees due to the limited supply per block. Bitcoin Cash increased and will continue to increase block sizes which thereby increase the potential volume of transactions on the network. On August 1, 2017, Amaury Séchet released the first Bitcoin Cash software implementation. Miners running this software were able to validate a new kind transaction to create a new chain, BCH. This process is known as a 'hard fork' since it created a new version of the BTC chain that followed BCH rules. Today, BCH and BTC share the exact same transaction history up to that point.",
  waves:
    "Waves is a Blockchain platform developed to provide users with the opportunity of creating their own new custom token. Those tokens may be used for loyalty programs, in-app currency creation, and for ICO founding. ... The new token can be traded on Waves decentralized exchange.",
  litecoin:
    "For all intents and purposes, the function of Litecoin is almost identical to that of Bitcoin – it is a decentralised digital currency. It reduced the 10 min block confirmation time to 2.5 minutes which enables faster processing. The currency was created by Charlie Lee in October 2011 as an attempt to make Bitcoin more scalable and quick. During the period of high BTC fees of late 2017, observers suggested users were utilizing LTC as a second layer to send transactions.",
  ["binance-coin"]:
    "Binance Coin is the crypto-coin issued by Binance exchange, and trades with the BNB symbol. Binance coin runs on the Ethereum blockchain with ERC 20 standard, and has a strict limit of maximum 200 million BNB tokens.",
};
// Global Options for my chart
Chart.defaults.global.defaultFontFamily = "Helvetica";
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = "black";

// CHART.JS
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
      {
        label: "5 candle average",
        data: avgArr,
        borderWidth: 1,
        // backgroundColor: 'yellow',
        hoverBorderWidth: 7,
        hoverBorderColor: "orange",
      }
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
      fontColor: "gold",
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
  globalCoin = coin;
  globalIntervalString = intervalString;
  globalIntervalNum = intervalNum;

  //set description
  $("#description").html(aboutCoin[coin]);
  // title for coins
  massPopChart.options.title.text = coin.toUpperCase();

  var currentTime = Date.now();
  var startTime = currentTime - 600000 * intervalNum * 2;
  var queryHistorical =
    "https://api.coincap.io/v2/assets/" +
    coin +
    "/history?interval=" +
    intervalString +
    "&start=" +
    startTime +
    "&end=" +
    currentTime;
  var queryLive = "https://api.coincap.io/v2/rates/" + coin;

  getHistorical(queryHistorical);
  getLivePrice(queryLive);

  clearInterval(historicalInterval);
  clearInterval(liveInterval);

  historicalInterval = setInterval(function () {
    getHistorical(queryHistorical);
  }, intervalNum * 60000);
  liveInterval = setInterval(function () {
    getLivePrice(queryLive);
  }, 5000);
};

configPrice("bitcoin", "m1", 1);


// function getting historical data price
function getHistorical(queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var data = response.data;
    var delta = data.length - arr.length;
    var i = delta;
    for (i; i < data.length; i++) {

      var price = parseFloat(parseFloat(data[i].priceUsd).toFixed(3));
      arr[i - delta - 1] = price;
      labels[i - delta - 1] = globalCoin;
    }
    movingAvg(data)
    massPopChart.update();
  });
}

// function for live price
function getLivePrice(queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var price = parseFloat(parseFloat(response.data.rateUsd).toFixed(3));
    $("#realTimePrice").html("Live price: " + price);
    arr[arr.length - 1] = price;
    
    // for moving average live
    if (arr[0] != 0) {
      avgArr[avgArr.length - 1] = ((arr[arr.length-1]+arr[arr.length-2]+arr[arr.length-3]+arr[arr.length-4]+arr[arr.length-5])/5).toFixed(3);
    }
    massPopChart.update();
  });
}


// function for moving average 
function movingAvg(data) {
  
  var delta = data.length - avgArr.length;
  var i = delta;

    for (i; i < data.length; i++) {

      var price1 = parseFloat(parseFloat(data[i].priceUsd).toFixed(3));
      var price2 = parseFloat(parseFloat(data[i-1].priceUsd).toFixed(3));
      var price3 = parseFloat(parseFloat(data[i-2].priceUsd).toFixed(3));
      var price4 = parseFloat(parseFloat(data[i-3].priceUsd).toFixed(3));
      var price5 = parseFloat(parseFloat(data[i-4].priceUsd).toFixed(3));

      avgArr[i - delta - 1] = ((price1+price2+price3+price4+price5)/5).toFixed(3);
      $('#average').html( " average: " + avgArr[i - delta - 1] )
    }

    avgArr[avgArr.length - 1] = ((arr[arr.length-1]+arr[arr.length-2]+arr[arr.length-3]+arr[arr.length-4]+arr[arr.length-5])/5).toFixed(3);

}



// listener for time duration menu
$("#timeDropdown").click(function (event) {
  var intervalNum = event.target.value;
  var intervalString = event.target.id;
  configPrice(globalCoin, intervalString, intervalNum);
});

// listener for coin name
$("#currentCoin").click(function (event) {
  var coin = event.target.id;
  configPrice(coin, globalIntervalString, globalIntervalNum);
});

// ajax request for contact us form with formspree
$("#submitEmail").click(function (e) {
  var name = $("#inputName").val();
  var email = $("#inputEmail").val();
  var message = $("#inputMessage").val();

  if (name == "" || email == "" || message == "") {
    console.log("fail");
    return false;
  } else {
    e.preventDefault();
    var status = document.getElementById("my-form-status");
    var url = "https://formspree.io/xwkrpzap";
    var method = "POST";
    var data = new FormData();
    data.append("email", email);
    data.append("name", name);
    data.append("message", message);

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        console.log("success");
        status.innerHTML = "Thanks! Your message was send.";
      } else {
        console.log("error");
        status.innerHTML = "Oops! There was a problem.";
      }
    };
    xhr.send(data);
  }
});
