// ─────────────────────────────────────────────────────────────────────────────
// scripts/seed.ts – Populate MongoDB Atlas with rich sample data
// Run: npm run seed
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env['MONGODB_URI']!;

// ── Inline schemas ────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  password: String,
  role:     String,
}, { timestamps: true, versionKey: false });

const leadSchema = new mongoose.Schema({
  name:      String,
  email:     String,
  phone:     String,
  company:   String,
  status:    String,
  source:    String,
  priority:  String,
  value:     Number,      // estimated deal value in USD
  notes:     String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
const Lead = mongoose.model('Lead', leadSchema);

// ── Users ─────────────────────────────────────────────────────────────────────

const USERS = [
  { name: 'Mayank Admin',  email: 'admin@demo.com', password: 'password123', role: 'admin' },
  { name: 'Priya Sales',   email: 'priya@demo.com', password: 'password123', role: 'sales' },
  { name: 'Rahul Sales',   email: 'rahul@demo.com', password: 'password123', role: 'sales' },
];

// ── Lead templates ────────────────────────────────────────────────────────────

const LEAD_TEMPLATES = [
  // ── Enterprise / High-value ────────────────────────────────────────────────
  {
    name: 'Arjun Mehta',       email: 'arjun@nexustech.io',    phone: '+91-98100-11122', company: 'NexusTech',
    status: 'Qualified',  source: 'Referral',   priority: 'High',   value: 45000,
    notes: 'CTO referred by existing client. Ready to sign enterprise contract next quarter.',
  },
  {
    name: 'Sneha Kapoor',      email: 'sneha@infracore.in',    phone: '+91-98200-22233', company: 'InfraCore',
    status: 'New',        source: 'Website',    priority: 'High',   value: 32000,
    notes: 'Submitted enterprise inquiry form. Interested in 50-seat license.',
  },
  {
    name: 'Vikram Nair',       email: 'vikram@cloudbridge.com', phone: '+91-99300-33344', company: 'CloudBridge',
    status: 'Contacted',  source: 'LinkedIn',   priority: 'High',   value: 28000,
    notes: 'Responded to LinkedIn outreach. Scheduled product demo for next week.',
  },
  {
    name: 'Ananya Reddy',      email: 'ananya@finvista.co',    phone: '+91-98400-44455', company: 'FinVista',
    status: 'Qualified',  source: 'Conference', priority: 'High',   value: 55000,
    notes: 'Met at SaaS Summit 2025. Evaluating our platform vs. Salesforce.',
  },
  {
    name: 'Dev Choudhary',     email: 'dev@logiplex.io',       phone: '+91-97500-55566', company: 'LogiPlex',
    status: 'Contacted',  source: 'Referral',   priority: 'High',   value: 38000,
    notes: 'Needs bulk pricing for 100+ users. Proposal sent, awaiting approval.',
  },

  // ── Mid-market ─────────────────────────────────────────────────────────────
  {
    name: 'Kavita Joshi',      email: 'kavita@brightmind.in',  phone: '+91-96600-66677', company: 'BrightMind',
    status: 'New',        source: 'Instagram',  priority: 'Medium', value: 8500,
    notes: 'Clicked Instagram ad. Signed up for free trial, active for 3 days.',
  },
  {
    name: 'Amit Sharma',       email: 'amit@pixelcraft.co',    phone: '+91-95700-77788', company: 'PixelCraft',
    status: 'Contacted',  source: 'Website',    priority: 'Medium', value: 11000,
    notes: 'Requested a demo via chat widget. Creative agency, 15-person team.',
  },
  {
    name: 'Pooja Verma',       email: 'pooja@eduwave.org',     phone: '+91-94800-88899', company: 'EduWave',
    status: 'Qualified',  source: 'Referral',   priority: 'Medium', value: 14000,
    notes: 'Education sector discount applied. Decision maker confirmed.',
  },
  {
    name: 'Nikhil Gupta',      email: 'nikhil@healthtrack.io', phone: '+91-93900-99900', company: 'HealthTrack',
    status: 'Contacted',  source: 'Website',    priority: 'Medium', value: 9800,
    notes: 'Healthcare SaaS vertical. Needs HIPAA compliance docs.',
  },
  {
    name: 'Ritu Bose',         email: 'ritu@automate360.in',   phone: '+91-92100-00011', company: 'Automate360',
    status: 'New',        source: 'Google Ads', priority: 'Medium', value: 12500,
    notes: 'Found us via Google Search. Automations are their primary use case.',
  },
  {
    name: 'Suresh Pillai',     email: 'suresh@shopfast.store',  phone: '+91-91200-11122', company: 'ShopFast',
    status: 'Contacted',  source: 'Instagram',  priority: 'Medium', value: 7200,
    notes: 'E-commerce brand. Comparing us with HubSpot.',
  },
  {
    name: 'Divya Agarwal',     email: 'divya@legaledge.law',   phone: '+91-90300-22233', company: 'LegalEdge',
    status: 'Qualified',  source: 'LinkedIn',   priority: 'Medium', value: 18000,
    notes: 'Legal tech firm. Wants custom compliance reporting features.',
  },
  {
    name: 'Manish Tiwari',     email: 'manish@freshbuild.co',  phone: '+91-89400-33344', company: 'FreshBuild',
    status: 'New',        source: 'Website',    priority: 'Medium', value: 6500,
    notes: 'Construction project management startup. Early-stage, good growth.',
  },
  {
    name: 'Sunita Saxena',     email: 'sunita@reachmax.in',    phone: '+91-88500-44455', company: 'ReachMax',
    status: 'Contacted',  source: 'Referral',   priority: 'Medium', value: 13500,
    notes: 'Marketing agency managing 20+ client accounts.',
  },
  {
    name: 'Kiran Rao',         email: 'kiran@dataflow.tech',   phone: '+91-87600-55566', company: 'DataFlow',
    status: 'Qualified',  source: 'Conference', priority: 'Medium', value: 22000,
    notes: 'Data analytics company. Impressed by our API integrations.',
  },

  // ── Small business ─────────────────────────────────────────────────────────
  {
    name: 'Aisha Patel',       email: 'aisha@craftco.store',   phone: '+91-86700-66677', company: 'CraftCo',
    status: 'New',        source: 'Instagram',  priority: 'Low',    value: 2200,
    notes: 'Small artisan e-commerce. Wants simple CRM features.',
  },
  {
    name: 'Rohan Das',         email: 'rohan@localfest.in',    phone: '+91-85800-77788', company: 'LocalFest',
    status: 'Contacted',  source: 'Website',    priority: 'Low',    value: 3100,
    notes: 'Event organiser. Seasonal business, short sales cycle.',
  },
  {
    name: 'Meera Desai',       email: 'meera@greenleaf.farm',  phone: '+91-84900-88899', company: 'GreenLeaf',
    status: 'New',        source: 'Google Ads', priority: 'Low',    value: 1800,
    notes: 'Organic food subscription box. Very price-sensitive.',
  },
  {
    name: 'Arpit Kulkarni',    email: 'arpit@codetutors.io',   phone: '+91-83100-99900', company: 'CodeTutors',
    status: 'Qualified',  source: 'Referral',   priority: 'Low',    value: 4500,
    notes: 'Online coding bootcamp. Wants affiliate tracking integration.',
  },
  {
    name: 'Tanya Mehrotra',    email: 'tanya@weddingbliss.in', phone: '+91-82200-00011', company: 'WeddingBliss',
    status: 'New',        source: 'Instagram',  priority: 'Low',    value: 2900,
    notes: 'Wedding planner. Found us via influencer post.',
  },

  // ── Lost leads ─────────────────────────────────────────────────────────────
  {
    name: 'Sanjay Iyer',       email: 'sanjay@towercon.com',   phone: '+91-81300-11122', company: 'TowerCon',
    status: 'Lost',       source: 'Website',    priority: 'High',   value: 41000,
    notes: 'Went with competitor (Zoho CRM). Price was the deciding factor.',
  },
  {
    name: 'Lalita Kumar',      email: 'lalita@mediapro.tv',    phone: '+91-80400-22233', company: 'MediaPro',
    status: 'Lost',       source: 'LinkedIn',   priority: 'Medium', value: 15000,
    notes: 'Project cancelled internally. May revisit in Q3.',
  },
  {
    name: 'Farhan Sheikh',     email: 'farhan@swiftlog.co',    phone: '+91-79500-33344', company: 'SwiftLog',
    status: 'Lost',       source: 'Referral',   priority: 'Medium', value: 9000,
    notes: 'Budget freeze for FY2025. Asked to follow up in January.',
  },

  // ── More recent new leads ──────────────────────────────────────────────────
  {
    name: 'Nisha Trivedi',     email: 'nisha@sparktech.ai',    phone: '+91-78600-44455', company: 'SparkTech',
    status: 'New',        source: 'Google Ads', priority: 'High',   value: 50000,
    notes: 'AI startup, Series A funded. Looking for scalable CRM solution.',
  },
  {
    name: 'Gaurav Malhotra',   email: 'gaurav@retailhub.in',   phone: '+91-77700-55566', company: 'RetailHub',
    status: 'New',        source: 'Website',    priority: 'Medium', value: 16000,
    notes: 'Retail chain with 30 stores. Wants offline sync capability.',
  },
  {
    name: 'Preethi Narayanan', email: 'preethi@nexawave.io',   phone: '+91-76800-66677', company: 'NexaWave',
    status: 'Contacted',  source: 'Conference', priority: 'High',   value: 35000,
    notes: 'Connected at TechMeet 2025. COO is the decision maker.',
  },
  {
    name: 'Vinay Shetty',      email: 'vinay@urbanfit.gym',    phone: '+91-75900-77788', company: 'UrbanFit',
    status: 'New',        source: 'Instagram',  priority: 'Low',    value: 3800,
    notes: 'Fitness chain. Interested in member management module.',
  },
  {
    name: 'Chetna Bajaj',      email: 'chetna@docuchain.io',   phone: '+91-74100-88899', company: 'DocuChain',
    status: 'Qualified',  source: 'LinkedIn',   priority: 'High',   value: 48000,
    notes: 'Document automation SaaS. Strong ROI use case identified.',
  },
  {
    name: 'Harish Nambiar',    email: 'harish@foodloop.co',    phone: '+91-73200-99900', company: 'FoodLoop',
    status: 'Contacted',  source: 'Referral',   priority: 'Medium', value: 10500,
    notes: 'Cloud kitchen network. Piloting with 5 locations.',
  },
  {
    name: 'Swati Bhatt',       email: 'swati@greencode.dev',   phone: '+91-72300-00011', company: 'GreenCode',
    status: 'New',        source: 'Website',    priority: 'Medium', value: 7800,
    notes: 'Dev agency specialising in sustainability tech.',
  },
  {
    name: 'Rajesh Varma',      email: 'rajesh@securepath.io',  phone: '+91-71400-11122', company: 'SecurePath',
    status: 'Qualified',  source: 'Referral',   priority: 'High',   value: 62000,
    notes: 'Cybersecurity firm. Wants SOC 2 compliance documentation in portal.',
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Starting database seed…\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB Atlas');

  await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);
  console.log('🗑️   Cleared existing users and leads\n');

  // Create users
  const createdUsers: mongoose.Document[] = [];
  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 12);
    const user = await User.create({ ...u, password: hashed });
    createdUsers.push(user);
    console.log(`👤  Created user: ${u.email} (${u.role})`);
  }

  const userIds = createdUsers.map((u) => u._id);

  // Create leads, round-robin across users
  for (let i = 0; i < LEAD_TEMPLATES.length; i++) {
    const lead = LEAD_TEMPLATES[i]!;
    const createdBy = userIds[i % userIds.length];
    await Lead.create({ ...lead, createdBy });
    console.log(`📋  Created lead: ${lead.name} [${lead.status}/${lead.priority}]`);
  }

  console.log(`\n✨  Seed complete!`);
  console.log(`\n📊  Summary:`);
  console.log(`   Users:  ${USERS.length}`);
  console.log(`   Leads:  ${LEAD_TEMPLATES.length}`);
  console.log(`\n🔑  Demo Credentials:`);
  USERS.forEach((u) =>
    console.log(`   ${u.email.padEnd(22)} / password123  (${u.role})`)
  );

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
