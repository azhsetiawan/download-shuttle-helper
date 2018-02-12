var FLURLDetector;

FLURLDetector = (function() {
  function FLURLDetector() {}

  FLURLDetector.prototype.listener = function(request, sender, callback) {
    var action, baseURL, link, links, resolvedURL, supported, urls, _i, _len;
    links = [];
    action = request.action;
    supported = true;
    switch (action) {
      case 'fl_downloadSelected':
        links = this.getSelectedLinks();
        break;
      case 'fl_downloadAll':
        links = this.getAllLinks();
        break;
      case 'fl_downloadLink':
        links = this.getLinkWithInfo(request);
        break;
      default:
        supported = false;
    }
    if (!supported) {
      return;
    }
    if (!links || !links.length) {
      this.displayNoURLSAlert();
      return;
    }
    urls = [];
    baseURL = request.pageUrl;
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      link = links[_i];
      resolvedURL = this.resolveURL(link, baseURL);
      urls.push(resolvedURL);
    }
    return this.openDownloadShuttleWithURLs(urls);
  };

  FLURLDetector.prototype.openDownloadShuttleWithURLs = function(urls) {
    var content, url;
    if (!urls.length) {
      return;
    }
    content = JSON.stringify(urls);
    content = encodeURIComponent(content);
    url = 'downloadshuttle://add/' + content;
    return document.location.href = url;
  };

  FLURLDetector.prototype.displayNoURLSAlert = function() {
    return alert("Uh oh! I couldn't find any links in the selected text.");
  };

  FLURLDetector.prototype.getAllLinks = function() {
    var linkArray, linkNodes, node, _i, _len;
    linkNodes = document.links;
    linkArray = [];
    for (_i = 0, _len = linkNodes.length; _i < _len; _i++) {
      node = linkNodes[_i];
      linkArray.push(node.href);
    }
    return linkArray;
  };

  FLURLDetector.prototype.getLinkWithInfo = function(info) {
    var linkArray;
    return linkArray = [info.url];
  };

  FLURLDetector.prototype.getSelectedLinks = function() {
    var links, linksArray, node, parentElem, range, returnNodes, windowSelection, _i, _len;
    windowSelection = window.getSelection();
    range = windowSelection.getRangeAt(0);
    returnNodes = null;
    if (range) {
      linksArray = [];
      parentElem = range.commonAncestorContainer.parentElement;
      if (parentElem.tagName === 'A') {
        linksArray.push(parentElem.href);
      } else {
        links = parentElem.querySelectorAll('a');
        for (_i = 0, _len = links.length; _i < _len; _i++) {
          node = links[_i];
          if (range.intersectsNode(node)) {
            linksArray.push(node.href);
          }
        }
      }
      returnNodes = linksArray;
    }
    return returnNodes;
  };

  FLURLDetector.prototype.resolveURL = function(url, base_url) {
    var doc, doc_head, old_base, old_href, our_base, resolved_url, resolver;
    doc = document;
    old_base = doc.getElementsByTagName('base')[0];
    old_href = old_base && old_base.href;
    doc_head = doc.head || doc.getElementsByTagName('head')[0];
    our_base = old_base || doc_head.appendChild(doc.createElement('base'));
    resolver = doc.createElement('a');
    resolved_url;
    our_base.href = base_url;
    resolver.href = url;
    resolved_url = resolver.href;
    if (old_base) {
      old_base.href = old_href;
    } else {
      doc_head.removeChild(our_base);
    }
    return resolved_url;
  };

  return FLURLDetector;

})();

chrome.runtime.onMessage.addListener( function(request, sender, callback) {
  var helper = new FLURLDetector;
  return helper.listener(request, sender, callback);
});
