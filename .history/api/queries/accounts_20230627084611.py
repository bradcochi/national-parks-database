from pydantic import BaseModel

class DuplicateAccountError(ValueError):
    pass


class AccountIn(BaseModel)