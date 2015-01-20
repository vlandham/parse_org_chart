
// https://mysite/default.aspx



// pete: ZPEN
// ken worzel: YYIW
// jamie nordstrom
// dan litte: ZTSI
// grab("NORD\\ZJN7") //WARNING: TOO MUCH!


curDate = function() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  newdate = year + "_" + month + "_" + day;
  return newdate;
}

var names = {
  "ZTSI":"dan_little",
  "YYIW":"ken_worzel"
}

// lan_id = "ZTSI";
lan_id = "YYIW";
full_lan_id = "NORD\\" + lan_id;

person_name = names[lan_id];
filename = person_name + "_" + curDate() + ".json";
// full_filename = "~/code/ruby/scrape_org_chart/data/" + filename

var waiting_count = 0;
var all = [];

// reset = function(d) {
//   waiting_count = 0;
//   all = [];
// }
// 


(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 2)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)



grab = function(id) {
  waiting_count = waiting_count + 1;
	var req = new Sys.Net.WebRequest;
	req.set_url("https://mysite/_vti_bin/SilverlightProfileService.json/GetUserSLProfileData");
	req._headers = {'Content-Type': 'application/json'}
	req.add_completed(complete);
	var body = Sys.Serialization.JavaScriptSerializer.serialize({"AccountNames":[id]});
	req.set_body(body);
	req.invoke();
}

complete = function(d) {
	var content = d.get_object();
	var content = content.d;
	all.push(content);
	content.forEach(function(person) {
    console.log(person.Children.length);
		person.Children.forEach(function(childId) {
			//console.log(childId);
			grab(childId);
		});
	});
  waiting_count = waiting_count - 1;
  if(waiting_count == 0) {
    console.log("-----");
    console.log("done");
    console.log("-----");
    console.save(all, filename);
  }

};


grab(full_lan_id)



