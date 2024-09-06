/*-------------------------------------------------------------------

                   ⚡ Storm Software - Storm Chef

 This code was released as part of the Storm Chef project. Storm Chef
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-chef
 Documentation:   https://stormsoftware.com/projects/storm-chef/docs

 Contact:         https://stormsoftware.com/contact
 Licensing:       https://stormsoftware.com/projects/storm-chef/licensing

 -------------------------------------------------------------------*/

import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
  updateProjectConfiguration
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { join } from "node:path";
import type { CookbookGeneratorSchema } from "./schema";

export async function cookbookGenerator(
  tree: Tree,
  options: CookbookGeneratorSchema
) {
  const {
    getStopwatch,
    writeDebug,
    writeError,
    writeFatal,
    writeInfo,
    writeTrace,
    findWorkspaceRoot,
    loadStormConfig
  } = await import("@storm-software/config-tools");

  const stopwatch = getStopwatch("Storm Cookbook generator");

  let config: StormConfig | undefined;
  try {
    writeInfo("⚡ Running the Storm Cookbook generator...\n\n", config);

    const workspaceRoot = findWorkspaceRoot();

    writeDebug(
      `Loading the Storm Config from environment variables and storm.json file...
- workspaceRoot: ${workspaceRoot}`,
      config
    );

    config = await loadStormConfig(workspaceRoot);
    writeTrace(
      `Loaded Storm config into env: \n${Object.keys(process.env)
        .map(key => ` - ${key}=${JSON.stringify(process.env[key])}`)
        .join("\n")}`,
      config
    );

    const tasks: GeneratorCallback[] = [];

    addCookbookFiles(tree, options);
    addTargets(tree, options);

    await formatFiles(tree);

    return runTasksInSerial(...tasks);
  } catch (error) {
    return () => {
      writeFatal(
        "A fatal error occurred while running the generator - the process was forced to terminate",
        config
      );
      writeError(
        `An exception was thrown in the generator's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`,
        config
      );
    };
  } finally {
    stopwatch();
  }
}

function addCookbookFiles(tree: Tree, options: CookbookGeneratorSchema) {
  generateFiles(
    tree,
    join(__dirname, "./files"),
    options.directory || "./cookbooks",
    {
      ...options,
      tmpl: "",
      name: options.name
    }
  );
}

// Adds the targets to the project configuration
function addTargets(tree: Tree, options: CookbookGeneratorSchema) {
  try {
    const projectConfiguration = readProjectConfiguration(tree, options.name);

    projectConfiguration.targets = {
      ...projectConfiguration.targets,
      "nx-release-publish": {
        executor: "@storm-software/cloudflare-tools:r2-upload-publish"
      }
    };

    if (projectConfiguration.targets.build) {
      delete projectConfiguration.targets.build;
    }

    updateProjectConfiguration(tree, options.name, projectConfiguration);
  } catch (error_) {
    // eslint-disable-next-line no-console
    console.error(error_);
  }
}

export default cookbookGenerator;
export const applicationSchematic = convertNxGenerator(cookbookGenerator);
