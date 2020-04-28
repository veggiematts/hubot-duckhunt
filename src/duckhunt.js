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
        room = res.message.room;
        if (Array.isArray(games[room])) {
            res.send("There is already a hunt!");
        } else {
            res.send("The hunt starts now!");
            games[room] = new Array();
            games[room]['scores'] = new Array();
            games[room]['lastspoke'] = Date.now();
            games[room]['throttle'] =  Math.floor(Math.random() * Math.floor(maxthrottle));
            games[room]['duck'] =  false;
            games[room]['ducks'] = 0;
            games[room]['timer'] = setInterval(launch, 1000, room);
        }
    })

    robot.respond(/stophunt/gi, (res) => {
        stopHunt(res);
    })

    function launch(room) {
        if (games[room] && games[room]['duck'] == false && Date.now() > games[room]['lastspoke'] + games[room]['throttle']) {
            robot.messageRoom(room, "\\_o< quack!");
            games[room]['duck'] = true;
            games[room]['ducks'] += 1;
            games[room]['lastspoke'] = Date.now();
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
        if (games[room]['duck']) {
            res.reply("\\_x< : +1 (" + ((Date.now() - games[room]['lastspoke']) / 1000) + " seconds)");
            games[room]['scores'][user] = games[room]['scores'][user] ? games[room]['scores'][user] + 1 : 1;
            games[room]['duck'] = false;
            games[room]['throttle'] =  Math.floor(Math.random() * Math.floor(maxthrottle));
            games[room]['lastspoke'] = Date.now();
        } else {
            res.reply("There was no duck: -1");
            games[room]['scores'][user] = games[room]['scores'][user] ? games[room]['scores'][user] - 1 : -1;
        }
        if (games[room]['ducks'] == maxducks) {
            stopHunt(res);
        }
    })
}
