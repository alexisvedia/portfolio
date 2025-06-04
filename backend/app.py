from __future__ import annotations
import os
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

from models import db, User, AIPage, Favorite

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'change-me')

db.init_app(app)
jwt = JWTManager(app)


def create_admin(username: str, password: str) -> None:
    with app.app_context():
        admin = User.query.filter_by(username=username).first()
        if admin is None:
            admin = User(username=username, role='admin')
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()


def init_db() -> None:
    with app.app_context():
        db.create_all()


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'msg': 'Missing credentials'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'msg': 'Username already exists'}), 400

    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'User created'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'msg': 'Missing credentials'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'msg': 'Bad credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200


@app.route('/ai', methods=['GET'])
def list_ai_pages():
    pages = AIPage.query.all()
    return jsonify([
        {
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'url': p.url,
            'favicon_url': p.favicon_url,
        }
        for p in pages
    ])


def fetch_favicon(url: str) -> str | None:
    try:
        import favicon as fv
        icons = fv.get(url)
        if icons:
            return icons[0].url
    except Exception:
        pass
    return None


@app.route('/ai', methods=['POST'])
@jwt_required()
def add_ai_page():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'msg': 'Admin required'}), 403

    data = request.get_json()
    if not data or 'title' not in data or 'url' not in data:
        return jsonify({'msg': 'Missing fields'}), 400

    favicon_url = fetch_favicon(data['url'])
    page = AIPage(
        title=data['title'],
        description=data.get('description'),
        url=data['url'],
        favicon_url=favicon_url,
    )
    db.session.add(page)
    db.session.commit()
    return jsonify({'msg': 'Page added', 'id': page.id}), 201


@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    favs = [
        {
            'id': fav.ai_page.id,
            'title': fav.ai_page.title,
            'url': fav.ai_page.url,
            'favicon_url': fav.ai_page.favicon_url,
        }
        for fav in user.favorites
    ]
    return jsonify(favs)


@app.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or 'ai_page_id' not in data:
        return jsonify({'msg': 'Missing ai_page_id'}), 400

    if not AIPage.query.get(data['ai_page_id']):
        return jsonify({'msg': 'Invalid ai_page_id'}), 404

    fav = Favorite(user_id=user_id, ai_page_id=data['ai_page_id'])
    db.session.add(fav)
    db.session.commit()
    return jsonify({'msg': 'Favorite added'}), 201


@app.route('/search')
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({'msg': 'Missing query'}), 400

    pages = [
        {
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'url': p.url,
        }
        for p in AIPage.query.all()
    ]

    api_key = os.environ.get('NLWEB_API_KEY')
    if not api_key:
        return jsonify({'msg': 'No NLWeb API key configured'}), 500

    endpoint = os.environ.get('NLWEB_ENDPOINT', 'https://nlweb.microsoft.com/api/search')
    headers = {'Authorization': f'Bearer {api_key}'}
    payload = {'query': query, 'documents': pages}
    resp = requests.post(endpoint, json=payload, headers=headers, timeout=10)
    if not resp.ok:
        return jsonify({'msg': 'Search failed'}), 502

    return jsonify(resp.json().get('results', []))


if __name__ == '__main__':
    init_db()
    create_admin('admin', 'admin')
    app.run(host='0.0.0.0', port=5000)
