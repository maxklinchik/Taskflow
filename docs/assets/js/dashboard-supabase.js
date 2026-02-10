// Load user data
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in with Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        // Redirect to login if not logged in
        window.location.href = '../index.html';
        return;
    }
    
    // Display user name
    const userName = user.user_metadata.name || user.email.split('@')[0];
    document.getElementById('userName').textContent = userName;
    
    // Load saved data
    loadTasks();
    loadEvents();
    
    // Event listeners
    setupEventListeners();
    
    // Load view preference
    loadViewPreference();
    
    // Setup logout listener
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
            await supabase.auth.signOut();
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

async function submitHomework() {
    const className = document.getElementById('homeworkClass').value;
    const title = document.getElementById('homeworkTitle').value;
    const dueDate = document.getElementById('homeworkDueDate').value;
    const type = document.querySelector('input[name="homeworkType"]:checked').value;
    const notes = document.getElementById('homeworkNotes').value;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { data, error } = await supabase
            .from('homework')
            .insert([{
                user_id: user.id,
                class: className,
                title: title,
                due_date: dueDate,
                type: type,
                notes: notes,
                completed: false
            }]);
        
        if (error) throw error;
        
        // Close modal and reload
        closeHomeworkModal();
        loadClassView();
        loadListView();
    } catch (error) {
        alert('Error adding homework: ' + error.message);
    }
}

// Load class view with all class cards
const CLASSES = ['Physics', 'Computer Science', 'Math', 'English', 'Chemistry', 'Gym/Health', 'History'];

async function loadClassView() {
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { data: allHomework, error } = await supabase
            .from('homework')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', false)
            .order('due_date', { ascending: true });
        
        if (error) throw error;
        
        const container = document.getElementById('homeworkGrid');
        
        container.innerHTML = CLASSES.map(className => {
            const classHomework = allHomework.filter(hw => hw.class === className);
            
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
                                const date = new Date(hw.due_date);
                                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                
                                return `
                                    <div class="homework-item">
                                        <input type="checkbox" id="hw-class-${hw.id}" onchange="toggleHomework('${hw.id}', true)">
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
    } catch (error) {
        console.error('Error loading homework:', error);
    }
}

// Load homework for specific class (legacy, now using loadClassView)
function loadHomeworkForClass(className) {
    loadClassView();
}

// Load list view
async function loadListView() {
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { data: activeHomework, error } = await supabase
            .from('homework')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', false)
            .order('due_date', { ascending: true });
        
        if (error) throw error;
        
        const container = document.getElementById('homeworkListView');
        
        if (activeHomework.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No homework yet. Click "+ Add Homework" to get started!</p></div>';
            return;
        }
        
        container.innerHTML = activeHomework.map(hw => {
            const date = new Date(hw.due_date);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return `
                <div class="list-item" data-due="${hw.due_date}" data-class="${hw.class}">
                    <div class="list-checkbox">
                        <input type="checkbox" id="hw-list-${hw.id}" onchange="toggleHomework('${hw.id}', true)">
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
    } catch (error) {
        console.error('Error loading list view:', error);
    }
}

function getTypeIcon(type) {
    switch(type) {
        case 'test': return '📄';
        case 'project': return '📊';
        default: return '📝';
    }
}

// Toggle homework completion
async function toggleHomework(id, completed) {
    try {
        const { error } = await supabase
            .from('homework')
            .update({ completed })
            .eq('id', id);
        
        if (error) throw error;
        
        // Reload views
        setTimeout(() => {
            loadClassView();
            loadListView();
        }, 300);
    } catch (error) {
        console.error('Error toggling homework:', error);
    }
}

// Homework functions
function loadHomework() {
    // Legacy function - now handled by loadClassView and loadListView
}

function addHomework(className, title, dueDate) {
    // Legacy function - now handled by submitHomework
}

// Task functions
function loadTasks() {
    // Keep using localStorage for tasks for now, or migrate to Supabase later
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
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
    // Keep using localStorage for events for now, or migrate to Supabase later
    const events = JSON.parse(localStorage.getItem('events') || '[]');
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
