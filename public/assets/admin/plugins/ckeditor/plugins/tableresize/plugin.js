/*
 Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function(){function y(a){return CKEDITOR.env.ie?a.$.clientWidth:parseInt(a.getComputedStyle("width"),10)}function r(a,h){var b=a.getComputedStyle("border-"+h+"-width"),d={thin:"0px",medium:"1px",thick:"2px"};0>b.indexOf("px")&&(b=b in d&&"none"!=a.getComputedStyle("border-style")?d[b]:0);return parseInt(b,10)}function A(a){var h=[],b=-1,d="rtl"==a.getComputedStyle("direction"),f;f=a.$.rows;for(var m=0,g,c,e,k=0,t=f.length;k<t;k++)e=f[k],g=e.cells.length,g>m&&(m=g,c=e);f=c;m=new CKEDITOR.dom.element(a.$.tBodies[0]);
g=m.getDocumentPosition();c=0;for(e=f.cells.length;c<e;c++){var k=new CKEDITOR.dom.element(f.cells[c]),t=f.cells[c+1]&&new CKEDITOR.dom.element(f.cells[c+1]),b=b+(k.$.colSpan||1),n,l,p=k.getDocumentPosition().x;d?l=p+r(k,"left"):n=p+k.$.offsetWidth-r(k,"right");t?(p=t.getDocumentPosition().x,d?n=p+t.$.offsetWidth-r(t,"right"):l=p+r(t,"left")):(p=a.getDocumentPosition().x,d?n=p:l=p+a.$.offsetWidth);k=Math.max(l-n,3);h.push({table:a,index:b,x:n,y:g.y,width:k,height:m.$.offsetHeight,rtl:d})}return h}
function z(a){(a.data||a).preventDefault()}function E(a){function h(){k=0;e.setOpacity(0);n&&b();var a=g.table;setTimeout(function(){a.removeCustomData("_cke_table_pillars")},0);c.removeListener("dragstart",z)}function b(){for(var w=g.rtl,f=w?p.length:B.length,b=0,c=0;c<f;c++){var e=B[c],d=p[c],k=g.table;CKEDITOR.tools.setTimeout(function(c,e,d,g,h,m){c&&c.setStyle("width",l(Math.max(e+m,1)));d&&d.setStyle("width",l(Math.max(g-m,1)));h&&k.setStyle("width",l(h+m*(w?-1:1)));++b==f&&a.fire("saveSnapshot")},
0,this,[e,e&&y(e),d,d&&y(d),(!e||!d)&&y(k)+r(k,"left")+r(k,"right"),n])}}function d(w){z(w);a.fire("saveSnapshot");w=g.index;for(var d=CKEDITOR.tools.buildTableMap(g.table),b=[],h=[],l=Number.MAX_VALUE,r=l,x=g.rtl,v=0,A=d.length;v<A;v++){var q=d[v],u=q[w+(x?1:0)],q=q[w+(x?0:1)],u=u&&new CKEDITOR.dom.element(u),q=q&&new CKEDITOR.dom.element(q);u&&q&&u.equals(q)||(u&&(l=Math.min(l,y(u))),q&&(r=Math.min(r,y(q))),b.push(u),h.push(q))}B=b;p=h;C=g.x-l;D=g.x+r;e.setOpacity(.5);t=parseInt(e.getStyle("left"),
10);n=0;k=1;e.on("mousemove",m);c.on("dragstart",z);c.on("mouseup",f,this)}function f(a){a.removeListener();h()}function m(a){v(a.data.getPageOffset().x)}var g,c,e,k,t,n,B,p,C,D;c=a.document;e=CKEDITOR.dom.element.createFromHtml('\x3cdiv data-cke-temp\x3d1 contenteditable\x3dfalse unselectable\x3don style\x3d"position:absolute;cursor:col-resize;filter:alpha(opacity\x3d0);opacity:0;padding:0;background-color:#004;background-image:none;border:0px none;z-index:10"\x3e\x3c/div\x3e',c);a.on("destroy",
function(){e.remove()});x||c.getDocumentElement().append(e);this.attachTo=function(a){k||(x&&(c.getBody().append(e),n=0),g=a,e.setStyles({width:l(a.width),height:l(a.height),left:l(a.x),top:l(a.y)}),x&&e.setOpacity(.25),e.on("mousedown",d,this),c.getBody().setStyle("cursor","col-resize"),e.show())};var v=this.move=function(a){if(!g)return 0;if(!k&&(a<g.x||a>g.x+g.width))return g=null,k=n=0,c.removeListener("mouseup",f),e.removeListener("mousedown",d),e.removeListener("mousemove",m),c.getBody().setStyle("cursor",
"auto"),x?e.remove():e.hide(),0;a-=Math.round(e.$.offsetWidth/2);if(k){if(a==C||a==D)return 1;a=Math.max(a,C);a=Math.min(a,D);n=a-t}e.setStyle("left",l(a));return 1}}function v(a){var h=a.data.getTarget();if("mouseout"==a.name){if(!h.is("table"))return;for(var b=new CKEDITOR.dom.element(a.data.$.relatedTarget||a.data.$.toElement);b&&b.$&&!b.equals(h)&&!b.is("body");)b=b.getParent();if(!b||b.equals(h))return}h.getAscendant("table",1).removeCustomData("_cke_table_pillars");a.removeListener()}var l=
CKEDITOR.tools.cssLength,x=CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.quirks);CKEDITOR.plugins.add("tableresize",{requires:"tabletools",init:function(a){a.on("contentDom",function(){var h,b=a.editable();b.attachListener(b.isInline()?b:a.document,"mousemove",function(d){d=d.data;var f=d.getTarget();if(f.type==CKEDITOR.NODE_ELEMENT){var b=d.getPageOffset().x;if(h&&h.move(b))z(d);else if(f.is("table")||f.getAscendant("tbody",1))if(f=f.getAscendant("table",1),a.editable().contains(f)){(d=
f.getCustomData("_cke_table_pillars"))||(f.setCustomData("_cke_table_pillars",d=A(f)),f.on("mouseout",v),f.on("mousedown",v));a:{for(var f=0,g=d.length;f<g;f++){var c=d[f];if(b>=c.x&&b<=c.x+c.width){b=c;break a}}b=null}b&&(!h&&(h=new E(a)),h.attachTo(b))}}})})}})})();
