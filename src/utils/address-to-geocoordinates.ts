import 'dotenv/config';
import axios from 'axios';

export interface Address {
  house: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface Geocoordinates {
  latitude: number | null;
  longitude: number | null;
}

/**
 * Converts an address to geocoordinates (latitude, longitude) using Google Maps Geocoding API.
 * @param address Address object
 * @returns Geocoordinates { latitude, longitude }
 */
export async function convertAddressToGeocoordinates(address: Address): Promise<Geocoordinates> {
  const fullAddress = `${address.house}, ${address.street}, ${address.city}, ${address.state}, ${address.country}`;
  let latitude: number | null = null;
  let longitude: number | null = null;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY is not set in environment variables.');
    return { latitude, longitude };
  }
  try {
    const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: fullAddress,
        key: apiKey,
      },
    });
    if (
      geoRes.data &&
      geoRes.data.status === 'OK' &&
      geoRes.data.results &&
      geoRes.data.results.length > 0
    ) {
      latitude = geoRes.data.results[0].geometry.location.lat;
      longitude = geoRes.data.results[0].geometry.location.lng;
    } else {
      console.error('Google Maps Geocoding API error:', geoRes.data.status, geoRes.data.error_message);
    }
  } catch (e) {
    console.error('Geocoding failed:', e?.message || e);
  }
  return { latitude, longitude };
}
