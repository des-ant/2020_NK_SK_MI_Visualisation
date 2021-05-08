/*
  Code format from Rob Dongas 2021 Week 8 DECO3100 Tutorial
  GDP Graph
*/

//This stretch function is actually just the map function from p5.js
function stretch(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

const gdpChart = document.getElementById('gdpChart');
const gdpSource = "/data/gdp.csv";

function make_gdp(csv_data) {

  // Filter Country and Year
  let nk_data = csv_data.filter(d => d.country == "North Korea" && d.year >= 1940);
  let sk_data = csv_data.filter(d => d.country == "South Korea" && d.year >= 1940);

  // Store predictor values
  let nk_extension_x = [];
  let nk_extension_y = [];
  let sk_extension_x = [];
  let sk_extension_y = [];

  // Helper function for predictor
  function predict_gdp(country_data, extension_x, extension_y) {

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
    for (let year = 2017; year < 2031; year++) {
      //We've still got to work in the normalised scale
      let prediction = regression_result.predict(stretch(year, 1950, 2017, 0, 1))[1]

      extension_x.push(year);
      //Make sure to un-normalise for displaying on the plot
      extension_y.push(stretch(prediction, 0, 1, min_gdp, max_gdp));
    };
  }

  // Apply predictions
  predict_gdp(nk_data, nk_extension_x, nk_extension_y);
  predict_gdp(sk_data, sk_extension_x, sk_extension_y);

  let data = [
    {
      x: nk_data.map(d => d.year),
      y: nk_data.map(d => d.gdp),
      mode: 'lines',
      name: 'North Korea'
    },
    //adding our extension as a second trace
    {
      x: nk_extension_x,
      y: nk_extension_y,
      mode: 'lines',
      name: 'North Korea (Predicted)'
    },
    {
      x: sk_data.map(d => d.year),
      y: sk_data.map(d => d.gdp),
      mode: 'lines',
      name: 'South Korea'
    },
    //adding our extension as a second trace
    {
      x: sk_extension_x,
      y: sk_extension_y,
      mode: 'lines',
      name: 'South Korea (Predicted)'
    }
  ];

  let layout = {
    xaxis: { title: 'Year' },
    yaxis: { title: 'GDP per capita (Int$)' },
    title: 'GDP per capita of North Korea & South Korea, 1940-2030'
  };

  Plotly.newPlot(gdpChart, data, layout);
};

Plotly.d3.csv(gdpSource, make_gdp);

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
    y: [1020000, 495000],
    name: 'Army',
    type: 'bar'
  };
  let navy = {
    x: ["North Korea", "South Korea"],
    y: [60000, 70000],
    name: 'Navy',
    type: 'bar'
  };
  let air = {
    x: ["North Korea", "South Korea"],
    y: [110000, 65000],
    name: 'Air force',
    type: 'bar'
  };
  let para = {
    x: ["North Korea", "South Korea"],
    y: [189000, 4500],
    name: 'Paramilitary',
    type: 'bar'
  };

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

/*
  Code format from Rob Dongas 2021 Week 8 DECO3100 Tutorial
  Child Mortality Graph
*/

const mortalityChart = document.getElementById('mortality');
const mortalitySource = "/data/mortality.csv";

function make_mortality(csv_data) {

  // Filter Country
  let nk_data = csv_data.filter(d => d.country == "North Korea");
  let sk_data = csv_data.filter(d => d.country == "South Korea");

  // Store predictor values
  let nk_extension_x = [];
  let nk_extension_y = [];
  let sk_extension_x = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  let sk_extension_y = [
    3.54,
    3.104957555,
    2.904295416,
    2.703633277,
    2.502971138,
    2.302308998,
    2.101646859,
    1.90098472,
    1.700322581,
    1.499660441,
    1.298998302,
    1.098336163,
    0.8976740238,
    0.6970118846
  ];

  // Helper function for predictor
  function predict_mortality(country_data, extension_x, extension_y) {

    //To normalise our data, we need to know the minimum and maximum values
    //Math.min doesn't work with strings so we need to convert
    let mortality_data = country_data.map(d => Number(d.mortality))
    let min_mortality = Math.min(...mortality_data)
    let max_mortality = Math.max(...mortality_data)

    //This regression library needs values stored in arrays
    //We are using the strech function to normalise our data
    let regression_data = country_data.map(d => [stretch(d.year, 1950, 2017, 0, 1),
    stretch(d.mortality, min_mortality, max_mortality, 0, 1)])

    //Here is where we train our regressor, experiment with the order value
    let regression_result = regression.polynomial(regression_data, { order: 1 });

    //Now we have a trained predictor, lets actually use it!
    for (let year = 2017; year < 2031; year++) {
      //We've still got to work in the normalised scale
      let prediction = regression_result.predict(stretch(year, 1950, 2017, 0, 1))[1]

      extension_x.push(year);
      //Make sure to un-normalise for displaying on the plot
      extension_y.push(stretch(prediction, 0, 1, min_mortality, max_mortality));
    };
  };

  // Apply predictions
  predict_mortality(nk_data, nk_extension_x, nk_extension_y);
  // predict_mortality(sk_data, sk_extension_x, sk_extension_y);

  let data = [
    {
      x: nk_data.map(d => d.year),
      y: nk_data.map(d => d.mortality),
      mode: 'lines',
      name: 'North Korea'
    },
    //adding our extension as a second trace
    {
      x: nk_extension_x,
      y: nk_extension_y,
      mode: 'lines',
      name: 'North Korea (Predicted)'
    },
    {
      x: sk_data.map(d => d.year),
      y: sk_data.map(d => d.mortality),
      mode: 'lines',
      name: 'South Korea'
    },
    //adding our extension as a second trace
    {
      x: sk_extension_x,
      y: sk_extension_y,
      mode: 'lines',
      name: 'South Korea (Predicted)'
    }
  ];
  let layout = {
    xaxis: { title: 'Year' },
    yaxis: { title: 'Child Mortality Rate (%)' },
    title: 'Child Mortality Rate of North Korea & South Korea, 1950-2030',
    shapes: [
      // Highlight North Korean Famine 1994-1998
      {
        type: 'rect',
        // x-reference is assigned to the x-values
        xref: 'x',
        // y-reference is assigned to the plot paper [0,1]
        yref: 'paper',
        x0: 1994,
        y0: 0,
        x1: 1998,
        y1: 1,
        fillcolor: '#d3d3d3',
        opacity: 0.2,
        line: {
          width: 0
        }
      }
    ],
    annotations: [
      {
        x: 1996,
        y: 123,
        xref: 'x',
        yref: 'y',
        text: 'North Korean Famine 1994-1998',
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40
      }
    ]
  };
  Plotly.newPlot(mortalityChart, data, layout);
};

Plotly.d3.csv(mortalitySource, make_mortality);