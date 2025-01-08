$(document).ready(function() {
    // Créer le popup et l'ajouter au body
    $('body').append('<div class="popup-bubble"><div class="popup-content">Non.</div></div>');
    
    const popup = $('.popup-bubble');
    
    $('#cgu').on('click', function(e) {
        e.preventDefault();
        
        // Calcul de la position
        const link = $(this);
        const linkOffset = link.offset();
        
        popup.css({
            left: linkOffset.left + (link.outerWidth() / 2) - (popup.outerWidth() / 2),
            top: linkOffset.top - popup.outerHeight() - 5
        });
        
        // Animation d'apparition
        popup.css({
            display: 'block',
            opacity: 0,
            transform: 'scale(0.95) translateY(5px)'
        }).animate({
            opacity: 1
        }, 150);
        
        popup.css('transform', 'scale(1) translateY(0)');
        
        // Disparition après 1.5 secondes
        setTimeout(() => {
            popup.animate({
                opacity: 0
            }, 150, function() {
                popup.hide();
            });
        }, 1500);
    });

    // Cards navigation
    const container = $('.cards-container');
    const slider = $('.cards-slider');
    const prevBtn = $('.prev-btn');
    const nextBtn = $('.next-btn');

    // Synchronisation directe entre le slider et le défilement
    slider.on('input', function() {
        const scrollWidth = container[0].scrollWidth - container.width();
        const scrollAmount = (scrollWidth * slider.val()) / 100;
        container.scrollLeft(scrollAmount);
    });

    // Mise à jour du slider pendant le défilement
    container.on('scroll', function() {
        const scrollPercentage = (container.scrollLeft() / (container[0].scrollWidth - container.width())) * 100;
        slider.val(scrollPercentage);
        updateNavButtons();
    });

    // Navigation buttons
    prevBtn.on('click', function() {
        const cardWidth = $('.price-card').outerWidth(true);
        container.scrollLeft(container.scrollLeft() - cardWidth);
    });

    nextBtn.on('click', function() {
        const cardWidth = $('.price-card').outerWidth(true);
        container.scrollLeft(container.scrollLeft() + cardWidth);
    });

    function updateNavButtons() {
        const isAtStart = container.scrollLeft() <= 0;
        const isAtEnd = container.scrollLeft() >= container[0].scrollWidth - container.width() - 5;
        
        prevBtn.css('opacity', isAtStart ? '0.5' : '1');
        nextBtn.css('opacity', isAtEnd ? '0.5' : '1');
        
        prevBtn.prop('disabled', isAtStart);
        nextBtn.prop('disabled', isAtEnd);
    }

    // Défilement tactile simple
    let isDown = false;
    let startX;
    let scrollLeft;

    container.on('mousedown touchstart', function(e) {
        isDown = true;
        container.css('cursor', 'grabbing');
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        scrollLeft = container.scrollLeft();
    });

    container.on('mousemove touchmove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const walk = (x - startX) * 2;
        container.scrollLeft(scrollLeft - walk);
    });

    container.on('mouseleave mouseup touchend', function() {
        isDown = false;
        container.css('cursor', 'grab');
    });

    // Initial update
    updateNavButtons();

    // Gestion du popup de rendez-vous
    const appointmentPopup = $('.appointment-popup');
    let selectedService = '';
    
    // Ouvrir le popup lors du clic sur "Sélectionner"
    $('.select-btn').on('click', function() {
        const card = $(this).closest('.price-card');
        selectedService = card.find('h3').text();
        const price = card.find('.price').text();
        
        $('.selected-service').text(`Service sélectionné : ${selectedService} (${price})`);
        appointmentPopup.css('display', 'flex').hide().fadeIn(300);
    });
    
    // Fermer le popup
    $('.close-popup, .appointment-popup').on('click', function(e) {
        if (e.target === this) {
            appointmentPopup.fadeOut(300);
        }
    });
    
    // Empêcher la fermeture lors du clic sur le contenu du popup
    $('.popup-content').on('click', function(e) {
        e.stopPropagation();
    });

    // Gestion du formulaire
    $('#appointment-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            date: $('#date').val(),
            time: $('#time').val(),
            message: $('#message').val()
        };

        // Création de l'embed Discord
        const embed = {
            title: "Nouvelle demande de rendez-vous",
            color: 0x0099ff,
            fields: [
                {
                    name: "Service",
                    value: selectedService,
                    inline: true
                },
                {
                    name: "Client",
                    value: formData.name,
                    inline: true
                },
                {
                    name: "Email",
                    value: formData.email,
                    inline: true
                },
                {
                    name: "Téléphone",
                    value: formData.phone,
                    inline: true
                },
                {
                    name: "Date souhaitée",
                    value: `${formData.date} à ${formData.time}`,
                    inline: true
                }
            ],
            footer: {
                text: "Pacific Lex - Système de rendez-vous"
            },
            timestamp: new Date().toISOString()
        };

        if (formData.message) {
            embed.fields.push({
                name: "Message",
                value: formData.message
            });
        }

        // Envoi au webhook Discord
        fetch('https://discord.com/api/webhooks/1326574727673942036/mChVT9zzCLbuEd0SZWojZFuyW_GrWWHpIKg5KO5lMb6tYTdpJxv0HwKwCz0RBbxMUphm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Votre demande de rendez-vous a été envoyée avec succès !');
                appointmentPopup.fadeOut(300);
                this.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
            console.error('Error:', error);
        });
    });
});
