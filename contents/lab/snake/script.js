brick = function(selector) {
    var el = $(selector);
    var w = el.width();
    var h = el.height();
    var ctx = el[0].getContext('2d');
    var colors = {
        'bg' : '#acc4ac',
        'fg' : '#444'
    };
    // cell size
    var cs = 10;
    //draw a box with brick co-ordinates x, y and size cs
    var draw_brick = function(x, y, color, border) {
        if (color == undefined) color = colors.fg;
        if (border == undefined) border = colors.bg;
        ctx.fillStyle = color;
        ctx.strokeStyle = border;
        ctx.moveTo(x * cs, y * cs);
        ctx.lineTo((x + 1) * cs, y * cs);
        ctx.lineTo(x * cs, (y + 1 ) * cs);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc((x * cs) + cs/2, (y * cs) + cs/2, Math.round(cs/2 - 2), Math.PI * 3/4, Math.PI * 7/4, false);
        ctx.fillStyle = border;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc((x * cs) + cs/2, (y * cs) + cs/2, Math.round(cs/2 - 2), Math.PI * 7/4, Math.PI * 3/4, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        ctx.strokeWidth = 1;
        ctx.strokeStyle = color;
        ctx.strokeRect(x * cs, y * cs, cs, cs);
    }
    // clear screen
    var cls = function() {
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);
    }
    return {
        'cls' : cls,
        'draw_brick' : draw_brick,
        'w' : Math.floor(w/cs),
        'h' : Math.floor(h/cs)
    }
}

$(document).ready(function() {
    // initial direction
    var d = 'right';
    // number of ms before the snake moves again
    var speed = 100;
    //level
    var level = 0;
    // score
    var score = 0;
    var interval;
    var game = brick('#game');
    // the snake object
    var snake = {
        length : 5,
        body : [],
        init : function() {
            snake.length = 5;
            snake.body = [];
            for (var i=snake.length; i>0; i--) {
                //console.log(i)
                snake.body.push({ x : i, y : 20 });
                //console.log(JSON.stringify(snake.body), snake.body.length)
            }
            //console.log(JSON.stringify(snake.body))
        },
        draw : function() {
            game.cls();
            for (var i in snake.body) {
                game.draw_brick(snake.body[i].x, snake.body[i].y);
            }
        },
        move : function() {
            var head = snake.body[0];
            var dx = head.x;
            var dy = head.y;
            if (d == "left") {
                if (dx > 0) {
                    dx--;
                } else {
                    dx = game.w;
                }
            } else if (d == "right") {
                if (dx < game.w) {
                    dx++;
                } else {
                    dx = 0;
                } 
            }
            else if (d == "up") {
                if (dy > 0) {
                    dy--;
                } else {
                    dy = game.h;
                } 
            }
            else if (d == "down") {
                if (dy <= (game.h)) {
                    dy++;
                } else {
                    dy = 0;
                } 
            }

            // check for collision
            if (check_collision(snake, food)) {
                snake.length++;
                snake.body.unshift(food.body[0]);
                snake.draw();
                food.init();
                food.draw();
                score = score + 10;
                if (score > 0 && score % 100 == 0) {
                    console.log('score ', score)
                    level++;
                    console.log(level)
                    wall.init();
                }
            }

            var tail = snake.body.pop();
            tail.x = dx;
            tail.y = dy;
            snake.body.unshift(tail);
            //console.log(JSON.stringify(snake.body))
            snake.draw();

            // check for collision with self
            if (check_collision({ body : snake.body.slice(1) }, { body : [snake.body[0]] })) {
            //if (snake.body.indexOf(tail) != snake.body.lastIndexOf(tail)) {
                //console.log('Touched self!');
                game_over();
            }

            // check for collision with wall
            if (check_collision(snake, wall)) {
                game_over();
            }
        }
    };

    var levelgrid = {
        0 : function() {
            return [];
        },
        1 : function() {
            var list = [];
            for (var i=0; i<game.w; i++) {
                list.push({
                    x : i,
                    y : 0
                });
                list.push({
                    x : i,
                    y : game.h - 1
                });
            }
            for (var j=0; j<game.h; j++) {
                list.push({
                    x : 0,
                    y : j
                });
                list.push({
                    x : game.w - 1,
                    y : j
                });
            }
            return list;
        }
    };

    var wall = {
        body: [],
        init : function() {
            wall.body = levelgrid[Math.floor(level/2)]();
            console.log(wall.body)
        },
        draw : function() {
            for (var i in wall.body) {
                console.log(wall.body[i].x, wall.body[i].y);
                game.draw_brick(wall.body[i].x, wall.body[i].y);
            }
        }
    };

    var food = {
        body : [],
        length : 1,
        init : function() {
            do {
                food.body = [];
                for (var i=0; i < food.length; i++) {
                    food.body.push({
                        x : Math.round(Math.random() * game.w),
                        y : Math.round(Math.random() * game.h)
                    });
                }
            } while (check_collision(snake, food) || check_collision(wall, food))
        },
        draw : function() {
            for (var i in food.body) {
                game.draw_brick(food.body[i].x, food.body[i].y);
            }
        }
    };

    var check_collision = function(obj1, obj2) {
        if ((obj1.body) && (obj2.body)) {
            for (var i in obj1.body) {
                for (var j in obj2.body) {
                    if ((obj1.body[i].x == obj2.body[j].x) && (obj1.body[i].y == obj2.body[j].y)) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return null;
        }
    }

    //keyboard controls
    $(document).keydown(function(e) {
        var key = e.which;
        //clause to prevent reverse gear
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
        // prevent scrolling
        if (key == "40" || key == "38") e.preventDefault();
    });

    var start_game = function() {
        game.cls();
        d = 'right';
        wall.init();
        wall.draw();
        snake.init();
        snake.draw();
        food.init();
        food.draw();
        interval = setInterval(function() {
            snake.move(); 
            wall.draw(); 
            food.draw(); 
            $('#score').html(score); 
        }, speed);
    }
    start_game();

    var game_over = function() {
        if (typeof(interval) != "undefined") {
            clearInterval(interval);
        }
        if (confirm('Your score: ' + score + '. Start new game?')) {
            start_game();
        }
    }
});