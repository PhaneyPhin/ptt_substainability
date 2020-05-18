// JavaScript Document


function activeMenu(el) {
	var id = $(el).data("id");
	$(el).addClass("active");
	if ($(".list-menu-" + id).find('.box-sub-menu').length > 0) {
		$(".menu").hide();
		$(".list-menu-" + id).show();
		$(".main-sub.active").delay(100).fadeIn();
		$(".box-sub-menu").delay(100).fadeIn();
		$(".main-menu").addClass("main-menu-sub");
		$(".menu0").removeClass("main-menu");
	}
}


$(document).delegate('.menu', 'click', function () {
	$(".menu.active").removeClass("active");
	activeMenu(this);
});

$(document).delegate('.main-menu-sub', 'click', function (e) {
	$(".main-sub.active").hide();
	$(".main-sub.active").removeClass("active");

	$(".menu").animate({
		opacity: 1,
		height: "toggle"
	}, 200, function () {
	});
	$(".box-sub-menu").hide();
	$(".menu0").removeClass("main-menu-sub");
	$(".menu0").addClass("main-menu");
});

$(document).delegate('#main-menu', 'click', function (e) {
	$(".menu.active").hide();
	$(".menu.active").removeClass("active");
	$(".box-sub-menu").hide();
	$(".menu").show(300);
});


function selctMenu(currentRoute) {
	$('.menu').each(function () {
		if (currentRoute.indexOf($(this).data('root')) === 0) {
			activeMenu(this);
			return;
		}
	});
}
function selctMenuHandle(currentRoute) {
	$('.menu').each(function () {
		if (currentRoute.indexOf($(this).data('root')) === 0) {
			activeMenu(this);
			return;
		}
	});
}



function initFaqIcon() {
	function toggleIcon(e) {
		$(e.target)
			.prev('.card-header')
			.find(".svg-inline--fa")
			.toggleClass('fa-plus fa-minus');
	}

	$('.faq').on('hidden.bs.collapse', toggleIcon);
	$('.faq').on('shown.bs.collapse', toggleIcon);
}

