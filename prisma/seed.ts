import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const domains = [
  ["web-development", "Web Development", "Globe", "Build modern websites with HTML, CSS, JavaScript, and frameworks.", ["HTML", "CSS", "JavaScript", "Responsive Design", "Git"]],
  ["full-stack-development", "Full Stack Development", "Layers", "Work across frontend and backend to ship complete applications.", ["React", "Node.js", "APIs", "Databases", "Auth"]],
  ["frontend-development", "Frontend Development", "PanelTop", "Create accessible, responsive user interfaces.", ["React", "TypeScript", "Tailwind", "Accessibility", "UI State"]],
  ["backend-development", "Backend Development", "Server", "Design APIs, data models, and server-side business logic.", ["Node.js", "REST", "SQL", "Auth", "Caching"]],
  ["python-development", "Python Development", "Code2", "Use Python for scripting, APIs, and application logic.", ["Python", "Flask/Django", "OOP", "APIs", "Testing"]],
  ["java-development", "Java Development", "Coffee", "Build structured applications with Java and related tooling.", ["Java", "OOP", "Spring basics", "SQL", "Testing"]],
  ["data-science", "Data Science", "BrainCircuit", "Analyze datasets and communicate insights with models and visuals.", ["Python", "Pandas", "Statistics", "Visualization", "Notebooks"]],
  ["data-analytics", "Data Analytics", "ChartColumn", "Turn raw data into decision-ready reports and dashboards.", ["SQL", "Excel", "Dashboards", "EDA", "Storytelling"]],
  ["artificial-intelligence", "Artificial Intelligence", "Bot", "Explore applied AI concepts through guided internship projects.", ["Python", "ML basics", "Prompting", "Evaluation", "Ethics"]],
  ["machine-learning", "Machine Learning", "Binary", "Train, evaluate, and document machine learning experiments.", ["Python", "Scikit-learn", "Feature Engineering", "Metrics", "Pipelines"]],
  ["cloud-computing", "Cloud Computing", "Cloud", "Learn cloud architecture patterns and managed services.", ["Cloud fundamentals", "Networking", "Storage", "IAM", "Deployments"]],
  ["microsoft-azure", "Microsoft Azure", "Boxes", "Practice Azure services used in application and data workloads.", ["Azure fundamentals", "App Services", "Storage", "Identity", "Monitoring"]],
  ["aws-cloud", "AWS Cloud", "CloudCog", "Work with core AWS services for compute, storage, and networking.", ["EC2/S3 basics", "IAM", "VPC concepts", "CloudWatch", "Architecture"]],
  ["devops", "DevOps", "GitBranch", "Connect development and operations with CI/CD and automation.", ["Linux", "Git", "CI/CD", "Containers", "Monitoring"]],
  ["cyber-security", "Cyber Security", "Shield", "Understand defensive security practices and common risk areas.", ["Security basics", "Networking", "Access control", "Logging", "Risk"]],
  ["ethical-hacking", "Ethical Hacking", "ScanSearch", "Study authorized security testing concepts in a structured program.", ["Recon basics", "OWASP awareness", "Reporting", "Ethics", "Remediation"]],
  ["ui-ux-design", "UI/UX Design", "Palette", "Design usable interfaces with research, wireframes, and prototypes.", ["Research", "Wireframing", "Figma", "Usability", "Design systems"]],
  ["mobile-app-development", "Mobile App Development", "Smartphone", "Build mobile experiences with modern app development workflows.", ["Mobile UI", "APIs", "State", "Testing", "Release basics"]],
  ["android-development", "Android Development", "AppWindow", "Create Android applications with structured project work.", ["Kotlin/Java", "Android UI", "Activities", "Data storage", "Testing"]],
  ["software-testing", "Software Testing", "Bug", "Plan and execute tests that improve software quality.", ["Test cases", "Manual testing", "Bug reports", "Regression", "QA process"]],
  ["automation-testing", "Automation Testing", "Workflow", "Automate repeatable tests for faster, more reliable feedback.", ["Selenium/Playwright", "Assertions", "CI", "Reporting", "Maintenance"]],
  ["sql-database", "SQL & Database", "Database", "Model data and write queries that support internships and products.", ["SQL", "Joins", "Indexing basics", "Normalization", "Reporting"]],
  ["business-analytics", "Business Analytics", "LineChart", "Connect business questions to metrics, dashboards, and recommendations.", ["KPI design", "SQL", "Dashboards", "Stakeholder comms", "Insights"]],
  ["digital-marketing", "Digital Marketing", "Megaphone", "Plan campaigns and measure digital channel performance.", ["SEO basics", "Content", "Analytics", "Campaigns", "Reporting"]],
  ["content-writing", "Content Writing", "PenLine", "Create clear, structured writing for product, career, and web audiences.", ["Research", "Editing", "Tone", "SEO writing", "Review cycles"]],
  ["human-resources", "Human Resources", "Users", "Practice core HR operations, communication, and people processes.", ["Recruiting basics", "Documentation", "Communication", "Policy awareness", "Coordination"]],
  ["finance", "Finance", "IndianRupee", "Work with financial concepts, reporting, and analysis internships.", ["Accounting basics", "Spreadsheets", "Reporting", "Analysis", "Compliance awareness"]],
  ["business-management", "Business Management", "BriefcaseBusiness", "Develop operational, planning, and coordination skills for business internships.", ["Planning", "Coordination", "Documentation", "Communication", "Process"]],
] as const;

const featuredSlugs = [
  "python-development",
  "web-development",
  "data-analytics",
  "machine-learning",
  "cloud-computing",
  "cyber-security",
  "ui-ux-design",
  "java-development",
];

const durations = [
  { key: "4-weeks", label: "4 Weeks", unit: "WEEKS", amount: 4, original: 100, promo: 50, sort: 1 },
  { key: "6-weeks", label: "6 Weeks", unit: "WEEKS", amount: 6, original: 150, promo: 75, sort: 2 },
  { key: "2-months", label: "2 Months", unit: "MONTHS", amount: 2, original: 200, promo: 100, sort: 3 },
  { key: "3-months", label: "3 Months", unit: "MONTHS", amount: 3, original: 300, promo: 150, sort: 4 },
  { key: "4-months", label: "4 Months", unit: "MONTHS", amount: 4, original: 400, promo: 200, sort: 5 },
  { key: "5-months", label: "5 Months", unit: "MONTHS", amount: 5, original: 500, promo: 250, sort: 6 },
  { key: "6-months", label: "6 Months", unit: "MONTHS", amount: 6, original: 600, promo: 300, sort: 7 },
];

const faqs = [
  ["What is InternHub?", "InternHub is an internship provider platform where students can explore domains, apply for structured internship programs, complete payment, track progress, and receive professional documentation such as offer letters and certificates."],
  ["Who can apply?", "College and university students who can provide academic details and complete a student profile can apply. Eligibility can also be set per internship by an administrator."],
  ["What internship domains are available?", "Domains are managed from the admin dashboard and currently include technology, analytics, cloud, security, design, marketing, HR, finance, and business programs."],
  ["What durations are available?", "Administrators define duration rules. The default catalog includes 4 weeks, 6 weeks, and 2–6 months."],
  ["How much does an internship cost?", "Prices are configured in the admin pricing system. Promotional student prices currently start from ₹50 depending on duration."],
  ["How does the 50% discount work?", "The launch promotion shows already-discounted promotional prices (50% off the original list price). The pricing engine calculates original price, discount, and payable amount. Coupon codes can be applied when active."],
  ["How do I apply?", "Create an account, complete your profile, choose a domain and internship, select duration, submit the application, and complete payment."],
  ["When will I receive my offer letter?", "Offer letters are generated after the application is approved and required student details exist. Administrators generate them from verified records."],
  ["When will I receive my certificate?", "Certificates are generated only after internship completion requirements are marked complete. They are not issued in advance."],
  ["How can I verify my certificate?", "Use the public verification page or scan the QR code. The URL only includes the certificate ID."],
  ["Can I change my internship domain?", "Domain changes depend on application status. Contact support before payment or ask an administrator to review the request."],
  ["Can I change my duration?", "Duration can be changed before payment if the application is still editable. After payment, changes require administrator review."],
  ["Can I request a refund?", "Refund requests follow the Refund Policy. Administrators record refund status against the payment, not against card details."],
  ["Is the internship online?", "Most programs are online. Hybrid and offline modes can be configured per internship."],
  ["How do I contact support?", "Use the contact form or email the public support address listed on the Contact page. Private administrator details are not published."],
];

const sampleTestimonials: Array<[string, string, string, string, string, number]> = [
  ["Aarav S.", "Sample University A", "python-development", "3 Months", "The Python internship structure helped me turn classroom concepts into a documented project I could add to my portfolio.", 5],
  ["Meera K.", "Sample Institute B", "web-development", "2 Months", "I liked that pricing, duration, and documents were visible before I applied. The dashboard made status easy to follow.", 5],
  ["Rohan P.", "Sample College C", "data-analytics", "6 Weeks", "The analytics program was practical. I treated this as sample platform content, not a claim about a real employer brand.", 4],
  ["Isha V.", "Sample Academy D", "ui-ux-design", "4 Weeks", "The application flow collected the details needed for documentation without feeling like a generic form dump.", 5],
];

async function main() {
  await prisma.couponRedemption.deleteMany();
  await prisma.certificateVerification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.offerLetter.deleteMany();
  await prisma.document.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.durationRule.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.websiteContent.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.idSequence.deleteMany();

  for (const [index, domain] of domains.entries()) {
    const created = await prisma.domain.create({
      data: {
        slug: domain[0],
        name: domain[1],
        icon: domain[2],
        shortDescription: domain[3],
        skills: JSON.stringify(domain[4]),
        sortOrder: index + 1,
      },
    });

    const level = index % 3 === 0 ? "BEGINNER" : index % 3 === 1 ? "INTERMEDIATE" : "ADVANCED";
    await prisma.internship.create({
      data: {
        slug: `${domain[0]}-internship`,
        title: `${domain[1]} Internship`,
        domainId: created.id,
        level,
        mode: "ONLINE",
        description: `A structured ${domain[1]} internship with guided project work, progress tracking, and professional documentation after completion.`,
        skills: JSON.stringify(domain[4]),
        learningOutcomes: JSON.stringify([
          `Apply ${domain[1]} fundamentals on a guided project`,
          "Document progress and learning outcomes",
          "Receive internship documentation after verified completion",
        ]),
        includes: JSON.stringify([
          "Internship Certificate",
          "Offer Letter",
          "Project Experience",
          "Performance Evaluation",
          "Internship Documentation",
        ]),
        isFeatured: featuredSlugs.includes(domain[0]),
      },
    });
  }

  for (const duration of durations) {
    await prisma.durationRule.create({
      data: {
        key: duration.key,
        label: duration.label,
        unit: duration.unit,
        amount: duration.amount,
        sortOrder: duration.sort,
      },
    });
    await prisma.pricingPlan.create({
      data: {
        durationKey: duration.key,
        originalPrice: duration.original,
        promotionalPrice: duration.promo,
        discountPercent: 50,
        isActive: true,
      },
    });
  }

  await prisma.discount.createMany({
    data: [
      { name: "50% OFF", couponCode: "INTERN50", type: "PERCENT", percent: 50, eligibility: "NEW_STUDENTS", isActive: true },
      { name: "25% OFF", couponCode: "INTERN25", type: "PERCENT", percent: 25, isActive: true },
      { name: "10% OFF", couponCode: "INTERN10", type: "PERCENT", percent: 10, isActive: true },
      { name: "Student Special", couponCode: "STUDENT", type: "PERCENT", percent: 50, eligibility: "STUDENTS", isActive: true },
      { name: "Launch Offer", couponCode: "LAUNCH50", type: "PERCENT", percent: 50, isActive: true },
      { name: "Festival Offer", couponCode: "FESTIVE", type: "PERCENT", percent: 25, isActive: false },
      { name: "Referral Offer", couponCode: "REFER10", type: "PERCENT", percent: 10, isActive: true },
    ],
  });

  for (const [index, faq] of faqs.entries()) {
    await prisma.faq.create({
      data: { question: faq[0], answer: faq[1], sortOrder: index + 1 },
    });
  }

  for (const [index, item] of sampleTestimonials.entries()) {
    const [name, college, domainSlug, duration, quote, rating] = item;
    const domain = await prisma.domain.findUnique({ where: { slug: domainSlug } });
    await prisma.testimonial.create({
      data: {
        name,
        college,
        domainId: domain?.id,
        duration,
        quote,
        rating,
        isSample: true,
        sortOrder: index + 1,
      },
    });
  }

  const promoEnd = new Date();
  promoEnd.setDate(promoEnd.getDate() + 21);

  await prisma.systemSetting.createMany({
    data: [
      { key: "hero_headline", value: "Launch Your Career With Real-World Internship Experience" },
      { key: "hero_subtext", value: "Explore structured internships, gain practical experience, build your portfolio, and receive professional internship documentation." },
      { key: "tagline", value: "Learn. Intern. Build Your Future." },
      { key: "supporting_line", value: "Industry-ready internships designed to turn students into confident professionals." },
      { key: "promo_enabled", value: "true" },
      { key: "promo_kicker", value: "LIMITED-TIME STUDENT OFFER" },
      { key: "promo_headline", value: "50% OFF — Internship Programs Starting From ₹50" },
      { key: "promo_subtext", value: "Special student pricing for a limited promotional period." },
      { key: "promo_countdown_end", value: promoEnd.toISOString() },
      { key: "promo_cta", value: "Claim Your Internship" },
      { key: "starting_price_label", value: "Starting at ₹50" },
      { key: "aicte_badge_enabled", value: "false" },
      { key: "aicte_label", value: "AICTE Information" },
      { key: "iso_badge_enabled", value: "false" },
      { key: "iso_label", value: "Certification / Quality Information" },
      { key: "tax_enabled", value: "false" },
      { key: "tax_percent", value: "0" },
      { key: "support_email", value: "support@internhub.example" },
      { key: "business_email", value: "hello@internhub.example" },
      { key: "business_phone", value: "" },
      { key: "social_linkedin", value: "https://www.linkedin.com" },
      { key: "social_instagram", value: "https://www.instagram.com" },
      { key: "social_x", value: "https://x.com" },
    ],
  });

  await prisma.websiteContent.createMany({
    data: [
      { key: "mission", value: "To make meaningful internship experiences accessible, structured, affordable, and career-focused for students from different educational backgrounds." },
      { key: "vision", value: "To become a trusted student career platform connecting learners with practical experiences that help them confidently transition from education to employment." },
      { key: "about_who", value: "InternHub is a student career platform focused on structured internships, transparent pricing, and professional documentation." },
      { key: "about_what", value: "We help students explore domains, apply, pay, complete internships, and receive offer letters and certificates generated from verified records." },
      { key: "about_why", value: "Students often need a clearer path from coursework to documented practical experience. InternHub exists to make that path structured and affordable." },
    ],
  });

  const studentHash = await bcrypt.hash("DemoStudent@2026", 12);
  const adminHash = await bcrypt.hash("DemoAdmin@2026", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@demo.internhub.local",
      passwordHash: adminHash,
      role: "ADMIN",
      name: "InternHub Admin",
      mobile: "9876543210",
      isActive: true,
      adminProfile: { create: { title: "Platform Administrator" } },
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@demo.internhub.local",
      passwordHash: studentHash,
      role: "STUDENT",
      name: "Demo Student",
      mobile: "9876501234",
      isActive: true,
      studentProfile: {
        create: {
          college: "Sample Institute of Technology",
          collegeLocation: "Hyderabad",
          course: "B.Tech",
          branch: "Computer Science",
          graduationYear: 2027,
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
          technicalSkills: JSON.stringify(["Python", "SQL", "HTML"]),
          programmingLanguages: JSON.stringify(["Python", "JavaScript"]),
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      type: "REGISTRATION",
      title: "Welcome to InternHub",
      body: "This is a demo student account. Explore internships and complete your profile.",
      href: "/dashboard/profile",
    },
  });

  console.log("InternHub demo data ready.");
  console.log("Demo student:", student.email, "password: DemoStudent@2026");
  console.log("Demo admin:", admin.email, "password: DemoAdmin@2026");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
