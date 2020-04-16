const database = firebase.database();
const auth = firebase.auth()

auth.onAuthStateChanged(function(user)
{
    if(user) {
        const page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        if (page == "index.html")
        {
            window.location = "game.html";
        }
        var checkuser = database.ref('users/' + user.uid).once('value').then(function(snapshot) {
           if (snapshot.val() == null)
           {
               database.ref('users/' + user.uid).update({
                   r: 0
               });
           }
        });
        database.ref("users/" + auth.currentUser.uid).update({
           r: 1,
           t: "hello, world!"
        });

    }
    else
    {
        const page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        if (page == "game.html")
        {
            window.location= "index.html";
        }

    }
});

function setPos()
{
    var x = (event.clientX/window.innerWidth) * 100;
    var y = (event.clientY/window.innerHeight) * 100;
    database.ref('users/' + auth.currentUser.uid).update({
       x: x,
       y: y
    });
}

function createAccount(email, password)
{
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        alert(error.message);
    });
}

function login(email, password)
{
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
       alert(error.message);
    });
}

function logout()
{
    database.ref("users/" + auth.currentUser.uid).update({
        r: 0
    });
    auth.signOut();
}

function settext()
{
    database.ref("users/" + auth.currentUser.uid).update({
        t: document.getElementById("text").value
    });
}

database.ref('users').on('value', function(snapshot) {
    var results = Object.values(snapshot.val());
    document.getElementById('clickable').innerHTML = "";
    for (var i = 0; i < results.length; i ++)
    {
        if (results[i].r != 0)
        {
            var players = document.createElement("DIV");
            players.style.width = "50px";
            players.style.height = "50px";
            players.style.position = "absolute";
            players.style.transition = "left .5s, top .5s"
            players.style.transitionTimingFunction = "ease-out";
            players.style.background = "green";
            players.style.left = results[i].x + "%";
            players.style.top = results[i].y + "%";
            document.getElementById("clickable").appendChild(players);
            var text = document.createElement("P");
            text.innerText = results[i].t;
            text.style.width = "100px";
            text.style.display = "inline-text"
            text.style.transform = "translate(0%, -50px)"
            players.appendChild(text);

        }
    }
});

window.onbeforeunload = function(){
    database.ref("users/" + auth.currentUser.uid).update({
        r: 0
    });
}