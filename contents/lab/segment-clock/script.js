$(document).ready(function() {
    var map = {
        "0" : [4, 2, 0, 2, 4, 2, 0, 6, 4, 6, 6, 0],
        "1" : [4, 2, 0, 1, 5, 2, 0, 6, 0, 2, 6, 0],
        "2" : [4, 2, 0, 2, 2, 2, 1, 6, 5, 6, 6, 0],
        "3" : [4, 2, 1, 2, 5, 6, 1, 6, 5, 0, 6, 0],
        "4" : [4, 2, 1, 0, 5, 6, 0, 6, 2, 0, 6, 0],
        "5" : [4, 2, 2, 6, 4, 6, 0, 2, 2, 0, 6, 2],
        "6" : [4, 2, 1, 6, 5, 6, 0, 2, 4, 6, 6, 2],
        "7" : [4, 2, 1, 2, 5, 0, 6, 6, 2, 0, 6, 0],
        "8" : [0, 6, 0, 2, 6, 0, 0, 6, 2, 6, 6, 0],
        "9" : [0, 6, 0, 2, 6, 2, 1, 2, 2, 5, 6, 0]
    };

    var setDigit = function(digitId, val) {
        var dirs = map[val];
        $(digitId).find('.edge').each(function(index, el) {
            $(el).css('transform', 'rotateZ(' + (dirs[index] * 45) + 'deg)');
        });
    }

    var func = function() {
        var date = new Date();
        var hour = ("0" + date.getHours()).slice(-2);

        setDigit("#hour1", hour.slice(0,1));
        setDigit("#hour0", hour.slice(1,2));

        var min = ("0" + date.getMinutes()).slice(-2);

        setDigit("#min1", min.slice(0,1));
        setDigit("#min0", min.slice(1,2));

        var sec = ("0" + date.getSeconds()).slice(-2);

        setDigit("#sec1", sec.slice(0,1));
        setDigit("#sec0", sec.slice(1,2));

        $('.marker').toggleClass('blink');
    }

    setInterval(func, 1000);
});