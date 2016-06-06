let data = {};

const env = nunjucks.configure('/templates');

function renderMarkup() {
    console.log('within render Markup');
    var template = env.render('main.html', { listItems: data.listItems, cartItems: data.cartItems });
    $('.product-page').html(template);
}

function getProducts() {
  $.ajax({
  url: "http://localhost:3000/products"
})
  .done(function( results ) {
    console.log(results);
    data.listItems = results;
    // var template = env.render('list.html', { listItems: results });
    // $('.product-listing').append(template);

  });
}

function getMiniCart() {
  console.log('within getMiniCart')
  $.ajax({
  url: "http://localhost:3000/cart_order"
})
  .done(function( results ) {
    console.log(results);
    data.cartItems = results;
    renderMarkup();
  });
}


getProducts();
getMiniCart();





