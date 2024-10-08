# from flask import Flask, jsonify, request, send_file
# from flask_mail import Mail
# from flask_cors import CORS
# from config import (SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS)
# from models import db, Group, GroupMember, Plan, UserPlan, User, Download, Video
# import os
# from werkzeug.utils import secure_filename
# from datetime import datetime
# from moviepy.editor import VideoFileClip

# app = Flask(__name__)

# # Allow CORS for all routes
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": "GET, POST, OPTIONS", "allow_headers": "*"}})
# CORS(app, resources={r"/uploads/*": {"origins": "http://localhost:3000", "methods": "GET", "allow_headers": "*"}})  # CORS for video uploads

# # Set upload folder and other configurations
# UPLOAD_FOLDER = 'static/uploads/videos'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 600 * 1024 * 1024  # 600 MB limit
# app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
# # app.config['MAIL_SERVER'] = MAIL_SERVER
# # app.config['MAIL_PORT'] = MAIL_PORT
# # app.config['MAIL_USERNAME'] = MAIL_USERNAME
# # app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
# # app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
# # app.config['MAIL_USE_SSL'] = MAIL_USE_SSL

# db.init_app(app)
# mail = Mail(app)

# # Ensure the upload folder exists
# if not os.path.exists(app.config['UPLOAD_FOLDER']):
#     os.makedirs(app.config['UPLOAD_FOLDER'])

# # Function to check if a user exists by email or phone number
# def check_user_exists(email=None, phone_number=None):
#     if email:
#         user = User.query.filter_by(email=email).first()
#         if user:
#             return True
#     if phone_number:
#         user = User.query.filter_by(phone_number=phone_number).first()
#         if user:
#             return True
#     return False

# # Function to create a new user
# def create_user(name, email, password, phone_number):
#     new_user = User(name=name, email=email, password=password, phone_number=phone_number)
#     db.session.add(new_user)
#     db.session.commit()

# # Route for uploading video
# @app.route('/api/upload', methods=['POST'])
# def upload_video():
#     if 'video' not in request.files:
#         return jsonify({'error': 'No file part'}), 400

#     file = request.files['video']
    
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(file_path)

#         # Extract video duration using moviepy
#         clip = VideoFileClip(file_path)
#         duration = int(clip.duration)  # Duration in seconds

#         # Save video details to the database
#         video = Video(title=filename, duration=duration)
#         db.session.add(video)
#         db.session.commit()

#         return jsonify({'filename': filename}), 200

#     return jsonify({'error': 'Upload failed'}), 500

# # Route for fetching uploaded videos
# @app.route('/api/videos', methods=['GET'])
# def get_videos():
#     video_folder = app.config['UPLOAD_FOLDER']
#     video_files = os.listdir(video_folder)

#     video_list = [{'name': file, 'url': f'/uploads/{file}'} for file in video_files]

#     return jsonify({'videos': video_list}), 200

# # Serve video files statically
# @app.route('/uploads/<filename>', methods=['GET'])
# def uploaded_file(filename):
#     file_path = os.path.join(app.root_path, 'static', 'uploads', 'videos', filename)
#     if os.path.exists(file_path):
#         return send_file(file_path, mimetype='video/mp4')

#     return jsonify({'error': 'File not found'}), 404

# # Signup route
# @app.route('/api/signup', methods=['POST'])
# def signup():
#     data = request.json
#     name = data.get('name')
#     email = data.get('email')
#     password = data.get('password')
#     confirm_password = data.get('confirm_password')
#     phone_number = data.get('phone_number')

#     if check_user_exists(email=email, phone_number=phone_number):
#         return jsonify({'error': 'User already exists'}), 400

#     if password != confirm_password:
#         return jsonify({'error': 'Passwords do not match'}), 400

#     create_user(name, email, password, phone_number)
#     return jsonify({'message': 'User registered successfully'}), 200

# # Login route
# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     # Admin login
#     if email == 'admin@gmail.com' and password == '@dmin123':
#         return jsonify({'message': 'Admin login successful'}), 200

#     # User login
#     user = User.query.filter_by(email=email).first()
#     if not user or user.password != password:
#         return jsonify({'error': 'Invalid credentials'}), 401

#     return jsonify({'message': 'User login successful'}), 200

# # Check user email
# @app.route('/api/check-user-email', methods=['OPTIONS', 'POST'])
# def check_user_email():
#     if request.method == 'OPTIONS':
#         return '', 200  # Respond to the preflight request

#     data = request.json
#     email = data.get('email')
#     user_exists = check_user_exists(email=email)

#     if user_exists:
#         return jsonify({'exists': True, 'message': 'User exists'}), 200
#     else:
#         return jsonify({'exists': False, 'error': 'User does not exist'}), 404

# # Route for adding members to a group
# @app.route('/api/groups/<int:group_id>/members', methods=['POST'])
# def add_members(group_id):
#     data = request.get_json()
#     members = data.get('members', [])

#     if len(members) < 2:
#         return jsonify({'error': 'At least 2 members are required'}), 400

#     group = Group.query.get(group_id)
#     if not group:
#         return jsonify({'error': 'Group not found'}), 404

#     for member_data in members:
#         name = member_data.get('name')
#         if not name:
#             return jsonify({'error': 'Member name is required'}), 400
        
#         new_member = GroupMember(name=name, group_id=group_id)
#         db.session.add(new_member)
    
#     db.session.commit()
    
#     return jsonify({'message': 'Members added successfully!'}), 201

# # Route for joining a group
# @app.route('/api/groups/<int:group_id>/join', methods=['POST', 'OPTIONS'])
# def join_group(group_id):
#     if request.method == 'OPTIONS':
#         return _build_cors_preflight_response()

#     # Additional logic can be implemented here for joining a group

# # Helper function for CORS preflight response
# def _build_cors_preflight_response():
#     response = jsonify({'status': 'preflight success'})
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Headers", "*")
#     response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
#     return response

# # Route for getting group details
# @app.route('/api/groups/<int:group_id>', methods=['GET'])
# def get_group_details(group_id):
#     group = Group.query.filter_by(group_id=group_id).first()
#     if not group:
#         return jsonify({'error': 'Group not found'}), 404

#     members = [{'id': member.id, 'name': member.name} for member in group.members or []]
#     response = {
#         'group_id': group.group_id,
#         'name': group.name,
#         'description': group.description,
#         'members': members
#     }

#     return jsonify(response)

# # Route for inviting a member to a group
# @app.route('/api/invite/<int:group_id>', methods=['POST'])
# def invite_member(group_id):
#     data = request.get_json()
#     name = data.get('name')
#     group = Group.query.get(group_id)
    
#     if not group:
#         return jsonify({'error': 'Group not found'}), 404
    
#     new_member = GroupMember(name=name, group_id=group_id)
#     db.session.add(new_member)
#     db.session.commit()
    
#     return jsonify({'message': f'{name} has been invited to the group {group.name}'}), 200

# # Route for getting all plans
# @app.route('/api/plans', methods=['GET'])
# def get_plans():
#     plans = Plan.query.all()
#     return jsonify([plan.to_dict() for plan in plans])

# # Route for upgrading a user plan
# @app.route('/api/upgrade-plan', methods=['POST'])
# def upgrade_plan():
#     data = request.get_json()
#     email = data.get('email')  # Changed from user_id to email
#     plan_id = data.get('plan_id')
#     plan_type = data.get('plan_type')

#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({'error': 'User does found'}), 404

#    # Map plan types to plan details (ID and duration)
#     plan_details = {
#         'bronze': {'plan_id': 1, 'duration': 7},  # 7 minutes for Bronze
#         'silver': {'plan_id': 2, 'duration': 10},  # 10 minutes for Silver
#         'gold': {'plan_id': 3, 'duration': float('inf')}  # Unlimited for Gold
#     }

#     if plan_type.lower() not in plan_details:
#         return jsonify({'error': 'Invalid plan type'}), 400

#     plan = plan_details[plan_type.lower()]
#     new_user_plan = UserPlan(user_id=user.id, plan_type=plan['plan_id'], expiry_date=datetime.utcnow() + timedelta(days=plan['duration']))
#     db.session.add(new_user_plan)
#     db.session.commit()

#     return jsonify({'message': 'Plan upgraded successfully'}), 200

# if __name__ == '__main__':
#     app.run(debug=True,port=5000)














from flask import Flask, jsonify, request, send_file, session
from flask_mail import Mail
from flask_cors import CORS, cross_origin
from config import (SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS)
from models import db, Group, GroupMember, Plan, UserPlan, User, Download, Video
import os
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from moviepy.editor import VideoFileClip

app = Flask(__name__)

# Allow CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": "GET, POST, OPTIONS", "allow_headers": "*"}})
CORS(app, resources={r"/uploads/*": {"origins": "http://localhost:3000", "methods": "GET", "allow_headers": "*"}})

# Set upload folder and other configurations
UPLOAD_FOLDER = 'static/uploads/videos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 600 * 1024 * 1024  # 600 MB limit
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.secret_key = 'your_secret_key'  # Replace with a strong secret key

db.init_app(app)
mail = Mail(app)

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Function to check if a user exists by email or phone number
def check_user_exists(email=None, phone_number=None):
    if email:
        user = User.query.filter_by(email=email).first()
        if user:
            return True
    if phone_number:
        user = User.query.filter_by(phone_number=phone_number).first()
        if user:
            return True
    return False

# Function to create a new user
def create_user(name, email, password, phone_number):
    new_user = User(name=name, email=email, password=password, phone_number=phone_number)
    db.session.add(new_user)
    db.session.commit()

# Route for checking login status
@app.route('/api/check_login', methods=['GET'])
def check_login():
    return jsonify({'logged_in': 'user_id' in session}), 200

# Route for uploading video
@app.route('/api/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract video duration using moviepy
        clip = VideoFileClip(file_path)
        duration = int(clip.duration)  # Duration in seconds

        # Save video details to the database
        video = Video(title=filename, duration=duration)
        db.session.add(video)
        db.session.commit()

        return jsonify({'filename': filename}), 200

    return jsonify({'error': 'Upload failed'}), 500

# Route for fetching uploaded videos
@app.route('/api/videos', methods=['GET'])
def get_videos():
    video_folder = app.config['UPLOAD_FOLDER']
    video_files = os.listdir(video_folder)

    video_list = [{'name': file, 'url': f'/uploads/{file}'} for file in video_files]

    return jsonify({'videos': video_list}), 200

# Serve video files statically
@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    file_path = os.path.join(app.root_path, 'static', 'uploads', 'videos', filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype='video/mp4')

    return jsonify({'error': 'File not found'}), 404

# Signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    phone_number = data.get('phone_number')

    if check_user_exists(email=email, phone_number=phone_number):
        return jsonify({'error': 'User already exists'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    create_user(name, email, password, phone_number)
    return jsonify({'message': 'User registered successfully'}), 200

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Admin login
    if email == 'admin@gmail.com' and password == '@dmin123':
        session['user_id'] = email  # Store admin login in session
        return jsonify({'message': 'Admin login successful'}), 200

    # User login
    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:
        return jsonify({'error': 'Invalid credentials'}), 401

    session['user_id'] = user.user_id  # Store user ID in session
    return jsonify({'message': 'User login successful'}), 200

# Check user email
@app.route('/api/check-user-email', methods=['OPTIONS', 'POST'])
def check_user_email():
    if request.method == 'OPTIONS':
        return '', 200  # Respond to the preflight request

    data = request.json
    email = data.get('email')
    user_exists = check_user_exists(email=email)

    if user_exists:
        return jsonify({'exists': True, 'message': 'User exists'}), 200
    else:
        return jsonify({'exists': False, 'error': 'User does not exist'}), 404

# Route for adding members to a group
@app.route('/api/groups/<int:group_id>/members', methods=['POST'])
def add_members(group_id):
    data = request.get_json()
    members = data.get('members', [])

    if len(members) < 2:
        return jsonify({'error': 'At least 2 members are required'}), 400

    group = Group.query.get(group_id)
    if not group:
        return jsonify({'error': 'Group not found'}), 404

    for member_data in members:
        name = member_data.get('name')
        if not name:
            return jsonify({'error': 'Member name is required'}), 400
        
        new_member = GroupMember(name=name, group_id=group_id)
        db.session.add(new_member)
    
    db.session.commit()
    
    return jsonify({'message': 'Members added successfully!'}), 201

# Route for joining a group
@app.route('/api/groups/<int:group_id>/join', methods=['POST', 'OPTIONS'])
def join_group(group_id):
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    # Additional logic can be implemented here for joining a group

# Helper function for CORS preflight response
def _build_cors_preflight_response():
    response = jsonify({'status': 'preflight success'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response

# Route for getting group details
@app.route('/api/groups/<int:group_id>', methods=['GET'])
def get_group_details(group_id):
    group = Group.query.filter_by(group_id=group_id).first()
    if not group:
        return jsonify({'error': 'Group not found'}), 404

    members = [{'id': member.id, 'name': member.name} for member in group.members or []]
    response = {
        'group_id': group.group_id,
        'name': group.name,
        'description': group.description,
        'members': members
    }

    return jsonify(response)

# Route for inviting a member to a group
@app.route('/api/invite/<int:group_id>', methods=['POST'])
def invite_member(group_id):
    data = request.get_json()
    name = data.get('name')
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    
    new_member = GroupMember(name=name, group_id=group_id)
    db.session.add(new_member)
    db.session.commit()
    
    return jsonify({'message': f'{name} has been invited to the group {group.name}'}), 200

# Route for getting all plans
@app.route('/api/plans', methods=['GET'])
def get_plans():
    plans = Plan.query.all()
    return jsonify([plan.to_dict() for plan in plans])

# Route for upgrading a user plan
@app.route('/api/upgrade-plan', methods=['POST'])
def upgrade_plan():
    data = request.get_json()
    email = data.get('email')  # Changed from user_id to email
    plan_id = data.get('plan_id')
    plan_type = data.get('plan_type')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_plan = UserPlan(user_id=user.id, plan_type=plan_type)
    db.session.add(user_plan)
    db.session.commit()

    return jsonify({'message': f'Plan upgraded to {plan_type}'}), 200

# Route for getting user downloads
@app.route('/api/downloads/<int:user_id>', methods=['GET'])
def get_downloads(user_id):
    downloads = Download.query.filter_by(user_id=user_id).all()
    download_list = [{'video_id': download.video_id, 'title': download.video.title} for download in downloads]
    return jsonify(download_list)

# Route for deleting a video
@app.route('/api/delete-video/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    db.session.delete(video)
    db.session.commit()

    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video.title)
    if os.path.exists(video_path):
        os.remove(video_path)

    return jsonify({'message': 'Video deleted successfully'}), 200

# Route for logging out
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user ID from session
    return jsonify({'message': 'Logged out successfully'}), 200

def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()
    if user:
        return {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email
            # Add other fields as needed
        }
    return None

@app.route('/api/user/<string:email>', methods=['GET'])
@cross_origin()  # Allow CORS for this specific route
def get_user(email):
    user = get_user_by_email(email)  # Replace this with your actual logic to fetch user data
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'message': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True,port=5000)
