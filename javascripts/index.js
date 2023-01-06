//the following lines are used to connect the js file to the html file
const usernameInput = document.querySelector('#username');
const submitButton = document.querySelector('.submit');
const avatar = document.querySelector('.avatar');
const full_name = document.querySelector('.full_name');
const blog = document.querySelector('.blog');
const location1 = document.querySelector('.location1');
const bio = document.querySelector('.bio');
const actionResult = document.querySelector('.action_result');

async function getInfo(e) {
    let username = usernameInput.value;
    //we'll check to see if the username is available at local storage
    let data = await JSON.parse(window.localStorage.getItem(username));
    e.preventDefault();
    if (checkValidity(username)) {
        try {
            if(data !=null){
                //if it was in the local storage, it is loaded from there
                setInfo(data)
                showAlert("Loaded from Local Storage");
            }
            //if not available in local storage, we'll get it from the api
            let response = await fetch(`https://api.github.com/users/`+username);
            let obj = await response.json();
            //if response isn't successful (response isn't 200), we'll have to show proper error message
            if (response.status != 200) {
                if(response.status == 404){
                    showAlert("User not Found!");
                }
                else{
                    showAlert("Unknown error!");
                }
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            setInfo(obj);
            //we'll store the username in the local storage
            window.localStorage.setItem(username, JSON.stringify(obj));
        } catch (e) {
            //network error handling is done here
            console.log(e);
            if(e.message == "NetworkError when attempting to fetch resource."){
                showAlert("Network error");
            }
        }
    } else {
        showAlert("Invalid input!");
    }
}
//we'll show the data here
//if it is null, it will simply show a dash as a sign
function setInfo(obj) {
    avatar.innerHTML = '<img src="' + obj.avatar_url + '"alt="avatar" class="avatar">';
    if(obj.name==null)
        full_name.innerHTML = '<span>' + "Full Name: -" + '</span>';
    else
        full_name.innerHTML = '<span>' + "Full Name: " + obj.name + '</span>';
    if(obj.blog=="")
        blog.innerHTML = '<span>' + "Blog Address: -"  + '</span>';
    else
        blog.innerHTML = '<span>' + "Blog Address: " + obj.blog + '</span>';
    if(obj.location==null)
        location1.innerHTML = '<span>' + "Location: -" + '</span>';
    else
        location1.innerHTML = '<span>' + "Location: " + obj.location + '</span>';
    if(obj.bio==null)
        bio.innerHTML =  '<span>' + "Biography: -" + '</span>';
    else
        bio.innerHTML =  '<span>' + "Biography:\n" + obj.bio + '</span>';
}
//here, basic github username rules are checked
//no more than 39 char, no two consecutive hyphens, no starting and ending with hyphen
function checkValidity(username) {
    const regex1 = /[A-Za-z/d^((-)\2?(?!\2))+$]+/g;
    const regex2 = /[./?/$/+/#/=/,/~/`]+/g;
    const foundValid = username.match(regex1);
    const foundNotValid = username.match(regex2);
    if(username.length > 39){
        return false;
    }
    if (username.charAt(0)=="-" || username.charAt(username.length-1)=="-"){
        return false;
    }
    for (var i = 0; i < username.length-1; i++) {
        if(username.charAt(i)=="-"){
            if(username.charAt(i+1)=="-"){
                return false;
            }
        }
      }
    if (foundNotValid == null && foundValid.length > 0) {
        return true;
    }
    return false;
}

//this function is for error messages. it simply shows the error message and then disappears.
function showAlert(title) {
    actionResult.style.display = "block";
    actionResult.innerHTML = "<span>" + title + "</span>";
    setTimeout(() => {
        actionResult.style.display = "none";
    }, 4000);
}

submitButton.addEventListener('click', getInfo);
window.localStorage.clear();
