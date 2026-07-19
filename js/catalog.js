// catalog.js — 植格物种目录渲染
(async function() {
    const container = document.getElementById('catalog-content');
    if (!container) return;

    try {
        const resp = await fetch('data/products.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const products = await resp.json();

        if (!products.length) {
            container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:3rem;">产品目录即将上线，敬请期待。</p>';
            return;
        }

        renderCatalog(products, container);

    } catch (err) {
        console.error('加载产品数据失败:', err);
        container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:3rem;">产品数据加载失败。</p>';
    }
})();

function renderCatalog(products, container) {
    // 三大分类定义
    const categories = [
        {
            id: 'crop',
            icon: '🌾',
            name: '作物',
            description: '人类主食与经济作物'
        },
        {
            id: 'groundcover',
            icon: '🌿',
            name: '地被',
            description: '草本与入侵物种，引擎泛化能力的证明'
        },
        {
            id: 'other',
            icon: '🌳',
            name: '其他',
            description: '未来物种的栖息地'
        }
    ];

    // 物种分组定义（仅用于"作物"分类下的子分组）
    const speciesOrder = ['冬小麦', '玉米', '大豆', '花生', '水稻'];

    let html = '';

    categories.forEach(cat => {
        // 筛选该分类下的所有产品
        let catProducts = [];
        if (cat.id === 'crop') {
            catProducts = products.filter(p => ['冬小麦', '玉米', '大豆', '花生', '水稻'].includes(p.crop));
        } else if (cat.id === 'groundcover') {
            catProducts = products.filter(p => p.crop === '小蓬草');
        } else {
            // "其他"分类目前没有产品
            catProducts = [];
        }

        const availableCount = catProducts.filter(p => !p.sold).length;
        const soldCount = catProducts.filter(p => p.sold).length;

        html += `
            <section class="catalog-category">
                <div class="category-header">
                    <span class="category-icon">${cat.icon}</span>
                    <span class="category-name">${cat.name}</span>
                    <span class="category-count">${availableCount} 个可购${soldCount > 0 ? ` · ${soldCount} 已售` : ''}</span>
                </div>
        `;

        if (cat.id === 'crop') {
            // 作物分类：按物种分组展示
            speciesOrder.forEach(species => {
                const speciesProducts = catProducts.filter(p => p.crop === species);
                if (speciesProducts.length === 0) return;

                html += `
                    <div class="species-group">
                        <div class="species-group-title">${species}</div>
                        <div class="product-grid">
                            ${speciesProducts.map(p => renderProductCard(p)).join('')}
                        </div>
                    </div>
                `;
            });
        } else if (catProducts.length > 0) {
            // 地被分类：直接平铺
            html += `
                <div class="species-group">
                    <div class="product-grid">
                        ${catProducts.map(p => renderProductCard(p)).join('')}
                    </div>
                </div>
            `;
        } else {
            // 空分类（如"其他"）
            html += `
                <div class="species-group">
                    <p style="font-size:0.85rem;color:#c5c0b8;padding:1rem 0.3rem;letter-spacing:0.5px;">
                        — 暂无已发布参数包 —
                    </p>
                </div>
            `;
        }

        html += `</section>`;
    });

    // 底部声明
    html += `
        <p style="text-align:center;font-size:0.75rem;color:#c5c0b8;margin-top:3rem;letter-spacing:1px;">
            更多物种正在求解中
        </p>
    `;

    container.innerHTML = html;
}

function renderProductCard(product) {
    const isSold = product.sold === true;
    const isEntry = product.price === 100;
    
    const soldClass = isSold ? ' sold' : '';
    const priceClass = isEntry ? ' entry' : '';
    const priceLabel = isSold ? '已售出' : product.price_label;
    const targetUrl = isSold ? '#' : `product-detail.html?id=${encodeURIComponent(product.id)}`;

    return `
        <a href="${targetUrl}" class="product-card${soldClass}" ${isSold ? 'aria-disabled="true"' : ''}>
            <span class="card-crop-hint">${product.crop}</span>
            <span class="card-region">${product.region_cn}</span>
            <span class="card-price${priceClass}">${priceLabel}</span>
            ${isSold ? '<span class="card-status">已售出</span>' : '<span class="card-arrow">→</span>'}
        </a>
    `;
}