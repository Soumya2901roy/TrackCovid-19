
$(document).ready(function () {
  $.getJSON("https://api.rootnet.in/covid19-in/stats/latest", null, function (
    data
  ) {
    Obj = data.data.summary;
    mainObj = data.data.regional.sort(function (a, b) {
      return (
        b.confirmedCasesIndian +
        b.confirmedCasesForeign -
        (a.confirmedCasesIndian + a.confirmedCasesForeign)
      );
    });
    var loca = [];
    var cases = [];
    var curedcases = [];
    var deathcases=[];
    var confirmedNational=Obj.confirmedCasesIndian;
    var confirmedIntl=Obj.confirmedCasesForeign;
    
   // console.log(mainObj)
    for (var i = 0; i < mainObj.length ; i++) {
      loca.push(mainObj[i].loc);
      cases.push(
        mainObj[i].confirmedCasesIndian + mainObj[i].confirmedCasesForeign
      );
      curedcases.push(mainObj[i].discharged);
      deathcases.push(mainObj[i].deaths);
     /* confirmedNational.push(mainObj[i].confirmedCasesIndian);
      confirmedIntl.push(mainObj[i].confirmedCasesForeign);*/
    }
    //console.log(confirmedNational)
    //console.log(confirmedIntl)

    var ctx = document.getElementById("statewise-chart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: loca,
        datasets: [
          {
            label: "Recovered",
            data: curedcases,
            backgroundColor: "#639a67",
            barThickness:1,
            fill:false
          },
          {
            label: "Confirmed",
            data: cases,
            backgroundColor: "#f6d186",
            barThickness:1,
            fill:false
            
          },
          {
            label: "Deceased",
            data: deathcases,
            barThickness:1,
            backgroundColor: "#061214",
            fill:true
          }
          
        ]
      },
     
      options: {
            tooltips: {
              mode:'index'
            },
            legend: {
              usePointStyle: true,
              position:"bottom",
              align: "left",
              fill: true,
              labels:{
                boxWidth: 5
              }
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    display: false
                }],
                yAxes: [{
                    stacked: true,
                    display: false,
                    ticks: {
                      
                      display: true //this will remove only the label
                  }
                }]
            }
        }
    
      
    });
    // End of  state wise chart   
    data2=[];
    data2.push(confirmedNational)
    data2.push(confirmedIntl)

    var ctx = document.getElementById("nationality-chart").getContext("2d");
    var myChart2 = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ['Indian', 'Overseas'],
        datasets: [
          {
            backgroundColor:['#aacfcf','#856c8b'],
            data: data2
          }
        ]
      },
      options:{
        cutoutPercentage: 60,
        rotation: Math.PI* 0.5,
        
        legend: {
          usePointStyle: true,
          position:"bottom",
          align: "left",
          labels:{
            boxWidth: 5
          }
        }
      }

     
            
    });
    // End of  nationality wise chart 
    
    var latest_active=(Obj.total-Obj.discharged-Obj.deaths);
    var latest_discharged=Obj.discharged;
    var latest_death=Obj.deaths;
    
    data3=[latest_active,latest_discharged,latest_death]
    console.log(data3)
    var ctx = document.getElementById("active-status-chart").getContext("2d");
    var myChart2 = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ['Active','Recovered','Deceased'],
        datasets: [
          {
            backgroundColor:['#f6d186','#639a67','#061214'],
            data: data3,
            borderWidth: 0.01
          }
        ]
      },
      options:{
        
        cutoutPercentage: 60,
        rotation: Math.PI* 0.5,
        legend: {
          usePointStyle: true,
          position:"bottom",
          align: "left",
          labels:{
            boxWidth: 5
          }
        }
      }

     
            
    });
    
  });
});
