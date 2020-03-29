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
  $(".lastup").html(
    moment(frame.day).format("DD MMMM, YYYY")
  );
  console.log()
  let tbl = `<table class="myTable">
                <thead>
               
                <th>State</td>
                <th>Cases</td>
                <th>Deaths</td>
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
  
}