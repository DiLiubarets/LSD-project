// var price = function(){
//     var queryURL = "https://api.coindesk.com/v1/bpi/currentprice.json"
//     $.ajax({
//     url: queryURL,
//     method: "GET",
//   }).then(function (response) {
//     var res = JSON.parse(response)
//     console.log(res.bpi.USD.rate)
//     console.log(res)
//     $('#price').text((res))
//   })
//   }

//   price()

   let myChart = document.getElementById('myChart').getContext('2d');

   // Global Options
   Chart.defaults.global.defaultFontFamily = 'Lato';
   Chart.defaults.global.defaultFontSize = 18;
   Chart.defaults.global.defaultFontColor = '#777';

   let massPopChart = new Chart(myChart, {
     type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
     data:{
       labels:['Bitcoin', 'Ethereum', 'XRP', 'NEM', 'Bitcoin Gold'],
       datasets:[{
         label:'Price',
         data:[
           617594,
           181045,
           153060,
           106519,
           105162,
           95072
         ],
         //backgroundColor:'green',
         backgroundColor:[
           'green',
           'red',
           'yellow',
           'blue',
          //  'rgba(153, 102, 255, 0.6)',
          //  'rgba(255, 159, 64, 0.6)',
          //  'rgba(255, 99, 132, 0.6)'
         ],
         borderWidth:1,
         borderColor:'#777',
         hoverBorderWidth:3,
         hoverBorderColor:'#000'
       }]
     },
     options:{
       title:{
         display:true,
         text:'Largest Cities In Massachusetts',
         fontSize:25
       },
       legend:{
         display:true,
         position:'right',
         labels:{
           fontColor:'#000'
         }
       },
       layout:{
         padding:{
           left:50,
           right:0,
           bottom:0,
           top:0
         }
       },
       tooltips:{
         enabled:true
       }
     }
   });
 