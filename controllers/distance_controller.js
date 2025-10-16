import axios from "axios";

export const DistanceCalculator = async (req, res) => {
  try {
    // Helper function to convert degrees to radians
    function degreesToRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    // Haversine formula to calculate the distance between two coordinates
    function haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of Earth in kilometers
      const dLat = degreesToRadians(lat2 - lat1);
      const dLon = degreesToRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
          Math.cos(degreesToRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in kilometers
    }

    // Function to get latitude and longitude of an address using geocode.maps.co API
    async function getCoordinates(address) {
      const url = `https://geocode.maps.co/search?q=${address}&api_key=66ee7324b110e418683723hzb7f1726`;
      const response = await axios.get(url);
console.log(response?.data[0],"------")
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        throw new Error("Address not found");
      }
    }

    // Extract the addresses from the request body
    const { address1, address2 } = req.body;

    // Get coordinates of both addresses and calculate the distance
    const coords1 = await getCoordinates(address1);
    const coords2 = await getCoordinates(address2);

    // Calculate the distance using the Haversine formula
    const distance = haversineDistance(
      coords1.lat,
      coords1.lon,
      coords2.lat,
      coords2.lon
    );

    // Return the distance and the coordinates in the response
    res.json({
      distanceInKm: distance.toFixed(2),
      address1: coords1,
      address2: coords2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
