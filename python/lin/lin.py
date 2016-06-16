

class LinException(BaseException):

    def __init__(self, code, message=None, cause=None, exception=None):
        self._code = code
        self._message = message
        if message is None:
            self._message = '';
        self._cause = cause
        if cause is None:
            self._cause = '';
        self._excepton = exception

    @property
    def message(self):
        return self._message

    @property
    def cause(self):
        return self._cause

    @property
    def code(self):
        return self._code