import os
import bcrypt
from utils import has_blank_field, hashpass
from dotenv import load_dotenv

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from flask import Flask, render_template, session, request, copy_current_request_context
from flask_socketio import SocketIO

from transformers import pipeline
model_checkpoint = "nguyenvulebinh/vi-mrc-base"
nlp = pipeline('question-answering', model=model_checkpoint,
               tokenizer=model_checkpoint, device="cuda:0")

context = '''
Đại học Bách Khoa Đà Nẵng được đánh giá nằm trong TOP 4 trường Đại học Việt Nam lần đầu tiên đạt chuẩn quốc tế về chất lượng đào tạo và nghiên cứu được ghi nhận do Hội đồng cấp cao đánh giá nghiên cứu và giáo dục đại học Châu Âu. Những năm gần đây, DUT đào tạo ra không ít  kỹ sư, cán bộ tài năng, gương mẫu cho tổ quốc.
Trường Đại học Bách khoa - Đại học Đà Nẵng công bố điểm chuẩn trúng tuyển có điều kiện theo phương thức xét tuyển học bạ.

Nhà trường lưu ý, thí sinh cần đăng ký ngành/chuyên ngành với tổ hợp trúng tuyển có điều kiện ở trên vào Hệ thống tuyển sinh của Bộ Giáo dục và Đào tạo để được xét trúng tuyển chính thức.

Thí sinh chỉ trúng tuyển chính thức khi có đồng thời 3 điều kiện sau:

Điều kiện 1: Tốt nghiệp THPT.

Điều kiện 2: Đăng ký ngành/chuyên ngành với tổ hợp trúng tuyển có điều kiện ở trên vào Hệ thống.

Điều kiện 3: Ngành/chuyên ngành trúng tuyển có điều kiện ở trên là nguyện vọng cao nhất trong số các nguyện vọng đủ điều kiện trúng tuyển thí sinh đã đăng ký vào Hệ thống.


'''

load_dotenv()

app = Flask(__name__)
socket = SocketIO(app, cors_allowed_origins='*', async_mode="threading")


# Connect to MongoDB
URI = os.getenv("MONGODB_URL")
client = MongoClient(URI, server_api=ServerApi('1'))
db = client["chatbot"]["users"]


@app.route("/")
def main():
    return render_template("index.html")


@socket.on('auth')
def authentication(data):

    user = db.find_one({'login_location': {'$in': [request.remote_addr]}})
    if user:
        response = {
            "status": 200,
            "userInfo": {
                "name": user['name'],
                "email": user['email']
            }
        }
    else:
        response = {"status": 404}
    socket.emit('auth-response', response)


@socket.on('login')
def login(data):
    if has_blank_field(data):
        response = {'status': 401}
    else:
        user = db.find_one({'email': data['email']})
        if user:
            refPass = user["password"].encode('utf-8')
            recvPass = data['password'].encode('utf-8')
            if bcrypt.checkpw(recvPass, refPass):
                if db.update_one({'email': data['email']}, {"$push": {"login_location": request.remote_addr}}):
                    response = {'status': 200,
                                'userInfo': {
                                    'name': user['name'],
                                    'email': user['email']
                                }}
                else:
                    response = {'status': 401}
            else:
                response = {'status': 401}
        else:
            response = {'status': 401}

    socket.emit('login-response', response)


@socket.on('signup')
def signup(data):
    if has_blank_field(data):
        response = {'status': 401}
    else:
        name = data['name']
        email = data['email']
        password = data['password']
        confirm_password = data['confirmPassword']
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())
        if db.find_one({'email': email}):
            response = {'status': 401}
        else:
            if password == confirm_password:
                new_user = {
                    'name': name,
                    'email': email,
                    'password': hashed_password.decode('utf-8'),
                    'login_location': [request.remote_addr],
                    'chats': [],
                }
                db.insert_one(new_user)  # Add user to database
                response = {'status': 200,
                            'userInfo': {
                                'name': name,
                                'email': email
                            }}
            else:
                response = {'status': 401}

    socket.emit("signup-response", response)


@socket.on("all-chats")
def allChat(data):
    user = db.find_one({'email': data['userInfo']})
    chats = user['chats']
    for chat in chats:
        chat.pop('id')
        chat.pop('_id')

    response = {
        'status': 200,
        'chats': chats
    }
    socket.emit("all-chats-response", response)


@socket.on("chat")
def chat(data):
    question = data["message"]
    QA_input = {
        'question': f"{question}?",
        'context': f"{context}"
    }
    res = nlp(QA_input)
    ans = {'role': 'assistant', 'content': res["answer"]}
    response = {
        "status": 200,
        "response": ans
    }
    socket.emit("chat-response", response)


@socket.on("delete-chat")
def deleteChat(data):
    if db.update_one({'email': data['userInfo']}, {"$set": {"chats": []}}):
        response = {'status': 200}
    else:
        response = {'status': 404}
    socket.emit('delete-chat-response', response)


@socket.on('logout')
def logout(data):
    db.update_one({'email': data['userInfo']}, {
                  "$pull": {"login_location": request.remote_addr}})

    response = {
        "status": 200,
    }
    socket.emit('logout-response', response)


if __name__ == '__main__':
    socket.run(app, port=6968, debug=True, host="0.0.0.0")

# ###################################################
# #
# # chat_schema = {
# #     "id": {
# #         "type": str,
# #         "default": str(uuid4()),
# #     },
# #     "role": {
# #         "type": str,
# #         "required": True,
# #     },
# #     "content": {
# #         "type": str,
# #         "required": True,
# #     },
# # }
# #
# #
# # user_schema = {
# #     "name": {
# #         "type": str,
# #         "required": True,
# #     },
# #     "email": {
# #         "type": str,
# #         "required": True,
# #         "unique": True,
# #     },
# #     "password": {
# #         "type": str,
# #         "required": True,
# #     },
# #     "chats": [chat_schema],
# # }
# #
# ###################################################
