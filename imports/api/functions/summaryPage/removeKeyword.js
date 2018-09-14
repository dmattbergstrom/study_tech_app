export function removeKeyword(hashCode) {

  // Animate deletion:
  // $(".keywordContainer[data-hashCode="+hashCode+"]").addClass("scale-out");

  // Delay the actual delete 300ms (let animation run):
  window.setTimeout(function(){
    // Get the current "keywords" json object.
    var keywords = Session.get("keywords");

    // Create a new keywords object, that replaces the old one.
    var newKeywords = {"keys":[]};
    // Copy all cells, but the cell that the user wants to delete.
    var cellno = 0;
    jQuery.each(keywords["keys"], function(i, val) {
      if ( keywords["keys"][i].hashCode !== hashCode ) {
        newKeywords["keys"][cellno] = keywords["keys"][i];
        cellno++;
      }
    });

    console.log(newKeywords);
    // We have now removed one keyword.
    Session.set("numKeywords", Session.get("numKeywords")-1);
    // Save the new "keywords" json object in the session variable.
    Session.set("keywords", newKeywords);
  }, 300);
}