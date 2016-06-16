from lin.core import web;

web.addViewModel('lin.core.auth.User');


# def login():
def login(function):
    pass

def role(*roles):
    def wrapper(function):
        return function
    return wrapper;

def permiss(*permisses):
    def wrapper(function):
        return function
    return wrapper;

def roleOr(*roles):
    def wrapper(function):
        return function
    return wrapper;

def permissOr(*permisses):
    def wrapper(function):
        return function
    return wrapper;