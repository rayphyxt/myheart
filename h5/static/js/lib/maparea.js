(function($, document) {
	$.fn.extend({
		maparea: function (opt) {
			var me = this;
			var defOpt = {
				cls: 'zoom',
				callback: Function()
			};
			var resOpt = $.extend(true, {}, defOpt, opt);
			var box = $('<a class="' + resOpt.cls + '" v="0"></a>');
			box.appendTo(me);
		}
	});
})(jQuery, document);
