---
title: Connect
template: experiment.jade
description: In-browser chat application
style: true
script: true
---

<div class="incompatible">Sorry! This application would not work on your browser. Try switching to Chrome 23+ or Firefox 22+.</div>

A simple peer-to-peer chat application that allows people to watch YouTube videos in sync.

<link rel="stylesheet" href="/css/mediaelementplayer.min.css"/>
<script src="http://cdn.peerjs.com/0.3/peer.js"></script>
<script src="/js/mediaelement-and-player.min.js"></script>
<div class="login">
    <form>
        <label>Your id is: </label>
        <input id="username" type="text" value="being fetched">
        <label>Share this id with your friend.</label>
    </form>
</div>

<div class="video-box" id="video">
    <video width="640" height="360" id="player" preload="none">
        <source type="video/youtube" src="http://www.youtube.com/watch?v=Wch3gJG2GJ4" />
    </video>
</div>

<div id="chats">
</div>
<a href="javascript:void(0);" id="clearChats">Clear history</a>

<div class="row">
    <div class="3u">
        <input type="text" name="peername" id="peername" placeholder="Enter your friend's id here">
    </div>
    <div class="8u">
        <input type="text" name="msg" id="msg" placeholder="Message">
    </div>
    <label>You can also send a YouTube video as message and both of you can control it.</label>
    <div class="1u">
        <input type="submit" id="send" value="&gt;">
    </div>
</div>