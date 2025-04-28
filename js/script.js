/* ───────────────────────────────────────────────────────────────── */
/* HAMBURGER MENU TOGGLE                                           */
/* ───────────────────────────────────────────────────────────────── */
const burger   = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbarEl = document.querySelector('.navbar');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navbarEl.classList.toggle('active');
});

/* ───────────────────────────────────────────────────────────────── */
/* HERO SECTION SLIDER (uses 100vw so no bleed of neighbors)       */
/* ───────────────────────────────────────────────────────────────── */
let heroIdx         = 0;
const heroContainer = document.querySelector('.hero-slider .slides');
const totalHero     = document.querySelectorAll('.hero-slider .slide').length;

document.querySelector('.hero-next').addEventListener('click', () => {
  heroIdx = (heroIdx + 1) % totalHero;
  heroContainer.style.transform = `translateX(-${heroIdx * 100}vw)`;
});

document.querySelector('.hero-prev').addEventListener('click', () => {
  heroIdx = (heroIdx - 1 + totalHero) % totalHero;
  heroContainer.style.transform = `translateX(-${heroIdx * 100}vw)`;
});

// trip inspiration section

/**
 * Jaipur Travel - Activity Section
 * Isolated JavaScript with IIFE to avoid global scope pollution
 * All selectors are namespaced with 'jt-' prefix
 */
(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Use a namespace to avoid conflicts
    const JaipurTravel = {
      // Cache DOM elements
      elements: {
        filterButtons: document.querySelectorAll('.jt-filter-button'),
        activityCards: document.querySelectorAll('.jt-activity-card'),
        nextBtn: document.querySelector('.jt-next-btn'),
        prevBtn: document.querySelector('.jt-prev-btn'),
        container: document.querySelector('.jt-container')
      },
      
      // State tracking
      state: {
        currentSlide: 0,
        cardsPerView: 4,
        totalSlides: 0,
        activeFilter: 'all'
      },
      
      // Initialize the component
      init: function() {
        // Only initialize if our container exists
        if (!this.elements.container) return;
        
        this.bindEvents();
        this.updateCardsPerView();
        this.updateSlidePosition();
      },
      
      // Bind all event listeners
      bindEvents: function() {
        // Filter button clicks
        this.elements.filterButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleFilterClick(button);
          });
        });
        
        // Slider navigation
        if (this.elements.nextBtn) {
          this.elements.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.elements.prevBtn) {
          this.elements.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Responsive adjustments
        window.addEventListener('resize', () => {
          this.debounce(() => this.updateCardsPerView(), 250);
        });
        
        // Initialize card hover effects
        this.initCardHoverEffects();
      },
      
      // Handle filter button clicks
      handleFilterClick: function(button) {
        // Remove active class from all buttons
        this.elements.filterButtons.forEach(btn => btn.classList.remove('jt-active'));
        
        // Add active class to clicked button
        button.classList.add('jt-active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        this.state.activeFilter = filterValue;
        
        // Filter the cards
        this.filterCards(filterValue);
      },
      
      // Filter cards based on category
      filterCards: function(filter) {
        this.elements.activityCards.forEach(card => {
          const categories = card.getAttribute('data-category');
          
          if (filter === 'all' || categories.includes(filter)) {
            // Show card with animation
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            // Hide card with animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
        
        // Reset to first slide after filtering
        this.state.currentSlide = 0;
        this.updateSlidePosition();
      },
      
      // Calculate visible cards based on screen size
      updateCardsPerView: function() {
        const oldValue = this.state.cardsPerView;
        
        // Determine cards per view based on window width
        if (window.innerWidth <= 576) {
          this.state.cardsPerView = 1;
        } else if (window.innerWidth <= 768) {
          this.state.cardsPerView = 2;
        } else if (window.innerWidth <= 992) {
          this.state.cardsPerView = 3;
        } else {
          this.state.cardsPerView = 4;
        }
        
        // Only update if value changed
        if (oldValue !== this.state.cardsPerView) {
          // Count visible cards (those matching active filter)
          let visibleCards = 0;
          this.elements.activityCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            if (this.state.activeFilter === 'all' || categories.includes(this.state.activeFilter)) {
              visibleCards++;
            }
          });
          
          // Calculate total slides
          this.state.totalSlides = Math.ceil(visibleCards / this.state.cardsPerView);
          
          // Reset current slide if needed
          if (this.state.currentSlide >= this.state.totalSlides) {
            this.state.currentSlide = Math.max(0, this.state.totalSlides - 1);
          }
          
          this.updateSlidePosition();
        }
      },
      
      // Go to next slide
      nextSlide: function() {
        if (this.state.currentSlide < this.state.totalSlides - 1) {
          this.state.currentSlide++;
          this.updateSlidePosition();
        }
      },
      
      // Go to previous slide
      prevSlide: function() {
        if (this.state.currentSlide > 0) {
          this.state.currentSlide--;
          this.updateSlidePosition();
        }
      },
      
      // Update navigation buttons and slide position
      updateSlidePosition: function() {
        if (!this.elements.prevBtn || !this.elements.nextBtn) return;
        
        // Show/hide navigation buttons
        this.elements.prevBtn.classList.toggle('jt-hidden', this.state.currentSlide === 0);
        this.elements.nextBtn.classList.toggle('jt-hidden', 
          this.state.currentSlide === this.state.totalSlides - 1 || this.state.totalSlides <= 1);
      },
      
      // Initialize hover effects for cards
      initCardHoverEffects: function() {
        this.elements.activityCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
          });
          
          card.addEventListener('mouseleave', () => {
            if (getComputedStyle(card).display !== 'none') {
              card.style.transform = 'translateY(0)';
              card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            }
          });
        });
      },
      
      // Utility function to debounce window resize
      debounce: function(func, wait) {
        let timeout;
        return function() {
          const context = this;
          const args = arguments;
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(context, args), wait);
        };
      }
    };
    
    // Initialize the component
    JaipurTravel.init();
  });
})();

/* ───────────────────────────────────────────────────────────────── */
/* DESTINATIONS CAROUSEL                                            */
/* ───────────────────────────────────────────────────────────────── */



/* ───────────────────────────────────────────────────────────────── */
/* FAQ ACCORDION                                                   */
/* ───────────────────────────────────────────────────────────────── */
document.querySelectorAll('.question').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans    = btn.nextElementSibling;
    const isOpen = ans.style.maxHeight;

    // close all answers
    document.querySelectorAll('.answer').forEach(a => a.style.maxHeight = null);
    document.querySelectorAll('.question span').forEach(s => s.textContent = '+');

    // open this one if was closed
    if (!isOpen) {
      ans.style.maxHeight = ans.scrollHeight + 'px';
      btn.querySelector('span').textContent = '–';
    }
  });
});
