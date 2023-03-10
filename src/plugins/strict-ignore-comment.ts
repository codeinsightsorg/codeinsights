import { Plugin } from "../shared/models/plugin.model";

interface StrictIgnoreFile {
  type: "file";
  name: string;
  path: string;
  hasStrictEnabled: boolean;
}

const plugin: Plugin = {
  id: "StrictIgnoreComment",
  fileExtensions: [".ts"],
  initialAccumulator: [],
  analyze(acc, metadata) {
    const file = {
      type: "file",
      name: metadata.file.name,
      path: metadata.file.path,
    } as StrictIgnoreFile;

    metadata.helpers.visit({
      visitComment: function (path) {
        const commentValue: string = path.value.value;
        const containsTsIgnore = commentValue.includes("@ts-strict-ignore");
        file.hasStrictEnabled = !containsTsIgnore;
        if (containsTsIgnore) {
          return false;
        } else {
          this.traverse(path);
        }
      },
    });

    if (file.hasStrictEnabled) {
      return [...acc, file];
    }

    return acc;
  },
};

export default plugin;
