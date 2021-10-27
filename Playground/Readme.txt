You can deploy LWCs from Salesforce DX using the following instructions. 

When you deploy source code to an org, the entire path that you specify is deployed.

Run this command from the command line:
sfdx force:source:deploy -p <pathToDeploy> -u <orgUserName>

This example deploys the root directory of a Salesforce DX project to an org with the username example@force.com:

sfdx force:source:deploy -p force-app -u example@force.com
Retrieve Source from an Org

Run this command from the command line:

sfdx force:source:retrieve -p <pathToRetrieve> -u <orgUserName>
Lather, Rinse, Repeat

To see changes in Salesforce, deploy source code to your org and hard refresh the browser.