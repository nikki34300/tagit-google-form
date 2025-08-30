function onFormSubmit(e) {
  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // -------------------------
  // ADAPTATION SELON VOTRE FORMULAIRE
  // -------------------------
  var codeDeposant = data[2];  // Colonne "Code déposant"
  var numArticle   = data[3];  // Colonne "Numéro d'article"
  var sexe         = data[4];  // Colonne "Sexe"
  var taille       = data[5];  // Colonne "âge/taille"
  var fileUrl      = data[9];  // Colonne "photo de l'article"
  // -------------------------

  // -------------------------
  // RENOMMER LA PHOTO
  // -------------------------
  if (fileUrl) {
    try {
      //Extraire l'ID du fichier, que l'URL soit du type /d/ID/ ou ?id=ID
      var fileId = fileUrl.match(/[-\w]{25,}/)[0];
      var file = DriveApp.getFileById(fileId);
      var newName = codeDeposant + "-" + numArticle + "-" + sexe + "-" + taille + ".jpg";
      file.setName(newName);
    } catch (err) {
      Logger.log("Erreur renommage photo : " + err);
    }
  }

  // -------------------------
  // COPIER DANS ONGLET DÉPOSANT
  // -------------------------
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var targetSheet = ss.getSheetByName(codeDeposant);
  
  if (!targetSheet) {
    targetSheet = ss.insertSheet(codeDeposant);
    // Copier les en-têtes depuis la feuille principale
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    targetSheet.appendRow(headers.concat("Lien cliquable photo")); // ajouter colonne lien
  }

  // Ajouter la ligne + lien cliquable
  var rowToInsert = data.slice(); // copie de la ligne
  if (fileUrl) {
    var formula = '=HYPERLINK("' + fileUrl + '","Voir photo")';
    rowToInsert.push(formula);
  } else {
    rowToInsert.push("");
  }

  targetSheet.appendRow(rowToInsert);
}
