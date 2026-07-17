// main.js — 植格首页产品卡片渲染
(async function() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    try {
        const resp = await fetch('data/products.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const products = await resp.json();

        if (!products.length) {
            grid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;">产品目录即将上线，敬请期待。</p>';
            return;
        }

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card';

            // 100元门槛产品加特殊样式
            if (p.price === 100) {
                card.classList.add('free-product');
            }

            const priceClass = p.price === 100 ? 'price-entry' : 'price-premium';

            card.innerHTML = `
                <h3>${p.crop} · ${p.region_cn}</h3>
                <p class="region">${p.crop} — ${p.region_cn}产区</p>
                <p class="attr-count">${p.attr_count}维属性参数</p>
                <p class="price-tag ${priceClass}">${p.price_label}</p>
                <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn-detail">查看参数 →</a>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error('加载产品数据失败:', err);
        grid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;">产品数据加载中，请确认 data/products.json 存在。</p>';
    }
})();