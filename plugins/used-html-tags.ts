import {
  HTMLAnalyzeInfo,
  HTMLPlugin,
  PluginOptions,
} from "../src/shared/models/plugin.model";

interface HTMLTag {
  labels: {
    type: "tag";
    name: string;
    fileName: string;
  };
}

interface Params {
  matchPattern?: string;
}

export default class UsedHTMLTags implements HTMLPlugin {
  parser = "HTML" as const;
  allTags: HTMLTag[] = [];

  analyzeFile(
    { document, file }: HTMLAnalyzeInfo,
    pluginOptions: PluginOptions<Params>
  ) {
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
        labels: {
          type: "tag",
          name: tagName,
          fileName: file.name,
        },
      });
    });
  }

  onFinishProcessing() {
    return this.allTags;
  }
}
