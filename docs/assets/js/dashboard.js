// Load user data
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = '../index.html';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = currentUser.name;
    
    // Initialize homework data if not exists
    if (!localStorage.getItem('homeworkData')) {
        localStorage.setItem('homeworkData', JSON.stringify([]));
    }
    
    // Load saved data
    loadTasks();
    loadEvents();
    
    // Event listeners
    setupEventListeners();
    
    // Load view preference
    loadViewPreference();
    
    // Setup logout listener
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = '../index.html';
        }
    });
});

// Setup event listeners
function setupEventListeners() {
    // View toggle
    document.getElementById('classViewBtn').addEventListener('click', () => {
        switchView('class');
    });
    
    document.getElementById('listViewBtn').addEventListener('click', () => {
        switchView('list');
    });
    
    // Add homework button - open modal
    document.getElementById('addHomeworkBtn').addEventListener('click', () => {
        openHomeworkModal();
    });
    
    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeHomeworkModal);
    document.getElementById('cancelBtn').addEventListener('click', closeHomeworkModal);
    
    // Close modal on overlay click
    document.getElementById('homeworkModal').addEventListener('click', (e) => {
        if (e.target.id === 'homeworkModal') {
            closeHomeworkModal();
        }
    });
    
    // Homework form submission
    document.getElementById('homeworkForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitHomework();
    });
    
    // Add task button
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const title = prompt('Enter task title:');
        if (!title) return;
        
        const date = prompt('Enter date (e.g., Feb 10):');
        if (!date) return;
        
        addTask(title, date);
    });
    
    // Add event button
    document.getElementById('addEventBtn').addEventListener('click', () => {
        const title = prompt('Enter event title:');
        if (!title) return;
        
        const date = prompt('Enter date (day, e.g., 15):');
        if (!date) return;
        
        const month = prompt('Enter month (e.g., Feb):');
        if (!month) return;
        
        const time = prompt('Enter time (e.g., 2:00 PM):');
        if (!time) return;
        
        addEvent(title, date, month, time);
    });
}

// View switching
function switchView(view) {
    const classViewBtn = document.getElementById('classViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const homeworkGrid = document.getElementById('homeworkGrid');
    const homeworkListView = document.getElementById('homeworkListView');
    const homeworkTitle = document.getElementById('homeworkTitle');
    
    if (view === 'class') {
        // Switch to class view
        classViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        homeworkGrid.classList.remove('hidden');
        homeworkListView.classList.add('hidden');
        homeworkTitle.textContent = 'Homework by Class';
        localStorage.setItem('homeworkView', 'class');
        loadClassView();
    } else {
        // Switch to list view
        listViewBtn.classList.add('active');
        classViewBtn.classList.remove('active');
        homeworkGrid.classList.add('hidden');
        homeworkListView.classList.remove('hidden');
        homeworkTitle.textContent = 'Homework by Due Date';
        localStorage.setItem('homeworkView', 'list');
        loadListView();
    }
}

// Load saved view preference
function loadViewPreference() {
    const savedView = localStorage.getItem('homeworkView') || 'class';
    switchView(savedView);
}

// Modal functions
function openHomeworkModal() {
    const modal = document.getElementById('homeworkModal');
    modal.classList.add('active');
}

function closeHomeworkModal() {
    const modal = document.getElementById('homeworkModal');
    modal.classList.remove('active');
    document.getElementById('homeworkForm').reset();
}

function submitHomework() {
    const className = document.getElementById('homeworkClass').value;
    const title = document.getElementById('homeworkTitle').value;
    const dueDate = document.getElementById('homeworkDueDate').value;
    const type = document.querySelector('input[name="homeworkType"]:checked').value;
    const notes = document.getElementById('homeworkNotes').value;
    
    // Create homework object
    const homework = {
        id: Date.now(),
        class: className,
        title: title,
        dueDate: dueDate,
        type: type,
        notes: notes,
        completed: false
    };
    
    // Get existing homework
    const allHomework = JSON.parse(localStorage.getItem('homeworkData') || '[]');
    allHomework.push(homework);
    localStorage.setItem('homeworkData', JSON.stringify(allHomework));
    
    // Close modal and reload
    closeHomeworkModal();
    loadClassView();
    loadListView();
}

// Load class view with all class cards
const CLASSES = ['Physics', 'Computer Science', 'Math', 'English', 'Chemistry', 'Gym/Health', 'History'];

function loadClassView() {
    const allHomework = JSON.parse(localStorage.getItem('homeworkData') || '[]');
    const container = document.getElementById('homeworkGrid');
    
    container.innerHTML = CLASSES.map(className => {
        const classHomework = allHomework.filter(hw => hw.class === className && !hw.completed);
        
        // Sort by due date
        classHomework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        return `
            <div class="homework-card">
                <div class="card-header">
                    <h3 class="class-name">${className}</h3>
                    <span class="item-count">${classHomework.length} item${classHomework.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="homework-list">
                    ${classHomework.length === 0 ? 
                        '<div class="empty-class-card">No assignments yet</div>' :
                        classHomework.map(hw => {
                            const date = new Date(hw.dueDate);
                            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            
                            return `
                                <div class="homework-item">
                                    <input type="checkbox" id="hw-class-${hw.id}" onchange="toggleHomework(${hw.id})">
                                    <label for="hw-class-${hw.id}">
                                        <span class="hw-title">${hw.title}</span>
                                        <div class="hw-meta">
                                            <span class="hw-type ${hw.type}">${getTypeIcon(hw.type)} ${hw.type}</span>
                                            <span class="hw-due">Due: ${formattedDate}</span>
                                        </div>
                                        ${hw.notes ? `<span class="hw-notes">${hw.notes}</span>` : ''}
                                    </label>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Load homework for specific class (legacy, now using loadClassView)
function loadHomeworkForClass(className) {
    loadClassView();
}

// Load list view
function loadListView() {
    const allHomework = JSON.parse(localStorage.getItem('homeworkData') || '[]');
    const activeHomework = allHomework.filter(hw => !hw.completed);
    
    // Sort by due date
    activeHomework.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    const container = document.getElementById('homeworkListView');
    
    if (activeHomework.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No homework yet. Click "+ Add Homework" to get started!</p></div>';
        return;
    }
    
    container.innerHTML = activeHomework.map(hw => {
        const date = new Date(hw.dueDate);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
            <div class="list-item" data-due="${hw.dueDate}" data-class="${hw.class}">
                <div class="list-checkbox">
                    <input type="checkbox" id="hw-list-${hw.id}" onchange="toggleHomework(${hw.id})">
                </div>
                <div class="list-content">
                    <h4 class="list-title">${hw.title}</h4>
                    <div class="list-meta">
                        <span class="list-class">${hw.class}</span>
                        <span class="list-due">Due: ${formattedDate}</span>
                        <span class="homework-type ${hw.type}">${getTypeIcon(hw.type)} ${hw.type}</span>
                    </div>
                    ${hw.notes ? `<p class="homework-notes">${hw.notes}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getTypeIcon(type) {
    switch(type) {
        case 'test': return '';
        case 'project': return '';
        default: return '';
    }
}

// Toggle homework completion
function toggleHomework(id) {
    const allHomework = JSON.parse(localStorage.getItem('homeworkData') || '[]');
    const homework = allHomework.find(hw => hw.id === id);
    
    if (homework) {
        homework.completed = !homework.completed;
        localStorage.setItem('homeworkData', JSON.stringify(allHomework));
        
        // Reload views
        setTimeout(() => {
            loadHomeworkForClass(currentClass);
            loadListView();
        }, 300);
    }
}

// Homework functions
// Homework functions
function loadHomework() {
    // Legacy function - now handled by loadHomeworkForClass and loadListView
}

function addHomework(className, title, dueDate) {
    // Legacy function - now handled by submitHomework
}

// Task functions
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    // Tasks are already rendered in HTML for demo
}

function addTask(title, date) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push({
        id: Date.now(),
        title: title,
        date: date,
        completed: false
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    alert('Task added! (Refresh to see changes)');
    location.reload();
}

// Event functions
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    // Events are already rendered in HTML for demo
}

function addEvent(title, day, month, time) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push({
        id: Date.now(),
        title: title,
        day: day,
        month: month,
        time: time
    });
    localStorage.setItem('events', JSON.stringify(events));
    
    alert('Event added! (Refresh to see changes)');
    location.reload();
}

// Save checkbox states
document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        // Save state to localStorage
        const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
        checkboxStates[e.target.id] = e.target.checked;
        localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
    }
});

// Restore checkbox states on load
window.addEventListener('load', () => {
    const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
    Object.keys(checkboxStates).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checkboxStates[id];
        }
    });
});
