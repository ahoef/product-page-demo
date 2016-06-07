// Nunjucks template environment
const environment = nunjucks.configure('/templates');

// Global data store for application's state
let state = {
    listItems: [],
    cartItems: [],
    notification: '',
    error: ''
};


/**
* Makes a GET request to products endpoint, saves
* response to data store, calls function to render
*/
function getProducts() {
    $.ajax({
        url: "http://localhost:3000/products"
    })
    .success(results => {
        state.listItems = results;
        return renderMarkup();
    })
    .error(() => {
        updateError('There was a problem receiving product data.');
    });
}

/**
* Makes a GET request to cart_order endpoint, saves
* response to data store, calls function to render
*/
function getMiniCart() {
    $.ajax({
        url: "http://localhost:3000/cart_order"
    })
    .success(results => {
        state.cartItems = results;
        return renderMarkup();
    })
    .error(() => {
        updateError('There was a problem receiving cart data.');
    });
}

/**
* Calculates cart total by converting cart item price
* strings to integers, renders template markup based
* on data store, and attaches template to DOM
*/
function renderMarkup() {
    let total = 0;
    state.cartItems.forEach(product => {
        const priceInteger = parseInt(product.price.slice(1));
        total = total + priceInteger;
    });

    const template = environment.render('main.html', {
        listItems: state.listItems,
        cartItems: state.cartItems,
        error: state.error,
        notification: state.notification,
        total: total
    });

    $('.product-page').html(template);
}

/**
* Updates current error state in data store,
* calls function to render
* @param {String} message - text to display
*/
function updateError(message) {
    state.error = message;
    return renderMarkup();
}

/**
* Updates current notification state in data store
* @param {String} message - text to display

*/
function updateNotification(message) {
    state.notification = message;
}

/**
* Checks if item clicked is already in cart, if not,
* makes POST request to add an item to mini-cart
* @param {Object} item - clicked item's id, name,
* price, description
*/
function addItem(item) {

    state.cartItems.forEach(product => {
        if(product.id === item.id) {
            state.notification = 'Item is already in cart!';
            renderMarkup();
            return;
        }
    })

    if (state.notification === '') {
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/cart_order",
            data: item
        })
        .success(() => {
            updateNotification('Item added!');
            getMiniCart();
        })
        .error(() => {
            updateError('This item could not be added.');
        })
    }
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
    .success(() => {
        updateNotification('Item deleted!');
        getMiniCart()
    })
    .error(() => {
        updateError('This item could not be deleted.');
    })
}

/**
* Add & remove item click handler - resets error and
* notification states to default, builds item object
* from button data attributes, and calls appropriate
* function based on clicked button's class
*/
$('body').on('click', 'button', function(){

    state.error = '';
    state.notification = '';

    const $this = $(this);
    const item = {
        id: $(this).data('id'),
        name: $(this).data('name'),
        price: $(this).data('price'),
        description: $(this).data('description')
    }

    if ($this.hasClass('add-item')) {
        addItem(item);
    } else {
        deleteItem(item);
    }
});

getProducts();
getMiniCart();
