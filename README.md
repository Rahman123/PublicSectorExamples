# PublicSectorExamples
Public Sector - Digital Process Automation Examples

## What's inside?
* Example Process - Generate new Inspection Processes using CSV import

## What it does...
* It provides a useful tool for creating new inspection types using a formated CSV file. 

## ****Permission Sets Required****
**Please make sure that your user has the ActionPlans and ActionPlans3 Permission Sets before attempting this process**

## How the Process Works

There are 2 use cases for this functionality:  Importing a new Inspection Type from a formatted CSV file and Exporting/Importing existing Inspection Types between Orgs

### Importing a new Inspection Type from a CSV File

The CSV file is structured to create just the Assessment Tasks within the Action Plan Template.  The process also allows for Signature Tasks to be added but these aren’t included in the CSV file.  

Columns to be populated in the CSV:

* Blank - Leave Blank
* TaskDefinition - The Task Definition is the Grouping of Questions to be asked during an Inspection.  It is made up of one of more questions/Assessment Indicators.  
    * Here are some example Task Definitions [ExampleTaskDefinitions.png](https://salesforce.quip.com/-/blob/HXYAAAQE9Rc/SYWEL5Rro7E6XGWXGPgVuQ?name=ExampleTaskDefinitions.png&s=Gaj8ASPe2Ycb)
* AssessmentIndicatorName - Assessment Indicators are the Questions asked during an Inspection.  These are grouped under a Task Definition.  **Please check for any trailing spaces on this value.  Trailing spaces cause issues with the creation of the Inspection Template.  If you happen to try to load information with trailing spaces then see the section below titled Potential Errors on CSV import and how to recover from the Errors**
* AssessmentIndicatorType - This is the data type of the Assessment Indicator.  The only supported values in the CSV Import are Boolean, Picklist, and Text.  Summer 2021 release will add DateTime, Number, and Percentage.  **DO NOT LEAVE THIS FIELD BLANK, doing so will default to Number and it will not work correctly as Numbers are not supported.   **
* RegulatoryCodeName - This is the Regulatory Code associated with the Assessment Indicator.  This can be used when performing an Inspection to tie violations to a specific regulatory code.  **These are required for the CSV upload to work**.  If you do not need to show a Regulatory Code in your demo you must still enter a value here.  You can use something like XX if you need a value.
* RegulatoryCodeSubject - The is the subject of the Regulatory Code.  **This is required.**
* RegulatoryCodeAuthority - This is the Regulatory Authority of the Regulatory Code.  **This is required.**
* AssessmentIndicatorDefinedValues - If the AssessmentIndicatorType value is set to Picklist, this field defines the values available in the Picklist.  Values should be separated by a | character.  For example the values Red, Yellow and Blue should show as: Red|Yellow|Blue
    * Note that this change will likely not be in the Public Sector Solutions IDO until October 1, 2021

Here is a Sample populated CSV file.[NYCParksInspection.csv](https://salesforce.quip.com/-/blob/HXYAAAQE9Rc/S_5c1uJU4NncdeRDjT3G0w?name=NYCParksInspection.csv&s=Gaj8ASPe2Ycb)


A video example of the process follows the listed instructions.

1. Make a copy of the Google Sheets InspectionTypeUploadTemplate found [here](https://docs.google.com/spreadsheets/d/1_cO2JnLQRNiA1_-h9SyxP4IzcR9b7bVh48yJ4SnT7vE/edit?usp=sharing)
2. Fill in the details of the Inspection Type to create
3. Click In Google Docs click File→Download→Comma Separated File
4. In the Salesforce Org you want to import the CSV, go to the App Launcher and type “Inspection Type Utilities” **or** “Inspection Builder” **or** “Quick Build - Inspection“.  For “Inspection Builder”, skip to step 6.
5. Click the Create Inspection Type from CSV button
6. This will launch an Omniscript to manage the import process
    1. On the first Step enter/select the following values in the *Inspection Details Section*:
        1. Name:  Name of the Inspection Type to be imported.  The word “Inspection” should be included in the name
        2. Description:  Description of the Inspection Type and Action Plan Template.  (This is not required)
        3. Capture Signatures:  If you plan to capture Signatures as part of the Inspection Type, click this box.  A later step will ask for details
    2. Click the Next button
    3. On the Second Step of the Omniscript, click the Upload Files button in the *Inspection Tasks Section*, select the CSV you downloaded, 
    4. Click the Done button on the popup window when the file upload is completed.
    5. Click the Upload CSV button when it displays in the Omniscript.  This will populate the details to be created in the Inspection Type.  Review your uploaded file and make any changes that may have been missed in the creation of the CSV file (e.g., forgot to populate a field, or had the wrong “type”.  DO NOT SKIP THIS STEP!
    6. Click the Next button
    7. If Capture Signatures was checked, the *Signature Tasks Section* will be displayed to capture signature information.  Enter the following values for Signatures:
        1. Name - Identifier for whose signature you want to capture.  Typically this is something like Inspector or Citizen
        2. Signature Required - Clicking this will require that this signature is captured before the Inspection can be closed
        3. Order - Order in which the signature shows up
        4. Additional Signatures can be added by clicking the Add Button
    8.  Click the Next button
    9. The Omniscript will automatically navigate you to the new Inspection Type


Video of Creating Inspection Type from CSV
[Image: CreateInspectionTypeFromCSV.mp4]
### **Potential Errors on CSV import and how to recover from the Errors**

1. **Issue with Trailing Spaces**

There is a known issue with attempting to import an Assessment Indicator that has a trailing or extra spaces after the AssessmentIndicatorName in the CSV file. If an Assessment Indicator has extra spaces at the end it will cause issues with the import and error messages will be displayed.  If you attempt the process above and receive errors such as the following, it’s most likely an issue with trailing spaces in an AssessmentIndicatorName:
[Image: Screen Shot 2021-04-07 at 12.46.22 PM.png]**Steps to recover**

1. Go through the CSV file and identify the Assessment Indicator or Assessment Indicators that have trailing spaces.  
2. Remove/Delete all trailing spaces 
3. Save the CSV
4. In Salesforce, go to the App Launcher and find Assessment Indicator Definitions
5. Look/search for all Assessment Indicator Definitions that have the same name as the Assessment Indicator with trailing spaces
6. Delete these Assessment Indicator Definitions
7. Reimport the CSV.  **MAKE SURE TO USE A DIFFERENT NAME FOR THE INSPECTION TYPE**

Video of handling Trailing Space Error:
[Image: HandlingCSVInspectionErrors.mp4]
1. Issue with not having correct Permission Sets

If you receive the following error message it indicates that you need to add the ActionPlan and ActionPlan3 Permission sets to your security settings
[Image: Screen Shot 2021-04-08 at 8.03.27 AM.png]Steps to Recover:

1. Go to Setup→Users
2. Click on your username
3. Click Permission Set Assignments and then Add Assignments
4. Add in ActionPlans and ActionPlans3
5. Click Save
6. Go back to the Inspection Quick Build tools and refresh the page and try the import again



### Export/Import Inspection Types from One Org to Another

This use case allows you to export an already established Inspection type from one Org to another.  This can also be used to create a library of Inspection Types that can easily be moved across Orgs.  The export process exports the Inspection Type and all associated components as a JSON file.  The import process reads the JSON file and inserts the Inspection Type and corresponding details into the new Org.  

**Note:  If you try to import an Inspection Type to an Org that already has an Inspection Type with the same name, the process will not work and you will get an error**

A video of the steps follows the instructions below

**Export Process**

1. In the Salesforce Org you want to export the Inspection Type, go to the App Launcher and type Inspection Type Utilities
2. Click the Export Inspection Type button
3. This will launch an Omniscript to export the Inspection Type as a JSON file
4. In the Inspection Type field, select the Inspection Type you would like to export 
5. Click Next
6. A link with the generated JSON file will be displayed.
7. Click the link to automatically download the JSON file

**Import Process**

1. In the Salesforce Org you want to import the Inspection Type, go to the App Launcher and type Inspection Type Utilities
    1. **As noted above.  If you try to import an Inspection Type with the same name as an Inspection Type that already exists in the Org the process will not work and you will get errors**
2. Click the Import Inspection Type button
3. This will launch an Omniscript to import the Inspection Type
4. Click the Upload File button and select the JSON file to import
5. Click the Done button on the popup window
6. Click the Next button
7. The Inspection Type will be imported into the new Org and you will be automatically navigated to the Inspection Type


Video of Import/Export Across Orgs
[Image: ImportExportInspectionTypeAcrossOrgs.mp4]
## Potential Enhancements

* Currently Assessment Tasks do not support setting the Display Order or Required field
    * The Display Order is used to order the Assessment tasks during and Inspection and the Required field is used to make sure the Assessment Task is complete before completing the Visit
    * These are not likely required for a demo
    * There are some interesting relationships to make this work and it would take some time to figure this out
    * Would probably take 2-3 hours of work to figure out the relationship and make work
* There is currently no complete error checking/exception handling.  
    * Some error checking/handling has been added, but since this is a utility function there is some expectation that users are familiar with what to do and what not to do
    * If you try to create or import an existing Inspection template or Action Plan template you will get ugly errors
    * If you enter the same question you will likely see errors
    * It would take quite a bit of time to catch every error, but some additional error handling can be added as needed



## Objects to Migrate 

Note that this has already been performed in the 2 test Orgs.  This is more to document what needs to be added to the IDO.

### Omniscript/DataRaptors

* QuickBuild/InspectionCSVLoader
* QuickBuild/InspectionTempateExport
* QuickBuild/InspectionTemplateImport

### Fix Issue with Cards on New Spins

* For App Launcher, Go to Vlocity Cards (Not Flexcards)
* Click the Warnings button
* When the popup comes up, click the Fix button

### FlexCard

* QuickBuildInspectionTemplateUtilities (Because it calls the Omniscripts it has everything in one DataPack)
    * [QuickBuildInspectionTemplateUtilities (1).json](https://salesforce.quip.com/-/blob/HXYAAAQE9Rc/8x8RodosnVKO3_-YLBJjQQ?name=QuickBuildInspectionTemplateUtilities%20(1).json&s=Gaj8ASPe2Ycb)
    * **AFTER IMPORTING MAKE SURE TO GO TO LWC OMNISCRIPT DESIGNER AND DEACTIVATE/ACTIVATE THE THREE OMNISCRIPTS ABOVE**

### Apex Classes

* InspectionTemplateUtils - [InspectionTemplateUtils (3).cls](https://salesforce.quip.com/-/blob/HXYAAAQE9Rc/pKGQcAuBlySgj6MTt6rHlA?name=InspectionTemplateUtils%20(3).cls&s=Gaj8ASPe2Ycb)
* CSVUtils - [CSVUtils (1).cls](https://salesforce.quip.com/-/blob/HXYAAAQE9Rc/9gpTWxcOGJuhBHkp148bUg?name=CSVUtils%20(1).cls&s=Gaj8ASPe2Ycb) 

### Custom Function

See https://success.vlocity.com/s/article/Guide-for-writing-your-own-custom-function-and-seeing-it-in-use for more details about Adding Custom Functions

* GETREGCODEASSESSMENTIND
    * Label:  GETREGCODEASSESSMENTIND
    * Name:  GETREGCODEASSESSMENTIND
    * ClassName: InspectionTemplateUtils
    * Method Name: getRegCodeAssessmentInd
* GETASSESSMENTTASKINDDEFINITION
    * Label: GETASSESSMENTTASKINDDEFINITION
    * Name: GETASSESSMENTTASKINDDEFINITION
    * ClassName: InspectionTemplateUtils
    * Method Name: getAssessmentTaskIndDefinition
* GETASSESSMENTINDICATORDEFINEDVALUES
    * Label: GETASSESSMENTINDICATORDEFINEDVALUES
    * Name: GETASSESSMENTINDICATORDEFINEDVALUES
    * ClassName: InspectionTemplateUtils
    * Method Name: getAssessmentIndicatorDefinedValues

### Create a Lightning Page for the QuickBuildInspectionTemplateUtilities Flexcard.  

## 

## Demo Accounts/Orgs for Testing

admin@lpi-inspectiontest-1.demo/Salesforce1
admin@lpi-inspectiontest-2.demo/Salesforce1

The 2 orgs allow for Importing/Exporting between Orgs
