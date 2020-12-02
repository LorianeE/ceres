import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddProductArea from './components/AddProductArea';
import ShoppingList from './components/ShoppingList';
import ShoppingHeader from './components/ShoppingHeader';
import CreateListComponent from './components/CreateListComponent';
// import Spinner from '../common/Spinner';
import SnackbarError from '../common/SnackbarError';
import { getFilledShoppingList } from '../../utils/ShoppingListMapper';
import { fetchProductsList } from '../../redux/actions/productsAction';
import {
  addItemAndSave,
  changeItemCommentAndSave,
  changeItemQuantityAndSave,
  fetchShoppingList,
  createNewShoppingList,
} from '../../redux/actions/shoppingAction';
import { resetErrorMessage } from '../../redux/actions/errorAction';
import { sortByLabel } from '../../utils/ProductsUtils';

const ShoppingContainer = ({
  userShoppingList,
  fetchProducts,
  fetchList,
  products,
  // loading,
  shoppingList,
  shelves,
  changeItemQuantity,
  changeItemComment,
  addItem,
  createList,
  error,
  resetErrorMsg,
}) => {
  const [shoppingMode, setShoppingMode] = useState(false);
  const [itemsRemoved, setItemsRemoved] = useState([]);

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (userShoppingList && !shoppingList.length) {
      fetchList(userShoppingList);
    }
  }, [fetchList, shoppingList.length, userShoppingList]);

  const switchShoppingMode = () => {
    if (shoppingMode) {
      setItemsRemoved([]);
    }
    setShoppingMode(!shoppingMode);
  };

  const removeItem = (itemId) => {
    const removedItem = shoppingList.find((item) => item.id === itemId);
    changeItemQuantity(itemId, -1);
    const newLastItemRemoved = {
      ...removedItem,
      quantity: 1,
    };
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
  };

  const cancelRemoveItem = () => {
    const lastItemRemoved = itemsRemoved[itemsRemoved.length - 1];
    const itemInList = shoppingList.find((item) => item.id === lastItemRemoved.id);
    if (itemInList) {
      changeItemQuantity(itemInList.id, lastItemRemoved.quantity);
    } else {
      addItem(lastItemRemoved);
    }
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1);
    setItemsRemoved(newItemsRemoved);
  };

  const addItemFromProductArea = (item) => {
    const existingItem = shoppingList && shoppingList.find((i) => i.product.id === item.product.id);
    if (existingItem) {
      changeItemQuantity(existingItem.id, 1);
    } else {
      addItem({
        ...item,
        product: item.product.id,
        quantity: 1,
      });
    }
  };

  // if (loading) {
  //   return <Spinner />;
  // }
  return (
    <>
      {!userShoppingList ? (
        <CreateListComponent createShoppingList={createList} />
      ) : (
        <>
          <ShoppingHeader
            shoppingMode={shoppingMode}
            switchShoppingMode={switchShoppingMode}
            hasRemovedItems={itemsRemoved.length >= 1}
            cancelRemoveItem={cancelRemoveItem}
          />
          {!shoppingMode && <AddProductArea products={products} addItem={addItemFromProductArea} />}
          <ShoppingList
            shoppingList={shoppingList}
            shelves={shelves}
            removeItem={removeItem}
            shoppingMode={shoppingMode}
            changeItemQuantity={changeItemQuantity}
            changeItemComment={changeItemComment}
          />
        </>
      )}
      {error && <SnackbarError error={error} onClose={resetErrorMsg} />}
    </>
  );
};

ShoppingContainer.propTypes = {
  userShoppingList: PropTypes.string.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  // loading: PropTypes.bool.isRequired,
  shoppingList: PropTypes.arrayOf(PropTypes.object).isRequired,
  shelves: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeItemQuantity: PropTypes.func.isRequired,
  changeItemComment: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  resetErrorMsg: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    userShoppingList: state.user.shoppingLists[0],
    products: sortByLabel([...state.products.dbList, ...state.products.userList]),
    // loading: state.apiCallsInProgress.apiCalls > 0,
    shoppingList: getFilledShoppingList(state.shoppingList.items, state.products.dbList),
    shelves: Array.from(
      new Set(getFilledShoppingList(state.shoppingList.items, state.products.dbList).map((item) => item.product.shelf))
    ).sort(),
    error: state.error.errorMsg,
  };
};

const mapDispatchToProps = {
  fetchProducts: fetchProductsList,
  fetchList: fetchShoppingList,
  changeItemQuantity: changeItemQuantityAndSave,
  changeItemComment: changeItemCommentAndSave,
  addItem: addItemAndSave,
  createList: createNewShoppingList,
  resetErrorMsg: resetErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingContainer);
