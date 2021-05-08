const gdpChart = document.getElementById('gdpChart');
const gdpSource = "/data/gdp.csv";

/*
  Code format from Rob Dongas 2021 Week 8 DECO3100 Tutorial
  GDP Graph
*/

function make_plot(csv_data) {

  let country_data = csv_data.filter(d => d.country == "North Korea");
  let sk_data = csv_data.filter(d => d.country == "South Korea");

  //To normalise our data, we need to know the minimum and maximum values
  //Math.min doesn't work with strings so we need to convert
  let gdp_data = country_data.map(d => Number(d.gdp))
  let min_gdp = Math.min(...gdp_data)
  let max_gdp = Math.max(...gdp_data)

  //This regression library needs values stored in arrays
  //We are using the strech function to normalise our data
  let regression_data = country_data.map(d => [stretch(d.year, 1950, 2017, 0, 1),
  stretch(d.gdp, min_gdp, max_gdp, 0, 1)])

  //Here is where we train our regressor, experiment with the order value
  let regression_result = regression.polynomial(regression_data, { order: 3 });

  //Now we have a trained predictor, lets actually use it!
  let extension_x = [];
  let extension_y = [];
  for (let year = 2017; year < 2030; year++) {
    //We've still got to work in the normalised scale
    let prediction = regression_result.predict(stretch(year, 1950, 2017, 0, 1))[1]

    extension_x.push(year);
    //Make sure to un-normalise for displaying on the plot
    extension_y.push(stretch(prediction, 0, 1, min_gdp, max_gdp));
  }


  let data = [
    {
      x: country_data.map(d => d.year),
      y: country_data.map(d => d.gdp),
      mode: 'lines'
    },
    //adding our extension as a second trace
    {
      x: extension_x,
      y: extension_y,
      mode: 'lines'
    },
    {
      x: sk_data.map(d => d.year),
      y: sk_data.map(d => d.gdp),
      mode: 'lines'
    }
  ]
  Plotly.newPlot(gdpChart, data);
};

Plotly.d3.csv(gdpSource, make_plot);

//This stretch function is actually just the map function from p5.js
function stretch(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

/*
  Code format from plotly https://plotly.com/javascript/pie-charts/
  Chaebol Pie Chart
*/

const chaebol = document.getElementById('chaebol');

function makeChaebolPie(chaebolId) {
  let data = [{
    type: "pie",
    values: [2, 6, 8, 8, 30, 46],
    labels: ["Lotte", "LG", "Hyundai", "SK", "Samsung", "Others"],
    textinfo: "label+percent",
    textposition: "outside",
    automargin: true
  }]

  let layout = {
    title: 'Korean Stock Index By Company Share (2018)',
    height: 350,
    // width: 400,
    margin: { "t": 50, "b": 0, "l": 0, "r": 0 },
    showlegend: false
  }
  Plotly.newPlot(chaebolId, data, layout)
};

makeChaebolPie(chaebol);

/*
  Code format from plotly https://plotly.com/javascript/bar-charts/
  Military Bar Chart
*/

const military = document.getElementById('military');

function makeMilitaryBar(militaryId) {
  let army = {
    x: ["North Korea", "South Korea"],
    y: [1020000,495000],
    name: 'Army',
    type: 'bar'
  };
  let navy = {
    x: ["North Korea", "South Korea"],
    y: [60000,70000],
    name: 'Navy',
    type: 'bar'
  };
  let air = {
    x: ["North Korea", "South Korea"],
    y: [110000,65000],
    name: 'Air force',
    type: 'bar'
  };
  let para = {
    x: ["North Korea", "South Korea"],
    y: [189000,4500],
    name: 'Paramilitary',
    type: 'bar'
  };
  // let res = {
  //   x: ["North Korea", "South Korea"],
  //   y: [5700000,4500000],
  //   name: 'Reserves',
  //   type: 'bar'
  // };
  // let tanks = {
  //   x: ["North Korea", "South Korea"],
  //   y: [3500,2434],
  //   name: 'Tanks',
  //   type: 'bar'
  // };
  // let aircraft = {
  //   x: ["North Korea", "South Korea"],
  //   y: [545,567],
  //   name: 'Aircraft',
  //   type: 'bar'
  // };
  // let sub = {
  //   x: ["North Korea", "South Korea"],
  //   y: [73,23],
  //   name: 'Submarines',
  //   type: 'bar'
  // };
  // let art = {
  //   x: ["North Korea", "South Korea"],
  //   y: [21100,11000],
  //   name: 'Artillery',
  //   type: 'bar'
  // };

  // let data = [army, navy, air, para, res, tanks, aircraft, sub, art];
  let data = [army, navy, air, para];
  let layout = {
    xaxis: { title: 'Country' },
    yaxis: { title: 'Number of Active Personnel' },
    barmode: 'relative',
    title: 'Military Size of North Korea & South Korea (2017)'
  };
  Plotly.newPlot(militaryId, data, layout)
};

makeMilitaryBar(military);