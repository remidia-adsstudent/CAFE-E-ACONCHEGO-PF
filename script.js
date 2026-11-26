document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
});

let currentReservation = null;

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.page-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active-nav');
    });

    const activeNav = document.getElementById('nav-' + tabId);
    if (activeNav) {
        activeNav.classList.add('active-nav');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        menu.classList.add('hidden');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
}

function scrollToSection(sectionId) {
    switchTab('home');
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function handleReservationSubmit(event) {
    event.preventDefault();

    const randomCode = '#CAF-' + Math.floor(1000 + Math.random() * 9000);

    currentReservation = {
        code: randomCode,
        name: document.getElementById('res-name').value,
        email: document.getElementById('res-email').value,
        phone: document.getElementById('res-phone').value,
        guests: document.getElementById('res-guests').value,
        date: formatDate(document.getElementById('res-date').value),
        time: document.getElementById('res-time').value,
        notes: document.getElementById('res-notes').value
    };

    document.getElementById('summary-code').innerText = currentReservation.code;
    document.getElementById('summary-name').innerText = currentReservation.name;
    document.getElementById('summary-guests').innerText = currentReservation.guests;
    document.getElementById('summary-date').innerText = currentReservation.date;
    document.getElementById('summary-time').innerText = currentReservation.time;

    const notesContainer = document.getElementById('summary-notes-container');
    if (currentReservation.notes.trim() !== '') {
        document.getElementById('summary-notes').innerText = '"' + currentReservation.notes + '"';
        notesContainer.classList.remove('hidden');
    } else {
        notesContainer.classList.add('hidden');
    }

    switchTab('confirmation');
    showToast('Reserva criada com sucesso!');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function copyReservationCode() {
    if (!currentReservation) return;
    
    const textToCopy = currentReservation.code;
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = textToCopy;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    showToast('Código ' + textToCopy + ' copiado!');
}

function downloadVoucher() {
    if (!currentReservation) return;

    const content = `
========================================
    CAFÉ & ACONCHEGO - COMPROVANTE
========================================
Código da Reserva: ${currentReservation.code}
Nome do Cliente:  ${currentReservation.name}
E-mail:           ${currentReservation.email}
Telefone:         ${currentReservation.phone}
Pessoas:          ${currentReservation.guests}
Data da Visita:   ${currentReservation.date}
Horário:          ${currentReservation.time}
Observações:      ${currentReservation.notes || 'Nenhuma'}

Endereço: Rua das Flores, 450 - Bairro Charme, São Paulo - SP
========================================
Agradecemos a sua preferência!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Reserva_${currentReservation.code.replace('#', '')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);

    showToast('Comprovante baixado com sucesso!');
}

function openMenuModal() {
    document.getElementById('menu-modal').classList.remove('hidden');
}

function closeMenuModal() {
    document.getElementById('menu-modal').classList.add('hidden');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    
    toastMsg.innerText = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}
