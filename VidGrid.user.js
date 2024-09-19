// ==UserScript==
// @name VidGrid Development OOP
// @run-at document-start
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
// @require https://gist.githubusercontent.com/angelxaces/638f31009079f89cf4307e05487a5dc8/raw/e87ad813f21a33e78043540cf8d30066beafb461/vidgridLibraries.js
// @resource jqueryImg https://github.com/angelxaces/VidGrid/blob/master/ui-bg_glass_60_eeeeee_1x400%5B1%5D.png
// @resource jqueryui https://gist.githubusercontent.com/angelxaces/0d654827b4c5eacb3bedef4d0a122713/raw/136da74c14373c541d89bbb91634b5640a295afa/vidgridstyles.css
// @resource videojsui https://cdn.jsdelivr.net/npm/video.js@8.17.2/dist/video-js.css#sha256-drSozX5+y1j5gvWvd3iIA6HKgKJHtkRvQnyh9WZtEmU=
// @icon        https://www.spreadshirt.com/image-server/v1/designs/11624206,width=178,height=178/stripper-pole-dancer-silhouette-darr.png
// @sandbox MAIN_WORLD
// ==/UserScript==
/* eslint-env jquery */
/* global videojs:writable, NREUM:writable */
"use strict";

$(function () {
         window.hide_entrance_terms = true;
    GM_addStyle(GM_getResourceText("videojsui"));
    GM_addStyle(GM_getResourceText("jqueryui"));
    GM_addStyle("ul#grid li {display:inline-table; width: 426px; height: 240px; text-align: center; overflow:hidden; visibility: hidden;} .active {visibility: visible !important;} ul#grid {height: 100%; width: 100%;} .green, .rlr-selected {box-shadow: 0px 0px 0px 5px rgb(0,255,0, 0.3) !important; background-color: rgb(0, 255, 0) !important; border-color: rgb(0, 255, 0) !important;} div#vidgrid {min-width: 483px; height: 780px; overflow: scroll;}");
    GM_addStyle(".vjs-error-display, .vjs-modal-dialog, .vjs-modal-dialog-content {display: none;} .vjs-fluid {padding-top: 0 !imoortant;} .ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default,.ui-button,html .ui-button.ui-state-disabled:hover,html .ui-button.ui-state-disabled:active{border:1px solid #ccc;background:#eee 50% 50% repeat-x;font-weight:bold;color:#3383bb
         $(".list .genders").offsetParent().remove();
         $(".list .genderm").offsetParent().remove();
    $("div.ad").remove();
         $(".entrance_terms_overlay").remove();
    document.cookie = "agreeterms=1";
         const vidgrid = {
        rooms: GM_getValue("rooms", Array()),
        stream: GM_getValue("stream", Array())
             };
    vidgrid.minus = function (id) {
        $("#" + id).removeClass("rlr-selected");
        vidgrid.dropRoster(id);
    };
    vidgrid.plus = function (id) {
        $("#" + id).addClass("rlr-selected");
        vidgrid.addRoster(id);
    };
    $(".roomCard").each(function (i, e) {
        $(this).on("mod", { x: i, y: e }, function (event) {
                         !!vidgrid.rooms.includes(event.data.y.id) ? vidgrid.minus($(this)[0].id) : vidgrid.plus($(this)[0].id);
        });
        $(this).on("click", function () {
            $(this).trigger("mod");
            $(".follow_star").off("mod", this);
        });
    });
    $(".list").on("load", function () {
        $(".roomCard").each(function () {
            vidgrid.rooms.includes(this.id) ? $(this.id).addClass("rlr-selected") : false;
        });
    });
    document.querySelectorAll(".follow_star").forEach((room) => room.parentElement.setAttribute("id", room.dataset.slug));
    document.querySelectorAll(".roomCard").forEach((room) => !!vidgrid.rooms.includes(room.id) ? room.setAttribute("style", "box-shadow: 0px 0px 0px 5px rgb(0,255,0, 0.3) !important; background-color: rgb(0, 255, 0) !important; border-color: rgb(0, 255, 0) !important;") : false);
              vidgrid.highlightSelection = function () {
                 $("li.roomCard").each(function (x, y) {
                         y.setAttribute("onclick", "vidgrid.rmSelect(\"" + y.id + "\");");
            vidgrid.rooms.includes(y.id) ? $(y.id).addClass("rlr-selected") : false; 
        });
    };
    vidgrid.highlighter = function () {
        $(".roomCard").each(function (x, y) {
            vidgrid.rooms.includes(y.id) ? $(y.id).addClass("rlr-selected") : false;
        });
    };
    vidgrid.highlighter();
    $(".list").on("load", function () {
        vidgrid.highlightSelection();
    });
    $("a").click(function () { vidgrid.destroy(); $("#roomlist_root").show(); }).not("a.vidgrid_tab, #vidgrid a");
    $("ul.sub-nav").append("<li id='vidgrid_tab' class='gender-tab'><a id='' onclick='' target='_self'>VidGrid</a></li>");
    $("#div.top-section").append("<input type='button' id='followed' value='Hide Favorites'>");
    $("#followed").on("click", function () {
        $("div.icon_following").parent().toggle();
    });
    $("#roomlist_root").after("<div id=\"vidgrid\" style=\"display:none;\"><ul id=\"grid\"></ul></div>");
    $("li.roomCard a:not(.camSubjectTagColor)").each(function () {
        if (this.dataset.room != null) {
            $(this).attr("target", "_blank");
        }
    });
    $("a.vg-username").on("click", function () {
        let url = location.origin + "/" + this.name;
                 GM_openInTab(url, { active: false, setParent: true, incognito: false, loadInBackground: true });
    });
    vidgrid.addRoster = function (user) {
                 let url = location.origin + "/api/chatvideocontext/" + user;
        $.getJSON(url, function (jdata) {             console.log(jdata);
            let strm = jdata.hls_source;
            let usr = jdata.broadcaster_username;
            if (vidgrid.rooms.indexOf(usr) === -1) {
                vidgrid.updater(jdata);
            }
        });

    };
    vidgrid.updater = function (data) {
        let id = vidgrid.rooms.indexOf(data.broadcaster_username);
        if (id === -1) {
            vidgrid.rooms.push(data.broadcaster_username);
            vidgrid.stream.push(data.hls_source.slice(0, data.hls_source.indexOf("?")));
            GM_setValue("rooms", vidgrid.rooms);
            GM_setValue("stream", vidgrid.stream);
        } else {
            vidgrid.dropRoster(id)
        };
    };
    vidgrid.dropRoster = function (id) {          if (id > -1) {
            vidgrid.rooms.splice(id, 1);
            vidgrid.stream.splice(id, 1);
            GM_setValue("rooms", vidgrid.rooms);
            GM_setValue("stream", vidgrid.stream);
        
    };
    vidgrid.rmSelect = function (name) {
                 !!vidgrid.rooms.includes(name) ? vidgrid.dropRoster(name) : vidgrid.addRoster(name);  
    };
    $("li.roomCard *:not(.follow_star)").on("click", "li.roomCard", function (event) {
                 vidgrid.rmSelect(event.currentTarget.id);
                 $("#" + event.currentTarget).toggleClass("rlr-selected");
    });
    $("ul.list").on("load", function () {
        vidgrid.highlightSelection();
    });
         $("#disposeAll").on("click", function () {
        vidgrid.rooms = [];
        vidgrid.stream = [];
        GM_setValue("rooms", vidgrid.rooms);
        GM_setValue("stream", vidgrid.stream);
    });
    $.ajaxSetup({
        crossDomain: true,
        headers: {
            "access-control-allow-credentials": true,
                                                                                                                     
        }
    });
    vidgrid.xhr = function (user) {
        let url = location.origin + "/api/chatvideocontext/" + user;
        let xhrUsr = new NREUM.o.XHR();
        xhrUsr.withCredentials = true;
        xhrUsr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.table("onreadystatechange product: " + JSON.parse([this.responseText]));
                let obj = Object(this.response);
                return JSON.parse(obj);
            }
        };
                 xhrUsr.open("GET", url);
        xhrUsr.send();
                 return JSON.parse(xhrUsr.response);
    }
    vidgrid.save = function () {
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
    vidgrid.vBox = function (x) {
                 let rm = "<a href=\"\\" + vidgrid.rooms[x] + "\" class=\"vg-username\">" + vidgrid.rooms[x] + "</a>";
        let ximg = "<img class=\"close\" title=\"close\" alt=\"close\" onclick=\"\" src=\"https:         let xvid = "<video class=\"video-js\" id=\"x" + vidgrid.rooms[x] + "\" ></video>";
                  
        const cont = "<li id=\"li_" + vidgrid.rooms[x] + "\" class=\"ui-state-default\">" +
            rm +
            ximg +
            xvid +
            "</li>";
        $("#grid").append(cont);
    };
    vidgrid.init = function () {
        vidgrid.rooms.forEach((el) => {
                         $("#grid").append(vidgrid.vBox(vidgrid.rooms.indexOf(el)));
        });
        const options = {
            root: document.querySelector('#vidgrid'),
            rootMargin: '-5px',
            threshold: 0.1
        }
        const callback = function (entries, observer) {
            entries.forEach(function (entry) {
                let uname = entry.target.id.slice(3);
                let plrId = "x" + uname;
                let usrId = vidgrid.rooms.indexOf(uname)
                let xPlayer = videojs(plrId, {
                    liveui: true,
                    autoplay: "muted",
                    muted: true,
                    preload: true,
                    controls: true,
                    fluid: true,
                    autosetup: false,
                    height: 275,
                    width: 300,
                    displayError: false,
                    children: ["mediaLoader", "bigPlayButton", "liveTracker", "controlBar", "resizeManager"],
                    sources: [{
                        src: vidgrid.stream[usrId],
                        type: "application/x-mpegURL"
                    }],
                    techOrder: ['html5']
                });
                xPlayer.on('error', () => {
                    const error = xPlayer.error();
                    videojs(plrId).dispose();
                    vidgrid.killUser(usrId);
                });
                if (entry.isIntersecting) {
                    $("#li_" + uname).addClass("active");
                    $("#li_" + uname).css("visibility", "visible !important");
                    xPlayer.play();
                } else {
                    xPlayer.pause();
                    $("#li_" + uname).css("visibility", "hidden !important");
                    $("#li_" + uname).removeClass("active");
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        const boxElList = document.querySelectorAll("#grid>li");
        boxElList.forEach((el) => {
            observer.observe(el);
        });

    };
    $("#vidgrid_tab").click(function () {
        $("#roomlist_root").toggle(function () {
            this.style.display != "none" ? $("#vidgrid").hide(vidgrid.destroy) : $("#vidgrid").show(vidgrid.init);
        });
    });
    vidgrid.killUser = function (id) {
        vidgrid.rooms.splice(id, 1);
        vidgrid.stream.splice(id, 1);
        GM_setValue("rooms", vidgrid.rooms);
        GM_setValue("stream", vidgrid.stream);
    };
    vidgrid.delete = function (element) {
        vidgrid.killUser(vidgrid.rooms.indexOf(element.id.slice(3)));
        $(element.id.slice(3)).remove();
    };
    vidgrid.destroy = function () {
        if (videojs.players !== "undefined") {
            $.each(videojs.players, function (x, y) {
                if (y !== null) {
                    videojs(y).dispose();
                }
            });
            $("#grid").empty();
        };
    };
    vidgrid.mutationWatch = function () {
        let observer = new MutationObserver((mutationRecords) => {
        });
        const targetNode = document.querySelector(".list");

        const config = { childList: true, subtree: true };
        const callback = function (mutationList, observer) {

            for (const mutation of mutationList) {

                if (mutation.type === "subtree") {
                    vidgrid.highlightSelection();
                };
            }
        };

        observer.observe(targetNode, config);
    };
    window.onload = function () {
        vidgrid.mutationWatch();
    };
    unsafeWindow.vidgrid = vidgrid;
    unsafeWindow.videojs = videojs;
    unsafeWindow.$ = $;
    unsafeWindow.jQuery = jQuery;
    unsafeWindow.io = vidgrid.io;
});
// Produced by Mr. Jangles https://github.com/X3Cams/VidGrid
