//= require ./../baseItemView

Teikei.module("Places", function(Places, App, Backbone, Marionette, $, _) {

  Places.DeleteEntryView = Teikei.Base.ItemView.extend({

    className: "reveal-modal",
    template: "places/deleteEntry",

    events: {
      "click .cancel": "cancel",
      "click .delete-entry": "delete"
    },

    cancel: function() {
      this.closeView();
    },

    delete: function() {
      this.model.destroy({
        success: function(){
          console.log("destroyed it!");
        },
        error: function(){
          console.log("it didn't work..");
        }
      });
      this.closeView();
    }

  });
});
