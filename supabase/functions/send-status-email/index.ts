import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusEmailRequest {
  studentEmail: string;
  studentName: string;
  applicationNumber: string;
  courseName: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  admitCardNumber?: string;
  remarks?: string;
}

const getStatusDetails = (status: string) => {
  switch (status) {
    case "submitted":
      return {
        subject: "Application Submitted Successfully",
        title: "Your Application Has Been Submitted",
        message: "Thank you for submitting your application. Our team will review it shortly.",
        color: "#3b82f6",
      };
    case "under_review":
      return {
        subject: "Application Under Review",
        title: "Your Application is Under Review",
        message: "Your application is currently being reviewed by our admissions team. We will notify you once a decision has been made.",
        color: "#f59e0b",
      };
    case "approved":
      return {
        subject: "Congratulations! Application Approved",
        title: "Your Application Has Been Approved!",
        message: "We are pleased to inform you that your application has been approved. Your admit card has been generated and is available for download in your dashboard.",
        color: "#10b981",
      };
    case "rejected":
      return {
        subject: "Application Status Update",
        title: "Application Decision",
        message: "After careful review, we regret to inform you that your application has not been approved at this time.",
        color: "#ef4444",
      };
    default:
      return {
        subject: "Application Status Update",
        title: "Application Status Update",
        message: "Your application status has been updated.",
        color: "#6b7280",
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      studentEmail,
      studentName,
      applicationNumber,
      courseName,
      status,
      admitCardNumber,
      remarks,
    }: StatusEmailRequest = await req.json();

    console.log(`Sending ${status} email to ${studentEmail}`);

    const statusDetails = getStatusDetails(status);
    const currentDateTime = new Date().toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background-color: ${statusDetails.color}; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">${statusDetails.title}</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  Dear <strong>${studentName || "Student"}</strong>,
                </p>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  ${statusDetails.message}
                </p>
                
                <!-- Application Details -->
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Application Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application Number:</td>
                      <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${applicationNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Course Applied:</td>
                      <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${courseName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
                      <td style="padding: 8px 0;">
                        <span style="background-color: ${statusDetails.color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                          ${status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date & Time:</td>
                      <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${currentDateTime}</td>
                    </tr>
                    ${
                      admitCardNumber
                        ? `<tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Admit Card Number:</td>
                            <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 700;">${admitCardNumber}</td>
                          </tr>`
                        : ""
                    }
                  </table>
                </div>
                
                ${
                  remarks
                    ? `<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px;">Remarks from Admin:</h4>
                        <p style="color: #78350f; margin: 0; font-size: 14px;">${remarks}</p>
                      </div>`
                    : ""
                }
                
                ${
                  status === "approved"
                    ? `<div style="background-color: #d1fae5; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="color: #065f46; font-size: 16px; margin: 0;">
                          🎉 Please login to your dashboard to download your admit card.
                        </p>
                      </div>`
                    : ""
                }
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                  If you have any questions, please don't hesitate to contact our admissions office.
                </p>
                
                <p style="color: #374151; font-size: 14px; line-height: 1.6;">
                  Best regards,<br>
                  <strong>Admissions Office</strong>
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  This is an automated email. Please do not reply directly to this message.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Admissions <onboarding@resend.dev>",
        to: [studentEmail],
        subject: statusDetails.subject,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(emailResult)}`);
    }

    return new Response(JSON.stringify(emailResult), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending status email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
