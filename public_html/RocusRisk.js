/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function clickHandle() {
    var rev = document.getElementById("estRev");
	var r = Number(rev.value);
	var emp = document.getElementById("numEmp");
	var ep = Number(emp.value);
	var spe = document.getElementById("cybSpend");
	var c = Number(spe.value);
	var poin = document.getElementById("points");
	var p = Number(poin.value);
	var lost = document.getElementById("lostC");
	var l = Number(lost.value);
	
	
	var probability = (0.01024*ep)-(0.00000004345*r)+(0.0000264*c)-(0.01087*p)+0.211;
	if (probability>1){
		probability = 1;
	}
	if (probability<0) {
		probability=0;
	}
	//console.log(probability);
	var cost = l*r;
	var rocusPrice = 0.4*ep;
	document.getElementById("prob").value = probability;
	var costW = c+0.001*probability*cost + rocusPrice;
	var costWO = c+0.43*probability*cost + c;
	document.getElementById("costWith").value = costW;
	document.getElementById("costWithout").value = costWO;
}

var numbers=[40, 130, 75, 170];
var svg = d3.select("svg");

var selection = svg.selectAll("g")
    .data(numbers)
    .enter().append("g")
    .attr("transform", (d,i) => {
        return "translate(" + 40*i + "," + {200-d} + ")"; });

selection.append("rect")
    .attr("width", 39)
    .attr("height", (d,i) => {return d; });

selection.append("text")
    .attr("x", 25)
    .attr("y", 25)
    .text((d) => {return d/10; });


window.onload=function(){
	var button = document.getElementById("calc");
	button.addEventListener("click",clickHandle);
}
