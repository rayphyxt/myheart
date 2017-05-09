(function($, document) {
	$.fn.extend({
		removable: function (opt) {
			var me = this;
			var defOpt = {
				position: "right top",
				callback: Function()
			};
			var resOpt = $.extend(true, {}, defOpt, opt);
			var box = $('<div class="delbox"><i class="iconfont icon-close-2"></i></div>');
			box.appendTo(me).on('click', function(e) {
				e.preventDefault();
				$(me).parent('.drag-container').remove();
				resOpt.callback(me);
			});
		}
	});
})(jQuery, document);
