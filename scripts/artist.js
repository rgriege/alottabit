var CreateArtist = function(canvasElement) {
	var canvas = canvasElement,
		context = canvas.getContext('2d'),
	
		x = canvas.width / 2,
		y = canvas.height / 2,
		wedges = [{name: "Games", scale: 1, color: "#ff8080"},
			      {name: "Blog", scale: 1, color: "#ffe680"},
				  {name: "Web", scale: 1, color: "#ffb380"}],
		activeWedge,
		desiredWedge,
		numSegments = 18,
    	step = 0.08,
    	updateInterval = 1000/24,
    	timer;
	
	var drawWedges = function()
	{
		var outerRadius = 175;
			innerRadius = 130;
			startAngle = 0;
		for (var i = 0; i < numSegments; i++)
		{
			var wedgeIndex = i % wedges.length,
				endAngle = startAngle + 2*Math.PI*wedges[wedgeIndex].scale/numSegments;
			context.fillStyle = wedges[wedgeIndex].color;
			context.beginPath();
			context.arc(x, y, outerRadius, startAngle, endAngle);
			context.arc(x, y, innerRadius, endAngle, startAngle, true);
			context.fill();
			startAngle = endAngle;
		}
	}
	
	var drawOuterRim = function()
	{
		var outerRadius = 200,
			innerRadius = 155,
			offset = 0.1;
		context.beginPath();
		context.arc(x, y, outerRadius, offset, Math.PI-offset);
		context.arc(x, y, innerRadius, Math.PI-offset, offset, true);
		context.closePath();
		context.fillStyle = "black";
		context.fill();
		context.lineWidth = 5;
		context.strokeStyle = "white";
		context.stroke();
		
		context.beginPath();
		context.arc(x, y, outerRadius, offset-Math.PI, -offset);
		context.arc(x, y, innerRadius, -offset, offset-Math.PI, true);
		context.closePath();
		context.fillStyle = "black";
		context.fill();
		context.lineWidth = 5;
		context.strokeStyle = "white";
		context.stroke();
	}
	
	var writeMainText = function()
	{
		var innerRadius = 130;
		context.beginPath();
		context.moveTo(x+0.2*innerRadius, y-0.8*innerRadius);
		context.lineTo(x+0.2*innerRadius, y+0.8*innerRadius);
		context.strokeStyle = "black";
		context.lineWidth = 1;
		context.stroke();
		
		context.fillStyle = "black";
		context.font = "20px Aharoni";
		context.fillText("alottabit", x-0.5*innerRadius, y);
		
		context.font = "18px Arial";
		var description = ["more", "than", "just", "a", "little","bit"],
			lineSpacing = 23,
			startY = y - lineSpacing*description.length/2 + lineSpacing/2;
		for (var i = 0; i < description.length; i++)
			context.fillText(description[i], x+0.3*innerRadius, startY+i*lineSpacing);
	}
	
	var init = function()
	{
		drawWedges();
		drawOuterRim();
		writeMainText();
	}
	
	var enclose = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		console.log("enclosing " + activeWedge);
		for (var i = 0; i < wedges.length; i++)
		{
			if (i === activeWedge)
				wedges[i].scale += step;
			else
				wedges[i].scale -= step/(wedges.length - 1);
		}
		drawWedges();
		drawOuterRim();
		if (wedges[activeWedge].scale >= wedges.length)
		{
			wedges[activeWedge].scale = wedges.length;
			clearInterval(timer);
		}
	}
	
	var revert = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		console.log("reverting " + activeWedge)
		for (var i = 0; i < wedges.length; i++)
		{
			if (i === activeWedge)
				wedges[i].scale -= step;
			else
				wedges[i].scale += step/(wedges.length - 1);
		}
		drawWedges();
		drawOuterRim();
		if (wedges[activeWedge].scale <= 1)
		{
			for (var i = 0; i < wedges.length; i++)
				wedges[i].scale = 1;
			clearInterval(timer);
			if (typeof desiredWedge === "undefined")
			{
				activeWedge = undefined;
				writeMainText();
			}
			else
			{
				activeWedge = desiredWedge;
				timer = setInterval(function() { enclose(); }, updateInterval);
			}
		}
	}
	
	var switchToWedge = function(wedge)
	{
		var wedgeIndex;
		if (typeof wedge === "string")
		{
			for (var i = 0; i < wedges.length; i++)
			{
				if (wedges[i].name === wedge)
					wedgeIndex = i;
			}
			if (typeof wedgeIndex === "undefined")
				return;
		}
		else
		{
			wedgeIndex = wedge;
		}
		
		if (wedgeIndex === activeWedge)
			return;
		
		clearInterval(timer);
		var needsRevert = typeof activeWedge !== "undefined";
		desiredWedge = wedgeIndex;
		if (!needsRevert)
		{
			activeWedge = wedgeIndex;
			timer = setInterval(function() { enclose(); }, updateInterval);
		}
		else
		{
			timer = setInterval(function() { revert(); }, updateInterval);
		}
	}
	
	var switchFromWedge = function()
	{
		clearInterval(timer);
		desiredWedge = undefined;
		if (typeof activeWedge !== "undefined")
			timer = setInterval(function() { revert(); }, updateInterval);
	}

  return {
    init: init,
    switchToWedge: switchToWedge,
    switchFromWedge: switchFromWedge
  };
  
};