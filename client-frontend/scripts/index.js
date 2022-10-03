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

const signup = async () => {
    let gender, favgender;
    const signup_url = `${dating_app.baseURL}/user`
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
    const response = await dating_app.postAPI(signup_url, joinData)
    const data =  await response.data
    if(data && response.data["status"] == "Success") return authenticate(data.data["id"], data.data["auth_token"], "signup");
    dating_app.load_signup(true)
}

dating_app.load_matches = async () => {
    const matchesBox = document.querySelector(".card-container");
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const getMatches = `${dating_app.baseURL}/getusers/${id}`
    const matchesData = new FormData();
    matchesData.set("authToken", token)
    const response = await dating_app.postAPI(getMatches, matchesData)
    const data = await response.data.data
    dating_app.Console("Feed API", data, false)
    data.forEach(match => {
        matchesBox.insertAdjacentHTML('beforeend', '<div id="'+match.id+'" class="card card0"><div class="card-border"><h2>'+match.name+'</h2><div class="icons"><i id="like-'+match.id+'" class="fa fa-regular fa-heart" aria-hidden="true"></i></div></div></div>')
    });
}
