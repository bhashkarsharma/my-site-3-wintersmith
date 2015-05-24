var me, conn, player, peername, lasthb, hbwait = 30000, hbstr = "hbt:live:", playstr = "plc:", interval, timeout, isActive;

$(document).ready(function() {

    if ((!!window.webkitRTCPeerConnection || !!window.mozRTCPeerConnection) && 
        ('WebSocket' in window && 2 === window.WebSocket.CLOSING))
        $('.incompatible').hide();
    
    me = new Peer({ key : "sild5qn11u8wu3di" });
    me.on('open', function(id) {
        $('#username').val(id);
    });
    me.on('connection', function(conn) {
        conn.on('data', function(data) {
            notifyMe(conn.peer + " says...", data);
            if (peername != conn.peer) setPeername(conn.peer);
            $('#peername').val(conn.peer);
            chat.processMessage(data, "receive");
        });
    });
    
    $('#username').on('click', function() {
        $(this).select();
    });
    
    $('#peername').on('input propertychange paste', function() {
        setPeername($(this).val());
    });
    
    $('#clearChats').on('click', function() {
        $('#chats').empty();
        $(this).hide();
    });
    
    $('form').submit(function() { return false; });
    
    $('#msg').keypress(function (e) {
        if (e.keyCode == 13) {
            $('#send').trigger('click');
        }
    });
    
    $('#send').on('click', function() {
        var val = chat.removeTags($('#msg').val());
        if (val.length) {
            conn = me.connect(peername);
            conn.on('open', function() {
                conn.send(val);
                chat.processMessage(val, "send");
                $('#msg').val('');
            });
        }
    });
    
    $(window).on('focus', function() { isActive = true; });
    
    $(window).on('blur', function() { isActive = false; });

});

var setPeername = function(val) {
    $('#peername').addClass('highlight');
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(function() { $('#peername').removeClass('highlight'); }, 1000);
    peername = val;
}

// video player
var video = (function() {
    var setUp = function() {
        $("#player").mediaelementplayer({
//            enablePluginDebug : true,
            success: function(media, node, playerElem) {
                player = playerElem.media;

                player.addEventListener("playing", function(e) {
                    chat.send(playstr + "playing:" + player.currentTime);
                });
            },
            error: function(e) {
                console.log("err ", e);
            }
        });
    };
    
    return { "setUp" : setUp }
    
})();

// chat utils
var chat = (function() {

    var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

    var tagOrComment = new RegExp(
        '<(?:'
        // Comment body.
        + '!--(?:(?:-*[^->])*--+|-?)'
        // Special "raw text" elements whose content should be elided.
        + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
        + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
        // Regular name
        + '|/?[a-z]'
        + tagBody
        + ')>',
        'gi');

    var removeTags = function(html) {
        var oldHtml;
        do {
            oldHtml = html;
            html = html.replace(tagOrComment, '');
        } while (html !== oldHtml);
        return html.replace(/</g, '&lt;');
    };

    var add = function(msg, direction) {
        var div = "<div class=\"bubble " + direction + "\">" + msg + "</div>";
        $('#chats').append(div);
        $('#chats').scrollTop($('#chats')[0].scrollHeight);
    };
    
    var getYTVidId = function(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    };
    
    var processMessage = function(msg, direction) {
        if (heartbeat.isHB(msg) || plc.isPlayerCode(msg)) {
            return;
        }
        var resp = removeTags(msg);
        var vidId = getYTVidId(msg);
        if (vidId) {
            $('#video').find('source').attr('src', "http://www.youtube.com/watch?v=" + vidId);
            $('#video').show();
            video.setUp();
        }
        add(resp, direction);
        
        if ($('#chats').children().length > 0) $('#clearChats').show();
    };
    
    var send = function(msg) {
        if (peername !== undefined && peername.length > 0 && msg.length > 0) {
            conn = me.connect(peername);
            conn.on('open', function() {
                conn.send(msg);
            });
        }
    };

    return {
        "send" : send,
        "removeTags" : removeTags,
        "processMessage" : processMessage
    }
})();

// player code handling
var plc = (function() {
    var isPlayerCode = function(val) {
        if (val.indexOf(playstr) === 0) {
            processCode(val);
            return true;
        }
        return false;
    };
    
    var processCode = function(code) {
        var val = code.split(":");
        if (val[0] + ":" == playstr && player !== undefined) {
            if(val[1] == "playing") {
                player.play();
                player.setCurrentTime(Math.round(val[2] * 100) / 100);
            }
        }
    };
    
    return {
        "isPlayerCode" : isPlayerCode,
        "processCode" : processCode
    }
})();

// heartbeat mgmt
var heartbeat = (function() {

    var sendAndCheck = function() {
        if (peername) {
            chat.send(hbstr + Date.now() + ":" + me.id);
            if (Date.now() - lasthb > hbwait) {
                $('#peername').addClass('offline');
            } else {
                $('#peername').removeClass('offline');
            }
        }
    };
    
    var isHB = function(val) {
        lasthb = Date.now();
        if (val.indexOf(hbstr) === 0) {
            var arr = val.split(":");
            setPeername(arr[3]);
            start();
            return true;
        }
        return false;
    };
    
    var start = function() {
        if (peername !== undefined) {
            if (interval !== undefined) clearInterval(interval);
            interval = setInterval(sendAndCheck, 10000);
        }
    }
    
    start();
    
    return {
        "isHB" : isHB
    }
    
})();

var notifyMe = function(title, body) {
    if (heartbeat.isHB(body) || plc.isPlayerCode(body)) {
        return;
    }
    if (!isActive) {
        if (!Notification) {
            return;
        }

        if (Notification.permission !== "granted") Notification.requestPermission();

        var notification = new Notification(title, {
//            icon: '/images/profile_new.jpg',
            body: body
        });

        notification.onshow = function() {
            setTimeout(notification.close.bind(notification), 4000);
        }

        notification.onclick = function () {
            window.open(".");
        }
    }
};