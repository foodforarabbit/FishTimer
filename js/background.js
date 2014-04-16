if (jQuery) {  
  chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html', {
      'bounds': {
        'width': 400,
        'height': 800
      }
    });
  });
} else {
}