from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    sender_email = "your-email@gmail.com"  # Replace with your email
    sender_password = "your-email-password"  # Replace with your email password or app password
    recipient_email = "tayyeba.dev@gmail.com"  # Replace with the recipient's email

    # Validate input
    if not all(key in data for key in ("from", "subject", "message")):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Create the email
        msg = MIMEMultipart()
        msg["From"] = data["from"]
        msg["To"] = recipient_email
        msg["Subject"] = data["subject"]
        msg.attach(MIMEText(data["message"], "plain"))

        # Send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())

        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
