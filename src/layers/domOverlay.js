import Overlayer from './overlay';
import Util from '../util';

const duration = 1200;

/**
 * initDomOverlayer
 */
export class DomOverlayer extends Overlayer {
    constructor(opts) {
        super(opts);
        this.domContainer = this._init();
        this.redraw = _redraw.bind(this);
        if (opts && opts.map) {
            this.setMap(opts.map);
            // bind render doms to each move..performance to be promoted.
            opts.map.on("move", () => {
                this.redraw(opts);
            });
        }
        this.doms = [];
        this.redraw(opts);
        console.log("Dom overlayer add to Map...");
    }

    _init() {
        let canvasContainer = this.map._canvasContainer,
            mapboxCanvas = this.map._canvas,
            domContainer = document.createElement("div");
        domContainer.style.position = "absolute";
        domContainer.className = "overlay-dom";
        domContainer.style.width = mapboxCanvas.style.width;
        domContainer.style.height = mapboxCanvas.style.height;
        canvasContainer.appendChild(domContainer);
        return domContainer;
    }

    /**
     * updateDoms and redraw..
     */
    set setDom(opts) {
         opts.map.un("move", () => {
            this.redraw(opts);
        });
        this.redraw(opts);
    }

    findDom(domId) {
        for(let i = 0;i<this.doms.length;i++) {
            try {
                if (this.doms[i] === domId) {
                    return this.doms[i];
                }
            } catch (error) {

            }
        }
    }

    clearDoms() {
        for(let i = 0;i<this.doms.length;i++) {
            try {
                this.domContainer.removeChild(this.doms[i]);
            } catch (error) {

            }            
        }
    }
}


const lineHeight = 100, dotRadius = 4;
/**
 * domOverlay register&render above default canvas..
 * keep in absolute geolocation..
 */
function _redraw(domOpts) {
    if (domOpts && domOpts.doms) {
        let doms = domOpts.doms;
        // append each of domPopups to domContainer.
        for (let i=0;i<doms.length;i++) {
            let domOpt = doms[i];
            let x = domOpt['lon'], y = domOpt['lat'], 
                pix = this.lnglat2pix(x, y);
            if (pix == null) continue;
            let iconName = domOpt['icon'], resources = domOpt['resources'];
            let dom = this.doms[i*3] || document.createElement("div"),
                line = this.doms[i*3+1] ||document.createElement("div"),
                dot =this.doms[i*3+2] || document.createElement("div");
            line.style.height = lineHeight - 10 + 'px';
            line.style.width = '1px';
            line.style.position = "absolute";
            dot.style.borderRadius = '50%';
            dot.style.width = dot.style.height = dotRadius * 2 + 'px';
            dot.style.position = "absolute";

            dom.style.position = "absolute";
            dom.style.background = "#fff";
            dom.style.padding = '5px';
            // set domOverlay position. dom box animation needed.
            dom.style.left = pix[0] + "px";
            // calc the dom bottom, depend on its height and canvas height..
            dom.style.top = (pix[1] - lineHeight) + "px";
            dom.innerHTML = `<p> ${domOpt['content']} </p>`;
            // only set resource to dom at initial stage.
            if (resources != undefined) {
                Util.setResource(dom, resources);
            } else if (iconName != undefined) {
                Util.setIconDiv(dom, iconName);
            }
            dom.className = "dom-popup";

            line.className = "dom-ele", dot.className = "dom-ele";
            line.style.left = pix[0] + "px";
            line.style.top = (pix[1] - (lineHeight - 10)) + "px";
            dot.style.left = pix[0] - dotRadius + "px";
            dot.style.top = pix[1] - dotRadius + "px";

            // add dom to container at init process.
            if (this.doms[i*3] == undefined) {
                this.domContainer.appendChild(dom);
                this.domContainer.appendChild(line);
                this.domContainer.appendChild(dot);
                this.doms.push(...[dom, line, dot]);
            }
        }
    }
}

function animLine (line){
    line.className = "dom-line";    
}

const htmlTemplate = {

}
