import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Colors from '../constants/Colors';
import authService from '../services/auth.service';
import { signInMethod } from '../store/reducers/accountReducer';

class CheckAuthScreen extends React.Component {

  componentDidMount() {
    const user = authService.getCurrentUser()
    setTimeout(() => {
      if (user) {
        this.props.signIn(signInMethod)
      }else this.props.signOut()
    }, 3000)
  }

  render() {
    return (
      <View style={styles.main_container}>
        <UIActivityIndicator color={Colors.mainColor} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor
  }
})

const mapDispatchToProps = dispatch => bindActionCreators({
  signOut: authService.signOut,
  signIn: authService.signIn,
}, dispatch)

const mapStateToProps = state => ({
  signInMethod: signInMethod(state.account),
})
export default connect(mapStateToProps, mapDispatchToProps)(CheckAuthScreen);
