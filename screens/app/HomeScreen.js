import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import { BarIndicator } from 'react-native-indicators';

import ListItem from '../../components/ListItem';
import Card from '../../components/Card';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import catalogService from '../../services/catalog.service';

//Produicts (fruits/légumes/viandes/poissons)
const ProductsScreen = props => {
  const [category, setCategory] = useState(props.category)
  const [displayMode, setDisplayMode] = useState('list')
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState()
  const [productsToShow, setProductsToShow] = useState()
  const [subCategories, setSubCategories] = useState()
  const [states, setStates] = useState()
  const [filters, setFilters] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [visited, setVisited] = useState()
  const [cardWidth, setCardWidth] = useState()


  useEffect(() => {
    _calculateCardWidth({ window: Dimensions.get('window') })
    unsubscribe = props.navigation.addListener('focus', () => {
      if (!visited) {
        _loadProducts()
        setVisited(false)
      }
    });

    Dimensions.addEventListener("change", _calculateCardWidth);
    return () => {
      unsubscribe()
      Dimensions.removeEventListener("change", _calculateCardWidth);
    }
  })

  const _calculateCardWidth = ({ window }) => {
    const { width, height } = window
    const cardWidth = width < height
      ? (width - 3 * Sizes.smallSpace) / 2 //global padding is : smallSpace/2 + 2 cacrds of smallSpace/2 padding
      : (width - 4 * Sizes.smallSpace) / 3//global padding is : smallSpace/2 + 3 cacrds of smallSpace/2 padding
    setCardWidth(cardWidth)
  }

  const _loadProducts = () => {
    setErrorMessage()
    setIsLoading(true)
    catalogService.getProducts(category).then(result => {
      setIsLoading(false)
      setFilters({
        selectedSubCategory: result.subCategories && result.subCategories.length > 0
          ? result.subCategories[0]
          : undefined,
        selectedState: result.states && result.states.length > 0
          ? result.states[0]
          : undefined
      })
      setProducts(result.products)
      setSubCategories(result.subCategories)
      setStates(result.states)
      setIsLoading(false)
    }).catch(error => {
      setErrorMessage("Echec de chargement des données !")
      setIsLoading(false)
    })
  }

  const _loadImage = (id) => {
    const product = products.find(p => p.id == id)
    catalogService.getImageUrl(product.imagePath).then(imageUrl => {
      setProducts(products.map((p, i) => p.id == id ? { ...p, imageUrl } : p))
    })
  }

  const _changeDisplayMode = (mode) => {
    setDisplayMode(mode)
  }

  const _applyFilter = (value, key) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  const _productsToShow = () => {
    if (products) {
      return products.filter(product =>
        (
          !filters.selectedState
          || product.state == filters.selectedState
        )
        && (
          filters.selectedSubCategory == "Tout"
          || product.subCategory == filters.selectedSubCategory
        )
        && (
          !filters.importationSelected
          || product.importationPrice
        )

      )
    }
  }

  const _displaySubCategoriesFilter = () => {
    if (subCategories) {
      return (
        <View>
          <ScrollView showsHorizontalScrollIndicator={false}
            horizontal contentContainerStyle={styles.filters_scroll}>
            {subCategories.map(subCategory => {
              return (
                <TouchableHighlight key={subCategory} underlayColor={Colors.secondaryColorOnPress}
                  style={[styles.filter_button,
                  {
                    borderColor: Colors.secondaryColor,
                    backgroundColor: filters.selectedSubCategory === subCategory ? Colors.secondaryColor : '#fff'
                  }]}
                  onPress={() => _applyFilter(subCategory, 'selectedSubCategory')}>
                  <Text style={[styles.filter_text,
                  {
                    color: filters.selectedSubCategory === subCategory ? Colors.lightColor : Colors.secondaryColor
                  }]}>{subCategory}</Text>
                </TouchableHighlight>
              )
            })}
          </ScrollView>
        </View>
      )
    }

  }

  const _displayStatesFilter = () => {
    if (states) {
      return (
        <View>
          <ScrollView showsHorizontalScrollIndicator={false} overScrollMode='always'
            horizontal contentContainerStyle={styles.filters_scroll}>
            {states.map(state => {
              return (
                <TouchableHighlight key={state} underlayColor={Colors.mainColorOnPress}
                  style={[styles.filter_button,
                  {
                    borderColor: Colors.mainColor,
                    backgroundColor: filters.selectedState === state ? Colors.mainColor : '#fff'
                  }]}
                  onPress={() => _applyFilter(state, 'selectedState')}>
                  <Text style={[styles.filter_text,
                  {
                    color: filters.selectedState === state ? Colors.lightColor : Colors.mainColor
                  }]}>{state}</Text>
                </TouchableHighlight>
              )
            })}
          </ScrollView>
        </View>
      )
    }
  }

  const { name } = props.route
  const productsToShow = _productsToShow()
  const Header = () => {
    return (
      <>
        {_displaySubCategoriesFilter()}
        {_displayStatesFilter()}
        <View style={styles.list_header}>
          <TouchableHighlight style={styles.button}
            underlayColor={'transparent'}
            onPress={() => { _changeDisplayMode('list') }}>
            <Icon viewBox="0 0 30 30"
              width="25px"
              height="25px"
              name='list'
              fill={displayMode == 'list' ? Colors.mainColor : Colors.grayedColor} />
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}
            underlayColor='transparent'
            onPress={() => { _changeDisplayMode('grid') }}>
            <Icon viewBox="0 0 30 30"
              width="25px"
              height="25px"
              name='grid'
              fill={displayMode == 'grid' ? Colors.mainColor : Colors.grayedColor} />
          </TouchableHighlight>
          <Text style={styles.list_title}>{name}</Text>
          {importation &&
            <>
              <Text style={styles.importation_text}>Importation</Text>
              <Switch thumbColor='#fff' trackColor={{ true: 'orange', false: Colors.grayedColor }}
                onValueChange={(value) => _applyFilter(value, 'importationSelected')}
                value={filters.importationSelected} />
            </>
          }
        </View>
      </>
    )
  }
  const Response = () => {
    return (
      <>
        {productsToShow && productsToShow.length == 0 &&
          <View style={styles.response_container}>
            <Icon viewBox="0 0 32 32"
              width="70px"
              height="70px"
              name='empty'
              fill={Colors.grayedColor} />
            <Text style={styles.response_message}>Aucun produit n'est disponible dans cette catégorie !</Text>
          </View>
        }
        {errorMessage &&
          <View style={styles.response_container}>
            <Icon viewBox="0 0 32 32"
              width="70px"
              height="70px"
              name='warning'
              fill={Colors.grayedColor} />
            <Text style={styles.response_message}>{errorMessage}</Text>
            <Text style={styles.response_indication}>Vérifiez votre connexion et réessayez</Text>
            <TouchableHighlight underlayColor={Colors.mainColorOnPress}
              style={styles.retry_button}
              onPress={() => _loadProducts()}>
              <Text style={styles.retry_text}>Réessayez</Text>
            </TouchableHighlight>
          </View>
        }
      </>
    )
  }
  return (
    <View style={styles.main_container}>

      {isLoading && <BarIndicator color={Colors.mainColor} />}
      {!isLoading && productsToShow &&
        <View>
          {displayMode == 'grid'
            ? <ScrollView contentContainerStyle={styles.scroll_container}>
              <Header />

              <View style={styles.list_container}>
                {
                  productsToShow.map(product => {
                    return <Card key={product.id} {...product}
                      importation={filters.importationSelected}
                      loadImage={_loadImage}
                      width={cardWidth} />
                  })
                }
              </View>
            </ScrollView>
            : <FlatList ListHeaderComponent={Header}
              onRefresh={_loadProducts}
              refreshing={isLoading}
              data={productsToShow}
              renderItem={({ item }) => <ListItem {...item} importation={filters.importationSelected} loadImage={_loadImage} />}
              getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
              keyExtractor={item => item.id}
              extraData={filters} />
          }
        </View>
      }
      <Response />

    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  filters_scroll: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: Sizes.smallSpace
  },
  filter_button: {
    marginRight: Sizes.smallSpace,
    paddingLeft: Sizes.smallSpace,
    paddingRight: Sizes.smallSpace,
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1,
  },
  filter_text: {
    fontSize: Sizes.defaultTextSize,
  },
  list_header: {
    margin: Sizes.smallSpace,
    flexDirection: 'row',
    alignItems: 'center'
  },
  list_title: {
    flex: 1,
    fontSize: Sizes.defaultTextSize,
    color: Colors.defaultTextColor
  },
  importation_text: {
    fontSize: Sizes.smallText,
    color: Colors.defaultTextColor,
    marginRight: Sizes.smallSpace
  },
  button: {
    padding: 5,
    marginRight: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  scroll_container: {
    marginBottom: Sizes.smallSpace,
    flexGrow: 1
  },
  list_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  response_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.largSpace
  },
  response_message: {
    marginTop: Sizes.largSpace,
    marginLeft: Sizes.mediumSpace,
    marginRight: Sizes.mediumSpace,
    color: Colors.defaultTextColor,
    fontSize: Sizes.defaultTextSize,
    textAlign: 'center',
  },
  response_indication: {
    margin: Sizes.smallSpace,
    marginLeft: Sizes.mediumSpace,
    marginRight: Sizes.mediumSpace,
    color: Colors.grayedColor,
    fontSize: Sizes.smallText,
    textAlign: 'center',
  },
  retry_button: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.mainColor,
    marginTop: Sizes.largSpace,
    padding: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retry_text: {
    color: Colors.mainColor,
    fontSize: Sizes.defaultTextSize
  },
})

export default ProductsScreen;
