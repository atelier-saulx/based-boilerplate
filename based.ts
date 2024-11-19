/******************************************************************
 *                                                                *
 * The 'based.ts' file is the entry point of your project          *
 * in the Based Cloud.                                            *
 *                                                                *
 * This file specifies where the '@based/client' should connect.    *
 *                                                                *
 * As a TypeScript file, you can define multiple exports for        *
 * different environments, such as development, tests, or         *
 * production. Use 'process.env' to dynamically control which     *
 * environment the '@based/client' connects to.                   *
 *                                                                *
 * Alternatively, you can use a plain JavaScript file or even      *
 * a JSON file if preferred.                                       *
 *                                                                *
 ******************************************************************/

export default {
  /****************************************************************
   * The 'organization' you created in the Based Cloud Dashboard. *
   ****************************************************************/
  org: 'hello-world',
  /****************************************************************
   * The 'project' you created in this organization.              *
   ****************************************************************/
  project: 'example',
  /****************************************************************
   *                                                              *
   * The 'environment' you created in the project.                *
   *                                                              *
   * You can also use '#branch' to dynamically point the          *
   * '@based/client' to the branch you are currently working on.  *
   *                                                              *
   ****************************************************************/
  env: 'main',
}
