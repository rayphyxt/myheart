(function($, document) {
	$.fn.extend({
		posHandler: function (opt) {
			var _this = this;
			var defOpt = {
				pos: {
					left: 0,
					top: 0
				},
				callback: Function()
			};
			var resOpt = $.extend(true, {}, defOpt, opt);
			_this.changePos(resOpt.pos);
			resOpt.callback(_this);
		},
		changePos: function (style) {
			var _this = this;
			$('.posHandler').remove();
			var box = $('<div class="posHandler">\
							<ul>\
								<li pst="0">置顶</li>\
								<li pst="1">向上一层</li>\
								<li pst="2">向下一层</li>\
								<li pst="3">置底</li>\
							</ul>\
						</div>');
			box.css(style).appendTo('body').on('mousedown', 'li', function(e) {
				e.preventDefault();
				var pst = $(this).attr('pst');
				var parentPage = $(_this).parents('.page'),
					dragBox = $(_this).parent();
				if(pst == '0') {
					parentPage.append(dragBox);
				} else if(pst == '1') {
					dragBox.next().after(dragBox);
				} else if(pst == '2'){
					dragBox.prev().before(dragBox);
				} else if(pst == '3'){
					parentPage.prepend(dragBox);
				}
			});
		}
	});
	$(document).on('mousedown', function(e) {
		$('.posHandler').remove();
	});
})(jQuery, document);
