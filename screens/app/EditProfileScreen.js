import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import BaseScreen from '../BaseScreen';
import MapPositionScreen from './MapPositionScreen';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';

import authService from '../../services/auth.service';
import profileService from '../../services/profile.service';
import { getUserProfile, getUserAccount } from '../../store/reducers/accountReducer'
import hooks from '../../tools/hooks';
import { format, clean } from '../../tools/phoneNumberHandler';
import _ from 'lodash';

const EditProfileScreen = (props) => {
  const phoneNumber = props.userProfile && props.userProfile.phoneNumber
    ? format(props.userProfile.phoneNumber.slice(4))
    : (props.userAccount && props.userAccount.phoneNumber
      ? format(props.userAccount.phoneNumber.slice(4))
      : '')
  const [userProfile, setUserProfile] = useState({
    firstname: _.get(props.userProfile, 'firstname', ''),
    lastname:  _.get(props.userProfile, 'lastname', ''),
    restaurant:  _.get(props.userProfile, 'restaurant', ''),
    address: {
      municipality: '',
      province: '',
      ...props.userProfile.address
    },
    phoneNumber,
  })
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [contryCodeVisibile, setContryCodeVisibile] = useState(phoneNumber && phoneNumber.length > 0 ? true : false)
  const [mapModalVisible, setMapModalVisible] = useState(false)
  const updateProfileRequest = hooks.useRequestState()

  const saveOnClick = () => {
    const { updateProfile } = props
    const phoneNumber = `+213${clean(userProfile.phoneNumber)}`
    updateProfileRequest.sendRequest(() => updateProfile({...userProfile, phoneNumber}),
      () => {
        setSuccessMessageVisible(true)
        setTimeout(() => {
          props.navigation.goBack()
        }, 2000)
      })

  }

  const setPosition = (location, municipality, province) => {
    setUserProfile({
      ...userProfile,
      address: {
        location,
        municipality,
        province
      }
    })
    setMapModalVisible(false)
  }

  const handleChange = (value, key) => {
    setUserProfile({
      ...userProfile,
      [key]: value
    })
  }

  const handlePhoneNumberChange = (text) => {
    let formattedNumber = undefined
    if (text && text.length > 0) {
      formattedNumber = format(text)

    } else {
      formattedNumber = ""
    }

    setUserProfile({
      ...userProfile,
      phoneNumber: formattedNumber
    })
  }

  const isFormValid = () => {
    const { firstname, lastname, phoneNumber, restaurant, address } = userProfile
    return phoneNumber && phoneNumber.length == 12 &&
      firstname && firstname.length > 0 &&
      lastname && lastname.length > 0 &&
      restaurant && restaurant.length > 0 &&
      _.get(address, 'location') &&
      _.get(address, 'province') &&
      _.get(address, 'municipality')
  }

  const onPhoneNumberFocus = () => {
    setContryCodeVisibile(true)
  }

  const onPhoneNumberBlur = () => {
    const { phoneNumber } = userProfile
    if (phoneNumber.length == 0)
      setContryCodeVisibile(false)
  }
  const firstnameInput = useRef(), phoneNumberInput = useRef(), restaurantInput = useRef(), addressInput = useRef();

  const { address } = userProfile
  const form = (
    <View style={styles.form_container}>
      {/*successMessageVisible && <Text style={{ color: Colors.greenColor }}>Informations enregistrées</Text>*/}
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          placeholder='Nom'
          maxLength={20}
          editable={!updateProfileRequest.pending}
          value={userProfile.lastname}
          onChangeText={(text) => handleChange(text, "lastname")}
          onSubmitEditing={() => firstnameInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          ref={firstnameInput}
          placeholder='Prénom'
          maxLength={20}
          editable={!updateProfileRequest.pending}
          value={userProfile.firstname}
          onChangeText={(text) => handleChange(text, "firstname")}
          onSubmitEditing={() => phoneNumberInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        {contryCodeVisibile && <Text style={styles.country_code}>+213</Text>}
        <TextInput style={styles.text_input}
          ref={phoneNumberInput}
          placeholder='Téléphone'
          keyboardType={'number-pad'}
          editable={!updateProfileRequest.pending}
          maxLength={12}
          value={userProfile.phoneNumber}
          onFocus={onPhoneNumberFocus}
          onBlur={onPhoneNumberBlur}
          onChangeText={handlePhoneNumberChange}
          onSubmitEditing={() => restaurantInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        <TextInput style={styles.text_input}
          ref={restaurantInput}
          placeholder='Restaurant'
          maxLength={30}
          editable={!updateProfileRequest.pending}
          value={userProfile.restaurant}
          onChangeText={(text) => handleChange(text, "restaurant")}
          onSubmitEditing={() => addressInput.current.focus()} />
      </View>
      <View style={styles.input_container}>
        <TouchableOpacity style={styles.address_input}
          onPress={() => setMapModalVisible(true)}>
          <TextInput style={styles.text_input}
            ref={addressInput}
            placeholder='Adresse'
            maxLength={30}
            value={_.get(address, 'province') ? `${_.get(address, 'municipality') ? _.get(address, 'municipality') + ", " : ""}${_.get(address, 'province')}` : undefined}
            editable={false}
            onSubmitEditing={saveOnClick} />
        </TouchableOpacity>

      </View>
      {_.get(address, 'location') &&
        <>
          <Text style={styles.coordinate_title}>Coordonnées GPS</Text>
          <Text style={styles.coordinate_value}>{`{ lng : ${Math.round(_.get(address, 'location.lng') * 100000) / 100000}, lat : ${Math.round(_.get(address, 'location.lat') * 100000) / 100000} }`}</Text>
        </>
      }

    </View>
  )

  const actions = (
    <TouchableHighlight style={[styles.button,
    { backgroundColor: isFormValid() ? Colors.mainColor : Colors.mainColorDisabled }]}
      underlayColor={Colors.mainColorOnPress}
      disabled={!isFormValid()}
      onPress={saveOnClick}>
      <Text style={styles.button_text}>Enregistrer</Text>
    </TouchableHighlight>
  )
  return (
    <>
      <Modal isVisible={mapModalVisible}
        style={styles.map_modal_container}
        onBackButtonPress={() => setMapModalVisible(false)}>
        <MapPositionScreen setPosition={setPosition}
          cancel={() => setMapModalVisible(false)}
          location={_.get(userProfile, 'address.location')}
          municipality={_.get(userProfile, 'address.municipality')}
          province={_.get(userProfile, 'address.province')}
          restaurant={userProfile.restaurant} />
      </Modal>
      <BaseScreen showAuthButtons={false}
        title="Modification profil"
        content={form}
        actions={actions}
        pending={updateProfileRequest.pending}
        errorMessage={updateProfileRequest.error} />
    </>
  )
}

const styles = StyleSheet.create({
  form_container: {
    flex: 2,
    justifyContent: 'center',
    marginBottom: Sizes.mediumSpace,
    marginTop: Sizes.mediumSpace
  },
  input_container: {
    flexDirection: 'row',
    height: 45,
    marginBottom: Sizes.smallSpace,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 3,
  },
  country_code: {
    fontSize: Sizes.smallText,
    borderRadius: 5,
    backgroundColor: Colors.grayedColor2,
    color: '#fff',
    alignSelf: 'center',
    marginLeft: Sizes.smallSpace,
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    textAlignVertical: 'center'
  },
  text_input: {
    flex: 1,
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
    fontSize: Sizes.defaultTextSize,
  },
  address_input: {
    flex: 1
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.mainColor,
    height: 45,
    borderRadius: 5,
    width: 200
  },
  button_text: {
    color: Colors.lightColor,
    fontSize: Sizes.defaultTextSize
  },
  map_modal_container: {
    flex: 1,
    margin: 0,
    backgroundColor: '#fff'
  },
  coordinate_title: {
    fontSize: Sizes.defaultTextSize,
    color: Colors.grayedColor2,
    marginTop: Sizes.smallSpace,
    marginBottom: Sizes.smallSpace
  },
  coordinate_value: {
    fontSize: Sizes.smallText,
    color: Colors.grayedColor2

  }
});

const mapDispatchToProps = dispatch => bindActionCreators({
  confirmPhoneNumber: authService.confirmPhoneNumber,
  signIn: authService.signIn,
  updateProfile: profileService.updateProfile
}, dispatch)

const mapStateToProps = state => ({
  userProfile: getUserProfile(state.account),
  userAccount: getUserAccount(state.account),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
