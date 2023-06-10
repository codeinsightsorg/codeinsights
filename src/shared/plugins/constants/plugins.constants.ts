import AngularPlugin from "../angular-plugins";
import OpensearchFinalizer from "../opensearch-plugin";
import CoralogixPlugin from "../coralogix-plugin";
import { BaseAnalyzerPluginModel } from "../../models/plugins";
import { Type } from "../../models/general.model";
import UsedHTMLTags from "../used-html-tags";
import DependenciesPlugin from "../dependencies-plugin";
import ChartJSPlugin from "../chartsjs-plugin";
import ImportsPlugin from "../imports";
import TSFilePlugin from "../ts-file";

export const supportedPlugins: Record<string, Type<BaseAnalyzerPluginModel>> = {
  angular: AngularPlugin,
  opensearch: OpensearchFinalizer,
  coralogix: CoralogixPlugin,
  charts: ChartJSPlugin,
  imports: ImportsPlugin,
  ts: TSFilePlugin,
  html: UsedHTMLTags,
  dependencies: DependenciesPlugin,
};
