String.prototype.trim = function()
{
	var result = this.replace(/[\r\n\s\t]/g, "");
	return result;
}

jQuery.fn.innerText = function() {
    return $(this)  .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();
};

function slideDown(listItem) {
	console.log("sliding down: " + listItem.text());
	var nextItem = listItem.next();
	if (nextItem.is("li")) {
		listItem.slideDown(400);
		window.setTimeout(slideDown, 200, nextItem);
	} else {
		listItem.slideDown(400);
	}
};

function slideUp(listItem) {
	console.log("sliding up: " + listItem.text());
	var nextItem = listItem.next();
	if (nextItem.is("li")) {
		listItem.slideUp(400);
		window.setTimeout(slideUp, 200, nextItem);
	} else {
		listItem.slideUp(400);
	}
};

// foreach utility method to iterate through nodelist
NodeList.prototype.foreach = function(callback)
{
	for (var i = 0; i < this.length; i++)
		callback(this.item(i), i, this);
};

// ensures that the footer is at the bottom of the screen
// even if the html content is shorter than the screen height
function moveFooterToBottom() {
	var $html = $('html'),
		$body = $('body'),
		$footer = $('footer');
		htmlHeight = $html.height(),
		footerTop = parseInt($footer.css("margin-top")),
		diff = window.innerHeight - htmlHeight,
		add = (diff > 0) ? diff + 1: 0;
	$html.height(htmlHeight + add);
	$footer.css("margin-top", (footerTop + add) + "px");
}

window.addEventListener("resize", function() { moveFooterToBottom() });

function addBars() {
	$cb = $('content').find('#contentblock'); //.add("<div id='bar'/>");
	console.log($('content'));
	console.log($cb);
	console.log($('content').childNodes);
};

$(document).ready(function() {
	// hide all main header submenus
	$('nav ul li ul li').each(function() {
		$(this).hide();
	});
	
	// initialize and draw to the canvas
	artist = CreateArtist(document.getElementById('mainCanvas'));
	artist.init();

	$('nav > ul > li').each(function() {
		var item = $(this);
		var name = item.innerText();
		item.mouseover(function() {
			console.log("mouseover: " + name);
			slideDown(item.find("ul > li").first());
		});
		item.click(function() {
			console.log("clicked: " + name);
			artist.switchToWedge(name);
		});
		item.mouseout(function() {
			console.log("mouseout: " + name);
			slideUp(item.find('ul > li').first())
		});	
	});
	
	moveFooterToBottom();
	
	$content = $('#content');
	
	$('#masthead').click(function()
	{
		$content.hide(1000, function() { $content.empty(); });
		artist.switchFromWedge();
		moveFooterToBottom();
	});
});