import { URL } from "node:url";
import {
  authenticateAdmin,
  verifyToken,
  logoutToken,
  updatePassword,
  addInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getPublicContent,
  updateContent,
  saveUploadedImage,
} from "./db.js";

// Helper to read JSON request body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // Protect against gigantic payloads (10MB max for base64 images)
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", (err) => reject(err));
  });
}

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(payload);
}

function sendText(res, statusCode, text, contentType = "text/plain") {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(text);
}

function getBearerToken(req) {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (!auth || typeof auth !== "string") return null;
  const parts = auth.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }
  return null;
}

export async function handleApiRequest(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return true;
  }

  const reqUrl = new URL(req.url, "http://localhost");
  const pathname = reqUrl.pathname;

  // Only handle /api routes
  if (!pathname.startsWith("/api/")) {
    return false;
  }

  try {
    // 1. PUBLIC: Get site content
    if (pathname === "/api/content" && req.method === "GET") {
      sendJson(res, 200, getPublicContent());
      return true;
    }

    // 2. PUBLIC: Submit contact/session inquiry
    if (pathname === "/api/inquiries" && req.method === "POST") {
      const body = await readBody(req);
      if (!body.name || (!body.email && !body.phone)) {
        sendJson(res, 400, {
          error: "Name and at least one contact method (email or phone) are required.",
        });
        return true;
      }
      const item = addInquiry(body);
      sendJson(res, 201, {
        success: true,
        message: "Enquiry submitted successfully",
        inquiry: item,
      });
      return true;
    }

    // 3. AUTH: Login
    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readBody(req);
      const auth = authenticateAdmin(body.username, body.password);
      if (!auth) {
        sendJson(res, 401, { error: "Invalid username or password" });
        return true;
      }
      sendJson(res, 200, auth);
      return true;
    }

    // 4. AUTH: Verify token
    if (pathname === "/api/auth/verify" && req.method === "GET") {
      const token = getBearerToken(req);
      const valid = verifyToken(token);
      if (valid) {
        sendJson(res, 200, { authenticated: true });
      } else {
        sendJson(res, 401, { authenticated: false, error: "Invalid or expired session" });
      }
      return true;
    }

    // 5. AUTH: Logout
    if (pathname === "/api/auth/logout" && req.method === "POST") {
      const token = getBearerToken(req);
      if (token) logoutToken(token);
      sendJson(res, 200, { success: true });
      return true;
    }

    // PROTECTED ROUTES BELOW (Require valid bearer token)
    const token = getBearerToken(req);
    if (!verifyToken(token)) {
      sendJson(res, 401, { error: "Unauthorized. Please log in." });
      return true;
    }

    // 6. PROTECTED: Change admin password
    if (pathname === "/api/auth/change-password" && req.method === "POST") {
      const body = await readBody(req);
      if (!body.oldPassword || !body.newPassword) {
        sendJson(res, 400, { error: "Both old and new password are required" });
        return true;
      }
      if (body.newPassword.length < 6) {
        sendJson(res, 400, { error: "New password must be at least 6 characters" });
        return true;
      }
      const result = updatePassword(body.oldPassword, body.newPassword);
      if (!result.success) {
        sendJson(res, 400, { error: result.message });
        return true;
      }
      sendJson(res, 200, { success: true, message: "Password updated successfully" });
      return true;
    }

    // 7. PROTECTED: Get all inquiries
    if (pathname === "/api/admin/inquiries" && req.method === "GET") {
      sendJson(res, 200, getInquiries());
      return true;
    }

    // 8. PROTECTED: Export inquiries as CSV
    if (pathname === "/api/admin/inquiries/export.csv" && req.method === "GET") {
      const inquiries = getInquiries();
      let csv = "ID,Date,Client Name,Age,Location,WhatsApp,Email,Mode,Seeking For,Other Client,Psychologist,Issues,Timings,Days,Status,Message\n";
      for (const inq of inquiries) {
        const clean = (str) => `"${(str || "").toString().replace(/"/g, '""').replace(/\n/g, " ")}"`;
        const issuesStr = Array.isArray(inq.issues) ? inq.issues.join("; ") : (inq.issues || "");
        csv += `${inq.id},${inq.createdAt},${clean(inq.name)},${clean(inq.age)},${clean(inq.location)},${clean(inq.phone)},${clean(inq.email)},${clean(inq.sessionMode)},${clean(inq.seekingFor)},${clean(inq.otherClientDetails)},${clean(inq.preferredTherapist)},${clean(issuesStr)},${clean(inq.suitableTiming)},${clean(inq.suitableDays)},${inq.status},${clean(inq.message)}\n`;
      }
      res.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="listeningkorner-inquiries-${Date.now()}.csv"`,
      });
      res.end(csv);
      return true;
    }

    // 9. PROTECTED: Update inquiry status (PATCH /api/admin/inquiries/:id)
    if (pathname.startsWith("/api/admin/inquiries/") && req.method === "PATCH") {
      const id = pathname.replace("/api/admin/inquiries/", "");
      const body = await readBody(req);
      const updated = updateInquiryStatus(id, body.status);
      if (!updated) {
        sendJson(res, 404, { error: "Inquiry not found" });
        return true;
      }
      sendJson(res, 200, updated);
      return true;
    }

    // 10. PROTECTED: Delete inquiry (DELETE /api/admin/inquiries/:id)
    if (pathname.startsWith("/api/admin/inquiries/") && req.method === "DELETE") {
      const id = pathname.replace("/api/admin/inquiries/", "");
      const deleted = deleteInquiry(id);
      if (!deleted) {
        sendJson(res, 404, { error: "Inquiry not found" });
        return true;
      }
      sendJson(res, 200, { success: true });
      return true;
    }

    // 11. PROTECTED: Update content (PUT /api/admin/content/:section)
    if (pathname.startsWith("/api/admin/content/") && (req.method === "PUT" || req.method === "POST")) {
      const section = pathname.replace("/api/admin/content/", "");
      const body = await readBody(req);
      const updated = updateContent(section, body);
      sendJson(res, 200, { success: true, content: updated });
      return true;
    }

    // 12. PROTECTED: Upload image (POST /api/admin/upload)
    if (pathname === "/api/admin/upload" && req.method === "POST") {
      const body = await readBody(req);
      if (!body.image) {
        sendJson(res, 400, { error: "Image data URL is required" });
        return true;
      }
      try {
        const url = saveUploadedImage(body.image, body.filename);
        sendJson(res, 200, { success: true, url });
      } catch (err) {
        sendJson(res, 400, { error: err.message || "Failed to save image" });
      }
      return true;
    }

    // Fallthrough for unmatched /api route
    sendJson(res, 404, { error: "API route not found" });
    return true;
  } catch (err) {
    console.error("API Error:", err);
    sendJson(res, 500, { error: "Internal server error" });
    return true;
  }
}
