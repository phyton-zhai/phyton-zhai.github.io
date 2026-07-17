// map.js — 植格导航下拉菜单 + 产品数据加载
(async function() {
    try {
        const resp = await fetch('data/products.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const products = await resp.json();

        const dropdown = document.getElementById('productDropdown');
        if (!dropdown) return;

        // 按作物分组
        const groups = {};
        const cropOrder = ['冬小麦', '玉米', '大豆', '花生', '水稻', '小蓬草'];

        products.forEach(p => {
            if (!groups[p.crop]) groups[p.crop] = [];
            groups[p.crop].push(p);
        });

        let html = '<div class="dropdown-inner">';
        cropOrder.forEach(crop => {
            if (groups[crop]) {
                html += `<div class="dropdown-group"><div class="dropdown-group-title">${crop}</div>`;
                groups[crop].forEach(p => {
                    // 不显示具体价格，只标"定向竞拍"或"¥100"
                    const hint = p.price === 100 ? '¥100' : '定向竞拍';
                    html += `<a href="product.html?id=${encodeURIComponent(p.id)}" class="dropdown-item">${p.region_cn} <span class="price-hint">${hint}</span></a>`;
                });
                html += '</div>';
            }
        });
        html += '</div>';
        dropdown.innerHTML = html;

    } catch (err) {
        console.error('加载产品数据失败:', err);
        const dropdown = document.getElementById('productDropdown');
        if (dropdown) {
            dropdown.innerHTML = '<div class="dropdown-inner"><p style="color:var(--muted);text-align:center;padding:1rem;">产品数据加载失败</p></div>';
        }
    }
})();