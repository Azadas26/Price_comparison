cartpro = function (Id) {
    $.ajax({
        url: '/cart?id=' + Id,
        method: 'get',
        success: (response) => {

            if (response.status) {
                var count = $('#cut').html()
                count = parseInt(count) + 1
                $('#cut').html(count)
            }
        }
    })
}