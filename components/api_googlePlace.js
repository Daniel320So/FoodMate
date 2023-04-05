const API_KEY = "AIzaSyDTovu7zZTCP39wLMmAcC5PKC5YH5D1sQQ";

//Object Constructor
function GooglePlaceRestaurantResult(id, name, image_url, review_count, rating, price, location) {
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.review_count = review_count;
    this.rating = rating;
    this.price = price;
    this.location = location;
}

function GoogleReview(text, rating, userName) {
    this.text = text,
    this.rating = rating,
    this.userName = userName
}

//Returns 30 restaurants on the searched type and location
const searchRestaurantsByTypeAndLocation = async(type, location) => {
    let results;
    const url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=";
    let query = "";
    if (type && type !== "") query = `${type}%20`;
    query = query + `restaurants%20in%20${location}&key=${API_KEY}`;
    await fetch(url + query)
    .then(async(response) => {
        const data = await response.json();
        results = data.results.slice(0, 30).map( restaurant => {
            return new GooglePlaceRestaurantResult(
                restaurant.place_id,
                restaurant.name,
                restaurant.photos? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=${API_KEY}`: undefined,
                restaurant.user_ratings_total,
                restaurant.rating,
                restaurant.price_level,
                restaurant.formatted_address
            )
        });
    })
    
        //   {
        //     business_status: 'OPERATIONAL',
        //     formatted_address: '5 Northtown Way, North York, ON M2N 7A1, Canada',
        //     geometry: [Object],
        //     icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        //     icon_background_color: '#FF9E67',
        //     icon_mask_base_uri: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet',
        //     name: 'Sushi Bong',
        //     opening_hours: [Object],
        //     photos: [Array],
        //     place_id: 'ChIJgwUJWG0tK4gR3V2HPKc6u8c',
        //     plus_code: [Object],
        //     price_level: 1,
        //     rating: 4.3,
        //     reference: 'ChIJgwUJWG0tK4gR3V2HPKc6u8c',
        //     types: [Array],
        //     user_ratings_total: 1438
        //   }
    return results;
}

const getRestaurantDetailsByPlaceId = async (id) => {
    let results = {};
    await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${API_KEY}`)
    .then(async(response) => {
        const data = await response.json();
        results.details = new GooglePlaceRestaurantResult(
            data.result.place_id,
            data.result.name,
            data.result.photos? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${data.result.photos[0].photo_reference}&key=${API_KEY}`: undefined,
            data.result.user_ratings_total,
            data.result.rating,
            data.result.price_level,
            data.result.formatted_address
        )
        results.reviews = data.result.reviews.map( r => {
            return new GoogleReview(
                r.text,
                r.rating,
                r.author_name
            );
        });
    })
    return results;
}

module.exports = {
    searchRestaurantsByTypeAndLocation,
    getRestaurantDetailsByPlaceId
};