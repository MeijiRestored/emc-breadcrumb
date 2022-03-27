var polyline = null;
var marker = null;
var first = 1;
var run = 1;
/**
 * Start following the player.
 * @param {String} player IGN of player to follow.
 */
function startTrace(player) {
  // Get location every 2 seconds
  setInterval(function () {
    if (run === 1) {
      var found = 0;
      var URL = `https://emc-color.herokuapp.com/update.json`;
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
                      iconUrl: "https://raw.githubusercontent.com/32Vache/emc-breadcrumb/main/assets/round.png",
                      iconSize: [16, 16],
                      iconAnchor: [8, 8],
                    });
                    marker = L.marker(coords, {
                      icon: Icon,
                    }).addTo(emcmap);
                    polyline = L.polyline([coords, coords], {
                      color: "red",
                    }).addTo(emcmap);
                    emcmap.fitBounds(polyline.getBounds());
                  } else {
                    marker.setOpacity(1);
                    marker.setLatLng(coords);
                    polyline.addLatLng(coords);
                    emcmap.panTo(coords);
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
  var URL = `https://emc-color.herokuapp.com/update.json`;
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
