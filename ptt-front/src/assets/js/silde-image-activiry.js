// JavaScript Document


function initActivityImage() {

	$('#carousel').carouFredSel({
		responsive: true,
		circular: false,
		auto: false,
		items: {
			visible: 1,
			//						width: 200,
			height: '50%'
		},
		scroll: {
			fx: 'crossfade'  //kk  Possible values: "none", "scroll", "directscroll", "fade", "crossfade", "cover", "cover-fade", "uncover" or "uncover-fade".
		}
	});

	$('#thumbs').carouFredSel({
		responsive: true,
		circular: false,
		infinite: false,
		auto: false,
		prev: '#prev',
		next: '#next',
		items: {
			visible: {
				min: 4
				//max: 4
			},
		width: 100,
			height: '80%'
		}
	});

	$('#thumbs a').click(function () {
		$('#carousel').trigger('slideTo', '#' + this.href.split('#').pop());
		$('#thumbs a').removeClass('selected');
		$(this).addClass('selected');
		return false;
	});
}

function initAnnouncementGallaryImage() {

	$('#thumbs').carouFredSel({
		responsive: true,
		circular: false,
		infinite: false,
		auto: false,
		prev: '#prev',
		next: '#next',
		items: {
			visible: {
				min: 5
				//max: 4
			},
			//							width: 100,
			height: '80%'
		}
	});
}

function initAwardGallaryImage() {

	$('#thumbs').carouFredSel({
		responsive: true,
		circular: false,
		infinite: false,
		auto: false,
		prev: '#prev',
		next: '#next',
		items: {
			visible: {
				min: 5
				//max: 4
			},
			//							width: 100,
			height: '80%'
		}
	});
}

