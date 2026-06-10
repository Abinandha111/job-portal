import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/jobs", { state: { initialSearch: searchQuery } });
    } else {
      navigate("/jobs");
    }
  };

  // Curated premium mockup jobs for the Featured section
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Product Designer",
      company: "Figma",
      logo: "F",
      logoClass: "figma",
      location: "San Francisco, CA (Hybrid)",
      salary: "$145,000 - $180,000",
      tags: ["Design", "Framer", "Full-time"],
    },
    {
      id: 2,
      title: "Staff Software Engineer, React",
      company: "Google",
      logo: "G",
      logoClass: "google",
      location: "New York, NY (Hybrid)",
      salary: "$190,000 - $240,000",
      tags: ["Engineering", "React", "Full-time"],
    },
    {
      id: 3,
      title: "Backend Infrastructure Lead",
      company: "Stripe",
      logo: "S",
      logoClass: "stripe",
      location: "Remote (US/Canada)",
      salary: "$175,000 - $210,000",
      tags: ["Engineering", "Node.js", "Remote"],
    },
  ];

  const topCompanies = [
    { name: "Google", logo: "G", logoClass: "google", jobs: 12 },
    { name: "Figma", logo: "F", logoClass: "figma", jobs: 4 },
    { name: "Stripe", logo: "S", logoClass: "stripe", jobs: 8 },
    { name: "Microsoft", logo: "M", logoClass: "microsoft", jobs: 19 },
    { name: "Slack", logo: "Sl", logoClass: "slack", jobs: 6 },
    { name: "Amazon", logo: "A", logoClass: "amazon", jobs: 25 },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-new">🚀 Modern Career Platform</div>
          <h1>
            Discover your <span>next career move</span> with CareerHub
          </h1>
          <p>
            Connect with industry-leading companies, find curated vacancies, and grow your career. The modern SaaS portal for elite professionals.
          </p>

          <form className="hero-search-box" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Job title, company, or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">Find Jobs</button>
          </form>

          <div className="hero-stats">
            <div className="stat-card">
              <h3>18,500+</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-card">
              <h3>9,200+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-card">
              <h3>240,000+</h3>
              <p>Candidates</p>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Cards */}
        <div className="hero-visual">
          <div className="visual-glow"></div>
          <div className="floating-card card-1">
            <div className="floating-card-header">
              <span className="company-logo google">G</span>
              <div>
                <h4>Senior React Developer</h4>
                <p>Google • Remote</p>
              </div>
            </div>
            <div className="floating-card-tags">
              <span>React</span>
              <span className="salary-tag">$180k</span>
            </div>
          </div>

          <div className="floating-card card-2">
            <div className="floating-card-header">
              <span className="company-logo figma">F</span>
              <div>
                <h4>UI/UX Designer</h4>
                <p>Figma • London, UK</p>
              </div>
            </div>
            <div className="floating-card-tags">
              <span>Framer</span>
              <span className="salary-tag">$130k</span>
            </div>
          </div>

          <div className="floating-card card-3">
            <div className="floating-card-header">
              <span className="company-logo stripe">S</span>
              <div>
                <h4>DevOps Engineer</h4>
                <p>Stripe • San Francisco</p>
              </div>
            </div>
            <div className="floating-card-tags">
              <span>AWS</span>
              <span className="salary-tag">$195k</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="companies-section">
        <div className="section-header">
          <h2>Shop by Top Companies</h2>
          <p>Work with the most trusted software and engineering brands worldwide.</p>
        </div>
        <div className="companies-grid">
          {topCompanies.map((company) => (
            <div key={company.name} className="company-card">
              <div className={`company-card-logo ${company.logoClass}`}>{company.logo}</div>
              <h3>{company.name}</h3>
              <p>{company.jobs} open vacancies</p>
              <Link to="/jobs" className="company-link">View Jobs →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Job Postings</h2>
          <p>Hand-picked opportunities from leading design and engineering teams.</p>
        </div>
        <div className="featured-grid">
          {featuredJobs.map((job) => (
            <div key={job.id} className="featured-job-card">
              <div className="featured-job-header">
                <span className={`company-logo ${job.logoClass}`}>{job.logo}</span>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company} • {job.location}</p>
                </div>
              </div>
              <div className="featured-job-tags">
                {job.tags.map(t => <span key={t} className="job-tag">{t}</span>)}
              </div>
              <div className="featured-job-footer">
                <span className="salary-label">{job.salary}</span>
                <Link to="/jobs">
                  <button className="apply-btn-home">Apply Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/jobs">
            <button className="view-all-btn">Browse All Open Positions</button>
          </Link>
        </div>
      </section>

      {/* Call to Action Sections */}
      <section className="cta-section">
        <div className="cta-grid">
          {/* Job Seeker CTA */}
          <div className="cta-card seeker">
            <div className="cta-content">
              <h2>Looking for a new role?</h2>
              <p>Create a profile, list your tech skills, upload your resume, and get matching jobs delivered directly to your dashboard.</p>
              <Link to="/register">
                <button className="btn-primary">Build Profile</button>
              </Link>
            </div>
          </div>

          {/* Recruiter CTA */}
          <div className="cta-card recruiter">
            <div className="cta-content">
              <h2>Hiring top developers?</h2>
              <p>Publish job vacancies, review recruiter dashboard statistics, manage active candidates, and build elite teams in a click.</p>
              <Link to="/register">
                <button className="btn-secondary">Post a Job</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}