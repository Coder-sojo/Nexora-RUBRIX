import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Bot,
  CalendarDays,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  HandHeart,
  Headphones,
  HeartPulse,
  Languages,
  MapPin,
  MessageCircle,
  Moon,
  Plus,
  Printer,
  Sparkles,
  Stethoscope,
  Sun,
} from "lucide-react";
import "./styles.css";

const DISCLAIMER =
  "HealthSakhi does not diagnose or treat PMOS. It helps you organize symptoms and decide when to speak with a qualified healthcare professional.";

const copy = {
  en: {
    language: "English",
    hero: "Understand symptoms. Track patterns. Navigate care.",
    subtext:
      "HealthSakhi helps you recognize PMOS-related patterns and prepare for a doctor visit without shame, confusion, or diagnosis claims.",
    start: "Start symptom check",
    continue: "Continue",
    save: "Save entry",
    report: "Your symptom pattern summary",
    care: "Find care options near you",
    chatbotTone: "You are not overreacting. Your symptoms deserve to be understood.",
    low: "Low pattern strength",
    moderate: "Moderate pattern strength",
    high: "High pattern strength",
    disclaimer: DISCLAIMER,
  },
  hg: {
    language: "Hinglish",
    hero: "Apne symptoms samjho. Patterns track karo. Care confidently navigate karo.",
    subtext:
      "HealthSakhi PMOS-related patterns samajhne aur doctor visit ke liye prepare karne mein help karta hai, bina shame ya confusion ke.",
    start: "Symptom check shuru karo",
    continue: "Aage badho",
    save: "Entry save karo",
    report: "Aapka symptom pattern summary",
    care: "Apne paas care options dhundo",
    chatbotTone: "Aap overreact nahi kar rahe ho. Aapke symptoms samajhne layak hain.",
    low: "Low pattern strength",
    moderate: "Moderate pattern strength",
    high: "High pattern strength",
    disclaimer:
      "HealthSakhi PMOS diagnose ya treat nahi karta. Ye symptoms organize karne aur qualified healthcare professional se kab baat karni hai samajhne mein help karta hai.",
  },
  hi: {
    language: "हिंदी",
    hero: "अपने लक्षण समझें। अपने पैटर्न ट्रैक करें। भरोसे के साथ देखभाल तक पहुंचें।",
    subtext:
      "HealthSakhi आपको PMOS से जुड़े पैटर्न पहचानने और डॉक्टर से बात करने की तैयारी करने में मदद करता है, बिना शर्म, उलझन या निदान के दावे के।",
    start: "लक्षण जांच शुरू करें",
    continue: "आगे बढ़ें",
    save: "एंट्री सेव करें",
    report: "आपका लक्षण पैटर्न सारांश",
    care: "अपने पास देखभाल विकल्प खोजें",
    chatbotTone: "आप ज़्यादा प्रतिक्रिया नहीं दे रहीं। आपके लक्षण समझे जाने लायक हैं।",
    low: "कम पैटर्न शक्ति",
    moderate: "मध्यम पैटर्न शक्ति",
    high: "अधिक पैटर्न शक्ति",
    disclaimer:
      "HealthSakhi PMOS का निदान या इलाज नहीं करता। यह लक्षणों को व्यवस्थित करने और योग्य स्वास्थ्य विशेषज्ञ से कब बात करनी है, यह समझने में मदद करता है।",
  },
};

const navItems = [
  { id: "home", label: "Home", icon: HeartPulse },
  { id: "questionnaire", label: "Questionnaire", icon: ClipboardList },
  { id: "report", label: "Report", icon: Activity },
  { id: "tracker", label: "Tracker", icon: CalendarDays },
  { id: "care", label: "Care", icon: MapPin },
  { id: "chatbot", label: "Chatbot", icon: Bot },
];

const initialAnswers = {
  cycle: "",
  cycleLength: "",
  missedPeriods: "",
  acne: "",
  hairGrowth: "",
  hairThinning: "",
  weightChange: "",
  fatigue: "",
  mood: "",
  sleep: "",
  familyHistory: "",
  impact: "",
  urgent: "",
};

const starterEntries = [
  {
    id: "sample-1",
    date: "2026-06-02",
    cycleDay: "Day 39",
    sleep: 5.5,
    weight: 64,
    mood: "Low",
    symptoms: "Fatigue, acne flare",
  },
  {
    id: "sample-2",
    date: "2026-06-09",
    cycleDay: "Day 46",
    sleep: 6,
    weight: 64.4,
    mood: "Anxious",
    symptoms: "Cravings, oily skin",
  },
  {
    id: "sample-3",
    date: "2026-06-16",
    cycleDay: "Period started",
    sleep: 7,
    weight: 64.2,
    mood: "Better",
    symptoms: "Cramps, tiredness",
  },
];

const clinicData = [
  ["Mumbai", "Sakhi Women's Health Centre", "Gynecologist", "2.4 km", true, true, true],
  ["Mumbai", "Metabolic Care Endocrine Clinic", "Endocrinologist", "4.8 km", true, false, true],
  ["Pune", "Aarogya Hormone & Cycle Clinic", "Gynecologist", "3.1 km", true, true, true],
  ["Pune", "WellNest Endocrine Care", "Endocrinologist", "5.2 km", true, true, false],
  ["Delhi NCR", "NariCare Clinic", "Gynecologist", "2.9 km", true, true, true],
  ["Delhi NCR", "EndoLife Diabetes & Hormone Centre", "Endocrinologist", "6.0 km", false, true, true],
  ["Bengaluru", "HerHealth Multispeciality", "Gynecologist", "3.7 km", true, false, true],
  ["Bengaluru", "Balanced Hormones Clinic", "Endocrinologist", "5.5 km", true, true, true],
  ["Hyderabad", "Sthree Wellness Clinic", "Gynecologist", "2.1 km", true, true, false],
  ["Hyderabad", "City Endocrine Centre", "Endocrinologist", "4.4 km", false, false, true],
  ["Chennai", "Malar Women's Clinic", "Gynecologist", "3.3 km", true, false, true],
  ["Chennai", "Hormone Health Hub", "Endocrinologist", "6.8 km", true, true, true],
  ["Kolkata", "Udaan Women's Health", "Gynecologist", "2.6 km", true, true, true],
  ["Kolkata", "Eastern Endocrine Clinic", "Endocrinologist", "5.9 km", false, true, false],
  ["Ahmedabad", "Saheli Cycle Care", "Gynecologist", "3.0 km", true, true, true],
  ["Ahmedabad", "MetaboPlus Clinic", "Endocrinologist", "7.1 km", true, false, true],
  ["Jaipur", "PinkCity Women's Care", "Gynecologist", "2.8 km", true, true, false],
  ["Jaipur", "Jaipur Hormone Clinic", "Endocrinologist", "5.3 km", false, true, true],
  ["Lucknow", "Swasthya Sakhi Clinic", "Gynecologist", "2.2 km", true, true, true],
  ["Lucknow", "Awadh Endocrine Care", "Endocrinologist", "6.4 km", true, false, true],
].map(([city, name, specialty, distance, womenFriendly, hindiSupport, teleconsult]) => ({
  city,
  name,
  specialty,
  distance,
  womenFriendly,
  hindiSupport,
  teleconsult,
}));

const cityOptions = [...new Set(clinicData.map((clinic) => clinic.city))];

const quickPrompts = [
  {
    id: "fault",
    en: "Is PMOS my fault?",
    hg: "Kya PMOS meri galti hai?",
    hi: "क्या PMOS मेरी गलती है?",
  },
  {
    id: "cysts",
    en: "Do I need ovarian cysts to have PMOS?",
    hg: "PMOS ke liye ovarian cysts zaroori hain?",
    hi: "क्या PMOS के लिए ovarian cysts ज़रूरी हैं?",
  },
  {
    id: "unmarried",
    en: "Can unmarried women ask for help?",
    hg: "Unmarried women help maang sakti hain?",
    hi: "क्या अविवाहित महिलाएं मदद मांग सकती हैं?",
  },
  {
    id: "lifestyle",
    en: "Can lifestyle cure PMOS?",
    hg: "Kya lifestyle PMOS cure kar sakta hai?",
    hi: "क्या lifestyle PMOS को cure कर सकता है?",
  },
  {
    id: "doctor",
    en: "When should I see a doctor?",
    hg: "Doctor ko kab dikhana chahiye?",
    hi: "डॉक्टर को कब दिखाना चाहिए?",
  },
  {
    id: "track",
    en: "What should I track before visiting a doctor?",
    hg: "Doctor visit se pehle kya track karu?",
    hi: "डॉक्टर से मिलने से पहले क्या track करें?",
  },
];

const botAnswers = {
  en: {
    fault:
      "No. PMOS is linked to hormonal and metabolic patterns, family history, and many body systems. It is not a character flaw or something you caused.",
    cysts:
      "No. Ovarian cysts are not required for a PMOS/PCOS diagnosis. A clinician looks at patterns such as cycle changes, androgen-related symptoms, and other causes that need to be ruled out.",
    unmarried:
      "Yes. Irregular periods, acne, hair changes, fatigue, and mood concerns deserve care regardless of marital status. You can ask for respectful, confidential medical help.",
    lifestyle:
      "Lifestyle habits can support symptoms and metabolic health, but PMOS is not simply cured by dieting or exercise. A clinician can help you choose care that fits your body and goals.",
    doctor:
      "Consider speaking with a doctor if periods are often irregular or absent, symptoms are affecting daily life, or you notice acne, excess hair growth, hair thinning, sudden weight changes, or heavy bleeding.",
    track:
      "Track cycle dates, period flow, acne or hair changes, weight changes, sleep, mood, fatigue, medicines, and family history. A pattern summary can make the visit easier.",
  },
  hg: {
    fault:
      "Nahi. PMOS hormonal aur metabolic patterns, family history, aur body systems se linked ho sakta hai. Ye aapki galti ya weakness nahi hai.",
    cysts:
      "Nahi. PMOS/PCOS ke liye ovarian cysts zaroori nahi hote. Doctor cycle changes, androgen-related symptoms aur other causes ko check karte hain.",
    unmarried:
      "Haan. Irregular periods, acne, hair changes, fatigue, mood concerns ke liye care lena bilkul valid hai, marital status matter nahi karta.",
    lifestyle:
      "Lifestyle habits symptoms aur metabolic health support kar sakte hain, par PMOS sirf diet ya exercise se simple cure nahi hota. Doctor aapke body aur goals ke hisaab se guidance de sakte hain.",
    doctor:
      "Agar periods often irregular/absent hain, symptoms daily life affect kar rahe hain, acne, excess hair growth, hair thinning, sudden weight change ya heavy bleeding ho, toh doctor se baat karna useful hai.",
    track:
      "Cycle dates, period flow, acne/hair changes, weight, sleep, mood, fatigue, medicines aur family history track karo. Pattern summary doctor visit ko easier bana sakti hai.",
  },
  hi: {
    fault:
      "नहीं। PMOS हार्मोनल और मेटाबॉलिक पैटर्न, परिवार के इतिहास और कई बॉडी सिस्टम से जुड़ा हो सकता है। यह आपकी गलती नहीं है।",
    cysts:
      "नहीं। PMOS/PCOS के लिए ovarian cysts होना ज़रूरी नहीं है। डॉक्टर cycle changes, androgen-related symptoms और अन्य कारणों को देखकर समझते हैं।",
    unmarried:
      "हाँ। irregular periods, acne, hair changes, fatigue या mood concerns के लिए care लेना पूरी तरह सही है, marital status मायने नहीं रखता।",
    lifestyle:
      "Lifestyle habits symptoms और metabolic health में मदद कर सकती हैं, लेकिन PMOS सिर्फ diet या exercise से simple cure नहीं होता। Doctor आपकी body और goals के हिसाब से guidance दे सकते हैं।",
    doctor:
      "अगर periods अक्सर irregular या absent हैं, symptoms daily life affect कर रहे हैं, acne, excess hair growth, hair thinning, sudden weight change या heavy bleeding हो, तो doctor से बात करना अच्छा रहेगा।",
    track:
      "Cycle dates, period flow, acne या hair changes, weight, sleep, mood, fatigue, medicines और family history track करें। Pattern summary doctor visit को आसान बना सकती है।",
  },
};

function getStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function calculatePattern(answers, entries) {
  let score = 0;
  const symptoms = [];

  if (answers.cycle === "irregular") {
    score += 3;
    symptoms.push("Irregular or unpredictable cycles");
  }
  if (answers.missedPeriods === "yes") {
    score += 2;
    symptoms.push("Missed periods");
  }
  if (answers.acne === "yes") {
    score += 1;
    symptoms.push("Acne or oily skin");
  }
  if (answers.hairGrowth === "yes") {
    score += 2;
    symptoms.push("Excess facial or body hair");
  }
  if (answers.hairThinning === "yes") {
    score += 1;
    symptoms.push("Hair thinning");
  }
  if (answers.weightChange === "yes") {
    score += 1;
    symptoms.push("Recent weight changes");
  }
  if (answers.fatigue === "often") {
    score += 1;
    symptoms.push("Frequent fatigue");
  }
  if (answers.mood === "often") {
    score += 1;
    symptoms.push("Mood changes");
  }
  if (answers.familyHistory === "yes") {
    score += 1;
    symptoms.push("Family history of PMOS/PCOS or diabetes");
  }

  const recentPoorSleep = entries.filter((entry) => Number(entry.sleep) < 6).length;
  if (recentPoorSleep >= 2) score += 1;

  const strength = score >= 8 ? "high" : score >= 4 ? "moderate" : "low";

  return {
    score,
    strength,
    symptoms: [...new Set(symptoms)],
  };
}

function getInsights(answers, entries) {
  const pattern = calculatePattern(answers, entries);
  const insights = [
    {
      title: "PMOS-related pattern check",
      body:
        pattern.strength === "high"
          ? "Your answers show several overlapping cycle, skin/hair, and metabolic signals worth discussing with a qualified clinician."
          : pattern.strength === "moderate"
            ? "Some symptoms appear together. Tracking them for a few cycles can help a clinician understand your pattern."
            : "Your current entries show fewer PMOS-related signals, but persistent or distressing symptoms still deserve care.",
      tone: pattern.strength,
    },
  ];

  const poorSleep = entries.filter((entry) => Number(entry.sleep) < 6).length;
  const fatigueOrMood = answers.fatigue === "often" || answers.mood === "often";
  if (poorSleep >= 2 && fatigueOrMood) {
    insights.push({
      title: "Sleep and energy correlation",
      body: "Weeks with shorter sleep overlap with fatigue or mood symptoms in this demo data. This is a care conversation prompt, not a diagnosis.",
      tone: "moderate",
    });
  }

  if (answers.weightChange === "yes" && answers.cycle === "irregular") {
    insights.push({
      title: "Metabolic care prompt",
      body: "Weight changes and irregular cycles can be useful to discuss together, especially because PMOS can involve metabolic health.",
      tone: "moderate",
    });
  }

  return insights;
}

function App() {
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState(() => getStoredValue("healthsakhi-theme", "dark"));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    getStoredValue("healthsakhi-sidebar-collapsed", false),
  );
  const [language, setLanguage] = useState(() => getStoredValue("healthsakhi-language", "en"));
  const [answers, setAnswers] = useState(initialAnswers);
  const [entries, setEntries] = useState(() =>
    getStoredValue("healthsakhi-entries", starterEntries),
  );

  const t = copy[language];
  const pattern = useMemo(() => calculatePattern(answers, entries), [answers, entries]);
  const insights = useMemo(() => getInsights(answers, entries), [answers, entries]);

  useEffect(() => {
    localStorage.removeItem("healthsakhi-answers");
  }, []);

  const updateLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setStoredValue("healthsakhi-language", nextLanguage);
  };

  const updateAnswers = (nextAnswers) => {
    setAnswers(nextAnswers);
  };

  const updateEntries = (nextEntries) => {
    setEntries(nextEntries);
    setStoredValue("healthsakhi-entries", nextEntries);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setStoredValue("healthsakhi-theme", nextTheme);
  };

  const toggleSidebar = () => {
    const nextCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(nextCollapsed);
    setStoredValue("healthsakhi-sidebar-collapsed", nextCollapsed);
  };

  if (active === "home") {
    return (
      <main className={`landing-shell theme-${theme}`}>
        <Home setActive={setActive} theme={theme} toggleTheme={toggleTheme} />
      </main>
    );
  }

  return (
    <div className={`app-shell theme-${theme} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <button className="theme-toggle app-theme-toggle" onClick={toggleTheme}>
        <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <aside className="sidebar">
        <button className="collapse-toggle" onClick={toggleSidebar}>
          <span className="sr-only">{sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
        <div className="brand">
          <div className="brand-mark">
            <HandHeart size={26} />
          </div>
          <div className="brand-copy">
            <strong>HealthSakhi</strong>
            <span>PMOS care navigation</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={active === item.id ? "nav-button active" : "nav-button"}
                onClick={() => setActive(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="language-card">
          <div className="language-title">
            <Languages size={17} />
            Language
          </div>
          <div className="segmented">
            <button
              className={language === "en" ? "selected" : ""}
              onClick={() => updateLanguage("en")}
            >
              EN
            </button>
            <button
              className={language === "hg" ? "selected" : ""}
              onClick={() => updateLanguage("hg")}
            >
              Hinglish
            </button>
            <button
              className={language === "hi" ? "selected" : ""}
              onClick={() => updateLanguage("hi")}
            >
              हिंदी
            </button>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        {active === "questionnaire" && (
          <Questionnaire
            t={t}
            answers={answers}
            updateAnswers={updateAnswers}
            setActive={setActive}
          />
        )}
        {active === "report" && <Report t={t} pattern={pattern} answers={answers} />}
        {active === "tracker" && (
          <Tracker
            t={t}
            entries={entries}
            updateEntries={updateEntries}
            insights={insights}
          />
        )}
        {active === "care" && <CareNavigation t={t} />}
        {active === "chatbot" && <Chatbot t={t} language={language} />}
      </main>
      <button className="help-chat-button" onClick={() => setActive("chatbot")}>
        <Headphones size={19} />
        <span>Help</span>
      </button>
    </div>
  );
}

function Home({ setActive, theme, toggleTheme }) {
  const t = copy.en;

  return (
    <section className="screen home-grid">
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="hero-copy">
        <div className="landing-brand">
          <div className="brand-mark">
            <HandHeart size={24} />
          </div>
          <div>
            <strong>HealthSakhi</strong>
            <span>PMOS care navigation</span>
          </div>
        </div>
        <div className="eyebrow">
          <HandHeart size={18} />
          PMOS, formerly known as PCOS
        </div>
        <h1>{t.hero}</h1>
        <p>{t.subtext}</p>
        <div className="hero-actions">
          <button className="primary-action" onClick={() => setActive("questionnaire")}>
            {t.start}
            <ChevronRight size={18} />
          </button>
          <button className="secondary-action" onClick={() => setActive("care")}>
            {t.care}
          </button>
        </div>
        <p className="disclaimer">{t.disclaimer}</p>
      </div>

      <div className="overview-panel impact-panel">
        <div className="impact-metric">
          <span>10-13%</span>
          <strong>of reproductive-aged women are estimated to have PCOS/PMOS</strong>
          <small>WHO fact sheet, 2026</small>
        </div>
        <div className="impact-note">
          <span>Up to 70%</span>
          <p>may not know they have the condition, which is why symptom literacy matters.</p>
        </div>
        <div className="mini-stat-row">
          <MiniStat text="Adaptive questionnaire" />
          <MiniStat text="24/7 multilingual chatbot support" />
          <MiniStat text="Personal health tracker" />
          <MiniStat text="Nearby care navigation" />
        </div>
      </div>
    </section>
  );
}

function MiniStat({ text }) {
  return (
    <div className="mini-stat">
      <span>{text}</span>
    </div>
  );
}

function Questionnaire({ t, answers, updateAnswers, setActive }) {
  const setAnswer = (key, value) => updateAnswers({ ...answers, [key]: value });

  return (
    <section className="screen">
      <SectionHeader
        icon={ClipboardList}
        kicker="Adaptive symptom intelligence"
        title="Symptom check"
        subtitle="Answer what you can. Follow-up questions appear only when they help build a clearer pattern."
      />
      <div className="question-grid">
        <Question
          label="How are your menstrual cycles?"
          value={answers.cycle}
          options={[
            ["regular", "Mostly regular"],
            ["irregular", "Irregular or unpredictable"],
            ["unsure", "Not sure"],
          ]}
          onChange={(value) => setAnswer("cycle", value)}
        />
        {answers.cycle === "irregular" && (
          <>
            <Question
              label="Are your cycles often longer than 35 days?"
              value={answers.cycleLength}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
                ["unsure", "Not sure"],
              ]}
              onChange={(value) => setAnswer("cycleLength", value)}
            />
            <Question
              label="Have you missed periods recently?"
              value={answers.missedPeriods}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
                ["unsure", "Not sure"],
              ]}
              onChange={(value) => setAnswer("missedPeriods", value)}
            />
          </>
        )}
        <Question
          label="Do you notice acne or oily skin?"
          value={answers.acne}
          options={[
            ["yes", "Yes"],
            ["no", "No"],
            ["sometimes", "Sometimes"],
          ]}
          onChange={(value) => setAnswer("acne", value)}
        />
        <Question
          label="Do you notice excess facial or body hair?"
          value={answers.hairGrowth}
          options={[
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"],
          ]}
          onChange={(value) => setAnswer("hairGrowth", value)}
        />
        <Question
          label="Have you noticed hair thinning?"
          value={answers.hairThinning}
          options={[
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"],
          ]}
          onChange={(value) => setAnswer("hairThinning", value)}
        />
        <Question
          label="Have you had recent unexplained weight changes?"
          value={answers.weightChange}
          options={[
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"],
          ]}
          onChange={(value) => setAnswer("weightChange", value)}
        />
        <Question
          label="How often do you feel fatigue?"
          value={answers.fatigue}
          options={[
            ["rarely", "Rarely"],
            ["sometimes", "Sometimes"],
            ["often", "Often"],
          ]}
          onChange={(value) => setAnswer("fatigue", value)}
        />
        <Question
          label="Do mood changes affect your day?"
          value={answers.mood}
          options={[
            ["rarely", "Rarely"],
            ["sometimes", "Sometimes"],
            ["often", "Often"],
          ]}
          onChange={(value) => setAnswer("mood", value)}
        />
        {(answers.fatigue === "often" || answers.mood === "often") && (
          <Question
            label="How is your sleep lately?"
            value={answers.sleep}
            options={[
              ["steady", "Steady"],
              ["disrupted", "Disrupted"],
              ["unsure", "Not sure"],
            ]}
            onChange={(value) => setAnswer("sleep", value)}
          />
        )}
        <Question
          label="Family history of PMOS/PCOS or type 2 diabetes?"
          value={answers.familyHistory}
          options={[
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"],
          ]}
          onChange={(value) => setAnswer("familyHistory", value)}
        />
        <Question
          label="Are symptoms affecting your daily life?"
          value={answers.impact}
          options={[
            ["low", "A little"],
            ["medium", "Noticeably"],
            ["high", "A lot"],
          ]}
          onChange={(value) => setAnswer("impact", value)}
        />
        {answers.impact === "high" && (
          <Question
            label="Do you want to prioritize care navigation?"
            value={answers.urgent}
            options={[
              ["yes", "Yes, soon"],
              ["no", "Not yet"],
            ]}
            onChange={(value) => setAnswer("urgent", value)}
          />
        )}
      </div>
      <div className="bottom-bar">
        <p className="disclaimer">{t.disclaimer}</p>
        <button className="primary-action" onClick={() => setActive("report")}>
          Generate summary
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Question({ label, value, options, onChange }) {
  return (
    <div className="question-card">
      <h3>{label}</h3>
      <div className="option-row">
        {options.map(([optionValue, optionLabel]) => (
          <button
            key={optionValue}
            className={value === optionValue ? "pill-option selected" : "pill-option"}
            onClick={() => onChange(optionValue)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function Report({ t, pattern, answers }) {
  const focusAreas = [
    answers.cycle === "irregular" && "Cycle regularity and ovulation",
    (answers.acne === "yes" || answers.hairGrowth === "yes" || answers.hairThinning === "yes") &&
      "Androgen-related skin and hair symptoms",
    answers.weightChange === "yes" && "Metabolic health and weight changes",
    (answers.fatigue === "often" || answers.mood === "often") && "Sleep, mood, and energy",
  ].filter(Boolean);

  return (
    <section className="screen">
      <SectionHeader
        icon={Activity}
        kicker=""
        title={t.report}
        subtitle="A non-clinical summary you can use to prepare for a qualified healthcare visit."
      />
      <div className="report-layout">
        <div className={`strength-card ${pattern.strength}`}>
          <Sparkles size={26} />
          <span>{t[pattern.strength]}</span>
          <strong>{pattern.score} pattern points</strong>
          <p>Pattern strength is educational. It is not a diagnosis or disease probability.</p>
        </div>
        <div className="report-card">
          <h3>Symptoms noticed</h3>
          <TagList
            items={pattern.symptoms.length ? pattern.symptoms : ["No major pattern selected yet"]}
          />
        </div>
        <div className="report-card">
          <h3>Possible health areas to discuss</h3>
          <TagList
            items={
              focusAreas.length
                ? focusAreas
                : ["General menstrual health", "Any symptom that feels persistent or distressing"]
            }
          />
        </div>
        <div className="report-card wide">
          <h3>Questions to ask a doctor</h3>
          <ul className="check-list">
            <li>Could these symptoms fit a PMOS/PCOS-related pattern?</li>
            <li>Should I check hormones, glucose, insulin resistance, or thyroid-related causes?</li>
            <li>What symptoms should I track for the next three cycles?</li>
            <li>Which care options match my age, goals, and comfort level?</li>
          </ul>
        </div>
        <div className="report-card wide alert-soft">
          <h3>Care urgency guidance</h3>
          <p>
            Seek care soon if periods are absent for several months, bleeding is very heavy,
            symptoms are rapidly worsening, or mood symptoms feel hard to manage.
          </p>
          <button className="secondary-action print-button" onClick={() => window.print()}>
            <Printer size={17} />
            Print summary
          </button>
        </div>
      </div>
      <p className="disclaimer">{t.disclaimer}</p>
    </section>
  );
}

function TagList({ items }) {
  return (
    <div className="tag-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function Tracker({ t, entries, updateEntries, insights }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    cycleDay: "",
    sleep: "",
    weight: "",
    mood: "Okay",
    symptoms: "",
  });

  const submitEntry = (event) => {
    event.preventDefault();
    const nextEntry = {
      id: crypto.randomUUID(),
      ...form,
      sleep: Number(form.sleep || 0),
      weight: Number(form.weight || 0),
    };
    updateEntries([nextEntry, ...entries]);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      cycleDay: "",
      sleep: "",
      weight: "",
      mood: "Okay",
      symptoms: "",
    });
  };

  return (
    <section className="screen">
      <SectionHeader
        icon={CalendarDays}
        kicker="Personal health pattern tracker"
        title="Track cycles, sleep, weight, mood, and symptoms"
        subtitle="Entries are saved locally in this browser. No backend, login, or real health record is used."
      />
      <div className="tracker-layout">
        <form className="entry-form" onSubmit={submitEntry}>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              required
            />
          </label>
          <label>
            Cycle note
            <input
              placeholder="Day 38, period started..."
              value={form.cycleDay}
              onChange={(event) => setForm({ ...form, cycleDay: event.target.value })}
            />
          </label>
          <label>
            Sleep hours
            <input
              type="number"
              min="0"
              max="14"
              step="0.5"
              value={form.sleep}
              onChange={(event) => setForm({ ...form, sleep: event.target.value })}
            />
          </label>
          <label>
            Weight kg
            <input
              type="number"
              min="20"
              max="200"
              step="0.1"
              value={form.weight}
              onChange={(event) => setForm({ ...form, weight: event.target.value })}
            />
          </label>
          <label>
            Mood
            <select
              value={form.mood}
              onChange={(event) => setForm({ ...form, mood: event.target.value })}
            >
              <option>Okay</option>
              <option>Low</option>
              <option>Anxious</option>
              <option>Energetic</option>
              <option>Better</option>
            </select>
          </label>
          <label className="wide-input">
            Symptoms
            <input
              placeholder="Fatigue, acne, cravings..."
              value={form.symptoms}
              onChange={(event) => setForm({ ...form, symptoms: event.target.value })}
            />
          </label>
          <button className="primary-action" type="submit">
            <Plus size={18} />
            {t.save}
          </button>
        </form>

        <div className="insight-stack">
          {insights.map((insight) => (
            <div className={`insight-card ${insight.tone}`} key={insight.title}>
              <Sparkles size={20} />
              <div>
                <h3>{insight.title}</h3>
                <p>{insight.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="entry-table">
        {entries.map((entry) => (
          <div className="entry-row" key={entry.id}>
            <strong>{entry.date}</strong>
            <span>{entry.cycleDay || "Cycle note not added"}</span>
            <span>{entry.sleep || "-"}h sleep</span>
            <span>{entry.weight || "-"} kg</span>
            <span>{entry.mood}</span>
            <span>{entry.symptoms || "No symptoms added"}</span>
          </div>
        ))}
      </div>
      <p className="disclaimer">{t.disclaimer}</p>
    </section>
  );
}

function CareNavigation({ t }) {
  const [city, setCity] = useState("Mumbai");
  const [filters, setFilters] = useState({
    gynecologist: false,
    endocrinologist: false,
    womenFriendly: false,
    hindiSupport: false,
    teleconsult: false,
  });

  const clinics = clinicData.filter((clinic) => {
    if (clinic.city !== city) return false;
    if (filters.gynecologist && clinic.specialty !== "Gynecologist") return false;
    if (filters.endocrinologist && clinic.specialty !== "Endocrinologist") return false;
    if (filters.womenFriendly && !clinic.womenFriendly) return false;
    if (filters.hindiSupport && !clinic.hindiSupport) return false;
    if (filters.teleconsult && !clinic.teleconsult) return false;
    return true;
  });

  const toggleFilter = (key) => setFilters({ ...filters, [key]: !filters[key] });

  return (
    <section className="screen">
      <SectionHeader
        icon={MapPin}
        kicker="All-India care navigation"
        title={t.care}
        subtitle="Mock clinic data for demo only. Always verify providers before booking."
      />
      <div className="care-controls">
        <label>
          City
          <select value={city} onChange={(event) => setCity(event.target.value)}>
            {cityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <div className="filter-row">
          {[
            ["gynecologist", "Gynecologist"],
            ["endocrinologist", "Endocrinologist"],
            ["womenFriendly", "Women-friendly"],
            ["hindiSupport", "Hinglish/Hindi"],
            ["teleconsult", "Teleconsult"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={filters[key] ? "pill-option selected" : "pill-option"}
              onClick={() => toggleFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="clinic-grid">
        {clinics.map((clinic) => (
          <div className="clinic-card" key={`${clinic.city}-${clinic.name}`}>
            <div className="clinic-icon">
              <Stethoscope size={22} />
            </div>
            <div>
              <h3>{clinic.name}</h3>
              <p>
                {clinic.specialty} • {clinic.distance}
              </p>
              <TagList
                items={[
                  clinic.womenFriendly && "Women-friendly",
                  clinic.hindiSupport && "Hinglish/Hindi support",
                  clinic.teleconsult && "Teleconsult",
                ].filter(Boolean)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="visit-checklist">
        <h3>Prepare for visit</h3>
        <ul className="check-list">
          <li>Carry or print your symptom pattern summary.</li>
          <li>Take cycle dates, flow notes, sleep, weight, mood, and symptom logs.</li>
          <li>Ask which tests are needed and why.</li>
          <li>Share comfort preferences, language needs, and privacy concerns upfront.</li>
        </ul>
      </div>
      <p className="disclaimer">{t.disclaimer}</p>
    </section>
  );
}

function Chatbot({ t, language }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "intro",
      role: "bot",
      text: t.chatbotTone,
    },
  ]);

  useEffect(() => {
    setMessages([
      {
        id: `intro-${language}`,
        role: "bot",
        text: t.chatbotTone,
      },
    ]);
  }, [language, t.chatbotTone]);

  const ask = (prompt) => {
    setMessages([
      ...messages,
      { id: `${prompt.id}-user-${Date.now()}`, role: "user", text: prompt[language] },
      {
        id: `${prompt.id}-bot-${Date.now()}`,
        role: "bot",
        text: botAnswers[language][prompt.id],
      },
    ]);
  };

  const answerTypedQuestion = (question) => {
    const normalized = question.toLowerCase();
    const matchedPrompt =
      quickPrompts.find((prompt) =>
        [prompt.en, prompt.hg, prompt.hi].some((text) =>
          normalized.includes(text.toLowerCase().slice(0, 12)),
        ),
      ) ||
      quickPrompts.find((prompt) => {
        const keywordMap = {
          fault: ["fault", "galti", "गलती", "blame"],
          cysts: ["cyst", "ovarian", "ovary", "cysts"],
          unmarried: ["unmarried", "married", "shaadi", "अविवाहित"],
          lifestyle: ["lifestyle", "diet", "exercise", "cure"],
          doctor: ["doctor", "visit", "bleeding", "period", "periods"],
          track: ["track", "log", "summary", "record"],
        };
        return keywordMap[prompt.id].some((keyword) => normalized.includes(keyword));
      });

    return matchedPrompt
      ? botAnswers[language][matchedPrompt.id]
      : {
          en: "I can help with PMOS symptom literacy, tracking, stigma, and care navigation. I cannot diagnose you, but you can ask about irregular periods, acne, hair changes, fatigue, mood, lifestyle, or what to prepare before a doctor visit.",
          hg: "Main PMOS symptom literacy, tracking, stigma aur care navigation mein help kar sakta hoon. Main diagnose nahi kar sakta, par aap irregular periods, acne, hair changes, fatigue, mood, lifestyle ya doctor visit preparation ke baare mein pooch sakte ho.",
          hi: "मैं PMOS symptom literacy, tracking, stigma और care navigation में मदद कर सकता हूं। मैं diagnosis नहीं कर सकता, लेकिन आप irregular periods, acne, hair changes, fatigue, mood, lifestyle या doctor visit preparation के बारे में पूछ सकते हैं।",
        }[language];
  };

  const submitQuestion = (event) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setMessages([
      ...messages,
      { id: `typed-user-${Date.now()}`, role: "user", text: question },
      { id: `typed-bot-${Date.now()}`, role: "bot", text: answerTypedQuestion(question) },
    ]);
    setDraft("");
  };

  return (
    <section className="screen chatbot-screen">
      <SectionHeader
        icon={MessageCircle}
        kicker="Multilingual myth-busting chatbot"
        title="Ask without shame"
        subtitle="Rule-based demo responses in English, Hinglish, and Hindi."
      />
      <div className="prompt-grid">
        {quickPrompts.map((prompt) => (
          <button className="prompt-button" key={prompt.id} onClick={() => ask(prompt)}>
            {prompt[language]}
          </button>
        ))}
      </div>
      <div className="chat-window">
        {messages.map((message) => (
          <div className={`message ${message.role}`} key={message.id}>
            {message.role === "bot" && <Bot size={18} />}
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-input-bar" onSubmit={submitQuestion}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            language === "en"
              ? "Type your PMOS question..."
              : language === "hg"
                ? "Apna PMOS question type karo..."
                : "अपना PMOS सवाल लिखें..."
          }
        />
        <button className="primary-action" type="submit">
          Send
        </button>
      </form>
      <p className="disclaimer">{t.disclaimer}</p>
    </section>
  );
}

function SectionHeader({ icon: Icon, kicker, title, subtitle }) {
  return (
    <header className="section-header">
      {kicker && (
        <div className="eyebrow">
          <Icon size={18} />
          {kicker}
        </div>
      )}
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}

createRoot(document.getElementById("root")).render(<App />);
