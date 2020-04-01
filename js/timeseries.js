$(document).ready(function () {
    $.getJSON("https://api.rootnet.in/covid19-in/stats/history", null, function (
      data
    ) {
        Obj = data.data;
      
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
        var yesterday_summary=Obj[Obj.length-2];
        
        var today_summary=Obj[Obj.length-1];
       
        var delta_total=(today_summary.summary.total)-(yesterday_summary.summary.total);
        var delta_discharged=(today_summary.summary.discharged)-(yesterday_summary.summary.discharged);
        var delta_deaths=(today_summary.summary.deaths)-(yesterday_summary.summary.deaths);
        var delta_active=((today_summary.summary.total)-(today_summary.summary.discharged)-(today_summary.summary.deaths))-((yesterday_summary.summary.total)-(yesterday_summary.summary.discharged)-(yesterday_summary.summary.deaths));
        /*console.log(delta_total)
        console.log(delta_discharged)
        console.log(delta_deaths)*/
        
        $("div#delta_total").html("⇧ "+delta_total+"*");
        $("div#delta_discharged").html("⇧ "+delta_discharged+"*");
        $("div#delta_deaths").html("⇧ "+delta_deaths+"*");
        $("div#delta_active").html("⇧ "+delta_active+"*");

        

        
        

        var ctx = document.getElementById("confirmed-series-line").getContext("2d");
        var myChart3 = new Chart(ctx, {
            type: "line",
            data: {
              labels: date_series,
              datasets: [
                {
                  label: "Confirmed",
                  lineTension: 0.01,
                  pointBackgroundColor:"orange",
                  backgroundColor: "orange",
                  borderColor: "orange",
                  data: confirmed_series,
                  borderWidth: 1,
                  fill: false,
                  order:1
                },
                {
                    label: "Recovered",
                    lineTension: 0.01,
                    backgroundColor: "#639a67",
                    borderColor: "#639a67",
                    data: discharged_series,
                    borderWidth: 1,
                    fill: false,
                    order:2
                    
                },
                {
                    label: "Deceased",
                    lineTension: 0.5,
                    backgroundColor: "#061214",
                    borderColor: "#061214",
                    data: deceased_series,
                    borderWidth: 1,
                    
                    fill: true,
                    order:3
                }
              ]
            },
            options: {
                elements: {
                    point:{
                        radius: 3
                    }
                },
                legend: {
                 
                  position:"bottom",
                  align: "left",
                  labels:{
                    boxWidth: 5
                  }
                  },
                  responsive: true,
        tooltips: {
          mode: "index",
          intersect: false
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
                  scales: {
                    xAxes: [{
                      gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                        display: true,
                        ticks: {
                          display: true,
                          maxRotation:0,
                          autoSkip: true
                           
                      }
                    }],
                    yAxes: [{
                      gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                        display: true,
                        ticks: {
                          display: true //this will remove only the label
                      }
                    }]
                }
            }
            
      
           
                  
          });

            
    });
});