// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      3.1.5
// @description  恢复原生的旧版页面，包括主页和播放页。
// @author       MotooriKashin
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @connect      bilibili.com
// @connect      biliplus.com
// @connect      jijidown.com
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

(function() {
    'use strict';

    let ml, pl, ts, aid, cid, def, mid, oid, src, tid, uid, url, mode, type, timer;
    let arr = [],avs = [], ids = [],obj = {};
    let TITLE, DOCUMENT, __INITIAL_STATE__;
    let LOCATION = document.location.href.split('/');

    TITLE = document.getElementsByTagName("title");
    if (TITLE[0]) TITLE = TITLE[0].innerText;

    const API = {
        pageframe: { // 网页框架
            watchlater: '<!DOCTYPE html><html><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="spm_prefix" content="333.342"/><link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="viewlater-app"><app></app></div><div class="footer bili-footer"></div><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"></script></body></html>',
            playlist: '<!DOCTYPE html><html><head><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=333.44><link rel=stylesheet href=//static.hdslb.com/phoenix/dist/css/comment.min.css type=text/css><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=0><link href=//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css rel=stylesheet><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div id=playlist-video-app></div><div class="footer bili-footer report-wrap-module"></div><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js></script><script type=text/javascript src=//static.hdslb.com/js/jquery.qrcode.min.js></script><script type=text/javascript charset=utf-8 src=//static.hdslb.com/common/js/footer.js></script><script type=text/javascript src=//static.hdslb.com/js/swfobject.js></script><script type=text/javascript src=//static.hdslb.com/js/video.min.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/moxie.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/plupload.js></script><script type=text/javascript src=//static.hdslb.com/phoenix/dist/js/comment.min.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script></body></html>',
            bangumi: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            cinema: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/bangumi/play/js/promise.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/manifest.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/vendor.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/bangumi-play.3b709027.js" crossorigin defer></script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            video: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}} .video-info-m .number .like b, .video-info-m .number .like i {background: url(//static.hdslb.com/images/base/icons.png);}</style></head><body><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script> <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true"></div><div class="player-fix abs" id="bofqi" style="visibility:hidden;"><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script></div><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>',
            home: '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>'
        },
        style: { // 样式表
            playshadow: "#bilibiliPlayer, #bofqi.mini-player {box-shadow: 0px 2px 8px 0px rgba(0,160,216,0.3) !important;}",
            jointime: ".user .info .meta .row {height: 88px;white-space: normal;}.user .info .jointime .icon {background-position: -209px -84px;}.user .info .jointime .text {color: #00a1d6;}}",
            online: ".online a {color: rgb(109, 117, 122);}.popularize-module .online em {display: inline-block;height: 10px;line-height: 10px;vertical-align: top;border-left: 1px solid rgb(184, 192, 204);margin: 12px 15px 0px;}",
            search: ".search-wrap .search-block .input-wrap input {font: 400 13.3333px Arial !important;}",
            uiface: "#ui-face {box-sizing: content-box;color: #fff;background-color: rgb(255,255,255);border-radius:5px;position: fixed;padding: 4px;bottom: 65px;width: 56px;height: 40px;transition: right 0.7s;-moz-transition: right 0.7s;-webkit-transition: right 0.7s;-o-transition: right 0.7s;z-index: 1008;}#ui-face i {background-position: -471px -982px;display: block;width: 20px;height: 20px;margin: auto;transition: 0.2s;background-image: url(//static.hdslb.com/images/base/icons.png);}#ui-face span {font-size: 14px;display: block;width: 50%;margin: auto;transition: 0.2s;color: rgb(0,0,0)}#ui-table {box-sizing: content-box;color: #fff;background-color: rgb(255,255,255);border-radius:5px;position: fixed;padding: 4px;bottom: 30px;right: 58px;width: 200px;height: 360px;box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);overflow-y: scroll;z-index: 10008;}.checke{float: right;position: relative;-webkit-appearance: none;width: 40px;height: 20px;line-height: 20px;background: #eee;border-radius: 10px;outline: none;border: 2px solid #999999;}.checke:before{position: absolute;left: 0;content: '';width: 12px;height: 12px;border-radius: 50%;background: #eee;box-shadow: 0px 0px 5px #ddd;transition: all 0.2s linear;border: 2px solid #999999;}.checke:checked{   background: #01a1d6;}.checke:checked:before{left: 20px;transition: all 0.2s linear;}#ui-state {border-radius: 5px;z-index: 1000;width: auto;position: fixed;right: 280px;color: #fff;background: #0008;padding: 1rem;font-size: 12pt;top: 50%;transform: translateY(-50%);transition: .2s ease-out .8s;max-width: 20%;line-height: 2;white-space: pre-wrap;pointer-events: none;opacity: 1;}.video_download {cursor: pointer;width: 46px;height: 48px;background-color: #f6f9fa;background-position: -1353px -1095px;background-repeat: no-repeat;border: 1px solid #e5e9ef;overflow: hidden;border-radius: 4px;display: inline-block;background-image: url(//static.hdslb.com/images/base/icons.png);}.video_download:hover {background-color: #00a1d6;border-color: #00a1d6;}",
            bofqi: "#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}",
            gray: "html {filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkit-filter:grayscale(1);}",
            like: ".video-info-module .number .like b, .video-info-module .number .like i {background: url(//static.hdslb.com/images/base/icons.png);display: inline-block;margin-top: -3px;vertical-align: middle;}"
        },
        playerframe : { // 播放器框架
            html5player: "https://www.bilibili.com/blackboard/html5player.html", // aid, cid, season_type player_type + &as_wide=1&urlparam=module%253Dbangumi&crossDomain=true
            playlist: "https://www.bilibili.com/blackboard/playlist-player.html", // pl || aid,cid
            ancient: "https://www.bilibili.com/blackboard/activity-ancient-player.html", // aid,cid
            player: "https://player.bilibili.com/player.html", // aid,cid &| page
            html: "https://www.bilibili.com/html/player.html" // aid + wmode=transparent
        },
        url: { // URL
            spacedetial: "https://api.bilibili.com/medialist/gateway/base/spaceDetail", // media_id, pn + &ps=20&keyword=&order=mtime&type=0&tid=0
            channel: "https://api.bilibili.com/x/space/channel/video", // mid, cid, pn + &ps=30&order=0
            biliplus: "https://www.biliplus.com/video/av",
            jijidown: "https://www.jijidown.com/video/av",
            online: "https://api.bilibili.com/x/web-interface/online",
            stat: "https://api.bilibili.com/x/web-interface/archive/stat", // aid
            replymain: "https://api.bilibili.com/x/v2/reply/main", // oid, type, mode &| next
            reply: "https://api.bilibili.com/x/v2/reply", // type,sort,oid,pn
            replycursor: "https://api.bilibili.com/x/v2/reply/reply/cursor", // oid, root, type &| sort
            membercard: "https://account.bilibili.com/api/member/getCardByMid", // mid
            season: "https://bangumi.bilibili.com/view/web_api/season", // season_id || ep_id
            pagelist: "https://api.bilibili.com/x/player/pagelist", // aid
            view: "https://api.bilibili.com/x/web-interface/view", // aid || bvid
            haslike: "https://api.bilibili.com/x/web-interface/archive/has/like", // aid
            like: "https://api.bilibili.com/x/web-interface/archive/like",
            ids4Player: "https://api.bilibili.com/x/v1/medialist/resource/ids4Player", // media_id
            cards: "https://api.bilibili.com/x/article/cards", // ids
            medialist: "https://api.bilibili.com/x/v1/medialist/detail", // media_id && pn=1&ps=1
            x: "https://api.bilibili.com/x/player/playurl", // avid | bvid, cid, qn + fourk=1&type=&otype=json |+ &fnver=0&fnval=16
            pgc: "https://api.bilibili.com/pgc/player/web/playurl", // avid | bvid, cid, qn + fourk=1&type=&otype=json |+ &fnver=0&fnval=16
            sign: "https://interface.bilibili.com/v2/playurl", // appkey, cid=, otype=json, qn, quality, type
            proj: "https://app.bilibili.com/v2/playurlproj" // appkey, cid=, otype=json, qn
        },
        sort: { // 分区对照表
            202: [202,"资讯", "https://www.bilibili.com/v/information/"],
            203: [202,"热点", "https://www.bilibili.com/v/information/hotspot/"],
            204: [202,"环球", "https://www.bilibili.com/v/information/global/"],
            205: [202,"社会", "https://www.bilibili.com/v/information/social/"],
            206: [202,"综合", "https://www.bilibili.com/v/information/multiple/"]
        },
        message: { // 播放器通知
            0: ['https://www.bilibili.com/blackboard/activity-4KPC.html', '解锁超清4K画质'],
            1: ['https://www.bilibili.com/blackboard/activity-4K120FPS-PC.html', '4K120FPS投稿全量开放'],
            2: ['https://www.bilibili.com/blackboard/bilibili2009.html', '十年前的B站长啥样'],
            3: ['https://www.bilibili.com/blackboard/html5playerhelp.html', 'HTML5播放器'],
            4: ['https://app.bilibili.com/?from=bfq', '客户端下载'],
            5: ['http://link.acg.tv/forum.php', 'bug反馈传送门']
        },
        xhrhook: { // xhr hook
            reclist: ['api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web'],
            recmore: ['api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web'],
            heartbeat: ['api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat']
        }
    }
    const debug = {
        log: (msg) => console.log("[" + deliver.timeFormat(new Date()) + "]",msg),
        error: (msg) => console.error("[" + deliver.timeFormat(new Date()) + "]",msg),
        warn: (msg) => console.warn("[" + deliver.timeFormat(new Date()) + "]",msg),
        debug: (msg) => console.debug("[" + deliver.timeFormat(new Date()) + "]",msg),
        msg: (msg, warn, delay) => {
            let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
            if (!node) {debug.log(msg);return;}
            let item = document.createElement("div");
            let text = document.createElement("div");
            let span = document.createElement("span");
            let red = document.createElement("span");
            delay = delay ? delay : 3000;
            item.setAttribute("class","bilibili-player-video-toast-item bilibili-player-video-toast-msg");
            text.setAttribute("class","bilibili-player-video-toast-item-text");
            span.setAttribute("class","video-float-hint-text");
            red.setAttribute("class","video-float-hint-btn hint-red");
            span.innerText = msg;
            red.innerText = warn ? warn : "";
            text.appendChild(span);
            if (warn) text.appendChild(red);
            item.appendChild(text);
            node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
            setTimeout(() => item.remove(), delay);
        }
    }
    const xhr = {
        'false': (url) => { // 同步
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = true;
            xhr.send(null);
            if (xhr.status === 200) return xhr.responseText;
        },
        'true': (url) => { // 异步
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response)
                    else reject({status: xhr.status, statusText: xhr.statusText})
                };
                xhr.onerror = () => reject({status: xhr.status, statusText: xhr.statusText})
                xhr.send();
            });
        },
        GM: (url) => { // 跨域
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method : 'GET',
                    url    : url,
                    onload : (response) => resolve(response.responseText),
                    onerror : (status) => reject(status)
                });
            })
        },
        post: (url, header, data) => { // 表单
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('post', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response)
                    else reject({status: xhr.status,statusText: xhr.statusText})
                };
                xhr.onerror = () => reject({status: xhr.status, statusText: xhr.statusText})
                xhr.send(data);
            });
        }
    }
    const config = {
        rewrite: {
            av: 1,
            bangumi: 1,
            watchlater: 1,
            frame: 1,
            home: 1,
            playlist: 1,
            medialist: 1,
        },
        reset: {
            grobalboard: 1,
            replyfloor: 1,
            headblur: 0,
            preview: 1,
            livelogo: 1,
            searchwrap: 1,
            jointime: 1,
            lostvideo: 1,
            bvid2av: 1,
            selectdanmu: 0,
            episodedata: 1,
            like: 1,
            static: 1,
            download: 0,
            idm: 0,
            heartbeat: 0,
            carousel: 0
        }
    }
    const INITIAL_STATE = {
        bangumi: (data,epId) => { // bangumi
            try {
                let ep = 0,dat = {};
                let rp = JSON.parse(data).result;
                let ini = JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/;\(function/,""));
                let pug = JSON.parse(DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/,"").replace(/<\/script>/,""));
                if (rp.bkg_cover) {dat = {"ver":{"mobile":false,"ios":false,"android":false,"windowsPhone":false,"iPhone":false,"ios9":false,"iPad":false,"webApp":false,"microMessenger":false,"weibo":false,"uc":false,"qq":false,"baidu":false,"mqq":false,"mBaidu":false,"iqiyi":false,"qqLive":false,"safari":true,"youku":false,"ie":false,"edge":false,"bili":false,"biliVer":0},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":true,"area":0,"app":false,"mediaRating":{},"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false};} else {dat = {"ver":{},"loginInfo":{},"canReview":false, "userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":false,"area":0,"app":false,"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false,"epStat":{},"ssStat":{}};}
                if (epId) {dat.epId = 1 * epId;ep = 1;}else {dat.epId = "";if (pug.hasOwnProperty("progress")) {dat.epId = pug.progress.last_ep_id;ep = 1;}}
                dat.ssId = rp.season_id;
                dat.mdId = 1 * rp.link.match(/[0-9][0-9]*/)[0];
                dat.mediaInfo = {};
                dat.mediaInfo.actors = rp.actors;
                dat.mediaInfo.alias = rp.alias;
                dat.mediaInfo.areas = rp.areas;
                dat.mediaInfo.bkg_cover = rp.bkg_cover;
                dat.mediaInfo.cover = rp.cover;
                dat.mediaInfo.evaluate = rp.evaluate;
                dat.mediaInfo.is_paster_ads = rp.is_paster_ads;
                dat.mediaInfo.jp_title = rp.jp_title;
                dat.mediaInfo.link = rp.link;
                dat.mediaInfo.media_id = rp.media_id;
                dat.mediaInfo.mode = rp.mode;
                dat.mediaInfo.season_id = rp.season_id;
                dat.mediaInfo.season_status = rp.season_status;
                dat.mediaInfo.season_title = rp.season_title;
                dat.mediaInfo.season_type = rp.season_type;
                dat.mediaInfo.square_cover = rp.square_cover;
                dat.mediaInfo.staff = rp.staff;
                dat.mediaInfo.stat = rp.state;
                dat.mediaInfo.style = rp.style;
                dat.mediaInfo.title = rp.title;
                dat.mediaInfo.total_ep = rp.total_ep;
                dat.mediaRating = rp.rating;
                dat.epList = rp.episodes;
                if (dat.epList[0].cid === -1) for (let i=0;i<ini.epList.length;i++) dat.epList[i].cid = ini.epList[i].cid;
                if (ep==0) dat.epId=dat.epList[0].ep_id;
                for (let i=0;i<dat.epList.length;i++) if(dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                dat.newestEp = rp.newest_ep;
                dat.seasonList = rp.seasons;
                if (!dat.seasonList) dat.seasonList = ini.sections;
                dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
                dat.userStat = {"loaded":true,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};
                dat.userStat.watchProgress = pug.progress;
                dat.userStat.vipInfo = pug.vip_info;
                dat.upInfo = rp.up_info;
                dat.rightsInfo = rp.rights;
                dat.pubInfo = rp.publish;
                if (pug.dialog || pug.pay == 1) {
                    dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};
                    if (pug.dialog) {
                        dat.payMent.vip_promotion = pug.dialog.title;
                        if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                    }
                }
                return dat;
            } catch(e) {debug.error(e)}
        },
        home: (data) => { // 主页
            try {
                let dat = {};
                let ini = JSON.parse(data);
                dat.recommendData = [];
                for (let i=0;i<ini.recommendList.length;i++) {
                    dat.recommendData[i] = {};
                    dat.recommendData[i].aid = ini.recommendList[i].aid;
                    dat.recommendData[i].typename = ini.recommendList[i].tname;
                    dat.recommendData[i].title = ini.recommendList[i].title;
                    dat.recommendData[i].subtitle = "";
                    dat.recommendData[i].play = ini.recommendList[i].stat.view;
                    dat.recommendData[i].review = ini.recommendList[i].stat.reply;
                    dat.recommendData[i].video_review = "";
                    dat.recommendData[i].favorites = ini.recommendList[i].stat.favorite;
                    dat.recommendData[i].mid = ini.recommendList[i].owner.mid;
                    dat.recommendData[i].author = ini.recommendList[i].owner.name;
                    dat.recommendData[i].create = ini.recommendList[i].pubdate;
                    dat.recommendData[i].pic = ini.recommendList[i].pic;
                    dat.recommendData[i].coins = ini.recommendList[i].stat.coin;
                    dat.recommendData[i].duration = ini.recommendList[i].duration;
                    dat.recommendData[i].badgepay = false;
                    dat.recommendData[i].rights = ini.recommendList[i].rights;
                }
                dat.locsData = ini.locsData;
                dat.locsData[23] = ini.locsData[3197];
                if (dat.locsData[31][0] && dat.locsData[31][0].id == 0) dat.locsData[31] = [{"id":36585,"contract_id":"","pos_num":1,"name":"小黑屋弹幕举报","pic":"https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg","litpic":"","url":"https://www.bilibili.com/blackboard/activity-dmjbfj.html","style":0,"agency":"","label":"","intro":"","creative_type":0,"request_id":"1546354354629q172a23a61a62q626","src_id":32,"area":0,"is_ad_loc":true,"ad_cb":"","title":"","server_type":0,"cm_mark":0,"stime":1520478000,"mid":"14629218"}];
                return dat;
            } catch(e) {debug.error(e);}
        }
    }
    const deliver = {
        md5: (str) => { // string => md5
            let md5_RotateLeft = (lValue, iShiftBits) => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            let md5_AddUnsigned = (lX, lY) => {
                let lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                } else return (lResult ^ lX8 ^ lY8);
            }
            let md5_F = (x, y, z) => (x & y) | ((~x) & z);
            let md5_G = (x, y, z) => (x & z) | (y & (~z));
            let md5_H = (x, y, z) => (x ^ y ^ z);
            let md5_I = (x, y, z) => (y ^ (x | (~z)));
            let md5_FF = (a, b, c, d, x, s, ac) => {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            let md5_GG = (a, b, c, d, x, s, ac) => {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            let md5_HH = (a, b, c, d, x, s, ac) => {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            let md5_II = (a, b, c, d, x, s, ac) => {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            let md5_ConvertToWordArray = (string) => {
                let lWordCount;
                let lMessageLength = string.length;
                let lNumberOfWords_temp1 = lMessageLength + 8;
                let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                let lWordArray = Array(lNumberOfWords - 1);
                let lBytePosition = 0;
                let lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };
            let md5_WordToHex = (lValue) => {
                let WordToHexValue = "",
                    WordToHexValue_temp = "",
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            };
            let md5_Utf8Encode = (string) => {
                string = string.replace(/\r\n/g, "\n");
                let utftext = "";
                for (let n = 0; n < string.length; n++) {
                    let c = string.charCodeAt(n);
                    if (c < 128) utftext += String.fromCharCode(c);
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };
            let x = Array();
            let k, AA, BB, CC, DD, a, b, c, d;
            let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            let S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            str = md5_Utf8Encode(str);
            x = md5_ConvertToWordArray(str);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = md5_AddUnsigned(a, AA);
                b = md5_AddUnsigned(b, BB);
                c = md5_AddUnsigned(c, CC);
                d = md5_AddUnsigned(d, DD);
            }
            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
        },
        timeFormat : (time,type) => { // 格式化时间戳
            let date = new Date(time);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return type?Y+M+D+h+m+s:h+m+s; // 默认返回hh：mm：ss；type存在加上yy：mm：dd
        },
        convertId: (str) => { // bv <=> av
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {}, s = [11,10,3,8,4,6], xor = 177451812, add = 8728348608;
            for (let i = 0;i < 58;i++) tr[table[i]] = i;
            if (!(1 * str)) { // str为字符串(BVxxxxxxxxx)则转化为aid(纯数字)
                let r = 0;
                for (let i = 0;i < 6;i++) r += tr[str[s[i]]]*58**i;
                return (r-add)^xor;
            }
            else { // str为数字(aid)则转化为BV(BVxxxxxxxxx)
                str = (str^xor) + add;
                let r = ['B','V',1,'','',4,'',1,'',7,'',''];
                for (let i = 0;i < 6;i++) r[s[i]] = table[parseInt(str/58**i)%58];
                return r.join("");
            }
        },
        sign: () => { // key secret
            let table = 'rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg', str = '';
            for (let i = table.length -1; i >= 0; i--) str = str + String.fromCharCode(table[i].charCodeAt() + 2);
            return str.split(':')
        },
        obj2search: (url, obj) => { // url search
            if (obj) {
                let arr = [],i = 0;
                for (let key in obj) {
                    if(obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== null) {
                        arr[i] = key + "=" + obj[key];
                        i++;
                    }
                }
                if (url) url = url + "?" + arr.join("&"); // 将参数对象拼接成链接
                else url = arr.join("&");
            }
            return url;
        },
        getCookies: () => { // cookies对象
            let cookies = document.cookie.split('; ');
            let obj = cookies.reduce((pre, next) => {
                let key = next.split('=')[0];
                let val = next.split('=')[1];
                pre[key] = val;
                return pre;
            },{});
            return obj; // 返回值通过对象属性方式调用
        },
        setGlobalStyle: () => { // 添加样式
            let csss = API.style.uiface;
            let style = document.createElement("style");
            csss = csss + API.style.online;
            if (config.reset.playershadow) csss = csss + API.style.playshadow;
            if (config.reset.searchwrap) csss = csss + API.style.search;
            if (config.reset.like) csss = csss + API.style.like;
            style.setAttribute("type","text/css");
            document.head.appendChild(style);
            style.appendChild(document.createTextNode(csss));
        },
        write : (html) => { // 重写网页
            document.open();
            document.write(html);
            document.close();
        },
        intercept: { // xhr hook
            init: () => {
                const open = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function (method, url, ...rest) { // original xhr hook
                    if (url.includes(API.xhrhook.heartbeat[0]) && config.reset.heartbeat) url = url.replace(API.xhrhook.heartbeat[0], API.xhrhook.heartbeat[1]); // 替换视频心跳
                    if (url.includes(API.xhrhook.reclist[0])) url = deliver.intercept.response(this, url, API.xhrhook.reclist); // 修改正在直播
                    if (url.includes(API.xhrhook.recmore[0])) url = deliver.intercept.response(this, url, API.xhrhook.recmore); // 修改直播动态
                    if (url.includes("/x/player/playurl?") && !url.includes("fourk")) url = url.replace("playurl?", "playurl?fourk=1&"); // 添加4k视频参数
                    if (url.includes("/pgc/player/web/playurl?") && !url.includes("fourk")) url = url.replace("playurl?", "playurl?fourk=1&"); // 添加4k番剧参数
                    return open.call(this, method, url, ...rest);
                }
                function jsonp(){ // jsonp hook
                    const ajax = unsafeWindow.$.ajax;
                    unsafeWindow.$.ajax = function (obj, ...rest) {
                        if (obj) {
                            if (obj.dataType == "jsonp") {
                                if (obj.url.includes("region") && obj.data.rid == 165) {
                                    obj.data.rid = 202; // 替换广告区rid为资讯区rid
                                }
                            }
                        }
                        return ajax.call(this, obj, ...rest);
                    }
                }
                if (unsafeWindow.$) jsonp(); // jsonp非原生调用，先判断jQuery是否载入，以免报错
                else {
                    let timer = setInterval(() => {
                        if (unsafeWindow.$) {
                            clearInterval(timer);
                            jsonp();
                        }
                    },10); // 为不错过任何jsonp，轮循间隔设得有点小
                    setTimeout(() => clearInterval(timer), 5000); // 网页可能不引入jQuery，延时取消轮循
                }
            },
            response: (obj,url,index) => { // 修改xhr response
                function replaceResponse(){ // 目前只有一个地方涉及修改xhr返回值，所以暂未进行区分
                    var response = event.target.responseText.replace(/preview_banner_list/,"preview").replace(/ranking_list/,"ranking").replace(/recommend_room_list/,"recommend");
                    response = JSON.parse(response);
                    response.data.text_link = {text: "233秒居然能做这些！", link: "//vc.bilibili.com"};
                    if (response.data.recommend) {
                        for (let i = 0; i < response.data.recommend.length; i++) {
                            response.data.recommend[i].pic = response.data.recommend[i].cover;
                            response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                        }
                    }
                    if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
                    Object.defineProperty(obj, 'response', {writable: true});
                    Object.defineProperty(obj, 'responseText', {writable: true});
                    obj.response =obj.responseText = JSON.stringify(response);
                }
                obj.addEventListener('readystatechange', function () {if ( obj.readyState === 4 ) {replaceResponse()}});
                obj.addEventListener('load', function () {replaceResponse()});
                return url.replace(index[0],index[1]);
            }
        },
        reSction: () => { // 重写版面
            if (!config.reset.grobalboard) return;
            document.getElementById("internationalHeader").setAttribute("style","visibility:hidden;");
            let newh = document.createElement("div");
            let script = document.createElement("script");
            let foot = document.getElementsByClassName("international-footer");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            if(document.getElementsByClassName("mini-type")[0]) newh.setAttribute("class","z-top-container");
            else newh.setAttribute("class","z-top-container has-menu");
            document.body.insertBefore(newh,document.body.firstChild);
            document.body.insertBefore(script,document.body.firstChild);
            if (foot[0]) {
                let div = document.createElement("div");
                div.setAttribute("class","footer bili-footer report-wrap-module");
                div.setAttribute("id","home_footer");
                foot[0].replaceWith(div);
                let script = document.createElement("script");
                script.setAttribute("type","text/javascript");
                script.setAttribute("src","//static.hdslb.com/common/js/footer.js");
                document.body.appendChild(script);
            }
            window.setTimeout(() => {deliver.removeBlur()},3000);
        },
        videoMessage: (ul) => { // 播放信息
            if (!config.reset.carousel) return;
            let message = '', i = 0, className = "slide";
            for (let key in API.message) {
                switch(i) { // 默认展示第二条，原api已失效所有信息本地生成
                    case 0: className = "slide prev"; break;
                    case 1: className = "slide current"; break;
                    case 2: className = "slide next"; break;
                    default: className = "slide";
                }
                i++;
                message = message + '<li class="' + className + '" title="" name="message_line" posnum="' + key +
                    '" resourceid="" srcid="" sid=""><a href="' + API.message[key][0] +
                    '" target="_blank" name="message_line"><font color="#ffffff">' + API.message[key][1] + '</font></a></li>';
            }
            setTimeout(() => {ul.innerHTML = message},100);
        },
        download: {
            init : (title) => {
                let fixnav_report = document.getElementById("fixnav_report");
                let a = document.createElement("a");
                fixnav_report = fixnav_report ? fixnav_report : document.getElementsByClassName("bangumi-nav-right")[0];
                fixnav_report = fixnav_report ? fixnav_report : document.getElementsByClassName("fixed-nav-m")[0];
                fixnav_report = fixnav_report ? fixnav_report : document.getElementsByClassName("nav-menu")[0];
                fixnav_report = fixnav_report ? fixnav_report : document.getElementsByClassName("nav-tools")[0];
                if (!fixnav_report) return;
                let div = document.createElement("div");
                div.setAttribute("class","video_download icon");
                div.setAttribute("title","下载视频");
                let append = () => document.getElementsByClassName("video_download")[0] ? document.getElementsByClassName("video_download")[0].replaceWith(div) : fixnav_report.insertBefore(div,fixnav_report.firstChild);
                div.onclick = async () => {
                    document.body.appendChild(a);
                    url = url ? url : await deliver.download.geturl();
                    if (!url) {debug.msg("拉取下载链接失败 ಥ_ಥ");url = true;return;}
                    if (url === true) {debug.msg("本视频无法获取下载链接", "请勿反复调戏！"); return;}
                    navigator.clipboard.writeText(url);
                    debug.msg("已复制视频下载链接到剪切板");
                    if (!config.reset.idm) return;
                    a.setAttribute("href",url);
                    a.setAttribute("hidden","hidden");
                    a.setAttribute("download",title ? title + ".mp4" : url);
                    a.click();
                    a.remove();
                }
                if (document.getElementsByClassName("float-nav")[0]) {
                    let timer = setInterval(() => {
                        if (document.getElementsByClassName("float-nav")[0].getAttribute("style") == "display:none;") return;
                        clearInterval(timer);
                        append();
                    },1000);
                }
                else {
                    if (fixnav_report.getAttribute("style") == "display:none;") {
                        let timer = setInterval(() => {
                            if (fixnav_report.getAttribute("style") == "display: none;") return;
                            clearInterval(timer);
                            append();
                        },1000);
                    }
                    else append()
                }
            },
            geturl: async () => { // 拉取视频链接
                let url = deliver.download.playurl();
                let data = await xhr.true(url);
                data = JSON.parse(data);
                return data.durl ? data.durl[0].url : "";
            },
            playurl: (aid, cid, qn, type, sor) => { // 配置视频链接
                let obj = {}
                let sign = deliver.sign();
                aid = aid ? aid : unsafeWindow.aid;
                cid = cid ? cid : unsafeWindow.cid;
                qn = qn ? qn : 120;
                type = type ? type : "mp4";
                sor = sor ? sor : "";
                switch(type){
                    case 'dash' : if (sor) return deliver.obj2search(API.url.pgc, {avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 16});
                        else return deliver.obj2search(API.url.x, {avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 16});
                        break;
                    case 'flv' : if (sor) return deliver.obj2search(API.url.pgc, {avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json'});
                        else return deliver.obj2search(API.url.x, {avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json'});
                        break;
                    case 'off' : obj = {appkey: sign[0], cid: cid, otype: 'json', qn: qn, quality: qn, type: ''}
                        obj.sign = deliver.md5(deliver.obj2search("", obj) + sign[1]);
                        return deliver.obj2search(API.url.sign, obj);
                        break;
                    case 'mp4' : obj = {appkey: sign[0], cid: cid, otype: 'json', qn: 208}
                        obj.sign = deliver.md5(deliver.obj2search("", obj) + sign[1]);
                        return deliver.obj2search(API.url.proj, obj);
                        break;
                }
            },
        },
        switchVideo: () => { // 切p相关
            let title = document.getElementsByTagName("h1")[0] ? document.getElementsByTagName("h1")[0].title : "";
            if (config.reset.download) deliver.download.init(title);
            if (!config.reset.selectdanmu) return;
            let danmu = document.getElementsByClassName("bilibili-player-filter-btn")[1];
            if (danmu) danmu.click();
        },
        removePreview: (node) => { // 付费预览
            if (!config.reset.preview) return;
            let hint = document.getElementsByClassName("video-float-hint-btn")[0];
            let i = 10; // 倒计时长度，单位：秒
            let sec = document.createElement("span");
            sec.setAttribute("class","video-float-hint-btn second-cut");
            hint.parentNode.appendChild(sec);
            function cut(){
                sec.innerText = i - 1 + "s";
                if (i==0) {
                    node.remove();
                    return;
                }
                i = i - 1;
                window.setTimeout(cut,1000);
            }
            new cut();
        },
        avdesc : () => { // 超链接转化
            if (!config.rewrite.video || !aid) return;
            let desc = document.getElementsByClassName("info");
            if (LOCATION[3] != 'video') return;
            if (desc[1] && desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                for (let i=0;i<paster.length;i++){
                    let newer = "av" + deliver.convertId(paster[i]);
                    newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                    desc[1].innerHTML = desc[1].outerHTML.replace(paster[i],newer);
                }
            }
        },
        removeBlur: () => { // 顶栏透明
            if (!config.reset.headblur) return;
            let blur = document.getElementsByClassName("blur-bg");
            if (blur[0]) blur[0].removeAttribute("style");
        },
        removeLiveLogo: () => { // 直播水印
            if (!config.reset.livelogo) return;
            let logo = document.getElementsByClassName("bilibili-live-player-video-logo");
            if (logo[0]) logo[0].remove();
        },
        removeNodes : () => { // 失效节点
            let hidden = (node,type) => {
                switch(type){ // 一般能隐藏的就隐藏，否则直接移除
                    case "id" : node = document.getElementById(node);break;
                    case "class" : node = document.getElementsByClassName(node)[0]?document.getElementsByClassName(node)[0]:"";break;
                    case "tag" : node = document.getElementsByTagName(node)[0]?document.getElementsByTagName(node)[0]:"";break;
                }
                if (!node) return;
                if (node.getAttribute("hidden")) return;
                node.setAttribute("hidden","hidden");
            }
            hidden("contact-help","class");
            hidden("new-entry","class");
            hidden("ver","class");
            hidden("fixed_app_download","id");
            hidden("app-download","class");
            if (document.getElementsByClassName("bili-header-m")[1]) document.getElementsByClassName("bili-header-m")[1].remove();
        },
        fixSort: { // 失效分区
            video: () => {
                let timer = window.setInterval(()=>{
                    let tminfo = document.getElementsByClassName("tm-info");
                    if (tminfo[0]) {
                        window.clearInterval(timer);
                        if (!(tid in API.sort)) return; // 判断tid是否在需要修复的范围
                        let nodes = tminfo[0].childNodes;
                        // 创建分区信息节点并写入tid对应的分区数据
                        nodes[1].replaceWith(nodes[0].cloneNode(true));
                        nodes[2].replaceWith(nodes[0].cloneNode(true));
                        nodes[2].childNodes[1].remove();
                        nodes[1].childNodes[0].href = API.sort[API.sort[tid][0]][2];
                        nodes[1].childNodes[0].innerText = API.sort[API.sort[tid][0]][1];
                        nodes[2].childNodes[0].href = API.sort[tid][2];
                        nodes[2].childNodes[0].innerText = API.sort[tid][1];
                    }
                },1000);
            },
            watchlater : () => { // 稍后再看分区
            let timer = window.setInterval(async ()=>{
                let tminfo = document.getElementsByClassName("tm-info");
                if (tminfo[0]&&aid) { // 判断是否是稍后再看播放页面
                    window.clearInterval(timer);
                    let child = tminfo[0].childNodes;
                    if (child[2].nodeType === 8) {
                        let data = await xhr.true(deliver.obj2search(API.url.view, {"aid":aid})); // 判断并获取需要修复的分区tid
                        try {
                            tid = JSON.parse(data).data.tid;
                            if (!(tid in API.sort)) return; // 判断tid是否在需要修复的分区范围
                            // 创建分区信息节点并写入tid对应的分区数据
                            child[2].replaceWith(child[0].cloneNode(true));
                            child[4].replaceWith(child[0].cloneNode(true));
                            child[4].childNodes[1].remove();
                            child[2].childNodes[0].href = API.sort[API.sort[tid][0]][2];
                            child[2].childNodes[0].innerText = API.sort[API.sort[tid][0]][1];
                            child[4].childNodes[0].href = API.sort[tid][2];
                            child[4].childNodes[0].innerText = API.sort[tid][1];
                        } catch(e) {debug.error(e)}
                    }
                }
            },1000);
        },
        },
        setLike: () => { // 点赞功能
            if (!config.reset.like) return;
                let coin = document.getElementsByClassName("bilibili-player-video-subtitle");
                let number = document.getElementsByClassName("number");
                let node = document.getElementsByClassName("coin");
                let timer = window.setInterval(async () => {
                    if (coin[0]) { // 判断页面渲染进度
                        window.clearInterval(timer);
                        let span = document.createElement("span");
                        let bef = document.createElement("i");
                        let af = document.createElement("b");
                        let text = document.createTextNode("点赞 --");
                        let arg = text;
                        // 创建点赞数据相关节点并初始化
                        span.setAttribute("class","u like");
                        span.setAttribute("style","margin-right: 5px;");
                        span.appendChild(bef);
                        span.appendChild(af);
                        span.appendChild(text);
                        bef.setAttribute("class","l-icon-move");
                        bef.setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;");
                        af.setAttribute("class","l-icon-moved");
                        af.setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;display: none;");
                        number[0].insertBefore(span,node[0]);
                        let data = await xhr.true(deliver.obj2search(API.url.view, {"aid":aid})); // 获取点赞数
                        try {
                            data = JSON.parse(data).data.stat.like;
                            document.getElementsByClassName("like")[0].setAttribute("title","点赞人数" + data);
                            if (data>10000) data = (data/10000).toFixed(1) + "万";
                            text = document.createTextNode(" 点赞 " + data);
                            arg.replaceWith(text); // 写入点赞人数
                            arg = text;
                            data = await xhr.true(deliver.obj2search(API.url.haslike, {"aid":aid}));
                            data = JSON.parse(data);
                            if (data.data==0 || data.data==1) {
                                let move = document.getElementsByClassName("l-icon-move");
                                let moved = document.getElementsByClassName("l-icon-moved");
                                data = data.data;
                                if (data==1) { // 点赞过点亮图标
                                    move[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;display: none;");
                                    moved[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;");
                                }
                                move[0].onclick = async () => { // 没有点赞过绑定点赞点击事件
                                    let msg = "aid=" + aid + "&like=1&csrf=" +deliver.getCookies().bili_jct; // 构造点赞表单
                                    data = await xhr.post(API.url.like, "application/x-www-form-urlencoded"); // 请求点赞表单
                                    data = JSON.parse(data).ttl;
                                    // 点亮点赞图标
                                    document.getElementsByClassName("l-icon-move")[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;display: none;");
                                    document.getElementsByClassName("l-icon-moved")[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;");
                                    if (arg.nodeValue.match("万")) return; // 忽略点赞上万的情况
                                    let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1; // 点赞数+1
                                    text = document.createTextNode(" 点赞 " + number)
                                    arg.replaceWith(text);
                                    arg = text;
                                }
                                moved[0].onclick = async () => { // 点赞过绑定取消点赞点击事件
                                    let msg = "aid=" + aid + "&like=2&csrf=" +deliver.getCookies().bili_jct; // 构造取消点赞表单
                                    data = await xhr.post(API.url.like, "application/x-www-form-urlencoded"); // 请求取消点赞表单
                                    data = JSON.parse(data).ttl;
                                    // 点亮点赞图标
                                    document.getElementsByClassName("l-icon-move")[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;");
                                    document.getElementsByClassName("l-icon-moved")[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;display: none;");
                                    if (arg.nodeValue.match("万")) return; // 忽略点赞上万的情况
                                    let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1; // 点赞数-1
                                    text = document.createTextNode(" 点赞 " + number)
                                    arg.replaceWith(text);
                                    arg = text;
                                }
                            }
                            else document.getElementsByClassName("l-icon-move")[0].onclick = () => document.getElementsByClassName("c-icon-move")[0].click();
                        } catch(e) {debug.error(e)}
                    }
                },100);
        },
        setMediaList: {
            init: async (data) => { // 收藏播放
                if (!ml) { // 判断是正常av页还是收藏播放页
                    if (!window.__playinfo__.data || !window.__playinfo__.data.accept_quality) return;
                    if (window.__playinfo__.data.accept_quality[0] < 120) return; // 4k时初始化播放器
                    let timer = setInterval(() => {
                        if (!unsafeWindow.BilibiliPlayer) return;
                        clearInterval(timer);
                        let e = "cid=" + unsafeWindow.cid + "&aid=" + unsafeWindow.aid;
                        unsafeWindow.GrayManager && unsafeWindow.GrayManager.reload(e);
                        unsafeWindow.BiliCm && unsafeWindow.BiliCm.Core && unsafeWindow.BiliCm.Core.reset();
                    },100)
                    return;
                }
                if (data){ // 以传参data决定处理类型
                    data = await xhr.true(deliver.obj2search(API.url.medialist, {"media_id":ml,"pn":1,"ps":1})); // 获取收藏播放页正在播放的视频av
                    data = JSON.parse(data).data;
                    if (data && data.medias) location.replace("https://www.bilibili.com/video/av" + data.medias[0].id); // 跳转到av页
                    else GM_setValue("medialist", 0);
                }
                else {
                    let loop = async () => {
                        let value =[];
                        for (let i=0;i<20;i++) if (avs[i]) value[i] = "av" + avs[i]; // API限制一次最多获取20
                        avs.splice(0,20); // 删除即将获取项目的记录
                        data = await xhr.true(deliver.obj2search(API.url.cards, {"ids":value.join("%2C")})); // 获取列表视频对应数据
                        data = JSON.parse(data).data;
                        for (let key in data) {ids.push(data[key])} // 依次保存收藏视频数据进全局变量
                        if (avs[0]) loop();
                    }
                    data = await xhr.true(deliver.obj2search(API.url.ids4Player, {"media_id": ml})); // 获取收藏列表所有aid
                    try {
                        data = JSON.parse(data).data;
                        let value = [];
                        for (let i=0;i<data.medias.length;i++) avs[i] = data.medias[i].id; // 保存收藏列表aid
                        await loop(); // 获取列表视频对应数据
                        let timer = window.setInterval(()=>{
                            if (unsafeWindow.BilibiliPlayer) {
                                clearInterval(timer);
                                // 重构稍后再看列表所需数据
                                for (let i=0;i<ids.length;i++) {
                                    ids[i].progress = 0;
                                    ids[i].add_at = ids[i].ctime;
                                    ids[i].pages = [];
                                    ids[i].pages[0] = {};
                                    ids[i].pages[0].cid = ids[i].cid;
                                    ids[i].pages[0].dimension = ids[i].dimension;
                                    ids[i].pages[0].duration = ids[i].duration;
                                    ids[i].pages[0].from = "vupload";
                                    ids[i].pages[0].page = 1;
                                    ids[i].pages[0].part = ids[i].title;
                                    ids[i].pages[0].vid = "";
                                    ids[i].pages[0].weblink = "";
                                }
                                let toview = {"code":0,"message":"0","ttl":1,"data":{"count":ids.length,"list":ids}};
                                oid = ids[0].aid; // 保存初始aid，以便判断是否切p
                                obj = {"aid":ids[0].aid,"cid":ids[0].cid,"watchlater":encodeURIComponent(JSON.stringify(toview))}; // 重构初始化播放器参数
                                unsafeWindow.BilibiliPlayer(obj); // 初始化播放器，使用稍后再看列表模拟收藏列表
                                let bpui = document.getElementsByClassName("bpui-button-text");
                                let t = setInterval(()=>{ // 更新列表信息
                                    if (bpui[1]) {
                                        clearInterval(t);
                                        bpui[1].firstChild.innerText = "收藏列表";
                                    }
                                },100);
                            }
                        },100);
                    } catch(e) {debug.error(e)}
                }
            },
            fixvar: () => { // aid变化监听
                if (!aid) aid = unsafeWindow.aid ? unsafeWindow.cid : aid;
                if (oid) {
                    if (oid!=unsafeWindow.aid) { // 收藏播放切p判断
                        aid = unsafeWindow.aid ? unsafeWindow.aid : aid;
                        oid = unsafeWindow.aid;
                        deliver.setMediaList.restore(); // 更新收藏播放
                    }
                }
            },
            restore: () => { // 收藏播放更新
                let data;
                history.replaceState(null,null,"https://www.bilibili.com/video/av" + aid + location.search + location.hash); // 更新地址栏av号
                for (let i=0;i<ids.length;i++) if (ids[i].aid==aid) data = ids[i];
                let video_info = document.getElementById("viewbox_report").childNodes;
                let up_info = document.getElementById("v_upinfo").childNodes;
                let tag = document.getElementById("v_tag").childNodes;
                let desc = document.getElementById("v_desc").childNodes;
                let arc_toolbar_report = document.getElementById("arc_toolbar_report").childNodes;
                let title = video_info[0];
                let info = video_info[1];
                let number = video_info[2];
                document.title = data.title;
                title.title = data.title;
                title.childNodes[1].innerText = data.title;
                // 留待完善分区表
                //info.childNodes[1].childNodes[0].href = API.sort[API.sort[data.tid][0]][2];
                //info.childNodes[1].childNodes[0].innerText = API.sort[API.sort[data.tid][0]][1];
                //info.childNodes[2].childNodes[0].href = API.sort[data.tid][2];
                //info.childNodes[2].childNodes[0].innerText = API.sort[data.tid][1];
                info.childNodes[3].innerText = deliver.timeFormat(data.pubdate*1000);
                number.childNodes[0].title = "总播放数" + data.stat.view;
                number.childNodes[0].innerText = data.stat.view < 10000 ? data.stat.view : (data.stat.view / 10000).toFixed(1) + "万";
                number.childNodes[1].title = "总弹幕数" + data.stat.danmaku;
                number.childNodes[1].innerText = data.stat.danmaku < 10000 ? data.stat.danmaku : (data.stat.danmaku / 10000).toFixed(1) + "万";
                if (data.stat.his_rank>0) {number.childNodes[2].innerText = "最高全站日排行" + data.stat.his_rank + "名"} else {number.childNodes[2].setAttribute("hidden","hidden")}
                if (number.childNodes[4].className == "u like") {
                    number.childNodes[4].title = "点赞人数" + data.stat.like;
                    number.childNodes[4].childNodes[2].replaceWith(document.createTextNode("点赞 " + (data.stat.like < 10000 ? data.stat.like : (data.stat.like / 10000).toFixed(1) + "万")));
                    number.childNodes[5].title = "投硬币枚数" + data.stat.coin;
                    number.childNodes[5].childNodes[2].replaceWith(document.createTextNode("硬币 " + (data.stat.coin < 10000 ? data.stat.coin : (data.stat.coin / 10000).toFixed(1) + "万")));
                    number.childNodes[6].title = "收藏人数" + data.stat.favorite;
                    number.childNodes[6].childNodes[2].replaceWith(document.createTextNode("收藏 " + (data.stat.favorite < 10000 ? data.stat.favorite : (data.stat.favorite / 10000).toFixed(1) + "万")));
                }
                else {
                    number.childNodes[4].title = "投硬币枚数" + data.stat.coin;
                    number.childNodes[4].childNodes[2].replaceWith(document.createTextNode("硬币 " + (data.stat.coin < 10000 ? data.stat.coin : (data.stat.coin / 10000).toFixed(1) + "万")));
                    number.childNodes[5].title = "收藏人数" + data.stat.favorite;
                    number.childNodes[5].childNodes[2].replaceWith(document.createTextNode("收藏 " + (data.stat.favorite < 10000 ? data.stat.favorite : (data.stat.favorite / 10000).toFixed(1) + "万")));
                }
                up_info[0].childNodes[1].href = "https://space.bilibili.com/" + data.owner.mid;
                up_info[0].childNodes[1].childNodes[0].src = data.owner.face;
                up_info[1].childNodes[0].childNodes[0].href = "https://space.bilibili.com/" + data.owner.mid;
                up_info[1].childNodes[0].childNodes[0].innerText = data.owner.name;
                up_info[1].childNodes[1].childNodes[0].innerText = "这里是up主简介";
                up_info[1].childNodes[2].childNodes[0].innerText = "投稿 --";
                up_info[1].childNodes[2].childNodes[1].innerText = "粉丝 --";
                arc_toolbar_report[0].childNodes[0].title = "分享人数" + data.stat.share;
                arc_toolbar_report[0].childNodes[0].childNodes[1].innerText = data.stat.share < 10000 ? data.stat.share : (data.stat.share / 10000).toFixed(1) + "万";
                arc_toolbar_report[2].title = "收藏人数" + data.stat.favorite;
                arc_toolbar_report[2].childNodes[0].childNodes[3].innerText = data.stat.favorite < 10000 ? data.stat.favorite : (data.stat.favorite / 10000).toFixed(1) + "万";
                arc_toolbar_report[3].title = "投硬币枚数" + data.stat.coin;
                arc_toolbar_report[3].childNodes[0].childNodes[3].innerText = data.stat.coin < 10000 ? data.stat.coin : (data.stat.coin / 10000).toFixed(1) + "万";
                tag[0].setAttribute("hidden", "hidden");
                desc[1].innerText = data.desc;
                new unsafeWindow.bbComment(".comment",unsafeWindow.aid, 1, unsafeWindow.UserStatus.userInfo, "");
                let bpui = document.getElementsByClassName("bpui-button-text");
                let t = setInterval(()=>{ // 更新列表信息
                    if (bpui[1]) {
                        clearInterval(t);
                        bpui[1].firstChild.innerText = "收藏列表";
                    }
                },100);
            },
        },
        setBangumi: {
            init: (data) => { // 分集数据
                if (!config.reset.episodedata) return;
                if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) { // 判断是否有分集数据
                    aid = data.epInfo.aid; // 获取aid
                    let timer = window.setInterval(() => {
                        if (document.getElementsByClassName("info-sec-av")[0]) {
                            deliver.setBangumi.episodeData("first"); // 进入首集处理
                            window.clearInterval(timer);
                        }
                    },1000);
                    window.setTimeout(() => {window.clearInterval(timer);},10000); // 延时取消操作
                }
            },
            episodeData: async (data) => { // 分集数据处理
                let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
                let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
                if (data == "first") { // 判断是否是首集
                    if (views.innerText == "-" && danmakus.innerText == "-") {
                        window.setTimeout(() => {deliver.episodeData("first")},100);
                        return;
                    }
                    views.setAttribute("title","总播放数 " + views.innerText); // 备份总播放数
                    danmakus.setAttribute("title","总弹幕数 " + danmakus.innerText); // 备份总弹幕数
                    debug.log("合计播放：" + views.innerText + " 合计弹幕：" + danmakus.innerText);
                    data = await xhr.true(deliver.obj2search(API.url.stat, {"aid":aid})); // 请求首集数据
                }
                if (!data) {data = await xhr.true(deliver.obj2search(API.url.stat, {"aid":aid}))} // 请求非首集数据
                try {
                    data = JSON.parse(data).data;
                    let view = data.view;
                    let danmaku = data.danmaku;
                    if (view>=10000) view = (view / 10000).toFixed(1) + "万";
                    if (danmaku>=10000) danmaku = (danmaku / 10000).toFixed(1) + "万";
                    views.innerText = view; // 写入分集播放量
                    danmakus.innerText = danmaku; // 写入分集弹幕数
                    debug.log("播放：" + view + " 弹幕：" + danmaku);
                } catch(e) {debug.error(e);}
            },
        },
        setPlayList: () => { // 播单处理
            window.onload = () => {
                let div = document.createElement("div");
                div.setAttribute("class","z-top-container has-menu");
                document.body.insertBefore(div,document.body.firstChild);
                let script = document.createElement("script");
                script.setAttribute("type","text/javascript");
                script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
                document.body.appendChild(script);
                let style = document.createElement("style");
                style.setAttribute("type","text/css");
                document.head.appendChild(style);
                style.appendChild(document.createTextNode(API.style.bofqi));
            }
        },
        setOnline: () => { // 在线数据，(相关接口已关闭，这里其实已失去意义)
            let timer = window.setInterval(async () => {
                let online = document.getElementsByClassName("online");
                if (online[0]) { // 判断主页载入进程
                    window.clearInterval(timer);
                    let loop = async () => {
                        let data = await xhr.true(API.url.online); // 请求在线数据
                        try {
                            data = JSON.parse(data).data;
                            let all_count = data.all_count;
                            let web_online = data.web_online;
                            let play_online = data.play_online;
                            let online = document.getElementsByClassName("online")[0];
                            if (online.tagName == "DIV") online = online.getElementsByTagName("a")[0]; // 判断新旧主页
                            else { // 旧版主页需额外创建节点
                                let parent = online.parentNode;
                                online.remove();
                                let div = document.createElement("div");
                                let a = document.createElement("a");
                                div.setAttribute("class","online");
                                parent.insertBefore(div,parent.firstChild);
                                a.setAttribute("href","//www.bilibili.com/video/online.html");
                                a.setAttribute("target","_blank");
                                div.appendChild(a);
                                online = a;
                            }
                            online.setAttribute("title","在线观看：" + play_online);
                            online.text = web_online ? "在线人数：" + web_online : "在线列表";
                            if (!online.parentNode.getElementsByTagName("em")[0]) { // 判断旧版主页是否已经额外创建了节点
                                let em = document.createElement("em");
                                let count = document.createElement("a");
                                online.parentNode.insertBefore(em,online.nextSibling);
                                count.setAttribute("href","//www.bilibili.com/newlist.html");
                                count.setAttribute("target","_blank");
                                online.parentNode.insertBefore(count,em.nextSibling);
                                count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                            }
                            else {
                                let count = online.parentNode.getElementsByTagName("a")[1];
                                count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                            }
                            if (!all_count || !web_online || !play_online) return;
							window.setTimeout(()=>{loop()}, 60000); // 60s轮循
                        } catch(e) {debug.error(e)}
                    }
                    loop();
                }
            },1000);
        },
        setJoinTime: async () => { // 注册时间
            if (!mid && !config.reset.jointime) return;
            let data = await xhr.GM(deliver.obj2search(API.url.membercard,{"mid":mid})); // 请求注册时间数据
            try {
                data = JSON.parse(data);
                let jointime = deliver.timeFormat(data.card.regtime * 1000, 1); // 格式化时间戳，不是13位，主动补位
                let birthdate = data.card.birthday;
                document.addEventListener("DOMNodeInserted",(msg) => {
                    let birthday = document.getElementsByClassName("birthday");
                    if (birthday[0]) { // 判断是否重复处理
                        if (document.getElementsByClassName("jointime")[0]) return;
                        else {
                            let div = document.createElement("div");
                            let icon = document.createElement("span");
                            let text = document.createElement("span");
                            let style = document.createElement("style");
                            div.setAttribute("class","item jointime");
                            birthday[0].parentNode.appendChild(div);
                            icon.setAttribute("class","icon");
                            div.appendChild(icon);
                            text.setAttribute("class","text");
                            text.innerText = jointime;
                            div.appendChild(text);
                            style.setAttribute("type","text/css");
                            document.head.appendChild(style);
                            style.appendChild(document.createTextNode(API.style.jointime));
                        }
                    }
                });
            } catch(e) {debug.error(e)}
        },
        fixVideoLost: { // 失效视频
            favlist: async (msg) => {
                let title, cover;
                let aid = msg.target.getAttribute("data-aid"); // 获取av号
                if (!(1 * aid)) aid = deliver.convertId(aid); // 获取bv转的av号
                if (arr.indexOf(aid) != -1) return; // 判断视频是否已经处理
                arr.push(aid); // 记录已经处理过的视频aid
                let data = await xhr.GM(API.url.jijidown + aid); // 请求失效视频jijidown数据
                try { // 尝试读取来自jijidown的数据
                    data.match('window._INIT')[0]; // 判断是否有视频数据
                    title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/,"").replace(/-哔哩哔哩唧唧/,""); // 获取视频标题
                    cover = data.match(/"img\":\ \".+?\",/)[0].replace(/"img": "/,"").replace(/",/,""); // 获取视频封面
                    cover.match('hdslb')[0]; // 判断封面是否有效
                } catch(e) {
                    data = await xhr.GM(API.url.biliplus + aid);
                    try { // 尝试读取来自biliplus数据
                        data.match(/\<title\>.+?\ \-\ AV/)[0]; // 判断数据是否有效
                        title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/,"").replace(/ - AV/,""); // 获取视频标题
                        cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/,"").replace(/" alt/,""); // 获取视频封面
                    } catch(e) {
                        title = "AV" + aid; // 无有效数据只能把标题改为av号
                    }
                }
                debug.log("失效视频：AV" + aid);
                let img = msg.target.getElementsByTagName("img")[0];
                let txt = msg.target.getElementsByClassName("title")[0];
                img.setAttribute("src",cover + "@380w_240h_100Q_1c.webp"); // 修复失效视频标题
                img.setAttribute("alt",title);
                txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
                txt.setAttribute("title",title);
                txt.setAttribute("style","text-decoration: line-through;color: #ff0000;"); // 为失效视频添加红色删除线
                txt.text = title;
                msg.target.setAttribute("class","small-item");
                msg.target.firstChild.setAttribute("href","//www.bilibili.com/video/av" + aid); // 修复失效视频av号
                msg.target.firstChild.setAttribute("target","_blank");
                msg.target.firstChild.setAttribute("class","cover cover-normal");
            },
            channel: async (src) => {
                if (!config.reset.lostvideo) return;
                try {
                    let cid, mid, pn, data;
                    let fix = () => {
                        data = JSON.parse(data).data;
                        let disabled = document.getElementsByClassName("small-item");
                        for (let i=0;i<disabled.length;i++) {
                            let aid = disabled[i].getAttribute("data-aid") * 1; // 获取aid
                            let title = "av" + aid;
                            if (data.list.archives[i].title) title = data.list.archives[i].title;
                            let a = disabled[i].getElementsByClassName("cover")[0];
                            let img = disabled[i].getElementsByTagName("img")[0];
                            let txt = disabled[i].getElementsByClassName("title")[0];
                            if (txt.text == "Loading") {
                                if (aid) { // 判断aid还是bvid
                                    debug.log("失效视频：AV" + aid);
                                    // 修复失效视频av号
                                    txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
                                    a.setAttribute("href","//www.bilibili.com/video/av" + aid);
                                }
                                else {
                                    // 修复失效视频bv号
                                    aid = disabled[i].getAttribute("data-aid");
                                    debug.log("失效视频：" + aid);
                                    txt.setAttribute("href","//www.bilibili.com/video/" + aid);
                                    a.setAttribute("href","//www.bilibili.com/video/" + aid);
                                }
                                a.setAttribute("target","_blank");
                                a.setAttribute("class","cover cover-normal");
                                img.setAttribute("alt",title);
                                img.setAttribute("src",data.list.archives[i].pic.replace("http","https") + "@380w_240h_100Q_1c.webp"); // 修复失效视频封面
                                txt.setAttribute("target","_blank");
                                txt.setAttribute("title",title);
                                txt.setAttribute("style","text-decoration: line-through;color: #ff0000;"); // 为失效视频标题添加红色删除线
                                txt.text = title; // 修复失效视频标题
                            }
                        }
                    }
                    src = src.split('?')[1].split('&');
                    // 获取cid，mid，pn
                    for (let i=0;i<src.length;i++) {
                        let key = src[i].split('=');
                        if (key[0] == "cid") cid = key[1]; // 此cid不是视频播放页的cid，应该就是个频道号
                        if (key[0] == "mid") mid = key[1]; // mid是up主空间号
                        if (key[0] == "pn") pn = key[1]; // pn是频道当前页码
                    }
                    let small_item = document.getElementsByClassName("small-item");
                    let item_change = "small-item fakeDanmu-item";
                    if (small_item[0]) {
                        for (let i=0;i<small_item.length;i++) {
                            if (small_item[i].getElementsByClassName("title")[0].text == "已失效视频") { // 判断失效视频
                                small_item[i].getElementsByClassName("title")[0].text = "Loading"; // 预处理失效视频标题，方便定位
                                small_item[i].setAttribute("class",item_change);
                                if (!ts) { // 以ts时间戳判断缓冲请求出数，失效视频可能很多，但同时只需请求第一次
                                    ts = Date.parse(new Date()); // 保存ts时间戳全局变量
                                    // 第一次直接请求失效页视频数据
                                    data = await xhr.true(deliver.obj2search(API.url.channel,{"mid":mid,"cid":cid,"pn":pn,"ps":30,"order":0}));
                                    fix();
                                }
                                else {
                                    if (Date.parse(new Date()) - ts >= 1000) { // 过滤ls之内的重复请求
                                        ts = Date.parse(new Date()); // 刷新ts时间戳
                                        // 相隔时间过长，可能是切换了频道列表或页码，可以刷新请求
                                        data = await xhr.true(deliver.obj2search(API.url.channel,{"mid":mid,"cid":cid,"pn":pn,"ps":30,"order":0}));
                                        fix();
                                    }
                                }
                            }
                        }
                    }
                } catch(e) {debug.error(e)}
            },
            home: (msg) => {
                if (!config.reset.lostvideo) return;
                let channel_item = document.getElementsByClassName("channel-item");
                if (channel_item[0]) {
                    let small_item = document.getElementsByClassName("small-item");
                    if (small_item[0]) { // 判断是否展示频道视频
                        for (let i=0;i<small_item.length;i++) {
                            if (small_item[i].getAttribute("class") == "small-item disabled") { // 判断展示的是否有失效视频
                                small_item[i].setAttribute("class","small-item fakeDanmu-item"); // 修改失效视频className
                                let aid = small_item[i].getAttribute("data-aid") * 1;
                                let a = small_item[i].getElementsByClassName("cover")[0];
                                let img = small_item[i].getElementsByTagName("img")[0].alt;
                                let txt = small_item[i].getElementsByClassName("title")[0];
                                if (aid) { // 判断是aid型还是bvid型
                                    debug.log("失效视频：AV" + aid);
                                    // 修改失效视频av链接
                                    txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
                                    a.setAttribute("href","//www.bilibili.com/video/av" + aid);
                                }
                                else {
                                    // 修改失效视频bv链接
                                    aid = small_item[i].getAttribute("data-aid");
                                    debug.log("失效视频：" + aid);
                                    txt.setAttribute("href","//www.bilibili.com/video/" + aid);
                                    a.setAttribute("href","//www.bilibili.com/video/" + aid);
                                }
                                a.setAttribute("target","_blank");
                                a.setAttribute("class","cover cover-normal");
                                txt.setAttribute("target","_blank");
                                txt.setAttribute("title",img);
                                txt.setAttribute("style","text-decoration: line-through;color: #ff0000;"); // 为失效视频标题添加红色删除线
                                txt.text = img; // 修复失效视频标题
                            }
                        }
                    }
                }
                // 固定失效视频数据防止被页面改回去
                if (msg.relatedNode.text == '已失效视频') msg.relatedNode.text = msg.relatedNode.getAttribute("title");
                if (msg.target.className == "small-item disabled") msg.target.className = "small-item";
            }
        },
        setReplyFloor: async (src) => { // 评论楼层
            if (!config.reset.replyfloor) return;
            try {
                let oid, sort, pn, data;
                src = src.split('?')[1].split('&');
                for (let i=0;i<src.length;i++) {
                    let key = src[i].split('=');
                    if (key[0] == "oid") oid = key[1]; // oid是评论号，视频播放页似与aid相关
                    if (key[0] == "sort") sort = key[1]; // 评论排序方式
                    if (key[0] == "pn") pn = key[1]; // 评论页码
                    if (key[0] == "type") type = key[1]; // 评论类型：区分视频、专栏、话题……
                }
                // sort与mode对应转化
                if (sort == 0) mode = 1;
                if (sort == 1) return; // 当前无法处理按回复量排序的情形，直接退出
                if (sort == 2) mode = 3;
                // 热门：sort=2 mode=3 时间：sort=0 mode=2  回复：sort=1 默认(热门+时间) mode=1
                if (sort == 2) data = await xhr.true(deliver.obj2search(API.url.replymain, {"oid":oid,"next":pn,"type":type,"mode":mode}),deliver.setReplyFloor.floor); // 获取热门评论首页数据
                else {
                    if (pn == 1) data = await xhr.true(deliver.obj2search(API.url.replymain, {"oid":oid,"type":type,"mode":mode}),deliver.setReplyFloor.floor); // 获取最新评论首页数据
                    else{
                        pn = pn - 1;
                        data = await xhr.true(deliver.obj2search(API.url.reply, {"type":type,"sort":sort,"oid":oid,"pn":pn}));// 获取最新评论其他页的上一页数据
                        data = JSON.parse(data).data;
                        let i = data.replies.length - 1;
                        oid = data.replies[0].oid;
                        let root = data.replies[i].rpid; // 获取上一页最后一条评论的rpid并对应到root
                        data = await xhr.true(deliver.obj2search(API.url.replycursor, {"oid":oid,"root":root,"type":type})); // 根据上一页最后一条评论的root请求该评论数据
                        data = JSON.parse(data).data;
                        oid = data.root.oid;
                        let next = data.root.floor; // 获取上一页最后一条评论楼层并对应到next
                        data = await xhr.true(deliver.obj2search(API.url.replymain, {"oid":oid,"next":next,"type":type,"mode":mode})); // 获取当前页评论数据
                    }
                }
                data = JSON.parse(data).data;
                let floor = {},top = data.top,hots = data.hots,replies = data.replies;
                let list_item = document.getElementsByClassName("list-item");
                let main_floor = document.getElementsByClassName("main-floor");
                if (hots && hots[0]) for (let i=0;i<hots.length;i++) floor[hots[i].rpid] = hots[i].floor; // 获取热门评论数据
                if (replies && replies[0]) for (let i=0;i<replies.length;i++) floor[replies[i].rpid] = replies[i].floor; // 获取一般评论数据
                // 获取三种置顶类型评论数据
                if (top && top.admin) floor[top.admin.rpid] = top.admin.floor;
                if (top && top.upper) floor[top.upper.rpid] = top.upper.floor;
                if (top && top.vote) floor[top.vote.rpid] = top.vote.floor;
                if (main_floor[0]) { // 判断旧版评论
                    for (let i=0;i<main_floor.length;i++) {
                        let rpid = main_floor[i].getAttribute("id").split('_')[2]; // 获取旧版评论rpid
                        if (rpid in floor) main_floor[i].getElementsByClassName("floor-num")[0].innerText = "#" + floor[rpid]; // 旧版评论直接写入楼层
                    }
                }
                if (list_item[0]) { // 判断新版评论
                    for (let i=0;i<list_item.length;i++) {
                        let rpid = list_item[i].getAttribute("data-id"); // 获取新版评论rpid
                        if (rpid in floor) {
                            let node = list_item[i].getElementsByClassName("info")[0];
                            // 新版评论需另外创建floor
                            let span = document.createElement("span");
                            span.setAttribute("class","floor");
                            span.innerText = "#" + floor[rpid];
                            node.insertBefore(span,node.firstChild);
                        }
                    }
                }
            } catch(e) {debug.error(e)}
        },
        fixnews: (node) => { // 广告区转资讯区
            if (node.id == "bili_ad") {
                node = node.getElementsByClassName("name");
                if (node[0]) node[0].text = "资讯";
            }
            if (node.className == "report-wrap-module elevator-module") node.children[1].children[13].innerHTML = "资讯";
            if (node.id == "bili-header-m") {
                node = node.getElementsByClassName('nav-name');
                if (node[0]) {
                    for (let i = 0; i < node.length; i++) {
                        if (node[i].textContent == "广告") {
                            node[i].textContent = "资讯";
                            node[i].parentNode.href = "//www.bilibili.com/v/information/";
                        }
                    }
                }
            }
        }
    }
    const UI = {
        init: () => { // 设置绘制
            let ui_face = document.createElement("div");
            let enter = document.createElement("span");
            let icon = document.createElement("i");
            ui_face.setAttribute("class","bili-old ui-face");
            ui_face.setAttribute("id","ui-face");
            ui_face.setAttribute("style","right: -54px;");
            ui_face.onmouseover = () => ui_face.setAttribute("style","right: 0px;box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);");
            ui_face.onmouseout = () => ui_face.setAttribute("style","right: -54px;");
            ui_face.onclick = () => {
                let table = document.getElementsByClassName("ui-table");
                if (!table[0]) UI.table();
                else {
                    if (table[0].getAttribute("hidden")) table[0].removeAttribute("hidden");
                    UI.table();
                }
            }
            ui_face.appendChild(icon);
            ui_face.appendChild(enter);
            enter.innerText = "设置";
            // 等待body载入再进行设置绘制
            let timer = window.setInterval(() => {if (document.body) {window.clearInterval(timer);document.body.appendChild(ui_face);}},1000);
        },
        table: () => { // 绘制设置选项
            let table = document.getElementsByClassName("ui-table");
            let timer;
            if (!table[0]) {
                table = document.createElement("div");
                table.setAttribute("class","bili-old ui-table");
                table.setAttribute("id","ui-table");
                let info = document.createElement("span");
                let rec = document.createElement("span");
                info.setAttribute("style","color: rgb(0,0,0);font-size: 14px;");
                info.innerText = "BilibiliOld 设置";
                table.appendChild(info);
                rec.setAttribute("style","color: blue;float: right;font-size: 12px;");
                rec.innerText = "恢复默认";
                rec.onclick = () => {
                    for (let key in def.rewrite) if (key in config.rewrite) config.rewrite[key] = def.rewrite[key];
                    for (let key in def.reset) if (key in config.reset) config.reset[key] = def.reset[key];
                    GM_setValue("config",config);
                    table.remove();
                }
                table.appendChild(rec);
                for (let key in config.rewrite) UI.setTable(table, UI.menu[key], config.rewrite[key], key);
                for (let key in config.reset) UI.setTable(table, UI.menu[key], config.reset[key], key);
                document.body.appendChild(table);
            }
            else table = table[0];
            // 设置失去焦点时消失时间
            table.onmouseover = () => window.clearTimeout(timer);
            table.onmouseout = () => {timer = window.setTimeout(() => {table.setAttribute("hidden","hidden");GM_setValue("config",config);},500);}
        },
        setTable: (ele,name,check,key) => { // 读取写入各设置数据
            let div = document.createElement("div");
            let span = document.createElement("span");
            let input = document.createElement("input");
            ele.appendChild(div);
            div.setAttribute("style","padding: 4px 4px 0px 4px;clear: both;");
            if (document.getElementsByClassName("checke")[0]) div.setAttribute("style","padding: 0px 4px 0px 4px;clear: both;");
            div.appendChild(span);
            div.appendChild(input);
            span.setAttribute("style","float: left;display: inline-block;color: rgb(0,0,0);font-size: 14px;");
            span.innerText = name[0];
            input.setAttribute("type","checkbox");
            input.setAttribute("class","checke");
            if (check) input.checked = true;
            input.onclick = () => { // 开关响应
                if (input.checked){if (key in config.rewrite) config.rewrite[key] = 1;else config.reset[key] = 1;}
                else {if (key in config.rewrite) config.rewrite[key] = 0;else config.reset[key] = 0;}
            }
            div.onmouseover = () => {
                let div = document.createElement("div");
                div.setAttribute("class","bili-old ui-state");
                div.setAttribute("id","ui-state");
                div.innerHTML = name[1];
                document.body.appendChild(div);
            }
            div.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
        },
        menu: { // 设置选项数据，与默认设置数据一一对应
            av : ["av(BV)", "是否启用旧版av(BV)页：将启用旧版av页框架，播放器、页面全部恢复旧版样式。<br>※ 将牺牲一点页面载入速度"],
            bangumi : ["Bangumi", "是否启用旧版番剧页：将启用旧版番剧页框架，播放器、页面全部恢复旧版样式。<br>※ 将牺牲一点页面载入速度"],
            watchlater : ["稍后再看", "是否启用旧版稍后再看：将启用旧版稍后再看框架，播放器、页面全部恢复旧版样式。<br>※ 将牺牲一点页面载入速度"],
            frame : ["嵌入播放器", "是否将新版嵌入播放器替换为旧版嵌入播放器。<br>※ 只替换播放器不会专门处理被嵌入页面的其他实现"],
            home : ["主页", "是否启用旧版主页：将启用旧版主页框架，排版、分区全部恢复旧版样式。<br>※ 将牺牲一点页面载入速度<br>※ 广告区已失效并替换为资讯区数据"],
            playlist : ["playlist", "是否恢复播单播放页：将先跳转收藏播放页避开404再恢复回播单页。<br>※ 将牺牲更多一点页面载入速度"],
            medialist : ["medialist", "是否替换收藏播放页：收藏播放页是新版专属页面，故采用跳转到对应av页的方式再在播放器中以稍后再看列表模拟收藏列表，页面其他信息也将随切p而更新。<br>※ 分区及up简介除外"],
            grobalboard : ["版头和版底", "是否替换新版版头和版底：将识别并替换所有新版版头为旧版版头，旧版失效广告区入口替换为资讯区入口。"],
            replyfloor : ["评论楼层", "是否显示评论的楼层号：官方取消的显示评论区楼层的功能，基本修复了视频、专题、专栏等地区的评论区大部分评论的楼层号。<br>※ 上古“按评论数”排列的评论无法恢复楼层号"],
            headblur : ["顶栏透明度", "是否使顶栏全透明：私心的功能，导致顶栏信息不清晰的话请关闭。"],
            preview : ["付费预览框", "是否去除播放器左下角付费预览框：有10s倒计时，6分钟预览时左下角提示框一直存在也是挺烦的。"],
            livelogo : ["直播水印", "是否去除直播间水印：去除直播间播放器角落“Bilibili”字样的水印。"],
            searchwrap : ["搜索框字体", "是否重设搜索页字号：新版调大了搜索框字体大小，应请调回了旧版大小。"],
            jointime : ["注册时间", "是否在个人空间显示B站账号注册时间：官方取消的显示账号注册时间功能，尽力恢复了当初的样式。<br>※ 依赖up主开放个人资料"],
            lostvideo : ["失效视频", "是否修复收藏和频道中的失效视频信息：借助第三方接口恢复失效视频的封面和标题，将标题标红并添加删除线。<br>※ 获取不到数据的话将只修改标题为对应av号"],
            bvid2av : ["BV⇒av", "是否将BV重定向到av：进入bv页时自动重定向到对应av页(不刷新页面)。"],
            selectdanmu : ["弹幕列表", "是否进入旧版播放页面时自动选择展示“弹幕列表”(默认是“推荐视频”)"],
            episodedata : ["番剧分集数据", "是否显示番剧单回的播放数和弹幕数：让新番显示当前回的播放数和弹幕数，原来的合计播放数和弹幕数将显示在鼠标焦点的浮动信息上"],
            like : ["点赞", "是否为旧版播放页添加添加点赞功能：点赞是新版页面专属功能，很简陋地在旧版视频信息栏添加了个“红心”的点赞按钮。<br>※ 缺乏官方的动效体验捉急"],
            static : ["静态页面跳转", "是否将静态av页跳转到普通av页：静态页面是新版专属页面，页面大部分信息都内置于页面中以加快载入速度，将直接跳转到普通的av页(以启用旧版av页)。"],
            download : ["下载视频", "是否启用视频下载功能：将在播放页(av和番剧)回到顶部按钮上方创建一个下载视频按钮，点击将复制视频链接(mp4/1080P)到剪切板以便使用其他工具下载(因浏览器同源策略无法直接调用下载功能 ಥ_ಥ)。<br>※ 不支持会员视频下载<br>※ 建议配合IDM并开启“直接下载”选项"],
            idm : ["直接下载", "“下载视频”的下级选项，启用后将尝试访问视频链接，IDM拓展可以直接捕获视频。<br>※ 非IDM还是不要开启"],
            heartbeat : ["视频心跳", "是否替换播放记录心跳：旧版视频心跳存在被某些广告插件误杀的情况，导致播放视频而没有记录进历史记录，存在类似情形可以尝试启用。"],
            carousel : ["播放信息", "是否恢复播放器顶部通知信息：视频通知信息获取不到任何有效信息，导致旧版播放器上方通知区一片空白，启用将生成默认数据填充。"]
        }
    }
    const thread = {
        video: () => {
            ml = GM_getValue("medialist");
            GM_setValue("medialist", 0);
            if (config.reset.bvid2av && LOCATION[4].toLowerCase().startsWith('bv')
               ) history.replaceState(null,null,"https://www.bilibili.com/video/av" + deliver.convertId(LOCATION[4]) + location.search + location.hash);
            if (!config.rewrite.av) return;
            DOCUMENT = xhr.false(location.href); // 获取网页源代码
            if (DOCUMENT.includes('__INITIAL_STATE__=')) { // 判断页面是否会自动重定向
                if (DOCUMENT.includes('"code":404')) return; // 判断页面是否404
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__ =
                    JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/;\(function/,"")); // 继承__INITIAL_STATE__
                window.__playinfo__ = DOCUMENT.includes("playinfo__=") ? DOCUMENT.match(/playinfo__=.+?\<\/script>/)[0].replace(/playinfo__=/,"").replace(/<\/script>/,"") : ""; // 继承 __playinfo__
                window.__playinfo__ = window.__playinfo__ ? JSON.parse(window.__playinfo__.replace(/http:/g,"https:")) : ""; // 修改flv为安全链接
                debug.debug(window.__playinfo__);
                if (__INITIAL_STATE__.videoData.stein_guide_cid) return; // 忽略互动视频
                unsafeWindow.__INITIAL_STATE__.comment = {count:0,list:[]} // 修复评论数据缺失
                window.hd = 1;
                aid = __INITIAL_STATE__.aid ? __INITIAL_STATE__.aid : aid; // 获取aid
                tid = __INITIAL_STATE__.videoData.tid ? __INITIAL_STATE__.videoData.tid : tid; // 获取tid
                deliver.write(API.pageframe.video); // 重写av框架
                deliver.fixSort.video() // 修复分区
                deliver.setLike();// 添加点赞功能
                deliver.setMediaList.init(); // 收藏播放功能
            }
        },
        watchlater: () => {
            if (!config.rewrite.watchlater || !uid) return;
            deliver.write(API.pageframe.watchlater); // 重写稍后再看框架
            deliver.setLike(); // 添加点赞功能入口
            deliver.fixSort.watchlater(); // 修复分区入口
            aid = LOCATION[5].match(/[0-9]+/) ? LOCATION[5].match(/[0-9]+/)[0] : aid; // 获取aid
            if (LOCATION[5].toLowerCase().startsWith('bv')){ // 地址栏若是bv，尝试转为av
                aid = deliver.convertId(LOCATION[5]); // bvid转aid
                LOCATION[5] = "av" + aid;
                history.replaceState(null,null,LOCATION.join("/")); // 替换地址栏bvid
            }
        },
        bangumi: () => {
            if (!config.rewrite.bangumi) return;
            DOCUMENT = xhr.false(location.href); // 获取网页源代码
            if (DOCUMENT.includes('__INITIAL_STATE__=')) { // 判断页面是否404
                let id = location.href.match(/[0-9]+/)[0]; // 获取ss(ep)号
                if (LOCATION[5].startsWith('ss')) unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__ = INITIAL_STATE.bangumi(xhr.false(deliver.obj2search(API.url.season,{"season_id":id})),null);
                if (LOCATION[5].startsWith('ep')) unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__ = INITIAL_STATE.bangumi(xhr.false(deliver.obj2search(API.url.season,{"ep_id":id})),id);
                if (__INITIAL_STATE__.epInfo.badge === "互动") return; // 忽略互动番剧
                window.hd = 1;
                if (DOCUMENT.match('"specialCover":""')) deliver.write(API.pageframe.bangumi); else deliver.write(API.pageframe.cinema); // 重写bangumi框架，按是否有特殊背景分别处理
                deliver.setBangumi.init(__INITIAL_STATE__); // 分集数据
            }
        },
        blackboard: () => {
            if (LOCATION[4].startsWith('html5player')) if (LOCATION[4].includes("3521416") && LOCATION[4].includes("6041635")) location.replace(deliver.obj2search(API.playerframe.html5player,{"aid":3521416,"cid":192446449}));
            if (!config.rewrite.frame) return;
            if (LOCATION[4].startsWith('newplayer')) {
                let link = location.href;
                let season_type = link.match(/season_type=[0-9]*/)?1*link.match(/season_type=[0-9]*/)[0].replace(/season_type=/,""):""; // 获取season_type
                let player_type = link.match(/player_type=[0-9]*/)?1*link.match(/player_type=[0-9]*/)[0].replace(/player_type=/,""):""; // 获取player_type
                aid = link.match(/aid=[0-9]*/) ? 1 * link.match(/aid=[0-9]*/)[0].replace(/aid=/,"") : 1 * deliver.convertId(link.match(/bvid=[A-Za-z0-9]*/)[0].replace(/bvid=/,"")); // 获取aid或bvid转的aid
                aid = aid ? aid : 1 * deliver.convertId(link.match(/aid=[A-Za-z0-9]*/)[0].replace(/aid=/,"")); // 获取写作aid读作bvid的aid
                cid = link.match(/cid=[0-9]*/)?1*link.match(/cid=[0-9]*/)[0].replace(/cid=/,"") : cid; // 获取cid
                cid = cid ? cid : JSON.parse(xhr.false(deliver.obj2search(API.url.pagelist,{"aid":aid}))).data[0].cid; // 获取cid失败，通过aid获取
                location.replace(deliver.obj2search(API.playerframe.html5player,{"aid":aid,"cid":cid,"season_type":season_type,"player_type":player_type,"as_wide":1,"urlparam":"module%253Dbangumi","crossDomain":"true"}));
                debug.log("嵌入式播放器：aid=" + aid + " cid=" + cid);
            }
        },
        playlist: () => {
            if (!config.rewrite.playlist) return;
            pl = 1 * LOCATION[5].match(/[0-9]+/)[0]; // 获取播单号
            GM_setValue("playlist",pl); // 保存播单号
            location.replace("https://www.bilibili.com/medialist/play/ml182603655"); // 重定向到收藏播放页，绕过404
        },
        medialist: () => {
            ml = 1 * LOCATION[5].match(/[0-9]+/)[0]; // 获取收藏号
            pl = GM_getValue("playlist") ? GM_getValue("playlist") : ""; // 获取播单数据
            if (pl) { // 判断是否播单重定向而来
                history.replaceState(null,null,"https://www.bilibili.com/playlist/video/pl" + pl); // 跳转回播单
                GM_setValue("playlist", 0); // 清除播单号
                GM_setValue("medialist", 0);// 清除收藏号
                deliver.write(API.pageframe.playlist); // 重写播单框架
                deliver.setPlayList(); // 播单额外处理入口
            }
            else {
                if (!config.rewrite.medialist) return;
                GM_setValue("medialist",ml); // 保存收藏号
                deliver.setMediaList.init(ml);
            }
        },
        svideo: () => {
            if (!config.reset.static) return;
            location.replace(location.href.replace("s/video","video")); // 静态页面跳转普通av页
        },
        space: () => {
            mid = LOCATION[3] ? 1 * LOCATION[3] : mid;
            deliver.setJoinTime(); // 注册时间
        },
        home: () => {
            if (config.rewrite.home) {
                DOCUMENT = xhr.false(location.href);
                __INITIAL_STATE__ = DOCUMENT.includes("__INITIAL_STATE__=") ? DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/;\(function/,"") : ""; // 继承__INITIAL_STATE__
                unsafeWindow.__INITIAL_STATE__ = INITIAL_STATE.home(__INITIAL_STATE__); // 新旧__INITIAL_STATE__不兼容，进行重构
                deliver.write(API.pageframe.home); // 重写主页框架
            }
            deliver.setOnline(); // 在线数据入口
        },
        global: () => {
            if (window.self == window.top) UI.init();
            if (!LOCATION[2].match("live.bilibili.com")) deliver.setGlobalStyle(); // 样式创建
            deliver.intercept.init(); // xhr重定向
            document.addEventListener("DOMNodeInserted",(msg) => {
                let head = document.getElementById("internationalHeader");
                let player = document.getElementById("bofqi");
                if (/bilibili-player-video-toast-pay/.test(msg.target.className)) deliver.removePreview(msg.target); // 去除预览提示框
                if (msg.target.className == "bb-comment ") if (player && /hidden/.test(player.getAttribute("style"))) player.removeAttribute("style"); // 取消隐藏av页播放器
                if (msg.target.id == "internationalHeader") deliver.reSction(); // 版头替换
                if (msg.target.id == "bili-header-m") if (head) head.remove(); // 移除新版版头
                if (/bilibili-player-video-btn-start/.test(msg.target.className)) deliver.switchVideo(); // 监听切p
                if (msg.target.className == "bilibili-player-video-message-ul") deliver.videoMessage(msg.target); // 恢复播放器通知信息
                if (msg.target.src && msg.target.src.startsWith('https://api.bilibili.com/x/v2/reply?')) src = msg.target.src; // 捕获评论链接
                if (msg.target.src && msg.target.src.includes("//api.bilibili.com/x/space/channel/video?")) src = msg.target.src; // 捕获频道链接
                if (msg.relatedNode.getAttribute("class") == "row video-list clearfix") deliver.fixVideoLost.channel(src); // 处理频道失效视频信息
                if (msg.target.className == "small-item disabled") deliver.fixVideoLost.favlist(msg); // 处理收藏失效视频信息
                if (msg.relatedNode.className == "info-sec-av") {aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];deliver.setBangumi.episodeData();} // 判断番剧是否切p
                if (msg.target.id == "bili_ad" || msg.target.className == "report-wrap-module elevator-module" || msg.target.id == "bili-header-m") deliver.fixnews(msg.target); // 广告区转资讯区
                if (src && msg.target.className && (msg.target.className == "main-floor" || msg.target.className == "list-item reply-wrap ")){
                    window.clearTimeout(timer);
                    timer = window.setTimeout(() => {deliver.setReplyFloor(src);},1000); // 修复评论楼层
                }
                deliver.removeNodes(); // 处理失效节点
                deliver.setMediaList.fixvar(); // 监听全局变量
                deliver.removeBlur(); // 顶栏透明度
                deliver.removeLiveLogo(); // 去除直播水印
                deliver.fixVideoLost.home(msg); // 处理空间主页失效视频
                if (window.hd) deliver.avdesc(); // 超链接转化
            });
        }
    }
    /******* 启动入口 *******/
    def = JSON.parse(JSON.stringify(config));
    unsafeWindow.debug = debug;
    let data = GM_getValue("config");
    if (data) {
        for (let key in data.rewrite) if (key in config.rewrite) config.rewrite[key] = data.rewrite[key];
        for (let key in data.reset) if (key in config.reset) config.reset[key] = data.reset[key];
    } else GM_setValue("config",config);
    try {
        let bilibili_player_settings = JSON.parse(localStorage.getItem("bilibili_player_settings"));
        uid = deliver.getCookies().DedeUserID;
        if (bilibili_player_settings) { // 播放器设置
            if (bilibili_player_settings.video_status.autopart !== "") GM_setValue("bilibili_player_settings",bilibili_player_settings);
            else if (GM_getValue("bilibili_player_settings")) localStorage.setItem("bilibili_player_settings",JSON.stringify(GM_getValue("bilibili_player_settings")));
        }
        if (uid) { // 动态历史数据
            let offset = deliver.getCookies()["bp_video_offset_"+ uid];
            if (offset) document.cookie = "bp_t_offset_" + uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; path=/";
        }
    } catch(e) {}
    if (LOCATION[3]) {
        if (LOCATION[3] == 'video' && (LOCATION[4].toLowerCase().startsWith('av') || LOCATION[4].toLowerCase().startsWith('bv'))) thread.video();
        if (LOCATION[3] == 'watchlater') thread.watchlater();
        if (LOCATION[3] == 'bangumi' && LOCATION[4] == 'play') thread.bangumi();
        if (LOCATION[3] == 'blackboard' && LOCATION[4]) thread.blackboard();
        if (LOCATION[3] == 'playlist' && LOCATION[5].startsWith('pl')) thread.playlist();
        if (LOCATION[3] == 'medialist' && LOCATION[4] == 'play' && LOCATION[5].startsWith('ml')) thread.medialist();
        if (LOCATION[3] == 's' && (LOCATION[5].toLowerCase().startsWith('av') || LOCATION[5].toLowerCase().startsWith('bv'))) thread.svideo();
        if (LOCATION[2] == 'space.bilibili.com') thread.space();
        if (LOCATION[2] == 'www.bilibili.com' && (LOCATION[3].startsWith('\?') || LOCATION[3].startsWith('\#') || LOCATION[3].startsWith('index.'))) thread.home();
    } else {if (LOCATION[2] == 'www.bilibili.com') thread.home()}
    thread.global();
})();
