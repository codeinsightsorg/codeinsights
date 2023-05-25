import AngularPlugin from "../angular-plugins";
import OpensearchFinalizer from "../opensearch-plugin";
import CoralogixPlugin from "../coralogix-plugin";
import { BaseAnalyzerPlugin } from "../../models/plugins/plugin.model";
import { Type } from "../../models/general.model";

export const supportedPlugins: Record<string, Type<BaseAnalyzerPlugin>> = {
  angular: AngularPlugin,
  opensearch: OpensearchFinalizer,
  coralogix: CoralogixPlugin,
};
