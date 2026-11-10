import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site_data.json");
const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads");

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

const defaultSalt = "c4a7e9b8f10234a5d89c0b1e2f3a4b5c";
const defaultPasswordHash = hashPassword("admin123", defaultSalt);

const defaultData = {
  admin: {
    username: "admin",
    salt: defaultSalt,
    passwordHash: defaultPasswordHash,
  },
  tokens: {},
  profile: {
    name: "Rekha Devi Chauhan",
    credentials: "M.Sc. Psychology · Counselling Psychologist",
    title: "Counselling Psychologist & Behavioural Therapist",
    photo: "/rekha.jpg",
    bioParagraphs: [
      "I’m a counselling psychologist who offers a compassionate, patient-centred space where you can speak openly and feel truly heard. My work is grounded in empathy, curiosity, and respect for your lived experience.",
      "I have experience supporting neurodivergent individuals—including people with ASD, ADHD, and Down Syndrome—and understand that there is no single “right” way to learn, communicate, or grow.",
      "Our sessions move at a pace that feels comfortable for you, with space for silence, questions, and whatever you need to bring.",
    ],
    philosophy: "Every individual has the potential to learn and grow at their own pace.",
    philosophySubtext:
      "Therapy is not about changing who you are. It is about creating enough safety to understand yourself, discover what supports you, and make room for growth that feels authentic.",
    languages: ["English", "Hindi", "Konkani"],
  },
  hero: {
    eyebrow: "A gentle space for your mind",
    headline: "A space to be heard.\nA place to grow.",
    intro:
      "Hi, I’m Rekha Devi Chauhan. I provide a safe, empathetic space for your mental health journey—with zero judgment.",
    quote: "A calm corner to simply be.",
    trustTitle: "You don’t have to have it all figured out.",
    trustSubtext: "We can begin exactly where you are.",
  },
  contact: {
    email: "listeningkorner.in@gmail.com",
    phone: "+91 4677 6914",
    whatsapp: "9146776914",
    instagram: "@listeningkorner",
    instagramUrl: "https://instagram.com/listeningkorner",
    location: "Mapuca, Goa · Online across India",
    mode: "Online · Google Meet",
  },
  pricing: [
    {
      id: "intro",
      type: "Individual Therapy",
      name: "Introductory",
      price: "200",
      duration: "45 minutes",
      description: "A gentle first conversation to understand what you need.",
      featured: false,
    },
    {
      id: "standard",
      type: "Individual Therapy",
      name: "Standard",
      price: "600",
      duration: "45 minutes",
      description: "Ongoing support with space to reflect, process, and grow.",
      featured: true,
    },
    {
      id: "extended",
      type: "Individual Therapy",
      name: "Extended",
      price: "700",
      duration: "60 minutes",
      description: "A little more room for deeper processing when you need it.",
      featured: false,
    },
  ],
  pricingNote:
    "If cost is a barrier, please reach out. We can have an open conversation about what may be possible.",
  faqs: [
    {
      id: "faq-1",
      q: "How do online sessions work?",
      a: "After booking, you’ll receive a private Google Meet link by email or WhatsApp. At your session time, simply join from a quiet place where you feel comfortable.",
    },
    {
      id: "faq-2",
      q: "What happens in the first session?",
      a: "The first session is a gentle conversation about what brings you to therapy, what support might feel useful, and any questions you have. There is no pressure to share everything at once.",
    },
    {
      id: "faq-3",
      q: "Do I need to prepare anything?",
      a: "Not at all. You can arrive exactly as you are. If it helps, you may note down anything you would like to talk about, but this is completely optional.",
    },
  ],
  inquiries: [
    {
      id: "inq-sample-1",
      name: "Ananya Sharma",
      age: "24",
      location: "Bengaluru, Karnataka",
      phone: "+91 98765 43210",
      email: "ananya.s@example.com",
      sessionMode: "online - video / audio call",
      seekingFor: "self",
      otherClientDetails: "",
      preferredTherapist: "Rekha Devi Chauhan",
      issues: ["Anxiety/Depression/anger issues/mood problems", "Work issues", "Self Growth"],
      suitableTiming: "4.00 to 6.00 pm",
      suitableDays: "Weekdays",
      supportType: "Individual session (₹800/60 mins)",
      message:
        "Hello, I’ve been feeling overwhelmed with work burnout and anxiety recently. I would love to schedule a session on a weekday evening.",
      status: "new",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
  team: [
    {
      id: "rekha",
      name: "Rekha Devi Chauhan",
      role: "Lead Counselling Psychologist & Behavioural Therapist",
      photo: "/rekha.jpg",
      qualification: "M.Sc. Psychology",
      expertise: "Anxiety, Neurodivergent support (ASD/ADHD/Down Syndrome), Emotional regulation, Self-growth",
      approach: "Client-centred, Trauma-informed, Compassionate, Gentle pace"
    },
    {
      id: "tanvi",
      name: "Tanvi Shinde",
      role: "Founder & Psychologist",
      photo: "/tanvi.png",
      qualification: "Master's in Clinical Psychology",
      expertise: "Clinical concerns, Relationships, Self-growth",
      approach: "CBT, DBT, Client-centered, Insight-oriented"
    },
    {
      id: "anjali",
      name: "Anjali Salani",
      role: "Psychologist",
      photo: "/anjali.png",
      qualification: "BA Psychology, MA Forensic Psychology, PG Counselling",
      expertise: "Individual & child counselling, Emotional concerns, Trauma healing",
      approach: "REBT + Play Therapy, Thoughts-emotion-behaviour focus"
    },
    {
      id: "ira",
      name: "Ira Joshi",
      role: "Psychologist",
      photo: "/ira.png",
      qualification: "Master's in Clinical Psychology",
      expertise: "Clinical concerns, Emotional wellbeing, Counselling, Relationship issues",
      approach: "REBT, CBT, Supportive, Integrative, Client-focused therapy"
    },
    {
      id: "mansi",
      name: "Mansi Gosavi",
      role: "Psychologist | Expressive Movement Therapy",
      photo: "/mansi.png",
      qualification: "Master's in Clinical Psychology, Expressive Movement Therapy Trainee",
      expertise: "Clinical concerns, Emotional expression, Trauma healing, Relationship issues",
      approach: "Movement-based therapy + CBT + Expressive arts"
    }
  ],
  feeStructure: {
    india: {
      individual: "₹800 / 60 mins",
      couple: "₹1000 / 60 mins"
    },
    international: {
      individual: "₹1000 / 60 mins",
      couple: "₹1500 / 60 mins"
    },
    note: "Extra charges if session exceeds beyond 60 mins"
  }
};

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function loadData() {
  ensureDirs();
  if (!fs.existsSync(DATA_FILE)) {
    saveData(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    // Merge missing top-level keys if any
    return { ...defaultData, ...data };
  } catch (err) {
    console.error("Error reading site_data.json, returning default:", err);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

export function saveData(data) {
  ensureDirs();
  const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DATA_FILE);
}

// Authentication
export function authenticateAdmin(username, password) {
  const data = loadData();
  const admin = data.admin;
  if (!admin) return null;

  if (username !== admin.username && username !== "rekha") {
    return null;
  }

  const hash = hashPassword(password, admin.salt);
  if (hash !== admin.passwordHash) {
    return null;
  }

  // Generate session token (valid 14 days)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 14 * 24 * 3600 * 1000;

  if (!data.tokens) data.tokens = {};
  data.tokens[token] = {
    username: admin.username,
    expiresAt,
  };
  saveData(data);

  return { token, expiresAt, username: admin.username };
}

export function verifyToken(token) {
  if (!token) return false;
  const data = loadData();
  if (!data.tokens || !data.tokens[token]) return false;

  const session = data.tokens[token];
  if (Date.now() > session.expiresAt) {
    delete data.tokens[token];
    saveData(data);
    return false;
  }
  return true;
}

export function logoutToken(token) {
  if (!token) return;
  const data = loadData();
  if (data.tokens && data.tokens[token]) {
    delete data.tokens[token];
    saveData(data);
  }
}

export function updatePassword(oldPassword, newPassword) {
  const data = loadData();
  const admin = data.admin;
  const oldHash = hashPassword(oldPassword, admin.salt);
  if (oldHash !== admin.passwordHash) {
    return { success: false, message: "Current password does not match." };
  }

  const newSalt = generateSalt();
  admin.salt = newSalt;
  admin.passwordHash = hashPassword(newPassword, newSalt);
  data.tokens = {}; // revoke existing sessions
  saveData(data);
  return { success: true };
}

// Inquiries
export function addInquiry(inquiry) {
  const data = loadData();
  const newInquiry = {
    id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: inquiry.name?.trim() || "Anonymous",
    age: inquiry.age?.toString().trim() || "",
    location: inquiry.location?.trim() || "",
    email: inquiry.email?.trim() || "",
    phone: inquiry.phone?.trim() || "",
    sessionMode: inquiry.sessionMode || "online - video / audio call",
    seekingFor: inquiry.seekingFor || "self",
    otherClientDetails: inquiry.otherClientDetails?.trim() || "",
    preferredTherapist: inquiry.preferredTherapist || "Rekha Devi Chauhan",
    issues: Array.isArray(inquiry.issues) ? inquiry.issues : inquiry.issues ? [inquiry.issues] : [],
    suitableTiming: inquiry.suitableTiming || "",
    suitableDays: inquiry.suitableDays || "",
    supportType: inquiry.supportType || inquiry.preferredTherapist || "General Enquiry",
    message: inquiry.message?.trim() || "",
    status: "new",
    createdAt: new Date().toISOString(),
  };
  if (!Array.isArray(data.inquiries)) {
    data.inquiries = [];
  }
  data.inquiries.unshift(newInquiry);
  saveData(data);
  return newInquiry;
}

export function getInquiries() {
  const data = loadData();
  return data.inquiries || [];
}

export function updateInquiryStatus(id, status) {
  const data = loadData();
  const item = (data.inquiries || []).find((i) => i.id === id);
  if (!item) return null;
  item.status = status;
  saveData(data);
  return item;
}

export function deleteInquiry(id) {
  const data = loadData();
  if (!data.inquiries) return false;
  const initialLen = data.inquiries.length;
  data.inquiries = data.inquiries.filter((i) => i.id !== id);
  if (data.inquiries.length !== initialLen) {
    saveData(data);
    return true;
  }
  return false;
}

// Public Site Content (no sensitive data)
export function getPublicContent() {
  const data = loadData();
  return {
    profile: data.profile,
    hero: data.hero,
    contact: data.contact,
    pricing: data.pricing,
    pricingNote: data.pricingNote,
    faqs: data.faqs,
    team: data.team,
    feeStructure: data.feeStructure,
  };
}

// Content Updates (Admin Only)
export function updateContent(section, newContent) {
  const data = loadData();
  if (section === "all") {
    if (newContent.profile) data.profile = newContent.profile;
    if (newContent.hero) data.hero = newContent.hero;
    if (newContent.contact) data.contact = newContent.contact;
    if (newContent.pricing) data.pricing = newContent.pricing;
    if (newContent.pricingNote !== undefined) data.pricingNote = newContent.pricingNote;
    if (newContent.faqs) data.faqs = newContent.faqs;
    if (newContent.team) data.team = newContent.team;
    if (newContent.feeStructure) data.feeStructure = newContent.feeStructure;
  } else if (data[section] !== undefined) {
    data[section] = newContent;
  }
  saveData(data);
  return getPublicContent();
}

// Image upload handling (base64 data URL)
export function saveUploadedImage(base64Data, filename) {
  ensureDirs();
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image data");
  }

  const extension = matches[1].split("/")[1] || "jpg";
  const cleanFilename = `${Date.now()}-${filename ? filename.replace(/[^a-zA-Z0-9_-]/g, "") : "image"}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, cleanFilename);
  const buffer = Buffer.from(matches[2], "base64");

  fs.writeFileSync(filePath, buffer);
  return `/uploads/${cleanFilename}`;
}
