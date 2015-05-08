var round = function(num, digits) {
    return +(Math.round(num + "e+" + digits)  + "e-" + digits);
}
window.onload = function() {
    var sin = 0, cos = 1;
    var w = Math.min(500, (window.innerWidth - 2 * document.getElementById('can').offsetLeft));
    var h = Math.min(500, window.innerHeight);
    window.addEventListener("deviceorientation", function(e) {
        var angle = round(e.gamma * Math.PI/180, 3);
        sin = round(Math.sin(angle), 2);
        cos = round(Math.cos(angle), 2);
    });
    var stage = new Kinetic.Stage({
        container : 'can',
        width : w,
        height : h
    });
    var layer = new Kinetic.Layer();
    var ball = new Kinetic.Circle({
        x: w/2,
        y: h/2,
        radius: 10,
        fill: 'rgba(33, 33, 33, 0.9)',
        stroke: 'white',
        strokeWidth: 1
    });
    ball.setAttrs({
        'elasticity': 0.96
    });
    layer.add(ball);

    layer.draw();    
    stage.add(layer);
    var count = 0;

    var log = function(a, u, v, t, s) {
        if (count < 500) console.log(a, u, v, t, s);
        //document.getElementById('stat').innerHTML = [JSON.stringify(a), JSON.stringify(u), JSON.stringify(v), t, s] + "\n"
        count++;
    }


    var u = { x : 0, y : 0 }, g = 9.8, a = { x : 0, y : g };
    var v = u, s = u;

    var ifBounce = function() {
        if ((ball.getX() - ball.getRadius() < 0) || 
            (ball.getX() + ball.getRadius() > stage.getWidth()) || 
            (ball.getY() - ball.getRadius() < 0) || 
            (ball.getY() + ball.getRadius() > stage.getHeight())) {
            //log('hit'); return true;
        } else return false;
    }

    var anim = new Kinetic.Animation(function(frame) {
        a = {
            x : round(g * sin, 2),
            y : round(g * cos, 2)
        }
        var t = frame.timeDiff/100;
        u = v;
        v = {
            x : u.x + a.x * t,
            y : u.y + a.y * t
        }
        if (ball.getX() - ball.getRadius() < 0) {
            v.x = Math.abs(v.x * ball.getAttr('elasticity'));
            //log(a, u, v, t, s);
        }
        if (ball.getX() + ball.getRadius() > stage.getWidth()) {
            v.x = - Math.abs(v.x * ball.getAttr('elasticity'));
            //log(a, u, v, t, s);
        }
        if (ball.getY() - ball.getRadius() < 0) {
            v.y = Math.abs(v.y * ball.getAttr('elasticity'));
            //log(a, u, v, t, s);
        }
        if (ball.getY() + ball.getRadius() > stage.getHeight()) {
            v.y = - Math.abs(v.y * ball.getAttr('elasticity'));
            //log(a, u, v, t, s);
        }
        v = {
            x : round(v.x, 2),
            y : round(v.y, 2)
        }
        s = {
            x : Math.min(ball.getX() + u.x * t + 0.5 * a.x * t * t, stage.getWidth()),
            y : Math.min(ball.getY() + u.y * t + 0.5 * a.y * t * t, stage.getHeight())
        }
        //log('befor ', s, v, u.x * t + 0.5 * a.x * t * t, u.y * t + 0.5 * a.y * t * t);
        // limit the ball within the stage
        // if (s.x < 0 + ball.getRadius()) s.x = 0 + ball.getRadius();
        // if (s.y < 0 + ball.getRadius()) s.y = 0 + ball.getRadius();
        // if (s.x > stage.getWidth() - ball.getRadius()) s.x = stage.getWidth() - ball.getRadius();
        // if (s.y > stage.getHeight() - ball.getRadius()) s.y = stage.getHeight() - ball.getRadius();

        //log('after ', s, v);
        ifBounce();
        ball.setX(round(s.x, 2));
        ball.setY(round(s.y, 2));

        // if (frame.time % 5 == 0) console.log(a, u, v, t, s);

        // ball.setX(Math.min(round(s.x, 2), stage.getWidth() - ball.getRadius()));
        // ball.setY(Math.min(round(s.y, 2), stage.getHeight() - ball.getRadius()));
        //console.log(ball.getRadius(), ball.getX(), ball.getY())
    }, layer);

    anim.start();
}