// congestion.js
const googleApiKey = 'AIzaSyBOaW8jvX_1FhPRdh6PbLtknj5lYBVhRMk';

// congestion.js

function displayCongestion(origin, destination) {
    fetch(`http://localhost:3000/directions?origin=${origin}&destination=${destination}`)
    .then(response => response.json())
    .then(data => {
        const congestionDiv = document.getElementById('congestion');

        if (data.status === "OK") {
            const route = data.routes[0].legs[0];

            // Get incident data, if any
            let incidents = 'No incidents reported on this route.';
            if (route.steps.some(step => step.hasOwnProperty('warnings'))) {
                incidents = 'Be aware of the following incidents on this route:<ul>'
                route.steps.forEach(step => {
                    if (step.hasOwnProperty('warnings')) {
                        incidents += `<li>${step.warnings[0]}</li>`;
                    }
                });
                incidents += '</ul>';
            }

            congestionDiv.innerHTML = `
                <h2>🚦Route Information:</h2>
                <p>🛣️ Distance: ${route.distance.text}</p>
                <p>⏱️ Duration (with current traffic): ${route.duration_in_traffic.text}</p>
                <p>⚠️ Incidents: ${incidents}</p>
            `;
        } else {
            congestionDiv.innerHTML = `<p>Couldn't fetch route information. Reason: ${data.status}</p>`;
        }
    })
    .catch(err => console.log(err));
}
