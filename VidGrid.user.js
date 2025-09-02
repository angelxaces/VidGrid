// ==UserScript==
// @name VidGrid Development cleanup
// @run-at document-idle
// @description Watch a selection of feeds on Chaturbate.com simultaneously within a single tab using VidGrid!
// @author Mr. Jangles
// @match http*://*.chaturbate.com/*&*
// @match http*://chaturbate.com
// @match http*://*chaturbate.com/*
// @match http*://*chaturbate.com/*?*
// @match http*://*chaturbate.com/tags/*
// @match http*://*chaturbate.com/tags/*/*
// @match  http*://*chaturbate.com/*?page=*
// @match  http*://*chaturbate.com/*/*/#vidgrid
// @match  http*://*chaturbate.com/*/*/?page=*
// @match  http*://*.chaturbate.com/*/*
// @match  http*://*.chaturbate.com/*?*
// @match  http*://*.chaturbate.com/*#*
// @version           1.0.1
// @exclude  http*://a2z.com/
// @connect        *
// @connect mmcdn.com
// @connect *live.mmcdn.com
// @connect cdn.jsdelivr.net
// @connect gihub.com
// @connect githubusercontent.com
// @connect *chaturbate.com
// @connect self
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_openInTab
// @grant        window.onurlchange
// @grant        GM_addValueChangeListener
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @grant        GM_webRequest
// @grant        GM_info
// @grant GM_notification
// @license        MIT
// @noframes
// @exclude    https://bam.nr-data.net
// @grant        GM.getResourceText
// @require https://cdn.jsdelivr.net/npm/video.js@8.17.2/dist/video.js#sha256-47BLtmQIbe1BQFPPySdU+3KQ83ZL89yhI93t0isYKXM=
// @require  https://gist.githubusercontent.com/angelxaces/aea33f76ce6f5707a8088ad3f715b2ee/raw/7973c5ba113bcbb86bf7efa80079a272fbbf52f0/jquery.3.7.1.js
// @resource jqueryImg https://github.com/angelxaces/VidGrid/blob/master/ui-bg_glass_60_eeeeee_1x400%5B1%5D.png
// @resource jqueryui https://gist.githubusercontent.com/angelxaces/0d654827b4c5eacb3bedef4d0a122713/raw/70864fff605fe1c1e848551dc16956f5f7bb897f/vidgridstyles.css
// @resource videojsui https://cdn.jsdelivr.net/npm/video.js@8.17.2/dist/video-js.css#sha256-drSozX5+y1j5gvWvd3iIA6HKgKJHtkRvQnyh9WZtEmU=
// @icon        https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png
// @sandbox raw
// ==/UserScript==
/* eslint-env jquery, browser, commonjs, greasemonkey, serviceworkers */
/* global videojs:writable, NREUM:writable, tsInstance: writable */
// @require https://gist.githubusercontent.com/angelxaces/638f31009079f89cf4307e05487a5dc8/raw/e87ad813f21a33e78043540cf8d30066beafb461/vidgridLibraries.js
"use strict";
$(function() {


  GM_addStyle(GM_getResourceText("videojsui"));
  GM_addStyle(GM_getResourceText("jqueryui"));


  $(".list .genders").offsetParent().remove();

  $(".list .genderm").offsetParent().remove();
  $("div.ad").remove();

  const vidgrid = {
	rooms: GM_getValue("rooms", Array()),
	stream: GM_getValue("stream", Array())
  };

  document.querySelectorAll(".follow_star").forEach((room) => room.parentElement.setAttribute("id", room.dataset.slug));

  $(".roomCard").each(function() {
	if (vidgrid.rooms.indexOf(this.id) >= 0) {
	  $(this).addClass("rlr-selected");
	}
  });
  vidgrid.lHandler2 = function(card) {
	console.log(card.querySelector(".follow_star"));
	let uname = card.lastChild.dataset.slug;
	card.setAttribute("id", uname);
	$(card + " a").on("click", function(event) {
	  event.preventDefault();
	});

	let evt = function(id) {
	  $("#" + uname).on("rmSelect", function(event, userid) {
		vidgrid.updater(uname);
	  });
	  if (vidgrid.rooms.indexOf(uname) >= 0) {
		$("#" + uname).addClass("rlr-selected");
	  }
	  $("#" + uname).click(function(event) {
		$("#" + uname).toggleClass("rlr-selected");

		$("#" + uname).trigger("rmSelect", {
		  data: uname
		});
	  });
	}

	function preSel(usr, cbck) {
	  (vidgrid.rooms.indexOf(usr) >= 0) ? $("#" + usr).addClass("rlr-selected"): false;
	  return cbck(usr);
	}
	preSel(uname, evt);

  };


  $("a").click(function() {
	vidgrid.destroy();
	$("#roomlist_root").show();
  }).not("a.vidgrid_tab, #vidgrid a");
  $("ul.sub-nav").append("<li id='vidgrid_tab' class='gender-tab'><a id='' onclick='' target='_self'>VidGrid</a></li>");
  $("#div.top-section").append("<input type='button' id='followed' value='Hide Favorites'>");

  $("#roomlist_root").after("<div id=\"vidgrid\" style=\"display:none;\"><ul id=\"grid\"></ul></div>");
  $("li.roomCard a:not(.camSubjectTagColor)").each(function() {
	if (this.dataset.room != null) {
	  $(this).attr("target", "_blank");
	}
  });

  $("a.vg-username").on("click", function() {
	let url = location.origin + "/" + this.name;

	GM_openInTab(url, {
	  active: false,
	  setParent: true,
	  incognito: false,
	  loadInBackground: true
	});
  });
  vidgrid.updater = async function(user) {
	let myPromise = new Promise(function(resolve) {
	  console.log(user.data);
	  let id = vidgrid.rooms.indexOf(user.data);
	  if (id >= 0) {
		vidgrid.dropRoster(user.data);
		console.error("Removed " + user.data);
		GM_notification({
		  text: "Was removed from selection",
		  title: user.data,
		  silent: true,
		  timeout: 5000,
		  highlight: true,
		  image: "https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png",
		  onclick: event.preventDefault()
		});
	  } else {
		vidgrid.addRoster(user.data);
		console.warn("Added " + user.data);
		GM_notification({
		  text: "Was added to selection.",
		  title: user.data,
		  silent: true,
		  timeout: 5000,
		  highlight: true,
		  image: "https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png",
		  onclick: event.preventDefault()
		});
	  }
	  resolve();
	});
	await myPromise;
  };
  vidgrid.addRoster = function(user) {
	fetch("/api/chatvideocontext/" + user).then((response) => response.json()).then((data) => {
	  vidgrid.rooms.push(data.broadcaster_username);
	  vidgrid.stream.push(data.hls_source.slice(0, data.hls_source.indexOf("?")));
	  GM_setValue("rooms", vidgrid.rooms);
	  GM_setValue("stream", vidgrid.stream);
	}).catch(console.error);
  };
  vidgrid.dropRoster = function(id) {

	if (id > -1) {
	  vidgrid.rooms.splice(id, 1);
	  vidgrid.stream.splice(id, 1);
	  GM_setValue("rooms", vidgrid.rooms);
	  GM_setValue("stream", vidgrid.stream);
	}
  };

  $("#disposeAll").on("click", function() {
	vidgrid.rooms = [];
	vidgrid.stream = [];
	GM_setValue("rooms", vidgrid.rooms);
	GM_setValue("stream", vidgrid.stream);
  });
  $.ajaxSetup({
	crossDomain: true,
	headers: {
	  "access-control-allow-credentials": true
	}
  });
  vidgrid.save = function() {
	GM_setValue("rooms", vidgrid.rooms);
	return GM_notification({
	  text: "Your model selection has been saved to VidGrid!",
	  title: "Saved",
	  silent: true,
	  timeout: 5000,
	  highlight: true,
	  onclick: () => alert("Enjoy!")
	});
  };

  vidgrid.vBox = function(x) {
	let rm = "<a href=\"\\" + vidgrid.rooms[x] + "\" class=\"vg-username\">" + vidgrid.rooms[x] + "</a>";
	let ximg = "<img class=\"close\" title=\"close\" alt=\"close\" onclick=\"vidgrid.drop(\'" + vidgrid.rooms[x] + "\')\" src=\"https://static-assets.highwebmedia.com/tsdefaultassets/floating-player-close.svg\">";
	let xvid = "<video class=\"video-js\" id=\"x" + vidgrid.rooms[x] + "\" ></video>";
	const cont = "<li id=\"li_" + vidgrid.rooms[x] + "\" class=\"ui-state-default\">" + rm + ximg + xvid + "</li>";
	$("#grid").append(cont);
  };

  vidgrid.init = function() {
	vidgrid.rooms.forEach((el) => {

	  $("#grid").append(vidgrid.vBox(vidgrid.rooms.indexOf(el)));

	});
	const options = {
	  root: document.querySelector('#vidgrid'),
	  rootMargin: '-5px',
	  threshold: 0.1
	};

	const callback = function(entries, observer) {
	  entries.forEach(function(entry) {

		$("#grid").sortable({
		  update: function(event, ui) {
			console.log(event);
			console.log(ui);

		  },
		  grid: [440, 274]
		}, "toArray");
		$("#grid").disableSelection();
		let uname = entry.target.id.slice(3);
		let plrId = "x" + uname;
		let usrId = vidgrid.rooms.indexOf(uname);

		const options = {
		  liveui: true,
		  autoplay: "muted",
		  muted: true,
		  preload: true,
		  controls: true,
		  fluid: true,
		  autosetup: false,
		  height: 275,
		  width: 440,
		  displayError: false,
		  children: ["mediaLoader", "bigPlayButton", "liveTracker", "controlBar", "resizeManager"],
		  sources: [{
			src: vidgrid.stream[usrId],
			type: "application/x-mpegURL"
		  }],
		  techOrder: ['html5']
		};
		const player = document.getElementById(plrId);
		player.addEventListener("error", (event) => {
		  console.log(event.target.error.message);
		  videojs(plrId).dispose();
		  document.getElementById(entry.target.id).remove();
		  GM_notification({
			text: uname + "\'s broadcast has ended and their room has been removed.",
			title: "Video Stream Removed",
			silent: true,
			timeout: 5000,
			highlight: true,
			image: "https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png",
			onclick: event.preventDefault()
		  });
		});

		const xPlayer = videojs(plrId, options);

		if (entry.isIntersecting) {
		  $("#li_" + uname).addClass("active");
		  $("#li_" + uname).css("visibility", "visible !important");

		  try {
			xPlayer.play();
		  } catch (error) {
			console.log(error);
			xPlayer(plrId).dispose();
			document.getElementById(entry.target.id).remove();

			GM_notification({
			  text: uname + "\'s broadcast has ended and their room has been removed.",
			  title: "Video Stream Removed",
			  silent: true,
			  timeout: 5000,
			  highlight: true,
			  image: "https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png",
			  onclick: event.preventDefault()
			});
		  }
		} else {

		  xPlayer(plrId).pause();

		  $("#li_" + uname).css("visibility", "hidden !important");
		  $("#li_" + uname).removeClass("active");
		}
	  });
	};

	const gridObserver = new IntersectionObserver(callback, options);
	const boxElList = document.querySelectorAll("#grid>li");
	boxElList.forEach((el) => {
	  gridObserver.observe(el);
	});
  };
  $("#vidgrid_tab").click(function() {

	$("#roomlist_root").toggle(function() {
	  this.style.display != "none" ? $("#vidgrid").hide(vidgrid.destroy) : $("#vidgrid").show(vidgrid.init);
	});
  });
  vidgrid.killUser = function(id) {
	vidgrid.rooms.splice(id, 1);
	vidgrid.stream.splice(id, 1);
	GM_setValue("rooms", vidgrid.rooms);
	GM_setValue("stream", vidgrid.stream);
  };
  vidgrid.drop = function(id) {
	vidgrid.dropRoster(vidgrid.rooms.indexOf(id));
	$("#li_" + id).remove();
  };
  vidgrid.destroy = function() {

	if (videojs.players !== "undefined") {
	  $.each(videojs.players, function(x, y) {
		if (y !== null) {
		  videojs(x).dispose();
		  videojs.players = {};
		}
	  });
	  $("#grid").empty();

	}
  };

  // The node you want to observe

  function getElement(nodeId) {
	return document.getElementById(nodeId);
  }

  // The node you want to observe

  const config = {
	attributes: true,
	childList: true,
	subtree: false
  };

  const callback = (mutationList, observer) => {
	GM_addStyle(".rlr-selected {box-shadow: 0px 0px 0px 5px rgb(0,255,0, 0.3) !important; background-color: rgb(0, 255, 0) !important; border-color: rgb(0, 255, 0) !important;} .follow_star {z-index: 200000; } #grid li {display:inline-table; width: 426px; height: 240px; text-align: center; overflow:hidden; visibility: hidden;} .active {visibility: visible !important;} ul#grid {height: 100%; width: 100%;} .green, .rlr-selected {box-shadow: 0px 0px 0px 5px rgb(0,255,0, 0.3) !important; background-color: rgb(0, 255, 0) !important; border-color: rgb(0, 255, 0) !important;} div#vidgrid {min-width: 483px; height: 780px; overflow: scroll;}");
	GM_addStyle(".vjs-error-display, .vjs-modal-dialog, .vjs-modal-dialog-content {display: none;} .vjs-fluid {padding-top: 0 !imoortant;} .ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default,.ui-button,html .ui-button.ui-state-disabled:hover,html .ui-button.ui-state-disabled:active{border:1px solid #ccc;background:#eee 50% 50% repeat-x;font-weight:bold;color:#3383bb}");
	vidgrid.mut = {};
	for (const mutation of mutationList) {
	  console.log(mutation);

	  if (mutation.type === 'childList') {
		if (mutation.addedNodes.length > 0) {
		  let uid = mutation.addedNodes[0].lastChild.dataset.slug;
		  mutation.addedNodes[0].setAttribute("id", uid);
		  $(mutation.addedNodes[0]).on("click", function(event) {
			event.preventDefault();
		  });

		  let evt = function(id) {
			$("#" + uid).on("rmSelect", function(event, userid) {
			  vidgrid.updater(userid);
			});
			if (vidgrid.rooms.indexOf(uid) >= 0) {
			  $("#" + uid).addClass("rlr-selected");
			}
			$("#" + uid).click(function(event) {
			  $("#" + uid).toggleClass("rlr-selected");
			  console.log([this.id, event]);
			  $("#" + uid).trigger("rmSelect", {
				data: this.id
			  });
			});
			$(".follow_star").on("click", function(event) {
			  event.stopPropagation();
			});
		  }

		  function preSel(usr, cbck) {
			vidgrid.rooms.includes(usr) ? $("#" + uid).addClass("rlr-selected") : false;
			return cbck(usr);
		  }
		  preSel(uid, evt);

		  $(mutation.target).on("click", function(event) {
			event.preventDefault();

		  });
		}
		if (mutation.type === "characterData") {
		  console.log(mutation);
		}
	  }
	};
  }
  const mutObserver = new MutationObserver(callback);

  mutObserver.observe(document.querySelector(".list"), config)
  $(".roomCard").on("rmSelect", function(event, userid) {
	vidgrid.updater(userid);
  });
  $('ul.list>li, .rlr').on("click", function(event) {
	$(this).toggleClass("rlr-selected");

	$(this).trigger("rmSelect", {
	  data: this.id
	});
  });
  $(".follow_star").on("click", function(event) {
	event.stopPropagation();
  });
  $(".ul.list>li").on("beforeUnload", function() {
	event.stopPropogation();
  });
  unsafeWindow.vidgrid = vidgrid;
  unsafeWindow.videojs = videojs;

  unsafeWindow.$ = $;
  unsafeWindow.jQuery = jQuery;
  unsafeWindow.io = vidgrid.io;

});

