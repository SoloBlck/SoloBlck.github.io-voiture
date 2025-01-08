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

    // Gestion des catégories
    $('.category-btn').on('click', function() {
        const category = $(this).data('category');
        
        // Mise à jour des boutons
        $('.category-btn').removeClass('active');
        $(this).addClass('active');
        
        // Affichage du slider correspondant
        $('.cards-wrapper').addClass('hidden');
        $(`#${category}-services`).removeClass('hidden');
        
        // Réinitialisation du scroll
        $('.cards-container').scrollLeft(0);
    });

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
            contact: $('#email').val(), // Renommé pour plus de clarté
            phone: $('#phone').val(),
            date: $('#date').val(),
            time: $('#time').val(),
            message: $('#message').val(),
            service: selectedService
        };

        // Création de l'embed Discord
        const embed = {
            title: "Nouvelle demande de rendez-vous",
            color: 0x0099ff,
            content: "<@497317753099911323>",
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
                    name: "Contact",
                    value: formData.contact,
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
                content: "<@497317753099911323>",
                embeds: [embed]
            })
        })
        .then(response => {
            if (response.ok) {
                appointmentPopup.fadeOut(300);
                alert('Votre demande de rendez-vous a été envoyée avec succès !');
                this.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
        });
    });

    // Gestion du popup de contact
    const contactPopup = $('.contact-popup');
    
    $('#contact-btn').on('click', function(e) {
        e.preventDefault();
        contactPopup.css('display', 'flex').hide().fadeIn(300);
    });
    
    // Fermer le popup
    $('.close-popup, .contact-popup').on('click', function(e) {
        if (e.target === this) {
            contactPopup.fadeOut(300);
        }
    });
    
    // Empêcher la fermeture lors du clic sur le contenu du popup
    $('.popup-content').on('click', function(e) {
        e.stopPropagation();
    });
});
