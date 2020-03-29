$(document).ready(function () {
    $.getJSON("https://api.rootnet.in/covid19-in/stats/history", null, function (
      data
    ) {
        Obj = data.data;
      //  console.log(Obj)
        var date_series=[];
        var confirmed_series=[];
        var discharged_series=[];
        var deceased_series=[];
        var l=Obj.length -1
        for (var i = 0; i < Obj.length ; i++){
           // console.log(Obj[i].summary)
            date_series.push(Obj[i].day)
            confirmed_series.push(Obj[i].summary.total)
            discharged_series.push(Obj[i].summary.discharged)
            deceased_series.push(Obj[i].summary.deaths)
        }

        //console.log(date_series)

        
        

        var ctx = document.getElementById("confirmed-series-line").getContext("2d");
        var myChart3 = new Chart(ctx, {
            type: "line",
            data: {
              labels: date_series,
              datasets: [
                {
                  label: "Confirmed",
                  lineTension: 0.1,
                  //backgroundColor: "#f6d186",
                  borderColor: "orange",
                  data: confirmed_series,
                  borderWidth: 1,
                  fill: false
                },
                {
                    label: "Recovered",
                    lineTension: 0.1,
                    //backgroundColor: "#f6d186",
                    borderColor: "#639a67",
                    data: discharged_series,
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: "Deceased",
                    lineTension: 0.1,
                    //backgroundColor: "#f6d186",
                    borderColor: "#061214",
                    data: deceased_series,
                    borderWidth: 1,
                    fill: false
                }
              ]
            },
            options: {
                elements: {
                    point:{
                        radius: 0
                    }
                },
                legend: {
                    display: false
                  },
                scales: {
                    xAxes: [{
                        
                        display: false
                    }],
                    yAxes: [{
                        display: false
                    }]
                }
            }
            
      
           
                  
          });

            
    });
});