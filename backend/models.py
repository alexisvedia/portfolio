from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='user')
    favorites = db.relationship('Favorite', back_populates='user', lazy=True)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class AIPage(db.Model):
    __tablename__ = 'ai_pages'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=False)
    favicon_url = db.Column(db.String(255), nullable=True)
    favorites = db.relationship('Favorite', back_populates='ai_page', lazy=True)


class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ai_page_id = db.Column(db.Integer, db.ForeignKey('ai_pages.id'), nullable=False)

    user = db.relationship('User', back_populates='favorites', lazy=True)
    ai_page = db.relationship('AIPage', back_populates='favorites', lazy=True)
