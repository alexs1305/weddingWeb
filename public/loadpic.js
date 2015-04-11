var url = "192.168.1.11:30002";

var createImg = function(src) {
	var img = new Image(25,25);
	img.src = "/uploads/"+src;
	return img;
};

var pictures = []
var eMap = {
	"/": '&#x2F;' 
};
var escapeJs = function(string) {
	return String(string).replace(/[\/]/g,function(s) {
		return eMap[s];
		});
};


$(document).ready(function() { 
	$.getJSON('/loadpics/1', function(data) {
		
		$.each(data, function(i,val) {
                        pictures.push(createImg(val));
		});
		
		$.each(pictures,function(i,val) {

			$('.thumbs').append(val);
		});
	});

});