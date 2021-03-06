var activeTab = 'all';
var session = Storages.initNamespaceStorage('layeredWebUI').localStorage;

var TopBar = {
	statistics: function() {
		$('section.topBar p.additionalData span.statistics').unbind();
		$('section.topBar p.additionalData span.statistics').click(function() {
			Sidebar.open('statistics');

			$('section.sidebarOverflow').click(function() {
				clearInterval(Listener.sessionStatsInterval);
				$('section.sidebarOverflow').unbind();
			});
		});
	},

	filterBar: function() {
		$('section.header ul li').click(function() {
			var odd = true;

			$('section.header ul li[data-href="' + activeTab + '"]').removeClass('active');
			$(this).addClass('active');

			$('section.torrents').removeClass('all downloading seeding idling queued paused errored');
			$('section.torrents').addClass($(this).data('href'));

			$('section.torrents section.torrent').removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5');

			activeTab = $(this).data('href');

			if (activeTab != 'all') {
				$('section.torrents').addClass('searchQuery');

				$('section.torrents section.torrent').each(function(index, torrent) {
					if ($(this).hasClass(activeTab)) {
						$(this).removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').addClass('result ' + ((odd) ? 'suffix-2 tablet-suffix-5' : 'prefix-2 tablet-prefix-5'));
						odd = !odd;
					}

					else {
						$(this).removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').removeClass('result');
					}
				});
			}

			else {
				$('section.torrents').removeClass('searchQuery');
				$('section.torrents section.torrent').removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').removeClass('result');
			}
		});
	}
};

var FloatingButtonHelper = {
	init: function() {
		$('section.floatingActions ul, section.floatingOptions ul').addClass('hidden');

		$('section.fixed-action-btn.click-to-toggle > a').click(function() {
			var menu = $(this).parent().find('ul');

			if (menu.hasClass('hidden')) {
				menu.removeClass('hidden');
			}

			else {
				setTimeout(function() { menu.addClass('hidden'); }, 250);
			}
		});
	}
}

var Sidebar = {
	open: function(view) {
		$('body').css('overflow', 'hidden');

		if (view == 'torrentInformation') { $('section.sidebar').removeClass('box-shadow'); }
		else { $('section.sidebar').addClass('box-shadow'); }

		$('section.sidebar > section').removeClass('active');
		$('section.sidebar > section.' + view).addClass('active');

		$('section.sidebar').animate({
			right: '0%'
		}, 300);

		$('section.sidebarOverflow').removeClass('hidden');

		$('section.sidebarOverflow').unbind();
		$('section.sidebarOverflow').click(function() {
			$('body').css('overflow', 'initial');

			$('section.sidebar').animate({
				right: '-100%'
			}, 300);

			$('section.sidebarOverflow').addClass('hidden');
		});
	},

	close: function() {
		$('body').css('overflow', 'initial');

		$('section.sidebar').animate({
			right: '-100%'
		}, 300);

		$('section.sidebarOverflow').addClass('hidden');
	}
};

$(window).on('load', function() {
	Configurator.set(); // set session properties saved by user previously

	Internationalization.changeLanguage(Configuration.language, function() {
		$('section.torrents').attr('view', Configuration.torrentView);

		$('ul.tabs').tabs();
		$(".tooltipped").tooltip();

		TopBar.statistics(); // initializes the statistics button
		TopBar.filterBar(); // initializes the filter bar
		FloatingButtonHelper.init(); // stop tooltips and buttons from being clicked when not shown
		
		Listener.setIntervals(); // set interval to get torrents & statistics

		Listener.addTorrent(); // initializes the addTorrent button
		Listener.updateSettings(); // updates settings (one-time)
		Listener.searchTorrent(); // initializes the search torrent feature
		Listener.searchTracker(); // initializes the search tracker feature
		Listener.toggleSpeedLimitButton(); // initializes the speed limit button
		Listener.showCredits(); // initializes the credits

		TransmissionServer.getSettings();
	}, true); // true to make sure that Internationalization shuts up
});