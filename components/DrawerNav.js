import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getUserAccount, getUserProfile, signInMethod } from '../store/reducers/accountReducer'
import { getNews } from '../store/reducers/newsReducer';

import Icon from '../components/Icon'
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';
import authService from '../services/auth.service';
import newsService from '../services/news.service';

const Item = ({ item, active }) => {
  const navigation = useNavigation()
  const { title, icon, screenName, notif } = item

  return (
    <TouchableHighlight underlayColor='transparent'
      onPress={() => {
        navigation.navigate(screenName)
      }}>
      <View style={[styles.item_container, active ? styles.active : styles.inactive]}>
        <View style={styles.icon_container}><Icon viewBox="0 0 32 32"
          width="25px"
          height="25px"
          name={icon}
          fill={active ? Colors.mainColor : Colors.darkColor} />
        </View>
        <Text style={[styles.item_title, active ? styles.active_text : styles.inactive_text]}>{title}</Text>
        {notif > 0 && <Text style={styles.badge}>{notif.toString()} </Text>}
      </View>
    </TouchableHighlight>
  );
}

const DrawerNav = (props) => {
  const { screen, userAccount, userProfile, signInMethod, news, resetNewsCount } = props;

  const items = [
    {
      title: 'Accueil',
      screenName: 'Home',
      icon: 'home',
    },
    {
      title: 'Nouveauté',
      screenName: 'News',
      icon: 'news',
      notif: news.count
    },
    {
      title: 'Mon panier',
      screenName: 'ShoppingCart',
      icon: 'shoppingCart',
    },
    {
      title: 'Mes commandes',
      screenName: 'Orders',
      icon: 'check',
    },
    {
      title: 'Mon profil',
      screenName: 'Account',
      icon: 'user',
    },
    {
      title: 'A props',
      screenName: 'Support',
      icon: 'support',
    }


  ]

  const signOut = () => {
    props.signOut(signInMethod)
  }

  const NavHeader = () => {
    return (
      <View style={styles.nav_header}>
        <TouchableHighlight style={styles.profile_button}>
          <>
            {!userAccount || !userAccount.photoURL &&
              <Icon viewBox="0 0 32 32"
                width="60px"
                height="60px"
                name="profile"
                fill='#eee' />
            }
            {userAccount && userAccount.photoURL &&
              <Image style={styles.image}
                source={{ uri: userAccount.photoURL }} />
            }
          </>
        </TouchableHighlight>
        <Text style={styles.header_text}>{userProfile && userProfile.firstname && userProfile.lastname ? `${userProfile.firstname} ${userProfile.lastname}` : ''}</Text>
      </View>
    )
  }

  const NavFooter = () => {
    return (
      <View style={styles.nav_footer}>
        <TouchableHighlight onPress={signOut} underlayColor={'transparent'}>
          <View style={styles.signout_button}>
            <Icon viewBox="0 0 30 30"
              width="25px"
              height="25px"
              name="logout"
              fill={Colors.darkColor} />
            <Text style={styles.footer_text}>Déconnexion</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  useEffect(() => {
    if (items[props.state.index].screenName == 'News')
      resetNewsCount();
  }, [props.state.index])

  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <NavHeader />
      {items.map((item, index) => {
        return <Item key={index} item={item} active={props.state.index == index} />
      })}
      <NavFooter />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  nav_container: {
    flex: 1
  },
  scroll_content: {
    flexGrow: 1
  },
  nav_header: {
    padding: Sizes.mediumSpace,
    paddingTop: Sizes.largSpace,
    alignItems: 'flex-start',
    backgroundColor: Colors.mainColor
  },
  header_text: {
    color: Colors.lightColor,
    fontSize: Sizes.mediumText,
    fontWeight: 'bold'
  },
  profile_button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginBottom: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden'

  },
  image: {
    resizeMode: 'cover',
    width: 60,
    height: 60
  },
  item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Sizes.mediumSpace,
    paddingRight: Sizes.mediumSpace,
    paddingTop: Sizes.mediumSpace,
    paddingBottom: Sizes.mediumSpace,
  },
  item_title: {
    marginLeft: Sizes.mediumSpace,
    fontSize: Sizes.defaultTextSize,
    flex: 1
  },
  icon_container: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.redColor,
    fontSize: 12,
    fontWeight: 'bold'

  },
  nav_footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  signout_button: {
    padding: Sizes.mediumSpace,
    marginBottom: Sizes.mediumSpace,
    flexDirection: 'row',
    alignItems: 'center'
  },
  footer_text: {
    fontSize: Sizes.smallText,
    color: Colors.darkColor,
    marginLeft: Sizes.smallSpace,
    alignSelf: 'flex-end'
  },
  active: {
    //backgroundColor: Colors.mainColor
  },
  inactive: {
    //backgroundColor : '#fff'
  },
  active_text: {
    color: Colors.mainColor,
    fontWeight: 'bold'
  },
  inactive_text: {
    color: Colors.grayedColor2
  }
})
const mapDispatchToProps = dispatch => bindActionCreators({
  signOut: authService.signOut,
  resetNewsCount: newsService.resetNewsCount
}, dispatch)

const mapStateToProps = (state) => ({
  userAccount: getUserAccount(state.account),
  userProfile: getUserProfile(state.account),
  signInMethod: signInMethod(state.account),
  news: getNews(state.news),
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNav);
