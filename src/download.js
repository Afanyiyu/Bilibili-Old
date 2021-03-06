/**
 * @module download
 * @description 下载模块：获取下载链接，绘制下载面板
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main */
    const toast = BLOD.toast; /** @see debug */

    class Download {
        constructor() {
            console.debug('import module "download.js"')
        }
        /**
         * 添加播放器右键下载菜单
         * @param {HTMLElement} node 右键菜单节点
         */
        init(node) {
            if (!BLOD.config.reset.download) return;
            let li = document.createElement("li");
            li.innerHTML = '<a class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            node.firstChild.appendChild(li);
            li.firstChild.onclick = () => this.setTable();
        }
        /**
         * 呼出下载面板
         */
        async setTable() {
            toast("正在获取视频下载地址...");
            let qua = { 125: "HDR", 120: "4K", 116: "1080P60", 112: "1080P+", 80: "1080P", 74: "720P60", 64: "720P", 48: "720P", 32: "480P", 16: "360P", 15: "360P" };
            let bps = { 30216: "64kbps", 30232: "128kbps", 30280: "320kbps" };
            let path = BLOD.__playinfo__ ? (BLOD.__playinfo__.data || (BLOD.__playinfo__.durl && BLOD.__playinfo__) || BLOD.__playinfo__.result) : {};
            if (!BLOD.mdf) {
                path = path || {}
                let pro = [this.geturl()];
                path && !path.durl && pro.push(this.geturl("flv"));
                path && !path.dash && pro.push(this.geturl("dash"));
                BLOD.mdf = {};
                BLOD.mdf.quee = BLOD.mdf.quee || await Promise.all(pro);
                this.quee(BLOD.mdf.quee, qua, bps);
                this.durl(path, qua);
                this.dash(path, qua, bps);
            }
            this.other();
            this.item();
        }
        item() {
            let timer, top = document.getElementById("bili-old-download-table");
            if (top) {
                // 刷新下载面板
                top.remove();
                // 释放bolb残留
                if (BLOD.bloburl.xml) {
                    window.URL.revokeObjectURL(BLOD.bloburl.xml);
                    BLOD.bloburl.xml = "";
                }
            }
            if (!BLOD.mdf.mp4 && !BLOD.mdf.flv && !BLOD.mdf.dash) return toast.warning("未找到任何视频链接 ಥ_ಥ");
            top = document.createElement("div");
            top.setAttribute("id", "bili-old-download-table");
            if (BLOD.mdf.mp4) this.addBox(top, BLOD.mdf.mp4, "mp4", "download-mp4");
            if (BLOD.mdf.dash) {
                if (BLOD.mdf.dash.avc) this.addBox(top, BLOD.mdf.dash.avc, "avc", "download-avc");
                if (BLOD.mdf.dash.hev) this.addBox(top, BLOD.mdf.dash.hev, "hev", "download-hev");
                if (BLOD.mdf.dash.aac) this.addBox(top, BLOD.mdf.dash.aac, "aac", "download-aac");
            }
            if (BLOD.mdf.flv) this.addBox(top, BLOD.mdf.flv, "flv", "download-flv");
            if (BLOD.mdf.xml) this.addBox(top, BLOD.mdf.xml, "其他", "download-xml", "360P");
            document.body.appendChild(top);
            toast.success("请右键复制下载或者右键IDM下载链接", "直接复制链接无效！", "直接左键点击无效！")
            top.onmouseover = () => window.clearTimeout(timer);
            top.onmouseout = () => {
                timer = window.setTimeout(() => {
                    top.remove();
                    if (BLOD.bloburl.xml) {
                        window.URL.revokeObjectURL(BLOD.bloburl.xml);
                        BLOD.bloburl.xml = "";
                    }
                }, 1000)
            }
        }
        /**
         * 读取远程数据
         * @param {Object[]} path 远程函数的json数组，第一个为mp4
         * @param {Object} qua 视频画质对照表
         * @param {Object} bps 音频音质对照表
         */
        quee(path, qua, bps) {
            if (path[0] && path[0].durl) {
                BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                BLOD.mdf.mp4.push(["1080P", path[0].durl[0].url.replace("http:", ""), BLOD.sizeFormat(path[0].durl[0].size), ".mp4"]);
            }
            if (path[1]) {
                for (let i = 1; i < path.length; i++) {
                    let data = path[i].data || (path[i].durl && path[i]) || path[i].result || {};
                    this.durl(data, qua);
                    this.dash(data, qua, bps);
                }
            }
        }
        /**
         * 读取DASH数据
         * @param {Object} path 原始json
         * @param {Object} qua 视频画质对照表
         * @param {Object} bps 音频音质对照表
         */
        dash(path, qua, bps) {
            if (!path.dash) return;
            BLOD.mdf.dash = BLOD.mdf.dash || {};
            if (path.dash.video) {
                for (let i = 0; i < path.dash.video.length; i++) {
                    if (path.dash.video[i].codecs.startsWith("avc")) {
                        BLOD.mdf.dash.avc = BLOD.mdf.dash.avc || [];
                        BLOD.mdf.dash.avc.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8), ".m4v"]);
                    } else {
                        BLOD.mdf.dash.hev = BLOD.mdf.dash.hev || [];
                        BLOD.mdf.dash.hev.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8), ".m4v"]);
                    }
                }
            }
            if (path.dash.audio) {
                for (let i = 0; i < path.dash.audio.length; i++) {
                    BLOD.mdf.dash.aac = BLOD.mdf.dash.aac || [];
                    BLOD.mdf.dash.aac.push([path.dash.audio[i].id, path.dash.audio[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.audio[i].bandwidth * path.dash.duration / 8), ".m4a"]);
                }
                BLOD.mdf.dash.aac = BLOD.bubbleSort(BLOD.mdf.dash.aac).reverse();
                for (let i = 0; i < BLOD.mdf.dash.aac.length; i++) if (BLOD.mdf.dash.aac[i][0] in bps) BLOD.mdf.dash.aac[i][0] = bps[BLOD.mdf.dash.aac[i][0]];
            }
        }
        /**
         * 读取flv数据，可能包含mp4
         * @param {Object} path 原始json
         * @param {Object} qua 画质对照表
         */
        durl(path, qua) {
            if (!path.durl) return;
            if (path.durl[0] && path.durl[0].url.includes("mp4?")) {
                BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                BLOD.mdf.mp4.push([qua[path.quality], path.durl[0].url.replace("http:", ""), BLOD.sizeFormat(path.durl[0].size), ".mp4"]);
            } else {
                BLOD.mdf.flv = [];
                for (let i = 0; i < path.durl.length; i++) BLOD.mdf.flv.push([qua[path.durl[i].url.match(/[0-9]+\.flv/)[0].split(".")[0]], path.durl[i].url.replace("http:", ""), BLOD.sizeFormat(path.durl[i].size), ".flv"]);
            }
        }
        /**
         * 读取其他数据：如弹幕、字幕、封面...
         */
        other() {
            if (!BLOD.config.reset.dlother) return;
            BLOD.mdf.xml = [];
            if (BLOD.xml) {
                let blob = new Blob([BLOD.xml]);
                BLOD.bloburl.xml = URL.createObjectURL(blob);
                BLOD.mdf.xml.push(["弹幕", BLOD.bloburl.xml, BLOD.sizeFormat(blob.size), ".xml"]);
            } else {
                BLOD.mdf.xml.push(["弹幕", "//api.bilibili.com/x/v1/dm/list.so?oid=" + BLOD.cid, "--------", ".xml"]);
            }
            if (BLOD.__INITIAL_STATE__) {
                BLOD.mdf.xml.push(["封面", (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.pic || BLOD.__INITIAL_STATE__.mediaInfo.cover).replace("http:", ""), "--------", ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover.replace("http:", ""), "--------", ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.specialCover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.specialCover.replace("http:", ""), "--------"], ".jpg");
                if (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.subtitle && BLOD.__INITIAL_STATE__.videoData.subtitle.list) for (let i = 0; i < BLOD.__INITIAL_STATE__.videoData.subtitle.list.length; i++) BLOD.mdf.xml.push([BLOD.__INITIAL_STATE__.videoData.subtitle.list[i].lan_doc, BLOD.__INITIAL_STATE__.videoData.subtitle.list[i].subtitle_url.replace("http:", ""), "--------", ".json"]);
            }
        }
        /**
         * 获取在线数据
         * @param  {...any} arg 直接传递给this.playurl
         */
        async geturl(...arg) {
            let url = await this.playurl(...arg);
            try {
                if (!url) throw url;
                let data = await BLOD.xhr.GM(url);
                return BLOD.jsonCheck(data);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; BLOD.debug.error("下载拉取", ...e); }
        }
        /**
         * 构造在线数据url
         * @param {string} [type = mp4 | flv | dash | off] 视频格式
         * @param {number} [qn] 画质参数
         */
        async playurl(type, qn) {
            BLOD.aid = BLOD.aid || window.aid;
            BLOD.cid = BLOD.cid || window.cid;
            qn = qn || 120;
            type = type || "mp4";
            if (!BLOD.cid) return;
            switch (type) {
                case 'dash': if (BLOD.pgc) return BLOD.objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80 });
                else return BLOD.objUrl("https://api.bilibili.com/x/player/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80 });
                    break;
                case 'flv': if (BLOD.pgc) return BLOD.objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json' });
                else return BLOD.objUrl("https://api.bilibili.com/x/player/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json' });
                    break;
                case 'off': return BLOD.urlSign("https://interface.bilibili.com/v2/playurl", { cid: BLOD.cid, otype: 'json', qn: qn, quality: qn, type: '' });
                    break;
                case 'mp4': if (BLOD.pgc) return BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurlproj", { cid: BLOD.cid, otype: 'json', platform: 'android_i', qn: 208 });
                    return BLOD.urlSign("https://app.bilibili.com/v2/playurlproj", { cid: BLOD.cid, otype: 'json', platform: 'android_i', qn: 208 });
                    break;
            }
        }
        /**
         * 绘制下载面板项目
         * @param {HTMLElement} top 下载面板节点
         * @param {object} item 文件类型原始数据
         * @param {string} name 文件类型显示名称
         * @param {string} type 文件类型：className
         * @param {string} [quatily] 指定文件档次：影响该文件样式颜色
         */
        addBox(top, item, name, type, quatily) {
            let qua = quatily;
            let box = document.createElement("div");
            box.setAttribute("class", "download-box");
            box.innerHTML = '<div class="download-type ' + type + '">' + name + '</div>';
            top.appendChild(box);
            item.forEach(d => {
                switch (qua || d[0]) {
                    case "HDR": quatily = "quality-tops"; break;
                    case "4K": quatily = "quality-top"; break;
                    case "1080P60": quatily = "quality-highs"; break;
                    case "720P60": quatily = "quality-high"; break;
                    case "1080P+": quatily = "quality-1080ps"; break;
                    case "1080P": quatily = "quality-1080p"; break;
                    case "720P": quatily = "quality-720p"; break;
                    case "480P": quatily = "quality-480p"; break;
                    case "360P": quatily = "quality-360p"; break;
                    case "320kbps": quatily = "quality-720p"; break;
                    case "128kbps": quatily = "quality-480p"; break;
                    case "64kbps": quatily = "quality-360p"; break;
                    default: quatily = "quality-high";
                }
                box.innerHTML += '<a download="'
                    + "av" + BLOD.aid + d[3] +
                    '" href="' + d[1] +
                    '" target="_blank"><div class="download-quality ' + quatily +
                    '">' + d[0] + '</div><div class="download-size">' + d[2] + '</div></a>';
            })
        }
    }

    const exports = () => {
        let download = new Download();
        let makeExports = (type) => {
            return (...msg) => {
                return download[type](...msg);
            }
        }
        let method = makeExports("setTable");
        method.init = makeExports("init");
        return method;
    }

    BLOD.download = exports();
})()