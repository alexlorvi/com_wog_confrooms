/**
 * Defines the Zimlet handler class.
 *
 */
function com_wog_confrooms_HandlerObject() {
}

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
com_wog_confrooms_HandlerObject.prototype = new ZmZimletBase();
com_wog_confrooms_HandlerObject.prototype.constructor = com_wog_confrooms_HandlerObject;

/**
* This method gets called by the Zimlet framework when the zimlet loads.
*
*/
com_wog_confrooms_HandlerObject.prototype.init =
function() {
  this._simpleAppName = this.createApp("Календар переговорок", "WOG_Conf-panelIcon", "Загальний перегляд стану переговорок");
};

/**
 * This method gets called by the Zimlet framework each time the application is opened or closed.
 *
 * @param	{String}	appName		the application name
 * @param	{Boolean}	active		if true, the application status is open; otherwise, false
 */
com_wog_confrooms_HandlerObject.prototype.appActive =
function(appName, active) {
  switch (appName) {
    case this._simpleAppName: {
      var app = appCtxt.getApp(appName); // get access to ZmZimletApp
      break;
    }
  }
  // do something
};

/**
 * This method gets called by the Zimlet framework when the application is opened for the first time.
 *
 * @param	{String}	appName		the application name
 */
com_wog_confrooms_HandlerObject.prototype.appLaunch =
function(appName) {
  switch (appName) {
    case this._simpleAppName: {
      // do something
      var app = appCtxt.getApp(appName); // get access to ZmZimletApp
//      var content = this._createTabView();
//      app.setContent(content); // write HTML to app
//        app.setContent("<div id='calendar'></div>");
        app.setContent("<iframe id='tabiframe-app' name='tabiframe-app' src='" + this.getResource("fullcalendar.jsp") + "' width='100%' height='100%' /></iframe>");
//        app.setContent(this.getResource("jspfile.jsp"));
        break;
    }
  }
};

/**
 * Creates the tab view using the template.
 *
 * @return	{String}	the tab HTML content
 */
//com_wog_confrooms_HandlerObject.prototype._createTabView =
//function() {
//  return AjxTemplate.expand("com_wog_confrooms.templates.Tab#Main");
//};
