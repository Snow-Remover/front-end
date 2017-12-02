var d3 = require("d3");
var $ = require("jquery");
var SerialPort = require('serialport');
// var longString;

var port = new SerialPort('/dev/cu.usbserial-DA011IEE', {
  baudRate: 9600
});

// port.on('data', function (data) {
//   // data += data;
//   var length = data.length();
//   var temp;
//   for(let i = 0; i < length ; i++){
//     temp = data.charAt(i);
//     if(temp != '|'){
//       continue;
//     }
//   }
//   console.log('Data:', data.toString());
// });

var margin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 60
  },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var realwidth = 1.83;
var realheight = 1.21;
var xratio = width / realwidth;
var yratio = height / realheight;

svg.append('circle')
  .attr("stroke", "red")
  .attr("stroke-width", "2")
  .attr("fill", "orange")
  .attr("r", 20)
  .attr("cx", 50)
  .attr("cy", 50);


svg.append('circle')
  .attr("stroke", "red")
  .attr("stroke-width", "2")
  .attr("fill", "orange")
  .attr("r", 20)
  .attr("cx", 50 + width)
  .attr("cy", 50);

svg.append('circle')
  .attr("stroke", "red")
  .attr("stroke-width", "2")
  .attr("fill", "orange")
  .attr("r", 20)
  .attr("cx", 50)
  .attr("cy", 50 + height);

svg.append('circle')
  .attr("stroke", "red")
  .attr("stroke-width", "2")
  .attr("fill", "orange")
  .attr("r", 20)
  .attr("cx", 50 + width)
  .attr("cy", 50 + height);

$('#chart').click(function(e) { //Default mouse Position

  if (e.pageX < 50 || e.pageY < 50 || e.pageX > 50 + width || e.pageY > 50 + height) {
    alert("OUT OF RANGE");
  } else {
    $('#moveto').remove();
    svg.append('circle')
      .attr("id", "moveto")
      .attr("stroke", "red")
      .attr("fill", "red")
      .attr("r", 30)
      .attr("cx", e.pageX)
      .attr("cy", e.pageY);

    // console.log((e.pageX/xratio).toPrecision(3));
    // console.log(e.pageX + ", " + e.pageY);
    // console.log(e.pageX.map(50, 50 + width, 0, realwidth).toPrecision(3) + ", " + e.pageY.map(50, 50 + height, realheight, 0).toPrecision(3));

    let x = e.pageX.map(50, 50 + width, 0, realwidth);
    let y = e.pageY.map(50, 50 + height, realheight, 0);
    if (x < 1) {
      x = x.toPrecision(2);
    } else {
      x = x.toPrecision(3);
    }

    if (y < 1) {
      y = y.toPrecision(2);
    } else {
      y = y.toPrecision(3);
    }

    console.log("MOVING TO: " + x + ", " + y);

    // |rotate 0180\n
    // |translate " + (e.pageX/xratio).toPrecision(3) + (e.pageY/yratio).toPrecision(3)+ "\n
    port.write("|translate " + x + y + "\n", function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });

    // Open errors will be emitted as an error event
    port.on('error', function(err) {
      console.log('Error: ', err.message);
    })
    //send the coordinate
  }
});

(function parse() {
  var data = '';
  var char = '';
  var byte = '';
  var split = '';
  port.on('readable', function() {
    // console.log(port.read(1).toString());
    while (1) {
      byte = port.read(1);

      if (byte == null) {
        char = '';
      } else {
        char = byte.toString();
      }

      if (char == '\n') {
        if (data.charAt(1) == 'p') {
          console.log('Data:', data);
          split = data.split(" ", 3);
          // console.log(split);
          draw(parseFloat(split[1]), parseFloat(split[2]));
        }
        data = '';
      } else if (char == '') {
        break;
      } else {
        data += char;
      }
    }
  });

  console.log(width + ',' + height);
  // console.log(xratio);
  function draw(x, y) {
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    $('#current-position').remove();
    // console.log(x.map(0, realwidth, 50, 50 + width) + ", " + y.map(realheight, 0, 50, 50 + height));
    // console.log(x * xratio + ", " + y * yratio);
    svg.append('circle')
      .attr("id", "current-position")
      .attr("stroke", "silver")
      .attr("fill", "silver")
      .attr("r", 30)
      .attr("cx", x.map(0, realwidth, 50, 50 + width))
      .attr("cy", y.map(realheight, 0, 50, 50 + height));
  }
  // get the data from serial port
  // |position 0.26 0.52 90.00
  // store the data
  // using the data to draw the point
})()


Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var bool = 0;

$('#plow').click(()=>{

  if(bool == 0){
    port.write("|plow up\n", function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
    bool = 1;
  }
  else{
    port.write("|plow down\n", function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
    bool = 0;
  }

});
