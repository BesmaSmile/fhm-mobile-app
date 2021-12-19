import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Dimensions
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';

import Loading from '../../components/Loading';
import Response from '../../components/Response';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProfile, getUserAccount } from '../../store/reducers/accountReducer'

import profileService from '../../services/profile.service';
import hooks from '../../tools/hooks';
import {format} from '../../tools/phoneNumberHandler';
import _ from 'lodash'
//Mon compte
const AccountScreen = (props) => {
  const { width, height } = Dimensions.get('window')
  const deviceHeight = height > width ? height : width
  const [contentViewHeight, setContentViewHeight] = useState(deviceHeight * 0.7)
  const [photoUri, setPhotoUri] = useState()
  const loadProfileRequest = hooks.useRequestState()
  const updateProfilePhotoRequest = hooks.useRequestState()

  useEffect(() => {
    const { userProfile, getUserProfile } = props
    if (!userProfile) {
      loadProfileRequest.sendRequest(getUserProfile)
    }
  }, [])

  const openImagePicker = () => {
    const options = {
      title: 'Choisir une photo de profile',
      takePhotoButtonTitle: 'Camera',
      chooseFromLibraryButtonTitle: 'Galerie',
      cancelButtonTitle: 'Annuler',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const { uri } = response
        updateProfilePhotoRequest.sendRequest(() => props.updateProfilePhoto(uri))
      }
    });
  }

  const { userProfile, userAccount, getUserProfile } = props
  let completedInformations = userProfile && userProfile.firstname &&
    userProfile.lastname &&
    userProfile.phoneNumber &&
    userProfile.restaurant &&
    _.get(userProfile, 'address.location') &&
    _.get(userProfile, 'address.province') &&
    _.get(userProfile, 'address.municipality')
  const location = _.get(userProfile, 'address.location')

  const region = location ? {
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.0055,
    longitudeDelta: 0.0035
  } : {
      latitude: 36.803,
      longitude: 2.903,
      latitudeDelta: 20,
      longitudeDelta: 20
    }
  let mark;
  return (
    <>
      {!loadProfileRequest.pending && !loadProfileRequest.error &&
        <ScrollView style={styles.main_container}
          contentContainerStyle={styles.scroll_content} >
          <View style={
            [styles.content_container, { minHeight: contentViewHeight }]} >
            <View style={styles.picture_container} >
              {!userAccount || !userAccount.photoURL &&
                <Icon viewBox="0 0 32 32"
                  width="130px"
                  height="130px"
                  name="profile"
                  fill='#eee' />
              }
              {userAccount && userAccount.photoURL &&
                <Image style={[styles.picture, { opacity: updateProfilePhotoRequest.pending ? 0.5 : 1 }]}
                  source={{ uri: userAccount.photoURL }}
                />
              }
              {updateProfilePhotoRequest.pending &&
                <View style={styles.loading_container}><Loading /></View>
              }
              <TouchableHighlight style={styles.picture_button}
                underlayColor='transparent'
                onPress={openImagePicker} >
                <Icon viewBox="0 0 32 32"
                  width="15px"
                  height="15px"
                  name="plus"
                  fill="#ffffff" />
              </TouchableHighlight>
            </View>
            <View style={styles.infos_container}>
              {!completedInformations &&
                <Text style={styles.message_text}> Clicquez sur edit pour compléter vos informations... </Text>
              }
              {userProfile &&
                <>
                  {userProfile.firstname && userProfile.lastname && <Text style={styles.name_text} > {userProfile.firstname} {userProfile.lastname} </Text>}
                  {userProfile.restaurant && <Text style={styles.restaurant_text}> {userProfile.restaurant} </Text>}
                  {userProfile.phoneNumber && <Text style={styles.phone_text}> +213 {format(userProfile.phoneNumber.slice(4))} </Text>}
                  {_.get(userProfile, 'address.province') && <Text style={styles.address_text}> {`${_.get(userProfile, 'address.municipality') ? _.get(userProfile, 'address.municipality') + ", " : ""}${_.get(userProfile, 'address.province')}`} </Text>}
                </>
              }

            </View>
            <View style={[styles.map_container, { height: contentViewHeight * 0.5 }]} >
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={region}
                onLayout={() => { if (mark) mark.showCallout(); }} >
                {userProfile && _.get(userProfile, 'address.location') &&
                  <Marker coordinate={{ longitude: userProfile.address.location.lng, latitude: userProfile.address.location.lat }}
                    title={userProfile.restaurant}
                    ref={ref => { mark = ref; }} >
                    <Icon viewBox="0 0 32 32"
                      width="45px"
                      height="45px"
                      name='restaurantPin'
                      fill={Colors.redColor}
                    />
                  </Marker>
                }
              </MapView>
            </View>
          </View>
        </ScrollView>
      }
      {loadProfileRequest.pending && <Loading />}
      {loadProfileRequest.error &&
        <Response text={loadProfileRequest.error}
          subText="Vérifiez votre connexion et réessayez"
          icon='error'
          action="Réessayez"
          onClick={
            () => getUserProfile()}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scroll_content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content_container: {
    backgroundColor: '#fff',
    margin: Sizes.smallSpace,
    marginTop: 70,
    marginLeft: Sizes.largSpace,
    marginRight: Sizes.largSpace,
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#eee'
  },
  picture_container: {
    width: 130,
    height: 130,

    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: -80,
  },
  picture: {
    resizeMode: 'cover',
    width: 130,
    height: 130,
    borderRadius: 70,
    width: "100%",
  },
  picture_button: {
    position: 'absolute',
    bottom: 10,
    right: 3,
    height: 35,
    width: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blueColor
  },
  loading_container: {
    position: 'absolute',
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infos_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Sizes.mediumSpace,
    marginBottom: Sizes.mediumSpace
  },
  message_text: {
    color: Colors.redColor,
    fontSize: Sizes.smallText,
    textAlign: 'center',
    marginBottom: Sizes.smallSpace
  },
  name_text: {
    textAlign: 'center',
    fontSize: Sizes.mediumText,
    color: Colors.darkColor,
    marginBottom: Sizes.smallSpace
  },
  restaurant_text: {
    textAlign: 'center',
    fontSize: Sizes.defaultTextSize,
    color: Colors.grayedColor2
  },
  phone_text: {
    fontSize: Sizes.defaultTextSize,
    color: Colors.grayedColor2,
    marginTop: 5,
    marginBottom: Sizes.mediumSpace
  },
  address_text: {
    textAlign: 'center',
    fontSize: Sizes.defaultTextSize,
    opacity: 0.7,
    color: Colors.grayedColor2
  },
  map_container: {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.grayedColor1,
  },
  map: {
    flex: 1
  }
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateProfilePhoto: profileService.updateProfilePhoto,
  getUserProfile: profileService.getUserProfile,
}, dispatch)

const mapStateToProps = state => ({
  userProfile: getUserProfile(state.account),
  userAccount: getUserAccount(state.account)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);