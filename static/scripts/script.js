$(document).ready(function () {
    show_comment();
    loadWeather();
});

//방명록 기능
function save_comment() {
    let name = $('#name').val()
    let comment = $('#comment').val()
    let password = $('#password').val()
    let time = new Date().toLocaleString();
    $.ajax({
        type: "POST",
        url: "/mainComment",
        data: {'name_give': name, 'comment_give': comment, 'password_give': password, 'time_give': time},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

function show_comment() {
    $('#comment-list').empty()
    $.ajax({
        type: "GET",
        url: "/mainComment",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let time = rows[i]['time']
                let temp_html = `<div class="card">
                                    <div class="row card-body">
                                        <div class="col-7 col-md-9">
                                            <blockquote class="blockquote mb-0">
                                                <p>${comment}</p>
                                                <footer class="blockquote-footer">${name}</footer>
                                                <p style="text-align: right; font-size: 12px">(${time})</p>
                                            </blockquote>
                                        </div>
                                        <div class="col-5 col-md-3" style="display: flex; flex-direction: column; justify-content: right; margin-top: auto">
                                            <label for="inputPassword2" class="visually-hidden">Password</label>
                                            <input type="password" class="form-control" id="inputPassword${i}" placeholder="Password">
                                            <div style="display: flex; justify-content: right; align-items: end;"">   
                                                <button class="btn btn-secondary btn-edit" onclick="put_comment(${i})" type="button" style="margin-right: 5px;">수정</button>
                                                <button class="btn btn-dark btn-edit" onclick="delete_comment(${i})" type="button">삭제</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                $('#comment-list').prepend(temp_html)
            }
        }
    });
}

function put_comment(i) {
    $.ajax({
        type: "GET",
        url: "/mainComment",
        data: {},
        success: function (response) {
            let inputPassword = $(`#inputPassword${i}`).val();
            if (inputPassword === response['comments'][i]['password']) {
                let name = response['comments'][i]['name'];
                let time = response['comments'][i]['time'];
                let comment = response['comments'][i]['comment']
                let password = response['comments'][i]['password']
                let newComment = prompt("내용을 입력하세요.");
                if(newComment!=null) {
                    let newTime = new Date().toLocaleString() + "(수정됨)";
                    $.ajax({
                        type: "PUT",
                        url: "/mainComment",
                        data: {
                            'name_give': name,
                            'comment_give': comment,
                            'password_give': password,
                            'time_give': time,
                            'newComment_give': newComment,
                            'newTime_give': newTime
                        },
                        success: function () {
                            alert("수정되었습니다.")
                            window.location.reload()
                        }
                    })
                }
            } else {
                alert("비밀번호가 틀렸습니다.")
            }
        }
    });
}

function delete_comment(i) {
    $.ajax({
        type: "GET",
        url: "/mainComment",
        data: {},
        success: function (response) {
            let inputPassword = $(`#inputPassword${i}`).val();
            if (inputPassword === response['comments'][i]['password']) {
                let name = response['comments'][i]['name']
                let comment = response['comments'][i]['comment']
                let password = response['comments'][i]['password']
                let time = response['comments'][i]['time']
                $.ajax({
                    type: "DELETE",
                    url: "/mainComment",
                    data: {'name_give': name, 'comment_give': comment, 'password_give': password, 'time_give': time},
                    success: function () {
                        alert("삭제되었습니다.")
                        window.location.reload()
                    }
                });
            } else {
                alert("비밀번호가 틀렸습니다.")
            }
        }
    });
}


// 사이드바 날씨 기능
const API_key = "2ee1ac0395d836ebc5fbd940ff0cbe80"
const weatherIcon = {
    '01' : 'fas fa-sun fa-5x',
    '02' : 'fas fa-cloud-sun fa-5x',
    '03' : 'fas fa-cloud fa-5x',
    '04' : 'fas fa-cloud-meatball fa-5x',
    '09' : 'fas fa-cloud-sun-rain fa-5x',
    '10' : 'fas fa-cloud-showers-heavy fa-5x',
    '11' : 'fas fa-poo-storm fa-5x',
    '13' : 'fas fa-snowflake fa-5x',
    '50' : 'fas fa-smog fa-5x',
}

function getWeather(lat, lon) {
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`,
        dataType: 'json',
        success: function (response) {
            console.log(response)
            let icon_num = response.weather[0].icon.substring(0,2)
            let temp = Math.floor(response.main.temp)
            let temp_max = Math.floor(response.main.temp_max)
            let temp_min = Math.floor(response.main.temp_min)
            let city = response.name
            let wind_speed = response.wind.speed

            $('#weather').append(`<i class="${weatherIcon[icon_num]}"></i>`)
            $('#temp').append(temp + '℃')
            $('#temp_max').append(temp_max + '℃')
            $('#temp_min').append(temp_min + '℃')
            $('#city').append(city)
            $('#wind_speed').append(wind_speed + 'm/s')
        }
    });
}

function saveGeo(geoData) {
    localStorage.setItem("GEO", JSON.stringify(geoData));
}

function handleGeoSucc(position) {
    console.log(position);
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const geoData = {
        latitude: lat,
        longitude: lon
    };
    saveGeo(geoData);
    getWeather(lat, lon);
}

function handleGeoErr(err) {
    alert("위치 정보를 받지 못해 [오늘의 날씨] 위젯을 표시하지 않습니다.");
    document.getElementById('aside').style.display = 'none';
    console.log(err);
}

function askWeather() {
    navigator.geolocation.getCurrentPosition(handleGeoSucc, handleGeoErr); // 유저의 현재 위치 정보를 요청하고, 성공하면 첫 번째 함수를, 실패하면 두 번째 함수를 실행.
}

function loadWeather() {
    const ladedWeather = localStorage.getItem("GEO");
    if (ladedWeather === null) {
        askWeather();
    } else {
        const parsedCoords = JSON.parse(ladedWeather);
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}