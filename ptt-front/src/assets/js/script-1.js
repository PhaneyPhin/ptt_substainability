// JavaScript Document
	var urlserver = "";
		//	alert(window.location.hostname);
	if( window.location.hostname == '119.59.116.129' )
	{
			urlserver = "http://119.59.116.129/~smportal/";
	}
	else if( location.hostname == 'www.baanwebsite.com')
	{
		urlserver = "http://www.baanwebsite.com/customer/smportal/newdesign/";
	}
	else
	{
		urlserver = "http://"+window.location.hostname+"/baanwebsite/customer/smportal-new/";
	}	
		
	$("#title").load(urlserver+"include/title.html");  	  		
	$("#footer").load(urlserver+"include/footer.html"); 
	$("#right-menu-mb").load(urlserver+"include/right-menu-mb.html");  
	$("#Mainmenu").load(urlserver+"include/menu.html");  	   
	$("#NavbarMenu").load(urlserver+"include/navbar-menu.html");  	   	
	
	/***************************** ***********************/
 
	 $(document).ready(function(){
 
 			window.scrollReveal = new scrollReveal();
			
			window.sr = ScrollReveal();
				sr.reveal('.sr-icons', {
				duration: 600,
				scale: 0.3,
				distance: '0px'
			}, 200);

//urlserver		
				var urlserver = "";
				  
				  if( window.location.hostname == 'www.smportal.com' )
				  {
				   urlserver = "http://www.smportal.com/";
				  }
				  else if( location.hostname == 'www.baanwebsite.com')
				  {
				   urlserver = "http://www.baanwebsite.com/customer/smportal-new/";
				  }
				  else
				  {
				   urlserver = "http://localhost/baanwebsite/customer/smportal-new/";
				  }
//urlserver	
//alert(urlserver);
//				$("#right-menu-mb").load(urlserver+"/include/right-menu-mb.html");
//				$("#footer").load(urlserver+"/include/footer.html");
//				$("#title-page").load(urlserver+"/include/title-page.html");

		 $('#navbarNav').on('show.bs.collapse', function () {
			$('.headbar-top').addClass('-collapse');
			$('.all-container').addClass('-collapse');
			$('.hamburgers-box .svg-inline--fa').addClass('fa-times');
		})
		$('#navbarNav').on('hidden.bs.collapse', function () {
			$('.headbar-top').removeClass('-collapse');
			$('.all-container').removeClass('-collapse');
			$('.hamburgers-box .svg-inline--fa').removeClass('fa-times');
			$('.hamburgers-box .svg-inline--fa').addClass('fa-bars');
		})		
		
	});