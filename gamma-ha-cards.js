/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, J = M.ShadowRoot && (M.ShadyCSS === void 0 || M.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let Ct = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = ct.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ct.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (s) => new Ct(typeof s == "string" ? s : s + "", void 0, Q), v = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new Ct(e, s, Q);
}, Nt = (s, t) => {
  if (J) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = M.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, ht = J ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Dt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: zt, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: Ht, getOwnPropertySymbols: Rt, getPrototypeOf: Bt } = Object, x = globalThis, dt = x.trustedTypes, Vt = dt ? dt.emptyScript : "", H = x.reactiveElementPolyfillSupport, C = (s, t) => s, j = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Vt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, Pt = (s, t) => !Mt(s, t), pt = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Pt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = pt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && zt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = Lt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const c = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = Bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...Ht(e), ...Rt(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(ht(r));
    } else t !== void 0 && e.push(ht(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Nt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : j).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const c = i.getPropertyOptions(r), l = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((n = c.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? c.converter : j;
      this._$Em = r;
      const p = l.fromAttribute(e, c.type);
      this[r] = p ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const c = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? Pt)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: c } = o, l = this[n];
        c !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[C("elementProperties")] = /* @__PURE__ */ new Map(), S[C("finalized")] = /* @__PURE__ */ new Map(), H == null || H({ ReactiveElement: S }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, ut = (s) => s, z = P.trustedTypes, gt = z ? z.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Et = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, Tt = "?" + b, jt = `<${Tt}>`, _ = document, E = () => _.createComment(""), T = (s) => s === null || typeof s != "object" && typeof s != "function", tt = Array.isArray, Ft = (s) => tt(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", R = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ft = /-->/g, mt = />/g, w = RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), bt = /'/g, xt = /"/g, It = /^(?:script|style|textarea|title)$/i, Wt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), a = Wt(1), A = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), $ = _.createTreeWalker(_, 129);
function Ut(s, t) {
  if (!tt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return gt !== void 0 ? gt.createHTML(t) : t;
}
const qt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = k;
  for (let c = 0; c < e; c++) {
    const l = s[c];
    let p, u, d = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, u = o.exec(l), u !== null); ) f = o.lastIndex, o === k ? u[1] === "!--" ? o = ft : u[1] !== void 0 ? o = mt : u[2] !== void 0 ? (It.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = w) : u[3] !== void 0 && (o = w) : o === w ? u[0] === ">" ? (o = r ?? k, d = -1) : u[1] === void 0 ? d = -2 : (d = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? w : u[3] === '"' ? xt : bt) : o === xt || o === bt ? o = w : o === ft || o === mt ? o = k : (o = w, r = void 0);
    const m = o === w && s[c + 1].startsWith("/>") ? " " : "";
    n += o === k ? l + jt : d >= 0 ? (i.push(p), l.slice(0, d) + Et + l.slice(d) + b + m) : l + b + (d === -2 ? c : m);
  }
  return [Ut(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, l = this.parts, [p, u] = qt(t, e);
    if (this.el = I.createElement(p, i), $.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = $.nextNode()) !== null && l.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(Et)) {
          const f = u[o++], m = r.getAttribute(d).split(b), D = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: D[2], strings: m, ctor: D[1] === "." ? Xt : D[1] === "?" ? Kt : D[1] === "@" ? Gt : L }), r.removeAttribute(d);
        } else d.startsWith(b) && (l.push({ type: 6, index: n }), r.removeAttribute(d));
        if (It.test(r.tagName)) {
          const d = r.textContent.split(b), f = d.length - 1;
          if (f > 0) {
            r.textContent = z ? z.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(d[m], E()), $.nextNode(), l.push({ type: 2, index: ++n });
            r.append(d[f], E());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Tt) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(b, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += b.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = _.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(s, t, e = s, i) {
  var o, c;
  if (t === A) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = T(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((c = r == null ? void 0 : r._$AO) == null || c.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = O(s, r._$AS(s, t.values), r, i)), t;
}
class Yt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? _).importNode(e, !0);
    $.currentNode = r;
    let n = $.nextNode(), o = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let p;
        l.type === 2 ? p = new U(n, n.nextSibling, this, t) : l.type === 1 ? p = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (p = new Zt(n, this, t)), this._$AV.push(p), l = i[++c];
      }
      o !== (l == null ? void 0 : l.index) && (n = $.nextNode(), o++);
    }
    return $.currentNode = _, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = O(this, t, e), T(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ft(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && T(this._$AH) ? this._$AA.nextSibling.data = t : this.T(_.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Ut(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new Yt(r, this), c = o.u(this.options);
      o.p(e), this.T(c), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = vt.get(t.strings);
    return e === void 0 && vt.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new U(this.O(E()), this.O(E()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = ut(t).nextSibling;
      ut(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = O(this, t, e, 0), o = !T(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const c = t;
      let l, p;
      for (t = n[0], l = 0; l < n.length - 1; l++) p = O(this, c[i + l], e, l), p === A && (p = this._$AH[l]), o || (o = !T(p) || p !== this._$AH[l]), p === h ? t = h : t !== h && (t += (p ?? "") + n[l + 1]), this._$AH[l] = p;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Xt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Kt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Gt extends L {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? h) === A) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const B = P.litHtmlPolyfillSupport;
B == null || B(I, U), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.2");
const Jt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new U(t.insertBefore(E(), n), n, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis;
class g extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return A;
  }
}
var kt;
g._$litElement$ = !0, g.finalized = !0, (kt = y.litElementHydrateSupport) == null || kt.call(y, { LitElement: g });
const V = y.litElementPolyfillSupport;
V == null || V({ LitElement: g });
(y.litElementVersions ?? (y.litElementVersions = [])).push("4.2.2");
const wt = {
  icon: "mdi:ceiling-light",
  width: "260px",
  fill_container: !1,
  height: "64px",
  border_radius: "999px",
  has_dimmer: !1,
  show_state: !0,
  state_display: "state",
  on_color: "#ff8a1c",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, $t = ["toggle", "more-info", "none"], Qt = ["state", "brightness", "auto"];
function te(s, t) {
  s.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const et = class et extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.isDimming = !1, this.pendingDimmerPointer = !1, this.pointerStartX = 0, this.pointerStartY = 0, this.suppressClick = !1;
  }
  static get styles() {
    return v`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 64px;
        --glow-card-radius: 999px;
        --glow-on-color: #ff8a1c;
        --glow-off-color: #697382;
        --glow-background: #101722;

        display: block;
        max-width: var(--glow-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--glow-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--glow-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--glow-state-color) 8%, transparent) 42%,
            color-mix(in srgb, var(--glow-hot-color) 13%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--glow-background) 92%, #ffffff 6%),
            color-mix(in srgb, var(--glow-background) 92%, #000000 12%)
          );
        border: 1px solid color-mix(
          in srgb,
          var(--glow-border-color) var(--glow-border-strength),
          transparent
        );
        border-radius: var(--glow-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          inset 0 0 0 var(--glow-inner-ring-width)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--glow-outer-blur)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr);
        gap: 8px;
        min-height: var(--glow-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .button.dimmer {
        touch-action: pan-y;
      }

      .button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--glow-warm-color) 10%, transparent) 72%,
            color-mix(in srgb, var(--glow-hot-color) 25%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent)
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent),
            transparent 32%,
            transparent 70%,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button::after {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--glow-state-color) 32%, transparent),
          0 0 10px
            color-mix(in srgb, var(--glow-state-color) 56%, transparent),
          0 0 22px
            color-mix(in srgb, var(--glow-state-color) 42%, transparent),
          0 0 46px
            color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 52%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--glow-state-color) 62%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 46%, transparent),
          0 0 38px
            color-mix(in srgb, var(--glow-state-color) 28%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .button .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--glow-state-color) 22%, transparent),
            transparent 72%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .button .slider-fill {
        background:
          radial-gradient(
            circle at 18% 50%,
            color-mix(in srgb, var(--glow-hot-color) 22%, transparent),
            transparent 48%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 44%, transparent),
            color-mix(in srgb, var(--glow-state-color) 32%, transparent)
          );
        border-radius: inherit;
        box-shadow:
          inset 0 0 18px
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 22%, transparent);
        inset: 0 auto 0 0;
        opacity: var(--glow-slider-opacity);
        pointer-events: none;
        position: absolute;
        transition:
          opacity 160ms ease,
          width 120ms ease;
        width: var(--glow-slider-percent);
        z-index: 0;
      }

      .button .slider-fill::after {
        background: color-mix(in srgb, var(--glow-state-color) 86%, #ffffff 10%);
        border-radius: 999px;
        box-shadow:
          0 0 10px
            color-mix(in srgb, var(--glow-state-color) 62%, transparent),
          0 0 24px
            color-mix(in srgb, var(--glow-state-color) 36%, transparent);
        content: '';
        height: calc(100% - 18px);
        opacity: var(--glow-slider-handle-opacity);
        position: absolute;
        right: 2px;
        top: 9px;
        width: 2px;
      }

      .button.on.animated::after {
        animation: glow-breathe 3s ease-in-out infinite;
      }

      .button:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
      }

      .button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .icon-shell,
      .content {
        position: relative;
        z-index: 1;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 70%
          ),
          color-mix(in srgb, var(--glow-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--glow-icon-color);
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @keyframes glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .button.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-light-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("light.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...wt,
      ...t
    }, this.style.setProperty(
      "--glow-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--glow-card-height", this.config.height ?? "64px"), this.style.setProperty(
      "--glow-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--glow-on-color", this.config.on_color ?? "#ff8a1c"), this.style.setProperty("--glow-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--glow-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 1;
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return this.optimisticBrightnessPercent !== void 0 ? this.optimisticBrightnessPercent > 0 : this.optimisticOn !== void 0 ? this.optimisticOn : ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get domain() {
    return this.config.entity.split(".")[0] ?? "light";
  }
  get hasDimmer() {
    return !!this.config.has_dimmer && this.domain === "light";
  }
  get brightnessPercent() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.brightness;
    if (typeof t == "number")
      return Math.round(t / 255 * 100);
  }
  get activeBrightnessPercent() {
    return this.dimmingPercent !== void 0 ? this.dimmingPercent : this.optimisticBrightnessPercent !== void 0 ? this.optimisticBrightnessPercent : this.isOn ? this.brightnessPercent ?? 100 : 0;
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    if (this.isUnavailable)
      return "Unavailable";
    const t = this.config.state_display ?? "state", e = this.brightnessPercent;
    return this.isOn && this.hasDimmer ? `${this.activeBrightnessPercent}%` : this.isOn && e !== void 0 && (t === "brightness" || t === "auto") ? `${e}%` : this.isOn ? "On" : "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || wt.icon;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticOn(t, e) {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = t, this.optimisticBrightnessPercent = e, this.optimisticTimer = window.setTimeout(() => {
      this.clearOptimisticState();
    }, 1800);
  }
  setOptimisticBrightness(t) {
    this.setOptimisticOn(t > 0, Math.max(0, Math.min(100, t)));
  }
  clearOptimisticState() {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = void 0, this.optimisticBrightnessPercent = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticState());
  }
  performAction(t) {
    var e;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.hasDimmer ? this.setOptimisticBrightness(
        this.isOn ? 0 : this.brightnessPercent ?? 100
      ) : this.setOptimisticOn(!this.isOn), this.trackServiceResult(
        (e = this.hass) == null ? void 0 : e.callService(this.domain, "toggle", {
          entity_id: this.config.entity
        })
      );
    }
  }
  brightnessFromPointer(t) {
    const i = t.currentTarget.getBoundingClientRect(), r = (t.clientX - i.left) / i.width * 100;
    return Math.max(0, Math.min(100, Math.round(r)));
  }
  commitBrightness(t) {
    var e, i;
    if (!(!this.hasDimmer || this.isUnavailable)) {
      if (t <= 5) {
        this.setOptimisticBrightness(0), this.trackServiceResult(
          (e = this.hass) == null ? void 0 : e.callService("light", "turn_off", {
            entity_id: this.config.entity
          })
        );
        return;
      }
      this.setOptimisticBrightness(t), this.trackServiceResult(
        (i = this.hass) == null ? void 0 : i.callService("light", "turn_on", {
          entity_id: this.config.entity,
          brightness_pct: Math.max(1, t)
        })
      );
    }
  }
  handlePointerDown(t) {
    var e, i;
    if (window.clearTimeout(this.holdTimer), this.holdActive = !1, this.suppressClick = !1, this.hasDimmer && !this.isUnavailable) {
      this.pendingDimmerPointer = !0, this.isDimming = !1, this.pointerStartX = t.clientX, this.pointerStartY = t.clientY, (i = (e = t.currentTarget).setPointerCapture) == null || i.call(e, t.pointerId), this.holdTimer = window.setTimeout(() => {
        !this.pendingDimmerPointer || this.isDimming || (this.holdActive = !0, this.pendingDimmerPointer = !1, this.suppressClick = !0, this.performAction(this.config.hold_action));
      }, 500);
      return;
    }
    this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerMove(t) {
    if (!this.hasDimmer || !this.pendingDimmerPointer && !this.isDimming)
      return;
    const e = Math.abs(t.clientX - this.pointerStartX), i = Math.abs(t.clientY - this.pointerStartY);
    if (!this.isDimming) {
      if (e < 9 || i > e * 1.4)
        return;
      window.clearTimeout(this.holdTimer), this.isDimming = !0, this.pendingDimmerPointer = !1, this.suppressClick = !0;
    }
    this.dimmingPercent = this.brightnessFromPointer(t), t.preventDefault();
  }
  handlePointerUp(t) {
    if (window.clearTimeout(this.holdTimer), this.hasDimmer && this.isDimming) {
      const e = this.brightnessFromPointer(t);
      this.dimmingPercent = e, this.commitBrightness(e), this.isDimming = !1, this.pendingDimmerPointer = !1, window.setTimeout(() => {
        this.dimmingPercent = void 0, this.suppressClick = !1;
      }, 180), t.preventDefault();
      return;
    }
    this.hasDimmer && (this.pendingDimmerPointer = !1);
  }
  handlePointerCancel() {
    window.clearTimeout(this.holdTimer), this.isDimming = !1, this.pendingDimmerPointer = !1, this.dimmingPercent = void 0, window.setTimeout(() => {
      this.suppressClick = !1;
    }, 0);
  }
  handleClick(t) {
    if (this.hasDimmer && this.suppressClick) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isOn ? this.config.on_color : this.config.off_color, e = this.isOn ? "1" : "0", i = this.hasDimmer ? `${this.activeBrightnessPercent}%` : "0%", r = this.hasDimmer && this.activeBrightnessPercent > 0 ? "1" : "0", n = this.hasDimmer && this.activeBrightnessPercent > 5 ? "1" : "0";
    return a`
      <ha-card
        style="
          --glow-state-color: ${t};
          --glow-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #ffd26a)" : t};
          --glow-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 82%, #ff4f00)" : t};
          --glow-border-color: ${t};
          --glow-icon-color: ${t};
          --glow-on-opacity: ${e};
          --glow-border-strength: ${this.isOn ? "78%" : "26%"};
          --glow-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --glow-inner-ring-strength: ${this.isOn ? "28%" : "0%"};
          --glow-outer-blur: ${this.isOn ? "30px" : "0"};
          --glow-outer-strength: ${this.isOn ? "26%" : "0%"};
          --glow-slider-percent: ${i};
          --glow-slider-opacity: ${r};
          --glow-slider-handle-opacity: ${n};
        "
      >
        <button
          type="button"
          class="button ${this.hasDimmer ? "dimmer" : ""} ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointermove=${this.handlePointerMove}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerCancel}
        >
          <span class="ambient-glow"></span>
          <span class="slider-fill"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : h}
          </span>
        </button>
      </ha-card>
    `;
  }
};
et.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  dimmingPercent: { state: !0 },
  optimisticOn: { state: !0 },
  optimisticBrightnessPercent: { state: !0 }
};
let F = et;
customElements.get("glow-light-card") || customElements.define("glow-light-card", F);
const it = class it extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return v`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, te(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: "light" } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "light" } }
      }
    ], e = {
      entity: "Light Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Bar Lights")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "64px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Has Dimmer", "has_dimmer", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#ff8a1c")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
            ${this.renderSelect(
      "State Display",
      "state_display",
      Qt,
      "state"
    )}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", $t, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      $t,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
it.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let W = it;
customElements.get("glow-light-card-editor") || customElements.define("glow-light-card-editor", W);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-light-card",
  name: "Glow Light Card",
  description: "A compact glowing light card for Home Assistant."
});
const yt = {
  icon: "mdi:toggle-switch",
  width: "260px",
  fill_container: !1,
  height: "64px",
  border_radius: "999px",
  show_state: !0,
  on_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, _t = ["toggle", "more-info", "none"];
function ee(s, t) {
  s.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const rt = class rt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return v`
      :host {
        --switch-card-width: 260px;
        --switch-card-height: 64px;
        --switch-card-radius: 999px;
        --switch-on-color: #45d158;
        --switch-off-color: #697382;
        --switch-background: #101722;

        display: block;
        max-width: var(--switch-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .switch-button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--switch-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--switch-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--switch-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--switch-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--switch-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--switch-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--switch-state-color) var(--switch-border-strength),
            transparent
          );
        border-radius: var(--switch-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--switch-inner-ring-width)
            color-mix(
              in srgb,
              var(--switch-state-color) var(--switch-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--switch-outer-blur)
            color-mix(
              in srgb,
              var(--switch-state-color) var(--switch-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        min-height: var(--switch-card-height);
        overflow: hidden;
        padding: 8px 12px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .switch-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--switch-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--switch-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--switch-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--switch-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--switch-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .switch-button::after {
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px
            color-mix(in srgb, var(--switch-state-color) 34%, transparent),
          0 0 10px
            color-mix(in srgb, var(--switch-state-color) 60%, transparent),
          0 0 22px
            color-mix(in srgb, var(--switch-state-color) 44%, transparent),
          0 0 46px
            color-mix(in srgb, var(--switch-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--switch-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 52%, transparent);
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--switch-state-color) 62%, transparent),
          0 0 18px
            color-mix(in srgb, var(--switch-state-color) 46%, transparent),
          0 0 38px
            color-mix(in srgb, var(--switch-state-color) 28%, transparent);
        inset: 2px;
        opacity: var(--switch-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--switch-state-color) 20%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--switch-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .status-dot {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--switch-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--switch-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--switch-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-dot {
        align-self: center;
        background: color-mix(in srgb, var(--switch-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--switch-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--switch-state-color) 28%, transparent);
        height: 8px;
        justify-self: end;
        opacity: var(--switch-dot-opacity);
        width: 8px;
      }

      .switch-button:focus-visible {
        outline: 2px solid var(--switch-state-color);
        outline-offset: 3px;
      }

      .switch-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .switch-button.on.animated::after {
        animation: switch-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes switch-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .switch-button.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-switch-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("switch.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...yt,
      ...t
    }, this.style.setProperty(
      "--switch-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--switch-card-height", this.config.height ?? "64px"), this.style.setProperty(
      "--switch-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--switch-on-color", this.config.on_color ?? "#45d158"), this.style.setProperty("--switch-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--switch-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 1;
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return this.optimisticOn !== void 0 ? this.optimisticOn : ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get domain() {
    return this.config.entity.split(".")[0] || "switch";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOn ? "On" : "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || yt.icon;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticOn(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticOn = void 0;
    }, 1800);
  }
  clearOptimisticOn() {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticOn());
  }
  performAction(t) {
    var e;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.setOptimisticOn(!this.isOn), this.trackServiceResult(
        (e = this.hass) == null ? void 0 : e.callService(this.domain, "toggle", {
          entity_id: this.config.entity
        })
      );
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return a`
      <ha-card
        style="
          --switch-state-color: ${t};
          --switch-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --switch-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --switch-on-opacity: ${e};
          --switch-dot-opacity: ${this.isOn ? "1" : "0.26"};
          --switch-border-strength: ${this.isOn ? "78%" : "24%"};
          --switch-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --switch-inner-ring-strength: ${this.isOn ? "28%" : "0%"};
          --switch-outer-blur: ${this.isOn ? "30px" : "0"};
          --switch-outer-strength: ${this.isOn ? "28%" : "0%"};
        "
      >
        <button
          type="button"
          class="switch-button ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
rt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticOn: { state: !0 }
};
let q = rt;
customElements.get("glow-switch-card") || customElements.define("glow-switch-card", q);
const nt = class nt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return v`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, ee(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "switch" } }
      }
    ], e = {
      entity: "Switch Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Coffee Maker")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "64px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", _t, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      _t,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
nt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Y = nt;
customElements.get("glow-switch-card-editor") || customElements.define("glow-switch-card-editor", Y);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-switch-card",
  name: "Glow Switch Card",
  description: "A compact glowing switch card for Home Assistant."
});
const St = {
  title: "Outlets",
  icon_1: "mdi:power-socket-us",
  icon_2: "mdi:power-socket-us",
  width: "320px",
  fill_container: !1,
  button_height: "58px",
  gap: "12px",
  layout: "duplex",
  show_title: !0,
  show_state: !0,
  on_color: "#ff3b30",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, At = ["toggle", "more-info", "none"], ie = ["duplex", "grid", "stack"];
function re(s, t) {
  s.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const st = class st extends g {
  constructor() {
    super(...arguments), this.optimisticTimers = {}, this.optimisticStates = {}, this.holdActive = !1;
  }
  static get styles() {
    return v`
      :host {
        --outlet-card-width: 540px;
        --outlet-button-height: 58px;
        --outlet-gap: 12px;
        --outlet-on-color: #ff3b30;
        --outlet-off-color: #697382;
        --outlet-background: #101722;

        display: block;
        max-width: var(--outlet-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .card {
        display: grid;
        gap: 10px;
        width: 100%;
      }

      .title {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        font-size: 14px;
        font-weight: 600;
        gap: 8px;
        letter-spacing: 0;
        line-height: 1.2;
        min-height: 20px;
      }

      .title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--outlet-off-color);
      }

      .outlets {
        display: grid;
        gap: var(--outlet-gap);
      }

      .layout-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .layout-stack {
        grid-template-columns: 1fr;
      }

      .duplex-shell {
        background:
          radial-gradient(
            circle at 18% 22%,
            color-mix(in srgb, var(--outlet-any-color) 16%, transparent),
            transparent 36%
          ),
          radial-gradient(
            circle at 82% 78%,
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent),
            transparent 40%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--outlet-background) 88%, #ffffff 8%),
            color-mix(in srgb, var(--outlet-background) 94%, #000000 16%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-any-color) var(--outlet-shell-border-strength),
            transparent
          );
        border-radius: 26px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 1px rgb(255 255 255 / 3%),
          0 14px 28px rgb(0 0 0 / 24%),
          0 0 var(--outlet-shell-glow-blur)
            color-mix(
              in srgb,
              var(--outlet-any-color) var(--outlet-shell-glow-strength),
              transparent
            );
        box-sizing: border-box;
        display: grid;
        gap: 0;
        overflow: hidden;
        padding: 0;
        position: relative;
      }

      .duplex-shell::before {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-any-color) 15%, transparent),
            transparent 70%
          );
        content: '';
        filter: blur(16px);
        inset: 8px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-shell::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-any-color) 44%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--outlet-any-color) 22%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-any-color) 32%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-outlet {
        align-items: center;
        background:
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--outlet-warm-color) 13%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 13%, transparent) 100%
          );
        border: 0;
        border-radius: 0;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 12px;
        grid-template-columns: 48px minmax(0, 1fr) 14px;
        min-height: calc(var(--outlet-button-height) + 4px);
        overflow: hidden;
        padding: 8px 12px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
        z-index: 1;
      }

      .duplex-outlet.top {
        border-radius: 25px 25px 0 0;
      }

      .duplex-outlet.bottom {
        border-radius: 0 0 25px 25px;
      }

      .duplex-outlet.single {
        border-radius: 25px;
      }

      .duplex-outlet::before,
      .duplex-outlet::after {
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .duplex-outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 24%, transparent) 100%
          );
      }

      .duplex-outlet::after {
        border: 0;
        border-radius: inherit;
        box-shadow:
          inset 0 0 0 1px
            color-mix(in srgb, var(--outlet-state-color) 52%, transparent),
          inset 0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 28%, transparent),
          inset 0 1px 0 rgb(255 255 255 / 7%);
      }

      .socket-face {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
            transparent 74%
          ),
          color-mix(in srgb, var(--outlet-state-color) 8%, rgb(255 255 255 / 5%));
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 34%, transparent);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            );
        display: inline-grid;
        height: 36px;
        justify-content: center;
        place-items: center;
        position: relative;
        width: 36px;
        z-index: 2;
      }

      .socket-icon {
        color: color-mix(in srgb, var(--outlet-state-color) 82%, #dce4f0 14%);
        filter: drop-shadow(
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            )
        );
        height: 23px;
        width: 23px;
      }

      .socket-icon path {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.5;
      }

      .duplex-divider {
        background: linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 10%),
          transparent
        );
        height: 1px;
        margin: 0 16px;
        position: relative;
        z-index: 3;
      }

      .outlet {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--outlet-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--outlet-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-state-color) var(--outlet-border-strength),
            transparent
          );
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--outlet-inner-ring-width)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--outlet-outer-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        min-height: var(--outlet-button-height);
        overflow: hidden;
        padding: 8px 12px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent),
            transparent 34%,
            transparent 67%,
            color-mix(in srgb, var(--outlet-hot-color) 14%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outlet::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 88%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px
            color-mix(in srgb, var(--outlet-state-color) 34%, transparent),
          0 0 10px
            color-mix(in srgb, var(--outlet-state-color) 62%, transparent),
          0 0 24px
            color-mix(in srgb, var(--outlet-state-color) 48%, transparent),
          0 0 52px
            color-mix(in srgb, var(--outlet-state-color) 28%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 54%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--outlet-state-color) 64%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 48%, transparent),
          0 0 40px
            color-mix(in srgb, var(--outlet-state-color) 30%, transparent);
        inset: 2px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .icon-shell,
      .socket-face,
      .content,
      .status-light {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--outlet-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--outlet-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-light {
        align-self: center;
        background: color-mix(
          in srgb,
          var(--outlet-state-color) var(--outlet-status-strength),
          #2f3642
        );
        border-radius: 999px;
        box-shadow:
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            ),
          inset 0 1px 0 rgb(255 255 255 / 14%);
        height: 8px;
        justify-self: center;
        width: 8px;
      }

      .outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .duplex-outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .duplex-outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      .duplex-outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes outlet-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (max-width: 620px) {
        .layout-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .outlet.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("dual-outlet-card-editor");
  }
  static getStubConfig(t, e) {
    const i = e.filter(
      (r) => r.startsWith("switch.") || r.startsWith("light.") || r.startsWith("input_boolean.")
    );
    return {
      entity_1: i[0] ?? "",
      entity_2: i[1] ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity_1))
      throw new Error("Entity 1 is required");
    this.config = {
      ...St,
      ...t
    }, this.style.setProperty(
      "--outlet-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--outlet-button-height",
      this.config.button_height ?? "58px"
    ), this.style.setProperty("--outlet-gap", this.config.gap ?? "12px"), this.style.setProperty("--outlet-on-color", this.config.on_color ?? "#ff3b30"), this.style.setProperty("--outlet-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--outlet-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.outlets.length + (this.config.show_title ? 1 : 0);
  }
  get anyOutletOn() {
    return this.outlets.some(
      (t) => this.isOn(this.getEntity(t.entityId), t.entityId)
    );
  }
  get outlets() {
    const t = [
      {
        entityId: this.config.entity_1,
        name: this.config.name_1,
        icon: this.config.icon_1,
        fallbackName: "Outlet 1"
      }
    ];
    return this.config.entity_2 && t.push({
      entityId: this.config.entity_2,
      name: this.config.name_2,
      icon: this.config.icon_2,
      fallbackName: "Outlet 2"
    }), t;
  }
  getEntity(t) {
    var e;
    return (e = this.hass) == null ? void 0 : e.states[t];
  }
  isOn(t, e) {
    return e && this.optimisticStates[e] !== void 0 ? this.optimisticStates[e] : (t == null ? void 0 : t.state) === "on";
  }
  isUnavailable(t) {
    return !t || ["unavailable", "unknown"].includes(t.state);
  }
  domain(t) {
    return t.split(".")[0] || "switch";
  }
  displayName(t) {
    const e = this.getEntity(t.entityId);
    return t.name || (e == null ? void 0 : e.attributes.friendly_name) || t.fallbackName || t.entityId;
  }
  displayState(t, e) {
    return this.isUnavailable(t) ? "Unavailable" : this.isOn(t, e) ? "On" : "Off";
  }
  displayIcon(t) {
    const e = this.getEntity(t.entityId);
    return t.icon || (e == null ? void 0 : e.attributes.icon) || St.icon_1;
  }
  dispatchMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticState(t, e) {
    window.clearTimeout(this.optimisticTimers[t]), this.optimisticStates = {
      ...this.optimisticStates,
      [t]: e
    }, this.optimisticTimers[t] = window.setTimeout(() => {
      this.clearOptimisticState(t);
    }, 1800);
  }
  clearOptimisticState(t) {
    window.clearTimeout(this.optimisticTimers[t]);
    const e = { ...this.optimisticStates };
    delete e[t], this.optimisticStates = e;
  }
  trackServiceResult(t, e) {
    e && typeof e.catch == "function" && e.catch(() => this.clearOptimisticState(t));
  }
  performAction(t, e) {
    var r;
    const i = this.getEntity(t);
    if (!(this.isUnavailable(i) || !e || e === "none")) {
      if (e === "more-info") {
        this.dispatchMoreInfo(t);
        return;
      }
      this.setOptimisticState(t, !this.isOn(i, t)), this.trackServiceResult(
        t,
        (r = this.hass) == null ? void 0 : r.callService(this.domain(t), "toggle", {
          entity_id: t
        })
      );
    }
  }
  handlePointerDown(t) {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(t, this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick(t) {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(t, this.config.tap_action);
  }
  renderOutlet(t) {
    const e = this.getEntity(t.entityId), i = this.isOn(e, t.entityId), r = this.isUnavailable(e), n = i ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", o = i ? "1" : "0";
    return a`
      <button
        class="outlet ${i ? "on" : "off"} ${r ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${n};
          --outlet-warm-color: ${i ? "color-mix(in srgb, " + n + " 86%, #ff9a64)" : n};
          --outlet-hot-color: ${i ? "color-mix(in srgb, " + n + " 80%, #ff1d1d)" : n};
          --outlet-on-opacity: ${o};
          --outlet-border-strength: ${i ? "78%" : "24%"};
          --outlet-inner-ring-width: ${i ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${i ? "28%" : "0%"};
          --outlet-outer-blur: ${i ? "30px" : "0"};
          --outlet-outer-strength: ${i ? "28%" : "0%"};
          --outlet-status-strength: ${i ? "92%" : "22%"};
          --outlet-status-blur: ${i ? "18px" : "0"};
          --outlet-status-glow: ${i ? "72%" : "0%"};
        "
        aria-label=${this.displayName(t)}
        @click=${() => this.handleClick(t.entityId)}
        @pointerdown=${() => this.handlePointerDown(t.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="icon-shell">
          <ha-icon icon=${this.displayIcon(t)}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName(t)}</span>
          ${this.config.show_state ? a`<span class="state"
                >${this.displayState(e, t.entityId)}</span
              >` : h}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplexOutlet(t, e) {
    const i = this.getEntity(t.entityId), r = this.isOn(i, t.entityId), n = this.isUnavailable(i), o = r ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", c = r ? "1" : "0";
    return a`
      <button
        class="duplex-outlet ${e} ${r ? "on" : "off"} ${n ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${o};
          --outlet-warm-color: ${r ? "color-mix(in srgb, " + o + " 86%, #ff9a64)" : o};
          --outlet-hot-color: ${r ? "color-mix(in srgb, " + o + " 80%, #ff1d1d)" : o};
          --outlet-on-opacity: ${c};
          --outlet-border-strength: ${r ? "72%" : "18%"};
          --outlet-inner-ring-width: ${r ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${r ? "26%" : "0%"};
          --outlet-outer-blur: ${r ? "24px" : "0"};
          --outlet-outer-strength: ${r ? "26%" : "0%"};
          --outlet-status-strength: ${r ? "92%" : "22%"};
          --outlet-status-blur: ${r ? "18px" : "0"};
          --outlet-status-glow: ${r ? "72%" : "0%"};
        "
        aria-label=${this.displayName(t)}
        @click=${() => this.handleClick(t.entityId)}
        @pointerdown=${() => this.handlePointerDown(t.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="socket-face" aria-hidden="true">
          <svg class="socket-icon" viewBox="0 0 32 32" focusable="false">
            <path d="M12 8v8"></path>
            <path d="M20 8v8"></path>
            <path d="M11.5 22.5c0 3 2 5 4.5 5s4.5-2 4.5-5"></path>
          </svg>
        </span>
        <span class="content">
          <span class="name">${this.displayName(t)}</span>
          ${this.config.show_state ? a`<span class="state"
                >${this.displayState(i, t.entityId)}</span
              >` : h}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplex() {
    const t = this.anyOutletOn, e = t ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382";
    return a`
      <div
        class="duplex-shell"
        style="
          --outlet-any-color: ${e};
          --outlet-any-on-opacity: ${t ? "1" : "0"};
          --outlet-shell-border-strength: ${t ? "52%" : "20%"};
          --outlet-shell-glow-blur: ${t ? "34px" : "0"};
          --outlet-shell-glow-strength: ${t ? "28%" : "0%"};
        "
      >
        ${this.outlets.map(
      (i, r) => a`
            ${r > 0 ? a`<span class="duplex-divider"></span>` : h}
            ${this.renderDuplexOutlet(
        i,
        this.outlets.length === 1 ? "single" : r === 0 ? "top" : "bottom"
      )}
          `
    )}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.config.layout ?? "duplex";
    return a`
      <ha-card>
        <div class="card">
          ${this.config.show_title ? a`
                <div class="title">
                  <span>${this.config.title}</span>
                </div>
              ` : h}
          ${t === "duplex" ? this.renderDuplex() : a`
                <div class="outlets layout-${t}">
                  ${this.outlets.map((e) => this.renderOutlet(e))}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
st.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticStates: { state: !0 }
};
let X = st;
customElements.get("dual-outlet-card") || customElements.define("dual-outlet-card", X);
const ot = class ot extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return v`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, re(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: ["switch", "light", "input_boolean"] } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Outlets</h3>
          <div class="grid">
            ${this.renderEntityPicker("Outlet 1 Entity", "entity_1")}
            ${this.renderTextInput("Outlet 1 Name", "name_1", "Top Outlet")}
            ${this.renderIconPicker("Outlet 1 Icon", "icon_1")}
            ${this.renderEntityPicker("Outlet 2 Entity", "entity_2")}
            ${this.renderTextInput("Outlet 2 Name", "name_2", "Bottom Outlet")}
            ${this.renderIconPicker("Outlet 2 Icon", "icon_2")}
          </div>
        </section>

        <section class="section">
          <h3>Layout</h3>
          <div class="grid">
            ${this.renderTextInput("Title", "title", "Outlets")}
            ${this.renderTextInput("Width", "width", "320px")}
            ${this.renderTextInput("Button Height", "button_height", "58px")}
            ${this.renderTextInput("Gap", "gap", "12px")}
            ${this.renderSelect("Layout", "layout", ie, "duplex")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show Title", "show_title", !0)}
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#ff3b30")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", At, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      At,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
ot.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let K = ot;
customElements.get("dual-outlet-card-editor") || customElements.define("dual-outlet-card-editor", K);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "dual-outlet-card",
  name: "Dual Outlet Card",
  description: "A two-outlet toggle card with red on-state glow."
});
const Ot = {
  icon: "mdi:fan",
  width: "260px",
  fill_container: !1,
  height: "64px",
  border_radius: "999px",
  show_state: !0,
  show_speed_buttons: !0,
  off_label: "Off",
  speed_1_label: "1",
  speed_2_label: "2",
  speed_3_label: "3",
  speed_1_percentage: 33,
  speed_2_percentage: 66,
  speed_3_percentage: 100,
  on_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "cycle",
  hold_action: "more-info",
  animated: !0
}, ne = ["cycle", "more-info", "none"], se = ["more-info", "none"];
function oe(s, t) {
  s.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function N(s, t) {
  if (typeof s == "number" && Number.isFinite(s))
    return s;
  if (typeof s == "string") {
    const e = Number(s);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
const at = class at extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledSpeedPointer = !1;
  }
  static get styles() {
    return v`
      :host {
        --fan-card-width: 260px;
        --fan-card-height: 64px;
        --fan-card-radius: 999px;
        --fan-on-color: #45d158;
        --fan-off-color: #697382;
        --fan-background: #101722;

        display: block;
        max-width: var(--fan-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .fan {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--fan-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--fan-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--fan-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--fan-state-color) var(--fan-border-strength),
            transparent
          );
        border-radius: var(--fan-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--fan-inner-ring-width)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--fan-outer-blur)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        min-height: var(--fan-card-height);
        overflow: hidden;
        padding: 8px 10px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .fan::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--fan-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--fan-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--fan-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .fan::after {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px color-mix(in srgb, var(--fan-state-color) 34%, transparent),
          0 0 10px color-mix(in srgb, var(--fan-state-color) 60%, transparent),
          0 0 22px color-mix(in srgb, var(--fan-state-color) 44%, transparent),
          0 0 46px color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 52%, transparent);
        box-shadow:
          0 0 6px color-mix(in srgb, var(--fan-state-color) 62%, transparent),
          0 0 18px color-mix(in srgb, var(--fan-state-color) 46%, transparent),
          0 0 38px color-mix(in srgb, var(--fan-state-color) 28%, transparent);
        inset: 2px;
        opacity: var(--fan-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--fan-state-color) 20%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--fan-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .speed-buttons {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--fan-state-color) 14%, #ffffff 2%);
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--fan-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .fan.on.animated .icon-shell ha-icon {
        animation: fan-spin 1.8s linear infinite;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .speed-buttons {
        align-items: center;
        align-self: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        display: inline-grid;
        gap: 2px;
        grid-template-columns: repeat(4, minmax(26px, 1fr));
        min-width: 112px;
        padding: 3px;
      }

      .speed {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        height: 26px;
        justify-content: center;
        letter-spacing: 0;
        min-width: 0;
        padding: 0 6px;
      }

      .speed.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--fan-state-color) 22%, #ffffff 3%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 14px color-mix(in srgb, var(--fan-state-color) 38%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .fan:focus-visible,
      .speed:focus-visible {
        outline: 2px solid var(--fan-state-color);
        outline-offset: 3px;
      }

      .fan.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .fan.on.animated::after {
        animation: fan-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes fan-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @keyframes fan-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 520px) {
        .fan {
          grid-template-columns: 40px minmax(0, 1fr);
        }

        .speed-buttons {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .fan.on.animated::after,
        .fan.on.animated .icon-shell ha-icon {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("speed-fan-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter((r) => r.startsWith("fan."));
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...Ot,
      ...t,
      speed_1_percentage: N(t.speed_1_percentage, 33),
      speed_2_percentage: N(t.speed_2_percentage, 66),
      speed_3_percentage: N(t.speed_3_percentage, 100)
    }, this.style.setProperty(
      "--fan-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--fan-card-height", this.config.height ?? "64px"), this.style.setProperty(
      "--fan-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--fan-on-color", this.config.on_color ?? "#45d158"), this.style.setProperty("--fan-off-color", this.config.off_color ?? "#697382"), this.style.setProperty("--fan-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 1;
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return this.optimisticLevel !== void 0 ? this.optimisticLevel > 0 : ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get percentage() {
    var t;
    return this.optimisticLevel !== void 0 ? this.optimisticLevel === 0 ? 0 : this.percentageForLevel(this.optimisticLevel) : this.isOn ? N((t = this.entity) == null ? void 0 : t.attributes.percentage, 100) : 0;
  }
  get level() {
    const t = this.percentage;
    if (!this.isOn || t <= 0)
      return 0;
    const e = this.config.speed_1_percentage ?? 33, i = this.config.speed_2_percentage ?? 66;
    return t <= (e + i) / 2 ? 1 : t < (i + (this.config.speed_3_percentage ?? 100)) / 2 ? 2 : 3;
  }
  get domain() {
    return this.config.entity.split(".")[0] || "fan";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOn ? `${this.percentage}%` : this.config.off_label ?? "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || Ot.icon;
  }
  percentageForLevel(t) {
    return t === 1 ? this.config.speed_1_percentage ?? 33 : t === 2 ? this.config.speed_2_percentage ?? 66 : this.config.speed_3_percentage ?? 100;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticLevel(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticLevel = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticLevel = void 0;
    }, 1800);
  }
  clearOptimisticLevel() {
    window.clearTimeout(this.optimisticTimer), this.optimisticLevel = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticLevel());
  }
  setLevel(t) {
    var e, i, r;
    if (!this.isUnavailable) {
      if (this.setOptimisticLevel(t), t === 0) {
        this.trackServiceResult(
          (e = this.hass) == null ? void 0 : e.callService(this.domain, "turn_off", {
            entity_id: this.config.entity
          })
        );
        return;
      }
      if (this.domain === "fan") {
        this.trackServiceResult(
          (i = this.hass) == null ? void 0 : i.callService("fan", "set_percentage", {
            entity_id: this.config.entity,
            percentage: this.percentageForLevel(t)
          })
        );
        return;
      }
      this.trackServiceResult(
        (r = this.hass) == null ? void 0 : r.callService(this.domain, "turn_on", {
          entity_id: this.config.entity
        })
      );
    }
  }
  cycleSpeed() {
    const t = (this.level + 1) % 4;
    this.setLevel(t);
  }
  performTapAction() {
    if (!(this.isUnavailable || this.config.tap_action === "none")) {
      if (this.config.tap_action === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.cycleSpeed();
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.config.hold_action !== "none" && this.dispatchMoreInfo();
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performTapAction();
  }
  handleSpeedPointerDown(t, e) {
    t.stopPropagation(), this.handledSpeedPointer = !0, window.setTimeout(() => {
      this.handledSpeedPointer = !1;
    }, 500), this.setLevel(e);
  }
  handleSpeedClick(t, e) {
    if (t.stopPropagation(), this.handledSpeedPointer) {
      this.handledSpeedPointer = !1;
      return;
    }
    this.setLevel(e);
  }
  renderSpeedButtons() {
    const t = [
      { level: 0, label: this.config.off_label ?? "Off" },
      { level: 1, label: this.config.speed_1_label ?? "1" },
      { level: 2, label: this.config.speed_2_label ?? "2" },
      { level: 3, label: this.config.speed_3_label ?? "3" }
    ];
    return a`
      <div class="speed-buttons" aria-label="Fan speed">
        ${t.map(
      (e) => a`
            <button
              class="speed ${this.level === e.level ? "active" : ""}"
              aria-label=${e.label}
              @pointerdown=${(i) => this.handleSpeedPointerDown(i, e.level)}
              @click=${(i) => this.handleSpeedClick(i, e.level)}
            >
              ${e.label}
            </button>
          `
    )}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return a`
      <ha-card
        style="
          --fan-state-color: ${t};
          --fan-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --fan-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --fan-on-opacity: ${e};
          --fan-border-strength: ${this.isOn ? "78%" : "24%"};
          --fan-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --fan-inner-ring-strength: ${this.isOn ? "28%" : "0%"};
          --fan-outer-blur: ${this.isOn ? "30px" : "0"};
          --fan-outer-strength: ${this.isOn ? "28%" : "0%"};
        "
      >
        <div
          class="fan ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          role="button"
          tabindex="0"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : h}
          </span>
          ${this.config.show_speed_buttons ? this.renderSpeedButtons() : h}
        </div>
      </ha-card>
    `;
  }
};
at.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLevel: { state: !0 }
};
let G = at;
customElements.get("speed-fan-card") || customElements.define("speed-fan-card", G);
const lt = class lt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return v`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, oe(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: "fan" } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderNumberInput(t, e, i = "") {
    return a`
      <ha-textfield
        type="number"
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderEntityPicker("Entity", "entity")}
            ${this.renderTextInput("Name", "name", "Fan")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "64px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Speeds</h3>
          <div class="grid">
            ${this.renderTextInput("Off Label", "off_label", "Off")}
            ${this.renderTextInput("Speed 1 Label", "speed_1_label", "1")}
            ${this.renderTextInput("Speed 2 Label", "speed_2_label", "2")}
            ${this.renderTextInput("Speed 3 Label", "speed_3_label", "3")}
            ${this.renderNumberInput("Speed 1 Percent", "speed_1_percentage", "33")}
            ${this.renderNumberInput("Speed 2 Percent", "speed_2_percentage", "66")}
            ${this.renderNumberInput("Speed 3 Percent", "speed_3_percentage", "100")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Show Speed Buttons", "show_speed_buttons", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", ne, "cycle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      se,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
lt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Z = lt;
customElements.get("speed-fan-card-editor") || customElements.define("speed-fan-card-editor", Z);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "speed-fan-card",
  name: "Speed Fan Card",
  description: "A compact fan card with off, 1, 2, and 3 speed controls."
});
//# sourceMappingURL=gamma-ha-cards.js.map
