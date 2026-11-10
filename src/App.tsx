import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  type SiteContent,
  type ProfileData,
  type HeroData,
  type ContactData,
  type PricingPlan,
  type FaqItem,
  type FeeStructure,
  defaultSiteContent,
  fetchSiteContent,
  submitInquiry,
} from "./api";
import { AdminPortal } from "./Admin";

type Page = "home" | "about" | "approach" | "sessions" | "contact" | "admin";

const pageLabels: Record<Exclude<Page, "admin">, string> = {
  home: "Home",
  about: "Meet Rekha",
  approach: "Approach",
  sessions: "Sessions & Fees",
  contact: "Book a Session",
};

const natureImage =
  "https://images.unsplash.com/photo-1757906574574-95f45fe2a69c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200";

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    leaf: (
      <path d="M20.7 3.3C13.3 3.7 6.5 5.6 4 10.5c-1.6 3.2.2 6.6 3.5 7.1m13.2-14.3c.1 7.2-2.8 13-7.5 14.8-2.1.8-4.2.4-5.7-.5m0 0L3.3 21m4.2-3.4c2.6-3.8 5.5-6.8 9.2-9.2" />
    ),
    laptop: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M2 20h20M9 20v-3m6 3v-3" />
      </>
    ),
    shield: <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Zm-3-10 2 2 4-4" />,
    waves: (
      <>
        <path d="M3 7c2.2 0 2.2-2 4.5-2S9.8 7 12 7s2.2-2 4.5-2S18.8 7 21 7M3 12c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.2-2 4.5-2 2.3 2 4.5 2M3 17c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.2-2 4.5-2 2.3 2 4.5 2" />
      </>
    ),
    steps: <path d="M4 19h5v-5h5V9h6M17 6l3 3-3 3" />,
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="m8.5 12-1 9 4.5-2 4.5 2-1-9" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9.5 9.5 0 0 1-4-.9L3 21l1.7-4.2A8.6 8.6 0 1 1 21 11.5Z" />
        <path d="M8 9.5c.8 2 2.5 3.7 4.5 4.5l1.5-1" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </>
    ),
    language: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ therapistName }: { therapistName?: string }) {
  return (
    <a href="#home" className="brand" aria-label="Listening Korner home">
      <span className="brand-mark">
        <span />
      </span>
      <span>
        <b>Listening Korner</b>
        <small>with {therapistName || "Rekha Chauhan"}</small>
      </span>
    </a>
  );
}

function Header({ page, therapistName }: { page: Page; therapistName?: string }) {
  const [open, setOpen] = useState(false);
  const navKeys: Exclude<Page, "home" | "admin">[] = ["about", "approach", "sessions"];

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Brand therapistName={therapistName} />
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
        <nav className={open ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          {navKeys.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className={page === key ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {pageLabels[key]}
            </a>
          ))}
          <a href="#contact" className="button button-small" onClick={() => setOpen(false)}>
            Book a Session
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer({
  contact,
  onOpenAdmin,
}: {
  contact: ContactData;
  onOpenAdmin: () => void;
}) {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <Brand />
          <p>Compassionate online counselling for a gentler way forward.</p>
          <div className="footer-admin-link">
            <button
              onClick={onOpenAdmin}
              className="admin-link-subtle"
              type="button"
              title="Open Admin Portal to manage prices, inquiries, and content"
            >
              <Icon name="lock" size={13} />
              Admin Portal
            </button>
          </div>
        </div>
        <div>
          <h3>Explore</h3>
          <a href="#about">Meet Rekha</a>
          <a href="#approach">Approach</a>
          <a href="#sessions">Sessions & Fees</a>
        </div>
        <div>
          <h3>Connect</h3>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
          <p>{contact.location}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Listening Korner</span>
        <em>“Growth happens in safe, supportive spaces.”</em>
      </div>
    </footer>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-hero">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="container narrow reveal">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

function Home({ profile, hero }: { profile: ProfileData; hero: HeroData }) {
  const cards = [
    ["heart", "Client-centred", "Your story, needs, and pace gently guide our work together."],
    [
      "leaf",
      "Neurodivergent support",
      "Affirming care for different ways of thinking, feeling, and being.",
    ],
    ["laptop", "Online sessions", "A private, familiar space—wherever you feel most comfortable."],
  ];
  return (
    <main>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1 style={{ whiteSpace: "pre-line" }}>{hero.headline}</h1>
            <p>{hero.intro}</p>
            <div className="hero-actions">
              <a href="#about" className="button">
                Meet your therapist <Icon name="arrow" size={18} />
              </a>
              <a href="#sessions" className="text-link">
                Explore sessions
              </a>
            </div>
            <div className="trust-note">
              <span>
                <Icon name="heart" size={17} />
              </span>
              <p>
                <strong>{hero.trustTitle}</strong>
                <br />
                {hero.trustSubtext}
              </p>
            </div>
          </div>
          <div className="hero-image-wrap reveal">
            <div className="organic-backdrop" />
            <img
              src={profile.photo || "/rekha.jpg"}
              alt={`${profile.name}, Counselling Psychologist`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/rekha.jpg";
              }}
            />
            <div className="image-note">
              <i>“</i>
              <span>{hero.quote}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="affirmation">
        <span>Take a slow breath</span>
        <p>
          You are not alone. <i> You are important.</i> You are enough.
        </p>
      </section>
      <section className="intro-section">
        <div className="container">
          <div className="section-heading reveal">
            <span className="eyebrow">Support that meets you gently</span>
            <h2>
              Care that feels human,
              <br />
              never clinical.
            </h2>
            <p>
              Therapy can be a quiet place to set things down, make sense of what you’re carrying,
              and find your own way forward.
            </p>
          </div>
          <div className="feature-grid">
            {cards.map(([icon, title, body], i) => (
              <article className={`soft-card card-${i + 1} reveal`} key={title}>
                <div className="icon-bubble">
                  <Icon name={icon} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="card-number">0{i + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="invitation">
        <div className="container invitation-grid">
          <div className="nature-image reveal">
            <img src={natureImage} alt="Soft leaf shadows on a warm textured wall" />
          </div>
          <div className="reveal">
            <span className="eyebrow">A softer next step</span>
            <h2>You deserve support that feels safe.</h2>
            <p>
              Whether you’re navigating anxiety, burnout, overwhelming emotions, or supporting a
              neurodivergent child, you don’t have to move through it alone.
            </p>
            <a href="#contact" className="button">
              Book a gentle first session <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function About({ profile }: { profile: ProfileData }) {
  const credentials = [
    ["award", profile.credentials, "Qualified counselling psychologist"],
    ["heart", "Behavioural Therapist", "Patient, practical, compassionate"],
    [
      "language",
      (profile.languages || ["English", "Hindi", "Konkani"]).join(" · "),
      "Care in the language that feels natural",
    ],
  ];

  return (
    <main>
      <PageHero
        eyebrow="The connection"
        title="Meet Your Therapist."
        text="A warm, patient presence for the parts of life that feel difficult to hold alone."
      />
      <section className="about-intro">
        <div className="container about-grid">
          <div className="portrait-large reveal">
            <div className="portrait-arch">
              <img
                src={profile.photo || "/rekha.jpg"}
                alt={`${profile.name} in warm natural light`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/rekha.jpg";
                }}
              />
            </div>
            <div className="name-card">
              <b>{profile.name}</b>
              <span>{profile.credentials}</span>
            </div>
          </div>
          <div className="about-copy reveal">
            <span className="eyebrow">Hello, I’m {profile.name.split(" ")[0]}</span>
            <h2>I believe in listening without rushing to fix.</h2>
            {profile.bioParagraphs?.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="signature">{profile.name.split(" ")[0]}</div>
          </div>
        </div>
      </section>
      <section className="philosophy">
        <div className="philosophy-shape" />
        <div className="container narrow reveal">
          <Icon name="leaf" size={36} />
          <span className="eyebrow">My philosophy</span>
          <blockquote>“{profile.philosophy}”</blockquote>
          <p>{profile.philosophySubtext}</p>
        </div>
      </section>
      <section className="credentials">
        <div className="container">
          <div className="section-heading reveal">
            <span className="eyebrow">Training & care</span>
            <h2>
              Professional support,
              <br />
              with a human heart.
            </h2>
          </div>
          <div className="credential-grid">
            {credentials.map(([icon, title, body]) => (
              <article className="credential reveal" key={title}>
                <div className="icon-bubble">
                  <Icon name={icon} />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}

function Approach() {
  const methods = [
    [
      "heart",
      "Client-centred",
      "You are the expert on your own life. We shape therapy around your needs, values, and comfort.",
    ],
    [
      "shield",
      "Trauma-informed",
      "Safety, choice, and trust come first. You will never be pushed to share before you feel ready.",
    ],
    [
      "waves",
      "Emotion-focused",
      "We gently notice, name, and understand emotions—without judging or suppressing them.",
    ],
    [
      "steps",
      "CBT-informed tools",
      "Practical behavioural tools can help you shift unhelpful patterns in manageable, realistic steps.",
    ],
  ];

  const support = [
    "Anxiety & overthinking",
    "Anger management",
    "Emotional dysregulation",
    "Self-esteem",
    "Student mental health",
    "Burnout & overwhelm",
    "Child psychology",
    "Relationship navigation",
  ];

  return (
    <main>
      <PageHero
        eyebrow="The healing"
        title="A gentle, grounded approach."
        text="Support that honours your story, your nervous system, and your own natural pace."
      />
      <section className="methods">
        <div className="container">
          <div className="section-heading reveal">
            <span className="eyebrow">How I Work</span>
            <h2>
              Compassion first.
              <br />
              Tools when they help.
            </h2>
            <p>
              I draw from multiple therapeutic approaches rather than forcing you into a single rigid
              system.
            </p>
          </div>
          <div className="method-grid">
            {methods.map(([icon, title, body], i) => (
              <article className="method-card reveal" key={title}>
                <div className="method-top">
                  <div className="icon-bubble">
                    <Icon name={icon} />
                  </div>
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="help-section">
        <div className="container help-grid">
          <div className="help-copy reveal">
            <span className="eyebrow">What I Can Help With</span>
            <h2>Whatever you’re carrying, it deserves care.</h2>
            <p>
              You don’t need a perfect explanation of what’s wrong. A feeling that something needs
              attention is enough to begin.
            </p>
            <a href="#contact" className="text-link">
              Wondering if we’re a good fit? Let’s talk <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="support-list reveal">
            {support.map((item) => (
              <div key={item}>
                <span>
                  <Icon name="leaf" size={17} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}

function Sessions({
  pricing,
  pricingNote,
  feeStructure,
  faqs,
  contact,
}: {
  pricing: PricingPlan[];
  pricingNote: string;
  feeStructure?: FeeStructure;
  faqs: FaqItem[];
  contact: ContactData;
}) {
  return (
    <main>
      <PageHero
        eyebrow="The clarity"
        title="Simple, transparent sessions."
        text="No surprises or confusing steps. Just a clear path to receiving the support you deserve."
      />
      <section className="session-meta">
        <div className="container meta-row">
          <div>
            <Icon name="video" />
            <span>
              <small>Mode</small>
              {contact.mode || "Online · Google Meet"}
            </span>
          </div>
          <div>
            <Icon name="clock" />
            <span>
              <small>Duration</small>60 minutes standard
            </span>
          </div>
          <div>
            <Icon name="language" />
            <span>
              <small>Languages</small>English · Hindi · Konkani
            </span>
          </div>
        </div>
      </section>

      {/* Official Fee Structure Comparison */}
      <section className="pricing">
        <div className="container">
          <div className="section-heading centered reveal">
            <span className="eyebrow">Standard Session Rates</span>
            <h2>Care within reach.</h2>
            <p>Transparent rates for individuals and couples across India & International.</p>
          </div>

          <div className="fee-structure-card reveal">
            <div className="fee-structure-head">
              <Icon name="shield" size={22} />
              <h3>Session Fee Structure</h3>
            </div>
            <div className="fee-table-grid">
              <div className="fee-col">
                <span className="fee-region-title">🇮🇳 India</span>
                <p>
                  <strong>Individual session:</strong>{" "}
                  {feeStructure?.india.individual || "₹800 / 60 mins"}
                </p>
                <p>
                  <strong>Couple counselling:</strong>{" "}
                  {feeStructure?.india.couple || "₹1000 / 60 mins"}
                </p>
              </div>
              <div className="fee-col">
                <span className="fee-region-title">🌍 International</span>
                <p>
                  <strong>Individual session:</strong>{" "}
                  {feeStructure?.international.individual || "₹1000 / 60 mins"}
                </p>
                <p>
                  <strong>Couple counselling:</strong>{" "}
                  {feeStructure?.international.couple || "₹1500 / 60 mins"}
                </p>
              </div>
            </div>
            <p className="fee-extra-note">
              * {feeStructure?.note || "Extra charges if session exceeds beyond 60 mins"}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid">
            {pricing.map((plan) => (
              <article
                className={`price-card ${plan.featured ? "featured" : ""} reveal`}
                key={plan.id}
              >
                {plan.featured && <span className="popular">Most chosen</span>}
                <span className="plan-type">{plan.type}</span>
                <h3>{plan.name}</h3>
                <div className="price">
                  <small>₹</small>
                  {plan.price}
                  <span>/ session</span>
                </div>
                <p>{plan.description}</p>
                <div className="plan-detail">
                  <Icon name="clock" size={18} />
                  {plan.duration}
                </div>
                <a
                  href="#contact"
                  className={plan.featured ? "button" : "button button-outline"}
                >
                  Choose this session <Icon name="arrow" size={17} />
                </a>
              </article>
            ))}
          </div>
          <p className="pricing-note">{pricingNote}</p>
        </div>
      </section>
      <Faq faqs={faqs} />
    </main>
  );
}

function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq">
      <div className="container faq-grid">
        <div className="reveal">
          <span className="eyebrow">A little reassurance</span>
          <h2>Questions are always welcome.</h2>
          <p>Knowing what to expect can help the first step feel a little easier.</p>
        </div>
        <div className="accordion reveal">
          {faqs.map((item, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={item.id || item.q}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                type="button"
              >
                <span>{item.q}</span>
                <b>{open === i ? "−" : "+"}</b>
              </button>
              <div className="answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------- STREAMLINED INTAKE FORM -----------------
const TIMING_OPTIONS = [
  {
    value: "11.00 am to 2.00 pm",
    period: "Morning",
    time: "11:00 am – 2:00 pm",
    icon: "☀️",
  },
  {
    value: "2.00 pm to 4.00 pm",
    period: "Afternoon",
    time: "2:00 pm – 4:00 pm",
    icon: "🌤",
  },
  {
    value: "4.00 to 6.00 pm",
    period: "Late Afternoon",
    time: "4:00 pm – 6:00 pm",
    icon: "🌅",
  },
  {
    value: "Evening (after 6.00 pm)",
    period: "Evening",
    time: "After 6:00 pm",
    icon: "🌙",
  },
];

const DAY_OPTIONS = [
  {
    value: "Weekdays",
    label: "Weekdays",
    detail: "Monday – Friday",
    icon: "💼",
  },
  {
    value: "Weekends",
    label: "Weekends",
    detail: "Saturday – Sunday",
    icon: "🌿",
  },
  {
    value: "Both Weekdays & Weekends",
    label: "Any Day",
    detail: "Flexible Schedule",
    icon: "✨",
  },
];

function Contact({
  contact,
  feeStructure,
}: {
  contact: ContactData;
  feeStructure?: FeeStructure;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [seekingFor, setSeekingFor] = useState("self");
  const [otherClientDetails, setOtherClientDetails] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [suitableTiming, setSuitableTiming] = useState("11.00 am to 2.00 pm");
  const [suitableDays, setSuitableDays] = useState("Weekdays");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const res = await submitInquiry({
      name,
      age,
      location,
      phone,
      email: email || "Not provided",
      sessionMode: "online - video / audio call",
      seekingFor,
      otherClientDetails: seekingFor === "someone else" ? otherClientDetails : "",
      preferredTherapist: "Rekha Devi Chauhan",
      message: issueDescription,
      suitableTiming,
      suitableDays,
      supportType: "Online Counselling Session",
    });

    setSubmitting(false);
    if (res.success) {
      setSent(true);
    } else {
      setErrorMsg(res.message || "Something went wrong. Please try again.");
    }
  };

  const whatsappClean = (contact.whatsapp || "").replace(/\D/g, "");

  return (
    <main>
      <PageHero
        eyebrow="Client Enquiry & Intake"
        title="Begin your journey smoothly."
        text="Please fill this brief form so that we can understand what you need and arrange a suitable time slot."
      />

      <section className="contact-section">
        <div className="container contact-grid">
          {/* Left Column: Direct info & Fee structure */}
          <div className="contact-copy reveal">
            <span className="eyebrow">Gentle, Confidential Support</span>
            <h2>Every step handled with care and confidentiality.</h2>
            <p>
              Once you submit this enquiry, Rekha will review your preferences and get in touch with
              you on WhatsApp or email within 1–2 working days to schedule your first session.
            </p>

            {/* Fee Card */}
            <div className="fee-structure-card" style={{ marginTop: 20 }}>
              <div className="fee-structure-head">
                <Icon name="shield" size={20} />
                <h3 style={{ fontSize: 16 }}>Session Fee Structure</h3>
              </div>
              <div className="fee-table-grid">
                <div className="fee-col">
                  <span className="fee-region-title">🇮🇳 India</span>
                  <p>
                    <strong>Individual:</strong> {feeStructure?.india.individual || "₹800/60m"}
                  </p>
                  <p>
                    <strong>Couple:</strong> {feeStructure?.india.couple || "₹1000/60m"}
                  </p>
                </div>
                <div className="fee-col">
                  <span className="fee-region-title">🌍 International</span>
                  <p>
                    <strong>Individual:</strong> {feeStructure?.international.individual || "₹1000/60m"}
                  </p>
                  <p>
                    <strong>Couple:</strong> {feeStructure?.international.couple || "₹1500/60m"}
                  </p>
                </div>
              </div>
              <p className="fee-extra-note">
                * {feeStructure?.note || "Extra charges if session exceeds beyond 60 mins"}
              </p>
            </div>

            {/* Direct Channels */}
            <div className="contact-list" style={{ marginTop: 24 }}>
              <a
                href={`https://wa.me/${whatsappClean || "9146776914"}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <Icon name="message" />
                </span>
                <div>
                  <small>WhatsApp Enquiry</small>
                  <b>{contact.phone}</b>
                </div>
              </a>
              <a href={`mailto:${contact.email}`}>
                <span>
                  <Icon name="mail" />
                </span>
                <div>
                  <small>Email</small>
                  <b>{contact.email}</b>
                </div>
              </a>
              <a
                href={contact.instagramUrl || "https://instagram.com/listeningkorner"}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <Icon name="instagram" />
                </span>
                <div>
                  <small>Instagram</small>
                  <b>{contact.instagram}</b>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="form-card reveal" style={{ maxWidth: 640 }}>
            {sent ? (
              <div className="success-message">
                <div className="icon-bubble">
                  <Icon name="check" size={28} />
                </div>
                <span className="eyebrow">Enquiry Received</span>
                <h2>Thank you for reaching out, {name}.</h2>
                <p>
                  Your details have been received safely. Rekha will reach out to you on WhatsApp (
                  <strong>{phone}</strong>) within 1–2 working days to schedule your first session.
                </p>
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  <a
                    href={`https://wa.me/${whatsappClean || "9146776914"}?text=${encodeURIComponent(
                      `Hi Rekha, I just submitted a booking enquiry on Listening Korner.\n\n• Name: ${name}\n• Age: ${age}\n• Location: ${location}\n• Preferred Time: ${suitableTiming} (${suitableDays})${
                        issueDescription ? `\n• Note: ${issueDescription}` : ""
                      }`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button"
                    style={{ textAlign: "center", textDecoration: "none" }}
                  >
                    💬 Confirm your slot on WhatsApp
                  </a>
                  <button
                    type="button"
                    className="text-link"
                    style={{ alignSelf: "center", marginTop: 4 }}
                    onClick={() => {
                      setSent(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setIssueDescription("");
                    }}
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-heading">
                  <span className="eyebrow">Intake Form</span>
                  <h2>Client Enquiry</h2>
                  <p>Take your time. Share only what feels comfortable right now.</p>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      background: "#fde8e8",
                      color: "#9b2c2c",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      marginBottom: "14px",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* STEP 1: Personal Details */}
                <div className="form-step-section">
                  <span className="form-step-title">
                    <span className="step-number">1</span> Personal Details
                  </span>

                  <label>
                    Full Name <span style={{ color: "#c0452a" }}>*</span>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should I call you?"
                    />
                  </label>

                  <div className="input-row">
                    <label>
                      Age <span style={{ color: "#c0452a" }}>*</span>
                      <input
                        required
                        type="number"
                        min="5"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 25"
                      />
                    </label>
                    <label>
                      Location (City, State / Country) <span style={{ color: "#c0452a" }}>*</span>
                      <input
                        required
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mumbai, Maharashtra"
                      />
                    </label>
                  </div>

                  <div className="input-row">
                    <label>
                      WhatsApp Number <span style={{ color: "#c0452a" }}>*</span>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </label>
                    <label>
                      Email Address <small>(optional)</small>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>
                </div>

                {/* STEP 2: Who is this session for? */}
                <div className="form-step-section">
                  <span className="form-step-title">
                    <span className="step-number">2</span> Who is this session for?
                  </span>

                  <div className="who-selector-grid">
                    {[
                      {
                        val: "self",
                        icon: "🙋",
                        title: "For Myself",
                        desc: "I will be attending the session",
                      },
                      {
                        val: "someone else",
                        icon: "👥",
                        title: "Someone Else",
                        desc: "Child, partner, or family member",
                      },
                    ].map((item) => {
                      const isSelected = seekingFor === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          className={`who-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSeekingFor(item.val)}
                          aria-pressed={isSelected}
                        >
                          <span className="who-card-icon">{item.icon}</span>
                          <div className="who-card-info">
                            <strong>{item.title}</strong>
                            <small>{item.desc}</small>
                          </div>
                          <span className={`who-card-check ${isSelected ? "checked" : ""}`}>
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {seekingFor === "someone else" && (
                    <label style={{ marginTop: 14 }}>
                      Client's name and age: <span style={{ color: "#c0452a" }}>*</span>
                      <input
                        required
                        type="text"
                        value={otherClientDetails}
                        onChange={(e) => setOtherClientDetails(e.target.value)}
                        placeholder="e.g. My daughter Riya, age 12"
                      />
                    </label>
                  )}
                </div>

                {/* STEP 3: Describe your issue in your own words (OPTIONAL) */}
                <div className="form-step-section">
                  <span className="form-step-title">
                    <span className="step-number">3</span> Describe your issue in your own words{" "}
                    <small style={{ fontWeight: 400, color: "#6e7e70" }}>(optional)</small>
                  </span>
                  <label>
                    <textarea
                      rows={4}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Feel free to share in your own words what you’ve been experiencing, what brings you to therapy, or any concerns you have..."
                    />
                  </label>
                </div>

                {/* STEP 4: Timing & Follow-up Preferences */}
                <div className="form-step-section" style={{ borderBottom: "none" }}>
                  <span className="form-step-title">
                    <span className="step-number">4</span> Preferred Follow-up Timing
                  </span>
                  <p className="form-step-hint">
                    When is the best time for Rekha to reach out to you on WhatsApp or call for follow-up and scheduling?
                  </p>

                  <span className="field-group-title">
                    Best Time of Day <span style={{ color: "#c0452a" }}>*</span>
                  </span>
                  <div className="timing-chips-grid">
                    {TIMING_OPTIONS.map((slot) => {
                      const isSelected = suitableTiming === slot.value;
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          className={`timing-chip-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSuitableTiming(slot.value)}
                          aria-pressed={isSelected}
                        >
                          <span className="timing-chip-icon">{slot.icon}</span>
                          <div className="timing-chip-info">
                            <span className="timing-chip-period">{slot.period}</span>
                            <span className="timing-chip-time">{slot.time}</span>
                          </div>
                          <span className={`timing-chip-check ${isSelected ? "checked" : ""}`}>
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="field-group-title" style={{ marginTop: 18 }}>
                    Preferred Days <span style={{ color: "#c0452a" }}>*</span>
                  </span>
                  <div className="day-chips-grid">
                    {DAY_OPTIONS.map((day) => {
                      const isSelected = suitableDays === day.value;
                      return (
                        <button
                          key={day.value}
                          type="button"
                          className={`day-chip-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSuitableDays(day.value)}
                          aria-pressed={isSelected}
                        >
                          <span className="day-chip-icon">{day.icon}</span>
                          <div className="day-chip-info">
                            <strong>{day.label}</strong>
                            <small>{day.detail}</small>
                          </div>
                          <span className={`day-chip-check ${isSelected ? "checked" : ""}`}>
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="button submit-button"
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={submitting}
                >
                  {submitting ? "Submitting enquiry..." : "Submit Client Enquiry"}{" "}
                  <Icon name="arrow" size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="closing-quote">
        <span>Take all the time you need.</span>
        <p>
          Growth happens in safe,
          <br />
          <em>supportive spaces.</em>
        </p>
      </section>
    </main>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container">
        <div>
          <span className="eyebrow">Whenever you’re ready</span>
          <h2>You don’t have to do this alone.</h2>
        </div>
        <a href="#contact" className="button">
          Take the next gentle step <Icon name="arrow" size={18} />
        </a>
      </div>
    </section>
  );
}

function getPage(): Page {
  const hash = window.location.hash.replace("#", "").split("?")[0] as Page;
  if (hash === "admin") return "admin";
  return hash in pageLabels ? hash : "home";
}

export default function App() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [page, setPage] = useState<Page>(getPage);

  // Load live site content from backend on mount
  useEffect(() => {
    fetchSiteContent().then((data) => {
      if (data) setContent(data);
    });
  }, []);

  // Listen to hash changes
  useEffect(() => {
    const update = () => {
      const p = getPage();
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const openAdmin = () => {
    window.location.hash = "#admin";
    setPage("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeAdmin = () => {
    window.location.hash = "#home";
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (page === "admin") {
    return (
      <AdminPortal
        content={content}
        onContentUpdate={(updated) => setContent(updated)}
        onClose={closeAdmin}
      />
    );
  }

  const pages = {
    home: <Home profile={content.profile} hero={content.hero} />,
    about: <About profile={content.profile} />,
    approach: <Approach />,
    sessions: (
      <Sessions
        pricing={content.pricing}
        pricingNote={content.pricingNote}
        feeStructure={content.feeStructure}
        faqs={content.faqs}
        contact={content.contact}
      />
    ),
    contact: (
      <Contact
        contact={content.contact}
        feeStructure={content.feeStructure}
      />
    ),
  };

  return (
    <div className="app">
      <Header page={page} therapistName={content.profile.name} />
      {pages[page]}
      <Footer contact={content.contact} onOpenAdmin={openAdmin} />
    </div>
  );
}
