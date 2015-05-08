---
title: Hello there!
template: page.hbs
description: About Bhashkar Sharma
---
<style>
.video-box { display: none; }
</style>
<p>I love the web and open-source; and want to create useful things.<br>
I have had the opportunity to give talks on JS-related things we built at <a href="http://mobstac.com">MobStac</a>.</p>

<p><a id="link-1" href="http://youtu.be/F5tG1pZ-g7g">Client-side template rendering using Mustache.js - JSFoo'2011</a>
<div class="video-box" id="vid-1">
    <iframe width="560" height="315" src="//www.youtube.com/embed/F5tG1pZ-g7g" frameborder="0" allowfullscreen></iframe>
</div>

<a id="link-2" href="http://youtu.be/oYiSuxPpJTg">Building hybrid apps at MobStac - DroidCon Hacknight'2012</a>
<div class="video-box" id="vid-2">
    <iframe width="560" height="315" src="//www.youtube.com/embed/oYiSuxPpJTg" frameborder="0" allowfullscreen></iframe>
</div>
</p>

<p>I love books; and sometimes try to write. I enjoy sharing my learnings on <a href="http://quora.com/Bhashkar-Sharma">Quora</a>, among other places.<br>
The excitement of learning new things is the reason I get out of bed in the morning.</p>

<script>
document.getElementById('link-1').onclick = function() { show_vid('vid-1'); return false; };
document.getElementById('link-2').onclick = function() { show_vid('vid-2'); return false; };

var show_vid = function(div) {
    if (document.getElementById(div).style.display != "inherit") {
        document.getElementById(div).style.display = "inherit";
    }
}
</script>