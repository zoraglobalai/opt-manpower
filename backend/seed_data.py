"""
Seed script for Optimus Manpower platform.
Run with: python seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'optimus.settings')
django.setup()

from core.models import Job, Testimonial, CareerAdvice

# ─── CLEAR EXISTING ───────────────────────────────────────────────────────────
Job.objects.all().delete()
Testimonial.objects.all().delete()
CareerAdvice.objects.all().delete()
print("Cleared existing data.")

# ─── JOBS ─────────────────────────────────────────────────────────────────────
jobs = [
    {
        "title": "Senior Software Engineer",
        "company_name": "TechNova Solutions",
        "description": "We are looking for a skilled Senior Software Engineer to join our growing team in Chennai. You will design and build scalable backend systems that power our flagship SaaS products.\n\nYou will work closely with product managers, designers, and other engineers to deliver high-quality software solutions that meet business requirements.",
        "location": "Chennai",
        "country": "India",
        "experience": "5–8 years",
        "salary": "₹18–28 LPA",
        "job_type": "Full Time",
        "category": "IT & Technology",
        "is_international": False,
        "requirements": "- 5+ years of Python/Django experience\n- Proficiency in PostgreSQL and Redis\n- Experience with REST API design\n- Strong knowledge of Git and CI/CD\n- Excellent communication skills",
        "benefits": "- Health insurance (self + family)\n- Annual performance bonus\n- 20 days paid leave\n- Remote-friendly Fridays\n- Learning & development budget",
        "status": "Published",
    },
    {
        "title": "Registered Nurse – ICU",
        "company_name": "Gulf Medical Group",
        "description": "Gulf Medical Group is hiring experienced ICU Registered Nurses for our premier hospitals across the UAE. This is an excellent opportunity to work in a world-class facility with state-of-the-art equipment and a supportive international team.",
        "location": "Dubai",
        "country": "UAE",
        "experience": "3+ years",
        "salary": "AED 8,000–12,000/month",
        "job_type": "Full Time",
        "category": "Healthcare",
        "visa_type": "Employment Visa (provided)",
        "is_international": True,
        "requirements": "- B.Sc Nursing or GNM\n- Valid nursing registration\n- 3+ years ICU experience\n- ACLS/BLS certification preferred\n- Good command of English",
        "benefits": "- Employment visa & relocation provided\n- Accommodation allowance\n- Round trip air ticket annually\n- Medical insurance\n- End of service gratuity",
        "status": "Published",
    },
    {
        "title": "HR Manager",
        "company_name": "Pinnacle Industries",
        "description": "We are seeking an experienced HR Manager to oversee all aspects of human resources for our manufacturing plant in Pune. You will be responsible for talent acquisition, employee relations, compliance, and organizational development.",
        "location": "Pune",
        "country": "India",
        "experience": "6–10 years",
        "salary": "₹10–16 LPA",
        "job_type": "Full Time",
        "category": "HR",
        "is_international": False,
        "requirements": "- MBA in HR or equivalent\n- 6+ years of HR generalist experience\n- Strong knowledge of Indian labor law\n- Proven experience in talent acquisition\n- Excellent interpersonal skills",
        "benefits": "- Performance bonus up to 20%\n- Company car / transport allowance\n- Health insurance (family floater)\n- PF & Gratuity\n- Annual company retreat",
        "status": "Published",
    },
    {
        "title": "Civil Site Engineer",
        "company_name": "Al-Arif Contracting",
        "description": "Al-Arif Contracting is a leading construction firm based in Riyadh. We are hiring Civil Site Engineers with experience in large-scale infrastructure and residential projects.",
        "location": "Riyadh",
        "country": "Saudi Arabia",
        "experience": "4–7 years",
        "salary": "SAR 6,000–9,000/month",
        "job_type": "Full Time",
        "category": "Engineering",
        "visa_type": "Work Permit (provided)",
        "is_international": True,
        "requirements": "- B.E./B.Tech in Civil Engineering\n- 4+ years site engineering experience\n- Proficiency in AutoCAD\n- Knowledge of Saudi Aramco/NEOM standards is a plus\n- Driving License",
        "benefits": "- Visa & relocation package\n- Accommodation provided\n- Annual leave ticket\n- Medical insurance\n- Tax-free salary",
        "status": "Published",
    },
    {
        "title": "Digital Marketing Executive",
        "company_name": "Blaze Digital Agency",
        "description": "Blaze Digital Agency is looking for a creative and data-driven Digital Marketing Executive to manage campaigns across Google, Meta, and LinkedIn for our diverse client portfolio.",
        "location": "Bengaluru",
        "country": "India",
        "experience": "2–4 years",
        "salary": "₹5–9 LPA",
        "job_type": "Full Time",
        "category": "Marketing",
        "is_international": False,
        "requirements": "- 2+ years digital marketing experience\n- Hands-on experience with Google Ads & Meta Ads\n- Knowledge of SEO, SEM, and analytics tools\n- Excellent written English\n- Creative mindset",
        "benefits": "- Flexible working hours\n- Health insurance\n- Performance incentives\n- Team outings & events\n- Career growth in fast-paced environment",
        "status": "Published",
    },
    {
        "title": "Chartered Accountant",
        "company_name": "Sterling Finance Ltd.",
        "description": "Sterling Finance Ltd. is a NBFC seeking a qualified Chartered Accountant to head our finance division. You will be responsible for statutory compliance, audit, taxation, and financial reporting.",
        "location": "Mumbai",
        "country": "India",
        "experience": "4–8 years post CA",
        "salary": "₹15–24 LPA",
        "job_type": "Full Time",
        "category": "Finance",
        "is_international": False,
        "requirements": "- Qualified CA (ICAI)\n- 4+ years post-qualification experience in NBFC/banking sector\n- Strong in IndAS/IFRS\n- Experience with tax audit and statutory filings\n- Excellent analytical skills",
        "benefits": "- ESOPs available\n- Variable pay up to 30%\n- Premium health insurance\n- Cab facility\n- Work-life balance culture",
        "status": "Published",
    },
    {
        "title": "Housekeeping Supervisor",
        "company_name": "Marriott International",
        "description": "Marriott Qatar is hiring experienced Housekeeping Supervisors for our 5-star luxury property in Doha. The candidate will oversee room cleaning operations and maintain the highest standards of cleanliness and guest satisfaction.",
        "location": "Doha",
        "country": "Qatar",
        "experience": "3–5 years",
        "salary": "QAR 3,500–4,800/month",
        "job_type": "Full Time",
        "category": "Operations",
        "visa_type": "QID Work Visa",
        "is_international": True,
        "requirements": "- Diploma in Hotel Management or equivalent\n- 3+ years housekeeping experience in 4/5 star hotels\n- Strong leadership skills\n- Attention to detail\n- Basic English communication",
        "benefits": "- Visa & air ticket provided\n- Accommodation & meals\n- Medical insurance\n- Service charge bonus\n- Annual leave",
        "status": "Published",
    },
    {
        "title": "Inside Sales Executive",
        "company_name": "CloudTech India",
        "description": "CloudTech is India's fastest growing SaaS company. We are looking for ambitious Inside Sales Executives to join our sales team and drive B2B software subscription growth.",
        "location": "Hyderabad",
        "country": "India",
        "experience": "1–3 years",
        "salary": "₹4–7 LPA + incentives",
        "job_type": "Full Time",
        "category": "Sales",
        "is_international": False,
        "requirements": "- 1+ year inside sales or tele-sales experience\n- Excellent verbal and written communication\n- Proficiency in CRM tools (Salesforce/Zoho)\n- Target-oriented mindset\n- Tech-savvy with good product demo skills",
        "benefits": "- Uncapped monthly incentives\n- Laptop provided\n- Health insurance\n- 5-day work week\n- Fast career progression",
        "status": "Published",
    },
]

created_jobs = []
for j in jobs:
    job = Job.objects.create(**j)
    created_jobs.append(job.title)

print(f"Created {len(created_jobs)} jobs: {', '.join(created_jobs)}")

# ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
testimonials_data = [
    {
        "name": "Priya Venkataraman",
        "role": "Software Engineer, Dubai",
        "review": "Optimus Manpower helped me secure an international opportunity that transformed my career. The guidance throughout the visa and relocation process was exceptional. I highly recommend them to anyone looking for Gulf opportunities.",
    },
    {
        "name": "Arjun Nair",
        "role": "ICU Nurse, Abu Dhabi",
        "review": "I was skeptical at first, but the team at Optimus Manpower was transparent and professional from day one. Within 6 weeks of registering, I had an offer letter in hand. They truly care about candidates.",
    },
    {
        "name": "Mohammed Farouk",
        "role": "Civil Engineer, Riyadh",
        "review": "The best placement consultancy I have worked with. They matched me with a role that fits my skills perfectly. The salary package negotiated was 20% above my expectations. Thank you Optimus Manpower!",
    },
    {
        "name": "Deepa Krishnamurthy",
        "role": "HR Manager, Bengaluru",
        "review": "Optimus Manpower understood my profile better than any other agency. They placed me in a senior role that aligned perfectly with my career goals. Professional, swift, and reliable.",
    },
    {
        "name": "Santhosh Kumar",
        "role": "Chartered Accountant, Mumbai",
        "review": "Top-notch service. The consultants took time to understand what I was looking for and presented only relevant opportunities. Landed a role with 40% salary hike within 30 days of registration.",
    },
]

for t in testimonials_data:
    Testimonial.objects.create(**t)

print(f"Created {len(testimonials_data)} testimonials.")

# ─── CAREER ADVICE ────────────────────────────────────────────────────────────
articles = [
    {
        "title": "10 Resume Tips That Get You More Interview Calls in 2025",
        "content": """Your resume is your first impression. Here's how to make it count.

**1. Lead With a Strong Summary**
Don't start with an objective statement. Instead, write a 3-line professional summary that highlights your top value: years of experience, domain expertise, and your biggest achievement.

**2. Quantify Everything**
Hiring managers skim resumes in under 6 seconds. Numbers stand out. Instead of "managed a team", write "led a team of 12 engineers delivering ₹4Cr project 3 weeks ahead of schedule."

**3. Use ATS-Friendly Formatting**
Most companies use Applicant Tracking Systems. Avoid tables, graphics, and unusual fonts. Stick to clean sections: Summary, Experience, Skills, Education.

**4. Tailor for Every Application**
A generic resume gets generic results. Mirror keywords from the job description. If the JD says "stakeholder management", use that exact phrase.

**5. Keep It to 1–2 Pages**
Unless you have 15+ years of varied experience, keep it concise. Every line should earn its place.

**6. Action Verbs Open Every Bullet**
Start bullets with power verbs: Spearheaded, Reduced, Designed, Delivered, Negotiated. Never start with "Responsible for."

**7. Education Goes Last**
Unless you're a fresh graduate, your experience is more relevant. Move education to the bottom.

**8. Include a LinkedIn URL**
Make sure your LinkedIn profile is complete and mirrors your resume. Recruiters always check.

**9. No Spelling Errors**
Use Grammarly or have a friend proofread. A single typo is often enough to disqualify you.

**10. Name Your File Properly**
Name your resume "YourName_Resume_2025.pdf" — never "Resume_Final_v3_new.pdf".""",
    },
    {
        "title": "How to Ace Your Job Interview: A Complete Preparation Guide",
        "content": """Interviews are predictable if you prepare correctly. Here's a framework used by successful candidates.

**Before the Interview**
Research the company thoroughly — their products, recent news, competitors, and culture. Visit their LinkedIn, Glassdoor page, and recent press releases.

**The STAR Method**
For behavioral questions ("Tell me about a time when..."), use STAR:
- **S**ituation: Set the context
- **T**ask: Describe your responsibility  
- **A**ction: Explain what you did specifically
- **R**esult: Quantify the outcome

**Questions You Must Prepare**
1. Tell me about yourself (keep to 90 seconds)
2. Why do you want to leave your current company?
3. Where do you see yourself in 5 years?
4. What's your greatest strength and weakness?
5. Do you have any questions for us? (Always ask 2–3 thoughtful ones)

**Professional Presentation**
- Arrive 10 minutes early (or join the video call 2 minutes early)
- Dress one level above the company's standard dress code
- Make steady eye contact
- Don't interrupt the interviewer

**Salary Negotiation**
Wait for them to name a number first. When they ask your expectation, say: "Based on my research and experience, I'm looking at a range of X to Y. Is that aligned with what you have budgeted?"

**Post Interview**
Send a brief thank-you email within 24 hours. It sets you apart from 90% of candidates.""",
    },
    {
        "title": "Working in the Gulf: What Every Indian Professional Should Know",
        "content": """The GCC countries (UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain) offer some of the highest paying opportunities for Indian professionals. Here's what to know before you go.

**Tax-Free Income**
The biggest advantage: zero income tax. A salary of AED 12,000 in Dubai is equivalent to earning ₹23 LPA tax-free in India.

**Understanding the Kafala System**
Most Gulf countries operate under the Kafala (sponsorship) system. Your employer is your legal sponsor. This means:
- Your visa is tied to your employer
- You need a No Objection Certificate (NOC) to switch jobs in some countries
- UAE has reformed this significantly with the new labor laws (2022)

**Documentation You Need**
- Passport valid for 2+ years
- Educational certificates attested by MEA (India) + UAE Embassy
- Experience letters from previous employers
- Medical fitness certificate
- Police clearance certificate

**Cost of Living**
Dubai and Doha are expensive. Budget approximately AED 3,000–4,000/month for accommodation, food, and transport if not provided by the employer.

**Cultural Etiquette**
- Dress modestly in public areas
- Ramadan affects working hours
- Friday is the day of rest (weekend is Friday-Saturday in most GCC)
- Alcohol is restricted in most Gulf countries (except UAE and Bahrain)

**Working with Optimus Manpower**
Our international division specializes in placing Indian candidates in verified, reputed companies across the Gulf. We handle documentation guidance, interview preparation, and post-placement support.""",
    },
    {
        "title": "Career Growth Strategies That Actually Work in 2025",
        "content": """Career growth doesn't happen accidentally. Here are proven strategies from professionals who have made significant leaps.

**1. Develop T-Shaped Skills**
Excel in one domain (the vertical bar of T) but have working knowledge of many adjacent areas (the horizontal bar). A finance professional who also understands technology is far more valuable.

**2. Build Internal Visibility**
Many great performers are overlooked because their work is invisible to leadership. Speak up in meetings, share monthly progress summaries, volunteer for cross-functional projects.

**3. Find a Mentor**
A mentor who has already walked the path you want to walk can save you years of trial and error. Identify senior professionals in your field and build that relationship genuinely — not instrumentally.

**4. Invest in Certifications Strategically**
Not all certifications are equal. Focus on ones recognized by your industry: PMP for project management, CFA for finance, AWS for tech, CIPD for HR. Each adds a tangible line to your profile.

**5. Switch Jobs at the Right Time**
The biggest salary jumps come from job changes. Indian professionals typically see 15–20% raises from internal hikes but 40–60% jumps when switching companies. The optimal time to switch is 2.5–3 years into a role.

**6. Build Your Personal Brand**
Write on LinkedIn. Comment thoughtfully on industry posts. Share your learnings. Professionals who are known in their domain get inbound opportunities — they don't need to apply.

**7. Salary Benchmark Yourself Annually**
Use platforms like AmbitionBox, Glassdoor, and LinkedIn Salary to know your market value. If you are underpaid, you deserve to know.""",
    },
]

for a in articles:
    CareerAdvice.objects.create(**a)

print(f"Created {len(articles)} career advice articles.")
print("\n✅ Seed data complete! The platform is ready.")
print("   🌐 Frontend: http://localhost:5173")
print("   🔌 Backend API: http://localhost:8000/api/")
print("   🔑 Admin: admin@optimusmanpower.com / Admin@123")
