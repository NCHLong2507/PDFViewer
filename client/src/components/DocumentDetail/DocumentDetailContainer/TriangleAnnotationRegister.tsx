import type { Core, WebViewerInstance } from "@pdftron/webviewer";

export default function TriangleAnnotationRegister(
  instanceRef: React.RefObject<WebViewerInstance>,
  opacity: number,
  stroke: number,
  selectedColor: string,
  strokeColor: string,
  getColorFromName: (colorName: string) => {
    r: number;
    g: number;
    b: number;
    a: number;
  }
) {
  const { UI, Core } = instanceRef.current;
  const { Annotations, annotationManager, Tools, documentViewer } = Core;
  class TriangleAnnotation extends Annotations.CustomAnnotation {
    constructor() {
      super("triangle");
      this.Subject = "Triangle";
      const fillcolor = getColorFromName(selectedColor);
      this.FillColor = new Annotations.Color(
        fillcolor.r,
        fillcolor.g,
        fillcolor.b,
        fillcolor.a
      );
      this.StrokeThickness = stroke || 1;
      this.Opacity = opacity / 100;
      const strokecolor = getColorFromName(strokeColor);
      this.StrokeColor = new Annotations.Color(
        strokecolor.r,
        strokecolor.g,
        strokecolor.b,
        strokecolor.a
      );
    }
    draw(ctx: CanvasRenderingContext2D, pageMatrix: number[]) {
      this.setStyles(ctx, pageMatrix);
      ctx.translate(this.X, this.Y);
      ctx.globalAlpha = this.Opacity;
      ctx.beginPath();
      ctx.moveTo(this.Width / 2, 0);
      ctx.lineTo(this.Width, this.Height);
      ctx.lineTo(0, this.Height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
  TriangleAnnotation.prototype.elementName = "triangle";
  annotationManager.registerAnnotationType(
    TriangleAnnotation.prototype.elementName,
    TriangleAnnotation
  );
  class TriangleCreateTool extends Tools.GenericAnnotationCreateTool {
    constructor(documentViewer: Core.DocumentViewer) {
      super(documentViewer, TriangleAnnotation as any);
    }
  }
  const triangleToolName = "AnnotationCreateTriangle";
  const triangleTool = new TriangleCreateTool(documentViewer);
  UI.registerTool(
    {
      toolName: triangleToolName,
      toolObject: triangleTool,
      buttonImage:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>' +
        '<path fill="none" d="M0 0h24v24H0V0z"/>' +
        "</svg>",
      buttonName: "triangleToolButton",
      tooltip: "Triangle",
    },
    function () {
      return new TriangleAnnotation();
    }
  );

  UI.setHeaderItems((header: { getHeader: (arg0: string) => any }) => {
    const shapesHeader = header.getHeader("toolbarGroup-Shapes");
    shapesHeader.get("freeHandToolGroupButton").insertBefore({
      type: "toolButton",
      toolName: triangleToolName,
    });
    UI.setToolMode(triangleToolName);
  });
}
