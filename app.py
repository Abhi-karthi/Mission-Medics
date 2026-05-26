from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# --- EMAIL CONFIGURATION ---
SENDER_EMAIL = "aabbhhiikkaarrtthhii@gmail.com"
SENDER_PASSWORD = "aabbhhiikkaarrtthhii77"
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


# --- PAGE ROUTES ---
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


# --- API ENDPOINTS ---
@app.route('/api/request-supplies', methods=['POST'])
def handle_request_supplies():
    data = request.json
    subject = f"New Supply Request from {data.get('name')}"
    body = f"""
    New Supply Request!

    Name: {data.get('name')}
    Address: {data.get('streetAddress')}, {data.get('city')} {data.get('zip')}
    Phone: {data.get('phoneNumber')}
    Email: {data.get('email')}

    Requested Supplies:
    {data.get('message')}
    """
    if send_email(subject, body):
        return jsonify({"message": "Request sent successfully"}), 200
    return jsonify({"error": "Failed to send email"}), 500


@app.route('/api/donate-supplies', methods=['POST'])
def handle_donate_supplies():
    data = request.json
    subject = f"New Donation Offer from {data.get('name')}"
    body = f"""
    New Supply Donation!

    Donor Name: {data.get('name')}
    Address: {data.get('streetAddress')}, {data.get('city')} {data.get('zip')}
    Phone: {data.get('phoneNumber')}
    Email: {data.get('email')}

    Donation Items:
    {data.get('items')}
    """
    if send_email(subject, body):
        return jsonify({"message": "Donation sent successfully"}), 200
    return jsonify({"error": "Failed to send email"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)