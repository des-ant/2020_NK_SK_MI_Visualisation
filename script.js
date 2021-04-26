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


// // --------------------

// const myPlot = document.getElementById('myPlot');

// const dataSource = "./data.csv";

// // const dataSource = "https://raw.githubusercontent.com/dongasr/DECO3100/main/covid-mobility-data.csv";

// function loadData() {
//   Plotly.d3.csv(dataSource, function (data) {
//     processData(data)
//   });
// };

// function processData(allRows) {
//   let csvData = {
//     year: [],
//     mortality: [],
//     nk: [],
//     sk: []
//   }
//   let x = [], y = [], z = [];
//   for (let i = 0; i < allRows.length; i++) {
//     let row = allRows[i];
//     csvData.year.push(row["Year"]);
//     csvData.nk.push(row["North Korea"]);
//     csvData.sk.push(row["South Korea"]);
//   }
//   makePlot(csvData);
// };

// function makePlot(csvData) {
//   var traces = [
//     {
//       x: csvData.year,
//       y: csvData.nk,
//       name: "North Korea"
//     },
//     {
//       x: csvData.year,
//       y: csvData.sk,
//       name: "South Korea"
//     }
//   ];
//   Plotly.newPlot(myPlot, traces, layout);
// };

// const layout = {
//   title: "Child mortality 1950-2017 (IHME, 2018)",
//   font: {
//     size: 18,
//     family: "Arial, sans-serif",
//     color: "darkblue"
//   },
//   xaxis: {
//     title: "Year"
//   },
//   yaxis: {
//     title: "Deaths per 1000 live births (under 5 years old)"
//   },
//   showlegend: true,
//   legend: {
//     x: 0.1,
//     xanchor: "left",
//     y: 0.9
//   }
// };

// loadData();

// ---------------------
// https://plotly.com/javascript/dropdowns/


// ---------------------------

// Week 8 Tutorial


function make_plot(csv_data) {

  let country_data = csv_data.filter(d => d.country == "Afghanistan");

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
  let regression_result = regression.polynomial(regression_data, { order: 3 });

  //Now we have a trained predictor, lets actually use it!
  let extension_x = [];
  let extension_y = [];
  for (let year = 2017; year < 2030; year++) {
    //We've still got to work in the normalised scale
    let prediction = regression_result.predict(stretch(year, 1950, 2017, 0, 1))[1]

    extension_x.push(year);
    //Make sure to un-normalise for displaying on the plot
    extension_y.push(stretch(prediction, 0, 1, min_mortality, max_mortality));
  }


  let data = [{
    x: country_data.map(d => d.year),
    y: country_data.map(d => d.mortality),
    mode: 'lines'
  },
  //adding our extension as a second trace
  {
    x: extension_x,
    y: extension_y,
    mode: 'lines'
  }]
  Plotly.newPlot('myDiv', data);
}


Plotly.d3.csv("mortality.csv", make_plot);

//This stretch function is actually just the map function from p5.js
function stretch(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};


// -------------------

Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv', function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

var allCountryNames = unpack(rows, 'country'),
    allYear = unpack(rows, 'year'),
    allGdp = unpack(rows, 'gdpPercap'),
    listofCountries = [],
    currentCountry,
    currentGdp = [],
    currentYear = [];

  for (var i = 0; i < allCountryNames.length; i++ ){
    if (listofCountries.indexOf(allCountryNames[i]) === -1 ){
      listofCountries.push(allCountryNames[i]);
    }
  }
  
  function getCountryData(chosenCountry) {
    currentGdp = [];
    currentYear = [];
    for (var i = 0 ; i < allCountryNames.length ; i++){
      if ( allCountryNames[i] === chosenCountry ) {
        currentGdp.push(allGdp[i]);
        currentYear.push(allYear[i]);
      } 
    }
  };

// Default Country Data
setBubblePlot('Afghanistan');
  
function setBubblePlot(chosenCountry) {
    getCountryData(chosenCountry);  

    var trace1 = {
      x: currentYear,
      y: currentGdp,
      mode: 'lines+markers',
      marker: {
        size: 12, 
        opacity: 0.5
      }
    };

    var data = [trace1];

    var layout = {
      title: 'GDP per cap according to Country<br>'+ chosenCountry + ' GDP'
    };

    Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
};
  
var innerContainer = document.querySelector('[data-num="0"'),
    plotEl = innerContainer.querySelector('.plot'),
    countrySelector = innerContainer.querySelector('.countrydata');

function assignOptions(textArray, selector) {
  for (var i = 0; i < textArray.length;  i++) {
      var currentOption = document.createElement('option');
      currentOption.text = textArray[i];
      selector.appendChild(currentOption);
  }
}

assignOptions(listofCountries, countrySelector);

function updateCountry(){
    setBubblePlot(countrySelector.value);
}
  
countrySelector.addEventListener('change', updateCountry, false);
});