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
	$('content').find('#contentblock').each(function() {
		$(this).before("<div id='bar' />");
	});
};

$(document).ready(function() {
	// hide all main header submenus
	$('nav ul li ul li').each(function() {
		$(this).hide();
	});
	
	// initialize and draw to the canvas
	artist = CreateArtist(document.getElementById('mainCanvas'));
	artist.init();
	
	$content = $('#content');

	$('nav > ul > li').each(function() {
		var item = $(this);
		var name = item.innerText();
		item.mouseover(function() {
			console.log("mouseover: " + name);
			var firstItem = item.find("ul > li").first();
			if (firstItem.is("li"))
				slideDown(firstItem);
		});
		item.click(function() {
			console.log("clicked: " + name);
			if (name !== "About")
				artist.switchToWedge(name);
			$content.slideUp(300);
			$content.load('about.html', function() {
				var contentStyle = {
					display: 'block',
					width: '800px',
					marginLeft: 'auto',
					marginRight: 'auto'
				};
				$content.css(contentStyle);
				addBars();
				$('.bar').each(function(index) {
					var barStyle = new Object();
					if (index > 0)
					{
						if (index % 2 == 0)
							barStyle = { position: "relative", left: "200px" };
						else
							barStyle = { position: "relative", right: "200px" };
					}
					barStyle.marginLeft = "auto";
					barStyle.marginRight = "auto";
					$(this).css(barStyle);
				});
				$content.slideDown(500);
			});
		});
		item.mouseout(function() {
			console.log("mouseout: " + name);
			var firstItem = item.find("ul > li").first();
			if (firstItem.is("li"))
				slideUp(firstItem);
		});	
	});
	
	moveFooterToBottom();
	
	$('#masthead').click(function()
	{
		$content.hide(1000, function() { $content.empty(); });
		artist.switchFromWedge();
		moveFooterToBottom();
	});
});