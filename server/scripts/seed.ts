// ─────────────────────────────────────────────────────────────────────────────
// scripts/seed.ts – Populate MongoDB Atlas with sample data
// Run: npx ts-node scripts/seed.ts
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env['MONGODB_URI']!;

// ── Minimal inline schemas for seeding ────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  password: String,
  role:     String,
}, { timestamps: true, versionKey: false });

const leadSchema = new mongoose.Schema({
  name:      String,
  email:     String,
  status:    String,
  source:    String,
  notes:     String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
const Lead = mongoose.model('Lead', leadSchema);

// ── Seed Data ──────────────────────────────────────────────────────────────

const USERS = [
  { name: 'Mayank Admin', email: 'admin@demo.com',  password: 'password123', role: 'admin' },
  { name: 'Sales User',   email: 'sales@demo.com',  password: 'password123', role: 'sales' },
];

const LEAD_TEMPLATES = [
  { name: 'Priya Sharma',    email: 'priya@techcorp.in',    status: 'New',       source: 'Website',   notes: 'Interested in enterprise plan' },
  { name: 'Arjun Mehta',    email: 'arjun@startup.io',     status: 'Contacted', source: 'Instagram', notes: 'Followed up twice, warm lead' },
  { name: 'Sneha Patel',    email: 'sneha@agency.co',      status: 'Qualified', source: 'Referral',  notes: 'Referred by existing client' },
  { name: 'Vikram Singh',   email: 'vikram@global.com',    status: 'Lost',      source: 'Website',   notes: 'Chose competitor product' },
  { name: 'Ananya Reddy',   email: 'ananya@design.studio', status: 'New',       source: 'Instagram', notes: 'Saw Instagram ad campaign' },
  { name: 'Rahul Gupta',    email: 'rahul@fintech.io',     status: 'Contacted', source: 'Referral',  notes: 'Needs team plan quote' },
  { name: 'Kavita Nair',    email: 'kavita@medtech.in',    status: 'Qualified', source: 'Website',   notes: 'Demo call scheduled' },
  { name: 'Dev Agarwal',    email: 'dev@saas.co',          status: 'New',       source: 'Website',   notes: 'Trial account created' },
  { name: 'Pooja Kumar',    email: 'pooja@ecom.store',     status: 'Contacted', source: 'Instagram', notes: 'Active on social media' },
  { name: 'Nikhil Joshi',   email: 'nikhil@cloud.io',     status: 'Qualified', source: 'Referral',  notes: 'Ready to close this week' },
  { name: 'Ritu Verma',     email: 'ritu@hr.corp',         status: 'Lost',      source: 'Website',   notes: 'Budget constraints' },
  { name: 'Amit Tiwari',    email: 'amit@consulting.biz',  status: 'New',       source: 'Referral',  notes: 'High-potential enterprise lead' },
  { name: 'Sunita Rao',     email: 'sunita@retail.in',     status: 'Contacted', source: 'Website',   notes: 'Interested in annual plan' },
  { name: 'Kiran Bose',     email: 'kiran@edu.org',        status: 'Qualified', source: 'Instagram', notes: 'Education sector discount applied' },
  { name: 'Manish Saxena',  email: 'manish@logix.co',     status: 'New',       source: 'Website',   notes: 'Signed up for newsletter' },
];

async function seed() {
  console.log('🌱  Starting database seed...\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB Atlas');

  // Clear existing data
  await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);
  console.log('🗑️   Cleared existing users and leads\n');

  // Create users
  const createdUsers = [];
  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 12);
    const user = await User.create({ ...u, password: hashed });
    createdUsers.push(user);
    console.log(`👤  Created user: ${u.email} (${u.role})`);
  }

  const adminId = createdUsers[0]!._id;
  const salesId = createdUsers[1]!._id;

  // Create leads (alternate between admin and sales)
  for (let i = 0; i < LEAD_TEMPLATES.length; i++) {
    const lead = LEAD_TEMPLATES[i]!;
    const createdBy = i % 3 === 0 ? salesId : adminId;
    await Lead.create({ ...lead, createdBy });
    console.log(`📋  Created lead: ${lead.name} [${lead.status}/${lead.source}]`);
  }

  console.log(`\n✨  Seed complete!`);
  console.log(`\n📊  Summary:`);
  console.log(`   Users:  ${USERS.length}`);
  console.log(`   Leads:  ${LEAD_TEMPLATES.length}`);
  console.log(`\n🔑  Demo Credentials:`);
  console.log(`   admin@demo.com  / password123  (Admin)`);
  console.log(`   sales@demo.com  / password123  (Sales)\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
