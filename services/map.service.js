import Api from '../constants/ApiEndPoints';

export default {
  reverseGeocode
}

function reverseGeocode(coordinate) {
  const requestUrl = `${Api.algoliaEndPoint}/1/places/reverse?aroundLatLng=${coordinate.latitude},${coordinate.longitude}&hitsPerPage=1&language=fr`
  return fetch(requestUrl)
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        console.log(response.error);
      }
      const place = Array.from(response.hits).map(place => {
        return {
          municipality: place.city ? place.city[0] : undefined,
          province: place.administrative[0].split(" - ")[0]
        }
      })[0]
      return place;
    })
    .catch(error => {
      console.log(error);
      throw error
    })
}
