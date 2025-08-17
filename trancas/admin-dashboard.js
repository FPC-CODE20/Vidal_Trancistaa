// Admin Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeDashboard();
    loadDashboardData();
    setupEventListeners();
});

// Authentication check
function checkAuthentication() {
    const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (!userData) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    document.getElementById('currentUser').textContent = user.username;
    document.querySelector('.user-btn span').textContent = user.username;
}

// Initialize dashboard
function initializeDashboard() {
    // Set current date for date filters
    const today = new Date().toISOString().split('T')[0];
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.value = today;
    }
    
    // Initialize notifications
    updateNotificationCount();
    
    // Load initial section
    showSection('dashboard');
}

// Sample data (in production, this would come from a backend API)
const sampleData = {
    appointments: [
        {
            id: 1,
            date: '2024-01-15',
            time: '09:00',
            clientName: 'Maria Silva',
            clientPhone: '(11) 99999-1111',
            clientEmail: 'maria@email.com',
            service: 'Box Braids',
            status: 'pending',
            notes: 'Primeira vez fazendo tranças'
        },
        {
            id: 2,
            date: '2024-01-15',
            time: '10:30',
            clientName: 'Ana Costa',
            clientPhone: '(11) 99999-2222',
            clientEmail: 'ana@email.com',
            service: 'Tranças Nagô',
            status: 'confirmed',
            notes: 'Cliente regular'
        },
        {
            id: 3,
            date: '2024-01-15',
            time: '14:00',
            clientName: 'Carla Santos',
            clientPhone: '(11) 99999-3333',
            clientEmail: 'carla@email.com',
            service: 'Twist',
            status: 'confirmed',
            notes: ''
        }
    ],
    courses: {
        basico: {
            name: 'Curso Básico de Tranças',
            enrolled: 25,
            completed: 18,
            inProgress: 7,
            students: [
                { name: 'João Santos', enrollDate: '2024-01-10', status: 'new' },
                { name: 'Fernanda Lima', enrollDate: '2024-01-09', status: 'confirmed' }
            ]
        },
        avancado: {
            name: 'Curso Avançado',
            enrolled: 15,
            completed: 10,
            inProgress: 5,
            students: []
        },
        profissional: {
            name: 'Curso Profissional Completo',
            enrolled: 8,
            completed: 3,
            inProgress: 5,
            students: []
        }
    },
    stats: {
        todayAppointments: 15,
        newStudents: 8,
        monthlyRevenue: 2450,
        totalClients: 127
    }
};

// Load dashboard data
function loadDashboardData() {
    // Update stats
    updateStats();
    
    // Load appointments
    loadAppointments();
    
    // Load course data
    loadCourseData();
}

// Update statistics
function updateStats() {
    const stats = sampleData.stats;
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = stats.todayAppointments;
        statCards[1].querySelector('h3').textContent = stats.newStudents;
        statCards[2].querySelector('h3').textContent = `R$ ${stats.monthlyRevenue.toLocaleString()}`;
        statCards[3].querySelector('h3').textContent = stats.totalClients;
    }
}

// Load appointments
function loadAppointments() {
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    if (!appointmentsTableBody) return;
    
    appointmentsTableBody.innerHTML = '';
    
    sampleData.appointments.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        appointmentsTableBody.appendChild(row);
    });
}

// Create appointment table row
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatDateTime(appointment.date, appointment.time)}</td>
        <td>${appointment.clientName}</td>
        <td>${appointment.service}</td>
        <td>${appointment.clientPhone}</td>
        <td><span class="status ${appointment.status}">${getStatusText(appointment.status)}</span></td>
        <td>
            ${appointment.status === 'pending' ? `
                <button class="btn-action confirm" onclick="confirmAppointment(${appointment.id})" title="Confirmar">
                    <i class="fas fa-check"></i>
                </button>
            ` : ''}
            ${appointment.status === 'confirmed' ? `
                <button class="btn-action complete" onclick="completeAppointment(${appointment.id})" title="Concluir">
                    <i class="fas fa-check-double"></i>
                </button>
            ` : ''}
            <button class="btn-action edit" onclick="editAppointment(${appointment.id})" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action cancel" onclick="cancelAppointment(${appointment.id})" title="Cancelar">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    return row;
}

// Format date and time
function formatDateTime(date, time) {
    const dateObj = new Date(date + 'T' + time);
    return dateObj.toLocaleDateString('pt-BR') + ' ' + time;
}

// Get status text in Portuguese
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'confirmed': 'Confirmado',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Load course data
function loadCourseData() {
    const courses = sampleData.courses;
    
    // Update course cards
    Object.keys(courses).forEach((courseKey, index) => {
        const course = courses[courseKey];
        const courseCards = document.querySelectorAll('.course-card');
        
        if (courseCards[index]) {
            const stats = courseCards[index].querySelectorAll('.stat-number');
            if (stats.length >= 3) {
                stats[0].textContent = course.enrolled;
                stats[1].textContent = course.completed;
                stats[2].textContent = course.inProgress;
            }
        }
    });
    
    // Update recent enrollments
    updateRecentEnrollments();
}

// Update recent enrollments
function updateRecentEnrollments() {
    const enrollmentsList = document.querySelector('.enrollments-list');
    if (!enrollmentsList) return;
    
    enrollmentsList.innerHTML = '';
    
    // Get recent enrollments from all courses
    const recentEnrollments = [];
    Object.keys(sampleData.courses).forEach(courseKey => {
        const course = sampleData.courses[courseKey];
        course.students.forEach(student => {
            recentEnrollments.push({
                ...student,
                courseName: course.name
            });
        });
    });
    
    // Sort by enrollment date (most recent first)
    recentEnrollments.sort((a, b) => new Date(b.enrollDate) - new Date(a.enrollDate));
    
    // Display recent enrollments
    recentEnrollments.slice(0, 5).forEach(enrollment => {
        const enrollmentItem = document.createElement('div');
        enrollmentItem.className = 'enrollment-item';
        enrollmentItem.innerHTML = `
            <div class="student-info">
                <strong>${enrollment.name}</strong>
                <span>${enrollment.courseName}</span>
            </div>
            <div class="enrollment-date">${formatEnrollmentDate(enrollment.enrollDate)}</div>
            <div class="enrollment-status">
                <span class="status ${enrollment.status}">${getStatusText(enrollment.status)}</span>
            </div>
        `;
        enrollmentsList.appendChild(enrollmentItem);
    });
}

// Format enrollment date
function formatEnrollmentDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Hoje, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ontem, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('pt-BR');
    }
}

// Setup event listeners
function setupEventListeners() {
    // New appointment form
    const newAppointmentForm = document.getElementById('newAppointmentForm');
    if (newAppointmentForm) {
        newAppointmentForm.addEventListener('submit', handleNewAppointment);
    }
    
    // Auto-refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle new appointment form submission
function handleNewAppointment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointmentData = {
        id: Date.now(), // Simple ID generation
        date: formData.get('appointmentDate'),
        time: formData.get('appointmentTime'),
        clientName: formData.get('clientName'),
        clientPhone: formData.get('clientPhone'),
        service: formData.get('service'),
        status: 'pending',
        notes: formData.get('notes') || ''
    };
    
    // Add to sample data (in production, this would be sent to backend)
    sampleData.appointments.push(appointmentData);
    
    // Reload appointments
    loadAppointments();
    
    // Close modal
    closeModal('appointmentModal');
    
    // Show success message
    showNotification('Agendamento criado com sucesso!', 'success');
    
    // Reset form
    e.target.reset();
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`).parentElement;
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'appointments': 'Agendamentos',
        'courses': 'Cursos',
        'customers': 'Clientes',
        'reports': 'Relatórios',
        'settings': 'Configurações'
    };
    
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Dashboard';
}

// Appointment management functions
function confirmAppointment(id) {
    const appointment = sampleData.appointments.find(apt => apt.id === id);
    if (appointment) {
        appointment.status = 'confirmed';
        loadAppointments();
        showNotification('Agendamento confirmado!', 'success');
        updateNotificationCount();
    }
}

function completeAppointment(id) {
    const appointment = sampleData.appointments.find(apt => apt.id === id);
    if (appointment) {
        appointment.status = 'completed';
        loadAppointments();
        showNotification('Agendamento concluído!', 'success');
        updateNotificationCount();
    }
}

function cancelAppointment(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        const appointment = sampleData.appointments.find(apt => apt.id === id);
        if (appointment) {
            appointment.status = 'cancelled';
            loadAppointments();
            showNotification('Agendamento cancelado!', 'warning');
            updateNotificationCount();
        }
    }
}

function editAppointment(id) {
    const appointment = sampleData.appointments.find(apt => apt.id === id);
    if (appointment) {
        // Fill form with appointment data
        const form = document.getElementById('newAppointmentForm');
        if (form) {
            form.clientName.value = appointment.clientName;
            form.clientPhone.value = appointment.clientPhone;
            form.appointmentDate.value = appointment.date;
            form.appointmentTime.value = appointment.time;
            form.service.value = appointment.service;
            form.notes.value = appointment.notes;
            
            // Show modal
            showModal('appointmentModal');
            
            // Update form to edit mode
            form.onsubmit = function(e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                appointment.clientName = formData.get('clientName');
                appointment.clientPhone = formData.get('clientPhone');
                appointment.date = formData.get('appointmentDate');
                appointment.time = formData.get('appointmentTime');
                appointment.service = formData.get('service');
                appointment.notes = formData.get('notes') || '';
                
                loadAppointments();
                closeModal('appointmentModal');
                showNotification('Agendamento atualizado!', 'success');
                
                // Reset form handler
                form.onsubmit = handleNewAppointment;
            };
        }
    }
}

// Filter appointments
function filterAppointments() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    let filteredAppointments = sampleData.appointments;
    
    // Filter by status
    if (statusFilter) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter) {
        filteredAppointments = filteredAppointments.filter(apt => apt.date === dateFilter);
    }
    
    // Filter by search term
    if (searchFilter) {
        filteredAppointments = filteredAppointments.filter(apt => 
            apt.clientName.toLowerCase().includes(searchFilter) ||
            apt.service.toLowerCase().includes(searchFilter) ||
            apt.clientPhone.includes(searchFilter)
        );
    }
    
    // Update table
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    if (appointmentsTableBody) {
        appointmentsTableBody.innerHTML = '';
        filteredAppointments.forEach(appointment => {
            const row = createAppointmentRow(appointment);
            appointmentsTableBody.appendChild(row);
        });
    }
}

// Course management functions
function viewCourseDetails(courseType) {
    const course = sampleData.courses[courseType];
    if (course) {
        alert(`Detalhes do ${course.name}:\n\nAlunos Inscritos: ${course.enrolled}\nConcluídos: ${course.completed}\nEm Andamento: ${course.inProgress}`);
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showNewAppointmentModal() {
    showModal('appointmentModal');
}

// UI functions
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.toggle('show');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.notifications')) {
        document.getElementById('notificationsDropdown').classList.remove('show');
    }
    
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});

// Update notification count
function updateNotificationCount() {
    const pendingAppointments = sampleData.appointments.filter(apt => apt.status === 'pending').length;
    const newEnrollments = Object.values(sampleData.courses)
        .reduce((total, course) => total + course.students.filter(s => s.status === 'new').length, 0);
    
    const totalNotifications = pendingAppointments + newEnrollments;
    
    // Update badges
    document.getElementById('appointmentsBadge').textContent = pendingAppointments;
    document.getElementById('coursesBadge').textContent = newEnrollments;
    document.querySelector('.notification-count').textContent = totalNotifications;
    
    // Hide badges if count is 0
    if (pendingAppointments === 0) {
        document.getElementById('appointmentsBadge').style.display = 'none';
    }
    if (newEnrollments === 0) {
        document.getElementById('coursesBadge').style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        background: ${getNotificationColor(type)};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + N: New appointment
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showNewAppointmentModal();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Logout function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'admin-login.html';
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);