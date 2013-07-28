// jQuery replacement functions
function $(elemStr)
{
	$nodeList = document.querySelectorAll(elemStr);
	if ($nodeList.length == 1)
		return $nodeList.item(0);
	else
		return $nodeList;
}

function slideDown(listItem) {
	console.log("sliding down: " + listItem.textContent);
	var nextItem = listItem.nextElementSibling;
	if (nextItem !== null) {
		//listItem.slideDown(400);
		window.setTimeout(slideDown, 200, nextItem);
	} else {
		//listItem.slideDown(400);
	}
};

function slideUp(listItem) {
	console.log("sliding up: " + listItem.textContent);
	var nextItem = listItem.nextElementSibling;
	if (nextItem !== null) {
		//listItem.slideUp(400);
		window.setTimeout(slideUp, 200, nextItem);
	} else {
		//listItem.slideUp(400);
	}
};

HTMLElement.prototype.css = function(property, value)
{
	if (value == undefined)
		return window.getComputedStyle(this, '').getPropertyValue(property);
		
	var propertyName = property.replace(/\-\w/g, function(match) {
		return match.charAt(1).toUpperCase();
	});
	this.style[propertyName] = value;
};

// foreach utility method to iterate through nodelist
NodeList.prototype.foreach = function(callback)
{
	for (var i = 0; i < this.length; i++)
		callback(this.item(i), i, this);
};

/*String.prototype.trim = function()
{
	var result = this.replace(/[\r\n\s\t]/g, "");
	return result;
}*/

// ensures that the footer is at the bottom of the screen
// even if the html content is shorter than the screen height
function moveFooterToBottom() {
	var $html = $('html'),
		$body = $('body'),
		$footer = $('footer');
		htmlHeight = $html.offsetHeight,
		footerTop = parseInt($footer.css("margin-top")),
		diff = window.innerHeight - htmlHeight,
		add = (diff > 0) ? diff + 1: 0;
	$html.style.height = (htmlHeight + add) + "px";
	$footer.css("margin-top", (footerTop + add) + "px");
}

window.addEventListener("resize", function() { moveFooterToBottom() });

function addBars() {
	$cb = $('content').find('#contentblock'); //.add("<div id='bar'/>");
	console.log($('content'));
	console.log($cb);
	console.log($('content').childNodes);
};

document.addEventListener('DOMContentLoaded', function() {
	// hide all main header submenus
	$('nav ul li ul li').foreach(function(item) {
		item.style.display = "none";
	});
	
	// initialize and draw to the canvas
	artist = CreateArtist(document.getElementById('mainCanvas'));
	artist.init();

	$('nav > ul > li').foreach(
		function(item) {
			var name = item.innerText;
			console.log("foreach " + name);
			item.addEventListener("mouseover", function() {
				console.log("mouseover: " + name);
				if (item.childElementCount > 0)
				{
					var subList = item.children.item(0);
					if (subList.childElementCount > 0)
					{
						var firstSubListItem = subList.children.item(0);
						console.log(firstSubListItem.innerText);
						subList.style.display = "block";
						slideDown(firstSubListItem);
					}
				}
			});
			item.addEventListener("click", function() {
				console.log("clicked: " + name);
				artist.switchToWedge(name);
			});
			item.addEventListener("mouseout", function() {
				console.log("mouseout: " + name);
				if (item.childElementCount > 0)
				{
					var subList = item.children.item(0);
					if (subList.childElementCount > 0)
					{
						var firstSubListItem = subList.children.item(0);
						console.log(firstSubListItem.innerText);
						subList.style.display = "block";
						slideUp(firstSubListItem);
					}
				}
				//slideUp(item.find('ul > li').item(0))
			});
		}
	);
	
	moveFooterToBottom();
	
	$content = $('#content');
	
	$('#masthead').addEventListener("click", function()
	{
		//$content.hide(1000, function() { $content.empty(); });
		artist.switchFromWedge();
		moveFooterToBottom();
	});
});