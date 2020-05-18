








var myPrev = -1;


// $(document).delegate('.list-menu', 'click', function () {
//     var idactive = $(".multi-menu-sub.active").data("id");

//     var input = document.getElementById("range");
//     input.value = "3";

//     var GetmaxInput = parseInt($(".multi-menu-sub.active .menu-sub").length);

//     if (idactive != null && GetmaxInput > 6) {
//         $(".range-slider").show();
//         change();
//     }
//     else {
//         $(".range-slider").hide();
//     }
// });

// $(document).delegate('.input-range', 'click', function () {
//     change();
// });

function change() {
    var current = $("#range").val();
    if (myPrev == -1)
        myPrev = current;
    var prev = myPrev;
    myPrev = current;

    var GetmaxInput = $(".multi-menu-sub.active .menu-sub").length;
    var maxInput = GetmaxInput - 6;

    console.log(maxInput, GetmaxInput);

    if ((prev == 1 && current == 1) || (prev == 0 && current == 0)) {
        prev = maxInput;
    }

    var idactive = $(".left-menu .active").data("id");
    var firstchild = $(".list-menu-" + idactive).find(".menu-sub:first");
    var lastchild = $(".list-menu-" + idactive).find(".menu-sub:last");
    var BoxFirst = $(".multi-menu-sub.active .img-menu:first .box-icon").attr("data-id");

    if (prev > current) {
        if (BoxFirst == 1 && prev == 0) var forloop = maxInput; // เมนูที่1 อยู่ในลำดับที่1,  prev มาจากล่างสุด
        else var forloop = prev - current;
        for (i = 0; i < forloop; i++) {
            var firstchild = $(".list-menu-" + idactive).find(".menu-sub:first");
            var lastchild = $(".list-menu-" + idactive).find(".menu-sub:last");
            $(firstchild).insertAfter($(lastchild));
        }
    }
    else {
        if (prev == maxInput) var forloop = maxInput;
        else var forloop = current - prev;

        console.log(forloop);
        for (i = 0; i < forloop; i++) {
            var firstchild = $(".list-menu-" + idactive).find(".menu-sub:first");
            var lastchild = $(".list-menu-" + idactive).find(".menu-sub:last");
            $(lastchild).insertBefore($(firstchild));
        }
    }
}


function initListMenu() {

}