// Nunjucks template environment
const environment = nunjucks.configure('/templates');

// Global data store for application's state
let data = {
    listItems: [],
    cartItems: [],
    error: ''
};


/**
* Makes a GET request to product database, saves
* response to data store, calls function to render
*/
function getProducts() {
    $.ajax({
        url: "http://localhost:3000/products"
    })
    .success(function(results) {
        console.log(results);
        data.listItems = results;
        return renderMarkup();
    })
    .error(function() {
        updateError('There was a problem receiving product data.');
    });
}

/**
* Makes a GET request to cart order database, saves
* response to data store, calls function to render
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
        updateError('There was a problem receiving cart data.');
    });
}


/**
* Calculates cart total by converting item price
* strings to integers, renders template markup based
* on data store, and attaches template to DOM
*/
function renderMarkup() {
    let total = 0;
    data.cartItems.forEach(function(product) {
        const priceInteger = parseInt(product.price.slice(1));
        total = total + priceInteger;
    });

    const template = environment.render('main.html', {
        listItems: data.listItems,
        cartItems: data.cartItems,
        error: data.error,
        total: total
    });
    $('.product-page').html(template);
}

/**
* Updates current error state in data store
* @param {String} message - text to display
*/
function updateError(message) {
    data.error = message;
    console.log(data);
    renderMarkup();
}

/**
* Makes POST request to add an item to mini-cart
* @param {Object} item - clicked item's id, name,
* price, description
*/
function addItem(item) {
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/cart_order",
        data: item
    })
    .success(getMiniCart)
    .error(function() {
        updateError('This item could not be added.');
    })
}

/**
* Makes DELETE request to remove a mini-cart item
* @param {Object} item - clicked item's id, name,
* price, description
*/
function deleteItem(item) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/cart_order/${item.id}`,
        data: item
    })
    .success(getMiniCart)
    .error(function() {
        updateError('This item could not be deleted.');
    })
}

/**
* Add & remove item click handler - resets error state
* to default, builds item object from button data
* attributes, and calls appropriate function based on
* clicked button's class
*/
$('body').on('click', '.button', function(){

    updateError('');
    console.log(data.error);

    const $this = $(this);
    const item = {
        id: $(this).data('id'),
        name: $(this).data('name'),
        price: $(this).data('price'),
        description: $(this).data('description')
    }

    console.log(item);

    if ($this.hasClass('add-item')) {
        addItem(item);
    } else {
        deleteItem(item);
    }
});

getProducts();
getMiniCart();
