/*
 * tracking.js
 * Pushing virtual page views to GA
 */
function trackPage() {
    dataLayer.push({
        'event'            : 'virtualPageView',
        'virtualPageTitle' : document.title,
        'virtualPageURL'   : window.location.pathname
	});
}
