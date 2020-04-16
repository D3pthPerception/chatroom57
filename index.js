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



window.onbeforeunload = function(){
    database.ref("users/" + auth.currentUser.uid).update({
        r: 0
    });
}