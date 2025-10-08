document.addEventListener('DOMContentLoaded', function() {
    const heroText = document.querySelector('.hero-text');
    const aboutSection = document.querySelector('.about');
    
    // Animate hero text on page load
    heroText.style.opacity = 0;
    heroText.style.transform = 'translateY(50px)';
    setTimeout(() => {
        heroText.style.transition = 'opacity 1s, transform 1s';
        heroText.style.opacity = 1;
        heroText.style.transform = 'translateY(0)';
    }, 500);
    
    // Add hover effect on the about section
    aboutSection.addEventListener('mouseover', function() {
        aboutSection.style.transform = 'rotate(5deg)';
        aboutSection.style.transition = 'transform 0.5s ease';
    });
    aboutSection.addEventListener('mouseout', function() {
        aboutSection.style.transform = 'rotate(0deg)';
        aboutSection.style.transition = 'transform 0.5s ease';
    });
});
