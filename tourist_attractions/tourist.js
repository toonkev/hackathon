// tourist.js

function openNewWindowWithTouristAttractions(placeData) {
    let newWindow = window.open("", "_blank");

    let htmlContent = "<h1>Tourist Attractions</h1>";

    placeData.forEach(place => {
        htmlContent += `
            <div>
                <h2>${place.name}</h2>
                <p>${place.vicinity}</p>
                <p>Rating: ${place.rating ? place.rating : "No rating available"}</p>
            </div>
        `;
    });

    newWindow.document.write(htmlContent);
}

