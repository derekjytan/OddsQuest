from flask import Blueprint, jsonify, request
from .. import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({
        "message": "Welcome to OddsQuest Backend",
        "status": "active"
    }), 200

@main_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running smoothly"
    }), 200