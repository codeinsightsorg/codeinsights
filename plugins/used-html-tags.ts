import {
  HTMLAnalyzeInfo,
  HTMLPlugin,
  PluginOptions,
} from "../src/shared/models/plugin.model";

interface HTMLTag {
  type: "tag";
  path: string;
  labels: {
    name: string;
  };
}

interface Params {
  matchPattern?: string;
}

export default class UsedHTMLTags implements HTMLPlugin {
  parser = "HTML" as const;
  allTags: HTMLTag[] = [];

  analyzeFile(
    { document, labels }: HTMLAnalyzeInfo,
    pluginOptions: PluginOptions<Params>
  ) {
    const file = labels.file;
    const elements = document.body.querySelectorAll("*");
    elements.forEach((element) => {
      const matchPattern = pluginOptions.params?.matchPattern;
      const tagName = element.tagName.toLowerCase();
      if (matchPattern) {
        const re = new RegExp(matchPattern);
        const isMatch = re.test(tagName);
        if (!isMatch) {
          return;
        }
      }
      this.allTags.push({
        type: "tag",
        path: file.path,
        labels: {
          name: tagName,
        },
      });
    });
  }

  onFinishProcessing() {
    return this.allTags;
  }
}
