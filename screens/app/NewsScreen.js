import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getNews } from '../../store/reducers/newsReducer';
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import Icon from '../../components/Icon'
import FastImage from 'react-native-fast-image';
import { getImageUrl, loadingImageUrlError } from '../../store/reducers/imagesReducer';
import imagesService from '../../services/images.service';
import { format } from 'date-fns';

const mapStateToNewCardProps = (state, ownProps) => ({
  imageUrl: getImageUrl(state.images, ownProps.item.id),
  imageUrlError: loadingImageUrlError(state.images, ownProps.item.id)
})

const mapDispatchToNewCardProps = dispatch => bindActionCreators({
  getImageUrl: imagesService.getImageUrl
}, dispatch)

const NewCardElement = props =>{
  const { getImageUrl, imageUrl, imageUrlError, item } = props
  const { id, title, text, imageUrl : url, createdAt}= props.item
  useEffect(()=>{
    if (!imageUrl && !url) {
      getImageUrl("news", id)
    }
  }, [])
  return(
    <View style={styles.card_container}>
      <Text style={styles.title}>{title}</Text>
      {createdAt && <Text style={styles.date}>{format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}</Text>}
      <Text style={styles.text}>{text}</Text>
      {!imageUrl  && !url && 
        <View style={styles.loading_container}>
          <Icon viewBox="0 0 50 30"
            width="140px"
            height="70px"
            name="logo"
            fill={imageUrlError ? "#eee" : Colors.grayedColor} />
        </View>
      }
      {(imageUrl || url) &&
        <FastImage style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: imageUrl || url }} />
      }
    </View>
  )
}

const NewCard = connect(mapStateToNewCardProps, mapDispatchToNewCardProps)(NewCardElement)
//Nouveauté
const NewsScreen = (props) => {
  const {news} =props

  return (
    <View style={styles.main_container}>
      <FlatList 
        data={news.list}
        renderItem={({ item }) => <NewCard item={item}
        />}
        keyExtractor={item => item.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor
  },
  card_container: {
    marginBottom: 1,
    paddingHorizontal: 25,
    paddingVertical: Sizes.mediumSpace,
    backgroundColor: 'white',
    borderRadius: 5
  },
  loading_container: {
    height: 200,
    margin: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image :{
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.redColor,
    alignSelf:'center',
    width: '100%',
    borderRadius: 5,
    height:250
  },
  title:{
    fontWeight: 'bold',
    color: Colors.mainColor,
    fontSize :Sizes.mediumText,
  },
  date: {
    color: Colors.grayedColor,
    fontSize :Sizes.smallText,
    marginTop: Sizes.smallSpace,
  },
  text:{
    fontSize: Sizes.smallText,
    lineHeight: Sizes.smallText * 1.3,
    color: Colors.darkColor,
    fontWeight: '500',
    marginVertical: Sizes.mediumSpace
  }
})
const mapStateToProps = (state, props) => ({
  news: getNews(state.news),
})


export default connect(mapStateToProps)(NewsScreen);
