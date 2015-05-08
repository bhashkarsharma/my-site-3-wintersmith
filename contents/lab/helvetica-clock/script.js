var date; var hours; var minutes; var seconds;
var a = ['ITLISASTIME', 'ACQUARTERDC', 'TWENTYFIVEX', 'HALFBTENFTO', 'PASTERUNINE', 'ONESIXTHREE', 'FOURFIVETWO', 'EIGHTELEVEN', 'SEVENTWELVE', 'TENSEOCLOCK'];
var strNum = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'];
var map = function(val) {
    switch(val) {
        case 0:
        case 12:
            return 0;
        default:
            return val * 5;
    }
}

var getVagueMins = function(num) {
    var val = '';
    switch(num) {
        case 5:
        case 55:
            val = "FIVE";
            break;
        case 10:
        case 50:
            val = "TEN";
            break;
        case 15:
        case 45:
            val = "QUARTER";
            break;
        case 20:
        case 40:
            val = "TWENTY";
            break;
        case 25:
        case 35:
            val = "TWENTY FIVE";
            break;
        case 30:
            val = "HALF"; 
            break;
    }
    if (num == 0) {
    } else if (num > 30) {
        val += " TO ";
        hours++;
        hours = hours % 12 || hours;
    } else {
        val += " PAST ";
    }
    return val;
}

var act = function() {
    date = new Date();
    minutes = date.getMinutes();
    hours = date.getHours();
    hours = hours % 12 || hours;
    var b = map(Math.floor((minutes)/5));
    var time_str = "IT IS " + getVagueMins(b) + strNum[hours];
    if (!b) {
        time_str += " OCLOCK";
    }
    //console.log(time_str)
    var split_str = time_str.split(' ');
    var s = '';
    var j = 0;
    a.forEach(function(elem, index, array) {
        var found = [];
        s += '<div>';
        while(j<split_str.length) {
            var idx = elem.indexOf(split_str[j]);
            if (idx > -1) {
                found.push(idx);
                for (var k=1; k<split_str[j].length; k++) {
                    found.push(idx+k);
                }
            }
            else {
                break;
            }
            j++;
        }
        for (var i=0; i<elem.length; i++) {
            s += '<span class="';
            if (found.indexOf(i) >=0) {
                s += 'on';
            } else {
                s += 'off';
            }
            s += '">' + elem[i] + '</span>';
        }
        s += '</div>';
    });
    s += '<div>';
    for (var i=0; i<4; i++) {
        s += '<span class="';
        if (i<minutes%5) {
            s += 'on';
        } else {
            s += 'off';
        }
        s += '">o</span>';
    }
    s +='</div>';
    document.getElementById('glow').innerHTML = s;
    setTimeout('act();', 5000);
}

document.onload = act();