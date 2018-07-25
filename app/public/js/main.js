$(document).ready(function(){
$('.delete-data').on('click', function(e){

    $target = $(e.target);

    const id = $target.attr('data-id');
   $.ajax({

       type: 'DELETE',
       url: '/name/'+id,
       success: function(response){
           alert('Deleting data');
           window.location.href='/';

       },
       error: function(err) {

           console.log(err);
       }

   });
});
});