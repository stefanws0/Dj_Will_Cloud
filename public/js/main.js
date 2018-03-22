//PASS DATA TO CONTENT
$(document).on("click", "#edit", function () {
  let title = $(this).data('title');
  let description = $(this).data('description');
  let price = $(this).data('price');
  console.log(description);
  console.log(title);
  $(".form-group #product-title").val(title); //Doesn't show anything
  $(".form-group #product-description").val(description); //Doesn't show anything
  $(".form-group #product-price").val(price); //Doesn't show anything
});


// fetch('products', {
//   method: 'put',
//   headers: {'Content-Type': 'application/json'},
//   body: JSON.stringify({
//     '_id' : document.getElementById('update')
//   })
// });
