function main() {
  var file = DocumentApp.create('TestFile');
  createDirectoryWithName("Pandu_Proj_1", file);
}

/**
* Extract the required details from the google Doc, process and populate data into a Google form 
* with a predefined template
*
* @Param docId - Id of the Document to use for data extraction
*/
function extractDetailsFromSheetAndPolpulateToGoogleForm(docId, formId) {

  // Const Key-words to extract details from Document body
  const FULL_STOP = '.';
  const SINGLE_SPACE = ' ';
  const NEW_LINE = '\n';
  const COLON = ':';
  const ADDRESS_OF_MAIL = 'Dear ';
  const OWNER_KEYWORD = 'Your ';
  const METHOD_OF_INTERACTION_KEYWORD = 'speaking with you ';
  const PERSONAL_HEALTH_HISTORY_KEYWORD = COLON + NEW_LINE + 'You reported a personal history of ';
  const REPORTED_FAMILY_HISTORY_KEYWORD = COLON + NEW_LINE + 'You reported a family history of ';
  const REPORTED_NEGATIVE_FAM_HISTORY_KEYWORD = 'no known family history of ';
  const PATERNAL_ANCESTRY_KEYWORD = 'Paternal Ancestry: ';
  const MATERNAL_ANCESTRY_KEYWORD = 'Maternal Ancestry: ';
  const GENETIC_RISK_ASSESMENT_KEYWORD = 'Genetic Risk Assessment:';
  const PLAN_KEYWORD = 'Plan: ';
  const SUMMARY_KEYWORD = 'Summary: '
  const CANCER_PREDISPOSITION_KEYWORD = 'predisposition is (are): ';
  const DISEASE_HISTORY_OF_KEYWORD = ' history of ';
  const MUTATED_GENE_KEYWORD = 'could be caused by a mutation in the ';
  const SUSCEPTIBILITY_GENES_KEYWORD = 'susceptibility genes such as ';
  const NCCN_CRITERIA_KEYWORD = 'NCCN criteria for ';
  const GENETIC_TESTING_KEYWORD = ' genetic testing.';
  const SAMPLE_TESTING_LAB_KEYWORD = 'sample was sent to ';
  const NEXT_APPOINTMENT_DATE_KEYWORD = 'meet again on ';

  var docId = '1JbZgVPDC5dUctnWQ7A-IKhuBmtO5GvpZeNSpaZXnPng';
  var formId = '1KqJOODupRfDyW7dtPM28KwA0DlUpRjfJyav5tO159A0';
  var doc = DocumentApp.openById(docId);

  // Extract the values from the Google Doc body to add into the new Google form
  var body = doc.getBody();

  // Extract general information
  var text = body.getText();
  var title = text.split(ADDRESS_OF_MAIL)[1].split(FULL_STOP)[0];
  Logger.log(title);
  var name = text.split(title)[1].split(FULL_STOP + SINGLE_SPACE)[1].split(",")[0];
  Logger.log(name);
  var modeOfInteraction = text.split(METHOD_OF_INTERACTION_KEYWORD)[1].split(FULL_STOP)[0];
  Logger.log(modeOfInteraction);

  // Extract Medical History Information
  var personalHealthHistory = text.split(PERSONAL_HEALTH_HISTORY_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(personalHealthHistory);
  var reportedFamHistory = text.split(REPORTED_FAMILY_HISTORY_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(reportedFamHistory);
  var reportedFamHistoryOfNoCases = text.split(REPORTED_NEGATIVE_FAM_HISTORY_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(reportedFamHistoryOfNoCases);
  var paternalAncestry = text.split(PATERNAL_ANCESTRY_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(paternalAncestry);
  var maternalAncestry = text.split(MATERNAL_ANCESTRY_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(maternalAncestry);

  // Extract Genetic Risk Assesment details
  var geneticRiskAssesment = text.split(GENETIC_RISK_ASSESMENT_KEYWORD)[1].split(PLAN_KEYWORD)[0];
  var cancerPredisposition = geneticRiskAssesment.split(CANCER_PREDISPOSITION_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(cancerPredisposition);
  var disease = geneticRiskAssesment.split(cancerPredisposition)[1].split(OWNER_KEYWORD)[1].split(DISEASE_HISTORY_OF_KEYWORD)[0];
  Logger.log(disease);
  var diseaseHistory = geneticRiskAssesment.split(DISEASE_HISTORY_OF_KEYWORD)[1].split(MUTATED_GENE_KEYWORD)[0];
  Logger.log(diseaseHistory);
  var geneMutation = geneticRiskAssesment.split(MUTATED_GENE_KEYWORD)[1].split(SINGLE_SPACE)[0];
  Logger.log(geneMutation);
  var susceptibilityGenes = geneticRiskAssesment.split(SUSCEPTIBILITY_GENES_KEYWORD)[1].split(SINGLE_SPACE)[0];
  Logger.log(susceptibilityGenes);
  var nccnCriteria = geneticRiskAssesment.split(NCCN_CRITERIA_KEYWORD)[1].split(GENETIC_TESTING_KEYWORD)[0];
  Logger.log(nccnCriteria);
  var geneticTesting = geneticRiskAssesment.split(GENETIC_TESTING_KEYWORD)[1].split(NEW_LINE)[1].split(SINGLE_SPACE)[0];
  Logger.log(geneticTesting);

  // Extract Plan and Summary details
  var plan = text.split(PLAN_KEYWORD)[1].split(SUMMARY_KEYWORD)[0];
  var sampleTestingLab = plan.split(SAMPLE_TESTING_LAB_KEYWORD)[1].split(NEW_LINE)[0];
  Logger.log(sampleTestingLab);
  var nextAppointment = plan.split(NEXT_APPOINTMENT_DATE_KEYWORD)[1].split(SINGLE_SPACE)[0];
  Logger.log(nextAppointment);

  // Get Form template to be filled
  var originalForm = FormApp.openById(formId);
  // Submit values to form
  var questions = originalForm.getItems();
  var FormResponse = originalForm.createResponse();

  var response = [title, name, modeOfInteraction, personalHealthHistory, reportedFamHistory, reportedFamHistoryOfNoCases, 
  paternalAncestry, maternalAncestry, cancerPredisposition, disease, diseaseHistory, geneMutation, susceptibilityGenes, nccnCriteria, geneticTesting, sampleTestingLab, nextAppointment];

  for (var i = 0; i < questions.length; i++) {
    Logger.log(questions[i].getTitle());
    var item = questions[i].asTextItem();
    var itemResponse = item.createResponse(response[i]);
    FormResponse.withItemResponse( itemResponse ).submit();
    
  }
  FormResponse.submit();

}

/**
* Create Google Drive Folder with the given Name
*
* @Param dirName - Name of the directory to be created
* @Param file - Document to add the created directory
*/
function createDirectoryWithName(dirName, file) {

  var rootDir = DriveApp.getRootFolder();
  var newFile = DriveApp.createFile(file);
  var fileName = newFile.getName();

  // Check whether the Drive has directory with the given name
  var allDirectories = rootDir.getFolders();
  var currentDir = allDirectories.next();

  // Check for the file there with the name
  if (currentDir.getName() == dirName) {
    Logger.log('Found a directory with the ' + dirName + ' name.');
    var filesInDir = currentDir.getFiles();

    // Check for files with same name in the directory
    while (filesInDir.hasNext()) {
      var currentFile = filesInDir.next();
      if (currentFile.getName() == fileName) {
        Logger.log('Found a file with the ' + fileName + ' name.');
        // Remove the existing file with the same name
        DriveApp.removeFile(currentFile);
      }
    }

    // Add new file with content to directory
    currentDir.addFile(newFile);
    Logger.log('Created a new file with ' + fileName + ' name.');
  } else {
    // Create a new Dir in Drive
    var newDirectory = DriveApp.createFolder(dirName);
    Logger.log('Created a new Directory with ' + dirName + ' name.');

    // Add new file with content to directory
    newDirectory.createFile(newFile);
    Logger.log('Created a new file with ' + fileName + ' name.');
  }
}