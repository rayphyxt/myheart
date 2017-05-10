(function($) {
	$.extend({
		alert: function (type, msg, callback) {
			var toaster = $('<div class="toaster"></div>'),
				icon = $('<div class="iconfont"></div>'),
				txt = $('<div class="r-text"></div>');
			var font = {
				'success': 'icon-confirm',
				'error': 'icon-close'
			};
			type = type || 'success';
			msg = msg || '';
			icon.addClass(font[type]);
			txt.append(msg);
			toaster.append(icon).append(txt).appendTo('body');
			setTimeout(function(){
				toaster.remove();
				typeof callback === 'function' && callback();
			}, 3000);
		}
	});
})(jQuery);
