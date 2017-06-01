(function(MJJS, window) {
	MJJS.define('MJJS.common', {
		init: function() {
			this._init();
		},
		_init: function() {
			
		},
		defaultTable: {
			pageKey: 'pageNum',
			sizeKey: 'pageSize',
			successKey: 'code',
			successValue: '0',
			dataPath: 'data.list',
			totalPath: 'data.total'
		}
	});
	MJJS.define('MJJS.http', {
		ajax: function(type, url, data, success, error) {
			var _data, _success, _error;
			if (typeof(data)==='function') {
				_data    = {};
				_success = data;
				_error   = success;
			} else {
				_data    = data;
				_success = success;
				_error   = error;
			}
			$.ajax({
				url: MJJS.server.api + (url || ''),
				data: _data,
				type: type,
				success: function(d) {
					if (d.code==='0000') {
						if (typeof(_success)==='function') _success(d.data);
					} else {
						if (typeof(_error)==='function') _error(d);
					}
				},
				error: function(err) {
					if (typeof(_error)==='function') _error(err);
				}
			});
		},
		get: function(url, data, success, error) {
			this.ajax('get', url, data, success, error);
		},
		post: function(url, data, success, error) {
			this.ajax('post', url, data, success, error);
		}
	});
	MJJS.define('MJJS.upload', {
		init: function(parent, opts) {
			if (parent) {
				MJJS.ui.dropzone(parent, {
					url: opts.url,
					maxFiles: 1,
					maxFilesize: opts.max,
					addRemoveLinks: true,
					acceptedFiles: 'image/*',
					// acceptedFiles: '.apk,.ipa',
					dictDefaultMessage: '上传应用',
					init: function() {
						this.on('addedfile', function(file) {
							$.isFunction(opts.callback) && opts.callback(file);
						});
					},
					// 浏览器不支持时使用
					fallback: function() {
						
					}
				});
			}
		}
	});
	MJJS.define('MJJS.header', {
		userInfo: {},
		getUser: function() {
			var me = this;
			/*MJJS.http.post('/login/getUserInfo', function(data) {
				me.userInfo = data;
				console.log(data);
				$.isFunction(me.callback) && me.callback(data);
				$('#loginName').html(data.loginName);
			}, function(err) {
				console.log(err)
			})*/
		}
	});
	MJJS.header.getUser();
	MJJS.common.init();
})(MJJS, window);