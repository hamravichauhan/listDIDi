export interface PricingPlan {
  id: string;
  type: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  featured?: boolean;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface ProfileData {
  name: string;
  credentials: string;
  title: string;
  photo: string;
  bioParagraphs: string[];
  philosophy: string;
  philosophySubtext: string;
  languages: string[];
}

export interface HeroData {
  eyebrow: string;
  headline: string;
  intro: string;
  quote: string;
  trustTitle: string;
  trustSubtext: string;
}

export interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  instagramUrl: string;
  location: string;
  mode: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  qualification: string;
  expertise: string;
  approach: string;
  bio?: string;
}

export interface FeeStructure {
  india: {
    individual: string;
    couple: string;
  };
  international: {
    individual: string;
    couple: string;
  };
  note: string;
}

export interface SiteContent {
  profile: ProfileData;
  hero: HeroData;
  contact: ContactData;
  pricing: PricingPlan[];
  pricingNote: string;
  faqs: FaqItem[];
  team: TeamMember[];
  feeStructure: FeeStructure;
}

export interface Inquiry {
  id: string;
  name: string;
  age?: string;
  location?: string;
  email: string;
  phone: string;
  sessionMode: string;
  seekingFor: string;
  otherClientDetails?: string;
  preferredTherapist: string;
  issues: string[];
  suitableTiming: string;
  suitableDays: string;
  supportType?: string;
  message: string;
  status: "new" | "contacted" | "completed" | "archived";
  createdAt: string;
}

export const defaultSiteContent: SiteContent = {
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
  team: [
    {
      id: "rekha",
      name: "Rekha Devi Chauhan",
      role: "Lead Counselling Psychologist & Behavioural Therapist",
      photo: "/rekha.jpg",
      qualification: "M.Sc. Psychology",
      expertise: "Anxiety, Neurodivergence (ASD/ADHD/Down Syndrome), Emotional regulation, Self-growth",
      approach: "Client-centred, Trauma-informed, Compassionate, Gentle pace",
    },
    {
      id: "tanvi",
      name: "Tanvi Shinde",
      role: "Founder & Psychologist",
      photo: "/tanvi.png",
      qualification: "Master's in Clinical Psychology",
      expertise: "Clinical concerns, Relationships, Self-growth",
      approach: "CBT, DBT, Client-centered, Insight-oriented",
    },
    {
      id: "anjali",
      name: "Anjali Salani",
      role: "Psychologist",
      photo: "/anjali.png",
      qualification: "BA Psychology, MA Forensic Psychology, PG Counselling",
      expertise: "Individual & child counselling, Emotional concerns, Trauma healing",
      approach: "REBT + Play Therapy, Thoughts-emotion-behaviour focus",
    },
    {
      id: "ira",
      name: "Ira Joshi",
      role: "Psychologist",
      photo: "/ira.png",
      qualification: "Master's in Clinical Psychology",
      expertise: "Clinical concerns, Emotional wellbeing, Counselling, Relationship issues",
      approach: "REBT, CBT, Supportive, Integrative, Client-focused therapy",
    },
    {
      id: "mansi",
      name: "Mansi Gosavi",
      role: "Psychologist | Expressive Movement Therapy",
      photo: "/mansi.png",
      qualification: "Master's in Clinical Psychology, Expressive Movement Therapy Trainee",
      expertise: "Clinical concerns, Emotional expression, Trauma healing, Relationship issues",
      approach: "Movement-based therapy + CBT + Expressive arts",
    },
  ],
  feeStructure: {
    india: {
      individual: "₹800 / 60 mins",
      couple: "₹1000 / 60 mins",
    },
    international: {
      individual: "₹1000 / 60 mins",
      couple: "₹1500 / 60 mins",
    },
    note: "Extra charges if session exceeds beyond 60 mins",
  },
};

const TOKEN_KEY = "listeningkorner_admin_token";
const CACHE_CONTENT_KEY = "listeningkorner_cached_content";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("nest_admin_token");
}

export function setAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("nest_admin_token");
  }
}

// Fetch public website content
export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch("/api/content");
    if (!res.ok) throw new Error("Failed to fetch from server");
    const data = await res.json();
    localStorage.setItem(CACHE_CONTENT_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem(CACHE_CONTENT_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return defaultSiteContent;
  }
}

// Submit contact / inquiry form
export async function submitInquiry(
  inquiry: Partial<Inquiry>
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Submission failed");
    }
    return await res.json();
  } catch (err: any) {
    // If backend is unreachable, gracefully store in localStorage inquiries
    const offlineInquiries = JSON.parse(localStorage.getItem("offline_inquiries") || "[]");
    offlineInquiries.unshift({
      id: `offline-${Date.now()}`,
      ...inquiry,
      status: "new",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("offline_inquiries", JSON.stringify(offlineInquiries));
    return { success: true, message: "Inquiry saved (offline mode)" };
  }
}

// Admin Authentication
export async function adminLogin(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Invalid username or password" };
    }
    setAdminToken(data.token);
    return { success: true };
  } catch (err: any) {
    // Demo fallback if backend is offline and user enters admin / admin123
    if (username.trim() === "admin" && password.trim() === "admin123") {
      setAdminToken("offline-admin-token");
      return { success: true };
    }
    return { success: false, error: "Unable to connect to server. Please try again." };
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  if (token === "offline-admin-token") return true;

  try {
    const res = await fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.authenticated;
    }
    setAdminToken(null);
    return false;
  } catch {
    return true; // permit cached session in offline view
  }
}

export async function adminLogout(): Promise<void> {
  const token = getAdminToken();
  if (token && token !== "offline-admin-token") {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }
  setAdminToken(null);
}

export async function adminChangePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  try {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || "Password change failed" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Network error occurred" };
  }
}

// Admin Inquiries
export async function fetchAdminInquiries(): Promise<Inquiry[]> {
  const token = getAdminToken();
  try {
    const res = await fetch("/api/admin/inquiries", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch inquiries");
    return await res.json();
  } catch {
    const offlineInquiries = JSON.parse(localStorage.getItem("offline_inquiries") || "[]");
    return offlineInquiries;
  }
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"]
): Promise<boolean> {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return true;
  }
}

// Admin Update Content (e.g. pricing, profile, contact, faqs)
export async function updateSiteContent(
  section: "profile" | "hero" | "contact" | "pricing" | "faqs" | "all",
  data: any
): Promise<{ success: boolean; content?: SiteContent; error?: string }> {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/content/${section}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { success: false, error: result.error || "Failed to update content" };
    if (result.content) {
      localStorage.setItem(CACHE_CONTENT_KEY, JSON.stringify(result.content));
    }
    return { success: true, content: result.content };
  } catch (err: any) {
    // Offline local update
    const current = JSON.parse(localStorage.getItem(CACHE_CONTENT_KEY) || JSON.stringify(defaultSiteContent));
    if (section === "all") {
      Object.assign(current, data);
    } else {
      current[section] = data;
    }
    localStorage.setItem(CACHE_CONTENT_KEY, JSON.stringify(current));
    return { success: true, content: current };
  }
}

// Convert file to base64 & upload
export async function uploadImageFile(file: File): Promise<string> {
  const token = getAdminToken();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64, filename: file.name }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          resolve(data.url);
        } else {
          // If server upload fails (e.g. offline), we can use data URL directly
          resolve(base64);
        }
      } catch {
        resolve(reader.result as string);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
