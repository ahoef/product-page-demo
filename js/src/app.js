let data = {};
let error = {
    isErrorState: false,
    message: ''
};
const env = nunjucks.configure('/templates');

/**
* Makes a GET request to the product database and saves
* the response to the data variable
*/
function getProducts() {
    $.ajax({
        url: "http://localhost:3000/products"
    })
    .success(function( results ) {
        console.log(results);
        return data.listItems = results;
    })
    .error(function() {
        updateErrorState(true, 'There was a problem receiving product data.');
        return renderMarkup();
    });
}

/**
* Makes a GET request to the cart order database, saves
* the response to the data variable, and calls function
* to render the template
*/
function getMiniCart() {
    $.ajax({
        url: "http://localhost:3000/cart_order"
    })
    .success(function(results) {
        console.log(results);
        data.cartItems = results;
        return renderMarkup();
    })
    .error(function() {
        updateErrorState(true, 'There was a problem receiving cart data.');
        return renderMarkup();
    });
}

/**
* Renders template markup based on data stored in data
* and error variables, and attaches it to the DOM
*/
function renderMarkup() {
    var template = env.render('main.html', {
        listItems: data.listItems,
        cartItems: data.cartItems,
        error: error
    });
    $('.product-page').html(template);
}

/**
* Updates current error state
* @param {Boolean} errorState - current error state
* @param {String} message - text to display in error field
*/
function updateErrorState(errorState, message) {
    return error = {
        isErrorState: errorState,
        message: message
    }
}

/**
* Makes POST request to add an item to the mini-cart
* @param {Object} item - clicked item's id, name, price,
* and description
*/
function addItem(item) {
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/cart_order",
        data: item
    })
    .success(function() {
        return getMiniCart();
    })
    .error(function() {
        updateErrorState(true, 'This item could not be added.');
        return renderMarkup();
    })
}

/**
* Makes DELETE request to remove a mini-cart item
* @param {Object} item - clicked item's id, name, price, description
*/
function deleteItem(item) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/cart_order/${item.id}`,
        data: item
    })
    .success(function() {
        getMiniCart();
    })
    .error(function() {
        updateErrorState(true, 'This item could not be deleted.');
        renderMarkup();
    })
}

/**
* Add & remove item click handler - resets error state
* to default, builds item object from button data
* attributes, and calls appropriate function based on
* clicked button's class
*/
$('body').on('click', '.button', function(){

    updateErrorState(false, '');
    console.log(error);

    const $this = $(this);
    const item = {
        id: $(this).data('id'),
        name: $(this).data('name'),
        price: $(this).data('price'),
        description: $(this).data('description')
    }

    console.log(item);

    if ($this.hasClass('add-item')) {
        return addItem(item);
    } else if ($this.hasClass('delete-item')) {
        return deleteItem(item);
    } else {
        return false;
    }

});

getProducts();
getMiniCart();
