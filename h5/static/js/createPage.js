(function (document){
	$(function() {
		var statusTemp = '';
		var timeoutFlag = true;
		var loading = $('.loading');

		// 过滤页面中不需要保存的class
		var filterHTML = function (content) {
			var ct = $('<div>' + content + '</div>');
			ct.find('.drag-container').removeClass('active');
			ct.find('[class^=input-]').find('.ui-draggable, .ui-resizable-handle, .ui-rotatable-handle, .delbox').remove();
			return ct.html();
		};
		// 验证
		var validated = function () {
			var vflag = true;
			// 下载按钮ios,android格式验证
			$('.page .input-link').each(function(ind, el) {
				var iosId = $('.link', this).attr('ios'),
					andApk = $('.link', this).attr('android'),
					iosRe = /^[0-9]*$/,
					andRe = /.*\.apk$/;
				if(!iosId && !andApk) {
					$.alert('error', '请输入appID或apk下载链接!');
					vflag = false;
					return false;
				} 
				if(iosId && !iosRe.test(iosId)) {
					$.alert('error', '请输入正确的appID!');
					vflag = false;
					return false;
				}
				if(andApk && !andRe.test(andApk)) {
					$.alert('error', '请输入正确的apk下载链接!');
					vflag = false;
					return false;
				}
			});
			if(!vflag) return vflag;
			// 电话格式
			$('.page .input-tel').each(function(ind, el) {
				var telnum = $('.tel' ,this).attr('data-tel');
				var phoneRe = /^(0\d{2,3}-?\d{7,8}|1[3|4|5|7|8][0-9]{9})$/;
				if(!telnum) {
					$.alert('error', '请输入电话号码!');
					vflag = false;
					return false;
				} else if(!phoneRe.test(telnum)) {
					$.alert('error', '请输入正确格式的电话号码，支持格式: 区号-电话号码 或 11位手机号!');
					vflag = false;
					return false;
				}
			});
			return vflag;
		};

		// loading + 保存成功动画
		var saveEnd = function () {
			$.alert('', '成功保存所创建的h5！<br>请到“我的站点”中查看！', function() {
				loading.hide();
				timeoutFlag = true;
				statusTemp = status;
			});
		};
		// 发布成功动画
		var publishEnd = function () {
			$.alert('', '成功发布所创建的h5！<br>请到“我的站点”中查看！', function() {
				loading.hide();
				timeoutFlag = true;
				statusTemp = status;
			});
		};

		// 检测页面内是否有背景或元素
		var emptyPageInd;
		var hasContent = function () {
			var flag = true;
			$('#page .page').each(function(index, el) {
				var html = $(this).html().trim();
				var hasBgi = $(this).css('background-image') !== 'none';
				if (!html && !hasBgi) {
					emptyPageInd = index + 1;
					flag = false;
					return;
				}
			});
			return flag;
		};

		// 接口
		var api = {
			getHash: '/getHash',
			createForm: '/form/create',
			updateForm: '/form/update',
			createWebsite: '/website/save',
			publish: '/website/online'
		};
		var ajax = function (url, type, data, callback, failback, async) {
			$.ajax({
				url: url,
				type: type,
				async: async || true,
				data: data
			})
			.done(function(res) {
				callback && callback(res);
			})
			.fail(function(e) {
				failback && failback(e);
			});
		};

		// 获取hashId
		var getHash = function (callback) {
			if(hash) {
				callback && callback();
			} else {
				var data = {
					html: (''+Math.random()).substr(2, 5)+(new Date()).getTime().toString().substring(8)
				};
				/*MJJS.http.post(api.getHash, data, function(o) {
					if(o) hash = o.hash;
					callback && callback();
				});*/
				callback && callback();
			}
		};
		
		// 创建表单
		var createForm = function (callback) {
			var formInfo = {}, createInfo = {}, updateInfo = {};
			var isFormNameEmpty = false;
			var isFormNameRepeat = false;
			var formCount = 0;
			var createFormFlag = true, updateFormFlag = true;
			$('.input-form, .input-ebform', '#page').each(function(index, el) {
				var fid = $(el).attr('fid');
				var fname = $(el).attr('fname');
				if (!fname) {
					isFormNameEmpty = true;
					return;
				}
				if(formInfo[fname]) {
					isFormNameRepeat = true;
					return;
				}
				var flabels = [];
				$('.e-form-label', this).each(function(ind, label) {
					var info = {};
					var lbname = $(label).html().replace(/<b><\/b>/g,'');
					var price = $(this).next().find('.e-form-price').html();
					if(price) {
						info[lbname] = price;
					} else {
						info[lbname] = '';
					}
					flabels.push(info);
				});
				formInfo[fname] = flabels;
				if(fid) {
					updateInfo[fname] = flabels;
				} else {
					createInfo[fname] = flabels;
				}
				formCount++;
			});
			if (isFormNameEmpty) {
				loading.hide();
				timeoutFlag = true;
				statusTemp = status;
				$.alert('error', '表单名称不能为空!');
			} else if (isFormNameRepeat) {
				loading.hide();
				timeoutFlag = true;
				statusTemp = status;
				$.alert('error', '表单名有重复，请重新输入!');
			} else if(formCount > 0) {
				// 更新已创建的表单
				if (status == 'TO_BE_RELEASED' && !$.isEmptyObject(updateInfo)) {
					updateFormFlag = false;
					var formParameter = {
						websiteHashId: hash,
						formInfo: JSON.stringify(updateInfo)
					};
					/*MJJS.http.post3(api.updateForm, formParameter, function(o) {
						setFormsId(o);
						callback && callback();
					}, function(e, err) {
						if (err) {
							alert(e.message);
						} else {
							loading.hide();
							timeoutFlag = true;
							statusTemp = status;
							alert(e.message);
						}
					});*/
					callback && callback();
				}
				// 创建新表单
				if (!$.isEmptyObject(createInfo)) {
					var formParameter = {
						websiteHashId: hash,
						formInfo: JSON.stringify(createInfo)
					};
					/*MJJS.http.post3(api.createForm, formParameter, function(o) {
						setFormsId(o);
						callback && callback();
					}, function(e, err) {
						if (err) {
							createFormFlag = false;
							alert(e.message);
						} else {
							createFormFlag = false;
							loading.hide();
							timeoutFlag = true;
							statusTemp = status;
							alert(e.message);
						}
					});*/
					callback && callback();
				} else {
					if(updateFormFlag == true) {
						callback && callback();
					}
				}
			} else {
				callback && callback();
			}
		};

		var setFormsId = function (resFormInfos) {
			$.each(resFormInfos, function(ind, fm) {
				$('[fname="'+fm.name+'"]').attr('fid', fm.id);
				$('[fname="'+fm.name+'"] .e-form-submit').attr('mj-c', fm.id);
			});
		};

		// 上传静态资源
		var saveStaticResource = function (cb) {
			var rex64 = /data:image\/\w+;base64,/;
			var pg = $('#page .page');
			var l = pg.length;
			var da = {
				html: '',
				img: []
			};
			// CVR
			var cvrData = {
				"type": isLong ? 1 : 2,
				"title": $('#webName').val(),
				"page_count": $('.prePage').length,
				"page": []
			};
			for (var i = 0; i < l; i++) {
				var cpg = $(pg).eq(i);
				var content = cpg[0].outerHTML;
				var img64 = da.img;
				var bg = cpg.attr('d-src');
				var nC = $(content);
				var imgId = 1;
				var imgs = nC.find('img');
				if (bg) {
					nC.removeAttr('d-src');
					nC.css('background-image', 'url({{img_' + i + '_0}})');
					img64.push({
						id: 'img_'+i+'_0',
						src: bg
					});
				}
				imgs.each(function(j, e) {
					if (rex64.test(e.src)) {
						var num = new Date().getTime() * Math.floor(Math.random()*10000) + '';
						img64.push({
							id: 'img_'+i+'_'+num,
							src: e.src
						});
						$(e).attr('d-src', '{{img_' + i + '_' + num + '}}');
						$(e).removeAttr('src');
					}
					++imgId;
				});
				content = nC[0].outerHTML;
				da.html += content;

				var cpage = createCvrData(i, cpg);
				cvrData.page.push(cpage);
			}
			var data = {
				data: da,
				name: $('#webName').val().trim(),
				pageSize: $('.viewlist .prePage').length,
				type: isLong ? '1' : '0',
				cvr: cvrData
			}
			if (hash) data.hash = hash;
			if (id) data.id = id;
			if (statusTemp) {
				data.status = statusTemp;
			} else if(status) {
				data.status = status;
			}
			/*MJJS.http.post(api.createWebsite, data, function(o) {
				if (o) {
					hash = o.hashId;
					id = o.id;
					status = o.status;
					statusTemp = status;
				}
				if (cb) {
					cb();
				} else {
					saveEnd();
				}
			}, function(e, err) {
				loading.hide();
				timeoutFlag = true;
				statusTemp = status;
				alert(e.message || '保存失败');
			});*/
			if (cb) {
				cb();
			} else {
				saveEnd();
			}
		};

		// CVR数据收集
		var createCvrData = function(ind, pele) {
			// 普通图
			var imgs = pele.find('img:not(.swiper-slide)'), imgTotalSize = 0;
			imgs.each(function(index, image) {
				imgTotalSize += ~~($(this).attr('imgsize') || 0);
			});
			// 轮播图
			var sliderImgs = pele.find('img.swiper-slide'), sliderImgTotalSize = 0;
			sliderImgs.each(function(index, image) {
				sliderImgTotalSize += ~~($(this).attr('imgsize') || 0);
			});
			// 文本
			var txts = pele.find('.input-text'), txtArr = [];
			txts.each(function(index, txt) {
				var offsetLeft = $(txt).parent().position().left;
				var offsetTop = $(txt).parent().position().top;
				var txtData = {
					"content": $('.text', this).html(),
					"left_margin": offsetLeft,
					"right_margin": $(pele).width() - $(txt).width() - offsetLeft,
					"up_margin": offsetTop,
					"down_margin": $(pele).height() - $(txt).height() - offsetTop,
					"font_size": parseInt($('.text', txt).css('font-size')),
					"font_color": $('.text', txt).css('color')
				};
				txtArr.push(txtData);
			});
			// 按钮
			var btns = pele.find('.input-button'), btnArr = [];
			btns.each(function(index, btn) {
				var offsetLeft = $(btn).parent().position().left;
				var offsetTop = $(btn).parent().position().top;
				var btnData = {
					"left_margin": offsetLeft,
					"right_margin": $(pele).width() - $(btn).width() - offsetLeft,
					"up_margin": offsetTop,
					"down_margin": $(pele).height() - $(btn).height() - offsetTop,
					"link": $(btn).attr('data-btn'),
					"is_fixed": ~~$(btn).attr('fix')
				};
				btnArr.push(btnData);
			});
			// 电话
			var tels = pele.find('.input-tel'), telArr = [];
			tels.each(function(index, tel) {
				var offsetLeft = $(tel).parent().position().left;
				var offsetTop = $(tel).parent().position().top;
				var telData = {
					"left_margin": offsetLeft,
					"right_margin": $(pele).width() - $(tel).width() - offsetLeft,
					"up_margin": offsetTop,
					"down_margin": $(pele).height() - $(tel).height() - offsetTop,
					"phone_num": $(tel).attr('data-tel') || '',
					"is_fixed": $(tel).attr('fix') == '2' ? 1 : 0
				};
				telArr.push(telData);
			});
			// 下载
			var links = pele.find('.input-link'), linkArr = [];
			links.each(function(index, link) {
				var offsetLeft = $(link).parent().position().left;
				var offsetTop = $(link).parent().position().top;
				var linkData = {
					"left_margin": offsetLeft,
					"right_margin": $(pele).width() - $(link).width() - offsetLeft,
					"up_margin": offsetTop,
					"down_margin": $(pele).height() - $(link).height() - offsetTop,
					"ios_link": $(link).attr('ios') || '',
					"android_link": $(link).attr('android') || '',
					"is_fixed": ~~$(link).attr('fix')
				};
				linkArr.push(linkData);
			});
			// 表单、电商表单
			var frms = pele.find('.input-form, .input-ebform'), frmArr = [];
			frms.each(function(index, frm) {
				var offsetLeft = $(frm).parent().position().left;
				var offsetTop = $(frm).parent().position().top;

				var txtCount = $('.e-form-input[type=text], .e-form-input[type=number]', frm).length;
				var txtReqCount = $('.e-form-input[type=text][v-must=1]', frm).length;
				var cbBoxCount = $('.e-form-select', frm).length;
				var fltCount = $('.e-form-box', frm).length;

				var frmData = {
					"left_margin": offsetLeft,
					"right_margin": $(pele).width() - $(frm).width() - offsetLeft,
					"up_margin": offsetTop,
					"down_margin": $(pele).height() - $(frm).height() - offsetTop,
					"textbox_count": txtCount,
					"textbox_required_count": txtReqCount,
					"combobox_count": cbBoxCount,
					"filteritem_count": fltCount
				};
				frmArr.push(frmData);
			});
			var data = {
				"page_num": ind,//$('.drag-container:not(:empty)', pele).length,
				"has_back_pic": pele.css('background-image') ? 1 : 0,
				"back_pic_size": (pele.attr('imgsize')/1024).toFixed(2) - 0 || 0,
				"back_color": pele.css('background-color'),
				"nor_pic_count": imgs.length,
				"nor_pic_size": (imgTotalSize/1024).toFixed(2) - 0,
				"car_pic_count": sliderImgs.length,
				"car_pic_size": (sliderImgTotalSize/1024).toFixed(2) - 0,
				"txt_count": txts.length,
				"txt": txtArr,
				"has_dow_but": pele.find('input-link').length ? 1 : 0,
				"link_but_count": btnArr.length,
				"link_but": btnArr,
				"tel_but_count": telArr.length,
				"tel_but": telArr,
				"dow_but_count": linkArr.length,
				"dow_but": linkArr,
				"list_count": frmArr.length,
				"list": frmArr
			};
			return data;
		};

		// 预览
		$('#preview').on('click', function() {
			var content = $('#page').html();
			if(content) {
				content = filterHTML(content);
				$('.page_show').html(content);
				$('.cover').fadeIn();
			}
		});

		var SAVE = function(cb) {
			if (!timeoutFlag) return;
			$('.right, .empty').hide();
			if (!$('#webName').val().trim()) {
				$('.empty').show();
				return;
			}
			$('.right').show();
			if (!validated()) return;
			if (hasContent()) {
				loading.show();
				timeoutFlag = false;
				getHash(function () {
					createForm(function () {
						if (cb) $('.input-form, .input-ebform', '#page').attr('et', 1);
						saveStaticResource(cb);
					});
				});
			} else {
				loading.hide();
				timeoutFlag = true;
				statusTemp = status;
				$.alert('error', '第' + emptyPageInd + '页内容为空');
			}
		};

		// 保存
		$('#save').on('click', function() {
			SAVE();
		});

		// 发布
		var publishState = true;
		$('#publish').on('click', function(e) {
			if (!publishState) return false;
			publishState = false;
			if (confirm('上线后站点可进行分享，数据统计等。确认是否发布该站点？')) {
				$('.butn').eq(0).trigger('click');
				SAVE(function() {
					statusTemp = 'RELEASE_ONLINE';
					var da = {
						hash: hash,
						pageSize: $('.viewlist .prePage').length,
						id: id
					};
					publishState = true;
					/*MJJS.http.post(api.publish, da, function(o) {
						publishEnd();
					});*/
					publishEnd();
				});
			} else {
				publishState = true;
			}
		});
	});
})(document);
