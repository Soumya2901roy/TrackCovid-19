const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
var width = window.innerWidth * (isMobile ? 1 : 0.5);
var height = window.innerHeight * (isMobile ? 0.6 : 0.95);

var projection = d3.geoMercator();

var path = d3
  .geoPath()
  .projection(projection)
  .pointRadius(2);

var svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var g = svg.append("g");

var tooltip = d3
  .select("#map")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function drawMap(dna) {
  d3.json("final.json", function(error, data) {
    var boundary = centerZoom(data);
    var subunits = drawSubUnits(data);
    colorSubunits(subunits, dna);
    // drawSubUnitLabels(data);
    // drawOuterBoundary(data, boundary);
  });
}

drawMap();

casesByState = {};
let prevVal = 0;
let apiResp = null;

$.get("https://api.rootnet.in/covid19-in/stats/daily", async apiRespo => {
  apiResp = apiRespo;
  populate(prevVal);
});



function populate(prv) {

  console.log(prv)
  

  
  const reversed = apiResp.data.slice().reverse();
  const frame = reversed[prv];
  const {
    total,
    discharged,
    deaths,
    confirmedCasesForeign,
    confirmedCasesIndian
  } = frame.summary;
  $("#total_cases").html(total);
  $("#indian_cases").html(confirmedCasesIndian);
  $("#foreign_cases").html(confirmedCasesForeign);
  $("#death_cases").html(deaths);
  $("#cure_cases").html(discharged);
 
  var last_origin=apiResp.lastOriginUpdate

  console.log(last_origin)
  var localDate = new Date(last_origin);
  
  var last_up=moment(localDate).format("dddd, MMMM Do YYYY, h:mm:ss a")
  console.log(last_up)
  $(".last_up").html(last_up);
    let tbl = `<table class="myTable" >
                <thead>
               
                <th>State</td>
                <th>Cases</td>
                
                <th>Death</td>
                <th>Cured</td>
               
                </thead>
                <tbody>
                `;
  casesByState = {};
  frame.regional.forEach(st => {
    const {
      confirmedCasesForeign: f,
      confirmedCasesIndian: i,
      discharged: d,
      deaths: r,
      loc
    } = st;
    casesByState[loc] = [i, f, r, d];
    tbl += `<tr><td>${loc.replace(
      "Union Territory of ",
      ""
    )}</td><td>${i + f}</td><td>${r}</td><td>${d}</td></tr>`;
  });
  tbl += "</tbody></table>";
  $("#table").html(tbl);
  $(".myTable").DataTable({
    paging: false,
    bFilter: false,
    order: [[1, "desc"]]
  });
  // const maxCases = Math.max(
  //   ...frame.regional.map(
  //     v => v.confirmedCasesIndian + v.confirmedCasesForeign
  //   )
  // );
  const maxCases = 300;
  var color = d3
    .scaleLinear()
    .domain([-2, parseInt(0.6 * maxCases), maxCases])
    .range(["#ddd", "#f92774", "#b21a03"]);
  d3.json("final.json", function(error, data) {
    var svg = g
      .selectAll(".subunit")
      .data(topojson.feature(data, data.objects.polygons).features)
      .transition()
      .duration(700)
      .style("fill", function(d, i) {
        const state_name = d.properties.st_nm;
        if (state_name in casesByState) {
          return color(
            casesByState[state_name][0] + casesByState[state_name][1]
          );
        } else {
          return "#ddd";
        }
      });
  });
  
}
function centerZoom(data) {
  var o = topojson.mesh(data, data.objects.polygons, function(a, b) {
    return a === b;
  });
  
  projection.scale(1).translate([0, 0]);

  var b = path.bounds(o),
    s =
      1 /
      Math.max(
        (b[1][0] - b[0][0]) / width,
        ((b[1][1] - b[0][1]) / height) * 1.1
      ),
      s=580,
    t = [
      (width - s * (b[1][0] + b[0][0])) / 2,
      (height - s * (b[1][1] + b[0][1])) * 0.5
    ];
    console.log(s)

  var p = projection.scale(s).translate(t);

  return o;
}

function drawOuterBoundary(data, boundary) {
  g.append("path")
    .datum(boundary)
    .attr("d", path)
    .attr("class", "subunit-boundary")
    .attr("fill", "none")
    .attr("stroke", "#3a403d");
}

function drawSubUnits(data) {
  var subunits = g
    .selectAll(".subunit")
    .data(topojson.feature(data, data.objects.polygons).features)
    .enter()
    .append("path")
    .attr("class", "subunit")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1px")
    .on("mouseover", function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    })
    .on("mousemove", function(d) {
      const elem = casesByState[d.properties.st_nm];
      tooltip
        .html(
          `
        <div class="hover_label">
        <div class="state_label">${d.properties.st_nm}</div>
        <div class="cases_label">
          <div>Cases</div>
          <div class="vali">${elem ? elem[0] + elem[1] : 0}</div>
        </div>
        <div class="cases_label">
          <div>Deaths</div>
          <div class="vali">${elem ? elem[2] : 0}</div>
        </div>
        <div class="cases_label">
          <div>Recoveries</div>
          <div class="vali">${elem ? elem[3] : 0}</div>
        </div>
         </div>
        `
        )
        .style("left", d3.event.pageX -40 + "px")
        .style("top", d3.event.pageY - 400 + "px");
    })
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .duration(400)
        .style("opacity", 0);
    });

  return subunits;
}

function drawSubUnitLabels(data) {
  g.selectAll(".subunit-label")
    .data(topojson.feature(data, data.objects.polygons).features)
    .enter()
    .append("text")
    .attr("class", "subunit-label")
    .attr("transform", function(d) {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("font-size", ".5em")
    .style("text-shadow", "0px 0px 2px #fff")
    .style("text-transform", "uppercase")
    .text(function(d) {
      return d.properties.st_nm;
    });
}

const colorSubunits = (subunits, dna) => {
  // fetch("https://api.rootnet.in/covid19-in/stats/latest").then(resp=> resp.json).then(result=>console.log(result));
  var c = d3.scaleOrdinal(d3.schemeCategory20);
  subunits.style("fill", function(d, i) {
    return "#ddd";
  });
};