"""
email_service.py — Transactional Email Simulator
================================================
Simulates sending high-quality HTML receipts and confirmations for hotel rooms and tours.
Formatted with an elegant royal gold and navy Egyptian theme matching the website.
Saves local copies to backend/uploads/emails/ for verification.
"""

import os
import time
from datetime import datetime, timezone
import logger as log_module

# Ensure the emails directory exists inside uploads
EMAIL_DIR = os.path.join(os.path.dirname(__file__), "uploads", "emails")
os.makedirs(EMAIL_DIR, exist_ok=True)

HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
  <style>
    body {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #040710;
      color: #e0e0e0;
      margin: 0;
      padding: 0;
    }}
    .email-container {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #0a0f1e;
      border: 1px solid #c9a84c;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }}
    .email-header {{
      background: linear-gradient(135deg, #0d1428 0%, #040710 100%);
      border-bottom: 2px solid #c9a84c;
      padding: 30px;
      text-align: center;
    }}
    .email-header h1 {{
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.1em;
      color: #c9a84c;
      text-transform: uppercase;
    }}
    .email-header p {{
      margin: 5px 0 0;
      font-size: 12px;
      color: #a0a8c0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }}
    .email-body {{
      padding: 30px;
      line-height: 1.6;
    }}
    .greeting {{
      font-size: 18px;
      color: #fff;
      margin-bottom: 20px;
    }}
    .status-badge {{
      display: inline-block;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      border-radius: 2px;
      letter-spacing: 0.1em;
      margin-bottom: 25px;
    }}
    .status-pending {{
      background-color: rgba(255, 209, 102, 0.15);
      color: #ffd166;
      border: 1px solid #ffd166;
    }}
    .status-confirmed {{
      background-color: rgba(6, 214, 160, 0.15);
      color: #06d6a0;
      border: 1px solid #06d6a0;
    }}
    .status-paid {{
      background-color: rgba(76, 201, 240, 0.15);
      color: #4cc9f0;
      border: 1px solid #4cc9f0;
    }}
    .status-cancelled {{
      background-color: rgba(239, 71, 111, 0.15);
      color: #ef476f;
      border: 1px solid #ef476f;
    }}
    .details-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }}
    .details-table td {{
      padding: 12px 0;
      border-bottom: 1px solid rgba(201, 168, 76, 0.15);
    }}
    .details-table td.label {{
      font-weight: bold;
      color: #c9a84c;
      width: 160px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .details-table td.value {{
      color: #f5f5f5;
      font-size: 14px;
    }}
    .receipt-box {{
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(201, 168, 76, 0.3);
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }}
    .receipt-title {{
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #a0a8c0;
      margin-bottom: 8px;
    }}
    .receipt-amount {{
      font-size: 32px;
      font-weight: bold;
      color: #c9a84c;
    }}
    .btn-action {{
      display: block;
      width: 220px;
      margin: 30px auto 0;
      text-align: center;
      background-color: #c9a84c;
      color: #040710 !important;
      font-weight: bold;
      text-decoration: none;
      padding: 12px 24px;
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 0.1em;
      border-radius: 2px;
      transition: background-color 0.2s;
    }}
    .email-footer {{
      background-color: #040710;
      border-top: 1px solid rgba(201, 168, 76, 0.15);
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #707888;
    }}
    .email-footer a {{
      color: #c9a84c;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Venus Pyramids Inn</h1>
      <p>Luxury Hotel &amp; Private Egypt Tours</p>
    </div>
    <div class="email-body">
      <div class="greeting">Hello {customer_name},</div>
      
      <p>Thank you for booking with Venus Pyramids Inn. We are thrilled to craft an unforgettable Egyptian experience for you right by the Giza Pyramids.</p>
      
      <div style="text-align: center;">
        <span class="status-badge status-{status}">{status}</span>
      </div>

      <h3 style="color: #fff; border-bottom: 1px solid #c9a84c; padding-bottom: 8px; margin-top: 30px;">Booking Invoice Details</h3>
      <table class="details-table">
        <tr>
          <td class="label">Booking Ref ID</td>
          <td class="value" style="font-family: monospace; font-weight: bold; color: #fff;">{ref_id}</td>
        </tr>
        <tr>
          <td class="label">Item Type</td>
          <td class="value" style="text-transform: capitalize;">{item_type} Booking</td>
        </tr>
        <tr>
          <td class="label">Reserved Item</td>
          <td class="value" style="font-weight: 500; color: #fff;">{item_name}</td>
        </tr>
        <tr>
          <td class="label">Dates</td>
          <td class="value">{dates}</td>
        </tr>
        <tr>
          <td class="label">Customer Contact</td>
          <td class="value">{customer_phone} ({customer_email})</td>
        </tr>
        <tr>
          <td class="label">Transaction Date</td>
          <td class="value">{created_at}</td>
        </tr>
      </table>

      <div class="receipt-box">
        <div class="receipt-title">Total Charged Amount</div>
        <div class="receipt-amount">${total_price:.2f}</div>
        <div style="font-size: 11px; color: #707888; margin-top: 5px;">Taxes and continental breakfast included.</div>
      </div>

      <p style="font-size: 13px; color: #a0a8c0;">
        <strong>Next Steps:</strong> If your booking is <em>pending</em>, our front-office staff will review it shortly. To expedite confirmation, you can instantly message our team via WhatsApp using your Booking Reference.
      </p>

      <a href="https://wa.me/201211385550?text=Hi%20I%20have%20booking%20{ref_id}" class="btn-action">Message on WhatsApp</a>
    </div>
    
    <div class="email-footer">
      <p>&copy; {year} Venus Pyramids Inn. Nazlet El Batran, Giza, Egypt.</p>
      <p>Support: <a href="mailto:info@venuspyramids.com">info@venuspyramids.com</a> | WhatsApp: +20 101 815 7153</p>
    </div>
  </div>
</body>
</html>
"""

def generate_booking_ref(booking_id: int) -> str:
    """Generate a clean, professional booking reference ID."""
    return f"VPI-2026-{booking_id:04d}X"

def send_transactional_email(booking: dict, item_name: str) -> str:
    """
    Formulate and save a beautiful transactional HTML email receipt.
    Simulates sending an email by writing it to `backend/uploads/emails/`
    so users can verify the layout instantly.
    
    Args:
        booking: Dict containing booking details (id, customer_name, customer_email, total_price, etc.)
        item_name: The descriptive name of the booked Room or Tour
        
    Returns:
        The absolute path to the generated HTML email file.
    """
    booking_id = booking["id"]
    status = booking.get("status", "pending").lower()
    ref_id = generate_booking_ref(booking_id)
    
    # Dates formatting
    check_in = booking.get("check_in_date", "N/A")
    check_out = booking.get("check_out_date", "N/A")
    if check_out and check_out != "N/A" and check_out != "N/A (Tour)":
        dates = f"{check_in} to {check_out}"
    else:
        dates = f"{check_in} (Single Excursion)"

    subject = f"Booking Confirmation {ref_id} — Venus Pyramids Inn"
    
    html_content = HTML_TEMPLATE.format(
        subject=subject,
        customer_name=booking.get("customer_name", "Valued Guest"),
        customer_email=booking.get("customer_email", "N/A"),
        customer_phone=booking.get("customer_phone", "N/A"),
        status=status,
        ref_id=ref_id,
        item_type=booking.get("item_type", "room"),
        item_name=item_name,
        dates=dates,
        total_price=float(booking.get("total_price", 0)),
        created_at=booking.get("created_at", datetime.now().strftime("%Y-%m-%d %H:%M")),
        year=datetime.now().year,
    )
    
    # Save the file to uploads/emails/
    filename = f"booking_{booking_id}_{status}.html"
    filepath = os.path.join(EMAIL_DIR, filename)
    
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        log_module.log_info(
            "EMAIL_SIMULATOR",
            f"HTML receipt generated locally at: uploads/emails/{filename}",
            ip="127.0.0.1"
        )
        print(f"  [EMAIL] Formatted HTML invoice saved to: backend/uploads/emails/{filename}")
    except Exception as e:
        log_module.log_error("EMAIL_ERROR", f"Could not save HTML receipt: {str(e)}")
        
    return filepath
