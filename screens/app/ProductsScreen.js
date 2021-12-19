
import React, {useState, useEffect} from 'react';
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
import { UIActivityIndicator } from 'react-native-indicators';
import Toast from 'react-native-tiny-toast'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getProductsCatalog, getProductCategory, getShoppingCart, isLoadingShoppingCart, getUpdateError } from '../../store/reducers/purchaseReducer';
import { getUser } from '../../store/reducers/accountReducer'
import shoppingCartService from '../../services/shoppingCart.service';

import { CatalogProductCard } from '../../components/ProductCard';
import Response from '../../components/Response';
import Icon from '../../components/Icon'
import Colors from '../../constants/Colors';
import Sizes from '../../constants/Sizes';
import catalogService from '../../services/catalog.service';

//Produits (fruits/légumes/viandes/poissons)
const ProductsScreen = props => {
  const [displayMode, setDisplayMode] = useState('list')
  const [filters, setFilters] = useState({})
  const [visited, setVisited] = useState()
  const [cardWidth, setCardWidth] = useState()

  useEffect(() => {
    const { category } = props
    _calculateCardWidth({ window: Dimensions.get('window') })
    const { subCategories, states } = props.productCategory

    setFilters({
      selectedState: states && states.length > 0
        ? states[0]
        : undefined,
      selectedSubCategory: subCategories && subCategories.length > 0
        ? subCategories[0]
        : undefined
    })
  }, [])
  useEffect(() => {
    Dimensions.addEventListener("change", _calculateCardWidth);
    return () => {
      Dimensions.removeEventListener("change", _calculateCardWidth);
    }
  }, [])

  useEffect(() => {
    if (props.updateError) {
      Toast.show(props.updateError, {
        animationDuration: 1000
      })
    }
  }, [props.updateError])

  const _calculateCardWidth = ({ window }) => {
    const { width, height } = window

    const cardWidth = width < height
      ? (width - 3 * Sizes.smallSpace) / 2 //global padding is : smallSpace/2 + 2 cacrds of smallSpace/2 padding
      : (width - 4 * Sizes.smallSpace) / 3//global padding is : smallSpace/2 + 3 cacrds of smallSpace/2 padding
    setCardWidth(cardWidth)
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

  const _getSubCategoryFilter = () => {
    const { subCategories } = props.productCategory
    return filters.selectedSubCategory || (subCategories ? subCategories[0] : undefined)
  }

  const _getStateFilter = () => {
    const { states } = props.productCategory
    return filters.selectedState || (states ? states[0] : undefined)

  }

  const _displaySubCategoriesFilter = () => {
    const { subCategories } = props.productCategory

    if (subCategories) {
      const filter = _getSubCategoryFilter()
      return (
        <View>
          <ScrollView showsHorizontalScrollIndicator={false}
            horizontal contentContainerStyle={styles.filters_scroll}>
            {subCategories.map(subCategory => {
              return (
                <TouchableHighlight key={subCategory} underlayColor='transparent'
                  style={[styles.filter_button,
                  {
                    borderColor: Colors.orangeColor,
                    backgroundColor: filter === subCategory ? Colors.orangeColor : '#fff'
                  }]}
                  onPress={() => _applyFilter(subCategory, 'selectedSubCategory')}>
                  <Text style={[styles.filter_text,
                  {
                    color: filter === subCategory ? Colors.lightColor : Colors.orangeColor
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
    const { states } = props.productCategory
    if (states) {
      const filter = _getStateFilter()
      return (
        <View>
          <ScrollView showsHorizontalScrollIndicator={false} overScrollMode='always'
            horizontal contentContainerStyle={styles.filters_scroll}>
            {states.map(state => {
              return (
                <TouchableHighlight key={state} underlayColor='transparent'
                  style={[styles.filter_button,
                  {
                    borderColor: Colors.orangeColor,
                    backgroundColor: filter === state ? Colors.orangeColor : '#fff'
                  }]}
                  onPress={() => _applyFilter(state, 'selectedState')}>
                  <Text style={[styles.filter_text,
                  {
                    color: filter === state ? Colors.lightColor : Colors.orangeColor
                  }]}>{state}</Text>
                </TouchableHighlight>
              )
            })}
          </ScrollView>
        </View>
      )
    }
  }

  const _productsToShow = () => {
    const { productsCatalog, category } = props
    if (productsCatalog) {
      const products = productsCatalog.filter(product => product.category == category)
      const subCategoryFilter = _getSubCategoryFilter()
      const stateFilter = _getStateFilter()
      return products.filter(product =>
        (
          !stateFilter
          || product.state == stateFilter
        )
        && (
          subCategoryFilter == "Tout"
          || product.subCategory == subCategoryFilter
        )
        && (
          !filters.importationSelected
          || product.importationPrice
        )

      )
    }
  }

  const productsToShow = _productsToShow()
  const Header = () => {
    const isDisabled = !props.productCategory.importation
    return (
      <>
        {_displaySubCategoriesFilter()}
        {_displayStatesFilter()}
        <View style={styles.list_header}>
          <Text style={[styles.importation_text, { color: isDisabled ? Colors.grayedColor2 : Colors.darkColor }]}>Importation</Text>
          <Switch thumbColor='#fff'
            trackColor={{ true: Colors.yellowColor, false: isDisabled ? '#eee' : Colors.grayedColor2 }}
            onValueChange={(value) => _applyFilter(value, 'importationSelected')}
            value={filters.importationSelected}
            disabled={isDisabled} />

          <View style={styles.button_container}>

            <TouchableHighlight style={styles.button}
              underlayColor='transparent'
              onPress={() => { _changeDisplayMode('grid') }}>
              <Icon viewBox="0 0 35 35"
                width="25px"
                height="25px"
                name='grid'
                fill={displayMode == 'grid' ? Colors.mainColor : Colors.grayedColor2} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.button}
              underlayColor={'transparent'}
              onPress={() => { _changeDisplayMode('list') }}>
              <Icon viewBox="0 0 35 35"
                width="25px"
                height="25px"
                name='menu'
                fill={displayMode == 'list' ? Colors.mainColor : Colors.grayedColor2} />
            </TouchableHighlight>
          </View>
        </View>
      </>
    )
  }

  /*
  <View style={{ height:50}}><BarIndicator color={Colors.mainColor}/></View>
  <View style={{ height:50}}><BallIndicator style={{ height:50}}color={Colors.mainColor}/></View>
    <View style={{ height:50}}><DotIndicator color={Colors.mainColor}/></View>
    <View style={{ height:50}}><MaterialIndicator color={Colors.mainColor}/></View>
    <View style={{ height:50}}><PacmanIndicator color={Colors.mainColor}/></View>
    <View style={{ height:50}}><PulseIndicator color={Colors.mainColor}/></View>
    <View style={{ height:50}}><SkypeIndicator color={Colors.mainColor}/></View>
    <View style={{ height:50}}><UIActivityIndicator color={Colors.mainColor}/></View>
    <View style={{ height:50}}><WaveIndicator color={Colors.mainColor}/></View>
  */
  return (
    <View style={styles.main_container}>
      {productsToShow &&
        <View>
          {displayMode == 'grid'
            ? <ScrollView contentContainerStyle={styles.scroll_container}>
              <Header />

              <View style={styles.list_container}>
                {
                  productsToShow.map(product => {
                    return <CatalogProductCard key={product.id} {...product} 
                      category={props.category}
                      importation={filters.importationSelected}
                      width={cardWidth}
                      displayMode={displayMode}
                    />
                  })
                }
              </View>
            </ScrollView>
            : <FlatList ListHeaderComponent={Header}
              data={productsToShow}
              renderItem={({ item }) => <CatalogProductCard {...item}
                category={props.category}
                importation={filters.importationSelected}
                displayMode={displayMode} />}
              getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
              keyExtractor={item => item.id} />
          }
        </View>
      }
      {productsToShow && productsToShow.length == 0 &&
        <Response text="Cette catégorie est vide"
          subText="Des produits seront prochainement ajouté"
          icon='empty' />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.lightColor
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
  importation_text: {
    fontSize: Sizes.defaultTextSize
  },
  button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    padding: 5,
    marginLeft: Sizes.smallSpace,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    color: Colors.darkColor,
    fontSize: Sizes.defaultTextSize,
    textAlign: 'center',
  },
  response_indication: {
    margin: Sizes.smallSpace,
    marginLeft: Sizes.mediumSpace,
    marginRight: Sizes.mediumSpace,
    color: Colors.grayedColor2,
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

const mapStateToProps = (state, ownProps) => ({
  productsCatalog: getProductsCatalog(state.purchase),
  productCategory: getProductCategory(state.purchase, ownProps.category),
  updateError: getUpdateError(state.purchase),
  shoppingCart: getShoppingCart(state.purchase),
  isLoadingShoppingCart: isLoadingShoppingCart(state.purchase),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getShoppingCart: shoppingCartService.getShoppingCart,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen);
