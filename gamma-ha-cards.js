/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, rt = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), xt = /* @__PURE__ */ new WeakMap();
let Bt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (rt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = xt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && xt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const qt = (n) => new Bt(typeof n == "string" ? n : n + "", void 0, ot), f = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, r, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + n[o + 1], n[0]);
  return new Bt(e, n, ot);
}, Kt = (n, t) => {
  if (rt) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = F.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, n.appendChild(i);
  }
}, vt = rt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return qt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Gt, defineProperty: Jt, getOwnPropertyDescriptor: Yt, getOwnPropertyNames: Xt, getOwnPropertySymbols: Zt, getPrototypeOf: Qt } = Object, v = globalThis, wt = v.trustedTypes, te = wt ? wt.emptyScript : "", B = v.reactiveElementPolyfillSupport, A = (n, t) => n, j = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? te : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ht = (n, t) => !Gt(n, t), yt = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Ht };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = yt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Jt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = Yt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: r, set(a) {
      const l = r == null ? void 0 : r.call(this);
      o == null || o.call(this, a), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? yt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(A("elementProperties"))) return;
    const t = Qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(A("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(A("properties"))) {
      const e = this.properties, i = [...Xt(e), ...Zt(e)];
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
      for (const r of i) e.unshift(vt(r));
    } else t !== void 0 && e.push(vt(t));
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
    return Kt(t, this.constructor.elementStyles), t;
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
    var o;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const a = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : j).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, a;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), c = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : j;
      this._$Em = r;
      const d = c.fromAttribute(e, l.type);
      this[r] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    var a;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (o = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? Ht)(o, e) || i.useDefault && i.reflect && o === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, a] of r) {
        const { wrapped: l } = a, c = this[o];
        l !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, a, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[A("elementProperties")] = /* @__PURE__ */ new Map(), k[A("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: k }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, $t = (n) => n, D = O.trustedTypes, _t = D ? D.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Rt = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, Vt = "?" + x, ee = `<${Vt}>`, _ = document, E = () => _.createComment(""), M = (n) => n === null || typeof n != "object" && typeof n != "function", nt = Array.isArray, ie = (n) => nt(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", H = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, kt = /-->/g, Ct = />/g, w = RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), St = /'/g, Pt = /"/g, jt = /^(?:script|style|textarea|title)$/i, re = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), s = re(1), C = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Tt = /* @__PURE__ */ new WeakMap(), y = _.createTreeWalker(_, 129);
function Wt(n, t) {
  if (!nt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _t !== void 0 ? _t.createHTML(t) : t;
}
const oe = (n, t) => {
  const e = n.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = P;
  for (let l = 0; l < e; l++) {
    const c = n[l];
    let d, u, p = -1, m = 0;
    for (; m < c.length && (a.lastIndex = m, u = a.exec(c), u !== null); ) m = a.lastIndex, a === P ? u[1] === "!--" ? a = kt : u[1] !== void 0 ? a = Ct : u[2] !== void 0 ? (jt.test(u[2]) && (r = RegExp("</" + u[2], "g")), a = w) : u[3] !== void 0 && (a = w) : a === w ? u[0] === ">" ? (a = r ?? P, p = -1) : u[1] === void 0 ? p = -2 : (p = a.lastIndex - u[2].length, d = u[1], a = u[3] === void 0 ? w : u[3] === '"' ? Pt : St) : a === Pt || a === St ? a = w : a === kt || a === Ct ? a = P : (a = w, r = void 0);
    const b = a === w && n[l + 1].startsWith("/>") ? " " : "";
    o += a === P ? c + ee : p >= 0 ? (i.push(d), c.slice(0, p) + Rt + c.slice(p) + x + b) : c + x + (p === -2 ? l : b);
  }
  return [Wt(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const l = t.length - 1, c = this.parts, [d, u] = oe(t, e);
    if (this.el = I.createElement(d, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = y.nextNode()) !== null && c.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(Rt)) {
          const m = u[a++], b = r.getAttribute(p).split(x), z = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: o, name: z[2], strings: b, ctor: z[1] === "." ? se : z[1] === "?" ? ae : z[1] === "@" ? le : N }), r.removeAttribute(p);
        } else p.startsWith(x) && (c.push({ type: 6, index: o }), r.removeAttribute(p));
        if (jt.test(r.tagName)) {
          const p = r.textContent.split(x), m = p.length - 1;
          if (m > 0) {
            r.textContent = D ? D.emptyScript : "";
            for (let b = 0; b < m; b++) r.append(p[b], E()), y.nextNode(), c.push({ type: 2, index: ++o });
            r.append(p[m], E());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Vt) c.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(x, p + 1)) !== -1; ) c.push({ type: 7, index: o }), p += x.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = _.createElement("template");
    return i.innerHTML = t, i;
  }
}
function S(n, t, e = n, i) {
  var a, l;
  if (t === C) return t;
  let r = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), o === void 0 ? r = void 0 : (r = new o(n), r._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = S(n, r._$AS(n, t.values), r, i)), t;
}
class ne {
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
    y.currentNode = r;
    let o = y.nextNode(), a = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let d;
        c.type === 2 ? d = new U(o, o.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (d = new ce(o, this, t)), this._$AV.push(d), c = i[++l];
      }
      a !== (c == null ? void 0 : c.index) && (o = y.nextNode(), a++);
    }
    return y.currentNode = _, r;
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
    t = S(this, t, e), M(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ie(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(_.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Wt(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const a = new ne(r, this), l = a.u(this.options);
      a.p(e), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = Tt.get(t.strings);
    return e === void 0 && Tt.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new U(this.O(E()), this.O(E()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = $t(t).nextSibling;
      $t(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class N {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = S(this, t, e, 0), a = !M(t) || t !== this._$AH && t !== C, a && (this._$AH = t);
    else {
      const l = t;
      let c, d;
      for (t = o[0], c = 0; c < o.length - 1; c++) d = S(this, l[i + c], e, c), d === C && (d = this._$AH[c]), a || (a = !M(d) || d !== this._$AH[c]), d === h ? t = h : t !== h && (t += (d ?? "") + o[c + 1]), this._$AH[c] = d;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class se extends N {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class ae extends N {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class le extends N {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? h) === C) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ce {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const R = O.litHtmlPolyfillSupport;
R == null || R(I, U), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.2");
const he = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new U(t.insertBefore(E(), o), o, void 0, e ?? {});
  }
  return r._$AI(n), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $ = globalThis;
class g extends k {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = he(e, this.renderRoot, this.renderOptions);
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
    return C;
  }
}
var Nt;
g._$litElement$ = !0, g.finalized = !0, (Nt = $.litElementHydrateSupport) == null || Nt.call($, { LitElement: g });
const V = $.litElementPolyfillSupport;
V == null || V({ LitElement: g });
($.litElementVersions ?? ($.litElementVersions = [])).push("4.2.2");
const At = {
  icon: "mdi:ceiling-light",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  has_dimmer: !1,
  show_light_controls: !1,
  show_color_presets: !0,
  show_color_temp: !0,
  show_effects: !0,
  show_state: !0,
  state_display: "state",
  on_color: "#ff8a1c",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, Ot = ["toggle", "more-info", "none"], de = ["state", "brightness", "auto"], pe = {
  color: "Color",
  temperature: "Temp",
  effect: "Effect"
}, ue = [
  { name: "Amber", rgb_color: [255, 146, 66] },
  { name: "Peach", rgb_color: [255, 191, 142] },
  { name: "Cream", rgb_color: [255, 225, 194] },
  { name: "White", rgb_color: [255, 255, 244] },
  { name: "Sky", rgb_color: [89, 164, 255] },
  { name: "Rose", rgb_color: [255, 112, 182] }
], ge = [
  { name: "Warm", color_temp_kelvin: 2700 },
  { name: "Soft", color_temp_kelvin: 3200 },
  { name: "Neutral", color_temp_kelvin: 4e3 },
  { name: "Day", color_temp_kelvin: 5e3 }
];
function fe(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const st = class st extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.isDimming = !1, this.pendingDimmerPointer = !1, this.pointerStartX = 0, this.pointerStartY = 0, this.suppressClick = !1;
  }
  static get styles() {
    return f`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 56px;
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

      .button.panel {
        border-radius: min(var(--glow-card-radius), 22px);
        cursor: default;
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr;
        min-height: max(216px, var(--glow-card-height));
        padding: 12px;
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
          color-mix(in srgb, var(--glow-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--glow-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--glow-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--glow-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--glow-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--glow-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--glow-state-color) 8%, transparent);
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
            color-mix(in srgb, var(--glow-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
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
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        height: 38px;
        justify-content: center;
        padding: 0;
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

      .panel-header,
      .brightness-control,
      .mode-tabs,
      .control-panel {
        position: relative;
        z-index: 2;
      }

      .panel-header {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: 38px minmax(0, 1fr) auto;
      }

      .level {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        min-width: 34px;
        text-align: right;
      }

      .brightness-control {
        appearance: none;
        background: rgb(255 255 255 / 10%);
        border: 1px solid rgb(255 255 255 / 11%);
        border-radius: 10px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
        cursor: pointer;
        display: block;
        height: 42px;
        overflow: hidden;
        padding: 0;
        touch-action: pan-y;
        width: 100%;
      }

      .brightness-fill {
        background:
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-state-color) 70%, #ff9a52),
            #fff6eb
          );
        border-radius: inherit;
        display: block;
        height: 100%;
        width: var(--glow-slider-percent);
      }

      .mode-tabs {
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        display: grid;
        gap: 2px;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        min-height: 30px;
        padding: 2px;
      }

      .mode-tab {
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        font: inherit;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0;
        padding: 0 8px;
      }

      .mode-tab.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 84%
          ),
          color-mix(in srgb, var(--glow-state-color) 24%, #ffffff 4%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .control-panel {
        display: grid;
        gap: 8px;
      }

      .swatches {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .swatch,
      .effect-chip {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .swatch {
        align-items: center;
        background: var(--swatch-color);
        border: 1px solid rgb(255 255 255 / 18%);
        border-radius: 12px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 28%),
          0 8px 14px rgb(0 0 0 / 14%);
        display: inline-flex;
        height: 42px;
        justify-content: center;
        padding: 0;
        position: relative;
      }

      .swatch.active {
        border-color: rgb(255 255 255 / 82%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 32%),
          0 0 0 2px color-mix(in srgb, var(--glow-state-color) 62%, #ffffff 18%),
          0 0 18px color-mix(in srgb, var(--glow-state-color) 36%, transparent);
      }

      .swatch.active::after {
        align-items: center;
        background: rgb(0 0 0 / 42%);
        border: 1px solid rgb(255 255 255 / 34%);
        border-radius: 999px;
        color: #ffffff;
        content: '✓';
        display: inline-flex;
        font-size: 12px;
        font-weight: 800;
        height: 20px;
        justify-content: center;
        line-height: 1;
        width: 20px;
      }

      .effect-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .effect-chip {
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 11px;
        font-weight: 700;
        min-height: 32px;
        padding: 0 12px;
      }

      .effect-chip.active {
        background: color-mix(in srgb, var(--glow-state-color) 24%, #ffffff 4%);
        border-color: color-mix(in srgb, var(--glow-state-color) 42%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .brightness-control:focus-visible,
      .icon-shell:focus-visible,
      .mode-tab:focus-visible,
      .swatch:focus-visible,
      .effect-chip:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
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
      ...At,
      ...t
    }, this.style.setProperty(
      "--glow-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--glow-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--glow-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--glow-on-color", this.config.on_color ?? "#ff8a1c"), this.style.setProperty("--glow-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--glow-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.hasLightControls ? 4 : 1;
  }
  getGridOptions() {
    const t = this.hasLightControls;
    return {
      rows: t ? 4 : 1,
      columns: 6,
      min_rows: t ? 3 : 1,
      max_rows: t ? 5 : 1,
      min_columns: 3,
      max_columns: 12
    };
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
  get hasLightControls() {
    return !!this.config.show_light_controls && this.domain === "light";
  }
  get supportedColorModes() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.supported_color_modes;
    return Array.isArray(t) ? t.filter((i) => typeof i == "string") : [];
  }
  get effectList() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.effect_list;
    return Array.isArray(t) ? t.filter((i) => typeof i == "string") : [];
  }
  get supportsColorTemp() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes;
    return !!(this.supportedColorModes.includes("color_temp") || typeof (t == null ? void 0 : t.color_temp_kelvin) == "number" || typeof (t == null ? void 0 : t.min_color_temp_kelvin) == "number" || typeof (t == null ? void 0 : t.max_color_temp_kelvin) == "number");
  }
  get controlModes() {
    if (!this.hasLightControls)
      return [];
    const t = [];
    return this.config.show_color_presets !== !1 && t.push("color"), this.config.show_color_temp !== !1 && this.supportsColorTemp && t.push("temperature"), this.config.show_effects !== !1 && this.effectList.length > 0 && t.push("effect"), t;
  }
  get activeControlMode() {
    const t = this.controlModes;
    if (t.length !== 0)
      return this.controlMode && t.includes(this.controlMode) ? this.controlMode : t[0];
  }
  get currentRgb() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.rgb_color;
    if (!(!Array.isArray(t) || t.length < 3))
      return t.slice(0, 3).map(
        (i) => Math.max(0, Math.min(255, Math.round(Number(i) || 0)))
      );
  }
  get currentKelvin() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.color_temp_kelvin;
    return typeof t == "number" ? t : void 0;
  }
  get colorPresets() {
    var t;
    return (t = this.config.color_presets) != null && t.length ? this.config.color_presets : ue;
  }
  get stateColor() {
    if (!this.isOn)
      return this.config.off_color ?? "#697382";
    const t = this.currentRgb;
    return t ? this.rgbToCss(t) : this.config.on_color ?? "#ff8a1c";
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
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || At.icon;
  }
  rgbToCss(t) {
    return `rgb(${t[0]} ${t[1]} ${t[2]})`;
  }
  kelvinToCss(t) {
    return t <= 3e3 ? "#ffb56f" : t <= 3800 ? "#ffd9a6" : t <= 4600 ? "#fff1d6" : "#f2f7ff";
  }
  colorDistance(t, e) {
    return Math.sqrt(
      t.reduce((i, r, o) => {
        const a = r - (e[o] ?? 0);
        return i + a * a;
      }, 0)
    );
  }
  isColorPresetActive(t) {
    return !this.isOn || !t.rgb_color || !this.currentRgb ? !1 : this.colorDistance(t.rgb_color, this.currentRgb) < 44;
  }
  isTemperaturePresetActive(t) {
    return !this.isOn || !t.color_temp_kelvin || !this.currentKelvin ? !1 : Math.abs(t.color_temp_kelvin - this.currentKelvin) < 220;
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
  turnOnWithOptions(t) {
    var i;
    if (this.isUnavailable || this.domain !== "light")
      return;
    const e = typeof t.brightness_pct == "number" ? t.brightness_pct : this.activeBrightnessPercent || this.brightnessPercent || 100;
    this.setOptimisticOn(!0, e), this.trackServiceResult(
      (i = this.hass) == null ? void 0 : i.callService("light", "turn_on", {
        entity_id: this.config.entity,
        brightness_pct: Math.max(1, e),
        ...t
      })
    );
  }
  handleControlModeClick(t, e) {
    t.stopPropagation(), this.controlMode = e;
  }
  handleColorPresetClick(t, e) {
    t.stopPropagation(), e.rgb_color && this.turnOnWithOptions({
      rgb_color: e.rgb_color
    });
  }
  handleTemperaturePresetClick(t, e) {
    t.stopPropagation(), e.color_temp_kelvin && this.turnOnWithOptions({
      color_temp_kelvin: e.color_temp_kelvin
    });
  }
  handleEffectClick(t, e) {
    t.stopPropagation(), this.turnOnWithOptions({ effect: e });
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
  handleIconPointerDown(t) {
    !this.hasDimmer && !this.hasLightControls || (t.stopPropagation(), window.clearTimeout(this.holdTimer), this.holdActive = !1, this.pendingDimmerPointer = !1, this.isDimming = !1);
  }
  handleIconClick(t) {
    !this.hasDimmer && !this.hasLightControls || (t.preventDefault(), t.stopPropagation(), this.performAction(this.config.tap_action));
  }
  renderControlTabs() {
    const t = this.controlModes;
    return t.length <= 1 ? h : s`
      <span class="mode-tabs" aria-label="Light control modes">
        ${t.map(
      (e) => s`
            <button
              type="button"
              class="mode-tab ${e === this.activeControlMode ? "active" : ""}"
              @click=${(i) => this.handleControlModeClick(i, e)}
            >
              ${pe[e]}
            </button>
          `
    )}
      </span>
    `;
  }
  renderColorControls() {
    return s`
      <span class="swatches" aria-label="Color presets">
        ${this.colorPresets.filter((t) => Array.isArray(t.rgb_color)).map(
      (t) => s`
              <button
                type="button"
                class="swatch ${this.isColorPresetActive(t) ? "active" : ""}"
                style="--swatch-color: ${this.rgbToCss(t.rgb_color ?? [255, 255, 255])}"
                aria-label=${`Set ${t.name}`}
                title=${t.name}
                @click=${(e) => this.handleColorPresetClick(e, t)}
              ></button>
            `
    )}
      </span>
    `;
  }
  renderTemperatureControls() {
    return s`
      <span class="swatches" aria-label="Color temperature presets">
        ${ge.map(
      (t) => s`
            <button
              type="button"
              class="swatch ${this.isTemperaturePresetActive(t) ? "active" : ""}"
              style="--swatch-color: ${this.kelvinToCss(
        t.color_temp_kelvin ?? 3e3
      )}"
              aria-label=${`Set ${t.name}`}
              title=${`${t.name} ${t.color_temp_kelvin}K`}
              @click=${(e) => this.handleTemperaturePresetClick(e, t)}
            ></button>
          `
    )}
      </span>
    `;
  }
  renderEffectControls() {
    var e;
    const t = String(((e = this.entity) == null ? void 0 : e.attributes.effect) || "");
    return s`
      <span class="effect-list" aria-label="Light effects">
        ${this.effectList.map(
      (i) => s`
            <button
              type="button"
              class="effect-chip ${i === t ? "active" : ""}"
              @click=${(r) => this.handleEffectClick(r, i)}
            >
              ${i}
            </button>
          `
    )}
      </span>
    `;
  }
  renderActiveControls() {
    switch (this.activeControlMode) {
      case "color":
        return this.renderColorControls();
      case "temperature":
        return this.renderTemperatureControls();
      case "effect":
        return this.renderEffectControls();
      default:
        return h;
    }
  }
  renderCompactButton() {
    return s`
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
        <span
          class="icon-shell"
          @pointerdown=${this.handleIconPointerDown}
          @click=${this.handleIconClick}
        >
          <ha-icon icon=${this.icon}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName}</span>
          ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
        </span>
      </button>
    `;
  }
  renderLightPanel() {
    return s`
      <div
        class="button panel ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="panel-header">
          <button
            type="button"
            class="icon-shell"
            aria-label=${`${this.isOn ? "Turn off" : "Turn on"} ${this.displayName}`}
            @click=${this.handleIconClick}
          >
            <ha-icon icon=${this.icon}></ha-icon>
          </button>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="level">${this.activeBrightnessPercent}%</span>
        </span>
        ${this.hasDimmer ? s`
              <button
                type="button"
                class="brightness-control"
                aria-label=${`Set ${this.displayName} brightness`}
                @click=${(t) => t.stopPropagation()}
                @pointerdown=${this.handlePointerDown}
                @pointermove=${this.handlePointerMove}
                @pointerup=${this.handlePointerUp}
                @pointercancel=${this.handlePointerCancel}
              >
                <span class="brightness-fill"></span>
              </button>
            ` : h}
        ${this.renderControlTabs()}
        <span class="control-panel">${this.renderActiveControls()}</span>
      </div>
    `;
  }
  render() {
    if (!this.config)
      return s``;
    const t = this.stateColor, e = this.isOn ? "1" : "0", i = this.hasDimmer ? `${this.activeBrightnessPercent}%` : "0%", r = this.hasDimmer && this.activeBrightnessPercent > 0 ? "1" : "0", o = this.hasDimmer && this.activeBrightnessPercent > 5 ? "1" : "0";
    return s`
      <ha-card
        style="
          --glow-state-color: ${t};
          --glow-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #ffd26a)" : t};
          --glow-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 82%, #ff4f00)" : t};
          --glow-border-color: ${t};
          --glow-icon-color: ${t};
          --glow-on-opacity: ${e};
          --glow-border-strength: ${this.isOn ? "26%" : "18%"};
          --glow-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --glow-inner-ring-strength: ${this.isOn ? "8%" : "0%"};
          --glow-outer-blur: ${this.isOn ? "50px" : "0"};
          --glow-outer-strength: ${this.isOn ? "10%" : "0%"};
          --glow-slider-percent: ${i};
          --glow-slider-opacity: ${r};
          --glow-slider-handle-opacity: ${o};
        "
      >
        ${this.hasLightControls ? this.renderLightPanel() : this.renderCompactButton()}
      </ha-card>
    `;
  }
};
st.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  dimmingPercent: { state: !0 },
  controlMode: { state: !0 },
  optimisticOn: { state: !0 },
  optimisticBrightnessPercent: { state: !0 }
};
let W = st;
customElements.get("glow-light-card") || customElements.define("glow-light-card", W);
const at = class at extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, fe(this, e);
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
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
    return s`
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
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Bar Lights")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Has Dimmer", "has_dimmer", !1)}
            ${this.renderSwitch("Light Controls", "show_light_controls", !1)}
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
      de,
      "state"
    )}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
            ${this.renderSwitch("Color Presets", "show_color_presets", !0)}
            ${this.renderSwitch("Color Temp", "show_color_temp", !0)}
            ${this.renderSwitch("Effects", "show_effects", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", Ot, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Ot,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
at.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let q = at;
customElements.get("glow-light-card-editor") || customElements.define("glow-light-card-editor", q);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-light-card",
  name: "Glow Light Card",
  description: "A compact glowing light card for Home Assistant."
});
const Et = {
  icon: "mdi:toggle-switch",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  show_state: !0,
  on_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, Mt = ["toggle", "more-info", "none"];
function me(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const lt = class lt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return f`
      :host {
        --switch-card-width: 260px;
        --switch-card-height: 56px;
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
        grid-template-columns: 46px minmax(0, 1fr);
        min-height: var(--switch-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
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
          color-mix(in srgb, var(--switch-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--switch-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--switch-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--switch-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--switch-state-color) 8%, transparent);
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
          color-mix(in srgb, var(--switch-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--switch-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--switch-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--switch-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--switch-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--switch-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
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
        background: color-mix(in srgb, var(--switch-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--switch-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--switch-state-color) 28%, transparent);
        height: 8px;
        opacity: var(--switch-dot-opacity);
        position: absolute;
        right: 16px;
        top: calc(50% - 4px);
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
      ...Et,
      ...t
    }, this.style.setProperty(
      "--switch-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--switch-card-height", this.config.height ?? "56px"), this.style.setProperty(
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
  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12
    };
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
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || Et.icon;
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
      return s``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return s`
      <ha-card
        style="
          --switch-state-color: ${t};
          --switch-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --switch-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --switch-on-opacity: ${e};
          --switch-dot-opacity: ${this.isOn ? "1" : "0.26"};
          --switch-border-strength: ${this.isOn ? "26%" : "18%"};
          --switch-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --switch-inner-ring-strength: ${this.isOn ? "8%" : "0%"};
          --switch-outer-blur: ${this.isOn ? "50px" : "0"};
          --switch-outer-strength: ${this.isOn ? "10%" : "0%"};
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
lt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticOn: { state: !0 }
};
let K = lt;
customElements.get("glow-switch-card") || customElements.define("glow-switch-card", K);
const ct = class ct extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, me(this, e);
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
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
    return s`
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
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Coffee Maker")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
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
            ${this.renderSelect("Tap Action", "tap_action", Mt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Mt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
ct.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let G = ct;
customElements.get("glow-switch-card-editor") || customElements.define("glow-switch-card-editor", G);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-switch-card",
  name: "Glow Switch Card",
  description: "A compact glowing switch card for Home Assistant."
});
const be = {
  locked_icon: "mdi:lock",
  unlocked_icon: "mdi:lock-open-variant",
  jammed_icon: "mdi:lock-alert",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  show_state: !0,
  locked_color: "#45d158",
  unlocked_color: "#ff3b30",
  pending_color: "#ff8a1c",
  jammed_color: "#ff3b30",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, It = ["toggle", "lock", "unlock", "more-info", "none"];
function xe(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const ht = class ht extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return f`
      :host {
        --lock-card-width: 260px;
        --lock-card-height: 56px;
        --lock-card-radius: 999px;
        --lock-locked-color: #45d158;
        --lock-unlocked-color: #ff3b30;
        --lock-pending-color: #ff8a1c;
        --lock-jammed-color: #ff3b30;
        --lock-off-color: #697382;
        --lock-background: #101722;

        display: block;
        max-width: var(--lock-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .lock-button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--lock-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--lock-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--lock-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--lock-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--lock-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--lock-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--lock-state-color) var(--lock-border-strength),
            transparent
          );
        border-radius: var(--lock-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--lock-inner-ring-width)
            color-mix(
              in srgb,
              var(--lock-state-color) var(--lock-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--lock-outer-blur)
            color-mix(
              in srgb,
              var(--lock-state-color) var(--lock-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 46px minmax(0, 1fr);
        min-height: var(--lock-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .lock-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--lock-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--lock-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--lock-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--lock-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--lock-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .lock-button::after {
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--lock-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--lock-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--lock-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--lock-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--lock-glow-opacity);
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
          color-mix(in srgb, var(--lock-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--lock-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--lock-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--lock-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--lock-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--lock-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--lock-glow-opacity);
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
            color-mix(in srgb, var(--lock-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--lock-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--lock-state-color);
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
        background: color-mix(in srgb, var(--lock-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--lock-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--lock-state-color) 28%, transparent);
        height: 8px;
        opacity: var(--lock-dot-opacity);
        position: absolute;
        right: 16px;
        top: calc(50% - 4px);
        width: 8px;
      }

      .lock-button:focus-visible {
        outline: 2px solid var(--lock-state-color);
        outline-offset: 3px;
      }

      .lock-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .lock-button.active.animated::after {
        animation: lock-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes lock-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lock-button.active.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-lock-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter((r) => r.startsWith("lock."));
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...be,
      ...t
    }, this.style.setProperty(
      "--lock-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--lock-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--lock-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--lock-locked-color", this.config.locked_color ?? "#45d158"), this.style.setProperty("--lock-unlocked-color", this.config.unlocked_color ?? "#ff3b30"), this.style.setProperty("--lock-pending-color", this.config.pending_color ?? "#ff8a1c"), this.style.setProperty("--lock-jammed-color", this.config.jammed_color ?? "#ff3b30"), this.style.setProperty("--lock-off-color", this.config.off_color ?? "#697382"), this.style.setProperty("--lock-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get isJammed() {
    var t;
    return ((t = this.entity) == null ? void 0 : t.state) === "jammed";
  }
  get effectiveState() {
    var t;
    return this.optimisticState ?? ((t = this.entity) == null ? void 0 : t.state);
  }
  get isPending() {
    return this.effectiveState === "locking" || this.effectiveState === "unlocking";
  }
  get isLocked() {
    return this.optimisticLocked !== void 0 ? this.optimisticLocked : this.effectiveState === "locked" || this.effectiveState === "locking";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    if (this.isUnavailable)
      return "Unavailable";
    const t = this.effectiveState;
    return t === "locking" ? "Locking" : t === "unlocking" ? "Unlocking" : t === "jammed" ? "Jammed" : t === "locked" ? "Locked" : "Unlocked";
  }
  get icon() {
    return this.config.icon ? this.config.icon : this.isJammed ? this.config.jammed_icon ?? "mdi:lock-alert" : this.isLocked ? this.config.locked_icon ?? "mdi:lock" : this.config.unlocked_icon ?? "mdi:lock-open-variant";
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
  setOptimisticLockState(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticLocked = t, this.optimisticState = t ? "locking" : "unlocking", this.optimisticTimer = window.setTimeout(() => {
      this.clearOptimisticLocked();
    }, 8e3);
  }
  clearOptimisticLocked() {
    window.clearTimeout(this.optimisticTimer), this.optimisticLocked = void 0, this.optimisticState = void 0;
  }
  updated() {
    var t, e;
    if (this.optimisticState === "locking" && ((t = this.entity) == null ? void 0 : t.state) === "locked") {
      this.clearOptimisticLocked();
      return;
    }
    this.optimisticState === "unlocking" && ((e = this.entity) == null ? void 0 : e.state) === "unlocked" && this.clearOptimisticLocked();
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticLocked());
  }
  callLockService(t) {
    var e;
    this.setOptimisticLockState(t), this.trackServiceResult(
      (e = this.hass) == null ? void 0 : e.callService("lock", t ? "lock" : "unlock", {
        entity_id: this.config.entity
      })
    );
  }
  performAction(t) {
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      if (t === "lock") {
        this.callLockService(!0);
        return;
      }
      if (t === "unlock") {
        this.callLockService(!1);
        return;
      }
      this.callLockService(!this.isLocked);
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
      return s``;
    const t = this.isUnavailable ? this.config.off_color ?? "#697382" : this.isJammed ? this.config.jammed_color ?? "#ff3b30" : this.isPending ? this.config.pending_color ?? "#ff8a1c" : this.isLocked ? this.config.locked_color ?? "#45d158" : this.config.unlocked_color ?? "#ff3b30", e = this.isUnavailable ? "0" : "1", i = this.isPending ? "pending" : this.isLocked ? "locked" : this.isJammed ? "jammed" : "unlocked";
    return s`
      <ha-card
        style="
          --lock-state-color: ${t};
          --lock-warm-color: ${this.isLocked ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : "color-mix(in srgb, " + t + " 86%, #ffd26a)"};
          --lock-hot-color: ${this.isLocked ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : "color-mix(in srgb, " + t + " 80%, #ff4f00)"};
          --lock-glow-opacity: ${e};
          --lock-dot-opacity: ${this.isUnavailable ? "0.26" : "1"};
          --lock-border-strength: ${this.isUnavailable ? "18%" : "26%"};
          --lock-inner-ring-width: ${this.isUnavailable ? "0px" : "1px"};
          --lock-inner-ring-strength: ${this.isUnavailable ? "0%" : "8%"};
          --lock-outer-blur: ${this.isUnavailable ? "0" : "50px"};
          --lock-outer-strength: ${this.isUnavailable ? "0%" : "10%"};
        "
      >
        <button
          type="button"
          class="lock-button active ${i} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
ht.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLocked: { state: !0 },
  optimisticState: { state: !0 }
};
let J = ht;
customElements.get("glow-lock-card") || customElements.define("glow-lock-card", J);
const dt = class dt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, xe(this, e);
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
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "lock" } }
      }
    ], e = {
      entity: "Lock Entity"
    };
    return s`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  renderTextInput(t, e, i = "") {
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Front Door")}
            ${this.renderIconPicker("Icon Override", "icon")}
            ${this.renderIconPicker("Locked Icon", "locked_icon")}
            ${this.renderIconPicker("Unlocked Icon", "unlocked_icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Locked Color", "locked_color", "#45d158")}
            ${this.renderTextInput("Unlocked Color", "unlocked_color", "#ff3b30")}
            ${this.renderTextInput("Pending Color", "pending_color", "#ff8a1c")}
            ${this.renderTextInput("Jammed Color", "jammed_color", "#ff3b30")}
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
            ${this.renderSelect("Tap Action", "tap_action", It, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      It,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
dt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Y = dt;
customElements.get("glow-lock-card-editor") || customElements.define("glow-lock-card-editor", Y);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-lock-card",
  name: "Glow Lock Card",
  description: "A compact smart lock card with instant locked and unlocked states."
});
const ve = {
  icon: "mdi:thermostat",
  width: "320px",
  fill_container: !1,
  border_radius: "18px",
  show_state: !1,
  show_current: !0,
  show_controls: !0,
  show_mode_buttons: !0,
  show_features: !1,
  show_hvac_modes: !0,
  show_fan_modes: !0,
  show_swing_modes: !0,
  show_horizontal_swing_modes: !0,
  temperature_step: 1,
  heat_color: "#ff8a1c",
  cool_color: "#2f80ff",
  idle_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "more-info",
  hold_action: "more-info",
  animated: !0
}, Ut = ["more-info", "none"], zt = {
  auto: "Auto",
  cool: "Cool",
  dry: "Dry",
  fan_only: "Fan",
  heat: "Heat",
  heat_cool: "Auto",
  off: "Off"
};
function we(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function L(n, t) {
  if (typeof n == "number" && Number.isFinite(n))
    return n;
  if (typeof n == "string") {
    const e = Number(n);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
function ye(n, t, e) {
  const i = (n == null ? void 0 : n.trim()) || t, r = /^(\d+(?:\.\d+)?)px$/.exec(i);
  return r ? `${Math.max(e, Number(r[1]))}px` : i === "auto" || i === "initial" || i === "inherit" ? t : `max(${e}px, ${i})`;
}
const pt = class pt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledControlPointer = !1;
  }
  static get styles() {
    return f`
      :host {
        --thermostat-card-width: 320px;
        --thermostat-card-height: auto;
        --thermostat-card-radius: 18px;
        --thermostat-heat-color: #ff8a1c;
        --thermostat-cool-color: #2f80ff;
        --thermostat-idle-color: #45d158;
        --thermostat-off-color: #697382;
        --thermostat-background: #101722;
        --thermostat-dial-size: 188px;

        display: block;
        height: var(--thermostat-card-height);
        max-width: var(--thermostat-card-width);
        min-height: 0;
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        height: var(--thermostat-card-height);
        min-height: 0;
        overflow: visible;
      }

      .thermostat {
        --thermostat-dial-size: clamp(180px, 66cqi, 214px);

        align-items: stretch;
        background:
          radial-gradient(circle at 50% 34%, color-mix(in srgb, var(--thermostat-state-color) 18%, transparent), transparent 42%),
          radial-gradient(circle at 12% 12%, rgb(255 255 255 / 7%), transparent 36%),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--thermostat-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--thermostat-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--thermostat-state-color) var(--thermostat-border-strength),
            transparent
          );
        border-radius: var(--thermostat-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--thermostat-inner-ring-width)
            color-mix(
              in srgb,
              var(--thermostat-state-color) var(--thermostat-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--thermostat-outer-blur)
            color-mix(
              in srgb,
              var(--thermostat-state-color) var(--thermostat-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        container-type: inline-size;
        display: grid;
        align-content: start;
        gap: 10px;
        grid-template-rows: auto auto auto auto;
        height: var(--thermostat-card-height);
        min-height: 0;
        overflow: hidden;
        padding: 22px 18px 18px;
        position: relative;
        text-align: center;
        width: 100%;
      }

      .thermostat.features-visible {
        --thermostat-dial-size: clamp(164px, 54cqi, 190px);

        gap: 8px;
        padding: 20px 18px 16px;
      }

      .thermostat::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--thermostat-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--thermostat-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--thermostat-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--thermostat-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--thermostat-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .thermostat::after {
        border: 1px solid
          color-mix(in srgb, var(--thermostat-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--thermostat-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--thermostat-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--thermostat-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--thermostat-glow-opacity);
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
          color-mix(in srgb, var(--thermostat-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--thermostat-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--thermostat-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--thermostat-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--thermostat-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 0;
      }

      .header,
      .dial,
      .controls,
      .mode-controls,
      .features {
        position: relative;
        z-index: 2;
      }

      .header {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        justify-content: center;
        min-height: 30px;
        text-align: center;
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

      .dial {
        align-self: center;
        aspect-ratio: 1;
        background:
          radial-gradient(
            circle at 50% 44%,
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
            transparent 52%
          ),
          radial-gradient(circle at center, color-mix(in srgb, var(--thermostat-background) 94%, #ffffff 5%) 0 52%, transparent 53%),
          conic-gradient(
            from 215deg,
            color-mix(in srgb, var(--thermostat-state-color) 96%, #ffffff 12%) 0deg,
            var(--thermostat-state-color)
              calc(var(--thermostat-arc-degrees) * 0.72),
            color-mix(in srgb, var(--thermostat-state-color) 72%, #000000 16%)
              var(--thermostat-arc-degrees),
            rgb(255 255 255 / 11%) var(--thermostat-arc-degrees) 290deg,
            transparent 290deg 360deg
          );
        border-radius: 999px;
        box-shadow:
          inset 0 0 0 1px rgb(255 255 255 / 7%),
          inset 0 12px 26px rgb(255 255 255 / 5%),
          0 0 34px color-mix(in srgb, var(--thermostat-state-color) 18%, transparent);
        block-size: var(--thermostat-dial-size);
        display: grid;
        justify-self: center;
        inline-size: var(--thermostat-dial-size);
        min-block-size: 0;
        min-inline-size: 0;
        place-items: center;
        position: relative;
      }

      .dial::before {
        background:
          radial-gradient(
            circle at 50% 32%,
            color-mix(in srgb, var(--thermostat-state-color) 24%, transparent),
            transparent 58%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--thermostat-background) 84%, #ffffff 10%),
            color-mix(in srgb, var(--thermostat-background) 88%, #000000 24%)
          );
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: inherit;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          inset 0 -16px 28px rgb(0 0 0 / 15%);
        content: '';
        inset: 21%;
        position: absolute;
        z-index: 1;
      }

      .dial-center {
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;
      }

      .mode {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13px;
        font-weight: 650;
        line-height: 1.1;
        margin-bottom: 9px;
      }

      .target {
        align-items: flex-start;
        color: var(--primary-text-color, #f4f7fb);
        display: inline-flex;
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
      }

      .unit {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 17px;
        font-weight: 650;
        line-height: 1;
        margin-left: 2px;
        padding-top: 5px;
      }

      .current {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.2;
        margin-top: 7px;
        white-space: nowrap;
      }

      .controls {
        align-self: end;
        background: transparent;
        border: 0;
        border-radius: 0;
        display: inline-grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding: 0;
        width: 100%;
      }

      .control {
        align-items: center;
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 17px;
        font-weight: 650;
        height: 33px;
        justify-content: center;
        letter-spacing: 0;
        padding: 0;
        width: 100%;
      }

      .control:active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 22%, #ffffff 3%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .mode-controls {
        align-self: end;
        background: rgb(0 0 0 / 18%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
        display: grid;
        gap: 2px;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);
        min-height: 30px;
        overflow: hidden;
        padding: 2px;
        width: 100%;
      }

      .mode-button {
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
        justify-content: center;
        letter-spacing: 0;
        line-height: 1;
        min-width: 0;
        padding: 0 8px;
        text-transform: none;
        white-space: nowrap;
      }

      .mode-button.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 26%, transparent),
            transparent 86%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 28%, #ffffff 4%);
        color: var(--primary-text-color, #f4f7fb);
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 9%);
      }

      .mode-button:disabled {
        cursor: default;
        opacity: 0.45;
      }

      .features,
      .feature-group {
        align-self: end;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: stretch;
        overflow: visible;
        padding: 0;
        width: 100%;
      }

      .feature-button,
      .feature-status {
        align-items: center;
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        box-sizing: border-box;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
        color: var(--primary-text-color, #f4f7fb);
        display: grid;
        flex: 1 1 118px;
        gap: 6px;
        grid-template-columns: 18px minmax(0, 1fr) auto;
        justify-content: center;
        justify-items: stretch;
        min-height: 32px;
        min-width: 0;
        padding: 0 10px;
        text-align: left;
      }

      .feature-button {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .feature-button.on {
        background:
          radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--thermostat-state-color) 20%, transparent), transparent 62%),
          color-mix(in srgb, var(--thermostat-state-color) 14%, transparent);
      }

      .feature-button.problem,
      .feature-status.problem {
        border-color: color-mix(in srgb, #ff3b30 50%, transparent);
        color: #ffb3ad;
      }

      .feature-button.unavailable,
      .feature-status.unavailable {
        opacity: 0.55;
      }

      .feature-icon {
        flex: 0 0 auto;
        --mdc-icon-size: 18px;
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        color: color-mix(in srgb, var(--thermostat-state-color) 58%, #ffffff 42%);
        filter: drop-shadow(0 0 8px color-mix(in srgb, var(--thermostat-state-color) 18%, transparent));
        font-size: 18px;
        height: 18px;
        justify-self: center;
        line-height: 18px;
        padding: 0;
        transition:
          transform 140ms ease;
        width: 18px;
      }

      .feature-button.on .feature-icon {
        background: transparent;
        border: 0;
        box-shadow: none;
        color: #ffffff;
        filter: drop-shadow(0 0 12px color-mix(in srgb, var(--thermostat-state-color) 42%, transparent));
      }

      .feature-button:active .feature-icon {
        transform: scale(0.94);
      }

      .feature-text {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .feature-label {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .feature-value {
        color: color-mix(in srgb, var(--secondary-text-color, #b7c0ce) 88%, transparent);
        font-size: 10px;
        font-weight: 650;
        justify-self: end;
        line-height: 1;
        max-width: 56px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .thermostat:focus-visible,
      .control:focus-visible,
      .mode-button:focus-visible,
      .feature-button:focus-visible {
        outline: 2px solid var(--thermostat-state-color);
        outline-offset: 3px;
      }

      .thermostat.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .thermostat.active.animated::after {
        animation: thermostat-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes thermostat-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .thermostat.active.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-thermostat-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("climate.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...ve,
      ...t,
      temperature_step: L(t.temperature_step, 1)
    }, this.style.setProperty(
      "--thermostat-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--thermostat-card-height",
      ye(t.height, "auto", 0)
    ), this.style.setProperty(
      "--thermostat-card-radius",
      this.config.border_radius ?? "18px"
    ), this.style.setProperty("--thermostat-heat-color", this.config.heat_color ?? "#ff8a1c"), this.style.setProperty("--thermostat-cool-color", this.config.cool_color ?? "#2f80ff"), this.style.setProperty("--thermostat-idle-color", this.config.idle_color ?? "#45d158"), this.style.setProperty("--thermostat-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--thermostat-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.hasVisibleFeatureControls ? 7 : 6;
  }
  getGridOptions() {
    const t = this.hasVisibleFeatureControls;
    return {
      rows: t ? 7 : 5,
      columns: 6,
      min_rows: t ? 6 : 4,
      max_rows: 9,
      min_columns: 4,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  getFeatureEntity(t) {
    var e;
    if (t)
      return (e = this.hass) == null ? void 0 : e.states[t];
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get isOff() {
    return this.hvacMode === "off";
  }
  get hvacMode() {
    var t;
    return this.optimisticMode ?? String(((t = this.entity) == null ? void 0 : t.state) || "off");
  }
  get hvacAction() {
    var t;
    return String(((t = this.entity) == null ? void 0 : t.attributes.hvac_action) || this.hvacMode || "idle");
  }
  get isCooling() {
    return this.hvacAction === "cooling" || this.hvacMode === "cool";
  }
  get isHeating() {
    return this.hvacAction === "heating" || this.hvacMode === "heat";
  }
  get availableModes() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.hvac_modes;
    return Array.isArray(t) ? t.filter((i) => typeof i == "string").filter((i, r, o) => o.indexOf(i) === r) : [];
  }
  get unit() {
    var t;
    return String(((t = this.entity) == null ? void 0 : t.attributes.temperature_unit) || "°");
  }
  get currentTemperature() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.current_temperature;
    return typeof t == "number" ? t : void 0;
  }
  get minTemperature() {
    var t;
    return L((t = this.entity) == null ? void 0 : t.attributes.min_temp, 55);
  }
  get maxTemperature() {
    var t;
    return L((t = this.entity) == null ? void 0 : t.attributes.max_temp, 85);
  }
  get targetTemperature() {
    var r, o, a;
    if (this.optimisticTemperature !== void 0)
      return this.optimisticTemperature;
    const t = (r = this.entity) == null ? void 0 : r.attributes.temperature;
    if (typeof t == "number")
      return t;
    const e = (o = this.entity) == null ? void 0 : o.attributes.target_temp_low, i = (a = this.entity) == null ? void 0 : a.attributes.target_temp_high;
    return typeof e == "number" && typeof i == "number" ? Math.round((e + i) / 2 * 10) / 10 : this.currentTemperature ?? 72;
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOff ? "Off" : this.config.show_current && this.currentTemperature !== void 0 ? `${this.formatTemperature(this.currentTemperature)} now` : this.hvacAction;
  }
  get modeLabel() {
    return this.isUnavailable ? "Unavailable" : this.isOff ? "Off" : this.isCooling ? "Cool" : this.isHeating ? "Heat" : "Idle";
  }
  get currentLabel() {
    return this.currentTemperature === void 0 ? this.hvacAction : this.formatTemperature(this.currentTemperature);
  }
  get stateColor() {
    return this.isOff || this.isUnavailable ? this.config.off_color ?? "#697382" : this.isCooling ? this.config.cool_color ?? "#2f80ff" : this.isHeating ? this.config.heat_color ?? "#ff8a1c" : this.config.idle_color ?? "#45d158";
  }
  get hasConfiguredFeatures() {
    return !!(this.config.show_hvac_modes || this.config.show_fan_modes || this.config.show_swing_modes || this.config.show_horizontal_swing_modes || this.config.filter_entity || this.config.problem_entity || this.config.pm25_entity || this.config.display_light_entity || this.config.sleep_mode_entity || this.config.vertical_position_entity || this.config.horizontal_position_entity || this.config.anti_frost_switch_entity || this.config.anti_mildew_switch_entity || this.config.eco_switch_entity || this.config.health_switch_entity || this.config.soft_wind_switch_entity || this.config.sound_switch_entity);
  }
  get hasPrimaryModeButtons() {
    return !!this.config.show_mode_buttons && this.availableModes.length > 0;
  }
  get hasVisibleFeatureControls() {
    var e, i;
    if (!((e = this.config) != null && e.show_features) || !this.hasConfiguredFeatures)
      return !1;
    const t = ((i = this.entity) == null ? void 0 : i.attributes) ?? {};
    return this.config.show_hvac_modes && !this.hasPrimaryModeButtons && Array.isArray(t.hvac_modes) && t.hvac_modes.length > 0 || this.config.show_fan_modes && Array.isArray(t.fan_modes) && t.fan_modes.length > 0 || !this.hasPrimaryModeButtons ? !0 : !!(this.getFeatureEntity(this.config.eco_switch_entity) || this.getFeatureEntity(this.config.sleep_mode_entity) || this.getFeatureEntity(this.config.vertical_position_entity) || this.getFeatureEntity(this.config.horizontal_position_entity) || this.getFeatureEntity(this.config.filter_entity) || this.getFeatureEntity(this.config.problem_entity) || this.getFeatureEntity(this.config.pm25_entity) || this.getFeatureEntity(this.config.display_light_entity) || this.getFeatureEntity(this.config.anti_frost_switch_entity) || this.getFeatureEntity(this.config.anti_mildew_switch_entity) || this.getFeatureEntity(this.config.health_switch_entity) || this.getFeatureEntity(this.config.soft_wind_switch_entity) || this.getFeatureEntity(this.config.sound_switch_entity));
  }
  formatTemperature(t) {
    return `${Math.round(t * 10) / 10}${this.unit}`;
  }
  formatTemperatureValue(t) {
    return `${Math.round(t * 10) / 10}`;
  }
  get arcDegrees() {
    const t = this.minTemperature, e = this.maxTemperature, i = Math.max(1, e - t), r = Math.max(0, Math.min(1, (this.targetTemperature - t) / i));
    return Math.round(24 + r * 266);
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
  setOptimisticTemperature(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticTemperature = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticTemperature = void 0;
    }, 8e3);
  }
  clearOptimisticTemperature() {
    window.clearTimeout(this.optimisticTimer), this.optimisticTemperature = void 0;
  }
  setOptimisticMode(t) {
    window.clearTimeout(this.optimisticModeTimer), this.optimisticMode = t, this.optimisticModeTimer = window.setTimeout(() => {
      this.optimisticMode = void 0;
    }, 8e3);
  }
  clearOptimisticMode() {
    window.clearTimeout(this.optimisticModeTimer), this.optimisticMode = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticTemperature());
  }
  updated() {
    var e, i;
    const t = (e = this.entity) == null ? void 0 : e.attributes.temperature;
    this.optimisticTemperature !== void 0 && typeof t == "number" && Math.abs(t - this.optimisticTemperature) < 0.1 && this.clearOptimisticTemperature(), this.optimisticMode !== void 0 && ((i = this.entity) == null ? void 0 : i.state) === this.optimisticMode && this.clearOptimisticMode();
  }
  setTargetTemperature(t) {
    var o;
    if (this.isUnavailable || this.isOff)
      return;
    const e = this.minTemperature, i = this.maxTemperature, r = Math.min(i, Math.max(e, t));
    this.setOptimisticTemperature(r), this.trackServiceResult(
      (o = this.hass) == null ? void 0 : o.callService("climate", "set_temperature", {
        entity_id: this.config.entity,
        temperature: r
      })
    );
  }
  adjustTemperature(t) {
    const e = L(this.config.temperature_step, 1);
    this.setTargetTemperature(this.targetTemperature + t * e);
  }
  setHvacMode(t) {
    var i;
    if (this.isUnavailable || t === this.hvacMode)
      return;
    this.setOptimisticMode(t);
    const e = (i = this.hass) == null ? void 0 : i.callService("climate", "set_hvac_mode", {
      entity_id: this.config.entity,
      hvac_mode: t
    });
    e && typeof e.catch == "function" && e.catch(() => this.clearOptimisticMode());
  }
  performAction(t) {
    this.isUnavailable || !t || t === "none" || this.dispatchMoreInfo();
  }
  setClimateMode(t, e, i) {
    var r;
    this.isUnavailable || !i || (r = this.hass) == null || r.callService("climate", e, {
      entity_id: this.config.entity,
      [t]: i
    });
  }
  toggleFeatureEntity(t) {
    var r;
    const e = this.getFeatureEntity(t);
    if (!e || ["unavailable", "unknown"].includes(e.state))
      return;
    const [i] = e.entity_id.split(".");
    (r = this.hass) == null || r.callService(i, "toggle", {
      entity_id: e.entity_id
    });
  }
  selectFeatureOption(t, e) {
    var r;
    const i = this.getFeatureEntity(t);
    !i || ["unavailable", "unknown"].includes(i.state) || !e || (r = this.hass) == null || r.callService("select", "select_option", {
      entity_id: i.entity_id,
      option: e
    });
  }
  nextOption(t, e) {
    if (!Array.isArray(t) || t.length === 0)
      return;
    const i = t.map((o) => String(o)), r = Math.max(0, i.indexOf(e ?? i[0]));
    return i[(r + 1) % i.length];
  }
  renderOffFeature() {
    var e;
    const t = ((e = this.entity) == null ? void 0 : e.state) === "off";
    return s`
      <button
        class="feature-button ${t ? "" : "on"}"
        ?disabled=${this.isUnavailable}
        title="Off"
        aria-label="Turn thermostat off"
        @click=${(i) => {
      i.stopPropagation(), this.setClimateMode("hvac_mode", "set_hvac_mode", "off");
    }}
      >
        <ha-icon class="feature-icon" .icon=${"mdi:power"}></ha-icon>
        <span class="feature-label">Off</span>
        <span class="feature-value">${t ? "off" : "tap"}</span>
      </button>
    `;
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
  handleControlPointerDown(t, e) {
    t.stopPropagation(), this.handledControlPointer = !0, window.setTimeout(() => {
      this.handledControlPointer = !1;
    }, 500), this.adjustTemperature(e);
  }
  handleControlClick(t, e) {
    if (t.stopPropagation(), this.handledControlPointer) {
      this.handledControlPointer = !1;
      return;
    }
    this.adjustTemperature(e);
  }
  handleModeClick(t, e) {
    t.stopPropagation(), this.setHvacMode(e);
  }
  renderClimateSelect(t, e, i, r, o, a) {
    if (!Array.isArray(r) || r.length === 0)
      return h;
    const l = i ?? String(r[0]);
    return s`
      <button
        class="feature-button ${l !== "off" ? "on" : ""}"
        ?disabled=${this.isUnavailable}
        title=${`${t}: ${l}`}
        aria-label=${`${t}: ${l}. Tap to change.`}
        @click=${(c) => {
      c.stopPropagation();
      const d = this.nextOption(r, l);
      d && this.setClimateMode(a, o, d);
    }}
      >
        <ha-icon class="feature-icon" .icon=${e}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${l}</span>
      </button>
    `;
  }
  renderSelectEntity(t, e, i) {
    const r = this.getFeatureEntity(i);
    return !r || !Array.isArray(r.attributes.options) ? h : s`
      <button
        class="feature-button ${r.state !== "Off" && r.state !== "off" && r.state !== "Unknown" ? "on" : ""}"
        ?disabled=${["unavailable", "unknown"].includes(r.state)}
        title=${`${t}: ${r.state}`}
        aria-label=${`${t}: ${r.state}. Tap to change.`}
        @click=${(o) => {
      o.stopPropagation();
      const a = this.nextOption(r.attributes.options, r.state);
      a && this.selectFeatureOption(r.entity_id, a);
    }}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || e}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${r.state}</span>
      </button>
    `;
  }
  renderToggleFeature(t, e, i) {
    const r = this.getFeatureEntity(e);
    if (!r)
      return h;
    const o = ["unavailable", "unknown"].includes(r.state), a = r.state === "on", l = r.attributes.device_class === "problem" && r.state === "on";
    return s`
      <button
        class="feature-button ${a ? "on" : ""} ${l ? "problem" : ""} ${o ? "unavailable" : ""}"
        ?disabled=${o || r.entity_id.startsWith("binary_sensor.")}
        title=${`${t}: ${r.state}`}
        aria-label=${`${t}: ${r.state}`}
        @click=${(c) => {
      c.stopPropagation(), this.toggleFeatureEntity(r.entity_id);
    }}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || i}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${a ? "on" : "off"}</span>
      </button>
    `;
  }
  renderSensorFeature(t, e, i) {
    const r = this.getFeatureEntity(e);
    if (!r)
      return h;
    const o = ["unavailable", "unknown"].includes(r.state), a = r.attributes.device_class === "problem" && r.state === "on", l = r.attributes.unit_of_measurement ? ` ${r.attributes.unit_of_measurement}` : "";
    return s`
      <span
        class="feature-status ${a ? "problem" : ""} ${o ? "unavailable" : ""}"
        title=${`${t}: ${r.state}${l}`}
        aria-label=${`${t}: ${r.state}${l}`}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || i}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${r.state}${l}</span>
      </span>
    `;
  }
  renderFeatures() {
    var o, a;
    if (!this.config.show_features || !this.hasConfiguredFeatures)
      return h;
    const t = ((o = this.entity) == null ? void 0 : o.attributes) ?? {}, e = this.hasPrimaryModeButtons, i = [], r = (l) => {
      l !== h && i.length < 4 && i.push(l);
    };
    return this.config.show_hvac_modes && !e && r(
      this.renderClimateSelect(
        "Mode",
        "mdi:tune-variant",
        (a = this.entity) == null ? void 0 : a.state,
        t.hvac_modes,
        "set_hvac_mode",
        "hvac_mode"
      )
    ), this.config.show_fan_modes && r(
      this.renderClimateSelect(
        "Fan",
        "mdi:fan",
        String(t.fan_mode || ""),
        t.fan_modes,
        "set_fan_mode",
        "fan_mode"
      )
    ), r(this.renderToggleFeature("Eco", this.config.eco_switch_entity, "mdi:leaf")), e || r(this.renderOffFeature()), r(
      this.renderSelectEntity(
        "Sleep",
        "mdi:weather-night",
        this.config.sleep_mode_entity
      )
    ), r(
      this.renderSelectEntity(
        "Vertical",
        "mdi:unfold-more-horizontal",
        this.config.vertical_position_entity
      )
    ), r(
      this.renderSelectEntity(
        "Horizontal",
        "mdi:unfold-more-vertical",
        this.config.horizontal_position_entity
      )
    ), r(this.renderSensorFeature("Filter", this.config.filter_entity, "mdi:air-filter")), r(this.renderSensorFeature("Problem", this.config.problem_entity, "mdi:alert-circle")), r(this.renderSensorFeature("PM2.5", this.config.pm25_entity, "mdi:blur")), r(
      this.renderToggleFeature("Display", this.config.display_light_entity, "mdi:monitor")
    ), r(
      this.renderToggleFeature(
        "Anti-frost",
        this.config.anti_frost_switch_entity,
        "mdi:snowflake-alert"
      )
    ), r(
      this.renderToggleFeature(
        "Anti-mildew",
        this.config.anti_mildew_switch_entity,
        "mdi:water-off-outline"
      )
    ), r(
      this.renderToggleFeature("Health", this.config.health_switch_entity, "mdi:heart-outline")
    ), r(
      this.renderToggleFeature(
        "Soft wind",
        this.config.soft_wind_switch_entity,
        "mdi:weather-windy"
      )
    ), r(this.renderToggleFeature("Sound", this.config.sound_switch_entity, "mdi:volume-high")), i.length === 0 ? h : s`<span class="features">${i}</span>`;
  }
  renderModeButtons() {
    const t = this.availableModes;
    return t.length ? s`
      <span class="mode-controls" aria-label="HVAC mode controls">
        ${t.map(
      (e) => s`
            <button
              class="mode-button ${e === this.hvacMode ? "active" : ""}"
              ?disabled=${this.isUnavailable}
              aria-label=${`Set mode to ${zt[e] ?? e}`}
              @click=${(i) => this.handleModeClick(i, e)}
            >
              ${zt[e] ?? e}
            </button>
          `
    )}
      </span>
    ` : h;
  }
  renderControls() {
    return s`
      <span class="controls" aria-label="Temperature controls">
        <button
          class="control"
          aria-label="Decrease temperature"
          @pointerdown=${(t) => this.handleControlPointerDown(t, -1)}
          @click=${(t) => this.handleControlClick(t, -1)}
        >
          -
        </button>
        <button
          class="control"
          aria-label="Increase temperature"
          @pointerdown=${(t) => this.handleControlPointerDown(t, 1)}
          @click=${(t) => this.handleControlClick(t, 1)}
        >
          +
        </button>
      </span>
    `;
  }
  render() {
    if (!this.config)
      return s``;
    const t = this.stateColor, e = !this.isOff && !this.isUnavailable, i = e ? "1" : "0", r = this.isCooling;
    return s`
      <ha-card
        style="
          --thermostat-state-color: ${t};
          --thermostat-warm-color: ${r ? "color-mix(in srgb, " + t + " 86%, #94d6ff)" : "color-mix(in srgb, " + t + " 86%, #ffd26a)"};
          --thermostat-hot-color: ${r ? "color-mix(in srgb, " + t + " 80%, #4fb3ff)" : "color-mix(in srgb, " + t + " 80%, #ff4f00)"};
          --thermostat-glow-opacity: ${i};
          --thermostat-border-strength: ${e ? "26%" : "18%"};
          --thermostat-inner-ring-width: ${e ? "1px" : "0px"};
          --thermostat-inner-ring-strength: ${e ? "8%" : "0%"};
          --thermostat-outer-blur: ${e ? "50px" : "0"};
          --thermostat-outer-strength: ${e ? "10%" : "0%"};
          --thermostat-arc-degrees: ${this.arcDegrees}deg;
        "
      >
        <div
          class="thermostat ${e ? "active" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.hasVisibleFeatureControls ? "features-visible" : ""} ${this.config.animated ? "animated" : ""}"
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
          <span class="header">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="dial">
            <span class="dial-center">
              <span class="mode">${this.modeLabel}</span>
              <span class="target">
                <span>${this.formatTemperatureValue(this.targetTemperature)}</span>
                <span class="unit">${this.unit}</span>
              </span>
              ${this.config.show_current ? s`<span class="current">${this.currentLabel}</span>` : h}
            </span>
          </span>
          ${this.config.show_controls ? this.renderControls() : h}
          ${this.config.show_mode_buttons ? this.renderModeButtons() : h}
          ${this.renderFeatures()}
        </div>
      </ha-card>
    `;
  }
};
pt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticMode: { state: !0 },
  optimisticTemperature: { state: !0 }
};
let X = pt;
customElements.get("glow-thermostat-card") || customElements.define("glow-thermostat-card", X);
const ut = class ut extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
      ha-selector,
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
    }), this.config = e, we(this, e);
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
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "climate" } }
      }
    ], e = {
      entity: "Climate Entity"
    };
    return s`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  renderTextInput(t, e, i = "") {
    return s`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderFeatureEntityPicker(t, e, i) {
    return s`
      <ha-selector
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: i } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderIconPicker(t, e) {
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Thermostat")}
            ${this.renderTextInput("Width", "width", "320px")}
            ${this.renderTextInput("Height", "height", "auto")}
            ${this.renderTextInput("Radius", "border_radius", "18px")}
            ${this.renderNumberInput("Temperature Step", "temperature_step", "1")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Show State", "show_state", !1)}
            ${this.renderSwitch("Show Current", "show_current", !0)}
            ${this.renderSwitch("Show Controls", "show_controls", !0)}
            ${this.renderSwitch("Show Mode Buttons", "show_mode_buttons", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Heat Color", "heat_color", "#ff8a1c")}
            ${this.renderTextInput("Cool Color", "cool_color", "#2f80ff")}
            ${this.renderTextInput("Idle Color", "idle_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Features</h3>
          <div class="grid">
            ${this.renderSwitch("Show Features", "show_features", !1)}
            ${this.renderSwitch("HVAC Modes", "show_hvac_modes", !0)}
            ${this.renderSwitch("Fan Modes", "show_fan_modes", !0)}
            ${this.renderSwitch("Vertical Swing", "show_swing_modes", !0)}
            ${this.renderSwitch(
      "Horizontal Swing",
      "show_horizontal_swing_modes",
      !0
    )}
          </div>
          <div class="grid">
            ${this.renderFeatureEntityPicker(
      "Filter Sensor",
      "filter_entity",
      "binary_sensor"
    )}
            ${this.renderFeatureEntityPicker(
      "Problem Sensor",
      "problem_entity",
      "binary_sensor"
    )}
            ${this.renderFeatureEntityPicker("PM2.5 Sensor", "pm25_entity", "sensor")}
            ${this.renderFeatureEntityPicker(
      "Display Light",
      "display_light_entity",
      "light"
    )}
            ${this.renderFeatureEntityPicker(
      "Sleep Mode",
      "sleep_mode_entity",
      "select"
    )}
            ${this.renderFeatureEntityPicker(
      "Vertical Position",
      "vertical_position_entity",
      "select"
    )}
            ${this.renderFeatureEntityPicker(
      "Horizontal Position",
      "horizontal_position_entity",
      "select"
    )}
            ${this.renderFeatureEntityPicker(
      "Anti-frost",
      "anti_frost_switch_entity",
      "switch"
    )}
            ${this.renderFeatureEntityPicker(
      "Anti-mildew",
      "anti_mildew_switch_entity",
      "switch"
    )}
            ${this.renderFeatureEntityPicker("Eco", "eco_switch_entity", "switch")}
            ${this.renderFeatureEntityPicker("Health", "health_switch_entity", "switch")}
            ${this.renderFeatureEntityPicker(
      "Soft Wind",
      "soft_wind_switch_entity",
      "switch"
    )}
            ${this.renderFeatureEntityPicker("Sound", "sound_switch_entity", "switch")}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", Ut, "more-info")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Ut,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
ut.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Z = ut;
customElements.get("glow-thermostat-card-editor") || customElements.define("glow-thermostat-card-editor", Z);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-thermostat-card",
  name: "Glow Thermostat Card",
  description: "A dial-style thermostat card with instant setpoint controls."
});
const Lt = {
  title: "Outlets",
  icon_1: "mdi:power-socket-us",
  icon_2: "mdi:power-socket-us",
  width: "320px",
  fill_container: !1,
  button_height: "54px",
  gap: "12px",
  layout: "duplex",
  show_title: !1,
  show_state: !0,
  on_color: "#ff3b30",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, Ft = ["toggle", "more-info", "none"], $e = ["duplex", "grid", "stack"];
function _e(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const gt = class gt extends g {
  constructor() {
    super(...arguments), this.optimisticTimers = {}, this.optimisticStates = {}, this.holdActive = !1;
  }
  static get styles() {
    return f`
      :host {
        --outlet-card-width: 540px;
        --outlet-button-height: 54px;
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
          color-mix(in srgb, var(--outlet-any-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--outlet-any-color) 10%, transparent),
          0 0 34px
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent);
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
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
          inset 0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
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
          color-mix(in srgb, var(--outlet-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--outlet-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--outlet-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--outlet-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--outlet-state-color) 8%, transparent);
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
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
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
      ...Lt,
      ...t
    }, this.style.setProperty(
      "--outlet-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--outlet-button-height",
      this.config.button_height ?? "54px"
    ), this.style.setProperty("--outlet-gap", this.config.gap ?? "12px"), this.style.setProperty("--outlet-on-color", this.config.on_color ?? "#ff3b30"), this.style.setProperty("--outlet-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--outlet-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return (this.config.layout === "grid" ? 2 : 3) + (this.config.show_title ? 1 : 0);
  }
  getGridOptions() {
    const e = (this.config.layout === "grid" ? 1 : this.outlets.length > 1 ? 2 : 1) + (this.config.show_title ? 1 : 0);
    return {
      rows: e,
      columns: 6,
      min_rows: e,
      max_rows: Math.max(e, 4),
      min_columns: 3,
      max_columns: 12
    };
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
    return t.icon || (e == null ? void 0 : e.attributes.icon) || Lt.icon_1;
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
    const e = this.getEntity(t.entityId), i = this.isOn(e, t.entityId), r = this.isUnavailable(e), o = i ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", a = i ? "1" : "0";
    return s`
      <button
        class="outlet ${i ? "on" : "off"} ${r ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${o};
          --outlet-warm-color: ${i ? "color-mix(in srgb, " + o + " 86%, #ff9a64)" : o};
          --outlet-hot-color: ${i ? "color-mix(in srgb, " + o + " 80%, #ff1d1d)" : o};
          --outlet-on-opacity: ${a};
          --outlet-border-strength: ${i ? "26%" : "18%"};
          --outlet-inner-ring-width: ${i ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${i ? "8%" : "0%"};
          --outlet-outer-blur: ${i ? "50px" : "0"};
          --outlet-outer-strength: ${i ? "10%" : "0%"};
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
          ${this.config.show_state ? s`<span class="state"
                >${this.displayState(e, t.entityId)}</span
              >` : h}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplexOutlet(t, e) {
    const i = this.getEntity(t.entityId), r = this.isOn(i, t.entityId), o = this.isUnavailable(i), a = r ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", l = r ? "1" : "0";
    return s`
      <button
        class="duplex-outlet ${e} ${r ? "on" : "off"} ${o ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${a};
          --outlet-warm-color: ${r ? "color-mix(in srgb, " + a + " 86%, #ff9a64)" : a};
          --outlet-hot-color: ${r ? "color-mix(in srgb, " + a + " 80%, #ff1d1d)" : a};
          --outlet-on-opacity: ${l};
          --outlet-border-strength: ${r ? "26%" : "18%"};
          --outlet-inner-ring-width: ${r ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${r ? "8%" : "0%"};
          --outlet-outer-blur: ${r ? "50px" : "0"};
          --outlet-outer-strength: ${r ? "10%" : "0%"};
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
          ${this.config.show_state ? s`<span class="state"
                >${this.displayState(i, t.entityId)}</span
              >` : h}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplex() {
    const t = this.anyOutletOn, e = t ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382";
    return s`
      <div
        class="duplex-shell"
        style="
          --outlet-any-color: ${e};
          --outlet-any-on-opacity: ${t ? "1" : "0"};
          --outlet-shell-border-strength: ${t ? "22%" : "16%"};
          --outlet-shell-glow-blur: ${t ? "50px" : "0"};
          --outlet-shell-glow-strength: ${t ? "10%" : "0%"};
        "
      >
        ${this.outlets.map(
      (i, r) => s`
            ${r > 0 ? s`<span class="duplex-divider"></span>` : h}
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
      return s``;
    const t = this.config.layout ?? "duplex";
    return s`
      <ha-card>
        <div class="card">
          ${this.config.show_title ? s`
                <div class="title">
                  <span>${this.config.title}</span>
                </div>
              ` : h}
          ${t === "duplex" ? this.renderDuplex() : s`
                <div class="outlets layout-${t}">
                  ${this.outlets.map((e) => this.renderOutlet(e))}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
gt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticStates: { state: !0 }
};
let Q = gt;
customElements.get("dual-outlet-card") || customElements.define("dual-outlet-card", Q);
const ft = class ft extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, _e(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
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
            ${this.renderTextInput("Button Height", "button_height", "54px")}
            ${this.renderTextInput("Gap", "gap", "12px")}
            ${this.renderSelect("Layout", "layout", $e, "duplex")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show Title", "show_title", !1)}
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
            ${this.renderSelect("Tap Action", "tap_action", Ft, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Ft,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
ft.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let tt = ft;
customElements.get("dual-outlet-card-editor") || customElements.define("dual-outlet-card-editor", tt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "dual-outlet-card",
  name: "Dual Outlet Card",
  description: "A two-outlet toggle card with red on-state glow."
});
const Dt = {
  icon: "mdi:fan",
  width: "260px",
  fill_container: !1,
  height: "56px",
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
}, ke = ["cycle", "more-info", "none"], Ce = ["more-info", "none"];
function Se(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function T(n, t) {
  if (typeof n == "number" && Number.isFinite(n))
    return n;
  if (typeof n == "string") {
    const e = Number(n);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
const mt = class mt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledSpeedPointer = !1;
  }
  static get styles() {
    return f`
      :host {
        --fan-card-width: 260px;
        --fan-card-height: 56px;
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
        gap: 8px;
        grid-template-columns: 46px minmax(0, 1fr) auto;
        min-height: var(--fan-card-height);
        overflow: hidden;
        padding: 8px 10px 8px 10px;
        position: relative;
        text-align: left;
        touch-action: manipulation;
        user-select: none;
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
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px color-mix(in srgb, var(--fan-state-color) 12%, transparent),
          0 0 18px color-mix(in srgb, var(--fan-state-color) 20%, transparent),
          0 0 42px color-mix(in srgb, var(--fan-state-color) 14%, transparent),
          0 0 82px color-mix(in srgb, var(--fan-state-color) 8%, transparent);
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
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 18%, transparent);
        box-shadow:
          0 0 12px color-mix(in srgb, var(--fan-state-color) 22%, transparent),
          0 0 34px color-mix(in srgb, var(--fan-state-color) 14%, transparent),
          0 0 70px color-mix(in srgb, var(--fan-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--fan-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--fan-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
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
        height: 38px;
        justify-content: center;
        width: 38px;
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
        touch-action: manipulation;
        user-select: none;
      }

      .speed.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--fan-state-color) 18%, #ffffff 3%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 16px color-mix(in srgb, var(--fan-state-color) 16%, transparent);
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
      ...Dt,
      ...t,
      speed_1_percentage: T(t.speed_1_percentage, 33),
      speed_2_percentage: T(t.speed_2_percentage, 66),
      speed_3_percentage: T(t.speed_3_percentage, 100)
    }, this.style.setProperty(
      "--fan-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--fan-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--fan-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--fan-on-color", this.config.on_color ?? "#45d158"), this.style.setProperty("--fan-off-color", this.config.off_color ?? "#697382"), this.style.setProperty("--fan-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12
    };
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
    return this.optimisticLevel !== void 0 ? this.optimisticLevel === 0 ? 0 : this.percentageForLevel(this.optimisticLevel) : this.isOn ? T((t = this.entity) == null ? void 0 : t.attributes.percentage, 100) : 0;
  }
  get entityPercentage() {
    var t, e;
    return ((t = this.entity) == null ? void 0 : t.state) !== "on" ? 0 : T((e = this.entity) == null ? void 0 : e.attributes.percentage, 100);
  }
  levelFromPercentage(t) {
    if (t <= 0)
      return 0;
    const e = this.config.speed_1_percentage ?? 33, i = this.config.speed_2_percentage ?? 66;
    return t <= (e + i) / 2 ? 1 : t < (i + (this.config.speed_3_percentage ?? 100)) / 2 ? 2 : 3;
  }
  get entityLevel() {
    return this.levelFromPercentage(this.entityPercentage);
  }
  get level() {
    return this.optimisticLevel !== void 0 ? this.optimisticLevel : this.levelFromPercentage(this.percentage);
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
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || Dt.icon;
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
    }, 8e3);
  }
  clearOptimisticLevel() {
    window.clearTimeout(this.optimisticTimer), this.optimisticLevel = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticLevel());
  }
  updated() {
    this.optimisticLevel !== void 0 && this.entityLevel === this.optimisticLevel && this.clearOptimisticLevel();
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
          (i = this.hass) == null ? void 0 : i.callService("fan", "turn_on", {
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
    t.preventDefault(), t.stopPropagation(), this.handledSpeedPointer = !0, window.setTimeout(() => {
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
    return s`
      <div class="speed-buttons" aria-label="Fan speed">
        ${t.map(
      (e) => s`
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
      return s``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return s`
      <ha-card
        style="
          --fan-state-color: ${t};
          --fan-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --fan-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --fan-on-opacity: ${e};
          --fan-border-strength: ${this.isOn ? "26%" : "18%"};
          --fan-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --fan-inner-ring-strength: ${this.isOn ? "8%" : "0%"};
          --fan-outer-blur: ${this.isOn ? "50px" : "0"};
          --fan-outer-strength: ${this.isOn ? "10%" : "0%"};
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          ${this.config.show_speed_buttons ? this.renderSpeedButtons() : h}
        </div>
      </ha-card>
    `;
  }
};
mt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLevel: { state: !0 }
};
let et = mt;
customElements.get("speed-fan-card") || customElements.define("speed-fan-card", et);
const bt = class bt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, Se(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderEntityPicker("Entity", "entity")}
            ${this.renderTextInput("Name", "name", "Fan")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
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
            ${this.renderSelect("Tap Action", "tap_action", ke, "cycle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Ce,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
bt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let it = bt;
customElements.get("speed-fan-card-editor") || customElements.define("speed-fan-card-editor", it);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "speed-fan-card",
  name: "Speed Fan Card",
  description: "A compact fan card with off, 1, 2, and 3 speed controls."
});
//# sourceMappingURL=gamma-ha-cards.js.map
