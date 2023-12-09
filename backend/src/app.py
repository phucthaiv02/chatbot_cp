import os
import bcrypt
from utils import has_blank_field, hashpass
from dotenv import load_dotenv

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from flask import Flask, render_template, session, request, copy_current_request_context
from flask_socketio import SocketIO

import openai


def chat_response(message):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=message,
        max_tokens=150,
        n=1,
        stop=None
    )
    return response['choices'][0]['text']


load_dotenv()
openai.api_key = os.getenv("OPEN_AI_SECRET")

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

    response = {
        'status': 200,
        'chats': chats
    }
    socket.emit("all-chats-response", response)


@socket.on("chat")
def chat(data):
    question = data["message"]

    res = chat_response(question['content'])
    ans = {'role': 'assistant', 'content': res}

    db.update_one({'email': data['userInfo']}, {"$push": {"chats": question}})
    db.update_one({'email': data['userInfo']}, {"$push": {"chats": ans}})

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
