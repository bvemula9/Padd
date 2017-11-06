
// set the dimensions and margins of the graph.
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set the ranges.
var x = d3.scaleBand().range([0,width]).padding(0.1);
var y = d3.scaleLinear().range([height,0]);  
var x2 = d3.scaleBand().range([0,width]).padding(0.1);
var y2 = d3.scaleLinear().range([height,0]);  


//append a 'group' element to the 'svg'
var svg = d3.select(".legend").append("svg");
var svg5 = d3.select(".padd.padd5 svg");
var svg4 = d3.select(".padd.padd4 svg");
var svg2 = d3.select(".padd.padd2 svg");
var svg1 = d3.select(".padd.padd1 svg");
var svg3 = d3.select(".padd.padd3 svg");
var svgal = d3.select(".padd.alaska svg");
var svgok = d3.select(".padd.oklahoma svg");

function updateData(s){

  var s = document.getElementById(s);
      var filename1 = "csv/" + s.value + "-eia.csv";
      var filename2 = "csv/" + s.value + "-api.csv";
      var selectVal ={};
      var dataf;
    var data1 = [];
    var data2 = [];  
    var datas = {};
    d3.csv(filename1, function(data){
      datas.val1 = data;
      
    });
    d3.csv(filename2, function(data){
      datas.val2 = data;
    }); 

    d3.selectAll("#radio input[name=mode").on('change', searchnode);

      function searchnode(){
        selectVal = d3.select(this).property('value');

        data1 = datas.val1;
        data2 = datas.val2;

        // eia data process
        var dataf1 =data1.filter(function(row){
          return row["type"] == selectVal;
        });
      
        dataf1.forEach(function(d) {

          d.oil = d.type;  
          d.alaska = changeNumber(d.Alaska); 
          d.oklahoma = changeNumber(d.Oklahoma);
          d.padd1 = changeNumber(d.PADD1);
          d.padd3 = changeNumber(d.PADD3);
          d.padd2 = changeNumber(d.PADD2);
          d.padd4 = changeNumber(d.PADD4);
          d.padd5 = changeNumber(d.PADD5);
        }, this);

        initAxis();
        function initAxis(d){
          var yal = d3.min(dataf1, function(d) { return d.alaska});
          var yok = d3.min(dataf1, function(d) { return d.oklahoma});
          var yp1 = d3.min(dataf1, function(d) { return d.padd1});
          var yp2 = d3.min(dataf1, function(d) { return d.padd2});
          var yp3 = d3.min(dataf1, function(d) { return d.padd3});
          var yp4 = d3.min(dataf1, function(d) { return d.padd4});
          var yp5 = d3.min(dataf1, function(d) { return d.padd5}); 
          var ymin = d3.min([yal, yok, yp1, yp2, yp3, yp4, yp5]);
          var ymax = d3.max([yal, yok, yp1, yp2, yp3, yp4, yp5]);
          y.domain([0, ymax]);
          x.domain(dataf1.map(function(d){return d.oil;}));
        }  

        var dataNest1 = d3.nest()
            .key(function(d) {return d.oil;})
            .entries(dataf1);

        var val1 = [];   
        dataNest1.forEach(function(d){
          val1 = d.values;          
        }, this);

        // api data process
        var dataf2 =data2.filter(function(row){
          return row["type"] == selectVal;
        });
        // console.log(dataf2);
        dataf2.forEach(function(d) {

          d.oil = d.type;  
          d.alaska = changeNumber(d.Alaska); 
          d.oklahoma = changeNumber(d.Oklahoma);
          d.padd1 = changeNumber(d.PADD1);
          d.padd3 = changeNumber(d.PADD3);
          d.padd2 = changeNumber(d.PADD2);
          d.padd4 = changeNumber(d.PADD4);
          d.padd5 = changeNumber(d.PADD5);
        }, this);

        initAxis2();
        function initAxis2(d){
          var yal = d3.min(dataf2, function(d) { return d.alaska});
          var yok = d3.min(dataf2, function(d) { return d.oklahoma});
          var yp1 = d3.min(dataf2, function(d) { return d.padd1});
          var yp2 = d3.min(dataf2, function(d) { return d.padd2});
          var yp3 = d3.min(dataf2, function(d) { return d.padd3});
          var yp4 = d3.min(dataf2, function(d) { return d.padd4});
          var yp5 = d3.min(dataf2, function(d) { return d.padd5}); 
          var ymin = d3.min([yal, yok, yp1, yp2, yp3, yp4, yp5]);
          var ymax = d3.max([yal, yok, yp1, yp2, yp3, yp4, yp5]);
          y2.domain([ymin, ymax]);
          x2.domain(dataf2.map(function(d){return d.oil;}));
        }  

        var dataNest2 = d3.nest()
            .key(function(d) {return d.oil;})
            .entries(dataf2);

        var val2 = [];   
        dataNest2.forEach(function(d){
          val2 = d.values;          
        }, this);


        
        // apend the rectangles for the bar chart
        svg5.selectAll(".line").remove();
        svg5.append("line")
          .attr("class", "line")
          .attr("x1", 300)
          .attr("y1", 380)
          .attr("x2", 500)
          .attr("y2", 380)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000"); 
        svg5.selectAll(".bar").remove();
        svg5.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 320)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd5 > 0){
              var yval = 380 - (y(0) - y(d.padd5));
              return yval;
            } else {
              return 380
            }
          })
          .attr("height", function(d) {
            if(d.padd5 > 0){
              return y(0) - y(d.padd5);
            }else{
              return Math.abs(y(d.padd5) - y(0));  
            }
          })
          .attr("fill", "red");         

        svg5.selectAll(".bar1").remove();
        svg5.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 400)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd5 > 0){
              var yval = 380 - (y2(0) - y2(d.padd5));
              return yval;
            } else {
              return 380
            }
          })
          .attr("height", function(d) {
            if(d.padd5 > 0){
              return y2(0) - y2(d.padd5);
            }else{
              return Math.abs(y2(d.padd5) - y(0));  
            }
          })
          .attr("fill", "blue");

        svg5.selectAll(".value1").remove();
        svg5.selectAll(".value2").remove();  
        svg5.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 345)
          .attr("y", function(d) {
            if (d.padd5 > 0){
              return 380 - (y2(0) - y2(d.padd5)) - 10
            } else {
              return 380 + Math.abs(y2(d.padd5) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd5); return d.padd5;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "30px")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svg5.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 425)
          .attr("y", function(d) {
            if (d.padd5 > 0){
              return 380 - (y2(0) - y2(d.padd5)) - 10
            } else {
              return 380 + Math.abs(y2(d.padd5) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd5); return d.padd5;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "30px")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        
        svg4.selectAll(".line").remove();  
        svg4.append("line")
          .attr("class", "line")
          .attr("x1", 300)
          .attr("y1", 520)
          .attr("x2", 600)
          .attr("y2", 520)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000");
        svg4.selectAll(".bar").remove();
        svg4.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 340)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd4 > 0){
              return 520 - (y(0) - y(d.padd4));
            } else {
              return 520
            }
          })
          .attr("height", function(d) {
            if(d.padd4 > 0){
              return y(0) - y(d.padd4);
            }else{
              return Math.abs(y(d.padd4) - y(0));  
            }
          })
          .attr("fill", "red")
          .on("mouseover", function(d){
                  
                  d3.select("#type")
                      .text("type: " + d.oil);
                  d3.select("#value")
                      .text("Value: " + d.padd4);
              });      
        svg4.selectAll(".bar1").remove();
        svg4.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 400)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd4 > 0){
              return 520 - (y2(0) - y2(d.padd4));
            } else {
              return 520
            }
          })
          .attr("height", function(d) {
            if(d.padd4 > 0){
              return y2(0) - y2(d.padd4);
            }else{
              return Math.abs(y2(d.padd4) - y2(0));  
            }
          })
          .attr("fill", "blue");    
        svg4.selectAll(".value1").remove();
        svg4.selectAll(".value2").remove();  
        svg4.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 365)
          .attr("y", function(d) {
            if (d.padd4 > 0){
              return 520 - (y2(0) - y2(d.padd4)) - 10
            } else {
              return 520 + Math.abs(y2(d.padd4) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd4); return d.padd4;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svg4.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 425)
          .attr("y", function(d) {
            if (d.padd4 > 0){
              return 520 - (y2(0) - y2(d.padd4)) - 10
            } else {
              return 520 + Math.abs(y2(d.padd4) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd4); return d.padd4;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
 

        svg2.selectAll(".line").remove();  
        svg2.append("line")
          .attr("class", "line")
          .attr("x1", 400)
          .attr("y1", 420)
          .attr("x2", 700)
          .attr("y2", 420)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000");
        svg2.selectAll(".bar").remove();
        svg2.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 440)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd2 > 0){
              return 420 - (y(0) - y(d.padd2));
            } else {
              return 420
            }
          })
          .attr("height", function(d) {
            if(d.padd2 > 0){
              return y(0) - y(d.padd2);
            }else{
              return Math.abs(y(d.padd2) - y(0));  
            }
          })
          .attr("fill", "red");    
        svg2.selectAll(".bar1").remove();
        svg2.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 500)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd2 > 0){
              return 420 - (y2(0) - y2(d.padd2));
            } else {
              return 420
            }
          })
          .attr("height", function(d) {
            if(d.padd2 > 0){
              return y2(0) - y2(d.padd2);
            }else{
              return Math.abs(y2(d.padd2) - y2(0));  
            }
          })
          .attr("fill", "blue");    
        svg2.selectAll(".value1").remove();
        svg2.selectAll(".value2").remove();  
        svg2.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 465)
          .attr("y", function(d) {
            if (d.padd2 > 0){
              return 420 - (y2(0) - y2(d.padd2)) - 10
            } else {
              return 420 + Math.abs(y2(d.padd2) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd2); return d.padd2;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svg2.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 525)
          .attr("y", function(d) {
            if (d.padd2 > 0){
              return 420 - (y2(0) - y2(d.padd2)) - 10
            } else {
              return 420 + Math.abs(y2(d.padd2) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd2); return d.padd2;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");


        svg1.selectAll(".line").remove();  
        svg1.append("line")
          .attr("class", "line")
          .attr("x1", 300)
          .attr("y1", 480)
          .attr("x2", 600)
          .attr("y2", 480)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000");
        svg1.selectAll(".bar").remove();
        svg1.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 340)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd1 > 0){
              return 480 - (y(0) - y(d.padd1));
            } else {
              return 480
            }
          })
          .attr("height", function(d) {
            if (d.padd1 > 0){
              return y(0) - y(d.padd1);
            }else {
              return Math.abs(y(d.padd1) - y(0));  
            }
          })
          .attr("fill", "red"); 
        svg1.selectAll(".bar1").remove();
        svg1.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 400)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd1 > 0){
              return 480 - (y2(0) - y2(d.padd1));
            } else {
              return 480
            }
          })
          .attr("height", function(d) {
            if (d.padd1 > 0){
              return y2(0) - y2(d.padd1);
            }else {
              return Math.abs(y2(d.padd1) - y2(0));  
            }
          })
          .attr("fill", "blue"); 
        svg1.selectAll(".value1").remove();
        svg1.selectAll(".value2").remove();  
        svg1.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 365)
          .attr("y", function(d) {
            if (d.padd1 > 0){
              return 480 - (y2(0) - y2(d.padd1)) - 10
            } else {
              return 480 + Math.abs(y2(d.padd1) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd1); return d.padd1;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svg1.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 425)
          .attr("y", function(d) {
            if (d.padd1 > 0){
              return 480 - (y2(0) - y2(d.padd1)) - 10
            } else {
              return 480 + Math.abs(y2(d.padd1) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd1); return d.padd1;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");


        svg3.selectAll(".line").remove();  
        svg3.append("line")
          .attr("class", "line")
          .attr("x1", 100)
          .attr("y1", 380)
          .attr("x2", 400)
          .attr("y2", 380)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000");
        svg3.selectAll(".bar").remove();
        svg3.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 140)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd3 > 0){
              return 380 - (y(0) - y(d.padd3));
            } else {
              return 380
            }
          })
          .attr("height", function(d) {
            if(d.padd3 > 0){
              return y(0) - y(d.padd3);
            }else{
              return Math.abs(y(d.padd3) - y(0));  
            }  
          })
          .attr("fill", "red"); 
        svg3.selectAll(".bar1").remove();
        svg3.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 200)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.padd3 > 0){
              return 380 - (y2(0) - y2(d.padd3));
            } else {
              return 380
            }
          })
          .attr("height", function(d) {
            if(d.padd3 > 0){
              return y2(0) - y2(d.padd3);
            }else{
              return Math.abs(y2(d.padd3) - y2(0));  
            }  
          })
          .attr("fill", "blue"); 
        svg3.selectAll(".value1").remove();
        svg3.selectAll(".value2").remove();  
        svg3.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 165)
          .attr("y", function(d) {
            if (d.padd3 > 0){
              return 380 - (y2(0) - y2(d.padd3)) - 10
            } else {
              return 380 + Math.abs(y2(d.padd3) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd3); return d.padd3;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svg3.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 225)
          .attr("y", function(d) {
            if (d.padd3 > 0){
              return 380 - (y2(0) - y2(d.padd3)) - 10
            } else {
              return 380 + Math.abs(y2(d.padd3) - y(0))
            }
          })
          .text( function (d) { console.log(d.padd3); return d.padd3;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");

        svgal.selectAll(".line").remove();  
        svgal.append("line")
          .attr("class", "line")
          .attr("x1", 50)
          .attr("y1", 80)
          .attr("x2", 250)
          .attr("y2", 80)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000");
        svgal.selectAll(".bar").remove();
        svgal.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 90)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.alaska > 0){
              return 80 - (y(0) - y(d.alaska));
            } else {
              return 80
            }
          })
          .attr("height", function(d) {
            if(d.alaska >0){
              return y(0) - y(d.alaska);
            }else{
              return Math.abs(y(d.alaska) - y(0));  
            }
          })
          .attr("fill", "red");    
        svgal.selectAll(".bar1").remove();
        svgal.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 150)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.alaska > 0){
              return 80 - (y2(0) - y2(d.alaska));
            } else {
              return 80
            }
          })
          .attr("height", function(d) {
            if(d.alaska >0){
              return y2(0) - y2(d.alaska);
            }else{
              return Math.abs(y2(d.alaska) - y2(0));  
            }
          })
          .attr("fill", "blue");    
        svgal.selectAll(".value1").remove();
        svgal.selectAll(".value2").remove();  
        svgal.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 115)
          .attr("y", function(d) {
            if (d.alaska > 0){
              return 80 - (y2(0) - y2(d.alaska)) - 10
            } else {
              return 80 + Math.abs(y2(d.alaska) - y(0))
            }
          })
          .text( function (d) { console.log(d.alaska); return d.alaska;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svgal.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 175)
          .attr("y", function(d) {
            if (d.alaska > 0){
              return 80 - (y2(0) - y2(d.alaska)) - 10
            } else {
              return 80 + Math.abs(y2(d.alaska) - y(0))
            }
          })
          .text( function (d) { console.log(d.alaska); return d.alaska;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");

        svgok.selectAll(".line").remove();  
        svgok.append("line")
          .attr("class", "line")
          .attr("x1", 50)
          .attr("y1", 80)
          .attr("x2", 250)
          .attr("y2", 80)
          .attr("fill", "none")
          .attr("stroke-width", 1)
          .attr("stroke", "#000");
        svgok.selectAll(".bar").remove();
        svgok.selectAll(".bar")
          .data(val1)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", 90)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.oklahoma > 0){
              return 80 - (y(0) - y(d.oklahoma));
            } else {
              return 80
            }
          })
          .attr("height", function(d) {
            if(d.oklahoma > 0){
              return y(0) - y(d.oklahoma);
            }else{
              return Math.abs(y(d.oklahoma) - y(0));  
            } 
          })
          .attr("fill", "red");                      
        svgok.selectAll(".bar1").remove();
        svgok.selectAll(".bar1")
          .data(val2)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", 150)
          .attr("width", 50)
          .attr("y",  function(d) {
            if (d.oklahoma > 0){
              return 80 - (y2(0) - y2(d.oklahoma));
            } else {
              return 80
            }
          })
          .attr("height", function(d) {
            if(d.oklahoma > 0){
              return y2(0) - y2(d.oklahoma);
            }else{
              return Math.abs(y2(d.oklahoma) - y2(0));  
            } 
          })
          .attr("fill", "blue");  
        svgok.selectAll(".value1").remove();
        svgok.selectAll(".value2").remove();  
        svgok.selectAll(".value1")
          .data(val1)
          .enter().append("text")
          .attr("class", "value1")
          .attr("x", 115)
          .attr("y", function(d) {
            if (d.oklahoma > 0){
              return 80 - (y2(0) - y2(d.oklahoma)) - 10
            } else {
              return 80 + Math.abs(y2(d.oklahoma) - y(0))
            }
          })
          .text( function (d) { console.log(d.oklahoma); return d.oklahoma;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");
        svgok.selectAll(".value2")
          .data(val2)
          .enter().append("text")
          .attr("class", "value2")
          .attr("x", 175)
          .attr("y", function(d) {
            if (d.oklahoma > 0){
              return 80 - (y2(0) - y2(d.oklahoma)) - 10
            } else {
              return 80 + Math.abs(y2(d.oklahoma) - y(0))
            }
          })
          .text( function (d) { console.log(d.oklahoma); return d.oklahoma;})
          .attr("font-family", "sans-serif")
          .attr("font-size", "3em")
          .style("text-anchor", "middle")
          .attr("stroke", "green");

      }    
}

    var legend = d3.select('svg')
              .append("g")
              .attr('class', 'legend')
              .attr('transform', function(d, i) {
                  var height = 80;
                  var x = 90;
                  var y = 90;
                  return 'translate(' + x + ',' + y + ')';
              });   

    legend.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr("x", 20)
        .attr("y", 30)
        .style('fill', "red")

    legend.append("text")
            .attr("x", 40)
            .attr("z-index", 1)
            .attr("y", 35)
            .attr("dy", "0.32em")
            .text("EIA");    

        legend.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr("x", 80)
        .attr("y", 30)
        .style('fill', "blue")

    legend.append("text")
            .attr("x", 100)
            .attr("z-index", 1)
            .attr("y", 35)
            .attr("dy", "0.32em")
            .text("API");    

function changeNumber(d){
  if(d != ""){
    var v = parseFloat(d);
  }else {
    var v = 0;
  }
  return v;
}