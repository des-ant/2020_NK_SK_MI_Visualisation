const myPlot = document.getElementById('myPlot');

const dataSource = "./data.csv";

// const dataSource = "https://raw.githubusercontent.com/dongasr/DECO3100/main/covid-mobility-data.csv";

function loadData() {
  Plotly.d3.csv(dataSource, function (data) {
    processData(data)
  });
};

function processData(allRows) {
  let csvData = {
    year: [],
    mortality: [],
    nk: [],
    sk: []
  }
  let x = [], y = [], z = [];
  for (let i = 0; i < allRows.length; i++) {
    let row = allRows[i];
    csvData.year.push(row["Year"]);
    csvData.nk.push(row["North Korea"]);
    csvData.sk.push(row["South Korea"]);
  }
  makePlot(csvData);
};

function makePlot(csvData) {
  var traces = [
    {
      x: csvData.year,
      y: csvData.nk,
      name: "North Korea"
    },
    {
      x: csvData.year,
      y: csvData.sk,
      name: "South Korea"
    }
  ];
  Plotly.newPlot(myPlot, traces, layout);
};

const layout = {
  title: "Child mortality 1950-2017 (IHME, 2018)",
  font: {
    size: 18,
    family: "Arial, sans-serif",
    color: "darkblue"
  },
  xaxis: {
    title: "Year"
  },
  yaxis: {
    title: "Deaths per 1000 live births (under 5 years old)"
  },
  showlegend: true,
  legend: {
    x: 0.1,
    xanchor: "left",
    y: 0.9
  }
};

loadData();

