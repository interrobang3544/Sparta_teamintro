$(document).ready(function () {
    show_comment();
});


//방명록 기능
function save_comment() {
    let name = $('#name').val()
    let comment = $('#comment').val()
    let password = $('#password').val()
    let time = new Date().toLocaleString();
    $.ajax({
        type: "POST",
        url: "/comment",
        data: {'name_give': name, 'comment_give': comment, 'password_give': password, 'time_give': time},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

function save_reply(i) {
    let postNum = i
    let name = $(`#name${i}`).val()
    let comment = $(`#comment${i}`).val()
    let password = $(`#password${i}`).val()
    let time = new Date().toLocaleString();
    $.ajax({
        type: "POST",
        url: "/reply",
        data: {
            'postNum_give': postNum,
            'name_give_reply': name,
            'comment_give_reply': comment,
            'password_give_reply': password,
            'time_give_reply': time
        },
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
        url: "/comment",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let time = rows[i]['time']
                let guestBook_card = `<div class="card${i} cardSet">
                                            <div class="card" style="border: 1px solid #e8344e;">
                                                <div class="row card-body">
                                                    <div class="col-7 col-md-9" onclick="openCloseToc(${i}, ${rows.length})" style="cursor: pointer">
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
                                            </div>

                                            <div class= post-reply id="post-reply${i}" style="display: none;">
                                                <div class="form-floating mb-3">
                                                    <input class="form-control" id="name${i}" placeholder="url" style="border-radius: 10px;" type="text">
                                                    <label for="floatingInput">닉네임</label>
                                                </div>
                                                <div class="form-floating mb-3">
                                                    <textarea class="form-control" id="comment${i}" placeholder="Leave a comment here"
                                                              style="height: 58px; border-radius: 10px;"></textarea>
                                                    <label for="floatingTextarea2">내용</label>
                                                </div>
                                                <div class="form-floating mb-3">
                                                    <input class="form-control" id="password${i}" placeholder="url" style="border-radius: 10px;" type="text">
                                                    <label for="floatingInput">수정 및 삭제에 필요한 비밀번호</label>
                                                </div>
                                                <button class="btn btn-dark" onclick="save_reply(${i})" type="button">댓글 남기기</button>
                                            </div>
                                            
                                            <div class="replyCard row" id="replyCard${i}">
                                            </div>
                                        </div>`
                $('#comment-list').prepend(guestBook_card)
            }
        }
    });
    $.ajax({
        type: "GET",
        url: "/reply",
        data: {},
        success: function (response) {
            let rows = response['replies']
            for (let i = 0; i < rows.length; i++) {
                let postNum = rows[i]['postNum']
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let time = rows[i]['time']
                let reply_card = `<div class="col-1" style="display: flex; justify-content: center; align-items: center">
                                    <div id="replyIcon"></div>
                                  </div>
                                  <div class="card col-11">
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
                                              <input type="password" class="form-control" id="inputPasswordReply${i}" placeholder="Password">
                                              <div style="display: flex; justify-content: right; align-items: end;"">   
                                                  <button class="btn btn-secondary btn-edit" onclick="put_reply(${i})" type="button" style="margin-right: 5px;">수정</button>
                                                  <button class="btn btn-dark btn-edit" onclick="delete_reply(${i})" type="button">삭제</button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`
                $(`#replyCard${postNum}`).append(reply_card)
            }
        }
    });
}

function put_comment(i) {
    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            let inputPassword = $(`#inputPassword${i}`).val();
            if (inputPassword === response['comments'][i]['password']) {
                let name = response['comments'][i]['name'];
                let time = response['comments'][i]['time'];
                let comment = response['comments'][i]['comment']
                let password = response['comments'][i]['password']
                let newComment = prompt("내용을 입력하세요.");
                if (newComment != null) {
                    let newTime = new Date().toLocaleString() + "(수정됨)";
                    $.ajax({
                        type: "PUT",
                        url: "/comment",
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

function put_reply(i, postNumEdit) {
    $.ajax({
        type: "GET",
        url: "/reply",
        data: {},
        success: function (response) {
            let inputPassword = $(`#inputPasswordReply${i}`).val();
            if (inputPassword === response['replies'][i]['password']) {
                let postNum = response['replies'][i]['postNum'];
                let name = response['replies'][i]['name'];
                let time = response['replies'][i]['time'];
                let comment = response['replies'][i]['comment']
                let password = response['replies'][i]['password']
                let newComment = prompt("내용을 입력하세요.");
                if (newComment != null) {
                    let newTime = new Date().toLocaleString() + "(수정됨)";
                    $.ajax({
                        type: "PUT",
                        url: "/reply",
                        data: {
                            'postNum_give': postNum,
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
        url: "/comment",
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
                    url: "/comment",
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

function delete_reply(i) {
    $.ajax({
        type: "GET",
        url: "/reply",
        data: {},
        success: function (response) {
            let inputPassword = $(`#inputPasswordReply${i}`).val();
            if (inputPassword === response['replies'][i]['password']) {
                let postNum = response['replies'][i]['postNum'];
                let name = response['replies'][i]['name']
                let comment = response['replies'][i]['comment']
                let password = response['replies'][i]['password']
                let time = response['replies'][i]['time']
                $.ajax({
                    type: "DELETE",
                    url: "/reply",
                    data: {
                        'postNum_give': postNum,
                        'name_give': name,
                        'comment_give': comment,
                        'password_give': password,
                        'time_give': time
                    },
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

//이메일 주소 클립보드에 복사하는 기능
function copyToClipBoard() {
    navigator.clipboard.writeText("joon0858@naver.com").then(() => {
        alert("이메일 주소가 복사되었습니다.");
    });
}

//댓글 입력 창 토글
function openCloseToc(i, l) {
    if (document.getElementById(`post-reply${i}`).style.display === 'block') {
        document.getElementById(`post-reply${i}`).style.display = 'none';
    } else {
        for (let j = 0; j < l; j++) {
            document.getElementById(`post-reply${j}`).style.display = 'none'; //나머지 창 모두 닫기
        }
        document.getElementById(`post-reply${i}`).style.display = 'block';
    }
}