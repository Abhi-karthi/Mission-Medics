import os
import certifi
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, make_response
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)
app.secret_key = "super_secret_mission_medics_key"

# --- MONGODB CONFIGURATION ---
MONGO_STRING = os.getenv("MONGO_STRING")
try:
    # ADDED: tlsCAFile=certifi.where()
    client = MongoClient(MONGO_STRING, tlsCAFile=certifi.where())

    db = client.mission_medics
    requests_collection = db.get_supplies_requests
    donations_collection = db.donate_supplies_requests
    staff_collection = db.staff_users
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

# --- SUPER ADMIN CREDENTIALS ---
SUPER_ADMIN_USER = os.getenv("ADMIN_USERNAME", "Admin")
SUPER_ADMIN_PASS = os.getenv("ADMIN_PASSWORD", "password")

# --- EMAIL CONFIGURATION (Restored) ---
SENDER_EMAIL = "your_email@gmail.com"
SENDER_PASSWORD = "your_app_password"
RECEIVER_EMAIL = "krithiicode@gmail.com"


def send_email(subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


# ==========================================
# SECURITY DECORATORS
# ==========================================
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)

    return wrap


def super_admin_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if session.get('role') != 'super_admin':
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)

    return wrap


# --- PUBLIC PAGE ROUTES ---
@app.route('/')
def about():
    return render_template('about.html')


@app.route('/get-supplies')
def get_supplies():
    return render_template('get-supplies.html')


@app.route('/donate')
def donate():
    return render_template('donate.html')


@app.route('/support')
def support():
    return render_template('support.html')


# --- AUTHENTICATION & DASHBOARDS ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # 1. Check if it is the Super Admin
        if username == SUPER_ADMIN_USER and password == SUPER_ADMIN_PASS:
            session['logged_in'] = True
            session['role'] = 'super_admin'
            return redirect(url_for('super_admin_dashboard'))

        # 2. Check if it is a regular Staff Member
        staff_user = staff_collection.find_one({"username": username})
        if staff_user and check_password_hash(staff_user['password'], password):
            session['logged_in'] = True
            session['role'] = 'staff'
            return redirect(url_for('dashboard'))

        return render_template('login.html', error="Invalid username or password.")

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('about'))


@app.route('/dashboard')
@login_required
def dashboard():
    supply_requests = list(requests_collection.find().sort('_id', -1))
    donation_requests = list(donations_collection.find().sort('_id', -1))

    response = make_response(render_template('dashboard.html',
                                             supply_requests=supply_requests,
                                             donation_requests=donation_requests,
                                             is_super_admin=(session.get('role') == 'super_admin')))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route('/super-admin')
@login_required
@super_admin_required
def super_admin_dashboard():
    staff_users = list(staff_collection.find().sort('_id', -1))
    response = make_response(render_template('super_admin.html', staff_users=staff_users))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# --- API ENDPOINTS ---
@app.route('/api/request-supplies', methods=['POST'])
def handle_request_supplies():
    data = request.json

    # Save to MongoDB
    requests_collection.insert_one(data.copy())

    # Send Email (Restored)
    subject = f"New Supply Request from {data.get('name')}"
    body = f"New Supply Request!\n\nName: {data.get('name')}\nAddress: {data.get('streetAddress')}, {data.get('city')} {data.get('zip')}\nPhone: {data.get('phoneNumber')}\nEmail: {data.get('email')}\n\nRequested Supplies:\n{data.get('message')}"
    send_email(subject, body)

    return jsonify({"message": "Request saved and sent successfully"}), 200


@app.route('/api/donate-supplies', methods=['POST'])
def handle_donate_supplies():
    data = request.json

    # Save to MongoDB
    donations_collection.insert_one(data.copy())

    # Send Email (Restored)
    subject = f"New Donation Offer from {data.get('name')}"
    body = f"New Supply Donation!\n\nDonor Name: {data.get('name')}\nAddress: {data.get('streetAddress')}, {data.get('city')} {data.get('zip')}\nPhone: {data.get('phoneNumber')}\nEmail: {data.get('email')}\n\nDonation Items:\n{data.get('items')}"
    send_email(subject, body)

    return jsonify({"message": "Donation saved and sent successfully"}), 200


@app.route('/api/delete/<collection_type>/<item_id>', methods=['DELETE'])
@login_required
def delete_item(collection_type, item_id):
    try:
        obj_id = ObjectId(item_id)
        if collection_type == 'donations':
            donations_collection.delete_one({"_id": obj_id})
        elif collection_type == 'requests':
            requests_collection.delete_one({"_id": obj_id})
        else:
            return jsonify({"error": "Invalid collection"}), 400
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/staff', methods=['POST'])
@login_required
@super_admin_required
def add_staff():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if staff_collection.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    staff_collection.insert_one({"username": username, "password": hashed_password})
    return jsonify({"message": "Staff added successfully"}), 200


@app.route('/api/staff/<item_id>', methods=['DELETE'])
@login_required
@super_admin_required
def remove_staff(item_id):
    staff_collection.delete_one({"_id": ObjectId(item_id)})
    return jsonify({"message": "Staff removed"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5001)