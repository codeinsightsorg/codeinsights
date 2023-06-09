import AngularPlugin from "../angular-plugins";
import OpensearchFinalizer from "../opensearch-plugin";
import CoralogixPlugin from "../coralogix-plugin";
import { BaseAnalyzerPlugin } from "../../models/plugins";
import { Type } from "../../models/general.model";
import UsedHTMLTags from "../used-html-tags";
import DependenciesPlugin from "../dependencies-plugin";
import ChartJSPlugin from "../chartsjs-plugin";
import ImportsPlugin from "../imports";
import TSFilePlugin from "../ts-file";
import VuePlugin from "../vue-plugin";

export const supportedPlugins: Record<string, Type<BaseAnalyzerPlugin>> = {
  angular: AngularPlugin,
  opensearch: OpensearchFinalizer,
  coralogix: CoralogixPlugin,
  vue3: VuePlugin,
  charts: ChartJSPlugin,
  imports: ImportsPlugin,
  ts: TSFilePlugin,
  html: UsedHTMLTags,
  dependencies: DependenciesPlugin,
};
