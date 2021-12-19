import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-tiny-toast'

import Loading from '../../components/Loading';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import mapService from '../../services/map.service';

const MapPositionScreen = props => {

  const { location, province, municipality } = props
  const { setPosition, cancel, restaurant } = props
  const map=useRef()
  const region = location
    ? {
      longitude: location.lng,
      latitude: location.lat,
      latitudeDelta: 0.0165,
      longitudeDelta: 0.0105
    }
    : {
      latitude: 36.803,
      longitude: 2.903,
      latitudeDelta: 11,
      longitudeDelta: 11
    }

  const [_address, _setAddress]=useState({
    municipality,
    province,
  })
  const [_location, _setLocation]=useState(location)
  const [_region, _setRegion]=useState(region)
  const [_waintingForCurrentLocation, _setWaintingForCurrentLocation]=useState(false)

  const _hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  const _useCurrentLocation = async () => {

    const hasLocationPermission = await _hasLocationPermission();
    if (!hasLocationPermission) {
      return;
    }
    _setWaintingForCurrentLocation(true)
    Geolocation.getCurrentPosition((position) => {
      let coordinate = {
        latitude: parseFloat(position.coords.latitude),
        longitude: parseFloat(position.coords.longitude),

      };
      _updatePosition(coordinate)

    }, (error) => {
      _setWaintingForCurrentLocation(false)
      console.log(error);
    },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true });
  }

  const _chooseMapPosition = (e) => {
    const { coordinate } = e.nativeEvent
    _setWaintingForCurrentLocation(true)
    _updatePosition(coordinate)
  }

  const _updatePosition = (coordinate) => {
    const newRegion = {
      ...coordinate,
      latitudeDelta: Math.min(_region.latitudeDelta, 0.0165),
      longitudeDelta: Math.min(_region.longitudeDelta, 0.0105)
    }

    map.current.animateToRegion(newRegion, 2000)
    _setLocation({
        lng : coordinate.longitude,
        lat : coordinate.latitude
    })

    setTimeout(() => {
      mapService.reverseGeocode(coordinate).then(place => {
        _setWaintingForCurrentLocation(false)
        _setAddress(place)
      }).catch(error => {

        _setWaintingForCurrentLocation(false)
        Toast.show("Echec de detesction de l'adresse", {
          animationDuration: 1000
        })
      })
    }, 2500)



  }

  const _updateRegion = (e) => {
    _setRegion(e)
  }


  
  return (
    <View style={{ flex: 1 }}>
      <MapView ref={map}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={_region}
        onRegionChangeComplete={_updateRegion}
        onPress={_chooseMapPosition}>

        {_location &&
          <Marker coordinate={{ longitude: _location.lng, latitude: _location.lat }}
            title={restaurant}>
            <Icon viewBox="0 0 32 32"
              width="45px"
              height="45px"
              name='restaurantPin'
              fill={Colors.redColor} />
          </Marker>
        }

      </MapView>

      <View style={styles.search_container}>
        <TouchableHighlight style={styles.rounded_button}
          underlayColor='transparent'
          onPress={() => cancel()}>
          <Icon viewBox="0 0 35 35"
            width="20px"
            height="20px"
            name='back'
            fill='#4688F1' />
        </TouchableHighlight>
        <Text style={styles.address_text}>{_address.province ? `${_address.municipality ? _address.municipality + ", " : ""}${_address.province}` : "Région"}</Text>

        {!_waintingForCurrentLocation &&
          <TouchableHighlight style={styles.rounded_button}
            underlayColor='transparent'
            onPress={_useCurrentLocation}>
            <Icon viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="gpsIndicator"
              fill='#4688F1' />
          </TouchableHighlight>
        }
        {_waintingForCurrentLocation &&
          <View style={styles.loading_container}><Loading size={25} /></View>}
      </View>

      <TouchableHighlight style={[styles.large_button,
      { backgroundColor: !_waintingForCurrentLocation ? Colors.mainColor : Colors.mainColorDisabled }]}
        underlayColor={Colors.mainColorOnPress}
        disabled={_waintingForCurrentLocation}
        onPress={() => setPosition(_location, _address.municipality, _address.province)}>
        <Text style={styles.button_text}>Ok</Text>
      </TouchableHighlight>

    </View>
  )
}


const styles = StyleSheet.create({

  search_container: {
    position: 'absolute',
    top: Sizes.smallSpace,
    left: Sizes.smallSpace,
    right: Sizes.smallSpace,
    flexDirection: 'row',
    height: 45,
    marginBottom: Sizes.smallSpace,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 3,
    backgroundColor: '#fff'
  },
  address_text: {
    textAlignVertical: 'center',
    flex: 1,
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
    fontSize: Sizes.defaultTextSize,
  },
  large_button: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
  },
  button_text: {
    color: Colors.lightColor,
    fontSize: Sizes.defaultTextSize
  },
  rounded_button: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading_container: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1
  },

});



export default MapPositionScreen
