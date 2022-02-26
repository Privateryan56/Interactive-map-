// create map out of userData.js
const userMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},
    
    buildMap() {
        this.map = L.map('map', {
        center: this.coordinates,
        zoom: 11,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/%22%3EMapbox</a>',
            minZoom: '15',
        }).addTo(this.map)
        const marker = L.marker(this.coordinates)
        marker.addTo(this.map)
        marker.bindPopup("<b>You Are Here</b>").openPopup();
    },
    // business markers for looped
    
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}


    // User Location
    async function getLoc() {
        position = await new Promise((resolve, reject)=> {
            navigator.geolocation.getCurrentPosition(resolve ,reject);
        })
        return [position.coords.latitude, position.coords.longitude]
    }
    console.log(getLoc());
    
    // 4square bs
    
    async function foursquare(business) {
        const options = {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
            }
        }
        let limit = 5
        let lat = userMap.coordinates[0]
        let lon = userMap.coordinates[1]
        let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
        let data = await response.text()
        let parsedData = JSON.parse(data)
        let businesses = parsedData.results
        return businesses
    }
    // process 
    function processBusinesses(data) {
        let businesses = data.map((element) => {
            let location = {
                name: element.name,
                lat: element.geocodes.main.latitude,
                long: element.geocodes.main.longitude
            };
            return location
        })
        return businesses
    }
    
    

    window.onload = async () => {
        const userLoc = await getLoc()
        userMap.coordinates = userLoc
        userMap.buildMap()
    }
// button for businesseseseseses
document.getElementById('submit').addEventListener('click', async (event) =>{
    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await foursquare(business)
    userMap.businesses = processBusinesses(data)
    userMap.addMarkers()
    console.log(business)
})
