from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.schemas import UserRegister, UserLogin
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from fastapi import Depends
from app.utils.dependencies import get_current_user

router = APIRouter()


# ✅ REGISTER
@router.post("/register")
def register(user: UserRegister):

    print("Incoming password length:", len(user.password))

    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    print("Hashed password length:", len(hashed_pw))

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_pw
    })

    return {"message": "User registered successfully"}


# ✅ LOGIN
@router.post("/login")
def login(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    print("Raw password length:", len(user.password))
    print("Stored password length:", len(db_user["password"]))

    try:
        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        print("VERIFY ERROR:", e)
        raise HTTPException(status_code=500, detail="Password verification error")

    token = create_access_token({"email": db_user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"]
    }