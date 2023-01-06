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
    e.preventDefault();
    if (checkValidity(username)) {
        try {
            let response = await fetch(`https://api.github.com/users/`+username);
            let obj = await response.json();
            if (response.status != 200) {
                if(response.status == 404){
                    showAlert("User not Found!");
                }
                else if(response.status==403){
                    showAlert("Couldn't fetch! Rate limit exceeded!");
                }
                else{
                    showAlert("Unknown error!");
                }
                return Promise.reject(`Request failed with error ${response.status}`);
            }
            setInfo(obj);

            let data = await JSON.parse(window.localStorage.getItem(username));
            console.log(data);
            if (data != null) {
                savedAnswerCard.style.display = "block";
                setSavedAnswer(data);
            } else {
                savedAnswerCard.style.display = "none";
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        showAlert("Invalid input!");
    }
}

function setInfo(obj) {
    
    avatar.innerHTML = '<img src="' + obj.avatar_url + '"alt="avatar" class="avatar">';
    full_name.innerHTML = '<span>' + obj.name + '</span>';
    blog.innerHTML = '<span>' + obj.blog + '</span>';
    location1.innerHTML = '<span>' + obj.location + '</span>'
    bio.innerHTML =  '<span>' + obj.bio + '</span>'
}


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


function showAlert(title) {
    actionResult.style.display = "block";
    actionResult.innerHTML = "<span>" + title + "</span>";
    setTimeout(() => {
        actionResult.style.display = "none";
    }, 4000);
}

submitButton.addEventListener('click', getInfo);
clearButton.addEventListener('click', removeSavedAnswer);
window.localStorage.clear();
