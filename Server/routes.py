from flask import Blueprint, request, jsonify
from models import db, Group, User, UserSubscription, Plan, GroupMember

api = Blueprint('api', __name__)

# Check if a group name exists
@api.route('/api/check-group-name', methods=['GET'])
def check_group_name():
    group_name = request.args.get('name')
    if not group_name:
        return jsonify({'error': 'Group name is required'}), 400

    group_exists = Group.query.filter_by(name=group_name).first()
    
    return jsonify({'exists': bool(group_exists)})

# Create a new group
@api.route('/groups', methods=['POST'])
def create_group():
    data = request.get_json()
    group_name = data.get('name')
    group_description = data.get('description')
    members = data.get('members', [])
    created_by = data.get('created_by')

    if not group_name or not group_description or not created_by:
        return jsonify({'error': 'Group name, description, and creator email are required'}), 400

    if len(members) < 2 or len(members) > 5:
        return jsonify({'error': 'A group must have at least 2 and at most 5 members.'}), 400

    missing_members = [member_name for member_name in members if not User.query.filter_by(name=member_name).first()]

    if missing_members:
        return jsonify({'error': 'The following members need to sign up first:', 'missing_members': missing_members}), 400

    new_group = Group(
        name=group_name, 
        description=group_description,
        members=",".join(members),  
        created_by=created_by  
    )
    db.session.add(new_group)
    db.session.commit()

    for i, member_name in enumerate(members):
        user = User.query.filter_by(name=member_name).first()
        new_member = GroupMember(user_id=user.user_id, group_id=new_group.group_id, is_admin=(i == 0))
        db.session.add(new_member)

    db.session.commit()

    return jsonify({'message': 'Group created successfully!', 'group': new_group.to_dict()}), 201

# Add a member to the group
@api.route('/groups/<int:group_id>/add-member', methods=['POST'])
def add_member(group_id):
    data = request.get_json()
    member_email = data.get('email')
    admin_id = data.get('admin_id')

    if not GroupMember.query.filter_by(group_id=group_id, user_id=admin_id, is_admin=True).first():
        return jsonify({'error': 'Only admins can add members.'}), 403

    user = User.query.filter_by(email=member_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if GroupMember.query.filter_by(group_id=group_id, user_id=user.user_id).first():
        return jsonify({'error': 'User is already a member of the group.'}), 400

    new_member = GroupMember(user_id=user.user_id, group_id=group_id, is_admin=False)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({'message': 'Member added successfully!'}), 201

# Get group members
@api.route('/groups/<int:group_id>/members', methods=['GET'])
def get_group_members(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({'error': 'Group not found'}), 404

    members = GroupMember.query.filter_by(group_id=group_id).all()
    return jsonify([{'user_id': member.user_id, 'is_admin': member.is_admin} for member in members])

# Get user details
@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({'error': 'User not found'}), 404

# Get user plans
@api.route('/user_plans/<int:user_id>', methods=['GET'])
def get_user_plans(user_id):
    plans = UserSubscription.query.filter_by(user_id=user_id).all()
    return jsonify([plan.to_dict() for plan in plans])

# Check members before creating a group
@api.route('/api/check-members', methods=['POST'])
def check_members():
    data = request.get_json()
    member_names = data.get('members', [])

    if not member_names:
        return jsonify({'error': 'No members provided'}), 400

    missing_members = [name for name in member_names if not User.query.filter_by(name=name).first()]

    if missing_members:
        return jsonify({"status": "error", "missing_members": missing_members}), 400
    return jsonify({"status": "success"}), 200
