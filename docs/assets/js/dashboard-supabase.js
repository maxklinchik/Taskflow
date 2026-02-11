// Load user data
document.addEventListener('DOMContentLoaded', async () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
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
    
    // Add task button - open modal
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        openTaskModal();
    });
    
    // Task modal close buttons
    document.getElementById('closeTaskModal').addEventListener('click', closeTaskModal);
    document.getElementById('cancelTaskBtn').addEventListener('click', closeTaskModal);
    
    // Close task modal on overlay click
    document.getElementById('taskModal').addEventListener('click', (e) => {
        if (e.target.id === 'taskModal') {
            closeTaskModal();
        }
    });
    
    // Task form submission
    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitTask();
    });
    
    // Add event button - open modal
    document.getElementById('addEventBtn').addEventListener('click', () => {
        openEventModal();
    });
    
    // Event modal close buttons
    document.getElementById('closeEventModal').addEventListener('click', closeEventModal);
    document.getElementById('cancelEventBtn').addEventListener('click', closeEventModal);
    
    // Close event modal on overlay click
    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target.id === 'eventModal') {
            closeEventModal();
        }
    });
    
    // Event form submission
    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitEvent();
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

// Task Modal functions
function openTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.add('active');
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('active');
    document.getElementById('taskForm').reset();
}

async function submitTask() {
    const title = document.getElementById('taskTitle').value;
    const date = document.getElementById('taskDate').value;
    const notes = document.getElementById('taskNotes').value;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { error } = await supabase
            .from('tasks')
            .insert([{
                user_id: user.id,
                title: title,
                date: date,
                notes: notes,
                completed: false
            }]);
        
        if (error) throw error;
        
        // Close modal and reload
        closeTaskModal();
        loadTasks();
    } catch (error) {
        alert('Error adding task: ' + error.message);
    }
}

// Event Modal functions
function openEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.add('active');
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
    document.getElementById('eventForm').reset();
}

async function submitEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const timeInput = document.getElementById('eventTime').value;
    
    // Convert 24-hour time to 12-hour with AM/PM if time is provided
    let time = null;
    if (timeInput) {
        const [hours, minutes] = timeInput.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        time = `${displayHour}:${minutes} ${ampm}`;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { error } = await supabase
            .from('events')
            .insert([{
                user_id: user.id,
                title: title,
                date: date,
                time: time
            }]);
        
        if (error) throw error;
        
        // Close modal and reload
        closeEventModal();
        loadEvents();
    } catch (error) {
        alert('Error adding event: ' + error.message);
    }
}

async function submitHomework() {
    const className = document.getElementById('homeworkClass').value;
    const title = document.getElementById('homeworkTitleInput').value;
    const dueDate = document.getElementById('homeworkDueDate').value;
    const type = document.querySelector('input[name="homeworkType"]:checked').value;
    const notes = document.getElementById('homeworkNotes').value;
    const timeInput = document.getElementById('homeworkDueTime').value;
    
    // Convert 24-hour time to 12-hour with AM/PM if time is provided
    let dueTime = null;
    if (timeInput) {
        const [hours, minutes] = timeInput.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        dueTime = `${displayHour}:${minutes} ${ampm}`;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { data, error } = await supabase
            .from('homework')
            .insert([{
                user_id: user.id,
                class: className,
                title: title,
                due_date: dueDate,
                due_time: dueTime,
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
        
        // Filter out tests that are past 3:00 PM on their due date
        const currentTime = new Date();
        const filteredHomework = allHomework.filter(hw => {
            if (hw.type !== 'test') return true;
            
            const [year, month, day] = hw.due_date.split('-');
            const testDate = new Date(year, month - 1, day);
            testDate.setHours(15, 0, 0, 0); // Set to 3:00 PM
            
            return currentTime < testDate;
        });
        
        const container = document.getElementById('homeworkGrid');
        
        container.innerHTML = CLASSES.map(className => {
            const classHomework = filteredHomework.filter(hw => hw.class === className);
            
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
                                const [year, month, day] = hw.due_date.split('-');
                                const date = new Date(year, month - 1, day);
                                
                                // Check if it's today or tomorrow
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const tomorrow = new Date(today);
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                date.setHours(0, 0, 0, 0);
                                
                                const isToday = date.getTime() === today.getTime();
                                const isTomorrow = date.getTime() === tomorrow.getTime();
                                
                                // Format date
                                let formattedDate;
                                if (isToday) {
                                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    formattedDate = `Today, ${monthDay}`;
                                } else if (isTomorrow) {
                                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    formattedDate = `Tomorrow, ${monthDay}`;
                                } else {
                                    formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                                }
                                
                                // Add time if available
                                const timeDisplay = hw.due_time ? ` at ${hw.due_time}` : '';
                                
                                // Use 'On:' for tests, 'Due:' for other assignments
                                const dateLabel = hw.type === 'test' ? 'On:' : 'Due:';
                                
                                return `
                                    <div class="homework-item">
                                        ${hw.type !== 'test' ? `<input type="checkbox" id="hw-class-${hw.id}" onchange="toggleHomework('${hw.id}', true)">` : '<span class="no-checkbox"></span>'}
                                        <label for="hw-class-${hw.id}">
                                            <span class="hw-title">${hw.title}</span>
                                            <div class="hw-meta">
                                                <span class="hw-type ${hw.type}">${getTypeIcon(hw.type)} ${hw.type}</span>
                                                <span class="hw-due">${dateLabel} ${formattedDate}${timeDisplay}</span>
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
        
        // Filter out tests that are past 3:00 PM on their due date
        const currentTime = new Date();
        const filteredHomework = activeHomework.filter(hw => {
            if (hw.type !== 'test') return true;
            
            const [year, month, day] = hw.due_date.split('-');
            const testDate = new Date(year, month - 1, day);
            testDate.setHours(15, 0, 0, 0); // Set to 3:00 PM
            
            return currentTime < testDate;
        });
        
        const container = document.getElementById('homeworkListView');
        
        if (filteredHomework.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No homework yet. Click "+ Add Homework" to get started!</p></div>';
            return;
        }
        
        // Get current date and calculate date ranges
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const endOfWeek = new Date(now);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        
        // Helper function to convert time string to minutes for sorting
        const timeToMinutes = (timeStr) => {
            if (!timeStr) return 9999; // Put items without time at the end
            const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return 9999;
            let hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && hours !== 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };
        
        // Categorize homework
        const dueByTomorrow = [];
        const dueThisWeek = [];
        const other = [];
        
        filteredHomework.forEach(hw => {
            const [year, month, day] = hw.due_date.split('-');
            const dueDate = new Date(year, month - 1, day);
            dueDate.setHours(0, 0, 0, 0);
            
            if (dueDate.getTime() <= tomorrow.getTime()) {
                dueByTomorrow.push(hw);
            } else if (dueDate <= endOfWeek) {
                dueThisWeek.push(hw);
            } else {
                other.push(hw);
            }
        });
        
        // Sort each category: first by date, then by time
        const sortByDateTime = (a, b) => {
            if (a.due_date !== b.due_date) {
                return a.due_date.localeCompare(b.due_date);
            }
            return timeToMinutes(a.due_time) - timeToMinutes(b.due_time);
        };
        
        dueByTomorrow.sort(sortByDateTime);
        dueThisWeek.sort(sortByDateTime);
        other.sort(sortByDateTime);
        
        // Helper function to render homework items
        const renderHomeworkItems = (items) => {
            return items.map(hw => {
                const [year, month, day] = hw.due_date.split('-');
                const date = new Date(year, month - 1, day);
                
                // Check if it's today or tomorrow
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                date.setHours(0, 0, 0, 0);
                
                const isToday = date.getTime() === today.getTime();
                const isTomorrow = date.getTime() === tomorrow.getTime();
                
                // Format date - use 'Today' or 'Tomorrow' if applicable, otherwise show weekday
                let formattedDate;
                if (isToday) {
                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    formattedDate = `Today, ${monthDay}`;
                } else if (isTomorrow) {
                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    formattedDate = `Tomorrow, ${monthDay}`;
                } else {
                    formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                }
                
                // Add time if available
                const timeDisplay = hw.due_time ? ` at ${hw.due_time}` : '';
                
                // Use 'On:' for tests, 'Due:' for other assignments
                const dateLabel = hw.type === 'test' ? 'On:' : 'Due:';
                
                return `
                    <div class="list-item" data-due="${hw.due_date}" data-class="${hw.class}">
                        <div class="list-checkbox">
                            ${hw.type !== 'test' ? `<input type="checkbox" id="hw-list-${hw.id}" onchange="toggleHomework('${hw.id}', true)">` : '<span class="no-checkbox"></span>'}
                        </div>
                        <div class="list-content">
                            <h4 class="list-title">${hw.title}</h4>
                            <div class="list-meta">
                                <span class="list-class">${hw.class}</span>
                                <span class="list-due">${dateLabel} ${formattedDate}${timeDisplay}</span>
                                <span class="homework-type ${hw.type}">${getTypeIcon(hw.type)} ${hw.type}</span>
                            </div>
                            ${hw.notes ? `<p class="homework-notes">${hw.notes}</p>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        };
        
        // Build HTML with sections
        let html = '';
        
        // Due by tomorrow
        html += `
            <div class="list-section">
                <h3 class="list-section-title">Due by Tomorrow</h3>
                <div class="list-section-items">
                    ${dueByTomorrow.length > 0 ? renderHomeworkItems(dueByTomorrow) : '<p class="list-empty-message">No assignments due by tomorrow</p>'}
                </div>
            </div>
        `;
        
        // This Week
        html += `
            <div class="list-section">
                <h3 class="list-section-title">This Week</h3>
                <div class="list-section-items">
                    ${dueThisWeek.length > 0 ? renderHomeworkItems(dueThisWeek) : '<p class="list-empty-message">No assignments this week</p>'}
                </div>
            </div>
        `;
        
        // Other Assignments
        html += `
            <div class="list-section">
                <h3 class="list-section-title">Other Assignments</h3>
                <div class="list-section-items">
                    ${other.length > 0 ? renderHomeworkItems(other) : '<p class="list-empty-message">No other assignments</p>'}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading list view:', error);
    }
}

function getTypeIcon(type) {
    return '';
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
async function loadTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', false)
            .order('date', { ascending: true });
        
        if (error) throw error;
        
        const container = document.getElementById('taskList');
        
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<p class="empty-message">No tasks yet. Click + to add one!</p>';
            return;
        }
        
        container.innerHTML = tasks.map(task => {
            const date = new Date(task.date);
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            
            return `
                <div class="task-item">
                    <input type="checkbox" id="task-${task.id}" onchange="toggleTask('${task.id}', true)">
                    <label for="task-${task.id}">
                        <span class="task-title">${task.title}</span>
                        ${task.notes ? `<span class="task-notes">${task.notes}</span>` : ''}
                    </label>
                    <span class="task-date">${formattedDate}</span>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function toggleTask(id, completed) {
    try {
        const { error } = await supabase
            .from('tasks')
            .update({ completed })
            .eq('id', id);
        
        if (error) throw error;
        
        // Reload tasks after short delay
        setTimeout(() => {
            loadTasks();
        }, 300);
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// Event functions
let showAllEvents = false;

async function loadEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true });
        
        if (error) throw error;
        
        const container = document.getElementById('eventList');
        
        if (!events || events.length === 0) {
            container.innerHTML = '<p class="empty-message">No events yet. Click + to add one!</p>';
            return;
        }
        
        // Determine how many events to show
        const eventsToShow = showAllEvents ? events : events.slice(0, 4);
        const hasMore = events.length > 4;
        
        let html = eventsToShow.map(event => {
            const date = new Date(event.date);
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            
            // Format time - already formatted with AM/PM from database or 'All Day'
            const time = event.time || 'All Day';
            
            return `
                <div class="event-item">
                    <div class="event-date">
                        <span class="date-day">${day}</span>
                        <span class="date-month">${month}</span>
                    </div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <p>${time}</p>
                    </div>
                    <button class="delete-event-btn" onclick="deleteEvent('${event.id}')" title="Delete event">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
        
        // Add "Show More" or "Show Less" button if there are more than 4 events
        if (hasMore) {
            html += `
                <button class="show-more-events-btn" onclick="toggleShowAllEvents()">
                    ${showAllEvents ? 'Show Less' : `Show More (${events.length - 4} more)`}
                </button>
            `;
        }
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}

function toggleShowAllEvents() {
    showAllEvents = !showAllEvents;
    loadEvents();
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
