export const ForgetmailHTML = (otp) => {
  return `
      <div style="background-color:#f7f7f7; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #ff6600; text-align: center;">Mr Cuban</h2>
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">
            We received a request to reset the password for your Mr Cuban account. Use the following OTP to reset your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #000; background-color: #ff6600; padding: 10px 20px; border-radius: 5px;">${otp}</span>
          </div>
          <p style="font-size: 16px; color: #333;">
            Please note that this OTP is valid for only 10 minutes. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <p style="font-size: 16px; color: #333;">Best regards,<br />The Mr Cuban Team</p>
          <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">
            © 2024 Mr Cuban. All rights reserved. 
          </p>
        </div>
      </div>
    `;
};

export const WelcomeHTMLWithOTP = (otp) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your MR Cuban Account</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #000000; padding: 20px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; color: #ffa500;">Verify Your MR Cuban Account</h1>
      </div>

      <!-- Content -->
      <div style="padding: 30px;">
        <h2 style="font-size: 22px; color: #000000;">Complete Your Registration</h2>
        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
          Thank you for signing up with MR Cuban! Use the code below to verify your email.
        </p>

        <!-- OTP Code -->
        <div style="font-size: 24px; font-weight: bold; color: #000000; margin: 20px 0; letter-spacing: 2px;">
          ${otp}
        </div>

        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
          Enter this code in the MR Cuban app or website to activate your account.
        </p>

        <!-- Security Notice -->
        <p style="font-size: 14px; color: #777;">
          If you did not request this code, please ignore this message.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #000000; padding: 20px; text-align: center; color: #ffffff; font-size: 14px;">
        <p>&copy; 2024 MR Cuban. All rights reserved.</p>
        <p>
          <a href="https://www.privacypolicies.com/live/dfe8d4ff-f488-4761-8e2f-21fdc8b3052a" style="color: #ffa500; text-decoration: none;">Privacy Policy</a> | 
          <a href="https://mrcuban.in/contact" style="color: #ffa500; text-decoration: none;">Contact Support</a>
        </p>
        <p style="font-size: 12px;">
          If you prefer not to receive these emails, you can 
          <a href="https://mrcuban.in/unsubscribe" style="color: #ffa500; text-decoration: none;">unsubscribe here</a>.
        </p>
      </div>
    </div>
  </body>
  </html>`;
};


//--------------------------------------------Driver Templates--------------------------------------------->

export const WelcomeDriverHTML = () => {
  return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MRCUBAN Partner APP</title>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');

        body {
            font-family: "Lato", system-ui;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #000000;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #27c26d; /* Green color */
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .content h2 {
            font-size: 22px;
            color: #000000;
        }
        .content p {
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
        }
        .footer {
            background-color: #000000;
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-size: 14px;
        }
        .footer a {
            color: #27c26d; /* Green color */
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to MRCUBAN Partner APP!</h1>
        </div>
        <div class="content">
            <h2>Your Account is Being Reviewed</h2>
            <p>
                Thank you for joining the MRCUBAN Partner APP, the most reliable way to drive with us. Your account is currently under review.
            </p>
            <p>
                Once approved, you will receive further details from our team regarding document submission and next steps.
            </p>
        </div>
        <div class="footer">
            <p>&copy; 2024 MRCUBAN. All rights reserved.</p>
            <p>
                <a href="https://www.privacypolicies.com/live/dfe8d4ff-f488-4761-8e2f-21fdc8b3052a">Privacy Policy</a> | 
                <a href="https://www.mrcuban.in/contact">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>

          `;
};

export const ActivationHTML = (email, password) => {
  return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Congratulations! Your Account is Activated - MR Cuban Partners</title>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
v
          body {
  font-family: "Lato", system-ui;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          .header {
              background-color: #000000;
              padding: 20px;
              text-align: center;
              color: #ffffff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              color: #27c26d; /* Green color */
          }
          .content {
              padding: 30px;
              text-align: center;
          }
          .content h2 {
              font-size: 22px;
              color: #000000;
          }
          .content p {
              font-size: 16px;
              color: #333333;
              line-height: 1.5;
          }
          .cta-button {
              display: inline-block;
              background-color: #27c26d; /* Green color */
              color: #ffffff;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              margin-top: 20px;
          }
          .footer {
              background-color: #000000;
              padding: 20px;
              text-align: center;
              color: #ffffff;
              font-size: 14px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Congratulations! Your Account is Activated</h1>
          </div>
          <div class="content">
              <h2>Welcome to MR Cuban Partners</h2>
              <p>
                  We are thrilled to inform you that your account has been successfully activated. You can now log in to the MR Cuban Partners app using your registered credentials below and start accepting rides.
              </p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p>
                  Enjoy the benefits of driving with MR Cuban Partners and providing seamless ride experiences to passengers across the city!
              </p>
          </div>
          <div class="footer">
              <p>&copy; 2024 MR Cuban Partners. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
    `;
};

export const ForgetDrivermailHTML = (otp) => {
  return `
        <div style="background-color:#f7f7f7; padding: 20px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #27c26d; text-align: center;">MR Cuban Partners</h2>
            <p style="font-size: 16px; color: #333;">Hi there,</p>
            <p style="font-size: 16px; color: #333;">
              We received a request to reset the password for your MR Cuban Partners account. Use the following OTP to reset your password:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #fff; background-color: #000000; padding: 10px 20px; border-radius: 5px;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #333;">
              Please note that this OTP is valid for only 10 minutes. If you didn't request a password reset, you can safely ignore this email.
            </p>
            <p style="font-size: 16px; color: #333;">Best regards,<br />The MR Cuban Partners Team</p>
            <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #777; text-align: center;">
              © 2024 MR Cuban Partners. All rights reserved. 
            </p>
          </div>
        </div>
      `;
};

// --------------------------------------------Dev Templates-------------------------------

export const CreateOrderDevTemplate = (
  pickup_address,
  drop_address,
  pickup_date,
  customer_id,
  trip_type,
  seater,
  distance,
  name,
  email,
  phone
) => {
  return ` <!DOCTYPE html>
<html>
<head>
  <title>Order Confirmation - Mr Cuban</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #ff6600;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
    }
    .content {
      padding: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
      margin: 10px 0;
    }
    .info {
      background-color: #f1f1f1;
      border-radius: 5px;
      padding: 15px;
      margin-top: 10px;
    }
    .info p {
      margin: 5px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Mr Cuban</h1>
      <p>Your Ride Booking Confirmation</p>
    </div>
    <div class="content">
      <p>Hi <strong>Mr Cuban</strong>,</p>
      <p>Thank you for booking with <strong>Mr Cuban</strong>! Here are your ride details:</p>
      <div class="info">
   <p><strong>Booking ID:</strong> <a href={https://cuban.onrender.com/ride/status?q=${customer_id}} style="text-decoration:none;cursor:pointer;"> ${customer_id}</a></p>
        <p><strong>Ride Date:</strong> ${pickup_date}</p>
        <p><strong>Pickup Location:</strong> ${pickup_address}</p>
        <p><strong>Drop-off Location:</strong> ${drop_address}</p>
        <p><strong>Total Distance:</strong> ${distance} KM</p>
        <p><strong>Trip Type:</strong> ${trip_type}</p>
        <p><strong>Seat:</strong> ${seater}</p>
        <p><strong>Customer Name:</strong> ${name}</p>
         <p><strong>Customer Phone:</strong><a href=${`tel:${phone}`}>+91 ${phone} </a></p>
           <p><strong>Customer Email:</strong><a href="mailto:${email}?subject=Inquiry&body=Hello, I would like to know more about your services."> ${email}</a></p>


      </div>
      <p>If you have any questions or need assistance, feel free to contact us.</p>
      <p>Safe travels!</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Mr Cuban. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};
