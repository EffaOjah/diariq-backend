const options = { method: 'GET' };

async function getGeo() {
    const options = { method: 'GET' };
    try {
        const result = await fetch(`https://ipgeolocation.abstractapi.com/v1?api_key=7bb3c779983343e1978ba863fad2c684`, options);
        const geo = await result.json();
        console.log(geo);

        return {
            city: geo.city,
            region: geo.region,
            country: geo.country,
            postalCode: geo.postal_code,
            latitude: geo.latitude,
            longitude: geo.longitude,
            timezone: geo.timezone,
        };
    } catch (error) {
        console.error(err)
        return error;
    }
}

module.exports = getGeo;