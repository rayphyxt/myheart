var elementCache = {},		// 组件对应元素缓存
	pageCache = [0],		// 页面信息缓存(每页上的元素数量)
	domCache = {},			// 组件对应表单缓存(每个控件对应的页面)
	currentEleId = '',		// 组件创建ID(userEle + 组件创建编号)
	currentPage = 0,		// 当前页面的index属性值
	pageTemp = '<li class="prePage"><div class="p-page"></div><a class="page-close"><i class="iconfont icon-close-2"></i></a><a class="page-add"><i class="iconfont icon-add"></i></a></li>',
	longPageTemp = '<li class="prePage"><div class="p-page"></div></li>',
	pagePTemp = '<section class="page"></section>',
	page,					// 当前显示内容
	currentEleType,			// 组件类型
	currentContent,			// 组件文本(可无)
	hash = '',				// 站点hashId(存放站点文件的文件夹名)
	status,					// 站点发布状态
	id,						// 站点id(数据库id)
	sW = 320,				// 一屏宽度
	sH = 486,				// 一屏高度
	heightRate = 1;			// 长页初始屏数
$(function() {
// 元素属性
if (window.Drag && window.Element) return;
window.Drag = {
	init: function() {
		var me = this;
		me.bindEvent(me);
		me.setHeight();
		$('.butn').eq(0).trigger('click');
	},
	common: {
		swapItems: function(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		}
	},
	setHeight: function() {
		var val = Math.round($('#page>.page.active').height()/sH);
		if($('#pageHeight').length > 0) {
			$('#pageHeight').val(val).trigger('change');
		} else {
			$('#page>.page.active').height(sH);
		}
	},
	defaultColorConfig: {
		color: "rgb(1, 1, 1)",
		flat: true,
		showInput: false,
		className: "full-spectrum",
		// allowEmpty:true,
		showInitial: false,
		showPalette: true,
		showPaletteOnly: true,
		clickoutFiresChange: false,
		cancelText: '默认',
		chooseText: '选择',
		showSelectionPalette: false,
		hideAfterPaletteSelect: true,
		maxPaletteSize: 10,
		preferredFormat: "hex3",
		localStorageKey: "spectrum.demo",
		change: function(color) {},
		palette: [
			'#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
			'#f29b76', '#fff799', '#acd598', '#84ccc9', '#88abda', '#f19ec2',
			'#ec6941', '#fff45c', '#80c269', '#13b5b1', '#448aca', '#ea68a2',
			'#e60012', '#fff100', '#22ac38', '#009e96', '#0068b7', '#e4007f',
			'#a40000', '#b7aa00', '#097c25', '#00736d', '#004986', '#a4005b',
			'#7d0000', '#8a8000', '#005e15', '#005752', '#003567', '#7e0043',
			'#ffffff', '#e5e5e5', '#bfbfbf', '#959595', '#434343', '#000000'

			/*"rgb(255, 255, 255)","rgb(0, 0, 0)","rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)",

			"#fffffe", "#e3e4e5", "#21d4d8", "#1292b3", "#00bef2", "#69cef5", "#4993c8", "#0062b8", "#6666ff", "#7749f5",
			"#9621c1", "#cc29b1", "#f41484", "#f074ac", "#f16c74", "#48e0c3", "#42c2b3", "#0c9467", "#17a53c", "#7ed321",
			"#b7d989", "#f4f47a", "#f7df00", "#ddb208", "#cc6d1f", "#f97f2d", "#fc532b", "#e01e36", "#545454", "#000001"*/
		]
	},
	bindEvent: function(me) {
		me.bindUtilEvent(me);
		me.background.init(me);
		me.text.init(me);
		me.img.init(me);
		me.img_group.init(me);
		me.button.init(me);
		me.form.init(me);
		me.tel.init(me);
		me.link.init(me);
		me.ebform.init(me);
		$('#form').on('click', '.e-tabs', function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
	},
	bindUtilEvent: function(me) {
		page = $('.page')[0];

		var eleReset = function(id) {
			if (id) {
				$('#'+id, page).trigger('mousedown').trigger('mouseup');
			} else {
				$('.butn').eq(0).trigger('click');
			}
		}
		// 页面添加
		$('.viewlist .pagecard').on('click', '.page-add', function(e) {
			e.preventDefault();
			var len = $('.prePage').length;
			if (len < 10) {
				// 在当前页后新建
				var pageview = $(this).parent('.prePage');
				var idx = pageview.attr('index');
				var prepage = $(pageTemp).attr('index', pageCache.length);
				var sec = $(pagePTemp).attr('index', pageCache.length);
				$('.page[index='+idx+']').after(sec);
				pageCache.push(0);
				$(pageview).after(prepage);
				prepage.find('.p-page').trigger('click');
				// me.setHeight();
			} else {
				$.alert('error', '至多展示10个站点噢~');
			}
		})
		// 页面删除
		.on('click', '.page-close', function(e) {
			e.preventDefault();
			var len = $('.prePage').length;
			if (len > 1) {
				if (confirm('您真的确定要删除吗')) { 
					var idx = $(this).parents('.prePage').attr('index');
					$('.page[index='+idx+']').remove();
					pageCache[idx] = -1;
					$(this).parents('.prePage').remove();
					$('.p-page').eq(0).trigger('click');
					// me.setHeight();
					eleReset(currentEleId);
				}
			} else {
				$.alert('error', '当前页不能删除');
			}
		})
		// 页面激活
		.on('click', '.p-page', function(e) {
			e.preventDefault();
			var idx = $(this).parents('.prePage').attr('index');
			if (currentPage != idx) {
				$('.prePage').removeClass('active');
				$('.prePage[index='+idx+']').addClass('active');
				$('.page').removeClass('active');
				$('.page[index='+idx+']').addClass('active');
				currentPage = idx - 0;
				page = $('.page[index='+currentPage+']')[0];

				var currId = '';
				$('#form').empty();
				if($('div[class^=input-]:eq(0)', page).length > 0) {
					currId = $('div[class^=input-]:eq(0)', page).attr('id');
				}
				// me.setHeight();
				eleReset(currId);
			}
			Element.showLeftPreview();
		});

		// 长页面屏数
		$('#pageHeight').on('change', function() {
			var val = $(this).val() - 0;
			$('#page>.page.active').height(Math.round(val * sH));
			$('#screenH').text(Math.round(val * sH * 2));
			heightRate = val;
		});

		// 禁止鼠标选中事件
		document.onselectstart = function(e) {
			e.preventDefault();
		};
		// 禁止鼠标右击事件
		document.oncontextmenu = function(e){
			e.preventDefault();
		};
		/*
			选取控件事件
			1. 创建预览dom，可选取、拖拽
			2. 读取对应控件模板，并绑定自定义事件
		 */
		$('.compt').on('click', '.butn', function(e) {
			e.preventDefault();
			$('.butn').removeClass('active');
			$(this).addClass('active');
			currentEleType = $(this).data('type');
			currentContent = $(this).data('content') || '';
			if (currentEleType) {
				renderEle(function(ele) {
					renderForm(ele);
				});
			}
		});

		var butnActive = function(type) {
			var actbutn = $('.butn[data-type='+type+']');
			$('.butn').removeClass('active');
			actbutn.addClass('active');
		};

		var renderEle = function (cb) {
			var opts = {
				text: currentContent,
				basic: [{},{},{},{}]
			};
			if (currentEleType != 'background') {
				var eleNum = ++pageCache[currentPage];
				$(page).attr('num', eleNum);
				Element.init(currentEleType, page, opts, eleNum, function(ele) {
					$.isFunction(cb) && cb(ele);
				});
			} else {
				currentEleId = '';
				__load__(currentEleType, function() {
					$('#form > [class^=fm-]').attr('rid', currentEleId);
					$.isFunction(Drag[currentEleType].formLoaded) && Drag[currentEleType].formLoaded();
					butnActive(currentEleType);
				});
			}
		};
		var renderForm = function (dom) {
			if (!dom) return;
			currentEleId = dom.id;
			currentEleType = $(dom).data('type');
			// 已发布的站点中的已有表单不可编辑，但是可以删除，可以增加新的表单
			if (status == 'RELEASE_ONLINE' && (currentEleType == 'form' || currentEleType == 'ebform') && $(dom).attr('fid')) {
				$.alert('error', '站点已发布，该表单不可编辑!');
				return;
			}
			if(currentEleType) {
				$('.form').empty();
				__load__(currentEleType, function() {
					$('#form > [class^=fm-]').attr('rid', currentEleId);
					$.isFunction(Drag[currentEleType].formLoaded) && Drag[currentEleType].formLoaded(dom.id);
					butnActive(currentEleType);
				});
			}
		};
		var __load__ = function(type, cb) {
			currentEleId && selectElement($('#' + currentEleId, page)[0], type);
			if (domCache[type]) {
				if (!/(ebform|form|img_group)/.test(type)) $('.form').html(domCache[type]);
				$.isFunction(cb) && cb();
			} else {
				$.ajax({
					url: '../view/component/' + type + '.html',
					success: function(d) {
						if (!/(ebform|form|img_group)/.test(type)) $('.form').html(d);
						domCache[type] = d;
						$.isFunction(cb) && cb();
					},
					error: function(err) {
						console.log(err);
					}
				});
			}
		};

		var moveFlag = false, moveEle, ox = oy = 0, pos;
		var selectElement = function (dom, type) {
			$('#page .drag-container').removeClass('active');
			$(dom).parent().addClass('active');
			return dom;
		}

		var filterFixedAttr = function (dom) {
			// 不固定悬浮的元素(按钮、链接)，bottom设为空
			var eletype = $(dom).data('type'),
				eletop = $(dom).parent()[0].style.top;
			if ((eletype === 'button' || eletype === 'link') && eletop !== 'auto') {
				$(dom).parent().css('bottom', '');
				$('[fix]', dom).attr('fix', '0');
				$('.zoom', dom).show();
				$('[name=bfix][value=0], [name=lfix][value=0]', '#form').prop('checked', true);
			}
		}

		// 元素操作事件
		$('body').on('mousedown', '#page .page div[class^=input-]', function (e) {
			if(e.button === 2) {
				e.preventDefault();
				e.stopPropagation();
				ox = e.offsetX || 0;
				oy = e.offsetY || 0;
				pos = $(this).offset();
				var mpleft = e.pageX || ox + pos.left;
				var mptop = e.pageY || oy + pos.top;
				$(this).posHandler({
					pos: {
						left: mpleft,
						top: mptop
					}
				});
			} else {
				moveFlag = true;
				moveEle = this;
			}
		}).on('mouseup', function (e) {
			if(moveFlag && moveEle) {
				filterFixedAttr(moveEle);
				if (moveEle.id != currentEleId) {
					var ele = $('#' + moveEle.id),
						et = ele.attr('et');
					if (et != '1') renderForm(moveEle);
				}
			}
			moveFlag = false;
			moveEle = null;
		}).on('keyup', function (e) {
			e.preventDefault();
			if((e.keyCode || e.which) == 46) {
				// $('#' + currentEleId).remove();
			}
		}).on('click', '.closer', function(e) {
			e.preventDefault();
			$('.cover').fadeOut(function () {
				$('.page_show').empty();
			});
		}).on('contextmenu', '.page .drag-container', function(e) {
			// e.preventDefault();
			// console.log(e.pageX, e.pageY);
		});
	},
	background: {
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			$('#form').on('click', '.fm-background .bgcolor', function(e) {
				$('.sp-flat', this).toggleClass('hide');
			})
			// 添加背景按钮
			.on('change', '.bgBtn', function(e) {
				var img = $('.fm-background .editImg');
				me.img.createImg($(this), function(src, width, height, size) {
					$('.fm-background .editImg').css({
						'background-image': 'url(' + src + ')'
					});
					$('#page>.page[index='+currentPage+']').css({
						backgroundImage: 'url('+src+')'
					}).attr('d-src', src).attr('imgsize', size);;
				});
			})
			// 删除背景按钮
			.on('click', '.delBgBtn', function(e) {
				$('#page>.page[index='+currentPage+'], .fm-background .editImg').css({
					backgroundImage: ''
				}).removeAttr('d-src').removeAttr('imgsize');
				$('.fm-background .bgBtn').val('');
			});
		},
		formLoaded: function () {
			var cpage = $('#page>.page[index='+currentPage+']');
			var bgc = cpage.css('background-color');
			var bgi = cpage.css('background-image');
			$('.fm-background .editImg').css({
				'background-color': bgc,
				'background-image': bgi
			});
			$('.fm-background #color').spectrum($.extend({}, Drag.defaultColorConfig, {
				// color: $('.fm-background .editImg').css('background-color') || 'rgb(255, 255, 255)',
				change: function(color) {
					$('#page>.page[index='+currentPage+'], .fm-background .editImg').css({
						backgroundColor: color.toHexString()
					});
					// $('.fm-background .flat .sp-flat').addClass('hide');
				}
			}));
			$('.fm-background .sp-flat').addClass('hide');

			// 建议背景高度
			if($('#pageHeight').length > 0) {
				$('#screenH').text(Math.round(sH * 2 * heightRate));
			}
		}
	},
	text: {
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			$('#form').on('change', '.txtfz', function(e) {
				var rid = $('.fm-text').attr('rid');
				$('#' + rid + ' .text').css('font-size', $(this).val());
			}).on('click', '.font[data-class]', function(e) {
				e.preventDefault();
				var rid = $('.fm-text').attr('rid');
				$('#' + rid + ' .text').toggleClass($(this).data('class'));
			}).on('click', '.font[data-classgroup]', function(e) {
				e.preventDefault();
				var rid = $('.fm-text').attr('rid'),
					align = $(this).data('classgroup'),
					text = $('#' + rid + ' .text');
				text.removeClass('text-left text-center text-right').addClass(align);
			}).on('input', '.txta', function(e) {
				e.preventDefault();
				var rid = $('.fm-text').attr('rid');
				$('.text', '#' + rid).html($(this).val());
			}).on('click', '.fm-text .flat', function(e) {
				e.preventDefault();
				$('.sp-flat', this).toggleClass('hide');
			});
		},
		formLoaded: function(rid) {
			var dom_text = $('#' + rid + ' .text').html(),
				fz = $('#' + rid + ' .text').css('font-size');
			$('.txta', '.fm-text').val(dom_text);
			$('.txtfz', '.fm-text').val(fz);
			$('.txta', '.fm-text').select();
			$('.fm-text #color').spectrum($.extend({}, Drag.defaultColorConfig, {
				color: $('#' + rid + ' .text').css('color'),
				change: function(color) {
					$('#' + rid + ' .text').css('color', color.toHexString());
					// $('.fm-text .flat .sp-flat').addClass('hide');
				}
			}));
			$('.fm-text .flat .sp-flat').addClass('hide');
		}
	},
	img: {
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			$('#form').on('change', '.replaceBtn', function(e) {
				var img = $('.fm-img .editImg');
				sf.createImg($(this), function(src, width, height, size) {
					$('.fm-img .editImg').css({
						'background-image': 'url(' + src + ')'
					});
					$('#' + currentEleId + ' .img').attr('src', src).attr('imgsize', size);;
					if (width > sW) {
						height = height / width * sW;
						width = sW;
						$('#' + currentEleId).parent('.drag-container').css('left', 0);
					}
					if ($('#pageHeight').length == 0) {
						if (height > sH) {
							width = width / height * sH;
							height = sH;
							$('#' + currentEleId).parent('.drag-container').css('top', 0);
						}
					} else {
						var rate = $('#pageHeight').val() - 0;
						if (height > sH * rate) {
							width = width / height * (sH * rate);
							height = sH * rate;
							$('#' + currentEleId).parent('.drag-container').css('top', 0);
						}
					}
					$('#' + currentEleId).width(width);
					$('#' + currentEleId).height(height);
				});
			})
			.on('click', '.delBtn', function(e) {
				$('#' + currentEleId).css({
					width: sW - 20
				});
				$('.img', '#' + currentEleId).attr('src', '../img/default.jpg').removeAttr('imgsize');
				$('.fm-img .editImg').css({backgroundImage: 'url(../img/default.jpg)'});
				$('.fm-img .replaceBtn').val('');
			});
		},
		createImg: function(obj, cb) {
			var sf = this;
			var reader = new FileReader();
			var file = obj[0].files[0];
			var imgUrlBase64;
			if (file) {
				if (file.size < 500000) {
					var type = file.type;
					imgUrlBase64 = reader.readAsDataURL(file);
					reader.onload = function() {
						var img = document.createElement('img');
						var src = img.src = reader.result;
						img.onload = function() {
							var w = img.width,
								h = img.height,
								s = w > 750? w/750: 1,
								c = document.createElement('canvas'),
								ctx = c.getContext('2d');
							var nw = c.width  = img.width = Math.round(w/s),
								nh = c.height = img.height = Math.round(h/s);
							ctx.drawImage(img, 0, 0, nw, nh);
							var o;
							// 1: 透明   png
							// 2: 不透明 jpg
							if (type === 'image/png' && file.size > 50000) {
								o = 2;
								for (var y = 0; y < nw; y++) {
									if (o === 1) break;
									for (var x = 0; x < nh; x++) {
										var a = sf.getPixelColor(ctx, x, y).a;
										if (a < 1) {
											o = 1;
											break;
										}
									}
								}
							}
							if (o === 2) {
								type = 'image/jpeg';
								img.src = src.replace(/^data:image\/\w+;base64/, 'data:image/jpeg;base64');
								ctx.drawImage(img, 0, 0, nw, nh);
							};
							data = c.toDataURL(type, .85);
							cb(data, nw, nh, file.size);
						}
					}
				} else {
					$.alert('error', '文件大小: '+(file.size/1000000).toFixed(1)+'MB, 图片太大啦 (*T_T*).');
					obj.val('');
				}
			}
		},
		getPixelColor: function(ctx, x, y) {
			var imageData = ctx.getImageData(x, y, 1, 1);
			// 获取该点像素数据
			var pixel = imageData.data;
			var r = pixel[0];
			var g = pixel[1];
			var b = pixel[2];
			var a = pixel[3] / 255
			return {
				r : r,
				g : g,
				b : b,
				a : a
			};
		},
		formLoaded: function (rid) {
			var dom = $('#' + rid);
			if (dom.length) {
				var img_src = $('.img', dom).attr('src');
				$('.fm-img .editImg').css({
					'background-image': 'url(' + img_src + ')'
				});
			}
		}
	},
	img_group: {
		_defaultOption: {
			imgs: [{}, {}, {}]
		},
		_data: {},
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			function render() {
				sf.formLoaded(currentEleId);
				sf.elementRender(currentEleId);
			}
			$('#form').on('change', '.fm-img_group .add-replaceBtn', function(e) {
				var idx = $(this).attr('data-idx')-1;
				var da = sf._data[currentEleId];
				me.img.createImg($(this), function(src, width, height, size) {
					da.imgs[idx].src = src;
					da.imgs[idx].size = size;
					render();
				});
			})
			.on('click', '.remove-btn', function(e) {
				var idx = $(this).attr('data-idx')-1;
				var da = sf._data[currentEleId];
				da.imgs[idx].src = '';
				delete da.imgs[idx].size;
				render();
			});
		},
		formLoaded: function (rid) {
			var sf = this;
			var da = sf._data[rid];
			var de = sf._defaultOption;
			var tp = domCache.img_group;
			if (!da) {
				da = JSON.parse(JSON.stringify(de));
				var imgs = $('#' + rid).find('img');
				var len  = imgs.length;
				if (len) {
					imgs.each(function(i, e) {
						da.imgs[i].src = e.src;
					});
				}
				da.id = rid;
				sf._data[rid] = da;
			}
			var html = swig.compile(tp)(da);
			$('#form').html(html);
		},
		elementRender: function(rid) {
			var sf = this;
			var da = sf._data[rid];
			var tp = Element.temp.img_group;
			if(!tp) {
				Element._load(Element, 'img_group', function (temp) {
					tp = temp;
					var html = swig.compile(tp)(da);
					$('#' + rid + ' .img_group')[0].outerHTML = html;
				});
			} else {
				var html = swig.compile(tp)(da);
				$('#' + rid + ' .img_group')[0].outerHTML = html;
			}
		}
	},
	button: {
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			$('#form').on('input', '[name=bname]', function(e) {
				$('.button', '#' + currentEleId).html($(this).val());
			})
			// 跳转站内页面
			.on('change', '[name=blink]', function(e) {
				$('.button, .zoom', '#' + currentEleId).attr('data-btn', $(this).val());
			})
			// 浮动
			.on('click', '[name=bfix]', function(e) {
				var val = $(this).val(),
					dom = $('#' + currentEleId),
					dragDom = $('#' + currentEleId).parent();
				$('.button', '#' + currentEleId).attr('fix', val);
				if(val == 1) {
					dragDom.addClass('e-pos-fixed').css({
						'left': 0,
						'top': 'auto',
						'bottom': 0
					});
					dom.css({
						'width': $(page).width(),
						'height': '50px',
						'transform': 'rotateZ(0deg)'
					}).find('.zoom').hide();
				} else {
					var st = $('#page').scrollTop();
					var pl = $(page).width() / 2 - dom.width() / 2,
						pt = $(page).parent().height() / 2 - dom.height() / 2 + st;
					dragDom.removeClass('e-pos-fixed').css({
						'left': pl,
						'top': pt,
						'bottom': 'auto'
					});
					dom.find('.zoom').show();
				}
			})
			// 调色板
			.on('click', '.fm-button .flat', function(e) {
				e.preventDefault();
				$('.fm-button .flat').not(this).find('.sp-flat').addClass('hide');
				$('.sp-flat', this).toggleClass('hide');
			})

			// 按钮点击区域
			.on('change', '.fm-button [name=bzoom]', function(e) {
				e.preventDefault();
				var offset = (- $(this).val() * 50) + '%';
				$('.zoom', '#' + currentEleId).css({
					left: offset,
					right: offset,
					top: offset,
					bottom: offset
				}).attr('v', $(this).val());
			});
		},
		formLoaded: function(rid) {
			var parent = $('#' + rid);
			var text = $('.button', parent).html();
			var href = $('.button', parent).attr('data-btn');
			var fix = $('.button', parent).attr('fix');
			var zoom = $('.zoom', parent).attr('v') || '0';
			$('.fm-button [name=bname]').val(text);
			// 循环添加跳转页面
			$('.viewlist .prePage').each(function(ind, el) {
				var idx = $(this).attr('index'),
					selected = '';
				if(idx != currentPage) {
					var opthtml = '<option value="' + ind + '">第' + (ind + 1) + '页</option>';
					$('.fm-button [name=blink]').append(opthtml);
				}
			});
			$('.fm-button [name=blink]').val(href);
			// $('.button, .zoom', parent).attr('data-btn', href);
			$('.fm-button [name=bfix][value="'+fix+'"]').prop('checked', true);
			// 按钮点击区域设置
			$('.fm-button [name=bzoom]').val(zoom);
			// 字体颜色
			$('.fm-button #ftcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.button', '#' + rid).css({
						color: color.toHexString()
					});
				}
			}));
			// 背景颜色
			$('.fm-button #bgfill').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.button', '#' + rid).css({
						backgroundColor: color.toHexString()
					});
				}
			}));
			// 边框颜色
			$('.fm-button #bdcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.button', '#' + rid).css({
						borderColor: color.toHexString()
					});
				}
			}));
			$('.fm-button .sp-flat').addClass('hide');
			$('.fm-button [name=bname]').select();
		}
	},
	form: {
		_tempOption: {
			text: {
				type: 'text',
				name: '',
				check: '',
				must: 0
			},
			select: {
				type: 'select',
				name: '',
				options: []
			},
			radio: {
				type: 'radio',
				name: '',
				options: []
			}
		},
		_defaultOption: {
			basic: [
				{
					name: '表单名称',
					key: 'fName',
					max: 15,
					must: 1
				},
				{
					name: '按钮文字',
					key: 'fBtnText',
					max: 10,
					must: 1
				},
				{
					name: '表单提交成功提示',
					key: 'fSuccessText',
					max: 20
				},
				{
					name: '表单提交后跳转地址',
					key: 'fSuccessUrl',
					max: 20,
					link: true
				}
			],
			element: [],
			style: {
				
			}
		},
		_data: {},
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			function render(rid) {
				sf.formLoaded(rid);
				sf.elementRender(rid);
			}
			// 添加元素
			$('#form').on('click', '#formElementAdd', function (e) {
				var da = sf._data[currentEleId];
				var type = $('[name=formType]:checked').val();
				var temp = JSON.parse(JSON.stringify(sf._tempOption[type]));
				da.element.push(temp);
				render(currentEleId);
			})

			// 修改元素名称
			.on('input', '.fm-form .e-form-name', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.name = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 修改元素是否必填
			.on('change', '.fm-form .e-form-checkbox', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.must = $(this).is(':checked')? 1: 0;
				sf.elementRender(currentEleId);
			})

			// 修改元素校验规则
			.on('change', '.fm-form .e-form-rule', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.check = $(this).val();
				sf.elementRender(currentEleId);
			})

			// 添加单选框选项
			.on('click', '.fm-form .btn-form-sel-add', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options;
				da.push({ value: '' });
				render(currentEleId);
			})

			// 移除单选框选项
			.on('click', '.fm-form .btn-form-sel-remove', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options;
				var oIdx = da.length - 1;
				da.splice(oIdx, 1);
				render(currentEleId);
			})

			// 单选框下拉选项内容
			.on('change', '.fm-form .e-form-select', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var oIdx = $(this).attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options[oIdx];
				da.value = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 单选框radio选项内容
			.on('change', '.fm-form .e-form-radio', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var oIdx = $(this).attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options[oIdx];
				da.value = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 元素交换位置
			.on('click', '.fm-form .btn-form-up, .fm-form .btn-form-down', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element;
				var move = $(this).attr('move') - 0;
				me.common.swapItems(da, idx, idx + move);
				render(currentEleId);
			})

			// 元素移除
			.on('click', '.fm-form .btn-form-remove', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element;
				da.splice(idx, 1);
				render(currentEleId);
			})

			// 修改表单名称
			.on('input', '.fm-form [name=fName]', function (e) {
				$('#' + currentEleId).attr('fname', $(this).val());
				sf._data[currentEleId].basic[0].value = $(this).val();
			})

			// 修改按钮文字
			.on('input', '.fm-form [name=fBtnText]', function (e) {
				$('.e-form-submit', '#' + currentEleId).html($(this).val());
				sf._data[currentEleId].basic[1].value = $(this).val();
			})

			// 修改表单提交成功提示
			.on('input', '.fm-form [name=fSuccessText]', function (e) {
				$('.e-form-submit', '#' + currentEleId).attr('t-success', $(this).val());
				sf._data[currentEleId].basic[2].value = $(this).val();
			})

			// 修改表单提交后跳转地址
			.on('change', '.fm-form [name=fSuccessUrl]', function (e) {
				$('.e-form-submit', '#' + currentEleId).attr('t-url', $(this).val());
				sf._data[currentEleId].basic[3].value = $(this).val();
			})

			// 调色板
			.on('click', '.fm-form .flat', function(e) {
				e.preventDefault();
				$('.fm-form .flat').not(this).find('.sp-flat').addClass('hide');
				$('.sp-flat', this).toggleClass('hide');
			});
		},
		setStyle: function(obj, style) {
			var sf = this;
			var da = sf._data[currentEleId];
			da.style[obj] = style;
			$('#' + currentEleId).attr('eleData', JSON.stringify(da));
		},
		formLoaded: function(rid) {
			var sf = this;
			var da = sf._data[rid];
			var de = sf._defaultOption;
			var tp = domCache.form;
			var eledata = $('#' + rid).attr('eleData');
			if (!da) {
				if(eledata) {
					da = JSON.parse(eledata);
					sf._data[rid] = JSON.parse(eledata);
				} else {
					da = JSON.parse(JSON.stringify(de));
					da.id = rid;
					sf._data[rid] = da;
				}
			}
			var fName = $('#' + currentEleId).attr('fname');
			var fBtnText = $('.e-form-submit', '#' + currentEleId).html();
			var fSuccessText = $('.e-form-submit', '#' + currentEleId).attr('t-success');
			var fSuccessUrl = $('.e-form-submit', '#' + currentEleId).attr('t-url');
			
			da.basic[0].value = fName;
			da.basic[1].value = fBtnText;
			da.basic[2].value = fSuccessText;
			da.basic[3].value = fSuccessUrl;

			var html = swig.compile(tp)(da);
			$('#form').html(html);

			// 循环添加跳转页面
			$('.viewlist .prePage').each(function(ind, el) {
				var idx = $(this).attr('index'),
					selected = '';
				if(idx != currentPage) {
					var opthtml = '<option value="' + ind + '">第' + (ind + 1) + '页</option>';
					$('.fm-form [name=fSuccessUrl]').append(opthtml);
				}
			});
			
			$('.fm-form [name=fName]').val(fName);
			$('.fm-form [name=fBtnText]').val(fBtnText);
			$('.fm-form [name=fSuccessText]').val(fSuccessText);
			$('.fm-form [name=fSuccessUrl]').val(fSuccessUrl);
			$('.e-form-submit', '#' + rid).attr('t-url', fSuccessUrl);
			$('#' + rid).attr('eleData', JSON.stringify(da));
			// 表单字体颜色
			$('.fm-form #lbcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-label, .e-form-radiotxt', '#' + rid).css({
						color: color.toHexString()
					});
					sf.setStyle('label', 'color:' + color.toHexString() + ';');
				}
			}));
			// 提交按钮字体颜色
			$('.fm-form #ftcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-submit', '#' + rid).css({
						color: color.toHexString()
					});
					sf.setStyle('submit', $('.e-form-submit', '#' + rid).attr('style'));
				}
			}));
			// 提交按钮背景颜色
			$('.fm-form #bgfill').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-submit', '#' + rid).css({
						backgroundColor: color.toHexString()
					});
					sf.setStyle('submit', $('.e-form-submit', '#' + rid).attr('style'));
				}
			}));
			// 提交按钮边框颜色
			$('.fm-form #bdcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-submit', '#' + rid).css({
						borderColor: color.toHexString()
					});
					sf.setStyle('submit', $('.e-form-submit', '#' + rid).attr('style'));
				}
			}));
			$('.fm-form .sp-flat').addClass('hide');
			// console.log(sf._data);
		},
		elementRender: function(rid) {
			var sf = this;
			var da = sf._data[rid];
			var tp = Element.temp.form;
			if(!tp) {
				Element._load(Element, 'form', function (formtemp) {
					tp = formtemp;
					var html = swig.compile(tp)(da);
					$('#' + rid + ' .e-content')[0].outerHTML = html;
					$('#' + rid).attr('eleData', JSON.stringify(da));
					// console.log(html);
				});
			} else {
				var html = swig.compile(tp)(da);
				$('#' + rid + ' .e-content')[0].outerHTML = html;
				$('#' + rid).attr('eleData', JSON.stringify(da));
				// console.log(html);
			}
		}
	},
	tel: {
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			me.posObj = {};
			$('#form').on('input', '[name=tname]', function(e) {
				e.preventDefault();
				var rid = $('.fm-tel').attr('rid');
				$('.tel', '#' + rid).html($(this).val());
			})

			// 电话号码
			.on('change', '[name=tel]', function(e) {
				e.preventDefault();
				var rid = $('.fm-tel').attr('rid');
				var telnum = $(this).val();
				$('.tel, .phone, .zoom', '#' + rid).attr('data-tel', telnum);
			})

			// 悬浮
			.on('click', '[name=tfix]', function(e) {
				var rid = $('.fm-tel').attr('rid'),
					val = $(this).val(),
					dom = $('#' + rid),
					dragDom = $('#' + rid).parent();
				$('.tel', '#' + rid).attr('fix', val);
				$('.phone', '#' + rid).remove();
				if (val == 0) {
					dragDom.removeClass('e-pos-fixed');
					$('.tel, .zoom', dom).show();
				} else if (val == 2) {
					dragDom.addClass('e-pos-fixed').css({
						left: $(page).width() - 65,
						top: 30
					});
					dom.css({
						width: 'auto',
						height: 'auto'
					}).find('.zoom').hide();
					var telnum = $('.tel', '#' + rid).attr('data-tel') || '';
					$('.tel', '#' + rid).hide();
					$('#' + rid).append('<a class="phone" data-tel="' + telnum + '" mj-a="6"><i class="iconfont icon-phone3"></i></a>');
				}
			})

			// 调色板
			.on('click', '.fm-tel .flat', function(e) {
				e.preventDefault();
				$('.fm-tel .flat').not(this).find('.sp-flat').addClass('hide');
				$('.sp-flat', this).toggleClass('hide');
			})

			// 按钮点击区域
			.on('change', '.fm-tel [name=tzoom]', function(e) {
				e.preventDefault();
				var offset = (- $(this).val() * 50) + '%';
				$('.zoom', '#' + currentEleId).css({
					left: offset,
					right: offset,
					top: offset,
					bottom: offset
				}).attr('v', $(this).val());
			});
		},
		formLoaded: function(rid) {
			var dom_text = $('#' + rid + ' .tel').html(),
				dom_href = $('#' + rid + ' .tel').attr('data-tel'),
				zoom = $('.zoom', '#' + rid).attr('v') || '0',
				fix = $('.tel', '#' + rid).attr('fix');
			$('.fm-tel [name=tname]').val(dom_text);
			$('.fm-tel [name=tel]').val(dom_href);
			$('.fm-tel [name=tzoom]').val(zoom);
			$('.fm-tel [name=tfix][value='+fix+']').prop('checked', true);
			// 悬浮图标颜色
			$('.fm-tel #iccolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.phone', '#' + rid).css({
						color: color.toHexString()
					});
				}
			}));
			// 字体颜色
			$('.fm-tel #ftcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.tel', '#' + rid).css({
						color: color.toHexString()
					});
				}
			}));
			// 背景颜色
			$('.fm-tel #bgfill').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.tel', '#' + rid).css({
						backgroundColor: color.toHexString()
					});
				}
			}));
			// 边框颜色
			$('.fm-tel #bdcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.tel', '#' + rid).css({
						borderColor: color.toHexString()
					});
				}
			}));
			$('.fm-tel .sp-flat').addClass('hide');

			$('.fm-tel [name=tname]').select();
		}
	},
	link: {
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			$('#form').on('input', '[name=lname]', function(e) {
				e.preventDefault();
				var rid = $('.fm-link').attr('rid');
				$('.link', '#' + rid).html($(this).val());
			})

			// ios appID验证
			.on('change', '[name=lios]', function(e) {
				e.preventDefault();
				var rid = $('.fm-link').attr('rid');
				var iosId = $(this).val().trim();
				$(this).val(iosId);
				$('.link, .zoom', '#' + rid).attr('ios', iosId);
			})

			// apk链接验证
			.on('change', '[name=landroid]', function(e) {
				e.preventDefault();
				var rid = $('.fm-link').attr('rid');
				var andApk = $(this).val().trim();
				$(this).val(andApk);
				$('.link, .zoom', '#' + rid).attr('android', andApk);
			})

			// 调色板
			.on('click', '.fm-link .flat', function(e) {
				e.preventDefault();
				$('.fm-link .flat').not(this).find('.sp-flat').addClass('hide');
				$('.sp-flat', this).toggleClass('hide');
			})

			// 按钮点击区域
			.on('change', '.fm-link [name=lzoom]', function(e) {
				e.preventDefault();
				var offset = (- $(this).val() * 50) + '%';
				$('.zoom', '#' + currentEleId).css({
					left: offset,
					right: offset,
					top: offset,
					bottom: offset
				}).attr('v', $(this).val());
			})

			// 浮动
			.on('click', '[name=lfix]', function(e) {
				var val = $(this).val(),
					dom = $('#' + currentEleId),
					dragDom = $('#' + currentEleId).parent();
				$('.link', '#' + currentEleId).attr('fix', val);
				if(val == 1) {
					dragDom.addClass('e-pos-fixed').css({
						'left': 0,
						'top': 'auto',
						'bottom': 0
					});
					dom.css({
						'width': $(page).width(),
						'height': '50px',
						'transform': 'rotateZ(0deg)'
					}).find('.zoom').hide();
				} else {
					var st = $('#page').scrollTop();
					var pl = $(page).width() / 2 - dom.width() / 2,
						pt = $(page).parent().height() / 2 - dom.height() / 2 + st;
					dragDom.removeClass('e-pos-fixed').css({
						'left': pl,
						'top': pt,
						'bottom': 'auto'
					});
					dom.find('.zoom').show();
				}
			});
		},
		formLoaded: function(rid) {
			var dom_text = $('.link', '#' + rid).html(),
				ihref = $('.link', '#' + rid).attr('ios'),
				ahref = $('.link', '#' + rid).attr('android'),
				fix = $('.link', '#' + rid).attr('fix'),
				zoom = $('.zoom', '#' + rid).attr('v') || '0';
			$('.fm-link [name=lname]').val(dom_text);
			$('.fm-link [name=lios]').val(ihref);
			$('.fm-link [name=landroid]').val(ahref);
			$('.fm-link [name=lzoom]').val(zoom);
			$('.fm-link [name=lfix][value="'+fix+'"]').prop('checked', true);
			// 字体颜色
			$('.fm-link #ftcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.link', '#' + rid).css({
						color: color.toHexString()
					});
				}
			}));
			// 背景颜色
			$('.fm-link #bgfill').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.link', '#' + rid).css({
						backgroundColor: color.toHexString()
					});
				}
			}));
			// 边框颜色
			$('.fm-link #bdcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.link', '#' + rid).css({
						borderColor: color.toHexString()
					});
				}
			}));
			$('.fm-link .sp-flat').addClass('hide');
			$('.fm-link [name=lname]').select();
		}
	},
	ebform: {
		_tempOption: {
			text: {
				type: 'text',
				name: '',
				check: '',
				must: 0
			},
			select: {
				type: 'select',
				name: '',
				options: []
			},
			radio: {
				type: 'radio',
				name: '',
				options: []
			},
			count: {
				type: 'number',
				numName: '',
				priceName: '',
				editPrice: '',
				totalName: '',
				must: 1
			},
			send: {
				type: 'send',
				name: ''
			}
		},
		_defaultOption: {
			basic: [
				{
					name: '表单名称',
					key: 'fName',
					max: 15,
					must: 1
				},
				{
					name: '按钮文字',
					key: 'fBtnText',
					max: 10,
					must: 1
				},
				{
					name: '表单提交成功提示',
					key: 'fSuccessText',
					max: 20
				},
				{
					name: '表单提交后跳转地址',
					key: 'fSuccessUrl',
					max: 20,
					link: true
				}
			],
			element: [],
			style: {
				
			}
		},
		_data: {},
		init: function(me) {
			var sf = this;
			sf.bind(sf, me);
		},
		bind: function(sf, me) {
			function render(rid) {
				sf.formLoaded(rid);
				sf.elementRender(rid);
			}
			// 添加元素
			$('#form').on('click', '#ebformElementAdd', function (e) {
				var da = sf._data[currentEleId];
				var type = $('[name=formType]:checked').val();
				var temp = JSON.parse(JSON.stringify(sf._tempOption[type]));
				da.element.push(temp);
				render(currentEleId);
			})

			// 修改元素名称
			.on('input', '.fm-ebform .e-form-name', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.name = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 修改数量名称
			.on('input', '.fm-ebform .e-form-num', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.numName = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 修改单价名称
			.on('input', '.fm-ebform .e-form-price', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.priceName = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 修改单价值
			.on('input', '.fm-ebform .e-form-editprice', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				var price = $(this).val();
				if (price - 0 >= 1) {
					price = price.replace(/^0+/g,'');
				} else if (price - 0 > 0 && price - 0 < 1) {
					price = price.replace(/^0+/g,'0');
				} else {
					price = '0';
				}
				da.editPrice = price.trim();
				sf.elementRender(currentEleId);
			})

			// 修改总价名称
			.on('input', '.fm-ebform .e-form-total', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.totalName = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 修改元素是否必填
			.on('change', '.fm-ebform .e-form-checkbox', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.must = $(this).is(':checked')? 1: 0;
				sf.elementRender(currentEleId);
			})

			// 修改元素校验规则
			.on('change', '.fm-ebform .e-form-rule', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx];
				da.check = $(this).val();
				sf.elementRender(currentEleId);
			})

			// 添加单选框选项
			.on('click', '.fm-ebform .btn-form-sel-add', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options;
				da.push({ value: '' });
				render(currentEleId);
			})

			// 移除单选框选项
			.on('click', '.fm-ebform .btn-form-sel-remove', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options;
				var oIdx = da.length - 1;
				da.splice(oIdx, 1);
				render(currentEleId);
			})

			// 单选框下拉选项内容
			.on('change', '.fm-ebform .e-form-select', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var oIdx = $(this).attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options[oIdx];
				da.value = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 单选框radio选项内容
			.on('change', '.fm-ebform .e-form-radio', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var oIdx = $(this).attr('index') - 1;
				var da = sf._data[currentEleId].element[idx].options[oIdx];
				da.value = $(this).val().trim();
				sf.elementRender(currentEleId);
			})

			// 元素交换位置
			.on('click', '.fm-ebform .btn-form-up, .fm-ebform .btn-form-down', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element;
				var move = $(this).attr('move') - 0;
				me.common.swapItems(da, idx, idx + move);
				render(currentEleId);
			})

			// 元素移除
			.on('click', '.fm-ebform .btn-form-remove', function (e) {
				var idx = $(this).parents('.fm-block').attr('index') - 1;
				var da = sf._data[currentEleId].element;
				da.splice(idx, 1);
				render(currentEleId);
			})

			// 修改表单名称
			.on('input', '.fm-ebform [name=fName]', function (e) {
				$('#' + currentEleId).attr('fname', $(this).val());
				sf._data[currentEleId].basic[0].value = $(this).val();
			})

			// 修改按钮文字
			.on('input', '.fm-ebform [name=fBtnText]', function (e) {
				$('.e-form-submit', '#' + currentEleId).html($(this).val());
				sf._data[currentEleId].basic[1].value = $(this).val();
			})

			// 修改表单提交成功提示
			.on('input', '.fm-ebform [name=fSuccessText]', function (e) {
				$('.e-form-submit', '#' + currentEleId).attr('t-success', $(this).val());
				sf._data[currentEleId].basic[2].value = $(this).val();
			})

			// 修改表单提交后跳转地址
			.on('change', '.fm-ebform [name=fSuccessUrl]', function (e) {
				$('.e-form-submit', '#' + currentEleId).attr('t-url', $(this).val());
				sf._data[currentEleId].basic[3].value = $(this).val();
			})

			// 调色板
			.on('click', '.fm-ebform .flat', function(e) {
				e.preventDefault();
				$('.fm-ebform .flat').not(this).find('.sp-flat').addClass('hide');
				$('.sp-flat', this).toggleClass('hide');
			});
		},
		setStyle: function(obj, style) {
			var sf = this;
			var da = sf._data[currentEleId];
			da.style[obj] = style;
			$('#' + currentEleId).attr('eleData', JSON.stringify(da));
		},
		formLoaded: function(rid) {
			var sf = this;
			var da = sf._data[rid];
			var de = sf._defaultOption;
			var tp = domCache.ebform;
			var eledata = $('#' + rid).attr('eleData');
			if (!da) {
				if(eledata) {
					da = JSON.parse(eledata);
					sf._data[rid] = JSON.parse(eledata);
				} else {
					da = JSON.parse(JSON.stringify(de));
					da.id = rid;
					sf._data[rid] = da;
				}
			}
			var fName = $('#' + currentEleId).attr('fname');
			var fBtnText = $('.e-form-submit', '#' + currentEleId).html();
			var fSuccessText = $('.e-form-submit', '#' + currentEleId).attr('t-success');
			var fSuccessUrl = $('.e-form-submit', '#' + currentEleId).attr('t-url');
			da.basic[0].value = fName;
			da.basic[1].value = fBtnText;
			da.basic[2].value = fSuccessText;
			da.basic[3].value = fSuccessUrl;

			var html = swig.compile(tp)(da);
			$('#form').html(html);

			// 循环添加跳转页面
			$('.viewlist .prePage').each(function(ind, el) {
				var idx = $(this).attr('index'),
					selected = '';
				if(idx != currentPage) {
					var opthtml = '<option value="' + ind + '">第' + (ind + 1) + '页</option>';
					$('.fm-ebform [name=fSuccessUrl]').append(opthtml);
				}
			});

			$('.fm-ebform [name=fName]').val(fName);
			$('.fm-ebform [name=fBtnText]').val(fBtnText);
			$('.fm-ebform [name=fSuccessText]').val(fSuccessText);
			$('.fm-ebform [name=fSuccessUrl]').val(fSuccessUrl);
			$('.e-form-submit', '#' + rid).attr('t-url', fSuccessUrl);
			$('#' + rid).attr('eleData', JSON.stringify(da));
			// 表单字体颜色
			$('.fm-ebform #lbcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-label, .e-form-radiotxt, .e-form-gt.spc', '#' + rid).css({
						color: color.toHexString()
					});
					sf.setStyle('label', 'color:' + color.toHexString() + ';');
				}
			}));
			// 提交按钮字体颜色
			$('.fm-ebform #ftcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-submit', '#' + rid).css({
						color: color.toHexString()
					});
					sf.setStyle('submit', $('.e-form-submit', '#' + rid).attr('style'));
				}
			}));
			// 提交按钮背景颜色
			$('.fm-ebform #bgfill').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-submit', '#' + rid).css({
						backgroundColor: color.toHexString()
					});
					sf.setStyle('submit', $('.e-form-submit', '#' + rid).attr('style'));
				}
			}));
			// 提交按钮边框颜色
			$('.fm-ebform #bdcolor').spectrum($.extend({}, Drag.defaultColorConfig, {
				change: function(color) {
					$('.e-form-submit', '#' + rid).css({
						borderColor: color.toHexString()
					});
					sf.setStyle('submit', $('.e-form-submit', '#' + rid).attr('style'));
				}
			}));
			$('.fm-ebform .sp-flat').addClass('hide');
			// console.log(sf._data);
		},
		elementRender: function(rid) {
			var sf = this;
			var da = sf._data[rid];
			var tp = Element.temp.ebform;
			if(!tp) {
				Element._load(Element, 'ebform', function (ebformtemp) {
					tp = ebformtemp;
					var html = swig.compile(tp)(da);
					$('#' + rid + ' .e-content')[0].outerHTML = html;
					$('#' + rid).attr('eleData', JSON.stringify(da));
					// console.log(html);
				});
			} else {
				var html = swig.compile(tp)(da);
				$('#' + rid + ' .e-content')[0].outerHTML = html;
				$('#' + rid).attr('eleData', JSON.stringify(da));
				// console.log(html);
			}
		}
	}
};

window.Element = {
	_data: {
		form: {
			draggable: { containment: 'parent' }
		}
	},
	_load: function(me, type, cb) {
		if (me.temp[type]) {
			cb && cb(me.temp[type]);
		} else {
			$.ajax({
				url: '../view/element/' + type + '.html',
				success: function(d) {
					me.temp[type] = d;
					cb && cb(d);
				},
				error: function(err) {
					cb && cb(0);
				}
			});
		}
	},
	_eleLoad: function(ele, type, cb) {
		if (type === 'img') {
			$('.img', ele).one('load', function(e) {
				$(ele).css({
					height: $(this).height()
				});
				cb(this);
			});
		} else {
			cb(ele);
		}
	},
	init: function(type, parent, opts, id, cb) {
		var me = this;
		if (type === 'form' && $('.input-form', parent).length) {
			$.isFunction(cb) && cb();
			$.alert('error', '每个单页面不能重复添加表单!');
		} else if (type === 'ebform' && $('.input-ebform', parent).length) {
			$.isFunction(cb) && cb();
			$.alert('error', '每个单页面不能重复添加电商表单!');
		} else if (type === 'img_group' && $('.input-img_group', parent).length) {
			$.isFunction(cb) && cb();
			$.alert('error', '组图不能重复创建!');
		} else {
			me._load(me, type, function(tp) {
				var ctn = document.createElement('div');
				ctn.className = 'drag-container';
				var ele = document.createElement('div');
				ele.className = 'input-' + type;
				ele.id = 'userEle' + currentPage + '_' + id;

				var html = swig.compile(tp)(opts);
				ele.innerHTML = html;
				$(ele).data('type', type);
				ctn.appendChild(ele);
				$(parent).append(ctn);

				me.bindEvent(ctn, type, parent, function() {
					cb(ele);
				});
			});
		}
	},
	temp: {
		text: '<div class="text">{{text}}</div>',
		img: '<img class="img" src="../img/default.jpg" draggable="false">',
		button: '<a class="button" mj-a="8" v="0">{{text}}</a>',
		tel: '<a class="tel" mj-a="6">{{text}}</a>',
		link: '<a class="link" mj-a="10">{{text}}</a>'
	},
	bindEvent: function(ctn, type, parent, cb) {
		var ele = $(ctn).children('[class^=input-]')[0];
		this._eleLoad(ele, type, function(th) {
			if (type === 'img') {
				$(ele).css({
					width: sW - 20
				});
			}
			var st = $(parent).parent().scrollTop();
			var pl = $(parent).width() / 2 - $(th).width() / 2,
				pt = $(parent).parent().height() / 2 - $(th).height() / 2 + st;
			$(ctn).css({
				left: pl,
				top: pt
			});
			$(ele).css({
				width: $(th).width()
			});
			if (!/(form|ebform|img_group)/.test(type)) {
				$(ele).rotatable();
				$(ele).resizable({ autoHide: true, maxWidth: sW });
			}
			$(ele).removable({
				callback: function (e) {
					currentEleId = '';
					$('#form').empty();
				}
			});
			if (type === 'button' || type === 'tel' || type === 'link') {
				// 放大区域
				$(ele).maparea();
			}
			$(ctn).draggable({ containment: 'parent' });
			cb();
		});
	},
	showLeftPreview: function() {
		$('#page > .page').each(function(ind, el) {
			var idx = $(el).attr('index');
			var preview = $('.viewlist .prePage[index='+idx+'] .p-page');
			var ct = $(el.outerHTML).attr('class', 'p-view').removeAttr('index');
			ct.find('.drag-container').removeClass('active');
			ct.find('[class^=input-]').removeAttr('id').find('.ui-draggable, .ui-resizable-handle, .ui-rotatable-handle, .delbox').remove();
			preview.html(ct);
		});
	}
};

Drag.init();

});