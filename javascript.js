/* ==========================================================================
   GLOBAL UTILITIES (Scroll Indicator)
   ========================================================================== */
window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const scrollBar = document.getElementById("scrollBar");
    if (scrollBar) {
        scrollBar.style.width = scrolled + "%";
    }
};

/* ==========================================================================
   INDEX PAGE - WELCOME POPUP
   ========================================================================== */
(function() {
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.endsWith('index.html') || currentPage.endsWith('/');

    if (!isIndexPage) return;

    const style = document.createElement('style');
    style.textContent = `
        .welcome-popup-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); display: flex;
            justify-content: center; align-items: center; z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        .welcome-popup {
            background: white; padding: 30px 40px; border-radius: 15px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3); text-align: center;
            max-width: 400px; animation: slideDown 0.4s ease;
        }
        .welcome-popup h2 { color: #667eea; font-size: 28px; margin-bottom: 15px; }
        .welcome-popup button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; padding: 12px 30px; border-radius: 25px;
            cursor: pointer; transition: transform 0.2s ease;
        }
        .welcome-popup button:hover { transform: scale(1.05); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .hidden { display: none !important; }
    `;
    document.head.appendChild(style);

    const popupHTML = `
        <div class="welcome-popup-overlay" id="welcomePopup">
            <div class="welcome-popup">
                <h2>🎉 Welcome To My Website</h2>
                <p>Thank you for visiting! Enjoy exploring my portfolio.</p>
                <button id="closeWelcomePopup">Get Started</button>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        const popup = document.getElementById('welcomePopup');
        const closeBtn = document.getElementById('closeWelcomePopup');

        closeBtn.onclick = () => popup.classList.add('hidden');
        popup.onclick = (e) => { if (e.target === popup) popup.classList.add('hidden'); };
    });
})();

/* ==========================================================================
   EXPERIENCE PAGE FUNCTIONS
   ========================================================================== */
function highlightRow(row) {
    document.querySelectorAll('tr').forEach(r => r.style.backgroundColor = '');
    row.style.backgroundColor = '#cce7ff';
}

function filterExperience(category) {
    const items = document.querySelectorAll('.exp-item');
    const buttons = document.querySelectorAll('.filter-btn');
    let count = 0;

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            count++;
        } else {
            item.style.display = 'none';
        }
    });

    document.getElementById('projectCount').textContent =
        category === 'all' ? 'Total Experience: 3' : 'Showing: ' + count + ' item(s)';
}

function showSkillInfo(skill) {
    const info = document.getElementById('skillInfo');
    const title = document.getElementById('skillTitle');
    const desc = document.getElementById('skillDescription');

    const skillData = {
        'HTML & CSS': 'Building and styling modern, responsive web pages with clean code structure.',
        'Microsoft Office': 'Proficient in Word, Excel, and PowerPoint for documentation and data management.',
        'Canva': 'Creating professional designs, presentations, and marketing materials.',
        'Records': 'Organizing and managing electronic records following proper information management standards.',
        'Team': 'Collaborating effectively with team members on various projects and presentations.'
    };

    title.textContent = skill;
    desc.textContent = skillData[skill] || 'Information about this skill.';
    info.style.display = 'block';
    info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ==========================================================================
   SKILLS PAGE FUNCTIONS
   ========================================================================== */
const skillsData = {
    html: { title: 'HTML & CSS', percentage: 85, description: 'Strong foundation in HTML5 and CSS3.', points: ['Semantic structure', 'Flexbox/Grid', 'Responsive design'] },
    js: { title: 'Basic JavaScript', percentage: 65, description: 'Understanding fundamentals and DOM.', points: ['Events', 'DOM Manipulation', 'ES6 Logic'] },
    git: { title: 'Git & GitHub', percentage: 75, description: 'Proficient in version control.', points: ['Commands', 'Repo Management', 'Collaboration'] },
    debug: { title: 'Debugging', percentage: 70, description: 'Efficient issue identification.', points: ['DevTools', 'Error Fixing', 'Testing'] }
};

let isSkillLocked = false;
let currentLockedSkill = null;

function animateSkills() {
    Object.keys(skillsData).forEach(skill => {
        const bar = document.getElementById(skill + '-bar');
        const percent = document.getElementById(skill + '-percent');
        if (bar && percent) {
            bar.style.width = skillsData[skill].percentage + '%';
            animatePercentage(percent, 0, skillsData[skill].percentage, 1500);
        }
    });
    animateCircularProgress();
}

function animatePercentage(element, start, end, duration) {
    let startTime = null;
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start) + '%';
        if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

function resetSkills() {
    isSkillLocked = false;
    currentLockedSkill = null;
    Object.keys(skillsData).forEach(skill => {
        const bar = document.getElementById(skill + '-bar');
        const percent = document.getElementById(skill + '-percent');
        if (bar && percent) { bar.style.width = '0%'; percent.textContent = '0%'; }
    });
    document.getElementById('detailTitle').textContent = 'Hover over a skill';
    document.getElementById('detailList').innerHTML = '';
}

function showSkillDetail(skill) {
    if (isSkillLocked) return;
    const data = skillsData[skill];
    document.getElementById('detailTitle').textContent = data.title + ' - ' + data.percentage + '%';
    document.getElementById('detailDescription').textContent = data.description;
    const list = document.getElementById('detailList');
    list.innerHTML = '';
    data.points.forEach(pt => { const li = document.createElement('li'); li.textContent = pt; list.appendChild(li); });
}

function lockSkill(skill) {
    if (currentLockedSkill === skill) {
        resetSkills();
    } else {
        isSkillLocked = true;
        currentLockedSkill = skill;
        showSkillDetail(skill);
    }
}

function animateCircularProgress() {
    const circles = [{ id: 'circle-html', p: 85 }, { id: 'circle-js', p: 65 }, { id: 'circle-git', p: 75 }, { id: 'circle-debug', p: 70 }];
    circles.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) {
            const circumference = 2 * Math.PI * 50;
            el.style.strokeDashoffset = circumference - (c.p / 100) * circumference;
        }
    });
}

/* ==========================================================================
   CONTACT PAGE FUNCTIONS
   ========================================================================== */
function updateCounter() {
    const textarea = document.getElementById('subject');
    const counter = document.getElementById('charCounter');
    if (textarea && counter) {
        counter.textContent = `${textarea.value.length} / 500 characters`;
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document.getElementById('nameError').textContent = name === '' ? 'Please enter your name' : '';
    document.getElementById('emailError').textContent = !emailPattern.test(email) ? 'Please enter a valid email' : '';

    if (name !== '' && emailPattern.test(email)) {
        document.getElementById('contactForm').style.display = 'none';
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        successMessage.innerHTML = `&#10004; Thank You! Message sent successfully, ${name}!`;
        
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            document.getElementById('contactForm').style.display = 'block';
            successMessage.style.display = 'none';
            updateCounter();
        }, 5000);
    }
    return false;
}

/* ==========================================================================
   ABOUT ME PAGE - MUSIC PLAYER
   ========================================================================== */
var isPlaying = false;
function togglePlay() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const albumArt = document.getElementById('albumArt');
    if (!audio) return;

    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '&#9654;&#65039;';
        albumArt.style.animation = 'none';
    } else {
        audio.play();
        playBtn.innerHTML = '&#9208;';
        albumArt.style.animation = 'rotate 3s linear infinite';
    }
    isPlaying = !isPlaying;
}

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
	
	
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    updateCounter();
    const audio = document.getElementById('audioPlayer');
    if (audio) {
        audio.ontimeupdate = function() {
            const progress = document.getElementById('progressBar');
            if (progress) progress.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
            document.getElementById('duration').textContent = formatTime(audio.duration);
        };
    }
    if (document.getElementById('html-bar')) setTimeout(animateSkills, 500);
});

