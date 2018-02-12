chrome.contextMenus.create({
  'title': 'Download with Download Shuttle',
  'contexts': ['link'],
  'id': 'fl_downloadLink'
});

chrome.contextMenus.create({
  'title': 'Download Selected with Download Shuttle',
  'contexts': ['selection'],
  'id': 'fl_downloadSelected'
});

chrome.contextMenus.create({
  'title': 'Download All with Download Shuttle',
  'contexts': ['all'],
  'id': 'fl_downloadAll'
});

chrome.contextMenus.onClicked.addListener( function(info, tab) {
  var message = {
    'action': info.menuItemId,
    'url': info.linkUrl,
    'pageUrl': info.pageUrl
  };
  return chrome.tabs.sendMessage(tab.id, message);
});
