import {
  JSONAnalyzeInfo,
  JSONPlugin,
} from "../models/plugins/json-plugin.model";

interface Dependency {
  type: "dependancy";
  path: string;
  labels: {
    name: string;
    version: string;
    dependencyType: "devDependencies" | "dependencies";
  };
}

export class DependenciesPlugin implements JSONPlugin {
  analyzedItems: Dependency[] = [];
  parser = "JSON" as const;

  analyzeFile({ labels, object }: JSONAnalyzeInfo) {
    if (labels.fileName !== "package.json") return;

    const dependencies = object.dependencies;
    const devDependencies = object.devDependencies;

    const convertDependenciesMap = (
      dependenciesMap: Record<string, any>,
      dependencyType: Dependency["labels"]["dependencyType"]
    ) => {
      Object.entries(dependenciesMap).forEach(([name, version]) => {
        this.analyzedItems.push({
          type: "dependancy",
          path: labels.filePath,
          labels: {
            name,
            version: version as string,
            dependencyType,
          },
        });
      });
    };

    convertDependenciesMap(dependencies, "dependencies");
    convertDependenciesMap(devDependencies, "devDependencies");
  }

  onFinishProcessing() {
    return this.analyzedItems;
  }
}

export default DependenciesPlugin;
