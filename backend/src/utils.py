import bcrypt


def has_blank_field(data: dict()) -> bool:
    for key, val in data.items():
        if val == '':
            return True
    return False


def hashpass(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password
