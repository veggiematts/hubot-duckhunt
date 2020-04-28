// Description:
//    A DuckHunt game. Let's shoot some ducks!
//    (no ducks were harmed in the making of this script)
//
// Dependencies:
//    None
//
// Configuration:
//    HUBOT_DUCKHUNT_DUCKS - Number of ducks during a hunt, default: 5
//    HUBOT_DUCKHUNT_MAXDELAY - Maximum number of seconds before a new duck appears, default: 90
//
// Commands:
//    hubot starthunt - starts a DuckHunt game
//    hubot stophunt - stops the current DuckHunt game
//    bang! - shoots the duck
//
// Author:
//    veggiematts

module.exports = (robot) => {

    var games = new Array();
    var maxthrottle = (process.env.HUBOT_DUCKHUNT_MAXDELAY || 90) * 1000;
    var maxducks = process.env.HUBOT_DUCKHUNT_DUCKS || 5;

    robot.respond(/starthunt/gi, (res) => {
        currentroom = res.message.room;
        if (Array.isArray(games[currentroom])) {
            res.send("There is already a hunt!");
        } else {
            res.send("The hunt starts now!");
            games[currentroom] = new Array();
            games[currentroom]['scores'] = new Array();
            games[currentroom]['lastspoke'] = Date.now();
            games[currentroom]['throttle'] =  Math.floor(Math.random() * Math.floor(maxthrottle));
            games[currentroom]['duck'] =  false;
            games[currentroom]['ducks'] = 0;
            games[currentroom]['timer'] = setInterval(function() {
                launch(currentroom);
            }, 1000);
        }
    })

    robot.respond(/stophunt/gi, (res) => {
        stopHunt(res);
    })

    function launch(currentroom) {
        if (games[currentroom]['duck'] == false && Date.now() > games[currentroom]['lastspoke'] + games[currentroom]['throttle']) {
            robot.messageRoom(currentroom, "\\_o< quack!");
            games[currentroom]['duck'] = true;
            games[currentroom]['ducks'] += 1;
            games[currentroom]['lastspoke'] = Date.now();
        }
    }

    function stopHunt(res) {
        room = res.message.room;
        if (Array.isArray(games[room])) {
            res.send("The hunt stops now!");
            scores = "Scores: ";
            for (var key in games[room]['scores']) {
                scores += key + ": " + games[room]['scores'][key] + " ";
            }
            res.send(scores);
            clearInterval(games[room]['timer']);
            delete games[room];
        } else {
            res.reply("There is no hunt!");
        }
    }

    robot.hear(/bang!/gi, (res) => {
        user = res.envelope.user.name;
        room = res.message.room;
        if (!Array.isArray(games[room])) {
            res.reply("There is no hunt!");
            return;
        }
        if (games[currentroom]['duck']) {
            res.reply("\\_x< : +1 (" + ((Date.now() - games[currentroom]['lastspoke']) / 1000) + " seconds)");
            games[currentroom]['scores'][user] = games[currentroom]['scores'] ? games[currentroom]['scores'][user] + 1 : 1;
            games[currentroom]['duck'] = false;
            games[currentroom]['throttle'] =  Math.floor(Math.random() * Math.floor(maxthrottle));
            games[currentroom]['lastspoke'] = Date.now();
        } else {
            res.reply("There was no duck: -1");
            games[currentroom]['scores'][user] = games[currentroom]['scores'][user] ? games[currentroom]['scores'][user] - 1 : -1;
        }
        if (games[currentroom]['ducks'] == maxducks) {
            stopHunt(res);
        }
    })
}
