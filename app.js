document.addEventListener('DOMContentLoaded', () => {
    const startNavButton = document.getElementById('start-nav');
    
    startNavButton.addEventListener('click', startNavigation);

    function startNavigation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                console.log(`User location: ${latitude}, ${longitude}`);
                
                // Here you would typically:
                // 1. Send this location to your server
                // 2. Receive nearby AR markers or navigation instructions
                // 3. Add AR markers to the scene

                addARMarker(latitude, longitude);
            }, error => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    function addARMarker(lat, lng) {
        const scene = document.querySelector('a-scene');
        const marker = document.createElement('a-box');
        marker.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lng};`);
        marker.setAttribute('color', 'red');
        marker.setAttribute('scale', '20 20 20');
        scene.appendChild(marker);
    }
});

