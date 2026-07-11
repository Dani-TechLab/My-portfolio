/* ================================================================
   Admin – Content Editor
   Load / edit / save portfolio data via localStorage
   ================================================================ */

// ──────────────────────────────────────────────
// DEFAULTS (mirrors script.js)
// ──────────────────────────────────────────────
const defaultData = {
  projects: [
    { title: "E-Commerce Platform", description: "Full-featured online store with payment processing, inventory management, and real-time order tracking.", tech: ["React", "Node.js", "PostgreSQL", "Stripe"], link: "#" },
    { title: "Task Management Dashboard", description: "Kanban-style project management tool with drag-and-drop, team collaboration, and analytics.", tech: ["Next.js", "TypeScript", "Prisma", "Socket.io"], link: "#" },
    { title: "Real-Time Chat App", description: "Messaging platform with rooms, file sharing, typing indicators, and message history.", tech: ["React", "Express", "WebSocket", "MongoDB"], link: "#" }
  ],
  skills: [
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Express", "Python", "Django"] },
    { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma"] },
    { category: "DevOps", items: ["Docker", "CI/CD", "AWS", "Linux"] }
  ],
  about: "I'm a full-stack developer passionate about building clean, performant web applications. I focus on creating intuitive user experiences with modern technologies and clean architecture.\n\nWhen I'm not coding, I enjoy contributing to open-source projects, writing technical articles, and exploring new technologies.",
  experience: [
    { role: "Senior Developer", company: "Tech Co", period: "2023 - Present", description: "Leading frontend architecture, mentoring junior developers, and driving technical decisions across the engineering team." },
    { role: "Full-Stack Developer", company: "Digital Agency", period: "2021 - 2023", description: "Built and maintained client-facing web applications using React, Node.js, and cloud infrastructure." },
    { role: "Junior Developer", company: "Startup Inc", period: "2019 - 2021", description: "Developed and shipped features for a SaaS platform, working across the full stack." }
  ],
  blog: [
    { title: "Building with Next.js", excerpt: "A deep dive into the App Router, server components, and the modern React ecosystem.", date: "2026-03-15" },
    { title: "TypeScript Best Practices", excerpt: "Patterns and tips for writing cleaner, more maintainable TypeScript code.", date: "2026-02-20" },
    { title: "CSS Grid Layout Guide", excerpt: "Mastering modern CSS layouts with grid, subgrid, and container queries.", date: "2026-01-10" }
  ],
  wiki: [
    { title: "System Design", content: "Notes on distributed systems, scalability patterns, and architecture decisions for building robust applications." },
    { title: "DevOps Cheatsheet", content: "Common commands and configurations for Docker, CI/CD pipelines, cloud deployment, and infrastructure as code." },
    { title: "Algorithm Patterns", content: "Common algorithmic patterns: sliding window, two pointers, dynamic programming, and graph traversal techniques." }
  ],
  uses: [
    { category: "Hardware", items: ["MacBook Pro M3", "LG UltraFine Monitor", "Mechanical Keyboard", "Logitech MX Master"] },
    { category: "Software", items: ["VS Code", "iTerm2", "Figma", "Arc Browser"] },
    { category: "Desk", items: ["Standing Desk", "Herman Miller Chair", "Desk Lamp", "Notebook"] }
  ],
  resume: {
    summary: "Full-stack developer with 6+ years of experience building web applications. Passionate about clean code, user experience, and continuous learning.",
    education: ["B.Sc. Computer Science", "Full-Stack Web Development Bootcamp"],
    certifications: ["AWS Certified Developer", "Meta Front-End Developer"]
  },
  contact: {
    email: "hello@danielmohie.dev",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/"
  }
};

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let data = {};
let currentTab = 'projects';

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function loadData() {
  const saved = localStorage.getItem('portfolioData');
  if (saved) {
    try {
      data = JSON.parse(saved);
      return;
    } catch (_) {}
  }
  data = JSON.parse(JSON.stringify(defaultData));
}

function saveData() {
  localStorage.setItem('portfolioData', JSON.stringify(data));
  const msg = $('#saved-msg');
  msg.textContent = 'saved!';
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 2000);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ──────────────────────────────────────────────
// TAB SYSTEM
// ──────────────────────────────────────────────
const tabs = [
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'blog', label: 'blog' },
  { id: 'wiki', label: 'wiki' },
  { id: 'uses', label: 'uses' },
  { id: 'resume', label: 'resume' },
  { id: 'contact', label: 'contact' }
];

function renderTabs() {
  const container = $('#admin-tabs');
  container.innerHTML = tabs.map(t =>
    `<button class="tab-btn${t.id === currentTab ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('');
}

function switchTab(id) {
  currentTab = id;
  renderTabs();
  renderForm(id);
}

// ──────────────────────────────────────────────
// FORM RENDERERS
// ──────────────────────────────────────────────

function htmlForProject(i, item) {
  return `
    <div class="repeat-item" data-index="${i}">
      <div class="repeat-header">
        <span class="repeat-label">project ${i + 1}</span>
        <button class="btn-remove" data-action="remove-project" data-index="${i}">remove</button>
      </div>
      <div class="field-row">
        <div class="form-group">
          <label class="form-label">title</label>
          <input class="form-input" data-field="title" value="${escHtml(item.title)}">
        </div>
        <div class="form-group">
          <label class="form-label">link</label>
          <input class="form-input" data-field="link" value="${escHtml(item.link)}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">description</label>
        <textarea class="form-textarea" data-field="description" style="min-height:60px">${escHtml(item.description)}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">tech stack (comma-separated)</label>
        <input class="form-input" data-field="tech" value="${escHtml((item.tech || []).join(', '))}">
      </div>
    </div>`;
}

function htmlForSkillCategory(i, item) {
  return `
    <div class="repeat-item" data-index="${i}">
      <div class="repeat-header">
        <span class="repeat-label">category ${i + 1}</span>
        <button class="btn-remove" data-action="remove-skill" data-index="${i}">remove</button>
      </div>
      <div class="field-row">
        <div class="form-group">
          <label class="form-label">category name</label>
          <input class="form-input" data-field="category" value="${escHtml(item.category)}">
        </div>
        <div class="form-group">
          <label class="form-label">skills (comma-separated)</label>
          <input class="form-input" data-field="items" value="${escHtml((item.items || []).join(', '))}">
        </div>
      </div>
    </div>`;
}

function htmlForExperience(i, item) {
  return `
    <div class="repeat-item" data-index="${i}">
      <div class="repeat-header">
        <span class="repeat-label">position ${i + 1}</span>
        <button class="btn-remove" data-action="remove-experience" data-index="${i}">remove</button>
      </div>
      <div class="field-row field-row-3">
        <div class="form-group">
          <label class="form-label">role</label>
          <input class="form-input" data-field="role" value="${escHtml(item.role)}">
        </div>
        <div class="form-group">
          <label class="form-label">company</label>
          <input class="form-input" data-field="company" value="${escHtml(item.company)}">
        </div>
        <div class="form-group">
          <label class="form-label">period</label>
          <input class="form-input" data-field="period" value="${escHtml(item.period)}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">description</label>
        <textarea class="form-textarea" data-field="description" style="min-height:60px">${escHtml(item.description)}</textarea>
      </div>
    </div>`;
}

function htmlForBlog(i, item) {
  return `
    <div class="repeat-item" data-index="${i}">
      <div class="repeat-header">
        <span class="repeat-label">post ${i + 1}</span>
        <button class="btn-remove" data-action="remove-blog" data-index="${i}">remove</button>
      </div>
      <div class="field-row">
        <div class="form-group">
          <label class="form-label">title</label>
          <input class="form-input" data-field="title" value="${escHtml(item.title)}">
        </div>
        <div class="form-group">
          <label class="form-label">date</label>
          <input class="form-input" data-field="date" value="${escHtml(item.date)}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">excerpt</label>
        <textarea class="form-textarea" data-field="excerpt" style="min-height:60px">${escHtml(item.excerpt)}</textarea>
      </div>
    </div>`;
}

function htmlForWiki(i, item) {
  return `
    <div class="repeat-item" data-index="${i}">
      <div class="repeat-header">
        <span class="repeat-label">entry ${i + 1}</span>
        <button class="btn-remove" data-action="remove-wiki" data-index="${i}">remove</button>
      </div>
      <div class="form-group">
        <label class="form-label">title</label>
        <input class="form-input" data-field="title" value="${escHtml(item.title)}">
      </div>
      <div class="form-group">
        <label class="form-label">content</label>
        <textarea class="form-textarea" data-field="content">${escHtml(item.content)}</textarea>
      </div>
    </div>`;
}

function htmlForUsesCategory(i, item) {
  // Same structure as skills
  return htmlForSkillCategory(i, item);
}

// ──────────────────────────────────────────────
function renderForm(tabId) {
  const container = $('#admin-content');

  switch (tabId) {
    // ─── PROJECTS ───
    case 'projects': {
      const items = data.projects || [];
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit projects</h2>
        <div class="repeat-group" id="repeat-projects">
          ${items.map((item, i) => htmlForProject(i, item)).join('')}
        </div>
        <button class="btn-add" data-action="add-project">+ add project</button>
      `;
      break;
    }

    // ─── SKILLS ───
    case 'skills': {
      const items = data.skills || [];
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit skills</h2>
        <div class="repeat-group" id="repeat-skills">
          ${items.map((item, i) => htmlForSkillCategory(i, item)).join('')}
        </div>
        <button class="btn-add" data-action="add-skill">+ add category</button>
      `;
      break;
    }

    // ─── ABOUT ───
    case 'about': {
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit about</h2>
        <div class="form-group">
          <label class="form-label">about text</label>
          <textarea class="form-textarea" id="field-about">${escHtml(data.about || '')}</textarea>
        </div>
        <p style="font-size:9px;color:var(--text-dim);margin-top:-10px;">use blank lines for paragraph breaks</p>
      `;
      break;
    }

    // ─── EXPERIENCE ───
    case 'experience': {
      const items = data.experience || [];
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit experience</h2>
        <div class="repeat-group" id="repeat-experience">
          ${items.map((item, i) => htmlForExperience(i, item)).join('')}
        </div>
        <button class="btn-add" data-action="add-experience">+ add position</button>
      `;
      break;
    }

    // ─── BLOG ───
    case 'blog': {
      const items = data.blog || [];
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit blog posts</h2>
        <div class="repeat-group" id="repeat-blog">
          ${items.map((item, i) => htmlForBlog(i, item)).join('')}
        </div>
        <button class="btn-add" data-action="add-blog">+ add post</button>
      `;
      break;
    }

    // ─── WIKI ───
    case 'wiki': {
      const items = data.wiki || [];
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit wiki entries</h2>
        <div class="repeat-group" id="repeat-wiki">
          ${items.map((item, i) => htmlForWiki(i, item)).join('')}
        </div>
        <button class="btn-add" data-action="add-wiki">+ add entry</button>
      `;
      break;
    }

    // ─── USES ───
    case 'uses': {
      const items = data.uses || [];
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit uses</h2>
        <div class="repeat-group" id="repeat-uses">
          ${items.map((item, i) => htmlForUsesCategory(i, item)).join('')}
        </div>
        <button class="btn-add" data-action="add-uses">+ add category</button>
      `;
      break;
    }

    // ─── RESUME ───
    case 'resume': {
      const r = data.resume || {};
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit resume</h2>
        <div class="form-group">
          <label class="form-label">summary</label>
          <textarea class="form-textarea" id="field-resume-summary">${escHtml(r.summary || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">education (comma-separated)</label>
          <input class="form-input" id="field-resume-education" value="${escHtml((r.education || []).join(', '))}">
        </div>
        <div class="form-group">
          <label class="form-label">certifications (comma-separated)</label>
          <input class="form-input" id="field-resume-certifications" value="${escHtml((r.certifications || []).join(', '))}">
        </div>
      `;
      break;
    }

    // ─── CONTACT ───
    case 'contact': {
      const c = data.contact || {};
      container.innerHTML = `
        <h2 class="form-section-title" style="font-size:13px;font-weight:600;color:var(--white);text-transform:lowercase;margin-bottom:18px;">edit contact</h2>
        <div class="form-group">
          <label class="form-label">email</label>
          <input class="form-input" id="field-contact-email" value="${escHtml(c.email || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">github url</label>
          <input class="form-input" id="field-contact-github" value="${escHtml(c.github || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">linkedin url</label>
          <input class="form-input" id="field-contact-linkedin" value="${escHtml(c.linkedin || '')}">
        </div>
      `;
      break;
    }
  }

  bindFormEvents();
}

// ──────────────────────────────────────────────
// FORM EVENT BINDING
// ──────────────────────────────────────────────
function bindFormEvents() {
  // Tab switching
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Add item buttons
  $$('[data-action^="add-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      addItem(action.replace('add-', ''));
    });
  });

  // Remove item buttons
  $$('[data-action^="remove-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const idx = parseInt(btn.dataset.index, 10);
      removeItem(action.replace('remove-', ''), idx);
    });
  });
}

// ──────────────────────────────────────────────
// ADD / REMOVE ITEMS
// ──────────────────────────────────────────────
function addItem(type) {
  const empty = {
    project: { title: '', description: '', tech: [], link: '' },
    skill: { category: '', items: [] },
    experience: { role: '', company: '', period: '', description: '' },
    blog: { title: '', excerpt: '', date: '' },
    wiki: { title: '', content: '' },
    uses: { category: '', items: [] }
  };

  if (!data[type]) data[type] = [];
  data[type].push(empty[type] || {});
  renderForm(currentTab);
}

function removeItem(type, index) {
  if (!data[type]) return;
  data[type].splice(index, 1);
  renderForm(currentTab);
}

// ──────────────────────────────────────────────
// COLLECT FORM DATA
// ──────────────────────────────────────────────
function collectData() {
  // ── Projects ──
  if (data.projects) {
    const items = $('#repeat-projects');
    if (items) {
      data.projects = Array.from(items.querySelectorAll('.repeat-item')).map(el => ({
        title: el.querySelector('[data-field="title"]')?.value || '',
        description: el.querySelector('[data-field="description"]')?.value || '',
        tech: (el.querySelector('[data-field="tech"]')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
        link: el.querySelector('[data-field="link"]')?.value || ''
      }));
    }
  }

  // ── Skills ──
  if (data.skills) {
    const items = $('#repeat-skills');
    if (items) {
      data.skills = Array.from(items.querySelectorAll('.repeat-item')).map(el => ({
        category: el.querySelector('[data-field="category"]')?.value || '',
        items: (el.querySelector('[data-field="items"]')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
      }));
    }
  }

  // ── About ──
  const aboutField = $('#field-about');
  if (aboutField) data.about = aboutField.value;

  // ── Experience ──
  if (data.experience) {
    const items = $('#repeat-experience');
    if (items) {
      data.experience = Array.from(items.querySelectorAll('.repeat-item')).map(el => ({
        role: el.querySelector('[data-field="role"]')?.value || '',
        company: el.querySelector('[data-field="company"]')?.value || '',
        period: el.querySelector('[data-field="period"]')?.value || '',
        description: el.querySelector('[data-field="description"]')?.value || ''
      }));
    }
  }

  // ── Blog ──
  if (data.blog) {
    const items = $('#repeat-blog');
    if (items) {
      data.blog = Array.from(items.querySelectorAll('.repeat-item')).map(el => ({
        title: el.querySelector('[data-field="title"]')?.value || '',
        excerpt: el.querySelector('[data-field="excerpt"]')?.value || '',
        date: el.querySelector('[data-field="date"]')?.value || ''
      }));
    }
  }

  // ── Wiki ──
  if (data.wiki) {
    const items = $('#repeat-wiki');
    if (items) {
      data.wiki = Array.from(items.querySelectorAll('.repeat-item')).map(el => ({
        title: el.querySelector('[data-field="title"]')?.value || '',
        content: el.querySelector('[data-field="content"]')?.value || ''
      }));
    }
  }

  // ── Uses ──
  if (data.uses) {
    const items = $('#repeat-uses');
    if (items) {
      data.uses = Array.from(items.querySelectorAll('.repeat-item')).map(el => ({
        category: el.querySelector('[data-field="category"]')?.value || '',
        items: (el.querySelector('[data-field="items"]')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
      }));
    }
  }

  // ── Resume ──
  const resumeSummary = $('#field-resume-summary');
  const resumeEdu = $('#field-resume-education');
  const resumeCerts = $('#field-resume-certifications');
  if (resumeSummary || resumeEdu || resumeCerts) {
    data.resume = {
      summary: resumeSummary?.value || '',
      education: (resumeEdu?.value || '').split(',').map(s => s.trim()).filter(Boolean),
      certifications: (resumeCerts?.value || '').split(',').map(s => s.trim()).filter(Boolean)
    };
  }

  // ── Contact ──
  const contactEmail = $('#field-contact-email');
  const contactGh = $('#field-contact-github');
  const contactLi = $('#field-contact-linkedin');
  if (contactEmail || contactGh || contactLi) {
    data.contact = {
      email: contactEmail?.value || '',
      github: contactGh?.value || '',
      linkedin: contactLi?.value || ''
    };
  }
}

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderTabs();
  renderForm(currentTab);

  // Save button
  $('#btn-save').addEventListener('click', () => {
    collectData();
    saveData();
  });

  // Reset button
  $('#btn-reset').addEventListener('click', () => {
    if (confirm('reset all content to defaults? this cannot be undone.')) {
      data = JSON.parse(JSON.stringify(defaultData));
      saveData();
      renderForm(currentTab);
    }
  });
});
