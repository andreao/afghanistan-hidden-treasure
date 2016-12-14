/* ==================================
   Loader class
   ================================== */
var loader = {
    load: function(srcs, callback) {
	if (! $.isArray(srcs)) srcs = [srcs];
	var counter = srcs.length;
	var objects = new Array();
	var onload = function() {
	    counter--;
	    if (counter == 0 && callback) callback(objects);
	};
	for (var i=0; i<srcs.length; i++) {
	    var src = srcs[i];
	    var tmp = src.split(".");
	    var name = tmp[0];
	    var ext = tmp[1];
	    var object;
	    if (ext == "wav" || ext == "mp3") {
		src = "sfx/" + src;
		if (window.device == undefined) { // in a browser
		    object = new Audio();
		    object.addEventListener("load", onload, false);
		    object.src = src;
		} else { // on device
		    if (device.platform == "Android")  src = "/android_asset/www/" + src;
		    object = new Media(src, function(name) {
			return function() {
			    loader[name].isPlaying = false;
			};
		    }(name));
		    onload();
		}

	    } else if (ext == "jpg" || ext == "png") {
		object = new Image();
		object.addEventListener("load", onload, false);
		object.src = "gfx/"+src;
	    } else if (ext == "json") {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(i){
		    return function() {
			if (xmlhttp.readyState != 4) return;
			loader.strings = JSON.parse(xmlhttp.responseText);
			objects[i] = loader.strings;
			onload();
		    }
		}(i);
		xmlhttp.open("GET", "strings.json" , true);
		xmlhttp.send();
	    }
	    loader[name] = object;
	    objects[i] = object;
	}
	return objects;
    }
}






/* ==================================
   Utility stuff to shorten the code and make it more readable
   ================================== */
$.keyboard = function(show) {
	if (window.device && device.platform == "Android") {
		setTimeout(function() {
			if (show)
				window.KeyBoard.showKeyBoard();
			else
				window.KeyBoard.hideKeyBoard();
		},50);
	}
}
$.input = function(rect) {
    var elem = $("<input />");
    elem
	.rect(rect)
	.css({
	    "overflow": "visible",
	    "text-overflow": "visible",
	    "white-space": "nowrap",
	    "background-color": "#f6f6f6",
	    "border": "2px black dashed",
	    "-webkit-box-shadow": "0 0 3px #888",
	    "opacity": "0.8",

	    /* A nasty hack to make the text properly overflow input */
	    "-webkit-transform": "translate(1000px,0)",
	    "left": rect[0]-1000,
	})
	.on("blur", function(event) {
		$.keyboard(false);
	})
	.on("mousedown touchstart", function(event) {
		elem.focus();
		if (window.device && device.platform == "Android") {
			$.keyboard(true);
			setTimeout(function() {
				elem.focus();
			},60);
		}
	});
    return elem;
}
$.fn.rect = function(rect) { // rect = [left, top, width, height, angle]
    this.each(function(index,elem) {
	var $elem = $(elem);
	if (rect[0] != undefined) $elem.css("left",rect[0]);
	if (rect[1] != undefined) $elem.css("top",rect[1]);
	if (rect[2] != undefined) $elem.css("width",rect[2]);
	if (rect[3] != undefined) $elem.css("height",rect[3]);
	if (rect[4] != undefined) $elem.css("-webkit-transform", "rotate(" + (-rect[4]) + "deg)");
    });
    return this;
}
$.fn.red = function() {
    return this.css({
	"backgroundColor": "red",
	"opacity": "0.5",
    });
}
$.fn.frame = function(rect, borderWidth) {
    return $("<div />").rect(rect)
	.append(this.fill())
	.append(
	    $("<div />").fill().css({
		marginLeft: (-borderWidth*30/40)+"px",
		marginTop: (-borderWidth*28/41)+"px",
		width: (rect[2]-borderWidth*23/41)+"px",
		height: (rect[3]-borderWidth*26/40)+"px",
		"-webkit-border-image": "url(gfx/frame.png) 41 41 40 40 stretch stretch",
		"border-width": borderWidth+"px",
	    })
	);
}
// Random number between -n and n.
$.rand = function(n) {
    return (Math.random()-.5)*(2*n);
}
$.inputDisabled = false;
$.fn.prevent = function() {
    return this.on("mousedown touchstart", function(event) { event.preventDefault(); });
}
$.fn.touch = function(f) {
    this.each(function(index, elem) {
	var $elem = $(elem);
	$elem.on("mousedown touchstart",  function($elem) {
	    return function(event) {
		if ($.inputDisabled) return false;
		f(event);
		return false;
	    };
	}($elem));
    });
    return this;
}
$.fn.fill = function() {
    this.each(function(index,elem) {
	$(elem).css({
	    left: "0px",
	    top: "0px",
	    width: "100%",
	    height: "100%",
	});
    });
    return this;
}







/* ==================================
   Credits class
   ================================== */
var Credits = function() {
    this.directSegue = true;
    this.noCurtain = true;
    this.noHomeButton = true;

    this.container = $("<div />").fill();

    this.made = $("<div />").rect([-20,25,game.width+30,90,-2]).appendTo(this.container);
    $("<img />").attr("src", "gfx/paper-strip.png").fill().appendTo(this.made);
    this.madeLabel = $("<label />").rect([25,13,310]).css({
	"text-align": "right",
    }).appendTo(this.made);

    this.partnership = $("<div />").rect([-20, 125,game.width+30,90,1]).appendTo(this.container);
    $("<img />").attr("src", "gfx/paper-note.png").fill().appendTo(this.partnership);
    this.partnershipLabel = $("<div />").rect([25,10,310]).css({
	"text-align": "center",
    }).appendTo(this.partnership);

    this.photoCopyright = $("<div />").rect([-5,240,game.width+10,120,-3]).appendTo(this.container);
    $("<img />").attr("src", "gfx/paper-note.png").fill().appendTo(this.photoCopyright);
    this.photoCopyrightLabel = $("<div />").rect([16,5,295]).css({
	"text-align": "center",
    }).appendTo(this.photoCopyright);

    this.sfxCopyright = $("<div />").rect([-20,370,game.width+30,65,2]).appendTo(this.container);
    $("<img />").attr("src", "gfx/paper-strip.png").fill().appendTo(this.sfxCopyright);
    this.sfxCopyrightLabel = $("<label />").rect([25,10,310]).css({
	"text-align": "center",
    }).appendTo(this.sfxCopyright);

}
Credits.prototype.sceneBegin = function() {
    setTimeout(function() {
	game.nextScene();
    }, 2000);
}
Credits.prototype.sceneLoad = function() {
    this.madeLabel.text(game.getString("madeFor") + " " + game.getString("madeBy"));
    this.photoCopyrightLabel.html(game.getString("photoCopyright"));
    this.partnershipLabel.html(game.getString("partnership"));
    this.sfxCopyrightLabel.html(game.getString("sfxCopyright"));
}







/* ==================================
   Curtain class
   ================================== */
var Curtain = function() {
    var curtain = this;

    this.isDown = false;
    this.isMoving = false;

    this.container = $("<div />")
	.fill()
	.css({
	    "-webkit-transform": "translate(0,-" + game.height + "px)",
	    "-webkit-transition": "-webkit-transform 1s",
	});
    this.image = $("<img />")
	.attr("src","gfx/curtain.png")
	.fill()
	.appendTo(this.container);
    this.textContainer = $("<div />")
	.css({left: 25, top: 10, right: 25, bottom: 50})
	.appendTo(this.container)
    /* TODO: For a mysterious reason, this button is twice as wide on the device as in chrome */
    /* TODO: Make this drag and drop */
    this.handle = $("<div />").rect([135,game.height-40,50,30]).touch(function() { 
	curtain.toggle(true); 
    }).appendTo(this.container);

    /* The map of the museum */
    this.map = $("<img />").rect([30,290, 250]).appendTo(this.container);
    this.areaLabel = $("<label />").rect([20,270,279]).css({
	"font-size": "20px",
	"text-align": "center",
    }).appendTo(this.container);

    this.hide();
}
Curtain.prototype.hide = function(onDone) {
    if (this.isHidden) { if(onDone) onDone(); return; }
    this.isHidden = true;
    this.up();
    if (onDone) setTimeout(function() { onDone(); }, 1000);
    this.container.css("-webkit-transform", "translate(0px, -"+game.height+"px)");
}
Curtain.prototype.show = function(onDone) {
    this.isHidden = false;
    if (onDone) setTimeout(function() { onDone(); }, 1000);
    this.container.css("-webkit-transform", "translate(0px, -"+(game.height-50)+"px)");
}
Curtain.prototype.toggle = function() {
    if (this.isDown) this.up();
    else this.down();
}
Curtain.prototype.load = function(scene) {
    this.areaLabel.text(game.activeArea=="home" ? "":game.getString(game.activeArea));
    this.textContainer.html(game.getString(scene.explanation));
    this.map.attr("src", "gfx/room_maps/" + game.activeArea +".png");
}
Curtain.prototype.up = function() {
    if (!this.isDown) return;
    this.isDown = false;
    $.inputDisabled = true;
    this.container
	.one("webkitTransitionEnd", function() { $.inputDisabled = false; })
	.css("-webkit-transform", "translate(0px, -" + (game.height-50) + "px)");
    loader["curtain_up"].play();
}
Curtain.prototype.down = function() {
    if (this.isDown) return;
    this.isDown = true;
    $.inputDisabled = true;
    this.container
	.one("webkitTransitionEnd", function() { $.inputDisabled = false; })
	.css("-webkit-transform", "translate(0px, 0px)");
    loader["curtain_down"].play();
}







/* ==================================
   Passport class
   ================================== */
var Passport = function() {
    var passport = this;

    this.noHomeButton = true;
    this.noCurtain = true;
    this.directSegue = true;

    this.container = $("<div />").fill();

    /* setting up the passport as a book, with animated turning of page */
    this.book = $("<div />").rect([10,30,580,430]).css({ 
	"-webkit-perspective": "650px", 
	"-webkit-transform": "translate(-25%)",
    }).appendTo(this.container);
    this.insideRight = $("<div />").css({
	left: "50%", width:"50%", height: "100%",
    }).appendTo(this.book);
    $("<img />").fill().attr("src", "gfx/passport_right.png").appendTo(this.insideRight);
    this.leftPage = $("<div />")
	.css({
	    width: "50%", height: "100%",
	    "-webkit-transform-style": "preserve-3d",
	    "-webkit-transform-origin": "100% 50%",
	}).appendTo(this.book);
    this.outsideLeft = $("<div />").fill()
	.css({
	    "-webkit-transform-style": "preserve-3d",
	    "-webkit-backface-visibility": "hidden",
	    "-webkit-transform": "rotateY(180deg)",
	}).appendTo(this.leftPage);
    $("<img />/").fill().css({
	"left": "-5px",
	"top": "-5px",
    }).attr("src", "gfx/passport_front.png").appendTo(this.outsideLeft);
    this.insideLeft = $("<div />").fill()
	.css({
	    "-webkit-transform-style": "preserve-3d",
	    "-webkit-backface-visibility": "hidden",
	}).appendTo(this.leftPage);
    $("<img />").fill().attr("src", "gfx/passport_left.png").appendTo(this.insideLeft);


    /* the left page */
    this.photo = $("<img />").rect([98,110,130,155,-2]).css({
	"box-shadow": "0 0 10px #888",
    }).touch(function(){
	game.userdata.capturePhoto(function() {
	    passport.sceneLoad();
	    passport.rightArrow.add(passport.leftArrow).css({"visibility": "visible"})
	    setTimeout(function() {
		passport.showRight();
	    }, 1000);
	});
    }).appendTo(this.insideLeft);
    $("<img />").attr("src", "gfx/arrow1.png").rect([120,250,40,40, -40]).appendTo(this.insideLeft);
    this.takePictureLabel = $("<div />").rect([80,300,200,undefined,6]).appendTo(this.insideLeft);
    this.rightArrow = $("<img />").rect([220,380]).attr("src", "gfx/arrow3.png").touch(function() {
	passport.showRight();
    }).appendTo(this.insideLeft);


    /* the right page */
    $("<img />").attr("src", "gfx/arrow1.png").rect([10,85,40,40]).css({
	"-webkit-transform": "scaleX(-1) rotate(-140deg)",
    }).appendTo(this.insideRight);
    this.fillInLabel = $("<div />").rect([40,75,250,undefined,-2]).appendTo(this.insideRight);
    this.nameField = $.input([35,120,175,undefined,-2]).css({
	    "font-size": "18px",
	}).attr({
	    "type": "text",
	    "autocorrect": "off",
	    "autocapitalize": "on",
	}).focus(function() {
	    game.nextButton.hide();
	}).blur(function() {
	    if (passport.nameField.val()) game.nextButton.show();
	    else game.nextButton.hide();
	}).appendTo(this.insideRight);
    this.surnameField = $.input([35,160,175,undefined,-2]).css({
	    "font-size": "18px",
	}).attr({
	    "type": "text",
	    "autocorrect": "off",
	    "autocapitalize": "on",
	}).appendTo(this.insideRight);
    this.emailField = $.input([35,200,175,undefined,-2]).css({
	    "font-size": "12px",
	}).attr({
	    "type": "email",
	    "autocorrect": "off",
	    "autocapitalize": "on",
	}).appendTo(this.insideRight);
    this.leftArrow = $("<img />").rect([30,380]).attr("src", "gfx/arrow3.png")
	.css("-webkit-transform", "scaleX(-1)").touch(function() { passport.showLeft(); })
	.appendTo(this.insideRight);


    this.close();
}
Passport.prototype.open = function() {
    this.leftPage.css("-webkit-transition", "-webkit-transform 2s");
    this.leftPage.css("-webkit-transform", "");
}
Passport.prototype.close = function() {
    this.leftPage.css({
		"-webkit-transition": "-webkit-transform 2s",
    	"-webkit-transform": "rotateY(180deg)"
	});
}
Passport.prototype.showLeft = function(onDone) {
    $.inputDisabled = true;
    var loc = [this.loc[0]-145, this.loc[1], this.loc[2], 1/this.loc[3]];
    game.transformTo(loc,"1.5s",function() {
	$.inputDisabled = false;
	if (onDone) onDone();
    });
    game.nextButton.hide();
}
Passport.prototype.showRight = function(onDone) {
    $.inputDisabled = true;
    var passport = this;
    var loc = [this.loc[0]+145, this.loc[1], this.loc[2], 1/this.loc[3]];
    game.transformTo(loc,"1.5s",function() {
	$.inputDisabled = false;
	//passport.nameField.select(); // TODO: This doesn't work at all :(
	if (onDone) onDone();
    });
    if (this.nameField.val()) game.nextButton.show();
}
Passport.prototype.showAll = function(onDone) {
    game.transformTo(this.cameraLoc,"1s",onDone);
}
Passport.prototype.sceneLoad = function() {
    var passport = this;

    this.takePictureLabel.html(game.getString("takePicture"));
    this.fillInLabel.html(game.getString("fillIn"));
    this.nameField.attr("placeholder", game.getString("namePlaceholder"));
    this.surnameField.attr("placeholder", game.getString("surnamePlaceholder"));
    this.emailField.attr("placeholder", game.getString("emailPlaceholder"));

    this.photo.attr("src", "");
    setTimeout(function() {
	passport.photo.attr("src", game.userdata.photo.src);
    },0);
    this.nameField.val(game.userdata.name);
    this.surnameField.val(game.userdata.surname);
    this.emailField.val(game.userdata.email);
}
Passport.prototype.sceneEnd = function() {
    game.userdata.name = this.nameField.val();
    game.userdata.surnameField = this.surnameField.val();
    game.userdata.email = this.emailField.val();
    this.close();
}
Passport.prototype.sceneBegin = function() {
    var passport = this;
    setTimeout(function() {
	passport.open();
	setTimeout(function(){
	    passport.showLeft();
	}, 1000);
    },500);
}








/* ==================================
   Home class
   ================================== */
var Key = function() {
    var key = this;
    this.isShaking = false;
    this.container = $("<div />")
    this.shadowImage = $(new Image())
	.attr("src", "gfx/key_shadow.png")
	.appendTo(this.container);
    this.keyImage = $(new Image())
	.attr("src", "gfx/key.png")
	.css("-webkit-transform-origin", "50% 5px")
	.on("mousedown touchstart", function(event){ 
	    if (!$.inputDisabled) key.shake();
	})
	.appendTo(this.container);
    this.nailImage = $(new Image())
	.attr("src", "gfx/key_nail.png")
	.css({left:"-7px",top:"-5px"})
	.appendTo(this.container);
    
}
Key.prototype.setVisible = function(visible) {
    this.keyImage.css("visibility", visible?"visible":"hidden");
}
Key.prototype.shake = function() {
    var key = this;
    if (key.isShaking) return;
    var keyImage = this.keyImage;
    key.isShaking = true;
    loader["key1"].play();
    setTimeout(function() {
	var dir;
	if (Math.random()<0.5) dir = "RIGHT";
	else dir = "LEFT";
	keyImage.on("webkitAnimationEnd", function() {
	    keyImage.css("-webkit-animation", "none");
	    key.isShaking = false;
	});
	keyImage.css("-webkit-animation", "WIGGLE_KEY_" + dir + " 3s");
    }, 0);
}
var AreaButton = function(areaName, imgRect,labelRect, onTouch) {
    var areaButton = this;

    this.areaName = areaName;
    this.onTouch = onTouch;
    this.container = $("<div />")
	.touch(function() { areaButton.select() });
    this.image = $("<img />")
	.fill()
	.attr("src","gfx/areas/"+this.areaName+".jpg");
    this.imageContainer = $("<div />")
	.css("background-color", "#f6f6f6")
	.append(this.image)
	.frame(imgRect, 20)
	.appendTo(this.container);
    this.keyholeImage = $("<img />")
	.attr("src", "gfx/keyhole.png")
	.rect([imgRect[2]/2-15, imgRect[3]/2-15, 30,30])
	.appendTo(this.imageContainer);
    this.areaLabel = $("<label />")
	.rect(labelRect)
	.appendTo(this.container);
}
AreaButton.prototype.select = function() {
    if (this.locked) return;
    game.activeArea = this.areaName;
    this.onTouch(this.areaName);
}
AreaButton.prototype.lock = function() {
    this.locked = true;
    this.keyholeImage.css("visibility", "visible");
    this.image.css("opacity", "0.3");
}
AreaButton.prototype.unlock = function() {
    this.locked = false;
    this.keyholeImage.css("visibility", "hidden");
    this.image.css("opacity", "1");
}

var Home = function() {
    var home = this;

    this.noHomeButton = true;
    
    this.container = $("<div />").fill();

    /* buttons for the four sites */
    this.areaButtons = new Object();
    function onSelect(areaName) { home.onSelectArea(areaName); }
    this.areaButtons.aikhanum = new AreaButton("aikhanum", [25,40,125,131,3], [25,185,130,undefined,-2], onSelect);
    this.areaButtons.begram = new AreaButton("begram", [175,75,125,110,-1], [175,190,130,undefined,2], onSelect);
    this.areaButtons.tepefullol = new AreaButton("tepefullol", [20,225,125,110,-1], [22,345,130,undefined,0], onSelect);
    this.areaButtons.tillyatepe = new AreaButton("tillyatepe", [180,240,110,110,-3], [190,360,130,undefined,-1], onSelect);

    /* add the buttons */
    for (var area in this.areaButtons) {
	this.areaButtons[area].container.appendTo(this.container);
    }

    /* the keys */
    this.keyContainer = $("<div />")
	.rect([30,400])
	.appendTo(this.container);
    this.keys = new Array();
    for (var i=0; i<7; i++) {
	var key = new Key();
	key.container.css("left", 40*i);
	key.container.appendTo(this.keyContainer);
	this.keys[i] = key;
    }
}
Home.prototype.shakeKeys = function() {
    for (var i=0; i<7; i++) this.keys[i].shake();
}
Home.prototype.sceneBegin = function() {
    if (game.userdata.nofkeys == 0) {
	game.curtain.down();
    } else if (game.userdata.nofkeys == 7) {
	$.inputDisabled = true;
	this.shakeKeys();
	setTimeout(function() {
	    game.nextScene();
	}, 2000);
    }
}
Home.prototype.sceneLoad = function() {
    game.activeArea = "home";
    /* update the keys */
    for (var i=0; i<7; i++) {
	var key = this.keys[i];
	key.setVisible(i<game.userdata.nofkeys);
    };
    /* update the unlocked areas */
    var i=0;
    for (var area in this.areaButtons) {
	var areaButton = this.areaButtons[area];
	if (i < game.userdata.nofAreasUnlocked) areaButton.unlock();
	else areaButton.lock();
	i++;
    }
    /* update the strings */
    for (var area in this.areaButtons) {
	var areaButton = this.areaButtons[area];
	areaButton.areaLabel.text(game.getString(areaButton.areaName));
    }
}





/* ==================================
   Userdata class
   ================================== */
var Userdata = function() {
    this.photo = new Image();
    this.photoWithCrown = new Image();
    this.reset();
}
Userdata.prototype.reset = function() {
    this.language = "nb";
    this.name = "";
    this.surname = "";
    this.email = "";
    this.photo.src = "gfx/no_photo.png";
    this.photoWithCrown.src = "gfx/crown_reward.jpg";
    this.nofkeys = 0;
    this.nofAreasUnlocked = 1;
}
Userdata.prototype.capturePhoto = function(callback) {
    var userdata = this;
    var properties = { 
        quality: 50, 
        destinationType: Camera.DestinationType.FILE_URI, // Don't use the DATA_URL
        sourceType: Camera.PictureSourceType.CAMERA, 
	applyFilter: true,
	saveToPhotoAlbum: false, // This isn't okay for privacy reasons
    };
    function userPhotoCaptured(srcs) {
        console.log("Photo successfully captured");
        //userdata.photo.src = "data:image/jpeg;base64," + src[0];
	//userdata.photoWithCrown.src = "data:image/jpeg;base64," + src[1];
	if (window.device && device.platform == "Android"){
	    userdata.photo.src = srcs;
	    //userdata.photoWithCrown.src = srcs;
	} else {
	    // Appends a bogus query string to prevent caching
	    var t = (new Date()).getTime();
            userdata.photo.src = srcs[0] + "?" + t
	    userdata.photoWithCrown.src = srcs[1] + "?" + t;
	}
	if (callback) callback();
    }
    function captureFailed(message) {
	alert("Photo capture failed. " + message);
    }
    if (! window.device) captureFailed("Not on device");
    else if (window.device.platform == "Android") 
	//PhoneGap.exec(userPhotoCaptured, captureFailed, "Crown", "takePicture", []);
	navigator.camera.getPicture(userPhotoCaptured, captureFailed, [properties]);
    else
	PhoneGap.exec(userPhotoCaptured, captureFailed, "crown", "getPicture", [properties]);
}




/* ==================================
   QuizQuestion class
   ================================== */
var Alternative = function(stringId, isCorrect, rect){
    var alternative = this;
    this.isCorrect = isCorrect;
    this.stringId = stringId;
    this.textContainer = $("<div />").fill();
    this.textElem = $("<label />")
	.css({
	    width: "100%",
	    fontSize: "16px",
	    textAlign: "center",
	})
	.appendTo(this.textContainer);
    this.container = $("<div />")
	.append(this.textContainer)
	.frame(rect, 18)
    this.reset();
}
Alternative.prototype.reset = function() {
    this.textContainer.css({
	"-webkit-transition": "background-color 0.5s",
	"background-color": "#f6f6f6",
    });
    this.container.css({
	"-webkit-transition": "opacity 0.5s",
	"opacity": "1",
    });
}
Alternative.prototype.answer = function() {
    if (this.isCorrect) {
	loader.correct_answer.play();
	this.textContainer.css("background-color", "#87F717");
    }
    else {
	loader.wrong_answer.play();
	this.container.css("opacity", "0");
	this.textContainer.css("background-color", "#FF6633");
    }
}
var QuizQuestion = function(id, nofAnswers, correctAnswer, questionRect, imgSrc, imgRect) {
    var question = this;
    this.explanation = "quizCurtain1";
    this.container = $("<div />").fill();

    /* locations of the answer buttons. */
    var answerRects;
    if (nofAnswers == 4){
	answerRects = [[27,260,110,45,1], [180,256,110,45,-1], [31,352,110,45,-2], [179,360,110,45,1]];}
    else if (nofAnswers == 2){
	answerRects = [[100,269,110,40], [100,365,110,40]];}


    /* Set up the alternatives */
    this.alternatives = new Array();
    for (var i=0; i<nofAnswers; i++) {
	var stringId = "q"+id+"_a"+(i+1);
	var isCorrect = i+1==correctAnswer;
	var alternative = new Alternative(stringId, isCorrect, answerRects[i]);
	if (isCorrect) this.correctAlternative = alternative;
	alternative.container
	    .touch(function(alternative) {
		return function() {  question.answer(alternative);  };
	    }(alternative))
	    .appendTo(this.container);
	this.alternatives.push(alternative);
    }

    /* The label and image */
    this.stringId = "q" + id;
    this.label = $("<label />")
	.rect(questionRect)
	.appendTo(this.container);
    $("<img />")
	.attr("src", "gfx/quiz/"+imgSrc)
	.frame(imgRect,25)
	.appendTo(this.container);
}
QuizQuestion.prototype.answer = function(alternative) {
    alternative.answer();
    if (alternative.isCorrect) {
	this.finish();
    }
}
QuizQuestion.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
    $.inputDisabled = true;
    setTimeout(function() {
	game.nextScene();
    }, 1000);
}
QuizQuestion.prototype.complete = function() {
    this.answer(this.correctAlternative);
}
QuizQuestion.prototype.sceneLoad = function() {
    this.finished = false;
    for (var i=0; i<this.alternatives.length; i++) {
	var alternative = this.alternatives[i];
	alternative.reset();
    }
    /* update strings */
    this.label.text(game.getString(this.stringId));
    for (var i=0; i<this.alternatives.length; i++) {
	var alternative = this.alternatives[i];
	alternative.textElem.text(game.getString(alternative.stringId));
    }
}





/* ==================================
   ItemRegistry class
   ================================== */
var ItemRegistry = function(number, onCorrect) {
    var registry = this;
    this.number = number;
    this.container = $("<div />").css({
	left: -10,
	top: 100,
	width: 345, height: 75,
	"-webkit-transition": "-webkit-transform 0.5s",
    });
    $("<img />").fill().attr("src", "gfx/paper-strip.png").css({
	"-webkit-transform": "scaleX(-1)",
    }).appendTo(this.container);
    this.label = $("<label />").rect([20,18,220,undefined]).css({
	"font-size": "13px",
    }).appendTo(this.container);
    this.input = $.input([240,20,63,25]).attr({
	"type": "number",
	"placeholder": "###",
	"font-size": "13px",
	"pattern": "[0-9]*",
    }).css({
	"-webkit-transition": "background-color 0.5s",
    }).change(function() {
	var input = $(this);
	if (number == parseInt(input.val())) {
	    input.css("background-color", "#87F717");
	    onCorrect();
	} else {
	    loader.wrong_answer.play();
	    input.css("background-color", "#FF6633");
	    setTimeout(function() { input.css("background-color",""); input.val(""); },1000);
	}
    }).appendTo(this.container);
}
ItemRegistry.prototype.show = function() {
    this.container.css({
	"-webkit-transform": "rotate(7deg)",
    });
}
ItemRegistry.prototype.hide = function() {
    this.container.css({
	"-webkit-transform": "rotate(7deg) translate(100%,0)",
    });
}
ItemRegistry.prototype.load = function() {
    this.input.val("").css("background-color", "");
    this.label.text(game.getString("numberInExhibition"));
    this.hide();
}









/* ==================================
   Jigsaw class
   ================================== */
var Group = function(piece) {
    this.pieces = [piece];
}
Group.prototype.merge = function(group) {
    this.snap(group);
    for (var i=0; i<group.pieces.length; i++) {
	var piece = group.pieces[i];
	this.pieces.push(piece);
    }
}
Group.prototype.snap = function(group) {
    var piece = this.pieces[0];
    for (var i=0; i<group.pieces.length; i++) {
	piece.snap(group.pieces[i]);
    }
}
Group.prototype.center = function() {
    if (!this.pieces.length) return;
    var piece = this.pieces[0];
    var dx = piece.target[0] - piece.x;
    var dy = piece.target[1] - piece.y;
    this.move(dx,dy);
}
Group.prototype.draw = function(ctx) {
    for (var i=0; i<this.pieces.length; i++)
	this.pieces[i].draw(ctx);
}
Group.prototype.move = function(dx, dy) {
    for (var i=0; i<this.pieces.length; i++)
	this.pieces[i].move(dx,dy);
}
Group.prototype.fitsWith = function(group) {
    if (this == group) return false;
    for (var i=0; i<this.pieces.length; i++) {
	var piece1 = this.pieces[i];
	for (var j=0; j<group.pieces.length; j++) {
	    var piece2 = group.pieces[j];
	    if (piece1.fitsWith(piece2)) return true;
	}
    }
    return false;
}
Group.prototype.isOpaque = function(ctx, x,y) {
    for (var i=this.pieces.length-1; i>=0; i--) {
	if (this.pieces[i].isOpaque(ctx,x,y)) return true;
    }
    return false;
}

var Piece = function(id, image, target, fitList) {
    this.id = id;
    this.image = image;
    this.target = target;
    this.fitList = fitList;
    this.threshold = 15;
}
Piece.prototype.draw = function(ctx) {
    ctx.drawImage(this.image,this.x,this.y, this.image.width, this.image.height);
}
Piece.prototype.isOpaque = function(ctx,x,y) {
    ctx.clearRect(0,0,1,1);
    var xx = x - this.x;
    var yy = y - this.y;
    if (xx<0 || yy<0 || xx>=this.image.width || yy>=this.image.height) return false;
    ctx.drawImage(this.image,x-this.x,y-this.y,1,1,0,0,1,1);
    var data = ctx.getImageData(0,0,1,1).data;
    return data[3]>0;
}
Piece.prototype.snap = function(piece) {
    piece.x = this.x + piece.target[0] - this.target[0];
    piece.y = this.y + piece.target[1] - this.target[1];
}
Piece.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
}
Piece.prototype.moveTo = function(x,y) {
    this.move(x-this.x, y-this.y);
}
Piece.prototype.fitsWith = function(piece) {
    if (!this.fitList[piece.id]) return false;
    var dx1 = this.x - this.target[0];
    var dy1 = this.y - this.target[1];
    var dx2 = piece.x - piece.target[0];
    var dy2 = piece.y - piece.target[1];
    var dx = Math.abs(dx2-dx1);
    var dy = Math.abs(dy2-dy1);
    return dx < this.threshold && dy < this.threshold;
}

var Jigsaw = function(id, targets, fitMatrix, number) {
    this.description = "describeJigsaw";

    var jigsaw = this;
    this.container = $("<div />").fill();
    this.targets = targets;
    this.fitMatrix = fitMatrix;
    var srcs = new Array();
    for (var i=0; i<targets.length; i++) {
	srcs.push("jigsaw/"+id+"/"+(i+1)+".png");
    }

    /* Create the pieces */
    this.images = loader.load(srcs, function() { jigsaw.placePieces(); jigsaw.draw(); });
    this.pieces = new Array();
    this.groups = new Array();
    for (var i=0; i<this.images.length; i++) {
	var piece = new Piece(i, this.images[i], this.targets[i], this.fitMatrix[i]);
	this.pieces.push(piece);
    }

    // create the canvas
    var canvas = $("<canvas />")
	.fill()
	.attr({
	    width: game.width,
	    height: game.height,
	})
	.appendTo(this.container);
    this.ctx = canvas[0].getContext("2d");

    // pixel perfect d&d events
    var dragGroup, lastX, lastY;
    function touchStart(event) {
	if ($.inputDisabled) return;
	var pos = game.eventPos(event);
	dragGroup = null;
	for (var i=jigsaw.groups.length-1; i>=0; i--) {
	    var group = jigsaw.groups[i];
	    if (! group.isOpaque(jigsaw.ctx,pos.x,pos.y)) continue;
	    dragGroup = group;
	    jigsaw.bringGroupToFront(group);
	    lastX = pos.x;
	    lastY = pos.y;
	    break;
	}
	jigsaw.draw();
    };
    function touchMove(event) {
	if ($.inputDisabled) return;
	if (!dragGroup) return;
	var pos = game.eventPos(event);
	dragGroup.move(pos.x-lastX, pos.y-lastY);
	lastX = pos.x;
	lastY = pos.y;
	jigsaw.draw();
    };
    function touchEnd(event) {
	if ($.inputDisabled) return;
	if (!dragGroup) return;
	for (var i=0; i<jigsaw.groups.length-1; i++) {
	    var group = jigsaw.groups[i];
	    if (!dragGroup.fitsWith(group)) continue;
	    jigsaw.merge(dragGroup, group);
	}
	jigsaw.draw();
	dragGroup = lastX = lastY = null;

	if (!jigsaw.isTogether()) return;
	if (jigsaw.itemRegistry) jigsaw.itemRegistry.show();
	else jigsaw.finish();
    };

    /* The jQuery seems to be bugging, so lets use basic javascript. */
    canvas[0].addEventListener("touchstart", touchStart, false);
    canvas[0].addEventListener("touchend", touchEnd, false);
    canvas[0].addEventListener("touchmove", touchMove, false);
    canvas[0].addEventListener("mousedown", touchStart, false);
    canvas[0].addEventListener("mouseup", touchEnd, false);
    canvas[0].addEventListener("mousemove", touchMove, false);

    /* the item registry */
    if (number != undefined) {
	this.itemRegistry = new ItemRegistry(number, function() {
	    jigsaw.finish();
	});
	this.itemRegistry.container.appendTo(this.container);
    }
}

Jigsaw.prototype.draw = function() {
    this.ctx.clearRect(0,0, game.width,game.height);
    for (var i=0; i<this.groups.length; i++)
	this.groups[i].draw(this.ctx);
}
Jigsaw.prototype.merge = function(group1, group2) {
    group1.merge(group2);
    var index = this.groups.indexOf(group2);
    this.groups.splice(index,1);
    loader["puzzlepiecefit"].play();
}

Jigsaw.prototype.placePieces = function() {
    var jigsaw = this;
    for (var j=0; j<jigsaw.pieces.length; j++) {
	var piece = jigsaw.pieces[j];
	piece.x = 10 + Math.random()*(game.width-10-piece.image.width-10);
	piece.y = 30 + Math.random()*(game.height-30-piece.image.height-10);
    }
}
Jigsaw.prototype.isTogether = function() {
    return this.groups.length == 1;
}
Jigsaw.prototype.bringGroupToFront = function(group) {
    var index = this.groups.indexOf(group);
    this.groups.splice(index,1);
    this.groups.push(group);
}
Jigsaw.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
    loader["puzzlefinished"].play();
    setTimeout(function() {
	game.nextScene();
    }, 1500);
}
Jigsaw.prototype.complete = function() {
    for (var i=0, len=this.groups.length; i<len-1; i++)
	this.merge(this.groups[0], this.groups[1]);
    this.groups[0].center();
    this.draw();

    this.finish();
}
Jigsaw.prototype.sceneLoad = function() {
    this.finished = false;
    this.placePieces();
    for (var i=0; i<this.pieces.length; i++) {
	this.groups[i] = new Group(this.pieces[i]);
    }
    if (this.itemRegistry) this.itemRegistry.load();
    this.draw();
}







/* ==================================
   Excavation class
   ================================== */
var Excavation = function(gfxSrc, overlaySrc, number) {
    this.container = $("<div />").frame([0,0,game.width,game.height], 50);
    this.uncoverRadius = 15;
    this.rateNeededToUncover = 0.3;

    /* load images */
    var excavation = this;
    var images = loader.load(["excavation/"+gfxSrc, "excavation/"+overlaySrc], function() {
	excavation.drawOverlay();
    });
    this.imageOver = images[0];
    this.image = images[1];


    /* setup the canvas */
    var canvas = $("<canvas />")
	.attr({
	    width: game.width,
	    height: game.height
	})
	.css({
	    width: game.width+"px",
	    height: game.height+"px"
	})
	.appendTo(excavation.container);
    this.ctx = canvas[0].getContext("2d");


    /* setup events */
    var isTouching = false;
    function touchStart(event) {
	if ($.inputDisabled) return;
	isTouching = true;
    }
    function touchEnd(event) {
	if ($.inputDisabled) return;
	isTouching = false;
    }
    function touchMove(event) {
	if ($.inputDisabled) return;
	if (!isTouching) return;
	var pos = game.eventPos(event);
	excavation.uncover(pos.x, pos.y);
	if (! excavation.enoughUncovered()) return;
	if (excavation.itemRegistry) excavation.itemRegistry.show();
	else excavation.finish();
    }

    /* The jQuery seems to be bugging, so lets use basic javascript. */
    canvas[0].addEventListener("touchstart", touchStart, false);
    canvas[0].addEventListener("touchend", touchEnd, false);
    canvas[0].addEventListener("touchmove", touchMove, false);
    canvas[0].addEventListener("mousedown", touchStart, false);
    canvas[0].addEventListener("mouseup", touchEnd, false);
    canvas[0].addEventListener("mousemove", touchMove, false);

    /* The item registry */
    if (number != undefined) {
	this.itemRegistry = new ItemRegistry(number, function() {
	    excavation.finish();
	});
	this.itemRegistry.container.appendTo(this.container);
    }
}
/* The drawnGrid represents which parts of the image has been uncovered */ 
Excavation.prototype.resetDrawnGrid = function() {
    var excavation = this;
    excavation.resolution = parseInt(game.width / excavation.uncoverRadius);
    excavation.drawnGrid = new Array(excavation.resolution);
    for (var i=0; i<excavation.resolution; i++) {
	excavation.drawnGrid[i] = new Array(excavation.resolution);
	for (var j=0; j<excavation.resolution; j++)
	    excavation.drawnGrid[i][j] = false;
    }
}

Excavation.prototype.enoughUncovered = function() {
    var excavation = this;
    var uncovered = 0.0;
    for (var i=0; i<excavation.resolution; i++) {
	for (var j=0; j<excavation.resolution; j++) {
	    if (excavation.drawnGrid[i][j]) uncovered++;
	}
    }
    var uncoveredRate = uncovered/(excavation.resolution*excavation.resolution);
    return uncoveredRate > excavation.rateNeededToUncover;
}
Excavation.prototype.uncover = function(x, y) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.uncoverRadius, 0, Math.PI * 2, 1)
    this.ctx.clip();
    this.ctx.drawImage(this.imageOver, 0,0,game.width,game.height);
    this.ctx.restore();

    if (!loader.excavationSound.isPlaying || loader.excavationSound instanceof Audio) {
	loader.excavationSound.isPlaying = true;
	loader.excavationSound.play();
    }
    var i = parseInt(this.resolution * x / game.width);
    var j = parseInt(this.resolution * y / game.height);
    this.drawnGrid[i][j] = true;
}
Excavation.prototype.uncoverAll = function() {
    this.ctx.drawImage(this.imageOver, 0,0,game.width,game.height);
}
Excavation.prototype.drawOverlay = function() {
    this.ctx.drawImage(this.image, 0,0,game.width,game.height);
}
Excavation.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
    loader["puzzlefinished"].play();
    if (this.itemRegistry) game.nextScene();
    else game.nextButton.show();
}
Excavation.prototype.complete = function() {
    this.finish();
}
Excavation.prototype.sceneLoad = function() {
    if (this.itemRegistry) this.itemRegistry.load();
    this.finished = false;
    this.resetDrawnGrid();
    if (this.ctx) this.drawOverlay();
}
Excavation.prototype.sceneBegin = function() {
    game.curtain.down();
}
Excavation.prototype.sceneEnd = function() {
    this.uncoverAll();
}









/* ==================================
   ConfirmButton class
   ================================== */
var ConfirmButton = function(imgSrc, stringId, callback) {
    this.stringId = stringId;
    this.callback = callback;

    var confirmButton = this;

    this.container = $("<div />")
	.on("mousedown touchstart", function(event) {  confirmButton.toggleConfirmation(); return false; })
	.css({
	    "height":"100%",
	    "visibility": "hidden",
	});
    this.smallContainer = $("<div />")
	.css({
	    "-webkit-transition": "-webkit-transform 1s",
	    "-webkit-transform": "translate(-130px,130px)",
	    left: "0px",
	    width: "175px",
	    height: "120px",
	    bottom: "0px",
	})
	.appendTo(this.container);
    this.bg = $("<img />")
	.attr("src","gfx/paper-corner.png")
	.fill()
	.appendTo(this.smallContainer);
    this.label = $("<label />")
	.rect([10,45,120,undefined,3])
	.appendTo(this.smallContainer);
    this.yesButton = $("<button />")
	.css({
	    "fontSize": "20px",
	    "textAlign": "right", 
	})
 	.rect([110,80,undefined,undefined,-2])
	.appendTo(this.smallContainer)
	.touch(function(event) {
	    confirmButton.confirm();
	})
    $("<img />")
	.attr("src", "gfx/" + imgSrc)
	.css({
	    right: "18px",
	    top: "13px",
	    width: "30px",
	})
	.appendTo(this.smallContainer);

    this.hide();
}
ConfirmButton.prototype.load = function() {
    this.label.text(game.getString(this.stringId));
    this.yesButton.text(game.getString("yes"));
}
ConfirmButton.prototype.show = function() {
    this.isShowing = true;
    this.isConfirming = false;
    this.container.css("width","0px");
    this.smallContainer.css({
	"visibility": "visible",
	"-webkit-transform": "translate(-115px, 75px)",
    });
}
ConfirmButton.prototype.hide = function() {
    var confirmButton = this;
    setTimeout(function() { confirmButton.container.css("visibility", "hidden"); }, 1000);
    this.isShowing = false;
    this.isConfirming = false;
    this.container.css("width","0px");
    this.smallContainer.css("-webkit-transform", "translate(-130px, 130px)");
}
ConfirmButton.prototype.toggleConfirmation = function() {
    if (this.isConfirming) this.abortConfirmation();
    else this.askConfirmation();
}
ConfirmButton.prototype.askConfirmation = function() {
    var confirmButton = this;
    if (this.isConfirming) return;
    this.isConfirming = true;
    this.container.css("width", "100%");
    this.smallContainer.css("-webkit-transform", "translate(0px,0px)");
    game.fullContainer.one("mousedown touchstart", function() { confirmButton.abortConfirmation() });
}
ConfirmButton.prototype.abortConfirmation = function() {
    if (!this.isConfirming) return;
    this.show();
}
ConfirmButton.prototype.confirm = function() {
    this.hide();
    this.callback();
}







/* ==================================
   CornerButton class
   ================================== */
var CornerButton = function(callback, imgSrc) {
    this.container = $("<div />")
	.css({
	    right: -60, bottom: -40, width: "130px", height: "100px",
	    "-webkit-transition": "-webkit-transform 1s",
	    "-webkit-transform": "translate(100%,100%)",
	})
	.touch(function() {  callback();  });
    $("<img />").fill().attr("src", "gfx/paper-corner.png")
	.css("-webkit-transform", "scaleX(-1) rotate(-7deg)")
	.appendTo(this.container);
    this.image = $("<img />").rect([15,15])
	.attr("src", "gfx/" + imgSrc)
	.css({
	    "-webkit-animation": "PULSE 1s infinite",
	})
	.appendTo(this.container);
    this.hide();
}
CornerButton.prototype.show = function() {
    this.isShowing = true;
    this.container.css({
	"visibility": "visible",
	"-webkit-transform": "translate(0%, 0%)",
    });
}
CornerButton.prototype.hide = function() {
    var cornerButton = this;
    setTimeout(function() { cornerButton.container.css("visibility", "hidden"); }, 1000);
    this.isShowing = false;
    this.container.css("-webkit-transform", "translate(100%, 100%)");
}





/* ==================================
   Categorize class
   ================================== */
var Picture = function(stringId, imgSrc, category) {
    this.stringId = stringId;
    this.category = category;
    this.container = $("<div />").css({
	"z-index": 0,
    });
    this.whiteContainer = $("<div />").fill()
	.css({
	    "background-color": "#f0f0f0",
	    "box-shadow": "0 0 5px #888",
	}).appendTo(this.container);
    this.blackContainer = $("<div />")
	.rect([5,7,75,63])
	.css({
	    "background-color": "black",
	    "-webkit-box-shadow": "0 0 3px #888",
	})
	.appendTo(this.whiteContainer);
    this.image = $("<img />")
	.css({"width": "100%", "height": "100%"})
	.attr("src", imgSrc)
	.appendTo(this.blackContainer);
    this.textElem = $("<label />")
	.css({
	    "font-size": "8px",
	    "text-align": "center",
	})
	.rect([5,76+$.rand(3),75,undefined,$.rand(5)])
	.appendTo(this.whiteContainer);
    this.tape = $("<img />")/*
	.attr("src", "gfx/stamps/tape1.png")
	.rect([20+$.rand(10),-8+$.rand(5),30+$.rand(3),15+$.rand(3),-90+$.rand(10)])
	.css("opacity", ".5")
	.appendTo(this.whiteContainer);*/
    this.setFastened(false);
}
Picture.prototype.setFastened = function(fastened) {
    if (fastened) this.tape.css("visibility", "visible");
    else this.tape.css("visibility", "hidden");
}
Picture.prototype.setDragging = function(dragging) {
    this.setFastened(!dragging);
    if (dragging) {
	this.whiteContainer.css("-webkit-transform", "scale(1.8)");
    } else {
	this.whiteContainer.css("-webkit-transform", "scale(0.8)")
    }
}
Picture.prototype.moveTo = function(x, y) {
    this.container.css({left: x, top: y});
}
Picture.prototype.load = function() {
    this.y = undefined;
    this.container.rect([125+$.rand(50),370+$.rand(10),85,95]);
    this.textElem.text(this.stringId);
}
var Categorize = function(categories) {
    this.description = "describeCategorize";
    var categorize = this;
    this.container = $("<div />").fill();
    this.container1 = $("<div />")
	.rect([10,130, 300,80, 3])
	.appendTo(this.container);
    $("<img />")
	.fill()
	.attr("src", "gfx/paper-note.png")
	.appendTo(this.container1);
    this.cat1Label = $("<label />")
	.css({
	    "text-align": "right",
	    "font-size": "20px",
	    "right": "20px",
	    "top": "10px",
	})
	.appendTo(this.container1);
    this.container2 = $("<div />")
	.rect([10,250, 300,80, -2])
	.appendTo(this.container);
    this.bg2 = $("<img />")
	.fill()
	.attr("src", "gfx/paper-note.png")
	.appendTo(this.container2);
    this.cat2Label = $("<label />")
	.css({
	    "text-align": "right",
	    "font-size": "20px",
	    "right": "20px",
	    "top": "10px",
	})
	.appendTo(this.container2);

    this.pictures = new Array();
    for (var i=0; i<categories.length; i++) {
	var picture = new Picture(game.getString("item"+(i+1)), "gfx/categorize/"+(i+1)+".jpg", categories[i]);
	this.pictures[i] = picture;
	picture.container.appendTo(this.container);
    }

    // events, nearly identical to Mapping... TODO: Unite with mapping??
    var zIndex = 1, dragX=0, dragY=0, x=0, y=0;
    var dragged=null;
    function touchstart(picture) {
	return function(event) {
	    if ($.inputDisabled) return false;
	    dragged = picture;
	    picture.setDragging(true);
	    var pos = picture.container.offset();
	    picture.x = pos.left;
	    picture.y = pos.top;
	    var touchPos = game.eventPos(event);
	    dragX = touchPos.x;
	    dragY = touchPos.y;
	    picture.container.css("z-index",zIndex++); 
	    return false;
	};
    };
    function touchmove(event) {
	if ($.inputDisabled) return false;
	if (!dragged) return false;
	var dragPos = game.eventPos(event);
	var dx = dragPos.x-dragX;
	var dy = dragPos.y-dragY;
	dragged.x += dx;
	dragged.y += dy;
	dragged.moveTo(dragged.x, dragged.y);
	dragX = dragPos.x;
	dragY = dragPos.y;
	return false;
    };
    function touchend(event) {
	if ($.inputDisabled) return false;
	if (!dragged) return false;
	dragged.setDragging(false);
	dragged = null;
	if (categorize.isCategorizedCorrectly()) categorize.finish();
	return false;
    };
    for (var i=0; i<this.pictures.length; i++) {
	var picture = this.pictures[i];
	var start = touchstart(picture);
	picture.container[0].addEventListener("mousedown", start);
	picture.container[0].addEventListener("touchstart", start);
    }
    this.container[0].addEventListener("mousemove", touchmove);
    this.container[0].addEventListener("touchmove", touchmove);
    this.container[0].addEventListener("mouseup", touchend);
    this.container[0].addEventListener("touchend", touchend);
}
Categorize.prototype.isCategorizedCorrectly = function() {
    for (var i=0; i<this.pictures.length; i++) {
	var picture = this.pictures[i];
	if (picture.y == undefined) return false;
	if (picture.category == 1 && picture.y > 180) return false;
	else if (picture.category == 2 && picture.y < 180) return false;
    }
    return true;
}
Categorize.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
    loader["puzzlefinished"].play(); 
    setTimeout(function() {
	game.nextScene();
    },1500);
}
Categorize.prototype.complete = function() {
    var cat1left = -80, cat2left=-80;
    for (var i=0; i<this.pictures.length; i++) {
	var picture = this.pictures[i];
	picture.setDragging(true); picture.setDragging(false);
	if (picture.category == 1) picture.moveTo(cat1left+=100, 80);
	else picture.moveTo(cat2left+=100, 250);
    }
    this.finish();
}
Categorize.prototype.sceneLoad = function() {
    this.finished = false;
    this.cat1Label.text(game.getString("cat1"));
    this.cat2Label.text(game.getString("cat2"));
    for (var i=0; i<this.pictures.length; i++) this.pictures[i].load();
}
Categorize.prototype.sceneBegin = function(){
    game.curtain.down();
}



/* ==================================
   Strip class
   ================================== */
var Strip = function() {
    this.container = $("<div />").rect([-10,50,game.width+40,40]).css({
	"-webkit-transition": "-webkit-transform 0.8s",
    });
    $("<img />").attr("src", "gfx/paper-strip.png").fill().appendTo(this.container);
    this.label = $("<label />").fill().css({
	"top": 6,
	"font-size": "18px",
	"text-align": "center",
    }).appendTo(this.container);

    this.hide();
}
Strip.prototype.hide = function(onDone) {
    this.isHidden = true;
    if (onDone) setTimeout(function() { onDone(); }, 800);
    this.container.css("-webkit-transform", "rotate(-5deg) translate(-100%, 0)");
}
Strip.prototype.show = function(onDone) {
    this.isHidden = false;
    var strip = this;
    game.container.one("mousedown touchstart", function() { strip.hide(); });
    if (onDone) setTimeout(function() { onDone(); }, 800);
    this.container.css("-webkit-transform", "rotate(-5deg)");
}
Strip.prototype.load = function(scene) {
    this.label.text(game.getString(scene.description));
}





/* ==================================
   Mapping class
   ================================== */
var Pin = function(stringId, target) {
    this.threshold = 70;

    this.stringId = stringId;
    this.target = target;

    this.container = $("<div />");

    /* The paper label */
    var angle = $.rand(180);
    this.label = $("<div />").css("-webkit-transform-origin","0 0").rect([0,0, 120, 40, angle]).appendTo(this.container);
    $("<img />").fill().rect([-15,-22]).attr("src", "gfx/paper-strip.png").appendTo(this.label);
    this.textLabel = $("<label />").rect([8,-15,87,undefined,(angle>90||angle<-90) ? 180 : 0]).appendTo(this.label);

    /* the pin image */
    this.imageContainer = $("<div />").appendTo(this.container);
    this.outImage = $("<img />").fill().attr("src", "gfx/mapping/push_pin_black.png").appendTo(this.imageContainer);
    this.inImage = $("<img />").fill().attr("src", "gfx/mapping/push_pin_black_pushed.png").appendTo(this.imageContainer);
    this.pull();
}
Pin.prototype.pull = function() {
    this.pushed = false;
    this.imageContainer.rect([-30,-39,40, 47])
    this.outImage.css("visibility", "visible");
    this.inImage.css("visibility", "hidden");
}
Pin.prototype.push = function() {
    loader.puzzlepiecefit.play();
    this.pushed = true;
    this.imageContainer.rect([-25,-30,40, 47])
    this.inImage.css("visibility", "visible");
    this.outImage.css("visibility", "hidden");
}
Pin.prototype.moveToTarget = function() {
    this.moveTo(this.target[0], this.target[1]);
}
Pin.prototype.isClose = function(x,y) {
    var dx = x - this.target[0];
    var dy = y - this.target[1];
    var distance = Math.sqrt(dx*dx + dy*dy);
    return distance < this.threshold;
}
Pin.prototype.moveTo = function(x, y) {
    this.container.css({
	left: x+"px",
	top: y+"px",
    });
}
var Mapping = function(bgSrc, targets) {
    this.description = "describeMapping";

    var mapping = this;
    this.container = $("<div />")
	.frame([0,0,game.width,game.height], 50);
    this.bg = $("<img />")
	.fill()
	.attr("src", "gfx/mapping/"+bgSrc)
	.appendTo(this.container);


    /* create pins */
    this.pins = new Array();
    for (var i=0; i<targets.length; i++) {
	var stringId = "mapLoc"+(i+1);
	var pin = new Pin(stringId, targets[i]);
	this.pins[i] = pin;
    }
    this.pinsLeft = new Array();

    // events
    function touchStart(pin) {
	return function(event) {
	    if ($.inputDisabled) return false;
	    if (pin.isDragging) return false;
	    if (pin.pushed) return false;
	    pin.isDragging = true;
	    var pos = pin.container.position();
	    pin.x = pos.left;
	    pin.y = pos.top;
	    var touchPos = game.eventPos(event);
	    pin.dragX = touchPos.x;
	    pin.dragY = touchPos.y;
	    return false;
	};
    };
    function touchMove(pin) {
	return function(event) {
	    if ($.inputDisabled) return false;
	    if (!pin.isDragging) return false;
	    var dragPos = game.eventPos(event);
	    var dx = dragPos.x-pin.dragX;
	    var dy = dragPos.y-pin.dragY;
	    pin.x += dx;
	    pin.y += dy;
	    pin.moveTo(pin.x, pin.y);
	    pin.dragX = dragPos.x;
	    pin.dragY = dragPos.y;
	    return false;
	};
    }
    function touchEnd(pin){
	return function(event) {
	    if ($.inputDisabled) return false;
	    if (!pin.isDragging) return false;
	    pin.isDragging = false;
	    if (pin.isClose(pin.x, pin.y)) mapping.pushActivePin();
	    return false;
	};
    };
    for (var i=0; i<this.pins.length; i++) {
	var pin = this.pins[i];
	var start = touchStart(pin);
	pin.container[0].addEventListener("mousedown", start);
	pin.container[0].addEventListener("touchstart", start);
	var move = touchMove(pin);
	this.container[0].addEventListener("mousemove", move);
	this.container[0].addEventListener("touchmove", move);
	var end = touchEnd(pin);
	this.container[0].addEventListener("mouseup", end);
	this.container[0].addEventListener("touchend", end);
    }
}
Mapping.prototype.pushPins = function() {
    for (var i=0, len=this.pinsLeft.length; i<len; i++) {
	this.pinsLeft[0].moveToTarget();
	this.pinsLeft[0].push();
	this.pushActivePin();
    }
}
Mapping.prototype.pushActivePin = function() {
    this.pinsLeft[0].push();
    this.pinsLeft.shift();
    if (this.pinsLeft.length == 0) {
	this.finish(); 
	return; 
    }
    this.showPin(this.pinsLeft[0]);
}
Mapping.prototype.showPin = function(pin) {
    pin.moveTo(100,game.height/2);
    pin.container.appendTo(this.container);
}
Mapping.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
    loader["puzzlefinished"].play(); 
    game.nextButton.show();
}
Mapping.prototype.complete = function() {
    for (var i=0; i<this.pins.length; i++) {
	var pin = this.pins[i];
	pin.moveToTarget();
	pin.push();
	this.showPin(pin);
    }
    this.finish();
}
Mapping.prototype.sceneLoad = function() {
    this.finished = false;
    for (var i=0; i<this.pins.length; i++) {
	var pin = this.pins[i];
	this.pinsLeft[i] = pin;
	pin.pull();
	pin.container.remove();
    }
    /* update strings */
    for (var i=0; i<this.pins.length; i++) {
	var pin = this.pins[i];
	pin.textLabel.text(game.getString(pin.stringId));
    }
    this.showPin(this.pins[0]);
}






/* ==================================
   Postcard class
   ================================== */
var Postcard = function() {
    var postcard = this;
    this.noCurtain = true;
    this.noHomeButton = true;

    this.container = $("<div />").fill().css({
	    "-webkit-perspective": "800px",
	});

    this.congratsStrip = $("<div />").rect([-20,7,350,50,0]).appendTo(this.container);
    $("<img />").fill().attr("src", "gfx/paper-strip.png").appendTo(this.congratsStrip);
    this.congratsLabel = $("<label />").rect([25,8,285]).css({
		"font-size": "22px",
		"text-align": "center",
    }).appendTo(this.congratsStrip);

    this.card = $("<div />")
	.rect([20,50,270,380])
	.css({
	    "-webkit-transform-style": "preserve-3d",
	    "-webkit-transition": "-webkit-transform 1s",
	})
	.appendTo(this.container);


    /* back side */
    this.back = $("<div />")
	.fill()
	.css({
	    "-webkit-backface-visibility": "hidden",
	    "-webkit-transform": "rotateY(180deg)",
	})
	.appendTo(this.card);
    $("<img />").fill().attr("src", "gfx/postcard.png").appendTo(this.back);
    this.smallPhoto = $("<img />");
    this.smallPhoto.frame([50,240,80,100, 91], 20).appendTo(this.back);
    $("<img />").rect([10,10,75,undefined,5]).attr("src", "gfx/stamps/ntnu-stamp.png").appendTo(this.back);
    this.postcardLabel = $("<label />").rect([125,240,160,95,88]).css({
	"text-align": "center",
    }).appendTo(this.back);
    this.byEmailLabel = $("<label />").rect([45,90,180,undefined,91]).appendTo(this.back);
    this.emailLabel = $("<label />").rect([65,90,180,undefined,91]).css({
	"font-size": "10px",
	"overflow": "ellipsis",
    }).appendTo(this.back);
    this.greetingLabel = $("<label />").rect([100,90,180,undefined,91]).appendTo(this.back);
    this.nameLabel = $("<label />").rect([120,86,180,undefined,91]).css({
	"overflow": "ellipsis",
    }).appendTo(this.back);
    this.emailButton = $("<label />").rect([215,20,50,30,92]).text("Send!").css({
	"text-decoration": "underline",
    }).touch(function() {
	postcard.sendEmail();
    }).appendTo(this.back);
    $("<img />").attr("src","gfx/stamps/stamp-waves.png").css({
	"-webkit-transform": "rotate(-88deg)",
	"opacity": "0.3",
	width: 100,
	height: 40,
	top: 90,
	left: 0,
    }).appendTo(this.back);
    $("<img />").attr("src","gfx/stamps/red_stamp.png").css({
	width: 60,
	top: 180,
	left: 40,
    }).appendTo(this.back);


    /* front side */
    this.front = $("<div />").fill().css({
	    "-webkit-transform-style": "preserve-3d",
	    "-webkit-backface-visibility": "hidden",
	}).appendTo(this.card);
    $("<img />").fill().attr("src", "gfx/postcard_front.png").css("-webkit-transform","scaleX(-1)").appendTo(this.front);
    this.bigPhoto = $("<img />").css({
	    "-webkit-box-shadow": "0 0 8px #888",
	    "-webkit-border-radius": "2px",
	    "border": "1px #222 solid",
	}).rect([15,20,240,310]).appendTo(this.front);
    this.museumLabel = $("<label />").css({
	    left: 15,
	    bottom: 5,
	    width: 250,
	    textAlign: "center",
	    fontSize: "18px",
	}).appendTo(this.front);

    /* flip button */
    this.flipButton = new CornerButton(function(){ postcard.flip(); }, "flip_arrow.png");
	if (!window.device || device.platform != "Android") // TODO: Doesn't work on Android :(
    	this.flipButton.container.appendTo(this.container);

    this.restartButton = new ConfirmButton("arrow1.png", "restartConfirmation", function() { game.reset(); });
    this.restartButton.container.appendTo(this.container);

    this.showFront();
}
Postcard.prototype.sendEmail = function() {
    console.log("Attempting to send e-mail.");
    if (!window.plugins || !window.plugins.emailComposer) {
	console.error("No e-mail plugin found.");
	return;
    }
    var subject = game.getString("emailSubject");
    var body = game.getString("emailBody");
    window.plugins.emailComposer.showEmailComposer(subject,body,game.userdata.email);//,"","",true);
}
Postcard.prototype.flip = function() {
    if (this.backShowing) this.showFront();
    else this.showBack();
}
Postcard.prototype.showFront = function() {
    this.backShowing = false;
    this.card.css("-webkit-transform", "rotate(-3deg)");
}
Postcard.prototype.showBack = function() {
    this.backShowing = true;
    this.card.css("-webkit-transform", "rotate(-3deg) rotateY(180deg)");
}
Postcard.prototype.sceneBegin = function() {
    loader.fanfare.play();
    this.flipButton.show();
    this.restartButton.show();
}
Postcard.prototype.sceneEnd = function() {
    this.flipButton.hide();
    this.restartButton.hide();
}
Postcard.prototype.sceneLoad = function() {
    /* update images */
    this.bigPhoto.attr("src", game.userdata.photoWithCrown.src);
    this.smallPhoto.attr("src", game.userdata.photoWithCrown.src);

    /* update strings */
    this.congratsLabel.text(game.getString("congrats"));
    this.museumLabel.text(game.getString("museumName"));
    this.postcardLabel.text(game.getString("postcardText"));
    if (game.userdata.email) {
	this.byEmailLabel.text(game.getString("byEmailTo"));
	this.emailLabel.text(game.userdata.email);
    }
    if (game.userdata.name) {
	this.greetingLabel.text(game.getString("greeting"));
	this.nameLabel.text(game.userdata.name);
    }

    this.restartButton.load();
}





/* ==================================
   StoryNote class
   ================================== */
var StoryNote = function(textId, rect, lineLength, nofKeysRewarded) {
    var storyNote = this;
    this.noCurtain = true;

    this.textId = textId;
    this.container = $("<div />").fill();
    this.smallContainer = $("<div />")
	.rect(rect)
	.appendTo(this.container);
    this.bg = $("<img />")
	.fill()
	.attr("src", "gfx/paper-note.png")
	.appendTo(this.smallContainer);
    this.textElem = $("<pre />")
	.css({
	    fontSize: "15px",
	    margin: "10px 20px"
	})
	.appendTo(this.smallContainer);

    var tapeAngle = 90 + $.rand(15);
    var tapeLeft = 100 + $.rand(40);
    this.tape = $("<img />")
	.attr("src", "gfx/stamps/tape1.png")
	.css({
	    opacity: ".3",
	    top: "-20px",
	    left: tapeLeft+"px",
	    "-webkit-transform": "rotate("+tapeAngle+"deg)",
	    height: "40px",
	    width: "80px",
	})
	.appendTo(this.smallContainer);
    this.typewriter = new Typewriter(this.textElem, lineLength, function() {
	storyNote.finish();
    });
}
StoryNote.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
    game.nextButton.show();
}
StoryNote.prototype.complete = function() {
    this.typewriter.complete();
    this.finish();
}
StoryNote.prototype.sceneLoad = function() {
    this.finished = false;
    this.text = "\n\n" + game.getString(this.textId);
    if (game.userdata.name) this.text = game.getString("dear")+" "+game.userdata.name.substring(0,20) +" "+ this.text;
    this.textElem.text("");
}
StoryNote.prototype.sceneBegin = function() {
    this.typewriter.start(this.text);
}
StoryNote.prototype.sceneEnd = function() {
    this.typewriter.stop();
}




/* ==================================
   Typewriter class
   ================================== */
var Typewriter = function(elem,lineLen, onDone) {
    this.elem = elem;
    this.lineLen = lineLen;
    this.delay = 50;
    this.onDone = onDone;
}
Typewriter.prototype.pause = function() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timeout) clearTimeout(this.timeout);
    loader.typewriter.pause();
    loader.typewriter.isPlaying = false;
    this.timeout = undefined;
}
Typewriter.prototype.play = function() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    var typewriter = this;
    
    this.timeout = setInterval(function() {
	if (!typewriter.type()) { typewriter.stop(); return; }
	if (!loader.typewriter.isPlaying || loader.typewriter instanceof Audio) {
	    loader.typewriter.isPlaying = true;
	    loader.typewriter.play();
	}
	typewriter.randomPause();
    },1);
}
Typewriter.prototype.stop = function() {
    this.pause();
    if (this.onDone) this.onDone();
}
Typewriter.prototype.type = function() {
    if (this.wordIndex == this.wordCount) return false;

    this.letter = this.word.substring(this.wordPos, this.wordPos+1);
    if (this.letter == "\n") {
	this.linePos = 0;
	this.wordPos++;
    } else {
	if (this.linePos == this.lineLen-1 || this.linePos+this.wordLen-this.wordPos-1 >= this.lineLen-1) {
	    this.letter = "\n";
	    this.linePos = 0;
	} else {
	    this.linePos++; this.wordPos++;
	}
    }
    this.currentText += this.letter;
    this.elem.text(this.currentText);
    if (this.wordPos == this.wordLen) { 
	this.wordIndex++;
	if(this.wordIndex == this.wordCount) {
	    return false;
	} else {
	    this.wordPos=0; this.word=this.words[this.wordIndex]; this.wordLen=this.word.length; 
	}
    }
    return true;
}
Typewriter.prototype.randomPause = function() {
    var ms = Math.random()*this.delay;
    ms += new Date().getTime();
    while (new Date() < ms){}
}
// Not 100% correct, but it works well enough
Typewriter.prototype.start = function(text) {
    this.text = text;
    this.elem.text("");
    this.isTyping = true;
    this.words = this.text.split(" ");
    this.wordCount = this.words.length;
    for (var i=0; i<this.wordCount; i++) this.words[i] += " ";
    this.linePos = 0;
    this.currentText = "";
    this.wordIndex = 0;
    this.word = this.words[this.wordIndex];
    this.wordPos = 0;
    this.wordLen = this.word.length; 
    this.letter;
    this.play();
}
Typewriter.prototype.finish = function() {
    if (this.finished) return;
    this.finished = true;
}
Typewriter.prototype.complete = function() {
    while(this.type());
    this.stop();
    this.finish();
}









/* ==================================
   Splash class
   ================================== */
var Splash = function() {
    this.noCurtain = true;
    this.noHomeButton = true;

    this.container = $("<div />").frame([0,0,game.width,game.height],50);
    this.bg = $("<img>").fill()
	.on("load", function() {
	    if (navigator.splashscreen) navigator.splashscreen.hide();
	}).attr("src", "gfx/splash-screen.jpg").appendTo(this.container);

    this.noButton = $("<img />").rect([70,400]).attr("src","gfx/flag_no.png").touch(function(){
	game.userdata.language = "nb";
	game.nextScene();
    }).appendTo(this.container);
    this.enButton = $("<img />").rect([200,400]).attr("src","gfx/flag_en.png").touch(function(){
	game.userdata.language = "en";
	game.nextScene();
    }).appendTo(this.container);
}
Splash.prototype.sceneLoad = function() {
    game.userdata.reset();
}








/* ==================================
    Game class
   ================================== */
var Game = function() {
    var game = this;
    this.debug = {
	speedyGonzales: false,
	aBetterView: function() { game.fullContainer.css({"-webkit-transform": "scale(0.6)", "overflow": "visible", }); },
    };
    this.userdata = new Userdata();
    this.activeArea = "home";

    /* screen resolution */
    this.ratio = $(window).height() / $(window).width();
    this.width = 320;
    this.height = 480; //this.width * this.ratio;
    this.scale = 1;
}
/* zooms the view to fit the screen, used to support different resolutions */
Game.prototype.zoomScreen = function() {
    var scaleX = window.innerWidth / this.width;
    var scaleY = window.innerHeight / this.height;
    this.scale = Math.max(scaleX, scaleY);
    $("body").css("zoom", this.scale);
}
Game.prototype.eventPos = function(event) {
    var touches = event.changedTouches;
    if (touches)
	return {
	    x: touches[0].pageX / game.scale,
	    y: touches[0].pageY / game.scale,
	};
    else 
	return {
	    x: event.pageX/game.scale,
	    y: event.pageY/game.scale,
	};
}

Game.prototype.getString = function(key) {
    var string = loader.strings[this.userdata.language][key];
    if (!string) string = loader.strings["default"][key];
    if (!string) string = "[STRING NOT FOUND]";
    return string;
}
/* Mostly for debugging, as this will also reload the current scene */
Game.prototype.setLanguage = function(language) {
    this.userdata.language = language;
    this.activeScene.sceneLoad();
}
/* Assumes only English and Norwegian */
Game.prototype.swapLanguage = function() {
    if (this.userdata.language == "nb") this.setLanguage("en");
    else this.setLanguage("nb");
}

/* Animates a transform using transitions */
Game.prototype.applyTransform = function(transform, animop, onDone) {
    var game = this;
    var elems = game.bg.add(game.container);
    if (animop && !game.seguesDisabled) {
	game.bg.one("webkitTransitionEnd", function(event) {
	    if (onDone) onDone(event);
	})
	elems.css({
	    "-webkit-transition": "-webkit-transform "+animop,
	    "-webkit-transform": transform,
	});
    } else {
	elems.css({
	    "-webkit-transition": "",
	    "-webkit-transform": transform,
	});
	if(onDone) onDone(event);
    }
}
Game.prototype.applyTransforms = function(transforms, animOps, callbacks) {
    var game = this;
    var transform = transforms.shift();
    var animOp = animOps.shift();
    var callback = callbacks.shift();
    if (transforms) game.applyTransform(transform, animOp, function() {
	if (callback) callback();
	if (transform) game.applyTransforms(transforms, animOps, callbacks);
    });
}
Game.prototype.transformTos = function(locs, animOps, callbacks) {
    var transforms = new Array();
    for (var i=0; i<locs.length; i++) {
	var loc = locs[i];
	transforms[i] = "scale("+(1/loc[3])+") rotate("+(-loc[2])+"deg) translate("+(-loc[0])+"px,"+(-loc[1])+"px)";
    }
    this.applyTransforms(transforms, animOps, callbacks);
}
Game.prototype.transformTo = function(loc, animOp, onDone) {
    var transform = "scale(" + (1/loc[3]) + ") rotate("+(-loc[2])+"deg) translate("+(-loc[0])+"px,"+(-loc[1])+"px)";
    this.applyTransform(transform, animOp, onDone);
}
Game.prototype.segue = function(toScene, onDone) {
    $.keyboard(false);
    var game = this;
    if (game.inSegue) return;
    game.inSegue = true;
    $.inputDisabled = true;
    if (game.activeScene && game.activeScene.onDone) game.activeScene.onDone();
    if (game.activeScene && game.activeScene.sceneEnd) game.activeScene.sceneEnd(); 

    game.addScene(toScene);
    var halfway = function() {
	if (!toScene.noHomeButton) { game.homeButton.load(); game.homeButton.show(); }
	if (!toScene.noCurtain) { game.curtain.show(); }
	if (toScene.description) { game.strip.show(); }
    }
    var finished = function() {
	if (game.activeScene) game.removeScene(game.activeScene);
	game.inSegue = false;
	$.inputDisabled = false;
	game.activeScene = toScene;
	if (toScene.sceneBegin) toScene.sceneBegin();
	if (onDone) onDone();
	if (game.debug.speedyGonzales) { game.nextScene(); if (game.activeScene.complete) game.activeScene.complete(); }
    };

    var toLoc;
    if (toScene.cameraLoc != undefined) toLoc = toScene.cameraLoc;
    else toLoc = toScene.loc;

    game.curtain.hide(function() { game.curtain.load(toScene); });
    game.strip.hide(function() { game.strip.load(toScene); });
    game.nextButton.hide();
    game.homeButton.hide();

    if (game.activeScene == undefined) {
	game.curtain.load(toScene);
	game.strip.load(toScene);
	this.transformTo(toLoc);
	setTimeout(function() {
	    halfway();
	    finished();
	},1000); 
    } else {
	if (game.seguesDisabled) {
	    setTimeout(function() {
			game.transformTo(toLoc);
			halfway();
			finished();
	    },500);
	} else if (toScene.directSegue) { // just transition directly
	    game.transformTo(toLoc, "1s", finished);
	    halfway();
	} else { // transition with a midpoint
	    var fromLoc;
	    if (game.activeScene.cameraLoc) fromLoc = game.activeScene.cameraLoc;
	    else fromLoc = game.activeScene.loc;
	    var fromX=fromLoc[0], fromY=fromLoc[1], fromAngle=fromLoc[2], fromScale=fromLoc[3];
	    var toX=toLoc[0], toY=toLoc[1], toAngle=toLoc[2], toScale=toLoc[3];
	    var loc_halfway = [(fromX+toX)/2, (fromY+toY)/2, (fromAngle+toAngle)/2, 1.5];

	    game.transformTos([loc_halfway, toLoc], ["1s","1s"], [halfway, finished]);
	}
    }
}
Game.prototype.addScene = function(scene) {
    if (scene.sceneLoad) scene.sceneLoad();
    var loc = scene.loc;
    scene.container
	.css("-webkit-transform", " translate("+loc[0]+"px,"+loc[1]+"px) rotate("+loc[2]+"deg) scale("+loc[3]+")")
	.appendTo(this.container);
}
Game.prototype.removeScene = function(scene) {
    if (scene.sceneUnload) scene.sceneUnload();
    scene.container.detach();
}
Game.prototype.chain = function() {
    var game = this;
    var scenes = arguments;
    for (var i=0; i<scenes.length-1; i++) 
	scenes[i].nextScene = scenes[i+1];
    return arguments[0];
}
Game.prototype.goHome = function(onDone) {
    game.segue(game.home, onDone);
}
Game.prototype.nextScene = function(onDone) {
    if (game.activeScene.nextScene) game.segue(game.activeScene.nextScene, onDone);
}
Game.prototype.reset = function() {
    game.activeArea = "home";
    game.segue(game.beginning);
}
Game.prototype.fixAndroid = function() {
    if (!window.device || device.platform != "Android") return;

    // prevent the default quitting on the backbutton
    $(document).on("backKeyDown backbutton", function() 	{
	$.keyboard(false);
	event.preventDefault();
    });
    
    // disable segues for older iPhones
    var version = parseInt(device.version[0]);
    if ((version <= 3)) game.seguesDisabled = true;
}
Game.prototype.begin = function(fullContainer) {
    this.fixAndroid();

    /* set up containers */
    var game = this;
    loader.load(["excavationSound.mp3","puzzlefinished.mp3", "curtain_down.mp3", "curtain_up.mp3", "puzzlepiecefit.mp3", "button_click.mp3", "correct_answer.mp3", "wrong_answer.mp3", "typewriter.mp3", "key1.wav", "fanfare.mp3"]);

    loader.load("strings.json", function(){
	game.zoomScreen();
	game.fullContainer = $(fullContainer)
	    .prevent()
	    .css({
		width: game.width+"px",
		height: game.height+"px",
		overflow: "hidden", // need this to avoid the onscreen keyboard not jumping back
	    });
	game.container = $("<div />").fill().appendTo(game.fullContainer);

	/* load the background */
	game.bg = $("<img />").prependTo(game.fullContainer);
	game.bg.load(function(event) {
	    // TODO: Remove in the final version, should be in the Splash class
	    if (navigator.splashscreen) navigator.splashscreen.hide();
	});
	game.bg.attr("src","gfx/background.jpg");

	/* Set the origin of transforms to the center of the screen */
	game.bg.add(game.container).css("-webkit-transform-origin", (game.width/2)+"px " + (game.height/2)+ "px")

	/* load the description strip */
	game.strip = new Strip();
	game.strip.container.appendTo(game.fullContainer);

	/* load the curtain */
	game.curtain = new Curtain();
	game.curtain.container.appendTo(game.fullContainer);
	
	/* load the buttons */
	game.homeButton = new ConfirmButton("house.png", "goHomeConfirmation", function() { game.goHome(); });
	game.homeButton.container.appendTo(game.fullContainer);
	game.nextButton = new CornerButton(function() { game.nextScene(); }, "arrow3.png");
	game.nextButton.container.appendTo(game.fullContainer);

	/* Create scenes */
	game.splash = new Splash();
	game.credits = new Credits();
	game.passport = new Passport();
	game.home = new Home();
	game.postcard = new Postcard();

	var note = new Array();
	note[0] = new StoryNote("storyNote1", [20,100,280,235,4], 32); //after Splashscreen
	note[1] = new StoryNote("storyNote2", [20,50,280,335,-3], 32); //traveling to AiKhanoum
	note[2] = new StoryNote("storyNote6", [20,100,280,305,5], 32); //after jigsaw 1
	note[3] = new StoryNote("storyNote7", [20,70,280,325,-2], 32); //traveling to Begram
	note[4] = new StoryNote("storyNote11", [20,110,290,245,5], 32); //after q14
	note[5] = new StoryNote("storyNote12", [20,125,280,235,-3], 32); //traveling to Tepe Fullol
	note[6] = new StoryNote("storyNote15", [20,70,280,325,5], 32); //after jigsaw 3
	note[7] = new StoryNote("storyNote16", [20,100,280,245,-2], 32); //traveling to Tillya Tepe
	note[8] = new StoryNote("storyNote20", [20,100,280,305,1], 32); //after q23
	note[9] = new StoryNote("storyNote22", [20,90,280,185,-3], 32); //getting the final treasure - "Finished"
	var cat = new Categorize([2,1,1,2,2,1]);
	var ex = new Array();
	ex[1] = new Excavation("1.jpg","overlay.jpg");
	ex[2] = new Excavation("2.jpg","2_overlay.jpg",2);
	ex[3] = new Excavation("3.jpg","overlay.jpg",1);
	ex[4] = new Excavation("4.jpg","3_overlay.jpg",17);
	var jig = new Array();
	jig[1] = new Jigsaw(1, [[21,134], [96,165], [47,274], [173,256], [84, 333]],  
			    [[0,1,1,0,0],[1,0,1,1,0],[1,1,0,1,1],[0,1,1,0,1],[0,0,1,1,0]], 2);
	jig[2] = new Jigsaw(2, [[26,235], [58,154], [210,113], [7,165], [163,42], [9,41]], 
			    [[0,1,1,1,0,0],[1,0,1,1,1,1],[1,1,0,0,1,0],[1,1,0,0,0,1],[0,1,1,0,0,1],[0,1,0,1,1,0]], 11);
	jig[3] = new Jigsaw(3, [[24,280], [116,359], [17,178], [8,70], [85,67], [172,74], [246,84]],
			    [[0,1,1,0,0,0,0],[1,0,0,0,0,0,0],[1,0,0,1,1,1,1],[0,0,1,0,1,0,0],[0,0,1,1,0,1,0],[0,0,1,0,1,0,1],[0,0,1,0,0,1,0]], 2)
	jig[4] = new Jigsaw(4, [[57,87], [259,192], [212,185], [130,186], [75,188], [218,119], [146,118], [79,117], [54,122]],
			    [[0,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0]]);
	jig[5] = new Jigsaw(5,[[55,435],[35,370],[100,365],[160,363],[235,366],[300,368]],
			    [[0,1,1,1,1,1],[1,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0],[1,0,0,0,0,0]]);
	var q = new Array();//left, top, width, height, rotation
	q[1] = new QuizQuestion(1, 4, 4, [20,60,125,undefined,2], "q1_q2.jpg", [170,60,120,147,-3]); // aikhanum
	q[2] = new QuizQuestion(2, 4, 1, [30,100,130,undefined,-2], "q1_q2.jpg", [170,55,120,147,2]);
	q[3] = new QuizQuestion(3, 4, 4, [175,110,130,undefined,0], "q3.jpg", [20,50,120,125,-3]);
	q[4] = new QuizQuestion(4, 4, 1, [25,53,120,undefined,-1], "q4.jpg", [170,60,120,120,3]);
	q[11] = new QuizQuestion(11, 4, 3, [200,115,110,undefined, 2], "q11.jpg", [30,70,145,152,-2]); //begram quiz
	q[12] = new QuizQuestion(12, 4, 1, [175,85,125,undefined,-1], "q12.jpg", [27,38,125,197,3]);
	q[13] = new QuizQuestion(13, 4, 3, [180,90,120,undefined,2], "q13.jpg", [30,55,120,101,-4]);
	q[14] = new QuizQuestion(14, 4, 4, [170,90,120,undefined,-1], "q14.jpg", [29,50,102,160,4]);
	q[15] = new QuizQuestion(15, 4, 1, [40,200,260,undefined,0], "q15-16-17-18.jpg", [35,55,160,101,2]); // tepefullol
	q[16] = new QuizQuestion(16, 4, 2, [30,190,280,undefined,0], "q15-16-17-18.jpg", [50,60,160,101,-2]);
	q[17] = new QuizQuestion(17, 4, 3, [50,55,250,undefined,1], "q15-16-17-18.jpg", [40,110,160,101,2]);
	q[18] = new QuizQuestion(18, 4, 2, [30,200,280,undefined,0], "q15-16-17-18.jpg", [35,55,160,101,2]);
	q[19] = new QuizQuestion(19, 2, 2, [30,180,280,undefined,2], "q19.jpg", [40,60,210,60,-3]); // tillyatepe
	q[20] = new QuizQuestion(20, 2, 1, [30,50,280,undefined,-3], "q20.jpg", [120,115,150,121,2]);
	q[21] = new QuizQuestion(21, 2, 2, [30,210,280,undefined,-1], "q21.jpg", [50,60,135,135,1]);
	q[22] = new QuizQuestion(22, 2, 1, [30,40,280,undefined,-1], "q22.jpg", [120,110,150,122,2]);
	q[23] = new QuizQuestion(23, 2, 2, [30,40,280,undefined,2], "q23.jpg", [60,110,160,107,-1]);
	map = new Mapping("map1.jpg", [[144,402], [167,200], [261,82]]);

	/* Want the scenes accessible for debugging */
	game.q = q; game.jig = jig; game.ex = ex; game.note = note; game.cat=cat; game.map = map;

	/* Position scenes */
	game.splash.loc = [0,0,0,1];
	game.credits.loc = [620,40,0,1];
	game.passport.loc = [300,715, 0,1];
	game.passport.cameraLoc = [300,715,0,2];
	note[0].loc = [500,100,45,1];
	game.home.loc = [140,200,-30,1];
	//Ai Khanoum
	note[1].loc = [360,540,60,1];
	ex[1].loc = [620,100,-90,1];
	q[1].loc = [520,550,0,1];
	q[2].loc = [870,830,90,1];
	q[3].loc = [840,340,180,1];
	q[4].loc = [500,780,1,1];
	map.loc = [660,300,-30,1];
	jig[1].loc = [400,700,150,1];
	note[2].loc = [580,250,-60,1]
	//Begram
	note[3].loc = [620,100,-90,1];
	ex[2].loc = [870,830,90,1];
	cat.loc = [660,300,-30,1];           
	jig[2].loc = [360,540,60,1]; 
	q[11].loc = [840,340,180,1];
	q[12].loc = [500,780,1,1];
	q[13].loc = [620,250,-60,1];
	q[14].loc = [400,700,150,1];            
	note[4].loc = [660,300,-30,1];
	//Tepe Fullol
	note[5].loc = [580,130,0,1];
	ex[3].loc = [400,700,150,1];
	q[15].loc = [660,300,-30,1];
	q[16].loc = [500,780,1,1];
	q[17].loc = [840,340,180,1];
	q[18].loc = [870,830,90,1];
	jig[3].loc = [520,550,180,1];
	note[6].loc = [620,100,-90,1];
	//Tillya Tepe
	note[7].loc = [660,300,-30,1];
	ex[4].loc = [400,700,150,1];            
	jig[4].loc = [620,250,-60,1];
	q[19].loc = [500,780,1,1];
	q[20].loc = [840,340,180,1];
	q[21].loc = [360,540,60,1];
	q[22].loc = [660,300,-30,1];
	q[23].loc = [870,830,90,1];
	note[8].loc = [620,100,-90,1];
	// ending
	note[9].loc = [840,340,180,1];
	jig[5].loc = [300,690,1,1];
	game.postcard.loc = [850,680,0,1]; // TODO: Don't set rotation to anything but 0, might fail on Android.

        
	//Declaration of explanation
	game.passport.explanation = "explainPassport";
	game.home.explanation = "travelHint1";
	ex[1].explanation = "excavationAssignment1";  ex[1].description = "describeExcavationDirt";
	map.explanation = "mappingCurtain";
	jig[1].explanation = "jigsawCurtain1"; 
	ex[2].explanation = "excavationAssignment2";  ex[2].description = "describeExcavationDust";
	cat.explanation = "catCurtain";
	jig[2].explanation = "jigsawCurtain2";
	ex[3].explanation = "excavationAssignment3";  ex[3].description = "describeExcavationDirt";
	jig[3].explanation = "jigsawCurtain3";            
	ex[4].explanation = "excavationAssignment4";  ex[4].description = "describeExcavationGrass";
	jig[4].explanation = "jigsawCurtain4";
	jig[5].explanation = "jigsawCurtain5";       
	
	/* Set up segues */
	if (window.device && device.platform == "Android") {// Skip the passport on Android {
	    game.beginning = game.chain(game.splash, game.credits, note[0], game.home);
		note[0].loc = game.passport.loc;
	} else
	    game.beginning = game.chain(game.splash, game.credits, game.passport, note[0], game.home);
	game.ending = game.chain(jig[5], game.postcard);

	note[0].noHomeButton = true;
	game.aikhanum = game.chain(note[1], ex[1], q[1], q[2], q[3], q[4], map, jig[1], note[2], game.home);
	game.home.nextScene = game.aikhanum;
	note[2].onDone = function() {
            game.home.explanation = "travelHint2";
	    game.userdata.nofkeys = Math.max(1, game.userdata.nofkeys);
	    game.userdata.nofAreasUnlocked = Math.max(2, game.userdata.nofAreasUnlocked);
	    game.home.nextScene = game.begram;
	};
	game.begram = game.chain(note[3], ex[2], cat, jig[2], q[11], q[12], q[13], q[14], note[4], game.home);
	note[4].onDone = function() {
            game.home.explanation = "travelHint3";
	    game.userdata.nofkeys = Math.max(3, game.userdata.nofkeys);
	    game.userdata.nofAreasUnlocked = Math.max(3, game.userdata.nofAreasUnlocked);
	    game.home.nextScene = game.tepefullol;
	};
	game.tepefullol = game.chain(note[5], ex[3], q[15], q[16], q[18], jig[3], note[6], game.home); //q[17] available
	note[6].onDone = function() {
            game.home.explanation = "travelHint4";
	    game.userdata.nofkeys = Math.max(5, game.userdata.nofkeys);
	    game.userdata.nofAreasUnlocked = 4;
	    game.home.nextScene = game.tillyatepe;
	};

	game.tillyatepe = game.chain(note[7], ex[4], jig[4], q[19], q[20], q[21], q[22], q[23], note[8], game.home);
	note[8].onDone = function() {
	    game.userdata.nofkeys = 7;
	    game.home.nextScene = game.ending;
            game.home.explanation = "travelHint1";
	};
	game.home.onSelectArea = function(area) {
	    if(area == "aikhanum") game.segue(game.aikhanum);
	    else if(area == "begram") game.segue(game.begram);
	    else if(area == "tepefullol") game.segue(game.tepefullol);
	    else if(area == "tillyatepe") game.segue(game.tillyatepe);
	};

	/* Start the game */
	game.reset();
	//game.segue(ex[1]);
    });
}

/* global game object */
var game = new Game();

document.addEventListener("deviceready", function() {
    game.begin(document.getElementById('container'));
}, false);


$(function() {
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (!is_chrome) return;
    game.begin($("#container"));
});