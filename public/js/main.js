$('#deleteModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget); // Button that triggered the modal
  let id = button.data('id'); // Extract info from data-* attributes
  let title = button.data('title');
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  let modal = $(this);
  modal.find('#deleteModalTitle').text("Delete " + title + "?");
  modal.find('#deleteModalDescription').text("Are you sure you want to delete the products " + title + "?");
  modal.find('#deleteModalDeleteButton').attr("href", "/dashboard/products/")

});
