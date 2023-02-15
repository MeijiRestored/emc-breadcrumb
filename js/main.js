var marker = null;
var first = 1;
var run = 1;
var prevT = Date.now();
var prev = [0, 0];

$(document).ready(function () {
  document.getElementById("name").value = localStorage.getItem("ign");
});

/**
 * Start following the player.
 * @param {String} player IGN of player to follow.
 */
function startTrace(player) {
  // Get location every 2 seconds
  setInterval(function () {
    if (run === 1) {
      var found = 0;
      var URL = `https://sus-9jn4.onrender.com/https://earthmc.net/map/aurora/standalone/MySQL_update.php?world=earth&ts=${Date.now()}`;
      var res = {};
      fetch(URL, {
        method: "GET",
        cache: "default",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then(function (response) {
          res = response.json().then((data) => {
            for (let i in data["players"]) {
              var Cplayer = "";
              if (
                (Cplayer = data["players"][i]["name"].endsWith(
                  '<span style="font-style:normal normal"></span>'
                ))
              ) {
                Cplayer = Cplayer = data["players"][i]["name"].slice(
                  0,
                  data["players"][i]["name"].length - 46
                );
              } else {
                Cplayer = data["players"][i]["name"];
              }
              if (player == Cplayer) {
                found = 1;
                var coords = [
                  -data["players"][i]["z"] - 64,
                  data["players"][i]["x"],
                ];
                if (data["players"][i]["world"] == "-some-other-bogus-world-") {
                  document.getElementById("status").innerHTML =
                    'Status<br><font color="#ff2200">Hidden</font>';
                  if (first === 0) {
                    marker.setOpacity(0.5);
                  }
                } else {
                  document.getElementById("status").innerHTML =
                    'Status<br><font color="#22ff00">Visible</font>';
                  if (first === 1) {
                    first = 0;
                    var Icon = L.icon({
                      iconUrl:
                        "https://raw.githubusercontent.com/32Vache/emc-breadcrumb/main/assets/round.png",
                      iconSize: [16, 16],
                      iconAnchor: [8, 8],
                    });
                    marker = L.marker(coords, {
                      icon: Icon,
                    }).addTo(emcmap);
                    prev = coords;
                    prevT = Date.now();
                    emcmap.panTo(coords);
                  } else {
                    var dist = Math.sqrt(
                      (coords[0] - prev[0]) ** 2 + (coords[1] - prev[1]) ** 2
                    );
                    if (dist > 100) {
                      L.polyline([[prev[0], prev[1]], coords], {
                        color: "red",
                        opacity: 0.5,
                        dashArray: "10, 10",
                        dashOffset: "10",
                      }).addTo(emcmap);
                      prev = coords;
                      prevT = Date.now();
                      marker.setLatLng(coords);
                      emcmap.panTo(coords);
                    } else if (dist === 0) {
                      prev = coords;
                      prevT = Date.now();
                    } else {
                      var color = "#FF0000";
                      var speed = dist / (Date.now() - prevT);
                      speed = speed * 1000;
                      if (speed < 1) {
                        color = "#FF0000";
                      } else if (speed < 4) {
                        color = "#FF6600";
                      } else if (speed < 7) {
                        color = "#FFFF00";
                      } else if (speed < 12) {
                        color = "#99FF00";
                      } else if (speed < 15) {
                        color = "#00FF00";
                      } else if (speed < 20) {
                        color = "#0066FF";
                      } else {
                        color = "#0000FF";
                      }
                      L.polyline([[prev[0], prev[1]], coords], {
                        color: color,
                      }).addTo(emcmap);
                      prev = coords;
                      prevT = Date.now();
                      marker.setLatLng(coords);
                      emcmap.panTo(coords);
                    }

                    marker.setOpacity(1);
                  }
                }
                break;
              }
            }
            if (found === 0) {
              // Player is offline. Stop program.
              marker.setOpacity(0);
              document.getElementById("status").innerHTML =
                'Status<br><font color="#666666">Offline</font><br>The program has stopped.<br>Refresh to page to restart.';
              run = 0;
              return;
            }
          });
        })
        .catch(function () {
          console.log("error lol");
        });
    } else {
      clearInterval(interval);
    }
  }, 2000);
}

function start() {
  var found = 0;
  var name = document.getElementById("name").value;
  var URL = `https://sus-9jn4.onrender.com/https://earthmc.net/map/aurora/standalone/MySQL_update.php?world=earth&ts=${Date.now()}`;
  var res = {};
  fetch(URL, {
    method: "GET",
    cache: "default",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      res = response.json().then((data) => {
        for (let i in data["players"]) {
          var Cplayer = "";
          if (
            (Cplayer = data["players"][i]["name"].endsWith(
              '<span style="font-style:normal normal"></span>'
            ))
          ) {
            Cplayer = Cplayer = data["players"][i]["name"].slice(
              0,
              data["players"][i]["name"].length - 46
            );
          } else {
            Cplayer = data["players"][i]["name"];
          }
          if (name == Cplayer) {
            found = 1;
            $("#IGN").hide();
            document.getElementById("speed").innerHTML =
              '<div style="display: flex"><div style="flex-wrap: flex; margin-right: 8px">Speed</div><div style="flex-wrap: flex; margin-right:4px"><i>Slow</i></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #FF0000"></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #FF6600"></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #FFFF00"></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #99FF00"></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #00FF00"></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #0066FF"></div><div style="flex-wrap: flex; height: 20px; width: 30px; background-color: #0000FF"></div><div style="flex-wrap: flex; margin-left:4px"><i>Fast</i></div></div>';
            localStorage.setItem("ign", name);
            startTrace(name);
          }
        }
        if (found === 0) {
          document.getElementById("title").innerHTML =
            "Player not found. Make sure to input your /nick if you have one, instead of your IGN.<br>You must also be logged in the server for this to work.";
        }
      });
    })
    .catch(function () {
      console.log("error lol");
    });
}
