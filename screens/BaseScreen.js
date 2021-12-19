import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import ProgressBar from 'react-native-progress/Bar'

import Icon from '../components/Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

import AuthButtons from '../components/AuthButtons';

class BaseScreen extends React.Component {
  constructor(props) {
    super(props)
    const { width, height } = Dimensions.get('window')
    const deviceHeight = height > width ? height : width
    this.state = {
      deviceHeight,
      thirdPartPending: false
    }
  }

  setThirdPartPending = (pending) => {
    this.setState({
      thirdPartPending: pending
    })
  }

  render() {
    const { title, content, actions, showAuthButtons, pending, errorMessage } = this.props
    const { deviceHeight, thirdPartPending } = this.state
    return (
      <ScrollView style={styles.main_container} contentContainerStyle={styles.scroll_content}>
        <View style={[styles.content_container, { minHeight: deviceHeight * 0.7 }]}>
          {thirdPartPending &&
          <ProgressBar width={null} 
            indeterminateAnimationDuration={2000}
            indeterminate={true}
            color={Colors.greenColor}
            borderRadius={0}
            unfilledColor='#eee'
            borderWidth={0} />
          }
          <View style={styles.padding_container}>
            {title && <Text style={styles.title}>{title}</Text>}
            {showAuthButtons && <AuthButtons setThirdPartPending={this.setThirdPartPending} />}
            {showAuthButtons &&
              <View style={styles.divider_container}>
                <View style={styles.divider_line}></View>
                <Text style={styles.divider_text}>Ou</Text>
                <View style={styles.divider_line}></View>
              </View>
            }
            <View style={styles.content}>
              {pending &&
                <View style={styles.response_container}>
                  <UIActivityIndicator color={Colors.mainColor} />
                </View>
              }
              {errorMessage &&
                <View style={styles.response_container}>
                  <View style={styles.error_container}>
                    <Icon viewBox="0 0 32 32"
                      width="25px"
                      height="25px"
                      name='warning'
                      fill='orange' />
                    <Text style={styles.error_text}>{errorMessage}</Text>
                  </View>
                </View>
              }
              {content}
            </View>
            <View style={styles.actions_container}>{actions}</View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  scroll_content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content_container: {
    backgroundColor: Colors.lightColor,
    margin: 20,
    overflow:'hidden',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3
  },
  padding_container:{
    padding:20
  },
  title: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: Sizes.mediumText,
    color: Colors.darkColor,
    marginTop: Sizes.largSpace,
    marginBottom: Sizes.mediumSpace,
  },
  actions_container: {
    height: 60,
    justifyContent: 'flex-end',
    marginTop: Sizes.mediumSpace,
    marginBottom: 60,
  },
  divider_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 30,
    width: 180,
    alignSelf: 'center',
    marginBottom: Sizes.mediumSpace
  },
  divider_text: {
    margin: Sizes.mediumSpace,
    fontSize: Sizes.defaultTextSize,
    marginBottom: -10,
    color: '#ccc'
  },
  divider_line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc'
  },

  response_container: {
    height: 60,
    marginTop: Sizes.mediumSpace,
    marginBottom: Sizes.mediumSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error_container: {
    flexDirection: 'row',
    width: "100%",
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: Sizes.smallSpace
  },
  error_text: {
    marginLeft: Sizes.smallSpace,
    color: 'orange',
    fontSize: Sizes.defaultTextSize,
    lineHeight: 30
  }
});

export default BaseScreen;
