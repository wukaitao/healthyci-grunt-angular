/**
 * Created by ming on 16/4/6.
 */

var target = document.getElementById('slider');
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

var mySwiper = new Swiper('.swiper-container', {
  pagination: '.swiper-pagination',
  paginationClickable: true,
  direction: 'vertical',

  onTouchEnd: function(swiper){
    var index = swiper.activeIndex;
  }
});
