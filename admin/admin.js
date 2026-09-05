
const PRODUCTS_KEY='knoovi_products_v1', BANNERS_KEY='knoovi_banners_v1', ORDERS_KEY='knoovi_orders_v1', COUPONS_KEY='knoovi_coupons_v1', SETTINGS_KEY='knoovi_settings_v1';
const seedProducts = [
{id:1,name:'Crochet Tulip',category:'Crochet Flowers',price:449,rating:4.8,reviews:126,colors:['Blush','Sage','Cream'],icon:'tulip',desc:'A single hand-stitched tulip.',personalizable:false,sizes:null,newIn:false,stock:20,image:''},
{id:2,name:'Crochet Bouquet',category:'Crochet Flowers',price:1299,rating:4.9,reviews:88,colors:['Blush','Beige'],icon:'bouquet',desc:'A forever bouquet of five hand-crocheted blooms.',personalizable:false,sizes:null,newIn:true,stock:10,image:''},
{id:3,name:'Mini Flower Charm',category:'Charms',price:199,rating:4.7,reviews:210,colors:['Blush','Sage','Beige'],icon:'charmflower',desc:'A tiny crochet flower charm.',personalizable:false,sizes:null,newIn:false,stock:25,image:''},
{id:4,name:'Crochet Heart',category:'Cozy Things',price:349,rating:4.9,reviews:154,colors:['Blush','Cocoa'],icon:'heart',desc:'A soft, huggable little heart.',personalizable:false,sizes:null,newIn:false,stock:18,image:''},
{id:5,name:'Cozy Handmade Sweater',category:'Sweaters',price:2899,rating:4.6,reviews:64,colors:['Sage','Beige','Cocoa'],icon:'sweater',desc:'A hand-knit sweater.',personalizable:false,sizes:['S','M','L','XL'],newIn:false,stock:6,image:''},
{id:6,name:'Personalized Crochet Gift',category:'Gift Sets',price:1599,rating:5,reviews:41,colors:['Blush','Sage'],icon:'giftname',desc:'A made-for-them keepsake.',personalizable:true,sizes:null,newIn:true,stock:12,image:''},
{id:7,name:'Mini Gift Box',category:'Gift Sets',price:799,rating:4.8,reviews:97,colors:['Cream','Beige'],icon:'box',desc:'A curated little box of cozy things.',personalizable:false,sizes:null,newIn:false,stock:14,image:''},
{id:8,name:'Handmade Keychain',category:'Charms',price:249,rating:4.7,reviews:133,colors:['Blush','Sage','Beige'],icon:'keychain',desc:'A small everyday charm.',personalizable:false,sizes:null,newIn:false,stock:30,image:''}
];
function read(k,f=[]){try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function products(){let p=read(PRODUCTS_KEY);if(!p.length){p=seedProducts;write(PRODUCTS_KEY,p)}return p}
function money(n){return '₹'+Number(n||0).toLocaleString('en-IN')}
function show(view){
 document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById(view).classList.add('active');
 document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
 document.getElementById('pageTitle').textContent=view==='banners'?'Offer Banners':view[0].toUpperCase()+view.slice(1);
 ({dashboard:renderDashboard,products:renderProducts,orders:renderOrders,banners:renderBanners,coupons:renderCoupons,settings:renderSettings}[view])();
}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>show(b.dataset.view));
function renderDashboard(){
 const ps=products(), os=read(ORDERS_KEY);
 document.getElementById('dashboard').innerHTML=`<div class="grid">
 <div class="card"><div class="muted">Products</div><div class="metric">${ps.length}</div></div>
 <div class="card"><div class="muted">Orders</div><div class="metric">${os.length}</div></div>
 <div class="card"><div class="muted">Revenue</div><div class="metric">${money(os.reduce((s,o)=>s+Number(o.total||0),0))}</div></div>
 <div class="card"><div class="muted">Low stock</div><div class="metric">${ps.filter(p=>Number(p.stock||0)<=5).length}</div></div></div>
 <div class="table-wrap" style="margin-top:18px"><h2>Quick actions</h2><p class="muted">Manage everything from Products, Orders, Offers and Settings.</p>
 <button class="primary" onclick="show('products')">Manage Products</button> <button class="ghost" onclick="show('banners')">Manage Offers</button></div>`;
}
function renderProducts(){
 const ps=products();
 document.getElementById('products').innerHTML=`<div class="toolbar"><div class="muted">${ps.length} products</div><button class="primary" onclick="editProduct()">+ Add Product</button></div>
 <div class="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>
 ${ps.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td>${p.stock??0}</td><td>${p.newIn?'<span class="pill">New</span>':''}</td><td><div class="actions"><button class="ghost" onclick="editProduct(${p.id})">Edit</button><button class="danger" onclick="delProduct(${p.id})">Delete</button></div></td></tr>`).join('')}</tbody></table></div>`;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function editProduct(id){
 const p=id?products().find(x=>x.id===id):{id:Date.now(),name:'',category:'Crochet Flowers',price:0,rating:5,reviews:0,colors:['Blush'],icon:'heart',desc:'',personalizable:false,sizes:null,newIn:false,stock:0,image:''};
 document.getElementById('modalBody').innerHTML=`<h2>${id?'Edit':'Add'} Product</h2><br><div class="form">
 <label>Name<input id="fName" value="${esc(p.name)}"></label><div class="two"><label>Price<input id="fPrice" type="number" value="${p.price}"></label><label>Stock<input id="fStock" type="number" value="${p.stock??0}"></label></div>
 <label>Category<input id="fCat" value="${esc(p.category)}"></label><label>Description<textarea id="fDesc">${esc(p.desc)}</textarea></label>
 <label>Image URL (or use a hosted image)<input id="fImage" value="${esc(p.image||'')}"></label>
 <label class="check"><input id="fNew" type="checkbox" ${p.newIn?'checked':''}> New Arrival</label>
 <label class="check"><input id="fPersonal" type="checkbox" ${p.personalizable?'checked':''}> Personalizable</label>
 <button class="primary" onclick="saveProduct(${p.id})">Save Product</button></div>`;
 document.getElementById('modal').classList.remove('hidden');
}
function saveProduct(id){
 let ps=products(), i=ps.findIndex(p=>p.id===id);
 const old=i>=0?ps[i]:{};
 const p={...old,id,name:document.getElementById('fName').value.trim(),category:document.getElementById('fCat').value.trim(),price:Number(document.getElementById('fPrice').value||0),stock:Number(document.getElementById('fStock').value||0),desc:document.getElementById('fDesc').value,image:document.getElementById('fImage').value,newIn:document.getElementById('fNew').checked,personalizable:document.getElementById('fPersonal').checked,colors:old.colors||['Blush'],icon:old.icon||'heart',rating:old.rating||5,reviews:old.reviews||0};
 if(i>=0)ps[i]=p;else ps.push(p);write(PRODUCTS_KEY,ps);closeModal();renderProducts();
}
function delProduct(id){if(confirm('Delete this product?')){write(PRODUCTS_KEY,products().filter(p=>p.id!==id));renderProducts()}}
function renderOrders(){
 const os=read(ORDERS_KEY);
 document.getElementById('orders').innerHTML=`<div class="table-wrap"><h2>Orders</h2><p class="muted">Orders saved by the storefront/demo backend appear here.</p><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${os.length?os.map((o,i)=>`<tr><td><b>${esc(o.id||'Order')}</b></td><td>${esc(o.customer||o.name||'Customer')}</td><td>${money(o.total)}</td><td><span class="pill">${esc(o.status||'New')}</span></td><td><select onchange="setOrderStatus(${i},this.value)">${['New','Confirmed','Packed','Shipped','Delivered','Cancelled'].map(s=>`<option ${s===(o.status||'New')?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join(''):'<tr><td colspan="5">No orders yet.</td></tr>'}</tbody></table></div>`;
}
function setOrderStatus(i,s){let os=read(ORDERS_KEY);os[i].status=s;write(ORDERS_KEY,os);renderOrders()}
function renderBanners(){
 const bs=read(BANNERS_KEY);
 document.getElementById('banners').innerHTML=`<div class="toolbar"><div class="muted">${bs.length} banners</div><button class="primary" onclick="editBanner()">+ Add Banner</button></div>${bs.map((b,i)=>`<div class="banner"><div><b>${esc(b.title)}</b><div class="muted">${esc(b.subtitle||'')} ${b.code?'· Code: '+esc(b.code):''}</div></div><div class="actions"><label class="switch"><input type="checkbox" ${b.active?'checked':''} onchange="toggleBanner(${i},this.checked)"> Active</label><button class="ghost" onclick="editBanner(${i})">Edit</button><button class="danger" onclick="delBanner(${i})">Delete</button></div></div>`).join('')}`;
}
function editBanner(i){
 const b=i!==undefined?read(BANNERS_KEY)[i]:{title:'',subtitle:'',code:'',active:true};
 document.getElementById('modalBody').innerHTML=`<h2>Offer Banner</h2><br><div class="form"><label>Title<input id="bTitle" value="${esc(b.title)}"></label><label>Subtitle<input id="bSub" value="${esc(b.subtitle||'')}"></label><label>Coupon Code<input id="bCode" value="${esc(b.code||'')}"></label><label class="check"><input id="bActive" type="checkbox" ${b.active?'checked':''}> Active</label><button class="primary" onclick="saveBanner(${i===undefined?-1:i})">Save Banner</button></div>`;
 document.getElementById('modal').classList.remove('hidden');
}
function saveBanner(i){let bs=read(BANNERS_KEY);const b={title:bTitle.value,subtitle:bSub.value,code:bCode.value,active:bActive.checked};if(i<0)bs.push(b);else bs[i]=b;if(b.active)bs=bs.map((x,j)=>({...x,active:j===(i<0?bs.length-1:i)}));write(BANNERS_KEY,bs);closeModal();renderBanners()}
function toggleBanner(i,v){let bs=read(BANNERS_KEY);bs=bs.map((b,j)=>({...b,active:v?j===i:false}));write(BANNERS_KEY,bs);renderBanners()}
function delBanner(i){if(confirm('Delete banner?')){let bs=read(BANNERS_KEY);bs.splice(i,1);write(BANNERS_KEY,bs);renderBanners()}}
function renderCoupons(){
 const cs=read(COUPONS_KEY);
 document.getElementById('coupons').innerHTML=`<div class="toolbar"><div class="muted">${cs.length} coupons</div><button class="primary" onclick="editCoupon()">+ Add Coupon</button></div><div class="table-wrap"><table><thead><tr><th>Code</th><th>Discount</th><th>Minimum</th><th>Active</th><th></th></tr></thead><tbody>${cs.map((c,i)=>`<tr><td><b>${esc(c.code)}</b></td><td>${c.type==='percent'?c.value+'%':money(c.value)}</td><td>${money(c.min)}</td><td>${c.active?'Yes':'No'}</td><td><button class="danger" onclick="delCoupon(${i})">Delete</button></td></tr>`).join('')||'<tr><td colspan="5">No coupons yet.</td></tr>'}</tbody></table></div>`;
}
function editCoupon(){
 document.getElementById('modalBody').innerHTML=`<h2>Add Coupon</h2><br><div class="form"><label>Code<input id="cCode"></label><div class="two"><label>Discount Type<select id="cType"><option value="percent">Percentage</option><option value="fixed">Fixed ₹</option></select></label><label>Value<input id="cValue" type="number"></label></div><label>Minimum Order<input id="cMin" type="number" value="0"></label><label class="check"><input id="cActive" type="checkbox" checked> Active</label><button class="primary" onclick="saveCoupon()">Save Coupon</button></div>`;
 document.getElementById('modal').classList.remove('hidden');
}
function saveCoupon(){let cs=read(COUPONS_KEY);cs.push({code:cCode.value.trim().toUpperCase(),type:cType.value,value:Number(cValue.value),min:Number(cMin.value),active:cActive.checked});write(COUPONS_KEY,cs);closeModal();renderCoupons()}
function delCoupon(i){let cs=read(COUPONS_KEY);cs.splice(i,1);write(COUPONS_KEY,cs);renderCoupons()}
function renderSettings(){
 const s=read(SETTINGS_KEY,{instagram:'knoovi.in',whatsapp:'',email:'',shipping:59,freeShipping:999,announcement:''});
 document.getElementById('settings').innerHTML=`<div class="card"><h2>Website Settings</h2><br><div class="form"><label>Instagram Handle<input id="sInsta" value="${esc(s.instagram)}"></label><label>WhatsApp Number<input id="sWa" value="${esc(s.whatsapp)}"></label><label>Email<input id="sEmail" value="${esc(s.email)}"></label><div class="two"><label>Shipping ₹<input id="sShip" type="number" value="${s.shipping}"></label><label>Free Shipping Above ₹<input id="sFree" type="number" value="${s.freeShipping}"></label></div><label>Announcement Bar<input id="sAnn" value="${esc(s.announcement)}"></label><button class="primary" onclick="saveSettings()">Save Settings</button></div></div>`;
}
function saveSettings(){write(SETTINGS_KEY,{instagram:sInsta.value,whatsapp:sWa.value,email:sEmail.value,shipping:Number(sShip.value),freeShipping:Number(sFree.value),announcement:sAnn.value});alert('Settings saved')}
function closeModal(){document.getElementById('modal').classList.add('hidden')}
function exportData(){const d={products:products(),banners:read(BANNERS_KEY),orders:read(ORDERS_KEY),coupons:read(COUPONS_KEY),settings:read(SETTINGS_KEY)};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));a.download='knoovi-backup.json';a.click()}
show('dashboard');
