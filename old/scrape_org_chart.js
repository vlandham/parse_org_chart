var system = require('system');

var start_url = "https://mysite/Person.aspx?accountname=NORD%5CZ7DW" 
// var start_url = "http://www.google.com"

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';

page.settings.userName = 'x25u';
page.settings.password = 'Tiger13*Star';

page.customHeaders={'Authorization': 'Basic '+btoa('username:password')};

page.onConsoleMessage = function(msg) {
  console.log('' + msg);
};


// ---
// page.onResourceRequested = function (request) {
//     system.stderr.writeLine('= onResourceRequested()');
//     system.stderr.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
// };
//  
// page.onResourceReceived = function(response) {
//     system.stderr.writeLine('= onResourceReceived()' );
//     system.stderr.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
// };
//  
// page.onLoadStarted = function() {
//     system.stderr.writeLine('= onLoadStarted()');
//     var currentUrl = page.evaluate(function() {
//         return window.location.href;
//     });
//     system.stderr.writeLine('  leaving url: ' + currentUrl);
// };
//  
// page.onLoadFinished = function(status) {
//     system.stderr.writeLine('= onLoadFinished()');
//     system.stderr.writeLine('  status: ' + status);
//     var currentUrl = page.evaluate(function() {
//         return window.location.href;
//     });
//     system.stderr.writeLine('  on url: ' + currentUrl);
// };
//  
// page.onNavigationRequested = function(url, type, willNavigate, main) {
//     system.stderr.writeLine('= onNavigationRequested');
//     system.stderr.writeLine('  destination_url: ' + url);
//     system.stderr.writeLine('  type (cause): ' + type);
//     system.stderr.writeLine('  will navigate: ' + willNavigate);
//     system.stderr.writeLine('  from page\\'s main frame: ' + main);
// };
//  
// page.onResourceError = function(resourceError) {
//     system.stderr.writeLine('= onResourceError()');
//     system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
//     system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
// };

// ---

// page.onResourceError = function(resourceError) {
//     page.reason = resourceError.errorString;
//     page.reason_url = resourceError.url;
//     console.log(page.reason);
// };



grab = function(id) {
	var req = new Sys.Net.WebRequest;
	req.set_url("https://mysite/_vti_bin/SilverlightProfileService.json/GetUserSLProfileData");
	req._headers = {'Content-Type': 'application/json'}
	req.add_completed(complete);
	var body = Sys.Serialization.JavaScriptSerializer.serialize({"AccountNames":[id]});
	req.set_body(body);
  console.log(req);
	req.invoke();
}

page.all = []
page.complete = function(d) {
  console.log(d);
	var content = d.get_object();
	var content = content.d;
	page.all.push(content);
	content.forEach(function(person) {
		person.Children.forEach(function(childId) {
			console.log(childId);
			grab(childId);
		});
	});
};



// grab("NORD\\\\ZBWN")
// grab("NORD\\\\YYIW")
// grab("NORD\\\\ZPEN")
// grab("NORD\\\\ZEN1")
// grab("NORD\\YSM7")




page.open(start_url, function(status) {
  console.log(status);

  page.evaluate(function() {
    var complete = function(d) {
      console.log(JSON.stringify(d));
      var content = d.get_object();
      var content = content.d;
      page.all.push(content);
      content.forEach(function(person) {
        person.Children.forEach(function(childId) {
          console.log(childId);
          grab(childId);
        });
      });
    };

    var grab = function(id) {
      var req = new Sys.Net.WebRequest;
      req.set_url("https://mysite/_vti_bin/SilverlightProfileService.json/GetUserSLProfileData");
      req._headers = {'Content-Type': 'application/json'}
      req.add_completed(complete);
      var body = Sys.Serialization.JavaScriptSerializer.serialize({"AccountNames":[id]});
      req.set_body(body);
      console.log(JSON.stringify(req));
      req.invoke();
    }

    function just_wait() {
      setTimeout(function() {
        page.render('screenshot.png');
        phantom.exit();
      }, 2000);
    }


    console.log("grabbing")
    grab("NORD\\Z7DW");
  });

  console.log(JSON.stringify(page.all));
  // phantom.exit();
});
