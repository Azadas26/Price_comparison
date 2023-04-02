$(document).ready(function () {
    $("#uform").validate({
        rules: {
            name:
            {
                required: true,
                minlength: 4,
                maxlength: 6
            },
            email:
            {
                required: true,
                email: true

            },
            password:
            {
                required: true,
            }
        }
    })
})