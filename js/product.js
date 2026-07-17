// product.js — 植格产品详情页渲染
(async function() {
    const container = document.getElementById('product-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) {
        container.innerHTML = '<p style="text-align:center;color:var(--muted);margin-top:4rem;">缺少产品ID参数。<br><a href="index.html">← 返回产品目录</a></p>';
        return;
    }

    try {
        const resp = await fetch('data/products.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const products = await resp.json();

        const product = products.find(p => p.id === decodeURIComponent(productId));
        if (!product) {
            container.innerHTML = `<p style="text-align:center;color:var(--muted);margin-top:4rem;">未找到产品：${productId}<br><a href="index.html">← 返回产品目录</a></p>`;
            return;
        }

        renderProduct(product, container);

    } catch (err) {
        console.error('加载产品详情失败:', err);
        container.innerHTML = '<p style="text-align:center;color:var(--muted);margin-top:4rem;">数据加载失败。<br><a href="index.html">← 返回产品目录</a></p>';
    }
})();

function renderProduct(product, container) {
    const priceClass = product.price === 100 ? 'price-entry' : 'price-premium';
    const isEntry = product.price === 100;

    // 授权方式说明
    const licenseHTML = `
        <div class="license-detail">
            <p><strong>授权方式：独占授权（卖断）</strong></p>
            <p>植格依据《著作权法》保留全部著作人身权，包括但不限于署名权、保护作品完整权。买方获得该产区该作物参数的永久独占使用权，可自行集成、商用、或基于参数进行衍生开发。植格始终是参数的创作者，这一点不随交易而改变。</p>
        </div>
    `;

    // 构建回测数据卡片
    let backtestHTML = '';
    if (product.strategy) {
        const s = product.strategy;
        const rows = [
            ['追肥策略', s.fertilizer],
            ['灌溉策略', s.irrigation],
            ['完熟率', s.maturity_rate],
            ['亩成本', s.cost_per_mu],
            ['约束条件', s.constraint]
        ].filter(([, val]) => val);

        if (rows.length > 0) {
            backtestHTML = `
                <div class="data-card">
                    <h4>回测对比数据</h4>
                    <div class="data-grid">
                        ${rows.map(([label, val]) => `
                            <div class="data-item">
                                <div class="data-value">${val}</div>
                                <div class="data-label">${label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // 构建说明书下载区域
    let manualHTML = '';
    if (product.manual_file) {
        manualHTML = `
            <div class="manual-download">
                <a href="products_data/${encodeURIComponent(product.folder)}/${encodeURIComponent(product.manual_file)}" class="btn-download" download>
                    下载产品说明书
                </a>
                <p style="font-size:0.8rem;color:var(--light-muted);margin-top:0.5rem;">
                    说明书包含：生成条件、适用场景、验证记录、使用效果、禁忌边界
                </p>
            </div>
        `;
    }

    // 构建底部操作区
    let actionHTML = '';
    if (isEntry) {
        let downloadUrl = '';
        if (product.id === '玉米_haerbin') {
            downloadUrl = 'downloads/哈尔滨玉米参数包/backtest_corn.zip';
        } else if (product.id === '小蓬草_erigeron') {
            downloadUrl = 'downloads/小蓬草参数/best_genome_erigeron.zip';
        } else {
            downloadUrl = '#';
        }

        actionHTML = `
            <div class="auction-section">
                <h3>获取此参数包</h3>
                <p>${product.crop} · ${product.region_cn}</p>
                <p class="price-large ${priceClass}">${product.price_label}</p>
                <a href="${downloadUrl}" class="btn-auction" download>
                    购买并下载
                </a>
            </div>
        `;
    } else {
        actionHTML = `
            <div class="auction-section">
                <h3>申请竞拍资格</h3>
                <p>${product.crop} · ${product.region_cn}</p>
                <p class="price-large ${priceClass}">${product.price_label}</p>
                <p style="font-size:0.85rem;color:var(--muted);">独占授权（卖断）· 价高者得 · 植格保留最终决定权</p>
                <a href="auction.html?id=${encodeURIComponent(product.id)}" class="btn-auction">
                    申请竞拍资格 →
                </a>
            </div>
        `;
    }

    container.innerHTML = `
        <a href="index.html" class="back-link">← 返回产品目录</a>

        <div class="product-header">
            <h2>${product.crop} · ${product.region_cn}</h2>
            <p class="meta">${product.crop} — ${product.region_cn}产区</p>
        </div>

        ${licenseHTML}

        ${backtestHTML}

        ${manualHTML}

        ${actionHTML}
    `;
}