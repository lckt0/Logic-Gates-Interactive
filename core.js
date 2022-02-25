var red = "orangered";
var green = "forestgreen";

function init() {
    const $ = go.GraphObject.make;

    myDiagram =
        $(go.Diagram, "myDiagramDiv", {
            "draggingTool.isGridSnapEnabled": true,
            "undoManager.isEnabled": true
        });

    myDiagram.addDiagramListener("Modified", e => {
        var button = document.getElementById("saveModel");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    var palette = new go.Palette("palette");

    myDiagram.linkTemplate =
        $(go.Link, {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 3,
                relinkableFrom: true,
                relinkableTo: true,
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                shadowBlur: 5,
                shadowColor: "blue",
            },
            new go.Binding("isShadowed", "isSelected").ofObject(),
            $(go.Shape, { name: "SHAPE", strokeWidth: 2, stroke: red }));

    var sharedToolTip =
        $("ToolTip", { "Border.figure": "RoundedRectangle" },
            $(go.TextBlock, { margin: 2 },
                new go.Binding("text", "", d => d.category)));

    function nodeStyle() {
        return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("isShadowed", "isSelected").ofObject(),
            {
                selectionAdorned: false,
                shadowOffset: new go.Point(0, 0),
                shadowBlur: 15,
                shadowColor: "blue",
                toolTip: sharedToolTip
            }
        ];
    }

    function shapeStyle() {
        return {
            name: "NODESHAPE",
            fill: "lightgray",
            stroke: "darkslategray",
            desiredSize: new go.Size(40, 40),
            strokeWidth: 2
        };
    }

    function portStyle(input) {
        return {
            desiredSize: new go.Size(6, 6),
            fill: "#e5e7eb",
            fromSpot: go.Spot.Right,
            fromLinkable: !input,
            toSpot: go.Spot.Left,
            toLinkable: input,
            toMaxLinks: 1,
            cursor: "pointer"
        };
    }

    var inputTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "Circle", shapeStyle(), { fill: red }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "", alignment: new go.Spot(1, 0.5) }), {
                doubleClick: (e, obj) => {
                    e.diagram.startTransaction("Toggle Input");
                    var shp = obj.findObject("NODESHAPE");
                    shp.fill = (shp.fill === green) ? red : green;
                    updateStates();
                    e.diagram.commitTransaction("Toggle Input");
                }
            }
        );

    var outputTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "Rectangle", shapeStyle(), { fill: green }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "", alignment: new go.Spot(0, 0.5) })
        );

    var andTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "AndGate", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in1", alignment: new go.Spot(0, 0.3) }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in2", alignment: new go.Spot(0, 0.7) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    var orTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "OrGate", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    var xorTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "XorGate", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    var norTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "NorGate", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in1", alignment: new go.Spot(0.16, 0.3) }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in2", alignment: new go.Spot(0.16, 0.7) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    var xnorTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "XnorGate", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in1", alignment: new go.Spot(0.26, 0.3) }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in2", alignment: new go.Spot(0.26, 0.7) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    var nandTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "NandGate", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in1", alignment: new go.Spot(0, 0.3) }),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in2", alignment: new go.Spot(0, 0.7) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    var notTemplate =
        $(go.Node, "Spot", nodeStyle(),
            $(go.Shape, "Inverter", shapeStyle()),
            $(go.Shape, "Rectangle", portStyle(true), { portId: "in", alignment: new go.Spot(0, 0.5) }),
            $(go.Shape, "Rectangle", portStyle(false), { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

    myDiagram.nodeTemplateMap.add("input", inputTemplate);
    myDiagram.nodeTemplateMap.add("output", outputTemplate);
    myDiagram.nodeTemplateMap.add("and", andTemplate);
    myDiagram.nodeTemplateMap.add("or", orTemplate);
    myDiagram.nodeTemplateMap.add("xor", xorTemplate);
    myDiagram.nodeTemplateMap.add("not", notTemplate);
    myDiagram.nodeTemplateMap.add("nand", nandTemplate);
    myDiagram.nodeTemplateMap.add("nor", norTemplate);
    myDiagram.nodeTemplateMap.add("xnor", xnorTemplate);

    palette.nodeTemplateMap = myDiagram.nodeTemplateMap;

    palette.model.nodeDataArray = [
        { category: "input" },
        { category: "output" },
        { category: "and" },
        { category: "or" },
        { category: "xor" },
        { category: "not" },
        { category: "nand" },
        { category: "nor" },
        { category: "xnor" }
    ];

    load();
    loop();
}

function loop() {
    setTimeout(() => { updateStates();
        loop(); }, 250);
}

function updateStates() {
    var oldskip = myDiagram.skipsUndoManager;
    myDiagram.skipsUndoManager = true;

    myDiagram.nodes.each(node => {
        if (node.category === "input") {
            doInput(node);
        }
    });

    myDiagram.nodes.each(node => {
        switch (node.category) {
            case "and":
                doAnd(node);
                break;
            case "or":
                doOr(node);
                break;
            case "xor":
                doXor(node);
                break;
            case "not":
                doNot(node);
                break;
            case "nand":
                doNand(node);
                break;
            case "nor":
                doNor(node);
                break;
            case "xnor":
                doXnor(node);
                break;
            case "output":
                doOutput(node);
                break;
            case "input":
                break; // doInput already called, above
        }
    });
    myDiagram.skipsUndoManager = oldskip;
}

function linkIsTrue(link) {
    return link.findObject("SHAPE").stroke === green;
}

function setOutputLinks(node, color) {
    node.findLinksOutOf().each(link => link.findObject("SHAPE").stroke = color);
}

function doInput(node) {
    setOutputLinks(node, node.findObject("NODESHAPE").fill);
}

function doAnd(node) {
    var color = node.findLinksInto().all(linkIsTrue) ? green : red;
    setOutputLinks(node, color);
}

function doNand(node) {
    var color = !node.findLinksInto().all(linkIsTrue) ? green : red;
    setOutputLinks(node, color);
}

function doNot(node) {
    var color = !node.findLinksInto().all(linkIsTrue) ? green : red;
    setOutputLinks(node, color);
}

function doOr(node) {
    var color = node.findLinksInto().any(linkIsTrue) ? green : red;
    setOutputLinks(node, color);
}

function doNor(node) {
    var color = !node.findLinksInto().any(linkIsTrue) ? green : red;
    setOutputLinks(node, color);
}

function doXor(node) {
    var truecount = 0;
    node.findLinksInto().each(link => { if (linkIsTrue(link)) truecount++; });
    var color = truecount % 2 !== 0 ? green : red;
    setOutputLinks(node, color);
}

function doXnor(node) {
    var truecount = 0;
    node.findLinksInto().each(link => { if (linkIsTrue(link)) truecount++; });
    var color = truecount % 2 === 0 ? green : red;
    setOutputLinks(node, color);
}

function doOutput(node) {
    node.linksConnected.each(link => { node.findObject("NODESHAPE").fill = link.findObject("SHAPE").stroke; });
}

function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}

function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}
window.addEventListener('DOMContentLoaded', init);
