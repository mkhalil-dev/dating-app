const dating_app = {}

dating_app.baseURL = "http://127.0.0.1:8000/api";

dating_app.Console = (title, values, oneValue = true) => {
    console.log('---' + title + '---');
    if(oneValue){
        console.log(values);
    }else{
        for(let i =0; i< values.length; i++){
            console.log(values[i]);
        }
    }
    console.log('--/' + title + '---');
}

dating_app.postAPI = async (api_url, api_data, api_token = null) => {
    try{
        return await axios.post(
            api_url,
            api_data,
            { headers:{
                    'Authorization' : "token " + api_token
                }
            }
        );
    }catch(error){
        dating_app.Console("Error from POST API", error);
    }
}

dating_app.getAPI = async (api_url) => {
    try{
        return await axios(api_url);
    }catch(error){
        dating_app.Console("Error from GET API", error);
    }
}

dating_app.loadPage = (page) => {
    eval("dating_app.load_" + page + "();");
}

const userId = () => {
    return localStorage.getItem("id");
}

const userToken = () => {
    return localStorage.getItem("token");
}

dating_app.load_login = (retry = false) => {
    const loginBtn = document.getElementById("login-btn")
    const warningbox = document.querySelector(".loginpage").getElementsByTagName("p")[0];
    if(retry) warningbox.innerText = "Incorrect user or password"
    loginBtn.addEventListener('click', function() {
        this.removeEventListener('click', arguments.callee);
        login()
    })
}

const login = async () => {
    const login_url = `${dating_app.baseURL}/login`
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = new FormData();
    loginData.set("email", email)
    loginData.set("password", password)
    const response = await dating_app.postAPI(login_url, loginData)
    const data = await response.data
    data["status"] == "Success" ? authenticate(data["userid"], data["token"], "login") : dating_app.load_login(true)
    if(data["status"] == "Success") window.location.href = "./main.html";
}

const authenticate = (id, authToken, type) => {
    if(type == "login"){
        const warningbox = document.querySelector(".loginpage").getElementsByTagName("p")[0];
        warningbox.style.color = "green"
        warningbox.innerText = "Logged in"
    }else if (type == "signup"){
        const notifybox = document.getElementById("notify");
        notifybox.style.color = "green"
        notifybox.innerText = "Signed up"
        window.location.href = "./main.html";
    }
    localStorage.setItem("id", id)
    localStorage.setItem("token", authToken)
}

dating_app.load_signup = (retry = false) => {
    const joinBtn = document.getElementById("signup-btn")
    if (retry) {
        const warningbox = document.getElementById("email-warn");
        warningbox.innerText = "Email already in-use"
    }
    joinBtn.addEventListener('click', function() {
        this.removeEventListener('click', arguments.callee);
        signup()
    })
}

const profileFormData = () => {
    let gender, favgender;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    if (document.getElementById('male').checked) gender = document.getElementById('male').value;
    else if (document.getElementById('female').checked) gender = document.getElementById('female').value;
    if (document.getElementById('male-target').checked) favgender = document.getElementById('male-target').value;
    else if (document.getElementById('female-target').checked) favgender = document.getElementById('female-target').value;
    else if (document.getElementById('any-target').checked) favgender = document.getElementById('any-target').value;
    const joinData = new FormData();
    joinData.set("email", email)
    joinData.set("password", password)
    joinData.set("name", name)
    joinData.set("dob", dob)
    joinData.set("gender", gender)
    joinData.set("favgender", favgender)
    return joinData;
}

dating_app.load_editProfile = () => {
    menu_load()
    const updateBtn = document.getElementById("update")
    updateBtn.addEventListener('click', update)
}

const update = async () => {
    let gender, favgender;
    let password = document.getElementById("password");
    let name = document.getElementById("name");
    let dob = document.getElementById("dob");
    if(name) name = document.getElementById("name").value;
    if(password) password = document.getElementById("password").value;
    if(dob) dob = document.getElementById("dob").value;
    if (document.getElementById('male').checked) gender = document.getElementById('male').value;
    else if (document.getElementById('female').checked) gender = document.getElementById('female').value;
    if (document.getElementById('male-target').checked) favgender = document.getElementById('male-target').value;
    else if (document.getElementById('female-target').checked) favgender = document.getElementById('female-target').value;
    else if (document.getElementById('any-target').checked) favgender = document.getElementById('any-target').value;
    const joinData = new FormData();
    if(password) joinData.set("password", password)
    if(name) joinData.set("name", name)
    if(dob) joinData.set("dob", dob)
    if(gender) joinData.set("gender", gender)
    if(favgender) joinData.set("favgender", favgender)
    const imageInput = document.getElementById("avatar").files[0]
    const image = await toBase64(imageInput);
    joinData.set("image", image)
    const update_url = `${dating_app.baseURL}/user/${userId()}`
    const response = await dating_app.postAPI(update_url, joinData)
    if(response.data.status == "Success"){
        const responseMessage = document.getElementById("response");
        responseMessage.innerText = "Profile Edited Successfully!"
    }
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const signup = async () => {
    const signup_url = `${dating_app.baseURL}/user`
    const joinData = profileFormData();
    const response = await dating_app.postAPI(signup_url, joinData)
    const data =  await response.data
    if(data && response.data["status"] == "Success") return authenticate(data.data["id"], data.data["auth_token"], "signup");
    dating_app.load_signup(true)
}

dating_app.load_matches = async () => {
    menu_load();
    const matchesBox = document.querySelector(".card-container");
    const getMatchesURL = `${dating_app.baseURL}/getusers/${userId()}`
    const matchesData = new FormData();
    matchesData.set("authToken", userToken())
    const response = await dating_app.postAPI(getMatchesURL, matchesData)
    const data = await response.data.data
    data.forEach(match => {
        const age = getAge(match.dob)
        matchesBox.insertAdjacentHTML('beforeend', '<div id="'+match.id+'" class="card card0"><div class="card-border"><h2>'+match.name+'</h2><h2 style="font-size: 14px;">'+age+' Years old</h2><div class="icons"><i id="like-'+match.id+'" class="favorite fa fa-regular fa-heart" aria-hidden="true"></i><i id="message-'+match.id+'" class="message fa fa-regular fa-message" aria-hidden="true"></i><i id="block-'+match.id+'" class="block fa fa-light fa-ban" aria-hidden="true"></i></div></div></div>')
    });
    addMessageListeners()
    addFavListeners()
    addBanListeners()
}

const getAge = (dateString) => {
    let ageInMilliseconds = new Date() - new Date(dateString);
    return Math.floor(ageInMilliseconds/1000/60/60/24/365);
 }

const menu_load = () => {
   const loginLink = document.getElementById("nav-login")
   const signupLink = document.getElementById("nav-signup")
   if(userId() && userToken()){
    signupLink.innerHTML = "<li>Logout</li>"
    loginLink.innerHTML = "<li>Message Center</li>"
    loginLink.href = "./center.html"
    signupLink.addEventListener('click', (e) => {
        localStorage.clear();
        window.location.reload()
        e.preventDefault()
    })
   }
}

const addMessageListeners = () => {
    document.querySelectorAll(".message").forEach(icon => {
        icon.addEventListener('click', (e) => {
            targetId = e.target.id.split("-")[1];
            window.location.href = "./message.html?="+targetId;
        })
    });
}

const addFavListeners = async () => {
    const getFavoritesURL = `${dating_app.baseURL}/getfavorites/${userId()}`
    const favoriteURL = `${dating_app.baseURL}/favorite`
    const unfavoriteURL = `${dating_app.baseURL}/unfavorite`
    const response = await dating_app.getAPI(getFavoritesURL)
    const data = await response.data.data
    document.querySelectorAll(".favorite").forEach(element => {
        favId = element.id.split("-")[1];
        data.includes(favId) ? favListener(element, favId, unfavoriteURL, false) : favListener(element, favId, favoriteURL)
    });
}

const favListener = (button, id, url, favorite = true) => {
    const favoriteURL = `${dating_app.baseURL}/favorite`
    const unfavoriteURL = `${dating_app.baseURL}/unfavorite`
    if(!favorite) {
        button.classList.add("fa-solid")
        button.style.color="red"
        button.classList.remove("fa-regular")
    } else {
        button.style.color=""
        button.classList.remove("fa-solid")
        button.classList.add("fa-regular")
    }
    const like = document.getElementById("like-"+id);
    like.addEventListener('click', function(e){
        const favData = new FormData();
        favData.set("id", userId());
        favorite ? favData.set("favorite", id) : favData.set("unfavorite", id);
        dating_app.postAPI(url, favData);
        e.stopPropagation();
        this.removeEventListener('click', arguments.callee);
        if(!favorite) favListener(like, id, favoriteURL)
        else favListener(like, id, unfavoriteURL, false)
    })
}

const addBanListeners = async () => {
    const blockURL = `${dating_app.baseURL}/block`
    document.querySelectorAll(".block").forEach(element => {
        blockId = element.id.split("-")[1];
        banListener(element, blockId, blockURL)
    });
}

const banListener = (button, id, url, blockStatus = false) => {
    const blockURL = `${dating_app.baseURL}/block`
    const unblockURL = `${dating_app.baseURL}/unblock`
    if(blockStatus) button.style.color="red";
    else button.style.color="";
    const block = document.getElementById("block-"+id);
    block.addEventListener('click', function(e){
        const blockData = new FormData();
        blockData.set("id", userId());
        blockStatus ? blockData.set("unblock", id) : blockData.set("block", id);
        dating_app.postAPI(url, blockData);
        e.stopPropagation();
        this.removeEventListener('click', arguments.callee);
        if(blockStatus) banListener(block, id, blockURL)
        else banListener(block, id, unblockURL, true)
    })
}

dating_app.load_center = async () => {
    menu_load()
    let addedContacts = [];
    const contactBox = document.querySelector(".card-container");
    const getContactsURL = `${dating_app.baseURL}/contacts/${userId()}`
    const response = await dating_app.getAPI(getContactsURL)
    const data = await response.data.data
    data.forEach(contact => {
        let contactInfo, contactId;
        if(contact.sender_id == userId()){
            contactId = contact.receiver_id
            contactInfo = contact.receiver_info;
        } else {
            contactId = contact.sender_id;
            contactInfo = contact.sender_info;
        }
        if(addedContacts.includes(contactId) || !contactInfo) return;
        addedContacts.push(contactId)
        contactBox.insertAdjacentHTML('beforeend', '<div style="cursor: pointer;" id="'+contactId+'" class="card card0"><div class="card-border"><h2>'+contactInfo.name+'</h2></div></div>')
        document.getElementById(contactId).addEventListener('click', function(e){
            target = e.target.parentNode.id;
            window.location.href = "./message.html?="+target;
        })
    });
}

dating_app.load_main = () => {
    menu_load()
}

dating_app.load_message = async () => {
    menu_load()
    const target = window.location.search.split("=")[1];
    const loadMessagesURL = `${dating_app.baseURL}/messages/${userId()}/${target}`
    const response = await dating_app.getAPI(loadMessagesURL)
    const sendBtn = document.getElementById("send-btn");
    const data = await response.data.data
    displayMessages(data)
    sendBtn.addEventListener('click', () => {
        sendMessage(target)
    })
}



const displayMessages = (data) => {
    const chatBox = document.getElementById("chat-box");
    data.forEach(message => {
        let time;
        if(message.created_at) {
            time = message.created_at.split("T")[1].split(":")
            time.pop()
            time = time.join(":")
        }
        if(message.sender_id==userId()){
            chatBox.insertAdjacentHTML('afterbegin', '<div class="container-chat"><p style="text-align: right;">'+message.content+'</p><span class="time-right">'+time+'</span></div>')
        } else {
            chatBox.insertAdjacentHTML('afterbegin', '<div class="container-chat darker-chat"><p>'+message.content+'</p><span class="time-left">'+time+'</span></div>')
        }
    });
}

const sendMessage = (targetId) => {
    const messageURL = `${dating_app.baseURL}/sendmessage`
    const message = document.getElementById("text-box").value;
    document.getElementById("text-box").innerText = "";
    const chatBox = document.getElementById("chat-box");
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes()
    chatBox.insertAdjacentHTML('afterbegin', '<div class="container-chat"><p style="text-align: right;">'+message+'</p><span class="time-right">'+time+'</span></div>')
    const messageForm = new FormData();
    messageForm.set("sender_id", userId())
    messageForm.set("receiver_id", targetId)
    messageForm.set("content", message)
    dating_app.postAPI(messageURL, messageForm)
}