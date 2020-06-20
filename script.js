var apiDocs = "https://docs.coincap.io/?version=latest#ee30bea9-bb6b-469d-958a-d3e35d442d7a"


var http = require('https');

var currentTime = Date.now()
var startTime = currentTime - 600000

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
  host: 'api.coincap.io',
  path: '/v2/assets/'+ coin +'/history?interval=m1&start='+ startTime +'&end='+ currentTime,
  method: 'GET'
};

var options2 = {
    host: 'api.coincap.io',
    //path: '/v2/rates/bitcoin',
    path: '/v2/assets',
    method: 'GET'
  };

callback = function(response) {
 
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    var array = JSON.parse(str);
    console.log(array)
    

    for (var item of array.data) {
        console.log(item.id)
    }

  });
}

//http.request(options2, callback).end();
http.request(options2, callback).end();


//console.log(Date.now())