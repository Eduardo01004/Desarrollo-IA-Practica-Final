class ApiSuccess:

    def __init__(self, status_code: int = 200, message: str = '', content = None) -> None:
        self.status_code = status_code
        self.message = message
        self.content = content
    
    def to_json(self):
        if self.content != None:
            return self.content

        return {
            'status': self.status_code,
            'message': self.message
        }
