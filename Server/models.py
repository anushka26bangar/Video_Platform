from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Group(db.Model):
    __tablename__ = 'group'

    group_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_by = db.Column(db.String(100), nullable=False)  # Storing the creator's email
    members = db.Column(db.String(255), nullable=False)  # Store comma-separated list of member emails

    def to_dict(self):
        return {
            'group_id': self.group_id,
            'name': self.name,
            'description': self.description,
            'members': self.members.split(',') if self.members else [],
            'created_by': self.created_by
        }

# New GroupMember model to track group membership and admin status
class GroupMember(db.Model):
    __tablename__ = 'group_member'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('group.group_id'), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)  # Tracks if the member is an admin

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'group_id': self.group_id,
            'is_admin': self.is_admin
        }

class Plan(db.Model):
    __tablename__ = 'plans'
    plan_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    video_watching_limit = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'plan_id': self.plan_id,
            'name': self.name,
            'price': float(self.price),  # Convert to float for JSON serialization
            'video_watching_limit': self.video_watching_limit
        }

class UserPlan(db.Model):
    __tablename__ = 'user_plans'  # Updated to match your table name

    user_plan_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Renamed to match table structure
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)  # Ensured this matches the actual column names
    plan_type = db.Column(db.String(20), nullable=False)  # Kept as is
    expiry_date = db.Column(db.DateTime, nullable=False)  # Changed to DateTime to match your structure

    def to_dict(self):
        return {
            'user_plan_id': self.user_plan_id,
            'user_id': self.user_id,
            'plan_type': self.plan_type,
            'expiry_date': self.expiry_date.isoformat()  # Convert date to ISO format
        }

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'location': self.location
        }

class Download(db.Model):
    __tablename__ = 'downloads'
    download_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    video_filename = db.Column(db.String(255), nullable=False)
    download_date = db.Column(db.Date, nullable=False)  # New field to track download date

    def to_dict(self):
        return {
            'download_id': self.download_id,
            'user_id': self.user_id,
            'video_filename': self.video_filename,
            'download_date': self.download_date.isoformat()  # Convert date to ISO format
        }

class Video(db.Model):
    __tablename__ = 'videos'

    video_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)

    def __init__(self, title, duration):
        self.title = title
        self.duration = duration
