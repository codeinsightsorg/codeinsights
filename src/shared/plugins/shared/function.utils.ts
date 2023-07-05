import { NodePath } from "ast-types/lib/node-path";
import { namedTypes } from "ast-types/gen/namedTypes";

export function getFunctionDetailsFromNode(
  path: NodePath<namedTypes.Function>
) {
  const nodeDetails = nodeToDetails(path);
  if (!nodeDetails)
    return {
      labels: {},
      metrics: {},
    };
  return {
    metrics: {
      loc: nodeDetails.loc.end.line - nodeDetails.loc.start.line,
    },
    labels: {
      name: nodeDetails.name || "anonymous",
      line: nodeDetails.loc.start.line,
    },
  };
}

function nodeToDetails(path: NodePath<namedTypes.Function>) {
  if (path.value.type === "ClassMethod" || path.value.type === "ObjectMethod") {
    return {
      loc: path.value.loc,
      name: path.value.key.name,
    };
  }
  if (
    path.value.type === "FunctionDeclaration" ||
    path.value.type === "FunctionExpression"
  ) {
    return {
      loc: path.value.body.loc,
      name: path?.value?.id?.name ?? "",
    };
  }
  if (path.value.type === "ArrowFunctionExpression") {
    return {
      name: path?.value?.id?.name ?? "",
      loc: path.value.body.loc,
    };
  }
}
