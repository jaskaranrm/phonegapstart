var db;

$('#reposHome').bind('pageinit', function(event) {
    loadRepos1();
});


function createDb(tx) {
    tx.executeSql("DROP TABLE IF EXISTS repos");
    tx.executeSql("CREATE TABLE repos(user,name)");
}

function txError(error) {
    console.log(error);
    console.log("Database error: " + error);
}

function txSuccess() {
    console.log("Success");
}

function saveFave() {
    db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    db.transaction(saveFaveDb, txError, txSuccessFave);
}

function saveFaveDb(tx) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
        
    tx.executeSql("INSERT INTO repos(user,name) VALUES (?, ?)",[owner,name]);
}

function txSuccessFave() {
    console.log("Save success");
        
    disableSaveButton();
}

function checkFave() {
    db.transaction(checkFaveDb, txError);
}

function checkFaveDb(tx) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
    
    tx.executeSql("SELECT * FROM repos WHERE user = ? AND name = ?",[owner,name],txSuccessCheckFave);
}

function txSuccessCheckFave(tx,results) {
    console.log("Read success");
    console.log(results);
    
    if (results.rows.length)
        disableSaveButton();
}

function alertDismissed() {
    $.mobile.changePage("index.html");
}

function disableSaveButton() {
    // change the button text and style
    var ctx = $("#saveBtn").closest(".ui-btn");
    $('span.ui-btn-text',ctx).text("Saved").closest(".ui-btn-inner").addClass("ui-btn-up-b");
    
    $("#saveBtn").unbind("click", saveFave);
}

$('#favesHome').live('pageshow', function(event) {
    db.transaction(loadFavesDb, txError, txSuccess);
});

function loadFavesDb(tx) {
    tx.executeSql("SELECT * FROM repos",[],txSuccessLoadFaves);
}

function txSuccessLoadFaves(tx,results) {
    console.log("Read success");
    
    if (results.rows.length) {
        var len = results.rows.length;
        var repo;
        for (var i=0; i < len; i = i + 1) {
            repo = results.rows.item(i);
            console.log(repo);
            $("#savedItems").append("<li><a href='repo-detail.html?owner=" + repo.user + "&name=" + repo.name + "'>"
            + "<h4>" + repo.name + "</h4>"
            + "<p>" + repo.user + "</p></a></li>");
        };
        $('#savedItems').listview('refresh');
    }
    else {
        if (navigator.notification)
            navigator.notification.alert("You haven't saved any favorites yet.", alertDismissed);
        else
            alert("You haven't saved any favorites yet.");
    }
}

function loadRepos() {
    $.ajax({
	  type: "GET",
	  url: "http://dt.gsmaoneapiexchange.com/v1/discovery/apis?redirect_uri=http://54.235.178.245:8080/SamuraiApp/Redirect",
	  headers: {"Authorization":"Basic MTFiNTY3MDk4aXloZGZza2phc3lsa2pmNjg4NzZlYTU5MzJiMzo5ODczMjRiMzdkOGU0YTYwOTc4ODh0NmdoaHM3OWU3MWIyMzc1NTg="},
	  complete: function (XMLHttpRequest, textStatus) {
	  alert(XMLHttpRequest.status);
		var headers = XMLHttpRequest.getAllResponseHeaders();
		},
	  
	  success: function(data, textStatus) {
	  alert("here");
        if (data.redirect) {
            // data.redirect contains the string URL to redirect to
            window.location.href = data.redirect;
        }
       
    }
	})
	
}


function loadRepos1() {
    $.ajax({
	  type: "GET",
	  data: "{ 'amountTransaction': {        'transactionOperationStatus': 'Reserved',        'clientCorrelator': '1520706649',        'endUserId':'acr:Authorization',         'referenceCode': '1520706649',         'referenceSequence': '1',        'paymentAmount': {           'chargingInformation': {                'amount': '0.01',                'currency': 'EUR',                'title': 'Samurai',               'description': 'Samurai fight for honour'            },            'chargingMetaData': {                'onBehalfOf': 'Hirakari Games Inc',                'purchaseCategoryCode': '1',                'channel': 'MOBILE_WEB',                'taxAmount': '0',               'callbackURL':'http://54.235.178.245:8080/SamuraiApp/Notify'            }        } }}",
	  url: "https://att-ex-prod.apigee.net/v1/payment/acr:Authorization/transactions/amountReservation",
	  headers: {"Authorization":"Authorization: ClientCredential TWVDU0R2R2kxc0NTMWt3b0tzTkltRlhHdVJRODRyak46WlBNZWdpc3NxYnhsb0RTMw==",
	  "Content-Type":"application/json"},
	  complete: function (XMLHttpRequest, textStatus) {
		var headers = XMLHttpRequest.getAllResponseHeaders();
		alert("headers"+headers);
		},
	  
	  success: function(data, textStatus) {
	  
        if (data.redirect) {
            // data.redirect contains the string URL to redirect to
            window.location.href = data.redirect;
        }
       
    }
	})
	
}

$('#reposDetail').live('pageshow', function(event) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
    loadRepoDetail(owner,name);
    checkFave();
    $("#saveBtn").bind("click", saveFave);
});

function loadRepoDetail(owner,name) {
     alert("we here 2");
    $.ajax({
	  type: "GET",
	  url: "http://dt.gsmaoneapiexchange.com/v1/discovery/apis?redirect_uri=http://54.235.178.245:8080/SamuraiApp/Redirect",
	  headers: {"Authorization":"Basic MTFiNTY3MDk4aXloZGZza2phc3lsa2pmNjg4NzZlYTU5MzJiMzo5ODczMjRiMzdkOGU0YTYwOTc4ODh0NmdoaHM3OWU3MWIyMzc1NTg="},
	}).done(function(data) {
	console.log(data);
			alert(data);
		});
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}