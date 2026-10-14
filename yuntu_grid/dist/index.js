import { createContext as e, createElement as t, forwardRef as n, useContext as r, useEffect as i, useMemo as a, useRef as o, useState as s } from "react";
import { createPortal as c } from "react-dom";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var d = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function f(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: d(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var ee = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, p = (e) => {
	let t = ee(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, te = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), m = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function h(e) {
	return e != null;
}
function g(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? m.width, a = e.size ?? e.height ?? m.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? te(...c) : te("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? m["stroke-width"]) * Number(e.size ?? e.width ?? m.width) / Number(t.size ?? t.width ?? m.width) : t.strokeWidth ?? m["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(m).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && h(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && h(t.width) && { [r("width")]: t.width },
			..."height" in t && h(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function _(e, t = {}) {
	return g(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var v = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, y = e({}), ne = () => r(y), re = n(({ color: e, size: n, width: r, height: i, strokeWidth: a, absoluteStrokeWidth: o, nonScalingStroke: s, className: c = "", children: l, iconNode: u = [], icon: d = {
	node: u,
	aliases: [],
	size: 24
}, ...f }, ee) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: y = "currentColor", className: re = "" } = ne() ?? {}, b = !!l || v(f), [ie, x, S = []] = _(d, {
		color: e ?? y,
		width: r ?? n ?? p,
		height: i ?? n ?? p,
		strokeWidth: a ?? m,
		absoluteStrokeWidth: o ?? h,
		nonScalingStroke: s ?? g,
		className: te(re, c),
		hasA11yProp: b,
		attributes: f
	});
	return t(ie, {
		ref: ee,
		...x
	}, [...S.map(([e, n]) => t(e, n)), ...Array.isArray(l) ? l : [l]]);
});
//#endregion
//#region node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function b(e, r = [], i = []) {
	let a = typeof e == "string" ? f(e, r, i) : e, o = n(({ className: e, ...n }, r) => t(re, {
		ref: r,
		icon: a,
		className: e,
		...n
	}));
	return a.name && (o.displayName = p(a.name)), o;
}
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/archive.mjs
var ie = {
	name: "archive",
	size: 24,
	node: [
		["rect", {
			width: "20",
			height: "5",
			x: "2",
			y: "3",
			rx: "1",
			key: "1wp1u1"
		}],
		["path", {
			d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
			key: "1s80jp"
		}],
		["path", {
			d: "M10 12h4",
			key: "a56b0p"
		}]
	]
};
ie.node;
var x = b(ie), S = {
	name: "clipboard-paste",
	size: 24,
	node: [
		["path", {
			d: "M11 14h10",
			key: "1w8e9d"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v1.344",
			key: "1e62lh"
		}],
		["path", {
			d: "m17 18 4-4-4-4",
			key: "z2g111"
		}],
		["path", {
			d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",
			key: "bjbb7m"
		}],
		["rect", {
			x: "8",
			y: "2",
			width: "8",
			height: "4",
			rx: "1",
			key: "ublpy"
		}]
	]
};
S.node;
var ae = b(S), C = {
	name: "copy",
	size: 24,
	node: [["rect", {
		width: "14",
		height: "14",
		x: "8",
		y: "8",
		rx: "2",
		ry: "2",
		key: "17jyea"
	}], ["path", {
		d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
		key: "zix9uf"
	}]]
};
C.node;
var oe = b(C), se = {
	name: "download",
	size: 24,
	node: [
		["path", {
			d: "M12 15V3",
			key: "m9g1x1"
		}],
		["path", {
			d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
			key: "ih7n3h"
		}],
		["path", {
			d: "m7 10 5 5 5-5",
			key: "brsn70"
		}]
	]
};
se.node;
var ce = b(se), le = {
	name: "plus",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "M12 5v14",
		key: "s699le"
	}]]
};
le.node;
var ue = b(le), de = {
	name: "trash",
	size: 24,
	node: [
		["path", {
			d: "M10 11v6",
			key: "nco0om"
		}],
		["path", {
			d: "M14 11v6",
			key: "outv1u"
		}],
		["path", {
			d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
			key: "miytrc"
		}],
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}],
		["path", {
			d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
			key: "e791ji"
		}]
	],
	aliases: ["trash-2"]
};
de.node;
var fe = b(de), pe = {
	name: "x",
	size: 24,
	node: [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]
};
pe.node;
var me = b(pe), he = e(!0);
function ge({ children: e }) {
	return r(he) ? c(e, document.body) : null;
}
function _e() {
	let e = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
	return {
		scale: e,
		width: window.innerWidth / e,
		height: window.innerHeight / e
	};
}
function w(e = {}) {
	let t = Math.max(64, Number(e.minWidth) || 64);
	return {
		min: t,
		max: Math.max(t, Math.min(640, Number(e.maxWidth) || 640))
	};
}
function ve(e = []) {
	return e.map((e) => String(e.key)).join("|");
}
function T(e = [], t = {}) {
	let n = e.map((e) => String(e.key)), r = new Set(n), i = Array.isArray(t.order) ? t.order.map(String).filter((e) => r.has(e)) : [];
	return {
		order: [...i, ...n.filter((e) => !i.includes(e))],
		widths: Object.fromEntries(e.map((e) => {
			let n = String(e.key), r = Number(e.width) || 160, i = Number(t.widths?.[n]) || r, { min: a, max: o } = w(e);
			return [n, Math.min(o, Math.max(a, i))];
		}))
	};
}
function ye(e, t, n) {
	let r = String(t), i = String(n);
	if (!r || !i || r === i) return e;
	let a = e.order.indexOf(i);
	if (a < 0) return e;
	let o = e.order.filter((e) => e !== r);
	return o.splice(a, 0, r), {
		...e,
		order: o
	};
}
function be(e, t, n, r) {
	let { min: i, max: a } = w(r);
	return {
		...e,
		widths: {
			...e.widths,
			[t]: Math.min(a, Math.max(i, Math.round(Number(n) || i)))
		}
	};
}
function xe(e, t, n, r, i, a) {
	let o = i - r;
	return be(e, t, n + (a?.sticky === "right" ? -o : o), a);
}
//#endregion
//#region yuntu_grid/src/data-grid-copy.js
var E = /* @__PURE__ */ new Set([
	"actions",
	"avatar",
	"selectedState"
]);
function D(e) {
	if (e == null) return "";
	if (typeof e == "object") try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
	return String(e).replace(/[\t\r\n]+/g, " ").trim();
}
function Se(e = []) {
	return e.filter((e) => e?.label && !E.has(String(e.key)));
}
function Ce(e, t) {
	let n = Se(e);
	return !n.length || !t?.length ? "" : [n.map((e) => String(e.label)).join("	"), ...t.map(({ row: e, index: t }) => n.map((n) => String(n.key) === "index" && e?.[n.key] === void 0 ? String(t + 1) : D(e?.[n.key])).join("	"))].join("\r\n");
}
//#endregion
//#region yuntu_grid/src/yuntu-grid.js
var we = /* @__PURE__ */ new Set(["empty", "not-empty"]), O = Object.freeze({
	text: [
		["contains", "包含"],
		["not-contains", "不包含"],
		["equals", "等于"],
		["not-equals", "不等于"],
		["empty", "为空"],
		["not-empty", "不为空"]
	],
	number: [
		["equals", "等于"],
		["gte", "大于等于"],
		["lte", "小于等于"],
		["between", "范围"],
		["empty", "为空"],
		["not-empty", "不为空"]
	],
	datetime: [
		["before", "早于"],
		["after", "晚于"],
		["between", "时间范围"],
		["empty", "为空"],
		["not-empty", "不为空"]
	],
	boolean: [["equals", "等于"]],
	enum: [["equals", "等于"], ["not-equals", "不等于"]]
}), k = /* @__PURE__ */ new Set([
	"n",
	"index",
	"age",
	"followerCount",
	"followingCount",
	"awemeCount",
	"favoritingCount",
	"commentCount",
	"diggCount",
	"shareCount",
	"collectCount",
	"durationSeconds",
	"minimumLevel",
	"minimumFollowers",
	"minimumAwemeCount",
	"unreadCount",
	"progress"
]), Te = /* @__PURE__ */ new Set([
	"createTime",
	"createdAt",
	"updatedAt",
	"startedAt",
	"finishedAt",
	"syncedAt",
	"time",
	"timestamp"
]), Ee = /* @__PURE__ */ new Set([
	"verified",
	"enabled",
	"connected",
	"online"
]);
function A(e = {}) {
	if ([
		"text",
		"number",
		"datetime",
		"boolean",
		"enum"
	].includes(e.dataType)) return e.dataType;
	let t = String(e.key || "");
	return k.has(t) ? "number" : Te.has(t) ? "datetime" : Ee.has(t) ? "boolean" : "text";
}
function j(e, t, n = 0) {
	if (!t) return;
	if (t.key === "n" || t.key === "index") return n + 1;
	let r = t.filterValue || t.sortValue || t.value;
	return typeof r == "function" ? r(e, n) : e?.[t.key];
}
var M = (e) => e == null || String(e).trim() === "", N = (e) => String(e ?? "").trim().toLocaleLowerCase("zh-CN"), P = (e) => {
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}, F = (e) => {
	let t = typeof e == "number" && e < 0xe8d4a51000 ? e * 1e3 : new Date(e).getTime();
	return Number.isFinite(t) ? t : null;
};
function De(e, t, n, r = 0) {
	let i = j(e, t, r);
	if (n.operator === "empty") return M(i);
	if (n.operator === "not-empty") return !M(i);
	let a = A(t);
	if (a === "number") {
		let e = P(i), t = P(n.value), r = P(n.valueTo);
		return e == null || t == null ? !1 : n.operator === "gte" ? e >= t : n.operator === "lte" ? e <= t : n.operator === "between" ? r != null && e >= Math.min(t, r) && e <= Math.max(t, r) : e === t;
	}
	if (a === "datetime") {
		let e = F(i), t = F(n.value), r = F(n.valueTo);
		return e == null || t == null ? !1 : n.operator === "before" ? e < t : n.operator === "after" ? e > t : n.operator === "between" ? r != null && e >= Math.min(t, r) && e <= Math.max(t, r) : e === t;
	}
	if (a === "boolean") return !!i == (String(n.value) === "true");
	let o = N(i), s = N(n.value);
	return n.operator === "contains" ? o.includes(s) : n.operator === "not-contains" ? !o.includes(s) : n.operator === "not-equals" ? o !== s : o === s;
}
function Oe(e = [], t = [], n = []) {
	let r = new Map(t.map((e) => [String(e.key), e]));
	return e.map((e, t) => ({
		row: e,
		originalIndex: t
	})).filter((e) => n.every((t) => {
		let n = r.get(String(t.columnKey));
		return !n || De(e.row, n, t, e.originalIndex);
	}));
}
function ke(e = [], t = [], n = {
	key: "__sequence",
	direction: "asc"
}) {
	let r = n?.direction === "desc" ? -1 : 1, i = t.find((e) => String(e.key) === String(n?.key));
	return [...e].sort((e, t) => {
		if (!i || n?.key === "__sequence" || i.key === "n" || i.key === "index") return (e.originalIndex - t.originalIndex) * r;
		let a = A(i), o = j(e.row, i, e.originalIndex), s = j(t.row, i, t.originalIndex);
		if (M(o) && M(s)) return e.originalIndex - t.originalIndex;
		if (M(o)) return 1;
		if (M(s)) return -1;
		let c = a === "number" ? P(o) : a === "datetime" ? F(o) : a === "boolean" ? Number(!!o) : N(o), l = a === "number" ? P(s) : a === "datetime" ? F(s) : a === "boolean" ? Number(!!s) : N(s);
		return (typeof c == "string" ? c.localeCompare(l, "zh-CN", { numeric: !0 }) : c === l ? 0 : c < l ? -1 : 1) * r || e.originalIndex - t.originalIndex;
	});
}
function Ae(e, t) {
	if (t === "n" || t === "index") return {
		key: "",
		direction: "asc"
	};
	let n = String(t);
	return e?.key === n ? {
		key: n,
		direction: e.direction === "asc" ? "desc" : "asc"
	} : {
		key: n,
		direction: "asc"
	};
}
function je(e) {
	return !we.has(e);
}
function Me(e) {
	return e === "between";
}
//#endregion
//#region yuntu_grid/src/grid-row-actions.js
function Ne(e, t, n) {
	let r = typeof e == "function" ? e(t, n) : e;
	return (Array.isArray(r) ? r : []).filter((e) => e && !e.hidden);
}
function Pe(e) {
	return !e || e.disabled || typeof e.run != "function" ? !1 : e.run();
}
//#endregion
//#region yuntu_grid/src/grid-row-selection.js
function Fe(e, t) {
	let n = new Set([...e].map(String));
	return n.has(String(t)) ? n : /* @__PURE__ */ new Set([String(t)]);
}
function Ie({ selectedKeys: e, targetKey: t, displayIndex: n, anchorIndex: r, displayKeys: i, shiftKey: a, ctrlKey: o, metaKey: s }) {
	let c = o || s, l = new Set([...e].map(String));
	if (a && r >= 0) {
		let e = new Set(c ? l : []), [t, a] = [r, n].sort((e, t) => e - t);
		for (let n = t; n <= a; n++) i[n] != null && e.add(String(i[n]));
		return {
			keys: e,
			anchorIndex: r
		};
	}
	return c ? (l.has(String(t)) ? l.delete(String(t)) : l.add(String(t)), {
		keys: l,
		anchorIndex: n
	}) : {
		keys: /* @__PURE__ */ new Set([String(t)]),
		anchorIndex: n
	};
}
//#endregion
//#region yuntu_grid/src/browser-services.js
function I(e, t) {
	let n = (e) => {
		let t = D(e);
		return /^[=+\-@]/.test(t) && (t = "'" + t), "\"" + t.replaceAll("\"", "\"\"") + "\"";
	};
	return "﻿" + [t.map((e) => n(e.label || e.key)).join(","), ...e.map((e, r) => t.map((t) => n(t.key === "index" || t.key === "n" ? r + 1 : e[t.key])).join(","))].join("\r\n");
}
var Le = {
	async copyText(e) {
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(e);
				return;
			}
		} catch {}
		let t = document.activeElement, n = document.createElement("textarea");
		n.value = e, n.setAttribute("aria-label", "复制内容"), Object.assign(n.style, {
			position: "fixed",
			top: "0",
			left: "-9999px"
		}), document.body.append(n);
		try {
			if (n.select(), !document.execCommand("copy")) throw Error("浏览器未允许复制，请检查剪贴板权限");
		} finally {
			n.remove(), t?.focus?.();
		}
	},
	async exportRows({ title: e = "导出数据", rows: t, columns: n }) {
		let r = new Blob([I(t, n)], { type: "text/csv;charset=utf-8" }), i = URL.createObjectURL(r), a = document.createElement("a");
		a.href = i, a.download = e.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") + ".csv", document.body.append(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
	}
};
//#endregion
//#region yuntu_grid/src/primitives.jsx
function L({ children: e, tone: t = "primary", icon: n, className: r = "", ...i }) {
	return /* @__PURE__ */ u("button", {
		type: "button",
		className: `yg-button yg-button-${t} ${r}`,
		...i,
		children: [n && /* @__PURE__ */ l(n, {
			size: 17,
			"aria-hidden": "true"
		}), e]
	});
}
function Re({ title: e }) {
	return /* @__PURE__ */ u("div", {
		className: "yg-empty",
		children: [
			/* @__PURE__ */ l(x, {
				size: 38,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ l("strong", { children: e }),
			/* @__PURE__ */ l("span", { children: "完成配置并开始运行后，结果会显示在这里。" })
		]
	});
}
//#endregion
//#region yuntu_grid/src/YuntuGrid.jsx
var ze = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`, Be = (e, t = 28) => {
	let n = e == null ? "" : String(e);
	return n.length > t ? n.slice(0, t) + "…" : n;
}, Ve = (e) => e.filter((e) => e?.key && e.exportable !== !1 && ![
	"avatar",
	"actions",
	"selectedState"
].includes(String(e.key))).map((e) => ({
	key: e.key,
	label: e.label || e.key
}));
function R({ gridId: e, columns: t = [], rows: n = [], rowKey: r = "id", emptyText: c = "暂无数据", onRowClick: d, rowActions: f, selected: ee, selectedKeys: p, onSelectionChange: te, selectionDisabled: m = !1, selectionColumn: h = !1, exportConfig: g, clearConfig: _, rowRenderBatch: v = 0, filterEnabled: y = !0, services: ne = {}, active: re = !0, className: b = "", style: ie }) {
	let x = {
		...Le,
		...ne
	}, S = n, C = h ? [{
		key: "selectedState",
		label: "选择",
		width: 64,
		filterable: !1,
		render: (e, t) => /* @__PURE__ */ l("input", {
			type: "checkbox",
			className: "yuntu-grid-checkbox",
			"aria-label": `选择 ${e[r]}`,
			checked: X.has(Z(e, t)),
			disabled: m,
			onClick: (e) => e.stopPropagation(),
			onChange: () => bt(e, t)
		})
	}, ...t] : t, [se, le] = s(!1), [de, pe] = s(""), w = a(() => C.filter((e) => !e.hidden), [C]), E = ve(w), D = `yuntu-grid-layout:${e || E}`, we = a(() => T(w), [E]), [k, Te] = s(() => ({
		signature: E,
		storageKey: D,
		layout: (() => {
			try {
				return T(w, JSON.parse(localStorage.getItem(D) || "{}"));
			} catch {
				return T(w);
			}
		})()
	})), [Ee, j] = s(() => /* @__PURE__ */ new Set()), [M, N] = s(null), [P, F] = s(""), [De, I] = s(""), [R, z] = s([]), [B, He] = s({
		key: "",
		direction: "asc"
	}), [Ue, We] = s(!1);
	i(() => {
		y || (We(!1), z([]));
	}, [y]);
	let [Ge, Ke] = s({
		top: 96,
		left: 270,
		width: 640
	}), [qe, Je] = s(!1), [Ye, Xe] = s(() => v > 0 ? v : Infinity), Ze = o(null), Qe = a(() => y ? C.filter((e) => !e.hidden && e.filterable !== !1 && ![
		"avatar",
		"actions",
		"n",
		"index",
		"selectedState"
	].includes(String(e.key))) : [], [C, y]), $e = Qe[0], et = (e) => A(e) === "boolean" ? "true" : "", [V, H] = s(() => ({
		columnKey: $e?.key || "",
		operator: O[A($e)][0][0],
		value: et($e),
		valueTo: ""
	})), tt = o(null), nt = o(null), U = o(null), W = o(null), G = o(null), K = o(null), q = o(0), rt = o(null), it = o(!1), J = k.signature === E && k.storageKey === D ? T(w, k.layout) : we;
	G.current = J;
	let at = new Map(w.map((e) => [String(e.key), e])), Y = J.order.map((e) => at.get(e)).filter(Boolean), ot = Se(Y), st = Y.reduce((e, t) => e + J.widths[String(t.key)], 0), ct = Y.find((e) => String(e.label || "").toUpperCase().includes("UID") && !String(e.key || "").toLowerCase().includes("sec")), X = new Set([...p || Ee].map(String)), Z = (e, t) => String(e?.[r] ?? e?.id ?? `${e?.[ct?.key] || "row"}-${t}`), lt = a(() => Oe(S, C, y ? R : []), [
		S,
		C,
		R,
		y
	]), Q = a(() => ke(lt, C, B), [
		lt,
		C,
		B
	]), ut = v > 0 ? Q.slice(0, Ye) : Q, dt = a(() => Q.map((e) => e.row), [Q]);
	i(() => {
		if (v <= 0 || Ye >= Q.length || !Ze.current || typeof IntersectionObserver > "u") return;
		let e = new IntersectionObserver((e) => {
			e.some((e) => e.isIntersecting) && Xe((e) => Math.min(Q.length, e + v));
		}, { rootMargin: "400px 0px" });
		return e.observe(Ze.current), () => e.disconnect();
	}, [
		v,
		Ye,
		Q.length
	]), i(() => {
		v > 0 && Xe(v);
	}, [
		R,
		B,
		v
	]);
	let $ = Qe.find((e) => String(e.key) === String(V.columnKey)) || $e, ft = O[A($)] || O.text, pt = (e) => {
		let t = Qe.find((t) => String(t.key) === String(e));
		H({
			columnKey: e,
			operator: (O[A(t)] || O.text)[0][0],
			value: et(t),
			valueTo: ""
		});
	}, mt = () => {
		$ && (je(V.operator) && String(V.value).trim() === "" || Me(V.operator) && String(V.valueTo).trim() === "" || (z((e) => [...e, {
			...V,
			id: ze(),
			columnKey: String(V.columnKey)
		}]), We(!1)));
	}, ht = (e) => {
		if (Ue) return We(!1);
		let t = e.currentTarget.getBoundingClientRect(), n = _e(), r = Math.min(640, n.width - 32), i = Math.min(Math.max(16, t.left / n.scale), Math.max(16, n.width - r - 16)), a = Math.min(Math.max(16, t.bottom / n.scale + 6), Math.max(16, n.height - 250));
		Ke({
			top: a,
			left: i,
			width: r,
			maxHeight: n.height - a - 16
		}), We(!0);
	}, gt = (e) => {
		let t = C.find((t) => String(t.key) === String(e.columnKey)), n = (O[A(t)] || O.text).find((t) => t[0] === e.operator)?.[1] || e.operator, r = je(e.operator) ? ` ${e.value}${Me(e.operator) ? ` ～ ${e.valueTo}` : ""}` : "";
		return `${t?.label || e.columnKey} ${n}${r}`;
	}, _t = (e) => {
		let t = T(w, e);
		Te({
			signature: E,
			storageKey: D,
			layout: t
		});
		try {
			localStorage.setItem(D, JSON.stringify(t));
		} catch {}
	};
	i(() => {
		if (k.signature === E && k.storageKey === D) return;
		let e = {};
		try {
			e = JSON.parse(localStorage.getItem(D) || "{}");
		} catch {}
		Te({
			signature: E,
			storageKey: D,
			layout: T(w, e)
		});
	}, [E, D]), i(() => {
		if (!M) return;
		let e = () => N(null), t = (t) => {
			t.key === "Escape" && e();
		};
		return window.addEventListener("pointerdown", e), window.addEventListener("blur", e), window.addEventListener("keydown", t), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("blur", e), window.removeEventListener("keydown", t);
		};
	}, [M]), i(() => {
		let e = new Set(n.map(Z));
		e.has(U.current) || (U.current = null), j((t) => {
			let n = new Set([...t].filter((t) => e.has(t)));
			return n.size === t.size ? t : n;
		});
	}, [n, E]), i(() => {
		let e = (e) => {
			if (!W.current) return;
			let t = W.current, n = xe(G.current, t.key, t.startWidth, t.startX, t.startX + (e.clientX - t.startX) / _e().scale, t.column).widths[t.key];
			t.currentWidth = n, t.columnElement && (t.columnElement.style.width = `${n}px`), t.tableElement && (t.tableElement.style.width = `${t.column?.sticky === "right" ? t.startTableWidth : Math.max(t.startTableWidth + n - t.startWidth, 640)}px`);
		}, t = () => {
			let e = W.current;
			W.current = null, document.body.classList.remove("resizing-grid-column"), e && _t(be(G.current, e.key, e.currentWidth ?? e.startWidth, e.column));
		};
		return window.addEventListener("pointermove", e), window.addEventListener("pointerup", t), () => {
			window.removeEventListener("pointermove", e), window.removeEventListener("pointerup", t), W.current && (W.current = null, document.body.classList.remove("resizing-grid-column"));
		};
	}, [E]);
	let vt = (e) => {
		p ?? j(new Set(e)), te?.(new Set(e));
	}, yt = (e, t, n, r) => {
		if (m) return;
		let i = Z(e, r), a = Q.map((e) => Z(e.row, e.originalIndex)), o = X.size ? a.indexOf(U.current) : -1, s = Ie({
			selectedKeys: X,
			targetKey: i,
			displayIndex: n,
			anchorIndex: o,
			displayKeys: a,
			shiftKey: t.shiftKey,
			ctrlKey: t.ctrlKey,
			metaKey: t.metaKey
		});
		U.current = a[s.anchorIndex] ?? i, vt(s.keys);
	}, bt = (e, t) => {
		if (m) return;
		let n = Z(e, t), r = Ie({
			selectedKeys: X,
			targetKey: n,
			displayIndex: t,
			anchorIndex: -1,
			displayKeys: [],
			ctrlKey: !0
		});
		U.current = n, vt(r.keys);
	}, xt = (e) => {
		let t = new Set(e.additive ? e.initialKeys : []);
		for (let r of tt.current?.querySelectorAll("tbody tr[data-row-index]") || []) {
			let i = r.getBoundingClientRect();
			if (i.right >= e.left && i.left <= e.right && i.bottom >= e.top && i.top <= e.bottom) {
				let e = Number(r.dataset.rowIndex);
				n[e] && t.add(Z(n[e], e));
			}
		}
		return t;
	}, St = (e) => {
		if (m || e.button !== 0 || e.target.closest("button,input,select,textarea,a,.column-resizer,thead") || !e.target.closest("tbody tr[data-row-index]")) return;
		let t = e.currentTarget.getBoundingClientRect();
		K.current = {
			startX: e.clientX,
			startY: e.clientY,
			moved: !1,
			additive: e.ctrlKey || e.metaKey,
			initialKeys: new Set(X),
			bounds: t,
			pointerId: e.pointerId,
			container: e.currentTarget,
			captured: !1
		};
	}, Ct = (e, t) => {
		let r = K.current;
		if (!r || !(r.moved || Math.hypot(e - r.startX, t - r.startY) > 5)) return;
		r.moved = !0;
		let i = Math.max(r.bounds.left, Math.min(r.startX, e)), a = Math.min(r.bounds.right, Math.max(r.startX, e)), o = Math.max(r.bounds.top, Math.min(r.startY, t)), s = Math.min(r.bounds.bottom, Math.max(r.startY, t)), c = {
			...r,
			left: i,
			right: a,
			top: o,
			bottom: s
		}, l = xt(c);
		r.pendingKeys = l;
		let u = nt.current, { scale: d } = _e();
		u && Object.assign(u.style, {
			display: "block",
			left: `${i / d}px`,
			top: `${o / d}px`,
			width: `${Math.max(1, a - i) / d}px`,
			height: `${Math.max(1, s - o) / d}px`
		});
		for (let e of tt.current?.querySelectorAll("tbody tr[data-row-index]") || []) {
			let t = Number(e.dataset.rowIndex);
			e.classList.toggle("selected", !!(n[t] && l.has(Z(n[t], t))));
		}
	}, wt = (e) => {
		let t = K.current;
		t && (!t.moved && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) <= 5 || (e.preventDefault(), t.captured ||= (t.container?.setPointerCapture?.(t.pointerId), !0), t.moved = !0, rt.current = {
			x: e.clientX,
			y: e.clientY
		}, !q.current && (q.current = requestAnimationFrame(() => {
			q.current = 0;
			let e = rt.current;
			e && Ct(e.x, e.y);
		}))));
	}, Tt = (e) => {
		q.current && cancelAnimationFrame(q.current), q.current = 0, K.current?.moved && Number.isFinite(e?.clientX) && Ct(e.clientX, e.clientY), K.current?.moved && (it.current = !0, setTimeout(() => {
			it.current = !1;
		}, 0), vt(K.current.pendingKeys || /* @__PURE__ */ new Set())), K.current = null, rt.current = null, nt.current && (nt.current.style.display = "none");
	}, Et = async (e) => {
		let t = S.map((e, t) => ({
			row: e,
			index: t
		})).filter(({ row: t, index: n }) => e.has(Z(t, n)));
		return !t.length || !ot.length ? 0 : (await x.copyText(Ce(ot, t)), N(null), t.length);
	}, Dt = (e, t) => {
		let r = Z(e, t), i = new Set([...X].map(String)), a = Fe(i, r);
		return !m && !i.has(r) && (vt(a), U.current = r), {
			keys: a,
			selectedRows: n.filter((e, t) => a.has(Z(e, t))),
			copyAllRows: () => Et(a)
		};
	}, Ot = (e, t) => f ? Ne(f, e, t) : [{
		id: "copy",
		label: `复制全部信息（${t.keys.size} 行）`,
		icon: oe,
		run: t.copyAllRows
	}, ...ct ? [{
		id: "copy-uids",
		label: `复制 ${t.keys.size} 个 UID`,
		icon: ae,
		run: () => x.copyText([...new Set(t.selectedRows.map((e) => String(e?.[ct.key] || "").trim()).filter(Boolean))].join("\r\n"))
	}] : []], kt = (e) => {
		if (!e?.disabled) {
			N(null), F("");
			try {
				Promise.resolve(Pe(e)).catch((e) => F(e?.message || "操作失败"));
			} catch (e) {
				F(e?.message || "操作失败");
			}
		}
	}, At = (e, t, n) => {
		t.preventDefault(), t.stopPropagation();
		let r = Dt(e, n), i = Ot(e, r);
		if (!i.length) return;
		let a = _e();
		N({
			x: Math.max(8, Math.min(t.clientX / a.scale, a.width - 220)),
			y: Math.max(8, Math.min(t.clientY / a.scale, a.height - Math.min(i.length * 38 + 12, a.height - 16))),
			row: e,
			context: r
		});
	}, jt = (e, t, n, r) => {
		if (t.target instanceof Element && t.target.closest("button,a,input,select,textarea") || K.current?.moved || it.current) return;
		t.preventDefault(), t.stopPropagation();
		let i = Dt(e, r);
		kt(Ot(e, i)[0]);
	};
	return /* @__PURE__ */ u(he.Provider, {
		value: re,
		children: [
			/* @__PURE__ */ u("div", {
				className: `yuntu-grid-shell ${b}`,
				style: ie,
				"data-grid-id": e,
				children: [
					/* @__PURE__ */ u("div", {
						className: "yuntu-grid-toolbar",
						children: [
							/* @__PURE__ */ u("div", {
								className: "yuntu-grid-summary",
								children: [/* @__PURE__ */ l("strong", { children: lt.length === n.length ? `${n.length} 条` : `${lt.length} / ${n.length} 条` }), Qe.length > 0 && /* @__PURE__ */ u("button", {
									type: "button",
									className: "yuntu-grid-add-filter",
									onClick: ht,
									"aria-expanded": Ue,
									children: [/* @__PURE__ */ l(ue, { size: 15 }), "添加筛选"]
								})]
							}),
							/* @__PURE__ */ u("div", {
								className: "yuntu-grid-actions",
								children: [
									y && R.length > 0 && /* @__PURE__ */ l("button", {
										type: "button",
										className: "yuntu-grid-reset",
										onClick: () => z([]),
										children: "清除筛选"
									}),
									g && /* @__PURE__ */ l(L, {
										tone: "soft",
										icon: ce,
										disabled: !n.length,
										onClick: () => kt({ run: () => x.exportRows({
											title: g.title || "导出数据",
											rows: S,
											columns: g.columns || Ve(C)
										}) }),
										children: "导出全部"
									}),
									_ && /* @__PURE__ */ l(L, {
										tone: "danger-soft",
										icon: fe,
										disabled: !n.length || _.disabled,
										onClick: () => {
											pe(""), Je(!0);
										},
										children: "清空"
									})
								]
							}),
							y && Ue && /* @__PURE__ */ l(ge, { children: /* @__PURE__ */ u("div", {
								className: "yuntu-grid-filter-popover",
								style: Ge,
								role: "dialog",
								"aria-label": "添加筛选条件",
								children: [
									/* @__PURE__ */ u("label", { children: ["字段", /* @__PURE__ */ l("select", {
										"aria-label": "字段",
										value: V.columnKey,
										onChange: (e) => pt(e.target.value),
										children: Qe.map((e) => /* @__PURE__ */ l("option", {
											value: e.key,
											children: e.label
										}, e.key))
									})] }),
									/* @__PURE__ */ u("label", { children: ["条件", /* @__PURE__ */ l("select", {
										"aria-label": "条件",
										value: V.operator,
										onChange: (e) => H((t) => ({
											...t,
											operator: e.target.value
										})),
										children: ft.map(([e, t]) => /* @__PURE__ */ l("option", {
											value: e,
											children: t
										}, e))
									})] }),
									je(V.operator) && /* @__PURE__ */ u("label", { children: ["值", A($) === "boolean" ? /* @__PURE__ */ u("select", {
										"aria-label": "值",
										value: V.value,
										onChange: (e) => H((t) => ({
											...t,
											value: e.target.value
										})),
										children: [/* @__PURE__ */ l("option", {
											value: "true",
											children: "是"
										}), /* @__PURE__ */ l("option", {
											value: "false",
											children: "否"
										})]
									}) : A($) === "enum" ? /* @__PURE__ */ u("select", {
										"aria-label": "值",
										value: V.value,
										onChange: (e) => H((t) => ({
											...t,
											value: e.target.value
										})),
										children: [/* @__PURE__ */ l("option", {
											value: "",
											children: "请选择"
										}), ($?.options || []).map((e) => /* @__PURE__ */ l("option", {
											value: e.value ?? e,
											children: e.label ?? e
										}, String(e.value ?? e)))]
									}) : /* @__PURE__ */ l("input", {
										"aria-label": "值",
										type: A($) === "number" ? "number" : A($) === "datetime" ? "datetime-local" : "text",
										value: V.value,
										onChange: (e) => H((t) => ({
											...t,
											value: e.target.value
										}))
									})] }),
									Me(V.operator) && /* @__PURE__ */ u("label", { children: ["至", /* @__PURE__ */ l("input", {
										"aria-label": "至",
										type: A($) === "datetime" ? "datetime-local" : "number",
										value: V.valueTo,
										onChange: (e) => H((t) => ({
											...t,
											valueTo: e.target.value
										}))
									})] }),
									/* @__PURE__ */ u("div", {
										className: "yuntu-grid-filter-buttons",
										children: [/* @__PURE__ */ l(L, {
											tone: "soft",
											onClick: () => We(!1),
											children: "取消"
										}), /* @__PURE__ */ l(L, {
											onClick: mt,
											children: "应用"
										})]
									})
								]
							}) })
						]
					}),
					y && R.length > 0 && /* @__PURE__ */ l("div", {
						className: "yuntu-grid-filter-chips",
						children: R.map((e) => /* @__PURE__ */ u("button", {
							type: "button",
							title: "移除筛选",
							onClick: () => z((t) => t.filter((t) => t.id !== e.id)),
							children: [gt(e), /* @__PURE__ */ l(me, { size: 13 })]
						}, e.id))
					}),
					/* @__PURE__ */ u("div", {
						ref: tt,
						className: `table-wrap data-grid ${ct ? "uid-selectable-table" : ""}`,
						onPointerDown: St,
						onPointerMove: wt,
						onPointerUp: Tt,
						onPointerCancel: Tt,
						children: [/* @__PURE__ */ u("table", {
							style: {
								width: Math.max(st, 640),
								minWidth: "100%"
							},
							children: [
								/* @__PURE__ */ l("colgroup", { children: Y.map((e) => /* @__PURE__ */ l("col", {
									"data-column-key": String(e.key),
									style: { width: J.widths[String(e.key)] }
								}, e.key)) }),
								/* @__PURE__ */ l("thead", { children: /* @__PURE__ */ l("tr", { children: Y.map((e) => {
									let t = ["n", "index"].includes(String(e.key)), n = String(e.key), r = e.sortable !== !1 && e.key !== "actions" && e.key !== "avatar" && e.key !== "selectedState", i = [
										De === String(e.key) ? "dragging-column" : "",
										e.sticky === "right" ? "sticky-right" : "",
										e.className || ""
									].filter(Boolean).join(" ");
									return /* @__PURE__ */ u("th", {
										"aria-sort": !t && B.key === n ? B.direction === "asc" ? "ascending" : "descending" : "none",
										onDragOver: (e) => {
											e.preventDefault(), e.dataTransfer.dropEffect = "move";
										},
										onDrop: (t) => {
											t.preventDefault();
											let n = t.dataTransfer.getData("text/plain") || De;
											n && _t(ye(G.current, n, String(e.key))), I("");
										},
										className: i,
										children: [/* @__PURE__ */ l("span", {
											className: "column-heading",
											draggable: !0,
											title: "拖动表头调整顺序",
											onDragStart: (t) => {
												t.stopPropagation(), I(String(e.key)), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", String(e.key));
											},
											onDragEnd: () => I(""),
											children: /* @__PURE__ */ u("button", {
												type: "button",
												disabled: !r,
												title: t ? "清除排序并恢复原始顺序" : `按${e.label}排序`,
												onClick: (t) => {
													t.stopPropagation(), r && He((t) => Ae(t, e.key));
												},
												children: [e.label, !t && B.key === n && /* @__PURE__ */ l("span", {
													"aria-hidden": "true",
													children: B.direction === "asc" ? " ↑" : " ↓"
												})]
											})
										}), /* @__PURE__ */ l("button", {
											type: "button",
											draggable: !1,
											className: `column-resizer ${e.sticky === "right" ? "column-resizer-left" : ""}`,
											"aria-label": `调整${e.label || e.key}列宽`,
											title: e.sticky === "right" ? "拖动左边界调整列宽；双击恢复默认宽度" : "拖动右边界调整列宽；双击恢复默认宽度",
											onPointerDown: (t) => {
												t.preventDefault(), t.stopPropagation();
												let n = t.currentTarget.closest("table");
												W.current = {
													key: String(e.key),
													column: e,
													startX: t.clientX,
													startWidth: J.widths[String(e.key)],
													currentWidth: J.widths[String(e.key)],
													startTableWidth: (n?.getBoundingClientRect().width || st) / _e().scale,
													tableElement: n,
													columnElement: n?.querySelector(`col[data-column-key="${CSS.escape(String(e.key))}"]`)
												}, document.body.classList.add("resizing-grid-column");
											},
											onKeyDown: (t) => {
												["ArrowLeft", "ArrowRight"].includes(t.key) && (t.preventDefault(), _t(be(G.current, String(e.key), G.current.widths[String(e.key)] + (t.key === "ArrowRight" ? e.sticky === "right" ? -8 : 8 : e.sticky === "right" ? 8 : -8), e)));
											},
											onDoubleClick: (t) => {
												t.preventDefault(), t.stopPropagation(), _t(be(G.current, String(e.key), Number(e.width) || 160, e));
											}
										})]
									}, e.key);
								}) }) }),
								/* @__PURE__ */ u("tbody", { children: [Q.length ? ut.map(({ row: e, originalIndex: t }, n) => {
									let i = Z(e, t);
									return /* @__PURE__ */ l("tr", {
										"data-row-index": t,
										onClick: (r) => {
											it.current ? it.current = !1 : (yt(e, r, n, t), d?.(e, r, n, {
												displayRows: dt,
												originalIndex: t
											}));
										},
										onDoubleClick: (r) => jt(e, r, n, t),
										onContextMenu: (n) => At(e, n, t),
										className: ee != null && String(ee) === i || X.has(i) ? "selected" : "",
										children: Y.map((t) => /* @__PURE__ */ l("td", {
											className: [t.sticky === "right" ? "sticky-right" : "", t.className || ""].filter(Boolean).join(" "),
											title: typeof e[t.key] == "string" ? e[t.key] : "",
											children: t.render ? t.render(e, n) : Be(e[t.key], t.max || 28)
										}, t.key))
									}, `${e[r] || "row"}-${t}`);
								}) : /* @__PURE__ */ l("tr", {
									className: "empty-table-row",
									children: /* @__PURE__ */ l("td", {
										colSpan: Y.length,
										children: /* @__PURE__ */ l(Re, { title: y && R.length ? "没有符合筛选条件的数据" : c })
									})
								}), v > 0 && Ye < Q.length && /* @__PURE__ */ l("tr", {
									className: "grid-load-more",
									ref: Ze,
									children: /* @__PURE__ */ l("td", {
										colSpan: Y.length,
										children: /* @__PURE__ */ u("button", {
											type: "button",
											onClick: () => Xe((e) => Math.min(Q.length, e + v)),
											children: [
												"继续显示更多（",
												ut.length,
												"/",
												Q.length,
												"）"
											]
										})
									})
								})] })
							]
						}), /* @__PURE__ */ l(ge, { children: /* @__PURE__ */ l("div", {
							ref: nt,
							className: "yuntu-grid-selection-box",
							style: { display: "none" }
						}) })]
					})
				]
			}),
			P && /* @__PURE__ */ u("div", {
				role: "alert",
				className: "yuntu-grid-error",
				children: ["操作失败：", P]
			}),
			M && /* @__PURE__ */ l(ge, { children: /* @__PURE__ */ l("div", {
				className: "yuntu-grid-row-menu",
				role: "menu",
				"aria-label": `${e || "表格"}行操作`,
				style: {
					left: M.x,
					top: M.y
				},
				onPointerDown: (e) => e.stopPropagation(),
				children: Ot(M.row, M.context).map((e, t) => {
					let n = e.icon;
					return /* @__PURE__ */ u("button", {
						role: "menuitem",
						className: e.danger ? "danger" : "",
						disabled: !!e.disabled,
						onClick: () => kt(e),
						children: [n && /* @__PURE__ */ l(n, { size: 15 }), e.label]
					}, e.id || t);
				})
			}) }),
			qe && /* @__PURE__ */ l(ge, { children: /* @__PURE__ */ l("div", {
				className: "yuntu-grid-clear-backdrop",
				children: /* @__PURE__ */ u("div", {
					className: "yuntu-grid-clear-modal",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": "清空全部数据",
					children: [
						/* @__PURE__ */ u("div", {
							className: "modal-title",
							children: [/* @__PURE__ */ u("div", { children: [/* @__PURE__ */ l(fe, { size: 20 }), "清空全部数据"] }), /* @__PURE__ */ l("button", {
								type: "button",
								"aria-label": "关闭",
								disabled: se,
								onClick: () => Je(!1),
								children: /* @__PURE__ */ l(me, { size: 20 })
							})]
						}),
						/* @__PURE__ */ l("p", { children: _?.description || `将清空当前表格的全部 ${n.length} 条数据，不受筛选条件影响。此操作无法撤销。` }),
						de && /* @__PURE__ */ l("p", {
							role: "alert",
							className: "yuntu-grid-error",
							children: de
						}),
						/* @__PURE__ */ u("div", {
							className: "modal-footer",
							children: [/* @__PURE__ */ l(L, {
								tone: "soft",
								disabled: se,
								onClick: () => Je(!1),
								children: "取消"
							}), /* @__PURE__ */ l(L, {
								tone: "danger",
								icon: fe,
								disabled: se,
								onClick: async () => {
									le(!0), pe("");
									try {
										await _.onClear(), Je(!1), z([]);
									} catch (e) {
										pe(e?.message || "清空失败，请重试");
									} finally {
										le(!1);
									}
								},
								children: "确认清空"
							})]
						})
					]
				})
			}) })
		]
	});
}
//#endregion
export { O as GRID_OPERATORS, R as YuntuGrid, R as default, Oe as applyGridFilters, Le as browserServices, Ne as gridRowActions, I as rowsToCsv, Pe as runGridRowAction, ke as sortGridRows };
