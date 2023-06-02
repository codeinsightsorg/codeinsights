import AngularPlugin from "../angular-plugins";
import OpensearchFinalizer from "../opensearch-plugin";
import CoralogixPlugin from "../coralogix-plugin";
import { BaseAnalyzerPlugin } from "../../models/plugins";
import { Type } from "../../models/general.model";
import ImportsPlugin from "../../../../lib/shared/plugins/imports";
import TSFilePlugin from "../../../../lib/shared/plugins/ts-file";
import UsedHTMLTags from "../used-html-tags";
import DependenciesPlugin from "../dependencies-plugin";
import ChartJSPlugin from "../chartsjs-plugin";

export const supportedPlugins: Record<string, Type<BaseAnalyzerPlugin>> = {
  angular: AngularPlugin,
  opensearch: OpensearchFinalizer,
  coralogix: CoralogixPlugin,
  charts: ChartJSPlugin,
  imports: ImportsPlugin,
  ts: TSFilePlugin,
  html: UsedHTMLTags,
  dependencies: DependenciesPlugin,
};
