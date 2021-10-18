// ON DOCUMENT READY
(function ($) {
	$.fn.lightTabs = function() {
		var showTab = function(tab, saveHash) {
			if (!$(tab).hasClass('tab-act')) {
				var tabs = $(tab).closest('.tabs');

				var target_id = $(tab).attr('href');
		        var old_target_id = $(tabs).find('.tab-act').attr('href');
		        $(target_id).show();
		        $(old_target_id).hide();
		        $(tabs).find('.tab-act').removeClass('tab-act');
		        $(tab).addClass('tab-act');

		        if (typeof(saveHash) != 'undefined' && saveHash) history.pushState(null, null, target_id);
			}
		}

		var initTabs = function() {
            var tabs = this;
            var hasAct = $(tabs).find('.tab-act').length;
            
            $(tabs).find('a').each(function(i, tab){
                $(tab).click(function(e) {
                	e.preventDefault();

                	showTab(this, true);
                	fadeoutInit();

                	return false;
                });
                if ((!hasAct && i == 0) || (hasAct && $(tab).hasClass('tab-act'))) showTab(tab);             
                else $($(tab).attr('href')).hide();
            });	

            $(tabs).swipe({
				swipeStatus: function(event, phase, direction, distance) {
					var offset = distance;

					if (phase === $.fn.swipe.phases.PHASE_START) {
						var origPos = $(this).scrollLeft();
						$(this).data('origPos', origPos);

					} else if (phase === $.fn.swipe.phases.PHASE_MOVE) {
						var origPos = $(this).data('origPos');

						if (direction == 'left') {
							var scroll_max = $(this).prop('scrollWidth') - $(this).width();
							var scroll_value_new = origPos - 0 + offset;
							$(this).scrollLeft(scroll_value_new);
							if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
							else $(this).removeClass('scrolled-full');

						} else if (direction == 'right') {
							var scroll_value_new = origPos - offset;
							$(this).scrollLeft(scroll_value_new);
							$(this).removeClass('scrolled-full');
						}

					} else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
						var origPos = $(this).data('origPos');
						$(this).scrollLeft(origPos);

					} else if (phase === $.fn.swipe.phases.PHASE_END) {
						$(this).data('origPos', $(this).scrollLeft());
					}
				},
				threshold: 70
			});	
        };

        return this.each(initTabs);
    };

    function initPage() {
		initElements();	

		// REPLACE SVG IMAGES WITH SVG TAGS
		$('img.svg').each(function() {
			var $img = $(this);
			var imgId = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgSrc = $img.attr('src');
			$.get(imgSrc, function(data) {
				var $svg = $(data).find('svg');
				if (typeof imgId !== 'undefined') $svg = $svg.attr('id', imgId);
				if (typeof imgClass !== 'undefined') $svg = $svg.attr('class', imgClass);
				$svg = $svg.removeAttr('xmlns:a');
				$svg = $svg.removeAttr('width height');
				if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
			    	$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
			    }
			    $img.replaceWith($svg);
			}, 'xml');
		});

		// ANCHOR LINKS
		$('a.js-anchor').click(function(e) {
			e.preventDefault();

			_scrollTo($(this).attr('href'));
		});

		// MODAL LINKS
		$('.js-modal-link').click(function(e) {
			e.preventDefault();
			showModal($(this).attr('href') ? $(this).attr('href').substring(1) : $(this).attr('data-target').substring(1));
		});

		// SLICKS
		$('.js-slider').each(function(i, slider) {
			var mobile = $(slider).attr('data-mobile');
			var adaptive = $(slider).attr('data-adaptive');
			var dots = $(slider).attr('data-dots') === 'false' ? false : true;
			var arrows = $(slider).attr('data-arrows') === 'true' ? true : false;
			var autoplay = $(slider).attr('data-autoplay') ? $(slider).attr('data-autoplay') : false;
			var slidesToShow = adaptive ? Math.floor($(slider).outerWidth() / $(slider).children('li, .li').outerWidth()) : 1;
		
			if (mobile) {
				if ((mobile === 'true' && __isMobile) ||
					(mobile === 'middle' && __isMobileTabletMiddle) ||
					(mobile === 'small' && __isMobileTabletSmall) ||
					(mobile === 'mobile' && __isMobileSmall)) {					
		
					$(slider).slick({
						slidesToShow: slidesToShow,
						slidesToScroll: slidesToShow,
						dots: dots,
						arrows: arrows,
						autoplay: autoplay,
						centerMode: true,
	     				centerPadding: '0'
					});
				}
			} else {
				$(slider).slick({
					slidesToShow: slidesToShow,
					slidesToScroll: slidesToShow,
					dots: dots,
					arrows: arrows,
					autoplay: autoplay,
					centerMode: true,
	     			centerPadding: '0'
				});
			}
		});

		$(window).scroll();
		$(window).resize();	

		// BURGER
		$('#mn-holder').click(function() {
			if (!$('body').hasClass('mobile-opened')) {
				if (!$(this).children('.close').data('inited')) {
					$(this).children('.close').click(function(e) {
						e.stopPropagation();
						$('#modal-fadeout').stop().fadeOut(300);
						
						setTimeout(function() {
							$('body').removeClass('mobile-opened');
						}, __animationSpeed * 0.75);
						$('#search, #add-item').stop().fadeOut(__animationSpeed / 3);
						$('#mn-holder').animate({'right': '-90%'}, __animationSpeed, function() {
							$('#mn-holder').css('right', '0');
						});
					}).data('inited', true);
				}

				$('#mn-holder').css('right', '-90%');
				$('body').addClass('mobile-opened');
				$('#mn-holder').find('.close').stop().show();
				$('#mn-holder').animate({'right': '0'}, __animationSpeed);
				$('#search, #add-item').stop().delay(__animationSpeed / 2).fadeIn(__animationSpeed);

				if ($(this).children('ul').outerHeight() > $(window).height()) {
					$('html').addClass('html-mobile-long');
				} else {
					$('html').removeClass('html-mobile-long');
				}

				$('#modal-fadeout').stop().fadeIn(300);
			}
		});

		// PROFILE SIDEBAR
		$('#profile').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			$('.contents-inner').hide()
				.filter('#profile-sidebar-main').show();

			$('#profile-sidebar').removeClass('hidden');
			$('#modal-fadeout').stop().fadeIn(300);
			$('html').addClass('html-modal');
		});
		$('#profile-sidebar').show()
			.find('.close').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			$('#profile-sidebar').addClass('hidden');
			$('#modal-fadeout').stop().fadeOut(300);
			$('html').removeClass('html-modal');
		});
		$('#profile-sidebar [data-toggle]').click(function(e) {
			e.preventDefault();

			$('.contents-inner').hide()
				.filter($(this).attr('data-toggle')).show();
		});

		// INPUTS
		$('.input-clearing, .input-password').each(function(i, inputbox) {
			$(inputbox).find('input').on('input', function() {
				var $tool = $(this).siblings('.tool');
				if (!$(this).val()) $tool.hide();
				else $tool.show();
			});
			$(inputbox).find('input').trigger('input');
		});
		$('.input-clearing .tool').click(function() {
			$(this).siblings('input').val('').trigger('input');
		});
		$('.input-password .tool').click(function() {
			var $inputbox = $(this).closest('.input');
			if ($inputbox.hasClass('hidden')) {
				$inputbox.removeClass('hidden').addClass('shown')
					.find('input').attr('type', 'text');
			} else {
				$inputbox.removeClass('shown').addClass('hidden')
					.find('input').attr('type', 'password');
			}
		});

		// SEARCH
		if ($('#search').length) {
			function checkSearchInput() {
				if ($('#search input:text').val() == '') $('#search .tool').hide();
				else $('#search .tool').show();
			}
			$('#search input:text').on('input', function() {
				checkSearchInput();
			});
			$('#search .tool').click(function(e) {
				e.preventDefault();
				$('#search input:text').val('').focus();
				$('#search .tool').hide();
			});
			checkSearchInput();
		}

		// FORM START
		var $formStart = $('#form-start');
		var $formStartEmail = $formStart.find('input[name="email"]');
		var $formStartSubmit = $formStart.find('.btn');
		$formStartEmail.on('input', function() {
			if (checkEmail(this) && this.value != '') {
				$formStartSubmit.removeAttr('disabled');
			} else {
				$formStartSubmit.attr('disabled', 'disabled');
			}
		});
		$formStart.on('submit', function(e) {
			// DEMO
			e.preventDefault();

			$formStart.slideUp(__animationSpeed);
			$('#form-authorisation').slideDown(__animationSpeed)
				.find('input[type="email"]').val($formStartEmail.val()).trigger('input').parent('.input').addClass('focused');
		});

		// FORM AUTHORISATION
		var $formAuth = $('#form-authorisation');
		var $formAuthSubmit = $formAuth.find('.btn');
		$formAuth.find('input[name="email"], input[name="password"]').on('input', function() {
			var $formAuthEmail = $formAuth.find('input[name="email"]');
			var $formAuthPswd = $formAuth.find('input[name="password"]');
			if (checkEmail($formAuthEmail.get(0)) && $formAuthPswd.val() != '') {
				$formAuthSubmit.removeAttr('disabled');
			} else {
				$formAuthSubmit.attr('disabled', 'disabled');
			}
		});
		$formAuth.on('submit', function(e) {
			// DEMO
			e.preventDefault();

			redirect('index2.html');
		});

		// FORM FORGET
		var $formForget = $('#form-forget');
		var $formForgetSubmit = $formForget.find('.btn');
		$formForget.find('input[name="password"], input[name="password2"]').on('input', function() {
			var $formForgetPswd = $formForget.find('input[name="password"]');
			var $formForgetPswd2 = $formForget.find('input[name="password2"]');
			if ($formForgetPswd.val() != '' && $formForgetPswd2.val() != '' && $formForgetPswd.val() == $formForgetPswd2.val()) {
				$formForgetSubmit.removeAttr('disabled');
			} else {
				$formForgetSubmit.attr('disabled', 'disabled');
			}
		});
		$formForget.on('submit', function(e) {
			// DEMO
			e.preventDefault();
		});

		// FORM CONFIRMATION CODE
		var $formConfirmationCode = $('#form-confirmation-code');
		function confirmationCodeCheck() {
			var code = $formConfirmationCode.find('input[name="digit1"]').val() + $formConfirmationCode.find('input[name="digit2"]').val() + $formConfirmationCode.find('input[name="digit3"]').val() + $formConfirmationCode.find('input[name="digit4"]').val();
			msgUnset($formConfirmationCode.find('.repeat'));
			$formConfirmationCode.find('input').removeClass('err');
			if (code == '0000') {
				$formConfirmationCode.find('input[name="digit4"]').blur();
				return true;
			} else {
				msgSetError($formConfirmationCode.find('.repeat'), 'Код введен неверно');
				$formConfirmationCode.find('input').addClass('err');
				return false;
			}
		}
		$formConfirmationCode.find('input').on('keydown', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var key;
	        var keychar;
	        if (window.event) 
	        	key = window.event.keyCode;
	        else if 
	        	(e) key = e.which;
	        else 
	        	return true;
	        keychar = String.fromCharCode(key);
	        if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27)) {
	        	$(this).val('');
	        	if ($(this).next('input').length) {
	        		$(this).next('input').focus();
	        	} else {
	        		// DEMO CHECK CODE
	        		confirmationCodeCheck();
	        	}
	            return true;
	        }
	        else if (('0123456789').indexOf(keychar) > -1) {
	        	$(this).val(keychar);
	        	if ($(this).next('input').length) {
	        		$(this).next('input').focus();
	        	} else {
	        		// DEMO CHECK CODE
	        		confirmationCodeCheck();
	        	}
	            return true;
	        }
	        else
	            return false;
		});

		// UPLOAD FILES
		if ($('#upload-files').length) {
			function handleUploadedFiles(files) {
				// DEMO HANDLE HERE
				var url = '#';
				var formData = new FormData();
			  	formData.append('files', files);
			  	fetch(url, {
					method: 'POST',
				    body: formData
				})
				.then(function() {
					// DEMO
					$(files).each(function(i, file) {
						$('#upload-files-field ul>li:eq(' + i + ')').html('<img src="/assets/images/_item_full.jpg" alt=""><span class="close"></span>');
					});
					$('#upload-files-field ul>li>.close').click(function(e) {
						e.preventDefault();
						e.stopPropagation();

						$(this).closest('li').html('<a href="#" class="js-upload-file"><span>Добавить</span></a>')
							.find('.js-upload-file').click(function(e) {
								e.preventDefault();
								$('#upload-files-input').click();
							});
					});
					$('#upload-files-field ul').append('<li><a href="#" class="js-upload-file"><span>Добавить</span></a></li>');
					$('#upload-files ul>li:last .js-upload-file').click(function(e) {
						e.preventDefault();

						$('#upload-files-input').click();
					});
				})
				.catch(function() {
				});
			}

			$('#upload-files-field').on('dragenter dragover dragleave', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			$('#upload-files-field').on('dragenter dragover', function() {
				$(this).addClass('dragover');
			});

			$('#upload-files-field').on('dragleave drop', function() {
				$(this).removeClass('dragover');
			});

			$('#upload-files-field').get(0).addEventListener('drop', function(e) {
				e.preventDefault();
				e.stopPropagation();

				e = e || window.event;
				var files = e.dataTransfer.files;
				handleUploadedFiles(files);
			});

			$('#upload-files-input').on('change', function() {
				handleUploadedFiles(this.files);
			});

			$('#upload-files .js-upload-file').click(function(e) {
				e.preventDefault();

				$('#upload-files-input').click();
			});
		}

		// CHOOSE TYPE
		if ($('#type').length) {
			var $inp = $('#type>input:hidden');
			$('#type ul>li').click(function() {
				$(this).addClass('act')
					.siblings().removeClass('act');
				$inp.val($(this).attr('data-val'));
			});
		}

		// CHOOSE DISCOUNT
		if ($('#discount').length) {
			var $inp = $('#discount>input:hidden');
			$('#discount ul>li').click(function() {
				$(this).addClass('act')
					.siblings().removeClass('act');
				$inp.val($(this).attr('data-val'));
			});
		}

		// CHOOSE PRICE
		if ($('#price').length) {
			var $inp = $('#price>input:hidden');
			$('#price ul>li').click(function() {
				$(this).addClass('act')
					.siblings().removeClass('act');
				$inp.val($(this).attr('data-val'));
			});
		}

		// CHOOSE DURATION
		if ($('#duration').length) {
			var $inp = $('#duration>input:hidden');
			$('#duration ul>li').click(function() {
				$(this).addClass('act')
					.siblings().removeClass('act');
				$inp.val($(this).attr('data-val'));
			});
		}

		// FORM CHOOSE DURATION
		var $formChooseDuration = $('#form-choose-duration');
		var $btnChooseDuration = $formChooseDuration.children('.btn');
		function chooseDurationCheck() {
			var date = $formChooseDuration.find('input[name="date"]').val();
			var time = $formChooseDuration.find('input[name="hours1"]').val() + $formChooseDuration.find('input[name="hours2"]').val() + $formChooseDuration.find('input[name="minutes1"]').val() + $formChooseDuration.find('input[name="minutes2"]').val();
			return date && time.length == 4;
		}
		$formChooseDuration.find('.js-calendar').each(function(i, cal) {
			Calendar(cal, new Date(), function() {
				$formChooseDuration.find('input[name="date"]').val($(this).attr('data-date'));
				if (chooseDurationCheck()) $btnChooseDuration.removeAttr('disabled');
	        	else $btnChooseDuration.attr('disabled', 'disabled');
			});
		});
		$formChooseDuration.find('.time-holder input').on('keydown', function(e) {
			e.preventDefault();
			e.stopPropagation();

			var key;
	        var keychar;
	        if (window.event) 
	        	key = window.event.keyCode;
	        else if 
	        	(e) key = e.which;
	        else 
	        	return true;
	        keychar = String.fromCharCode(key);
	        if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27)) {
	        	$(this).val('').removeClass('filled');
	        	$(this).siblings('.colon').removeClass('filled');
	        	if ($(this).next('input').length) {
	        		$(this).next('input').focus();
	        	} else {
	        		if ($(this).next('span').next('input').length) {
	        			$(this).next('span').next('input').focus();
	        		} else {
	        			$(this).blur();
	        		}
	        	}
	        	if (chooseDurationCheck()) $btnChooseDuration.removeAttr('disabled');
	        	else $btnChooseDuration.attr('disabled', 'disabled');
	            return true;
	        }
	        else if (('0123456789').indexOf(keychar) > -1) {
	        	$(this).val(keychar).addClass('filled');
	        	if ($(this).next('input').length) {
	        		$(this).next('input').focus();
	        	} else {
	        		if ($(this).next('span').next('input').length) {
	        			$(this).next('span').next('input').focus();
	        		} else {
	        			$(this).blur();
	        		}
	        	}
	        	if (!$formChooseDuration.find('.time-holder input').not('.filled').length) {
	        		$(this).siblings('.colon').addClass('filled');
	        	}
	        	if (chooseDurationCheck()) $btnChooseDuration.removeAttr('disabled');
	        	else $btnChooseDuration.attr('disabled', 'disabled');
	            return true;
	        }
	        else
	            return false;
		});
		$formChooseDuration.on('submit', function(e) {
			e.preventDefault();

			var arr = $formChooseDuration.find('input[name="date"]').val().split('-');
			arr.push($formChooseDuration.find('input[name="hours1"]').val() + $formChooseDuration.find('input[name="hours2"]').val());
			arr.push($formChooseDuration.find('input[name="minutes1"]').val() + $formChooseDuration.find('input[name="minutes2"]').val());
			var selectedDate = new Date(arr[0], arr[1], arr[2], arr[3], arr[4]);
			var now = new Date();

			// duration in seconds
			var duration = (now - selectedDate) / 1000;
			
			$('#input-duration').val(duration);
		});

		// FORM PROFILE EDIT
		var $formProfileEdit = $('#form-profile-edit');
		$formProfileEdit.find('.input .tool').click(function(e) {
			e.preventDefault();

			$(this).siblings('input').removeAttr('disabled').focus();
		});
		$formProfileEdit.find('.input input').on('input', function() {
			$formProfileEdit.find('.btn').removeAttr('disabled');
		});
		$formProfileEdit.on('submit', function(e) {
			// DEMO
			e.preventDefault();

			$formProfileEdit.find('.input input').attr('disabled', 'disabled');
			$formProfileEdit.find('.btn').attr('disabled', 'disabled');
		});

		// FORM PROFILE FEEDBACK
		var $formProfileFeedback = $('#form-profile-feedback');
		var $formProfileFeedbackEmail = $formProfileFeedback.find('input[name="email"]');
		var $formProfileFeedbackText = $formProfileFeedback.find('textarea[name="text"]');
		$formProfileFeedback.find('input, textarea').on('input', function() {
			console.log($formProfileFeedbackEmail.val() != '' && $formProfileFeedbackText.val() != '');
			if ($formProfileFeedbackEmail.val() != '' && $formProfileFeedbackText.val() != '') {
				$formProfileFeedback.find('.btn').removeAttr('disabled');
			} else {
				$formProfileFeedback.find('.btn').attr('disabled', 'disabled');
			}
		});
		$formProfileFeedback.on('submit', function(e) {
			// DEMO
			e.preventDefault();

			$('#profile-sidebar-feedback').stop().fadeOut(__animationSpeed, function() {
				$('#profile-sidebar-done').stop().fadeIn(__animationSpeed);
			});
		});

		// CHAT
		if ($('#chat').length) {
			$('#chat-mn-btn').click(function() {
				$('#chat-fadeout').stop().fadeIn(450);
				$('#chat-mn').stop().fadeIn(300);
			});

			$('#chat-input').on('input', function() {
				if (this.value != '') $('#chat-send-btn').removeAttr('disabled');
				else $('#chat-send-btn').attr('disabled', 'disabled');
			});

			$('#attachments-mn-btn').click(function() {
				$('#chat-fadeout').stop().fadeIn(450);
				$('#attachments-mn').stop().fadeIn(300);
			});
		}

		// MODAL UPLOAD PHOTO
		if ($('#modal-upload-photo').length) {
			function handleUploadedFiles(files) {
				// DEMO HANDLE HERE
				var url = '#';
				var formData = new FormData();
			  	formData.append('files', files);
			  	fetch(url, {
					method: 'POST',
				    body: formData
				})
				.then(function() {
					// DEMO
					
				})
				.catch(function() {
				});
			}

			$('#upload-files-field').on('dragenter dragover dragleave', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			$('#upload-files-field').on('dragenter dragover', function() {
				$(this).addClass('dragover');
			});

			$('#upload-files-field').on('dragleave drop', function() {
				$(this).removeClass('dragover');
			});

			$('#upload-files-field').get(0).addEventListener('drop', function(e) {
				e.preventDefault();
				e.stopPropagation();

				e = e || window.event;
				var files = e.dataTransfer.files;
				handleUploadedFiles(files);
			});

			$('#upload-files-input').on('change', function() {
				handleUploadedFiles(this.files);
			});

			$('#upload-files .js-upload-file').click(function(e) {
				e.preventDefault();

				$('#upload-files-input').click();
			});
		}

		// UPLOAD LOGO
		if ($('#upload-logo').length) {
			function handleUploadedFiles(files) {
				// DEMO HANDLE HERE
				var url = '#';
				var formData = new FormData();
			  	formData.append('files', files);
			  	fetch(url, {
					method: 'POST',
				    body: formData
				})
				.then(function() {
					// DEMO
					var color = $('#upload-logo-color').val();
					if (!color) {
						color = '#333333';
						$('#upload-logo-color').val(color);
					}
					$('#upload-file-field').html('<img src="assets/images/_partner7.svg" alt=""/><span class="edit js-upload-file">ИЗМЕНИТЬ</span>').addClass('uploaded').css('background-color', color);
					
				})
				.catch(function() {
				});
			}

			$('#upload-file-field').on('dragenter dragover dragleave', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			$('#upload-file-field').on('dragenter dragover', function() {
				$(this).addClass('dragover');
			});

			$('#upload-file-field').on('dragleave drop', function() {
				$(this).removeClass('dragover');
			});

			$('#upload-file-field').get(0).addEventListener('drop', function(e) {
				e.preventDefault();
				e.stopPropagation();

				e = e || window.event;
				var files = e.dataTransfer.files;
				handleUploadedFiles(files);
			});

			$('#upload-file-input').on('change', function() {
				handleUploadedFiles(this.file);
			});

			$('#upload-logo .js-upload-file').click(function(e) {
				e.preventDefault();

				$('#upload-file-input').click();
			});
		}

		// SELECT
		if ($('.select').length) {
			function selectOpen(select) {
				$(select).addClass('opened');
			}

			function selectClose(select) {
				$(select).removeClass('opened');
			}

			function selectSetItem(item) {
				var $select = $(item).closest('.select');
				var $inputText = $select.find('input:text');
				var $inputVal = $select.find('input:hidden');

				$(item).addClass('act').siblings().removeClass('act');
				$inputText.val($(item).attr('data-text'));
				$inputVal.val($(item).attr('data-value'));
				selectClose($select);
			}

			$('.select').each(function(e, select) {
				$(select).find('.input-holder').click(function(e) {
					var $select = $(this).closest('.select');
					if ($select.hasClass('opened')) selectClose($select);
					else selectOpen($select);
				});
			});
			$('.select .dropdown li').click(function(e) {
				e.preventDefault();
				e.stopPropagation();

				selectSetItem(this);
			});
		}	

		// MODAL DONATE
		if ($('#modal-donate').length) {
			$('#modal-donate .templates>li').click(function() {
				var val = $(this).attr('data-val');
				var karmitts = Math.floor(val / 10);
				var $input = $('#modal-donate .input input:text');
				var $cashback = $('#modal-donate .cashback span');

				$input.val(val);
				$('#modal-donate .input').addClass('focused');
				$cashback.text(karmitts).addClass('act');

				$('#modal-donate .btn').removeAttr('disabled');
			});

			$('#modal-donate .input input:text').on('input', function() {
				var val = this.value;
				var karmitts = Math.floor(val / 10);
				var $cashback = $('#modal-donate .cashback span');

				if (val != '' && val != 0) {
					$cashback.text(karmitts).addClass('act');

					$('#modal-donate .btn').removeAttr('disabled');
				} else {
					$cashback.text('0').removeClass('act');

					$('#modal-donate .btn').attr('disabled', 'disabled');
				}
				
			});
		}

		// TYPE TOGGLER
		if ($('#type').length) {
			$('#type ul li').click(function() {
				if ($(this).attr('data-toggle') == 'discount') $('#discount').stop().slideDown(__animationSpeed);
				else $('#discount').stop().slideUp(__animationSpeed);
			});
		}

		// MY ITEM SLIDER
		if ($('#item .users-list').length) {
			function userListPos() {
				$ul = $('#item .users-list ul');
				$lis = $ul.find('li, .li');

				if (!__isMobile && $lis.length > 5) {
					if (!$ul.hasClass('slick-initialized')) {
						$ul.slick({
							slidesToShow: 5,
							slidesToScroll: 5,
							dots: false,
							arrows: true,
							autoplay: false,
							centerMode: false,
							infinite: false
						});
					}
				} else {
					if ($ul.hasClass('slick-initialized')) {
						$ul.slick('unslick');
					}
					$ul.addClass('js-fadeout fadeout').attr({
						'data-mobile-only': true,
						'data-max-width': 1000
					});
					fadeoutInit($ul.parent());
				}
			}
			resizeCallbacks.push(userListPos);
			userListPos();
		}
    }

    initPage();
})(jQuery)