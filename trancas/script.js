// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-play carousel
setInterval(() => {
    changeSlide(1);
}, 5000);

// Course purchase functionality
const courseModal = document.getElementById('courseModal');
const closeModal = document.querySelector('.close');

const courses = {
    basico: {
        name: 'Curso Básico de Tranças',
        price: 'R$ 299,00',
        duration: '20 horas',
        description: 'Aprenda as técnicas fundamentais do trançado profissional'
    },
    avancado: {
        name: 'Curso Avançado',
        price: 'R$ 599,00',
        duration: '40 horas',
        description: 'Técnicas avançadas e estilos modernos de trançado'
    },
    profissional: {
        name: 'Curso Profissional Completo',
        price: 'R$ 999,00',
        duration: '80 horas',
        description: 'Formação completa para se tornar um trancista profissional'
    }
};

function buyCourse(courseType) {
    const course = courses[courseType];
    const courseDetails = document.getElementById('courseDetails');
    
    courseDetails.innerHTML = `
        <div class="course-summary">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span class="price">${course.price}</span>
            </div>
        </div>
    `;
    
    courseModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    courseModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === courseModal) {
        courseModal.style.display = 'none';
    }
});

// Form submissions
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const appointmentData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        notes: formData.get('notes')
    };
    
    // Simulate form submission
    alert('Agendamento realizado com sucesso! Entraremos em contato para confirmação.');
    this.reset();
    
    // In a real application, you would send this data to your backend
    console.log('Appointment Data:', appointmentData);
});

document.getElementById('courseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const courseData = {
        studentName: formData.get('studentName'),
        studentEmail: formData.get('studentEmail'),
        studentPhone: formData.get('studentPhone'),
        paymentMethod: formData.get('paymentMethod')
    };
    
    // Simulate course purchase
    alert('Compra realizada com sucesso! Você receberá as informações de acesso por e-mail.');
    courseModal.style.display = 'none';
    this.reset();
    
    // In a real application, you would process the payment and send course access
    console.log('Course Purchase Data:', courseData);
});

// Set minimum date for appointment booking (today)
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#FFFFFF';
        header.style.backdropFilter = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and course cards
document.querySelectorAll('.service-card, .course-card, .contact-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    e.target.value = value;
});

document.getElementById('studentPhone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    e.target.value = value;
});

// Loading animation for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type === 'submit') {
            const originalText = this.textContent;
            this.textContent = 'Processando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

// WhatsApp integration
function openWhatsApp(message = '') {
    const phone = '+55 71 98740-7875'; // Replace with actual phone number
    const encodedMessage = encodeURIComponent(message || 'Olá! Gostaria de mais informações sobre os serviços.');
    window.open(`https://wa.me/message/N36ZV3EQI447E1`, '_blank');
}

// Add WhatsApp quick action
const whatsappBtn = document.createElement('div');
whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
whatsappBtn.className = 'whatsapp-float';
whatsappBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
    transition: all 0.3s ease;
`;

whatsappBtn.addEventListener('click', () => openWhatsApp());
whatsappBtn.addEventListener('mouseenter', () => {
    whatsappBtn.style.transform = 'scale(1.1)';
});
whatsappBtn.addEventListener('mouseleave', () => {
    whatsappBtn.style.transform = 'scale(1)';
});

document.body.appendChild(whatsappBtn);