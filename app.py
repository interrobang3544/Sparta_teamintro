from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.tlpj1fz.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

# 메인페이지
@app.route('/')
def team():
    return render_template('index.html')

@app.route("/mainComment", methods=["POST"])
def team_guestBook_post():
    doc = {
        'name': request.form["name_give"],
        'comment': request.form["comment_give"],
        'password': request.form["password_give"],
        'time': request.form["time_give"]
    }
    db.mainComment.insert_one(doc)
    return jsonify({'msg': '방명록이 작성되었습니다.'})


@app.route("/mainComment", methods=["GET"])
def team_guestBook_get():
    comment_list = list(db.mainComment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})


@app.route("/mainComment", methods=["PUT"])
def team_guestBook_put():
    old = {'name': request.form["name_give"],
           'comment': request.form["comment_give"],
           'password': request.form["password_give"],
           'time': request.form["time_give"]}
    new = {'$set': {'comment': request.form["newComment_give"],
                    'time': request.form["newTime_give"]}}
    db.mainComment.update_one(old, new)
    return jsonify({'msg': '수정 완료!'})


@app.route("/mainComment", methods=["DELETE"])
def team_guestBook_delete():
    doc = {
        'name': request.form["name_give"],
        'comment': request.form["comment_give"],
        'password': request.form["password_give"],
        'time': request.form["time_give"]
    }
    db.mainComment.delete_one(doc)
    return jsonify({'msg': '삭제 완료!'})

db_cjk = client.dbsparta

# 천준기님
@app.route('/member4')
def member4():
    return render_template('member4.html')


@app.route("/comment", methods=["POST"])
def guestBook_post():
    doc = {
        'name': request.form["name_give"],
        'comment': request.form["comment_give"],
        'password': request.form["password_give"],
        'time': request.form["time_give"]
    }
    db_cjk.comment.insert_one(doc)
    return jsonify({'msg': '방명록이 작성되었습니다.'})

@app.route("/reply", methods=["POST"])
def reply_post():
    doc = {
        'postNum': request.form["postNum_give"],
        'name': request.form["name_give_reply"],
        'comment': request.form["comment_give_reply"],
        'password': request.form["password_give_reply"],
        'time': request.form["time_give_reply"]
    }
    db_cjk.reply.insert_one(doc)
    return jsonify({'msg': '댓글이 작성되었습니다.'})


@app.route("/comment", methods=["GET"])
def guestBook_get():
    comment_list = list(db_cjk.comment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})

@app.route("/reply", methods=["GET"])
def reply_get():
    comment_list = list(db_cjk.reply.find({}, {'_id': False}))
    return jsonify({'replies': comment_list})


@app.route("/comment", methods=["PUT"])
def guestBook_put():
    old = {'name': request.form["name_give"],
           'comment': request.form["comment_give"],
           'password': request.form["password_give"],
           'time': request.form["time_give"]}
    new = {'$set': {'comment': request.form["newComment_give"],
                    'time': request.form["newTime_give"]}}
    db_cjk.comment.update_one(old, new)
    return jsonify({'msg': '수정 완료!'})

@app.route("/reply", methods=["PUT"])
def reply_put():
    old = {'postNum': request.form["postNum_give"],
           'name': request.form["name_give"],
           'comment': request.form["comment_give"],
           'password': request.form["password_give"],
           'time': request.form["time_give"]}
    new = {'$set': {'comment': request.form["newComment_give"],
                    'time': request.form["newTime_give"]}}
    db_cjk.reply.update_one(old, new)
    return jsonify({'msg': '수정 완료!'})


@app.route("/comment", methods=["DELETE"])
def guestBook_delete():
    doc = {
        'name': request.form["name_give"],
        'comment': request.form["comment_give"],
        'password': request.form["password_give"],
        'time': request.form["time_give"]
    }
    db_cjk.comment.delete_one(doc)
    return jsonify({'msg': '삭제 완료!'})

@app.route("/reply", methods=["DELETE"])
def reply_delete():
    doc = {
        'postNum': request.form["postNum_give"],
        'name': request.form["name_give"],
        'comment': request.form["comment_give"],
        'password': request.form["password_give"],
        'time': request.form["time_give"]
    }
    db_cjk.reply.delete_one(doc)
    return jsonify({'msg': '삭제 완료!'})


# 이정기님
import certifi

ca = certifi.where()
client_ljk = MongoClient('mongodb+srv://test:sparta@cluster0.8jwbzjm.mongodb.net/cluster0?retryWrites=true&w=majority',
                         tlsCAFile=ca)
db_ljk = client_ljk.dbsparta


@app.route('/member2')
def member2():
    return render_template('member2.html')


@app.route("/teamIntro", methods=["POST"])
def teamIntro_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    print(name_receive)
    print(comment_receive)

    comment_list = list(db_ljk.guest.find({}, {'_id': False}))
    count = len(comment_list) + 1
    print(count)
    doc = {
        'num': count,
        'name': name_receive,
        'comment': comment_receive,
        'done': 0
    }

    db_ljk.guest.insert_one(doc)

    return jsonify({'msg': '저장완료!!'})


@app.route("/teamIntro", methods=["GET"])
def teamIntro_get():
    all_comment = list(db_ljk.guest.find({}, {'_id': False}))
    return jsonify({'comments': all_comment})


@app.route("/teamIntro/done", methods=["POST"])
def delete_comment():
    num_receive = request.form['num_give']
    db_ljk.guest.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    print(num_receive)
    return jsonify({'msg': 'delete완료'})


# 전진영님
client_jjy = MongoClient('mongodb+srv://test:sparta@cluster0.8jwbzjm.mongodb.net/cluster0?retryWrites=true&w=majority',
                         tlsCAFile=ca)
db_jjy = client_jjy.dbsparta


@app.route('/member3')
def member3():
    return render_template('member3.html')

@app.route("/api", methods=['POST'])
def comments_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    time_receive = request.form['time_give']
    password_receive = request.form['password_give']

    doc = {
        'name': name_receive,
        'comment': comment_receive,
        'time': time_receive,
        'password': password_receive
    }
    db_jjy.api.insert_one(doc)

    return jsonify({'msg': '작성 완료!'})

@app.route("/api", methods=["GET"])
def list_get():
    comments_list = list(db_jjy.api.find({}, {'_id': False}))
    return jsonify({'get': comments_list})

# 김형집님
client_khj = MongoClient("mongodb+srv://test:sparta@cluster0.jgbvoot.mongodb.net/?retryWrites=true&w=majority")
db_khj = client_khj.dbsparta

@app.route('/member1')
def member1():
    return render_template('member1.html')

@app.route("/homework", methods=["POST"])
def homework_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    password_receive = request.form['password_give']
    doc = {
        'name':name_receive,
        'comment':comment_receive,
        'password':password_receive
    }
    db_khj.homework.insert_one(doc)
    return jsonify({'msg':'방명록 작성'})

@app.route("/homework", methods=["DELETE"])
def guestBook_del():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    password_receive = request.form['password_give']
    doc = {
        'name': name_receive,
        'comment': comment_receive,
        'password': password_receive
    }
    db_khj.homework.delete_one(doc)
    return jsonify({'msg':'삭제완료!'})


@app.route("/homework", methods=["GET"])
def homework_get():
    comment_list = list(db_khj.homework.find({}, {'_id':False}))
    return jsonify({'comments':comment_list})

# run
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
